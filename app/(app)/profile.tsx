import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppStore } from '@/store/useAppStore';
import { useVertical } from '@/hooks/useVertical';
import { useStreak } from '@/hooks/useStreak';
import { VerticalBar } from '@/components/vertical/VerticalBar';
import { signOut } from '@/firebase/auth';
import { COLORS } from '@/constants';

export default function ProfileScreen() {
  const user = useAppStore((s) => s.user);
  const { height, pct, label } = useVertical();
  const { streak } = useStreak();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.name}>{user?.displayName}</Text>
          <Text style={styles.username}>@{user?.username}</Text>
        </View>
        <TouchableOpacity onPress={signOut}>
          <Text style={styles.signOut}>Sign out</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.stats}>
        <View style={styles.stat}>
          <Text style={styles.statValue}>{streak}</Text>
          <Text style={styles.statLabel}>day streak</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statValue}>{height}"</Text>
          <Text style={styles.statLabel}>vertical</Text>
        </View>
      </View>

      <View style={styles.verticalSection}>
        <Text style={styles.verticalLabel}>{label}</Text>
        <VerticalBar pct={pct} height={height} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.black, padding: 16 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 32,
  },
  name: { fontSize: 22, fontWeight: '800', color: COLORS.white },
  username: { fontSize: 14, color: COLORS.gray[500], marginTop: 2 },
  signOut: { color: COLORS.gray[500], fontSize: 14 },
  stats: { flexDirection: 'row', gap: 32, marginBottom: 40 },
  stat: { alignItems: 'center' },
  statValue: { fontSize: 32, fontWeight: '900', color: COLORS.white },
  statLabel: { fontSize: 12, color: COLORS.gray[500], marginTop: 2 },
  verticalSection: { flex: 1 },
  verticalLabel: { fontSize: 16, color: COLORS.gray[300], marginBottom: 16 },
});
