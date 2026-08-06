/**
 * Local maintenance nudges. Everything here is scheduled on-device by
 * expo-notifications — no push tokens, no server, no account. Nothing about a
 * user's plan ever leaves the phone.
 */

import * as Notifications from 'expo-notifications';
import type { Href } from 'expo-router';
import { Platform } from 'react-native';

import {
  type CadenceRhythm,
  parseReminderTime,
  REMINDER_CADENCES,
  type ReminderCadence,
} from '@/lib/reminders';
import { useMatchStore } from '@/lib/store';

export const NOTIFICATIONS_SUPPORTED = Platform.OS !== 'web';

export type PermissionState = 'granted' | 'denied' | 'undetermined' | 'unsupported';

export interface SyncResult {
  scheduled: number;
  permission: PermissionState;
}

const CHANNEL_ID = 'maintenance';
const DAY_SECONDS = 24 * 60 * 60;

/** Where a tapped nudge lands. Keyed by the `route` value in its data payload. */
const NUDGE_ROUTES: Record<string, Href> = {
  reminders: '/tools/reminders',
};

if (NOTIFICATIONS_SUPPORTED) {
  Notifications.setNotificationHandler({
    handleNotification: () =>
      Promise.resolve({
        shouldShowBanner: true,
        shouldShowList: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
      }),
  });
}

let channelReady = false;

async function ensureChannel() {
  if (Platform.OS !== 'android' || channelReady) return;
  await Notifications.setNotificationChannelAsync(CHANNEL_ID, {
    name: 'Maintenance nudges',
    importance: Notifications.AndroidImportance.DEFAULT,
    lightColor: '#00e5ff',
    vibrationPattern: [0, 180, 120, 180],
  });
  channelReady = true;
}

function toPermissionState(status: string): PermissionState {
  if (status === 'granted') return 'granted';
  if (status === 'denied') return 'denied';
  return 'undetermined';
}

export async function getPermissionState(): Promise<PermissionState> {
  if (!NOTIFICATIONS_SUPPORTED) return 'unsupported';
  const { status } = await Notifications.getPermissionsAsync();
  return toPermissionState(status);
}

export async function requestPermission(): Promise<PermissionState> {
  if (!NOTIFICATIONS_SUPPORTED) return 'unsupported';
  await ensureChannel();
  const { status } = await Notifications.requestPermissionsAsync();
  return toPermissionState(status);
}

function triggerFor(
  rhythm: CadenceRhythm,
  hour: number,
  minute: number,
): Notifications.NotificationTriggerInput {
  switch (rhythm) {
    case 'daily':
      return { type: Notifications.SchedulableTriggerInputTypes.DAILY, hour, minute };
    case 'weekly':
      // weekday is 1-indexed from Sunday.
      return { type: Notifications.SchedulableTriggerInputTypes.WEEKLY, weekday: 1, hour, minute };
    case 'monthly':
      return {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: 30 * DAY_SECONDS,
        repeats: true,
      };
    case 'quarterly':
      return {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: 90 * DAY_SECONDS,
        repeats: true,
      };
    default:
      return { type: Notifications.SchedulableTriggerInputTypes.DAILY, hour, minute };
  }
}

async function scheduleCadence(cadence: ReminderCadence, hour: number, minute: number) {
  await Notifications.scheduleNotificationAsync({
    identifier: `match-flow-${cadence.id}`,
    content: {
      title: `MATCH Flow · ${cadence.title}`,
      body: cadence.body,
      data: { cadenceId: cadence.id, route: 'reminders' },
      ...(Platform.OS === 'android' ? { channelId: CHANNEL_ID } : {}),
    },
    trigger: triggerFor(cadence.rhythm, hour, minute),
  });
}

/**
 * Rebuild the on-device schedule from the current store state. Safe to call on
 * every toggle and on app launch — it cancels first, so nothing duplicates.
 * Pass `prompt: false` (app launch) to skip asking for permission.
 */
export async function syncReminders(options?: { prompt?: boolean }): Promise<SyncResult> {
  if (!NOTIFICATIONS_SUPPORTED) return { scheduled: 0, permission: 'unsupported' };

  const { remindersEnabled, reminderTime, reminderCadences } = useMatchStore.getState();
  await Notifications.cancelAllScheduledNotificationsAsync();

  if (!remindersEnabled) {
    return { scheduled: 0, permission: await getPermissionState() };
  }

  let permission = await getPermissionState();
  if (permission !== 'granted' && options?.prompt !== false) {
    permission = await requestPermission();
  }
  if (permission !== 'granted') {
    return { scheduled: 0, permission };
  }

  await ensureChannel();
  const { hour, minute } = parseReminderTime(reminderTime);
  const active = REMINDER_CADENCES.filter((cadence) => reminderCadences[cadence.id]);
  await Promise.all(active.map((cadence) => scheduleCadence(cadence, hour, minute)));

  return { scheduled: active.length, permission };
}

/** Number of nudges currently armed on this device. */
export async function countScheduled(): Promise<number> {
  if (!NOTIFICATIONS_SUPPORTED) return 0;
  const scheduled = await Notifications.getAllScheduledNotificationsAsync();
  return scheduled.length;
}

export async function cancelAllReminders(): Promise<void> {
  if (!NOTIFICATIONS_SUPPORTED) return;
  await Notifications.cancelAllScheduledNotificationsAsync();
}

/** Fires a one-off nudge a few seconds out so the user can see the real thing. */
export async function sendTestNudge(): Promise<PermissionState> {
  if (!NOTIFICATIONS_SUPPORTED) return 'unsupported';

  let permission = await getPermissionState();
  if (permission !== 'granted') {
    permission = await requestPermission();
  }
  if (permission !== 'granted') return permission;

  await ensureChannel();
  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'MATCH Flow · Test nudge',
      body: 'This is what a maintenance prompt looks like. Nothing left this device.',
      data: { route: 'reminders' },
      ...(Platform.OS === 'android' ? { channelId: CHANNEL_ID } : {}),
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds: 4,
      repeats: false,
    },
  });
  return 'granted';
}

/** Route the user to the reminders screen when they tap a nudge. */
export function addNudgeTapListener(onTap: (href: Href) => void) {
  if (!NOTIFICATIONS_SUPPORTED) return { remove: () => {} };
  return Notifications.addNotificationResponseReceivedListener((response) => {
    const data: unknown = response.notification.request.content.data;
    const route =
      data && typeof data === 'object' && 'route' in data ? String(data.route) : 'reminders';
    onTap(NUDGE_ROUTES[route] ?? NUDGE_ROUTES.reminders);
  });
}
