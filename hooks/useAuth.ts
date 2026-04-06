import { useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/firebase/config';
import { subscribeToUser } from '@/firebase/firestore';
import { useAppStore } from '@/store/useAppStore';

export function useAuth() {
  const setUser = useAppStore((s) => s.setUser);

  useEffect(() => {
    let unsubUser: (() => void) | null = null;

    const unsubAuth = onAuthStateChanged(auth, (firebaseUser) => {
      unsubUser?.();
      if (firebaseUser) {
        unsubUser = subscribeToUser(firebaseUser.uid, setUser);
      } else {
        setUser(null);
      }
    });

    return () => {
      unsubAuth();
      unsubUser?.();
    };
  }, [setUser]);

  return useAppStore((s) => s.user);
}
