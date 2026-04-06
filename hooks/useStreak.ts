import { useAppStore } from '@/store/useAppStore';

export function useStreak() {
  const user = useAppStore((s) => s.user);
  return {
    streak: user?.streakCount ?? 0,
    hasPostedToday: user?.hasPostedToday ?? false,
  };
}
