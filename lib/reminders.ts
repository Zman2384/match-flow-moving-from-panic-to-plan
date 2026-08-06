/**
 * Maintenance reminder cadences — the Habits piece turned into a schedule.
 * Pure data so both the store and the notification layer can share it
 * without a circular import.
 */

import type { PieceKey } from '@/lib/match';

export type CadenceId = 'dose' | 'refill' | 'restock' | 'test' | 'sweep';

export type CadenceRhythm = 'daily' | 'weekly' | 'monthly' | 'quarterly';

export interface ReminderCadence {
  id: CadenceId;
  piece: PieceKey;
  /** Card heading and notification title. */
  title: string;
  /** Why this cadence exists, shown under the title. */
  detail: string;
  /** Notification body — calm, specific, actionable. */
  body: string;
  rhythm: CadenceRhythm;
}

export const REMINDER_CADENCES: ReminderCadence[] = [
  {
    id: 'dose',
    piece: 'M',
    title: 'Daily dose',
    detail: 'One prompt at the same time every day beats willpower.',
    body: 'Dose window is open. Take it now while the prompt is in front of you.',
    rhythm: 'daily',
  },
  {
    id: 'refill',
    piece: 'M',
    title: 'Refill window',
    detail: 'Order at 14 days remaining, not at zero.',
    body: 'Refill check: count what is left. Order at 14 days remaining, not at zero.',
    rhythm: 'monthly',
  },
  {
    id: 'restock',
    piece: 'T',
    title: 'Supply restock',
    detail: 'Count barriers and lube, check expiry dates.',
    body: 'Supply sweep: count barriers and lube, check expiry dates, restock the gap.',
    rhythm: 'monthly',
  },
  {
    id: 'test',
    piece: 'A',
    title: 'Testing cadence',
    detail: 'Every 3 months is a common default; adjust with your clinician.',
    body: 'Testing window. Book the panel now — awareness is a layer, not an afterthought.',
    rhythm: 'quarterly',
  },
  {
    id: 'sweep',
    piece: 'H',
    title: 'Weekly sweep',
    detail: 'The five-item check-in that keeps every layer alive.',
    body: 'Weekly sweep: run the five-item check-in and see which piece slipped.',
    rhythm: 'weekly',
  },
];

export const RHYTHM_LABEL: Record<CadenceRhythm, string> = {
  daily: 'Daily',
  weekly: 'Weekly',
  monthly: 'Monthly',
  quarterly: 'Quarterly',
};

export const DEFAULT_REMINDER_CADENCES: Record<CadenceId, boolean> = {
  dose: true,
  refill: true,
  restock: true,
  test: true,
  sweep: true,
};

export const REMINDER_TIMES = ['07:00', '09:00', '12:00', '18:00', '21:00'];

/** Parse an "HH:MM" chip value into numbers, falling back to 09:00. */
export function parseReminderTime(value: string): { hour: number; minute: number } {
  const [rawHour, rawMinute] = value.split(':');
  const hour = Number.parseInt(rawHour ?? '', 10);
  const minute = Number.parseInt(rawMinute ?? '', 10);
  return {
    hour: Number.isFinite(hour) ? Math.min(Math.max(hour, 0), 23) : 9,
    minute: Number.isFinite(minute) ? Math.min(Math.max(minute, 0), 59) : 0,
  };
}

/** Human-readable summary of when a cadence fires. */
export function cadenceSchedule(rhythm: CadenceRhythm, time: string): string {
  switch (rhythm) {
    case 'daily':
      return `Every day at ${time}`;
    case 'weekly':
      return `Sundays at ${time}`;
    case 'monthly':
      return 'Every 30 days';
    case 'quarterly':
      return 'Every 90 days';
    default:
      return `Every day at ${time}`;
  }
}
