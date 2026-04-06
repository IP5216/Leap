export interface User {
  uid: string;
  displayName: string;
  username: string;
  email: string;
  streakCount: number;
  lastPostDate: string | null; // YYYY-MM-DD
  verticalHeight: number; // inches
  hasPostedToday: boolean;
  friendIds: string[];
  pushToken?: string;
  createdAt: number;
}

export interface Challenge {
  id: string; // YYYY-MM-DD
  title: string;
  description: string;
  levels: ChallengeLevel[];
  exampleVideoUrls: string[];
  activeFrom: number; // unix ms
  activeTo: number;
}

export interface ChallengeLevel {
  level: 1 | 2 | 3;
  label: 'Safe' | 'Expressive' | 'Bold';
  description: string;
}

export interface Post {
  id: string;
  userId: string;
  userDisplayName: string;
  userUsername: string;
  challengeDate: string; // YYYY-MM-DD
  videoUrl: string;
  thumbnailUrl: string;
  likes: number;
  commentCount: number;
  watchTimeMs: number;
  approved: boolean;
  createdAt: number;
}

export type FeedType = 'daily' | 'friends';
