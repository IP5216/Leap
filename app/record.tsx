import { useRouter } from 'expo-router';
import { RecordingScreen } from '@/components/camera/RecordingScreen';

export default function RecordModal() {
  const router = useRouter();
  return <RecordingScreen onClose={() => router.back()} />;
}
