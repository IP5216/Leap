import { CHALLENGE_START_HOUR_EST, CHALLENGE_END_HOUR_EST } from '@/constants';

/** Returns YYYY-MM-DD in EST, used as the canonical daily key. */
export function getTodayDateStr(): string {
  const now = new Date();
  const utc = now.getTime() + now.getTimezoneOffset() * 60_000;
  const est = new Date(utc + -5 * 60 * 60_000);
  return est.toISOString().split('T')[0];
}

/** True when the daily challenge window is open (noon–midnight EST). */
export function isChallengeActive(): boolean {
  const now = new Date();
  const utc = now.getTime() + now.getTimezoneOffset() * 60_000;
  const est = new Date(utc + -5 * 60 * 60_000);
  const hour = est.getHours();
  return hour >= CHALLENGE_START_HOUR_EST && hour < CHALLENGE_END_HOUR_EST;
}

export function getPreviousDateStr(dateStr: string): string {
  const d = new Date(dateStr + 'T12:00:00Z');
  d.setDate(d.getDate() - 1);
  return d.toISOString().split('T')[0];
}
