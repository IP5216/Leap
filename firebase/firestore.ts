import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  onSnapshot,
  increment,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from './config';
import { getPreviousDateStr } from '@/utils/date';
import type { User, Challenge, Post } from '@/types';

// ── Users ──────────────────────────────────────────────────────────────────

export async function getUser(uid: string): Promise<User | null> {
  const snap = await getDoc(doc(db, 'users', uid));
  return snap.exists() ? (snap.data() as User) : null;
}

export function subscribeToUser(uid: string, cb: (user: User) => void) {
  return onSnapshot(doc(db, 'users', uid), (snap) => {
    if (snap.exists()) cb(snap.data() as User);
  });
}

// ── Challenges ─────────────────────────────────────────────────────────────

export async function getTodayChallenge(dateStr: string): Promise<Challenge | null> {
  const snap = await getDoc(doc(db, 'challenges', dateStr));
  return snap.exists() ? (snap.data() as Challenge) : null;
}

// ── Posts ──────────────────────────────────────────────────────────────────

export async function createPost(
  post: Omit<Post, 'id' | 'likes' | 'commentCount' | 'watchTimeMs' | 'approved' | 'createdAt'>
) {
  const ref = doc(collection(db, 'posts'));
  await setDoc(ref, {
    ...post,
    id: ref.id,
    likes: 0,
    commentCount: 0,
    watchTimeMs: 0,
    approved: false, // founders review manually
    createdAt: serverTimestamp(),
  });
  return ref.id;
}

export async function getDailyFeed(dateStr: string, limitCount = 30): Promise<Post[]> {
  const q = query(
    collection(db, 'posts'),
    where('challengeDate', '==', dateStr),
    where('approved', '==', true),
    orderBy('createdAt', 'desc'),
    limit(limitCount)
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => d.data() as Post);
}

export async function getFriendsFeed(friendIds: string[], dateStr: string): Promise<Post[]> {
  if (friendIds.length === 0) return [];
  // Firestore 'in' supports up to 30 items per query
  const batches: Promise<Post[]>[] = [];
  for (let i = 0; i < friendIds.length; i += 30) {
    const chunk = friendIds.slice(i, i + 30);
    const q = query(
      collection(db, 'posts'),
      where('userId', 'in', chunk),
      where('challengeDate', '==', dateStr),
      where('approved', '==', true),
      orderBy('createdAt', 'asc')
    );
    batches.push(getDocs(q).then((snap) => snap.docs.map((d) => d.data() as Post)));
  }
  const results = await Promise.all(batches);
  return results.flat();
}

export async function likePost(postId: string, userId: string) {
  await updateDoc(doc(db, 'posts', postId), { likes: increment(1) });
  await setDoc(doc(db, 'likes', `${userId}_${postId}`), {
    userId,
    postId,
    createdAt: serverTimestamp(),
  });
}

export async function recordWatchTime(postId: string, ms: number) {
  await updateDoc(doc(db, 'posts', postId), { watchTimeMs: increment(ms) });
}

// ── Streak + Vertical ──────────────────────────────────────────────────────

export async function markPostedToday(uid: string, dateStr: string) {
  const user = await getUser(uid);
  if (!user) return;

  const yesterday = getPreviousDateStr(dateStr);
  const alreadyPosted = user.lastPostDate === dateStr;
  if (alreadyPosted) return;

  const keptStreak =
    user.lastPostDate === yesterday || user.lastPostDate === dateStr;
  const newStreak = keptStreak ? user.streakCount + 1 : 1;

  await updateDoc(doc(db, 'users', uid), {
    hasPostedToday: true,
    lastPostDate: dateStr,
    streakCount: newStreak,
    verticalHeight: increment(2), // baseline gain per post
  });
}
