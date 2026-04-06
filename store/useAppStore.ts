import { create } from 'zustand';
import type { User, Challenge } from '@/types';

interface AppState {
  user: User | null;
  todayChallenge: Challenge | null;
  hasPostedToday: boolean;
  previewVideoCount: number; // videos watched before posting (gate logic)

  setUser: (user: User | null) => void;
  setTodayChallenge: (c: Challenge | null) => void;
  setHasPostedToday: (v: boolean) => void;
  incrementPreviewCount: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  user: null,
  todayChallenge: null,
  hasPostedToday: false,
  previewVideoCount: 0,

  setUser: (user) =>
    set({ user, hasPostedToday: user?.hasPostedToday ?? false }),
  setTodayChallenge: (todayChallenge) => set({ todayChallenge }),
  setHasPostedToday: (hasPostedToday) => set({ hasPostedToday }),
  incrementPreviewCount: () =>
    set((s) => ({ previewVideoCount: s.previewVideoCount + 1 })),
}));
