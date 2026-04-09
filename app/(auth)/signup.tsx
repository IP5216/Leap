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
  ScrollView,
} from 'react-native';
import { Link } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { signUp } from '@/firebase/auth';
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

export default function Signup() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSignup() {
    if (!username || !email || !password) {
      Alert.alert('Fill in all fields');
      return;
    }
    setLoading(true);
    try {
      await signUp(email.trim(), password, username.trim(), username.trim());
    } catch (e: any) {
      Alert.alert('Signup failed', e.message);
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
        <ScrollView contentContainerStyle={styles.inner} showsVerticalScrollIndicator={false}>
          <AppLogo />

          <View style={styles.fields}>
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>USERNAME</Text>
              <TextInput
                style={styles.input}
                placeholder="what should we call you?"
                placeholderTextColor={COLORS.gray[300]}
                autoCapitalize="none"
                value={username}
                onChangeText={setUsername}
              />
            </View>

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

          <TouchableOpacity style={styles.button} onPress={handleSignup} disabled={loading}>
            <Text style={styles.buttonText}>
              {loading ? 'CREATING ACCOUNT…' : 'CONTINUE'}
            </Text>
          </TouchableOpacity>

          <Link href="/(auth)/login" style={styles.link}>
            Already have an account? Sign In
          </Link>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.white },
  container: { flex: 1 },
  inner: {
    flexGrow: 1,
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
