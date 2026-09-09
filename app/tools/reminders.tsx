import { useCallback, useEffect, useState } from 'react';
import { BellRing, Check, ShieldAlert } from 'lucide-react-native';
import { Linking, Platform, Pressable, Switch, Text, View } from 'react-native';

import { MatchPiece } from '@/components/BrandArt';
import { BodyText, HudPanel, ScreenShell, SectionLabel } from '@/components/ScreenShell';
import { PIECE_COLOR } from '@/lib/match';
import {
  countScheduled,
  getPermissionState,
  NOTIFICATIONS_SUPPORTED,
  type PermissionState,
  requestPermission,
  sendTestNudge,
  syncReminders,
} from '@/lib/notifications';
import {
  cadenceSchedule,
  type CadenceId,
  REMINDER_CADENCES,
  REMINDER_TIMES,
  RHYTHM_LABEL,
} from '@/lib/reminders';
import { CAUTION_EDGE, HUD, HUD_DIM, LINE, PANEL, STEEL } from '@/lib/palette';
import { useMatchStore } from '@/lib/store';

export default function RemindersScreen() {
  const remindersEnabled = useMatchStore((s) => s.remindersEnabled);
  const setRemindersEnabled = useMatchStore((s) => s.setRemindersEnabled);
  const reminderTime = useMatchStore((s) => s.reminderTime);
  const setReminderTime = useMatchStore((s) => s.setReminderTime);
  const reminderCadences = useMatchStore((s) => s.reminderCadences);
  const toggleReminderCadence = useMatchStore((s) => s.toggleReminderCadence);

  const [permission, setPermission] = useState<PermissionState>(
    NOTIFICATIONS_SUPPORTED ? 'undetermined' : 'unsupported',
  );
  const [armedCount, setArmedCount] = useState(0);
  const [testSent, setTestSent] = useState(false);

  const readDeviceState = useCallback(async () => {
    setPermission(await getPermissionState());
    setArmedCount(await countScheduled());
  }, []);

  useEffect(() => {
    void readDeviceState();
  }, [readDeviceState]);

  const applySchedule = useCallback(async () => {
    const result = await syncReminders();
    setPermission(result.permission);
    setArmedCount(await countScheduled());
  }, []);

  const onToggleMaster = (value: boolean) => {
    setRemindersEnabled(value);
    void applySchedule();
  };

  const onPickTime = (time: string) => {
    setReminderTime(time);
    void applySchedule();
  };

  const onToggleCadence = (id: CadenceId) => {
    toggleReminderCadence(id);
    void applySchedule();
  };

  const onGrant = () => {
    void (async () => {
      if (permission === 'denied') {
        await Linking.openSettings();
        return;
      }
      const next = await requestPermission();
      setPermission(next);
      if (next === 'granted' && remindersEnabled) await applySchedule();
    })();
  };

  const onTest = () => {
    void (async () => {
      const next = await sendTestNudge();
      setPermission(next);
      if (next === 'granted') {
        setTestSent(true);
        setArmedCount(await countScheduled());
      }
    })();
  };

  const activeCount = REMINDER_CADENCES.filter((c) => reminderCadences[c.id]).length;
  const blocked = remindersEnabled && permission !== 'granted';

  return (
    <ScreenShell
      title="Maintenance Reminders"
      subtitle="The Habits piece, turned into a schedule"
      hint="A plan you have to remember is a plan that fails. Automate the prompts."
    >
      <HudPanel label="Nudges" status={remindersEnabled ? `${armedCount} armed` : 'Off'}>
        <View className="flex-row items-center">
          <View className="flex-1 pr-3">
            <Text className="text-foreground text-base font-semibold">Enable local nudges</Text>
            <BodyText className="text-muted mt-0.5">
              Scheduled by this device, delivered by this device. Nothing is sent anywhere and no
              account is involved.
            </BodyText>
          </View>
          <Switch
            value={remindersEnabled}
            onValueChange={onToggleMaster}
            disabled={!NOTIFICATIONS_SUPPORTED}
            thumbColor={remindersEnabled ? HUD : STEEL}
            trackColor={{ false: LINE, true: HUD_DIM }}
          />
        </View>

        {!NOTIFICATIONS_SUPPORTED ? (
          <View className="border-caution-edge/40 bg-caution-edge/10 mt-4 flex-row items-start gap-2 rounded-xl border p-3">
            <ShieldAlert size={15} color={CAUTION_EDGE} />
            <BodyText className="text-caution-soft flex-1">
              Scheduled nudges need the installed iOS or Android app. The browser preview can hold
              your settings but cannot fire prompts.
            </BodyText>
          </View>
        ) : blocked ? (
          <Pressable
            onPress={onGrant}
            accessibilityRole="button"
            className="border-caution-edge/60 bg-caution-edge/10 mt-4 rounded-xl border p-3 active:opacity-70"
          >
            <View className="flex-row items-start gap-2">
              <ShieldAlert size={15} color={CAUTION_EDGE} />
              <View className="flex-1">
                <Text className="text-caution-soft text-base font-bold">
                  {permission === 'denied'
                    ? 'Notifications are blocked in system settings'
                    : 'One permission left to grant'}
                </Text>
                <BodyText className="text-caution-soft/80 mt-0.5">
                  {permission === 'denied'
                    ? 'Tap to open settings and allow notifications for MATCH Flow.'
                    : 'Tap to allow MATCH Flow to post prompts on this device.'}
                </BodyText>
              </View>
            </View>
          </Pressable>
        ) : remindersEnabled ? (
          <View className="border-hud/30 bg-hud/[0.07] mt-4 flex-row items-center gap-2 rounded-xl border p-3">
            <Check size={15} color={HUD} />
            <BodyText className="text-hud flex-1">
              {activeCount} of {REMINDER_CADENCES.length} cadences armed. Prompts continue even if
              you never open the app.
            </BodyText>
          </View>
        ) : null}

        <Text className="text-muted mt-4 mb-2 text-[10px] font-bold tracking-wider uppercase">
          Preferred time
        </Text>
        <View className="flex-row flex-wrap gap-2">
          {REMINDER_TIMES.map((time) => {
            const on = time === reminderTime;
            return (
              <Pressable
                key={time}
                onPress={() => onPickTime(time)}
                accessibilityRole="button"
                accessibilityState={{ selected: on }}
                className={`rounded-xl border px-3.5 py-2.5 active:opacity-70 ${
                  on ? 'border-hud bg-hud/15' : 'border-border'
                }`}
              >
                <Text className={`text-base font-bold ${on ? 'text-hud' : 'text-muted'}`}>
                  {time}
                </Text>
              </Pressable>
            );
          })}
        </View>
        <BodyText className="text-muted mt-2">
          Daily and weekly nudges land at this time. Refill, restock, and testing prompts run on
          their own interval from the moment you arm them.
        </BodyText>
      </HudPanel>

      <SectionLabel>Cadence plan</SectionLabel>
      {REMINDER_CADENCES.map((item) => {
        const on = reminderCadences[item.id];
        return (
          <View
            key={item.id}
            className="mb-2 rounded-2xl border p-4"
            style={{
              borderColor: `${PIECE_COLOR[item.piece]}${on ? '66' : '2e'}`,
              backgroundColor: `${PANEL}99`,
            }}
          >
            <View className="flex-row items-start gap-3">
              <View
                className="h-9 items-center justify-center rounded-xl px-1.5"
                style={{ backgroundColor: `${PIECE_COLOR[item.piece]}26` }}
              >
                <MatchPiece pieceKey={item.piece} height={26} dimmed={!on} />
              </View>
              <View className="flex-1">
                <Text className="text-foreground text-base font-bold">{item.title}</Text>
                <BodyText className="text-muted mt-0.5">{item.detail}</BodyText>
              </View>
              <Switch
                value={on}
                onValueChange={() => onToggleCadence(item.id)}
                thumbColor={on ? HUD : STEEL}
                trackColor={{ false: LINE, true: HUD_DIM }}
              />
            </View>
            <View className="border-border/60 mt-3 flex-row items-center justify-between border-t pt-2.5">
              <Text className="text-hud/80 text-[10px] font-bold uppercase">
                {RHYTHM_LABEL[item.rhythm]}
              </Text>
              <Text className="text-muted text-[10px]">
                {on && remindersEnabled && permission === 'granted'
                  ? cadenceSchedule(item.rhythm, reminderTime)
                  : 'Not armed'}
              </Text>
            </View>
          </View>
        );
      })}

      {NOTIFICATIONS_SUPPORTED ? (
        <>
          <SectionLabel>Dry run</SectionLabel>
          <Pressable
            onPress={onTest}
            accessibilityRole="button"
            className="border-hud/40 bg-hud/10 flex-row items-center gap-3 rounded-2xl border p-4 active:opacity-70"
          >
            <View className="bg-hud/20 h-10 w-10 items-center justify-center rounded-xl">
              <BellRing size={18} color={HUD} />
            </View>
            <View className="flex-1">
              <Text className="text-hud text-base font-bold">
                {testSent ? 'Test nudge queued' : 'Send a test nudge'}
              </Text>
              <BodyText className="text-muted mt-0.5">
                {testSent
                  ? 'It lands in a few seconds — leave the app to see it on your lock screen.'
                  : 'Fires once, a few seconds from now, so you know exactly what to expect.'}
              </BodyText>
            </View>
          </Pressable>
          {Platform.OS === 'ios' ? (
            <BodyText className="text-muted mt-2">
              iOS delivers scheduled prompts on its own timing when the device is in Low Power Mode
              or Focus.
            </BodyText>
          ) : null}
        </>
      ) : null}
    </ScreenShell>
  );
}
