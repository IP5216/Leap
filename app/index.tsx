import { Redirect } from 'expo-router';
import { useAppStore } from '@/store/useAppStore';

export default function Index() {
  const user = useAppStore((s) => s.user);
  return <Redirect href={user ? '/(app)' : '/(auth)/login'} />;
}
