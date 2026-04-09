import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '@/constants';
import type { Challenge } from '@/types';

interface Props {
  challenge: Challenge;
  timer?: string;
}

export function ChallengeCard({ challenge, timer }: Props) {
  const liveCount = 247;

  return (
    <View style={styles.card}>
      <View style={styles.eyebrowRow}>
        <View style={styles.eyebrowDot} />
        <Text style={styles.eyebrow}>CHALLENGE</Text>
      </View>

      <Text style={styles.title}>{challenge.title}</Text>
      <Text style={styles.description}>{challenge.description}</Text>

      {timer && (
        <View style={styles.footer}>
          <Text style={styles.expires}>Expires: {timer}</Text>
          <View style={styles.progressBar}>
            <View style={styles.progressFill} />
          </View>
          <Text style={styles.liveCount}>{liveCount} live</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.challengeCard,
    borderRadius: 16,
    padding: 20,
  },
  eyebrowRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 12,
  },
  eyebrowDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.gray[700],
  },
  eyebrow: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.gray[700],
    letterSpacing: 1.5,
  },
  title: {
    fontSize: 30,
    fontWeight: '900',
    color: COLORS.black,
    marginBottom: 10,
    lineHeight: 34,
  },
  description: {
    fontSize: 14,
    color: COLORS.gray[700],
    lineHeight: 20,
    marginBottom: 20,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.08)',
    paddingTop: 14,
  },
  expires: {
    fontSize: 11,
    color: COLORS.gray[700],
    fontWeight: '600',
  },
  progressBar: {
    flex: 1,
    height: 4,
    backgroundColor: 'rgba(0,0,0,0.1)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    width: '60%',
    height: '100%',
    backgroundColor: COLORS.accent,
    borderRadius: 2,
  },
  liveCount: {
    fontSize: 11,
    color: COLORS.gray[500],
    fontWeight: '600',
  },
});
