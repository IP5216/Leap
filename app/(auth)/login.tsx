import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Link } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { signIn } from '@/firebase/auth';
import { COLORS } from '@/constants';

function AppLogo() {
  return (
    <View style={styles.logoWrap}>
      <View style={styles.logoBox}>
        <Text style={styles.logoLetter}>L</Text>
        <View style={styles.logoDot} />
      </View>
      <Text style={styles.tagline}>STOP OVERTHINKING.</Text>
    </View>
  );
}

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    if (!email || !password) return;
    setLoading(true);
    try {
      await signIn(email.trim(), password);
    } catch (e: any) {
      Alert.alert('Login failed', e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.inner}>
          <AppLogo />

          <View style={styles.fields}>
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>EMAIL</Text>
              <TextInput
                style={styles.input}
                placeholder="your@email.com"
                placeholderTextColor={COLORS.gray[300]}
                autoCapitalize="none"
                keyboardType="email-address"
                value={email}
                onChangeText={setEmail}
              />
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>PASSWORD</Text>
              <TextInput
                style={styles.input}
                placeholder="make it strong"
                placeholderTextColor={COLORS.gray[300]}
                secureTextEntry
                value={password}
                onChangeText={setPassword}
              />
            </View>
          </View>

          <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
            <Text style={styles.buttonText}>
              {loading ? 'SIGNING IN…' : 'CONTINUE'}
            </Text>
          </TouchableOpacity>

          <Link href="/(auth)/signup" style={styles.link}>
            New here? Create account
          </Link>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.white },
  container: { flex: 1 },
  inner: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingVertical: 40,
  },
  logoWrap: { alignItems: 'center', marginBottom: 48 },
  logoBox: {
    width: 64,
    height: 64,
    backgroundColor: COLORS.black,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
  },
  logoLetter: { color: COLORS.white, fontSize: 36, fontWeight: '900' },
  logoDot: {
    position: 'absolute',
    top: 12,
    right: 13,
    width: 9,
    height: 9,
    borderRadius: 4.5,
    backgroundColor: COLORS.accent,
  },
  tagline: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.gray[500],
    letterSpacing: 1.5,
  },
  fields: { gap: 24, marginBottom: 32 },
  fieldGroup: {},
  label: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.gray[500],
    letterSpacing: 1.5,
    marginBottom: 8,
  },
  input: {
    fontSize: 15,
    color: COLORS.black,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    paddingBottom: 10,
    paddingTop: 0,
  },
  button: {
    backgroundColor: COLORS.black,
    borderRadius: 30,
    paddingVertical: 18,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: COLORS.white,
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 1.5,
  },
  link: {
    color: COLORS.gray[500],
    textAlign: 'center',
    fontSize: 13,
  },
});
