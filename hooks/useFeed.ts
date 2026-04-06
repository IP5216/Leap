import { useEffect, useState } from 'react';
import { getDailyFeed, getFriendsFeed } from '@/firebase/firestore';
import { useAppStore } from '@/store/useAppStore';
import { getTodayDateStr } from '@/utils/date';
import type { Post, FeedType } from '@/types';

export function useFeed(type: FeedType) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const user = useAppStore((s) => s.user);
  const hasPostedToday = useAppStore((s) => s.hasPostedToday);

  useEffect(() => {
    if (!hasPostedToday) {
      setLoading(false);
      return;
    }

    const dateStr = getTodayDateStr();
    const fetcher =
      type === 'daily'
        ? getDailyFeed(dateStr)
        : getFriendsFeed(user?.friendIds ?? [], dateStr);

    setLoading(true);
    fetcher.then(setPosts).finally(() => setLoading(false));
  }, [hasPostedToday, type, user?.friendIds]);

  return { posts, loading, isGated: !hasPostedToday };
}
