import { useEffect, useState } from 'react';
import { getTodayChallenge } from '@/firebase/firestore';
import { useAppStore } from '@/store/useAppStore';
import { getTodayDateStr, isChallengeActive } from '@/utils/date';

export function useChallenge() {
  const [loading, setLoading] = useState(true);
  const todayChallenge = useAppStore((s) => s.todayChallenge);
  const setTodayChallenge = useAppStore((s) => s.setTodayChallenge);

  useEffect(() => {
    getTodayChallenge(getTodayDateStr())
      .then(setTodayChallenge)
      .finally(() => setLoading(false));
  }, []);

  return {
    challenge: todayChallenge,
    loading,
    isActive: isChallengeActive(),
  };
}
