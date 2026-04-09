import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '@/constants';

export function FeedGate() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.content}>
        <View style={styles.lockWrap}>
          <Text style={styles.lockIcon}>🔒</Text>
        </View>
        <Text style={styles.title}>Take the leap to continue</Text>
        <Text style={styles.subtitle}>
          Post today's challenge to unlock the feed and{'\n'}see what everyone else is doing.
        </Text>
        <TouchableOpacity
          style={styles.recordButton}
          onPress={() => router.push('/record')}
          activeOpacity={0.85}
        >
          <Text style={styles.recordButtonText}>RECORD NOW</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.white },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  lockWrap: {
    width: 72,
    height: 72,
    backgroundColor: '#FDEEE8',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  lockIcon: { fontSize: 32 },
  title: {
    fontSize: 22,
    fontWeight: '900',
    color: COLORS.black,
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.gray[500],
    textAlign: 'center',
    lineHeight: 21,
    marginBottom: 36,
  },
  recordButton: {
    backgroundColor: COLORS.black,
    borderRadius: 50,
    paddingVertical: 16,
    paddingHorizontal: 40,
  },
  recordButtonText: {
    color: COLORS.white,
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 1.5,
  },
});
