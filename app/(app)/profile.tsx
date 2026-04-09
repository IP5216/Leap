import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppStore } from '@/store/useAppStore';
import { useVertical } from '@/hooks/useVertical';
import { useStreak } from '@/hooks/useStreak';
import { signOut } from '@/firebase/auth';
import { COLORS, VERTICAL_MAX_HEIGHT } from '@/constants';

function JumpBar({ pct }: { pct: number }) {
  return (
    <View style={styles.jumpBarContainer}>
      <View style={styles.jumpBarTrack}>
        <View style={[styles.jumpBarFill, { height: `${Math.max(pct * 100, 3)}%` }]} />
      </View>
    </View>
  );
}

export default function ProfileScreen() {
  const user = useAppStore((s) => s.user);
  const { height, pct } = useVertical();
  const { streak } = useStreak();

  const initial = (user?.displayName?.[0] ?? user?.username?.[0] ?? '?').toUpperCase();
  const likesReceived = 0;
  const challengesCompleted = user?.streakCount ?? 0;
  const school = 'Indiana University';

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
            <Text style={styles.brandSub}>PROFILE</Text>
          </View>
        </View>
        <TouchableOpacity onPress={signOut}>
          <Text style={styles.signOut}>Sign out</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.profileCard}>
          <View style={styles.avatarWrap}>
            <View style={styles.avatar}>
              <Text style={styles.avatarLetter}>{initial}</Text>
            </View>
            <Text style={styles.displayName}>{user?.displayName ?? user?.username}</Text>
            <Text style={styles.handle}>@{user?.username}</Text>
            <Text style={styles.school}>{school}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>JUMP HEIGHT</Text>
          <View style={styles.jumpRow}>
            <Text style={styles.jumpHeight}>{height}"</Text>
            <TouchableOpacity style={styles.newBtn}>
              <Text style={styles.newBtnText}>N</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.jumpViz}>
            <JumpBar pct={pct} />
            <View style={styles.jumpTextBlock}>
              <Text style={styles.jumpTagline}>You are getting higher.</Text>
              <Text style={styles.jumpDesc}>
                Track your best jump in inches. More reps mean more lift and a higher ceiling.
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.stat}>
            <Text style={styles.statValue}>{challengesCompleted}</Text>
            <Text style={styles.statLabel}>CHALLENGES{'\n'}COMPLETED</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.stat}>
            <Text style={styles.statValue}>{streak}</Text>
            <Text style={styles.statLabel}>DAY{'\n'}STREAK</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.stat}>
            <Text style={styles.statValue}>{likesReceived}</Text>
            <Text style={styles.statLabel}>LIKES{'\n'}RECEIVED</Text>
          </View>
        </View>

        <View style={styles.leapsSection}>
          <Text style={styles.sectionLabel}>YOUR LEAPS</Text>
          <Text style={styles.leapsEmpty}>
            Make the profile feel like a scoreboard, not a closet. Post your first challenge to get started.
          </Text>
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
  signOut: { fontSize: 13, color: COLORS.gray[500] },
  profileCard: {
    margin: 16,
    backgroundColor: COLORS.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 24,
  },
  avatarWrap: { alignItems: 'center' },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: COLORS.gray[100],
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarLetter: { fontSize: 30, fontWeight: '800', color: COLORS.gray[700] },
  displayName: { fontSize: 18, fontWeight: '800', color: COLORS.black },
  handle: { fontSize: 13, color: COLORS.gray[500], marginTop: 2 },
  school: { fontSize: 12, color: COLORS.gray[500], marginTop: 6 },
  section: {
    marginHorizontal: 16,
    marginBottom: 0,
    backgroundColor: COLORS.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 20,
  },
  sectionLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: COLORS.gray[500],
    letterSpacing: 2,
    marginBottom: 10,
  },
  jumpRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  jumpHeight: { fontSize: 44, fontWeight: '900', color: COLORS.black },
  newBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: COLORS.gray[100],
    justifyContent: 'center',
    alignItems: 'center',
  },
  newBtnText: { fontSize: 13, fontWeight: '800', color: COLORS.gray[700] },
  jumpViz: {
    flexDirection: 'row',
    gap: 16,
    alignItems: 'flex-start',
  },
  jumpBarContainer: {
    width: 12,
    height: 100,
    justifyContent: 'flex-end',
  },
  jumpBarTrack: {
    flex: 1,
    backgroundColor: COLORS.gray[100],
    borderRadius: 6,
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },
  jumpBarFill: {
    width: '100%',
    backgroundColor: COLORS.accent,
    borderRadius: 6,
  },
  jumpTextBlock: { flex: 1 },
  jumpTagline: { fontSize: 16, fontWeight: '800', color: COLORS.black, marginBottom: 6 },
  jumpDesc: { fontSize: 13, color: COLORS.gray[500], lineHeight: 19 },
  statsRow: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginTop: 12,
    backgroundColor: COLORS.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingVertical: 20,
    paddingHorizontal: 8,
  },
  stat: { flex: 1, alignItems: 'center' },
  statValue: { fontSize: 26, fontWeight: '900', color: COLORS.black },
  statLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: COLORS.gray[500],
    letterSpacing: 0.8,
    textAlign: 'center',
    marginTop: 4,
    lineHeight: 13,
  },
  statDivider: { width: 1, backgroundColor: COLORS.border },
  leapsSection: {
    margin: 16,
    backgroundColor: COLORS.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 20,
    marginBottom: 32,
  },
  leapsEmpty: {
    fontSize: 13,
    color: COLORS.gray[500],
    lineHeight: 20,
  },
});
