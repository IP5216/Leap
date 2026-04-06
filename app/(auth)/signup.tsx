import { useState } from 'react';
import {
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { Link, useRouter } from 'expo-router';
import { signUp } from '@/firebase/auth';
import { COLORS } from '@/constants';

export default function Signup() {
  const [displayName, setDisplayName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSignup() {
    if (!displayName || !username || !email || !password) {
      Alert.alert('Fill in all fields');
      return;
    }
    setLoading(true);
    try {
      await signUp(email.trim(), password, displayName.trim(), username.trim());
      router.replace('/(app)');
    } catch (e: any) {
      Alert.alert('Signup failed', e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.inner}>
        <Text style={styles.logo}>Leap</Text>
        <Text style={styles.tagline}>Take the leap.</Text>
        <TextInput
          style={styles.input}
          placeholder="Name"
          placeholderTextColor={COLORS.gray[500]}
          value={displayName}
          onChangeText={setDisplayName}
        />
        <TextInput
          style={styles.input}
          placeholder="Username"
          placeholderTextColor={COLORS.gray[500]}
          autoCapitalize="none"
          value={username}
          onChangeText={setUsername}
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor={COLORS.gray[500]}
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor={COLORS.gray[500]}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity style={styles.button} onPress={handleSignup} disabled={loading}>
          <Text style={styles.buttonText}>
            {loading ? 'Creating account…' : 'Create account'}
          </Text>
        </TouchableOpacity>
        <Link href="/(auth)/login" style={styles.link}>
          Already have an account? Log in
        </Link>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.black },
  inner: { justifyContent: 'center', padding: 24, flexGrow: 1 },
  logo: {
    fontSize: 52,
    fontWeight: '900',
    color: COLORS.white,
    textAlign: 'center',
    marginBottom: 4,
  },
  tagline: {
    fontSize: 16,
    color: COLORS.gray[500],
    textAlign: 'center',
    marginBottom: 48,
  },
  input: {
    backgroundColor: COLORS.gray[900],
    color: COLORS.white,
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    fontSize: 16,
  },
  button: {
    backgroundColor: COLORS.accent,
    borderRadius: 8,
    padding: 16,
    marginTop: 4,
    alignItems: 'center',
  },
  buttonText: { color: COLORS.white, fontSize: 16, fontWeight: '700' },
  link: {
    color: COLORS.gray[500],
    textAlign: 'center',
    marginTop: 24,
    fontSize: 14,
  },
});
