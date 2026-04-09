export const CHALLENGE_START_HOUR_EST = 12; // noon
export const CHALLENGE_END_HOUR_EST = 24; // midnight

export const MAX_RECORDING_ATTEMPTS = 6;
export const MAX_VIDEO_DURATION_SECONDS = 40;
export const MIN_VIDEO_DURATION_SECONDS = 3;
export const PREVIEW_VIDEOS_BEFORE_GATE = 5;

export const VERTICAL_CONSISTENCY_WEIGHT = 0.4;
export const VERTICAL_ENGAGEMENT_WEIGHT = 0.6;
export const VERTICAL_BASELINE_GAIN = 2;
export const VERTICAL_MISS_PENALTY = 3;
export const VERTICAL_MAX_HEIGHT = 120; // 10 feet in inches

export const COLORS = {
  black: '#000000',
  white: '#FFFFFF',
  accent: '#FF3B30',
  bg: '#F0EFED',
  card: '#FFFFFF',
  challengeCard: '#F5F0E8',
  border: '#E8E8E8',
  text: '#000000',
  textMuted: '#888888',
  gray: {
    100: '#F5F5F5',
    200: '#EEEEEE',
    300: '#C4C4C4',
    500: '#888888',
    700: '#444444',
    900: '#1A1A1A',
  },
} as const;
