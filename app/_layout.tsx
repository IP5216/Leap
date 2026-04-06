import { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';
import { registerForPushNotifications } from '@/firebase/notifications';

export default function RootLayout() {
  const user = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    const inAuth = segments[0] === '(auth)';
    if (!user && !inAuth) {
      router.replace('/(auth)/login');
    } else if (user && inAuth) {
      router.replace('/(app)');
    }
  }, [user, segments]);

  useEffect(() => {
    if (user) registerForPushNotifications(user.uid);
  }, [user?.uid]);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(app)" />
      <Stack.Screen name="record" options={{ presentation: 'fullScreenModal' }} />
    </Stack>
  );
}
