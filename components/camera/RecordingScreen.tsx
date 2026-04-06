import { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { CameraView, useCameraPermissions, useMicrophonePermissions } from 'expo-camera';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppStore } from '@/store/useAppStore';
import { uploadVideo } from '@/firebase/storage';
import { createPost, markPostedToday } from '@/firebase/firestore';
import { getTodayDateStr } from '@/utils/date';
import { CountdownTimer } from './CountdownTimer';
import { COLORS, MAX_RECORDING_ATTEMPTS, MAX_VIDEO_DURATION_SECONDS } from '@/constants';

interface Props {
  onClose: () => void;
}

type Stage = 'idle' | 'countdown' | 'recording' | 'uploading' | 'done';

export function RecordingScreen({ onClose }: Props) {
  const [cameraPermission, requestCamera] = useCameraPermissions();
  const [micPermission, requestMic] = useMicrophonePermissions();
  const [stage, setStage] = useState<Stage>('idle');
  const [attempts, setAttempts] = useState(0);
  const [uploadPct, setUploadPct] = useState(0);
  const [facing, setFacing] = useState<'front' | 'back'>('front');
  const cameraRef = useRef<CameraView>(null);
  const { user, setHasPostedToday } = useAppStore();

  useEffect(() => {
    if (!cameraPermission?.granted) requestCamera();
    if (!micPermission?.granted) requestMic();
  }, []);

  async function startCountdown() {
    setStage('countdown');
  }

  async function onCountdownComplete() {
    setStage('recording');
    try {
      const result = await cameraRef.current?.recordAsync({
        maxDuration: MAX_VIDEO_DURATION_SECONDS,
      });
      if (result?.uri) {
        handleVideoReady(result.uri);
      }
    } catch {
      setStage('idle');
    }
  }

  function stopRecording() {
    cameraRef.current?.stopRecording();
  }

  function handleVideoReady(uri: string) {
    const newAttempts = attempts + 1;
    setAttempts(newAttempts);
    const remaining = MAX_RECORDING_ATTEMPTS - newAttempts;

    if (remaining === 0) {
      // Last attempt — no choice, must post
      uploadAndSubmit(uri);
      return;
    }

    Alert.alert(
      'Use this take?',
      `${remaining} attempt${remaining !== 1 ? 's' : ''} remaining`,
      [
        { text: 'Retake', style: 'cancel', onPress: () => setStage('idle') },
        { text: 'Post it', onPress: () => uploadAndSubmit(uri) },
      ]
    );
  }

  async function uploadAndSubmit(uri: string) {
    if (!user) return;
    setStage('uploading');
    try {
      const videoUrl = await uploadVideo(user.uid, uri, setUploadPct);
      const dateStr = getTodayDateStr();
      await createPost({
        userId: user.uid,
        userDisplayName: user.displayName,
        userUsername: user.username,
        challengeDate: dateStr,
        videoUrl,
        thumbnailUrl: '',
      });
      await markPostedToday(user.uid, dateStr);
      setHasPostedToday(true);
      setStage('done');
      setTimeout(onClose, 1500);
    } catch (e: any) {
      Alert.alert('Upload failed', e.message);
      setStage('idle');
    }
  }

  if (!cameraPermission?.granted || !micPermission?.granted) {
    return (
      <SafeAreaView style={styles.permissionScreen}>
        <Text style={styles.permissionText}>
          Camera and microphone access is required to record.
        </Text>
        <TouchableOpacity
          style={styles.permissionButton}
          onPress={() => { requestCamera(); requestMic(); }}
        >
          <Text style={styles.permissionButtonText}>Grant access</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const attemptsLeft = MAX_RECORDING_ATTEMPTS - attempts;

  return (
    <View style={styles.container}>
      <CameraView
        ref={cameraRef}
        style={styles.camera}
        facing={facing}
        mode="video"
      >
        {stage === 'countdown' && (
          <CountdownTimer seconds={3} onComplete={onCountdownComplete} />
        )}

        {stage === 'recording' && (
          <View style={styles.recIndicator}>
            <View style={styles.recDot} />
            <Text style={styles.recText}>REC</Text>
          </View>
        )}

        {(stage === 'uploading' || stage === 'done') && (
          <View style={styles.overlay}>
            <Text style={styles.overlayText}>
              {stage === 'done' ? 'Posted!' : `Uploading… ${Math.round(uploadPct)}%`}
            </Text>
          </View>
        )}
      </CameraView>

      <SafeAreaView style={styles.controls} edges={['bottom']}>
        <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
          <Text style={styles.closeBtnText}>✕</Text>
        </TouchableOpacity>

        {stage === 'idle' && (
          <>
            <TouchableOpacity style={styles.recordBtn} onPress={startCountdown}>
              <View style={styles.recordBtnCore} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.flipBtn}
              onPress={() => setFacing((f) => (f === 'front' ? 'back' : 'front'))}
            >
              <Text style={styles.flipBtnText}>flip</Text>
            </TouchableOpacity>
          </>
        )}

        {stage === 'recording' && (
          <>
            <View style={styles.spacer} />
            <TouchableOpacity style={styles.stopBtn} onPress={stopRecording}>
              <View style={styles.stopBtnCore} />
            </TouchableOpacity>
            <View style={styles.spacer} />
          </>
        )}

        <Text style={styles.attemptsLeft}>
          {attemptsLeft} attempt{attemptsLeft !== 1 ? 's' : ''} left
        </Text>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.black },
  camera: { flex: 1 },
  permissionScreen: {
    flex: 1,
    backgroundColor: COLORS.black,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  permissionText: {
    color: COLORS.white,
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  permissionButton: {
    backgroundColor: COLORS.accent,
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    width: '100%',
  },
  permissionButtonText: { color: COLORS.white, fontSize: 16, fontWeight: '700' },
  recIndicator: {
    position: 'absolute',
    top: 60,
    left: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(0,0,0,0.4)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  recDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.accent,
  },
  recText: { color: COLORS.white, fontSize: 12, fontWeight: '700' },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.65)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlayText: { color: COLORS.white, fontSize: 22, fontWeight: '700' },
  controls: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 32,
    paddingBottom: 8,
  },
  closeBtn: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeBtnText: { color: COLORS.white, fontSize: 22 },
  recordBtn: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 4,
    borderColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  recordBtnCore: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: COLORS.accent,
  },
  stopBtn: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 4,
    borderColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stopBtnCore: {
    width: 28,
    height: 28,
    borderRadius: 4,
    backgroundColor: COLORS.accent,
  },
  flipBtn: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  flipBtnText: { color: COLORS.white, fontSize: 13 },
  spacer: { width: 44 },
  attemptsLeft: {
    position: 'absolute',
    top: -28,
    left: 0,
    right: 0,
    textAlign: 'center',
    color: COLORS.gray[300],
    fontSize: 12,
  },
});
