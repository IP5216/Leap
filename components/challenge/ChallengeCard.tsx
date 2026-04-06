import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '@/constants';
import type { Challenge } from '@/types';

interface Props {
  challenge: Challenge;
}

const LEVEL_COLOR = {
  1: COLORS.gray[500],
  2: '#FF9500',
  3: COLORS.accent,
} as const;

export function ChallengeCard({ challenge }: Props) {
  return (
    <View style={styles.card}>
      <Text style={styles.eyebrow}>TODAY'S CHALLENGE</Text>
      <Text style={styles.title}>{challenge.title}</Text>
      <Text style={styles.description}>{challenge.description}</Text>

      <View style={styles.levels}>
        {challenge.levels.map((lvl) => (
          <View key={lvl.level} style={styles.level}>
            <View
              style={[styles.dot, { backgroundColor: LEVEL_COLOR[lvl.level] }]}
            />
            <View style={styles.levelBody}>
              <Text style={[styles.levelLabel, { color: LEVEL_COLOR[lvl.level] }]}>
                {lvl.label}
              </Text>
              <Text style={styles.levelDesc}>{lvl.description}</Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.gray[900],
    borderRadius: 16,
    padding: 20,
  },
  eyebrow: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.accent,
    letterSpacing: 1.5,
    marginBottom: 8,
  },
  title: {
    fontSize: 30,
    fontWeight: '900',
    color: COLORS.white,
    marginBottom: 10,
    lineHeight: 34,
  },
  description: {
    fontSize: 16,
    color: COLORS.gray[300],
    lineHeight: 24,
    marginBottom: 20,
  },
  levels: { gap: 12 },
  level: { flexDirection: 'row', gap: 12, alignItems: 'flex-start' },
  dot: { width: 8, height: 8, borderRadius: 4, marginTop: 5 },
  levelBody: { flex: 1 },
  levelLabel: { fontSize: 11, fontWeight: '700', letterSpacing: 0.8 },
  levelDesc: { fontSize: 14, color: COLORS.gray[500], marginTop: 2 },
});
