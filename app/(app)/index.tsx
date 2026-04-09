import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useChallenge } from '@/hooks/useChallenge';
import { useStreak } from '@/hooks/useStreak';
import { ChallengeCard } from '@/components/challenge/ChallengeCard';
import { COLORS } from '@/constants';

function AppLogoHeader({ timer }: { timer: string }) {
  return (
    <View style={styles.header}>
      <View style={styles.headerLeft}>
        <View style={styles.logoBox}>
          <Text style={styles.logoLetter}>L</Text>
          <View style={styles.logoDot} />
        </View>
        <View>
          <Text style={styles.brandName}>Leap</Text>
          <Text style={styles.brandSub}>TODAY</Text>
        </View>
      </View>
      <View style={styles.timerBadge}>
        <View style={styles.timerDot} />
        <Text style={styles.timerText}>{timer}</Text>
      </View>
    </View>
  );
}

function formatCountdown(ms: number): string {
  if (ms <= 0) return '00:00:00';
  const totalSecs = Math.floor(ms / 1000);
  const h = Math.floor(totalSecs / 3600);
  const m = Math.floor((totalSecs % 3600) / 60);
  const s = totalSecs % 60;
  return [h, m, s].map((n) => String(n).padStart(2, '0')).join(':');
}

export default function HomeScreen() {
  const { challenge, loading, isActive } = useChallenge();
  const { hasPostedToday } = useStreak();
  const router = useRouter();
  const [timer, setTimer] = useState('');

  useEffect(() => {
    function tick() {
      const now = Date.now();
      if (challenge?.activeTo) {
        setTimer(formatCountdown(challenge.activeTo - now));
      } else {
        const midnight = new Date();
        midnight.setHours(24, 0, 0, 0);
        setTimer(formatCountdown(midnight.getTime() - now));
      }
    }
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [challenge]);

  return (
    <SafeAreaView style={styles.safe}>
      <AppLogoHeader timer={timer} />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {loading ? (
          <View style={styles.emptyState}>
            <Text style={styles.muted}>Loading today's challenge…</Text>
          </View>
        ) : !challenge ? (
          <View style={styles.emptyState}>
            <Text style={styles.muted}>Today's challenge drops at noon EST.</Text>
          </View>
        ) : (
          <>
            <ChallengeCard challenge={challenge} timer={timer} />

            {!hasPostedToday && isActive && (
              <TouchableOpacity
                style={styles.leapButton}
                onPress={() => router.push('/record')}
                activeOpacity={0.85}
              >
                <Text style={styles.leapButtonLabel}>LEAP</Text>
                <Text style={styles.leapButtonSub}>TAP TO RECORD</Text>
              </TouchableOpacity>
            )}

            {hasPostedToday && (
              <View style={styles.postedBadge}>
                <Text style={styles.postedText}>You posted today ✓</Text>
              </View>
            )}

            {!isActive && (
              <Text style={styles.muted}>Opens at noon EST</Text>
            )}

            {(isActive || hasPostedToday) && (
              <Text style={styles.doItOnce}>Do it once. Post it fast.</Text>
            )}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.white },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  logoBox: {
    width: 36,
    height: 36,
    backgroundColor: COLORS.black,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoLetter: { color: COLORS.white, fontSize: 20, fontWeight: '900' },
  logoDot: {
    position: 'absolute',
    top: 7,
    right: 7,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.accent,
  },
  brandName: { fontSize: 15, fontWeight: '800', color: COLORS.black },
  brandSub: {
    fontSize: 9,
    fontWeight: '700',
    color: COLORS.gray[500],
    letterSpacing: 1.5,
  },
  timerBadge: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  timerDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: COLORS.accent,
  },
  timerText: { fontSize: 13, fontWeight: '700', color: COLORS.black },
  content: { padding: 16, paddingBottom: 40 },
  emptyState: {
    flex: 1,
    paddingTop: 60,
    alignItems: 'center',
  },
  muted: {
    color: COLORS.gray[500],
    textAlign: 'center',
    fontSize: 14,
  },
  leapButton: {
    backgroundColor: COLORS.black,
    borderRadius: 50,
    paddingVertical: 20,
    alignItems: 'center',
    marginTop: 20,
  },
  leapButtonLabel: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 2,
  },
  leapButtonSub: {
    color: COLORS.gray[300],
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 1.5,
    marginTop: 2,
  },
  postedBadge: {
    backgroundColor: COLORS.gray[100],
    borderRadius: 50,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 20,
  },
  postedText: { color: COLORS.gray[700], fontSize: 14, fontWeight: '600' },
  doItOnce: {
    textAlign: 'center',
    color: COLORS.gray[500],
    fontSize: 12,
    marginTop: 10,
  },
});
