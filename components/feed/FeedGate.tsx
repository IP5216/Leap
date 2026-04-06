import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '@/constants';

export function FeedGate() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.icon}>⚡</Text>
        <Text style={styles.title}>Take the leap to continue</Text>
        <Text style={styles.subtitle}>
          Post today's challenge to unlock the full feed.
        </Text>
        <TouchableOpacity
          style={styles.postButton}
          onPress={() => router.push('/record')}
        >
          <Text style={styles.postButtonText}>Post now</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.challengeLink}
          onPress={() => router.push('/(app)')}
        >
          <Text style={styles.challengeLinkText}>See today's challenge</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.black },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  icon: { fontSize: 48, marginBottom: 16 },
  title: {
    fontSize: 26,
    fontWeight: '900',
    color: COLORS.white,
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.gray[500],
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 24,
  },
  postButton: {
    backgroundColor: COLORS.accent,
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 48,
    marginBottom: 16,
  },
  postButtonText: { color: COLORS.white, fontSize: 18, fontWeight: '800' },
  challengeLink: { padding: 12 },
  challengeLinkText: { color: COLORS.gray[500], fontSize: 14 },
});
