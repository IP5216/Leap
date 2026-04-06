import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useChallenge } from '@/hooks/useChallenge';
import { useStreak } from '@/hooks/useStreak';
import { ChallengeCard } from '@/components/challenge/ChallengeCard';
import { COLORS } from '@/constants';

export default function HomeScreen() {
  const { challenge, loading, isActive } = useChallenge();
  const { streak, hasPostedToday } = useStreak();
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.brand}>Leap</Text>
        {streak > 0 && <Text style={styles.streak}>{streak}d streak</Text>}
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {loading ? (
          <Text style={styles.muted}>Loading today's challenge…</Text>
        ) : !challenge ? (
          <Text style={styles.muted}>
            Today's challenge drops at noon EST.
          </Text>
        ) : (
          <>
            <ChallengeCard challenge={challenge} />

            {!hasPostedToday && isActive && (
              <TouchableOpacity
                style={styles.leapButton}
                onPress={() => router.push('/record')}
              >
                <Text style={styles.leapButtonText}>Take the leap</Text>
              </TouchableOpacity>
            )}

            {hasPostedToday && (
              <View style={styles.postedBadge}>
                <Text style={styles.postedText}>You posted today</Text>
              </View>
            )}

            {!isActive && (
              <Text style={styles.muted}>Opens at noon EST</Text>
            )}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.black },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  brand: { fontSize: 26, fontWeight: '900', color: COLORS.white },
  streak: { fontSize: 13, color: COLORS.accent, fontWeight: '700' },
  content: { padding: 16, paddingBottom: 40 },
  muted: {
    color: COLORS.gray[500],
    textAlign: 'center',
    marginTop: 40,
    fontSize: 15,
  },
  leapButton: {
    backgroundColor: COLORS.accent,
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
    marginTop: 24,
  },
  leapButtonText: { color: COLORS.white, fontSize: 18, fontWeight: '800' },
  postedBadge: {
    backgroundColor: COLORS.gray[900],
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 24,
  },
  postedText: { color: COLORS.gray[300], fontSize: 14 },
});
