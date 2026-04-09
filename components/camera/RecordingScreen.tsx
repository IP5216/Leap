import { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { CameraView, useCameraPermissions, useMicrophonePermissions } from 'expo-camera';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
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
  const todayChallenge = useAppStore((s) => s.todayChallenge);

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
  const challengeTitle = todayChallenge?.title ?? "Today's challenge";

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

      <SafeAreaView style={styles.topBar} edges={['top']}>
        <TouchableOpacity style={styles.iconBtn} onPress={onClose}>
          <Ionicons name="close" size={22} color={COLORS.white} />
        </TouchableOpacity>

        <View style={styles.promptPill}>
          <Text style={styles.promptText} numberOfLines={1}>{challengeTitle}</Text>
        </View>

        <TouchableOpacity
          style={styles.iconBtn}
          onPress={() => setFacing((f) => (f === 'front' ? 'back' : 'front'))}
        >
          <Ionicons name="camera-reverse-outline" size={22} color={COLORS.white} />
        </TouchableOpacity>
      </SafeAreaView>

      <SafeAreaView style={styles.bottomBar} edges={['bottom']}>
        <Text style={styles.attemptsLeft}>
          {MAX_VIDEO_DURATION_SECONDS}S MAX · {attemptsLeft} ATTEMPT{attemptsLeft !== 1 ? 'S' : ''} LEFT
        </Text>

        {stage === 'idle' && (
          <TouchableOpacity style={styles.recordBtn} onPress={startCountdown} activeOpacity={0.8}>
            <View style={styles.recordBtnInner} />
          </TouchableOpacity>
        )}

        {stage === 'recording' && (
          <TouchableOpacity style={styles.recordBtn} onPress={stopRecording} activeOpacity={0.8}>
            <View style={styles.stopBtnInner} />
          </TouchableOpacity>
        )}

        {stage === 'idle' && (
          <Text style={styles.tapLabel}>TAP TO RECORD</Text>
        )}
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
    borderRadius: 30,
    padding: 16,
    alignItems: 'center',
    width: '100%',
  },
  permissionButtonText: { color: COLORS.white, fontSize: 15, fontWeight: '700' },
  topBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 8,
    gap: 12,
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  promptPill: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  promptText: {
    color: COLORS.white,
    fontSize: 13,
    fontWeight: '700',
    textAlign: 'center',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingBottom: 16,
  },
  attemptsLeft: {
    color: COLORS.gray[300],
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.2,
    marginBottom: 16,
  },
  recordBtn: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  recordBtnInner: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.accent,
  },
  stopBtnInner: {
    width: 28,
    height: 28,
    borderRadius: 6,
    backgroundColor: COLORS.accent,
  },
  tapLabel: {
    color: COLORS.gray[300],
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.5,
  },
  recIndicator: {
    position: 'absolute',
    top: 80,
    left: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(0,0,0,0.5)',
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
});
