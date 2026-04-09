import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppStore } from '@/store/useAppStore';
import { COLORS } from '@/constants';

type LeaderboardTab = 'jumps' | 'users';

const MOCK_TOP_JUMPS = [
  { rank: 1, username: 'kevinthebold', challenges: 12, streak: 7, height: 42, color: COLORS.accent },
  { rank: 2, username: 'sarahleaps', challenges: 10, streak: 5, height: 39, color: COLORS.black },
  { rank: 3, username: 'mikejumps', challenges: 9, streak: 4, height: 35, color: COLORS.black },
  { rank: 4, username: 'jess_bold', challenges: 6, streak: 3, height: 31, color: COLORS.black },
];

const MOCK_TOP_USERS = [
  { rank: 1, username: 'kevinthebold', challenges: 12, streak: 7, height: 42, color: COLORS.accent },
  { rank: 2, username: 'mikejumps', challenges: 9, streak: 4, height: 35, color: COLORS.black },
  { rank: 3, username: 'sarahleaps', challenges: 10, streak: 5, height: 39, color: COLORS.black },
  { rank: 4, username: 'jess_bold', challenges: 6, streak: 3, height: 31, color: COLORS.black },
];

function Avatar({ letter, color }: { letter: string; color: string }) {
  return (
    <View style={[styles.avatar, { backgroundColor: color === COLORS.accent ? '#FDEEE8' : COLORS.gray[100] }]}>
      <Text style={[styles.avatarLetter, { color: color === COLORS.accent ? COLORS.accent : COLORS.gray[700] }]}>
        {letter.toUpperCase()}
      </Text>
    </View>
  );
}

function HeightBar({ height, maxHeight, color }: { height: number; maxHeight: number; color: string }) {
  const barHeight = Math.max(20, (height / maxHeight) * 60);
  return (
    <View style={styles.barWrap}>
      <View style={[styles.bar, { height: barHeight, backgroundColor: color }]} />
    </View>
  );
}

export default function LeaderboardScreen() {
  const [tab, setTab] = useState<LeaderboardTab>('jumps');
  const user = useAppStore((s) => s.user);
  const verticalHeight = user?.verticalHeight ?? 0;

  const data = tab === 'jumps' ? MOCK_TOP_JUMPS : MOCK_TOP_USERS;
  const maxHeight = Math.max(...data.map((d) => d.height));

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.logoBox}>
            <Text style={styles.logoLetter}>L</Text>
            <View style={styles.logoDot} />
          </View>
          <View>
            <Text style={styles.brandName}>Leap</Text>
            <Text style={styles.brandSub}>LEADERBOARD</Text>
          </View>
        </View>
        <View style={styles.scoreBadge}>
          <View style={styles.scoreDot} />
          <Text style={styles.scoreText}>{verticalHeight}"</Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.heroSection}>
          <Text style={styles.heroText}>
            {'How '}
            <Text style={styles.heroTextBold}>high can </Text>
            <Text style={styles.heroTextRegular}>you jump?</Text>
          </Text>
        </View>

        <View style={styles.tabs}>
          <TouchableOpacity
            style={[styles.tabBtn, tab === 'jumps' && styles.tabBtnActive]}
            onPress={() => setTab('jumps')}
          >
            <Text style={[styles.tabBtnText, tab === 'jumps' && styles.tabBtnTextActive]}>
              TOP JUMPS
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tabBtn, tab === 'users' && styles.tabBtnActive]}
            onPress={() => setTab('users')}
          >
            <Text style={[styles.tabBtnText, tab === 'users' && styles.tabBtnTextActive]}>
              TOP USERS
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.list}>
          {data.map((entry) => (
            <View key={entry.rank} style={styles.row}>
              <Text style={styles.rank}>{entry.rank}</Text>
              <Avatar letter={entry.username[0]} color={entry.color} />
              <View style={styles.rowInfo}>
                <Text style={styles.rowUsername}>{entry.username}</Text>
                <Text style={styles.rowMeta}>
                  {entry.challenges} challenges · {entry.streak} day streak
                </Text>
              </View>
              <HeightBar height={entry.height} maxHeight={maxHeight} color={entry.color} />
              <View style={styles.heightCol}>
                <Text style={styles.heightNum}>{entry.height}</Text>
                <Text style={styles.heightUnit}>IN</Text>
              </View>
            </View>
          ))}
        </View>
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
  scoreBadge: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  scoreDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: COLORS.accent,
  },
  scoreText: { fontSize: 14, fontWeight: '700', color: COLORS.black },
  heroSection: { paddingHorizontal: 16, paddingTop: 20, paddingBottom: 16 },
  heroText: { fontSize: 28, color: COLORS.black, lineHeight: 36 },
  heroTextBold: { fontWeight: '900' },
  heroTextRegular: { fontWeight: '400' },
  tabs: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 8,
    marginBottom: 16,
  },
  tabBtn: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 50,
    backgroundColor: COLORS.gray[100],
  },
  tabBtnActive: { backgroundColor: COLORS.black },
  tabBtnText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
    color: COLORS.gray[500],
  },
  tabBtnTextActive: { color: COLORS.white },
  list: { paddingHorizontal: 16, paddingBottom: 40 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    gap: 12,
  },
  rank: { fontSize: 14, fontWeight: '700', color: COLORS.black, width: 16 },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarLetter: { fontSize: 15, fontWeight: '800' },
  rowInfo: { flex: 1 },
  rowUsername: { fontSize: 14, fontWeight: '800', color: COLORS.black },
  rowMeta: { fontSize: 11, color: COLORS.gray[500], marginTop: 2 },
  barWrap: {
    width: 8,
    height: 60,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  bar: { width: 6, borderRadius: 3 },
  heightCol: { alignItems: 'flex-end', minWidth: 32 },
  heightNum: { fontSize: 18, fontWeight: '900', color: COLORS.black },
  heightUnit: { fontSize: 9, fontWeight: '700', color: COLORS.gray[500], letterSpacing: 1 },
});
