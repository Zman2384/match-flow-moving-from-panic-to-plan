import { Pressable, Switch, Text, View } from 'react-native';

import { Disclaimer, HudPanel, ScreenShell, SectionLabel } from '@/components/ScreenShell';
import { PIECE_COLOR, type PieceKey } from '@/lib/match';
import { useMatchStore } from '@/lib/store';

const TIMES = ['07:00', '09:00', '12:00', '18:00', '21:00'];

const CADENCES: { id: string; piece: PieceKey; title: string; detail: string; every: string }[] = [
  {
    id: 'dose',
    piece: 'M',
    title: 'Daily dose',
    detail: 'One prompt at the same time every day beats willpower.',
    every: 'Daily',
  },
  {
    id: 'refill',
    piece: 'M',
    title: 'Refill window',
    detail: 'Order at 14 days remaining, not at zero.',
    every: 'Monthly',
  },
  {
    id: 'restock',
    piece: 'T',
    title: 'Supply restock',
    detail: 'Count barriers and lube, check expiry dates.',
    every: 'Monthly',
  },
  {
    id: 'test',
    piece: 'A',
    title: 'Testing cadence',
    detail: 'Every 3 months is a common default; adjust with your clinician.',
    every: 'Quarterly',
  },
  {
    id: 'sweep',
    piece: 'H',
    title: 'Weekly sweep',
    detail: 'The five-item check-in that keeps every layer alive.',
    every: 'Weekly',
  },
];

export default function RemindersScreen() {
  const remindersEnabled = useMatchStore((s) => s.remindersEnabled);
  const setRemindersEnabled = useMatchStore((s) => s.setRemindersEnabled);
  const reminderTime = useMatchStore((s) => s.reminderTime);
  const setReminderTime = useMatchStore((s) => s.setReminderTime);

  return (
    <ScreenShell
      title="Maintenance Reminders"
      subtitle="The Habits piece, turned into a schedule"
      hint="A plan you have to remember is a plan that fails. Automate the prompts."
    >
      <HudPanel label="Nudges" status={remindersEnabled ? 'On' : 'Off'}>
        <View className="flex-row items-center">
          <View className="flex-1 pr-3">
            <Text className="text-foreground text-sm font-semibold">Enable local nudges</Text>
            <Text className="text-muted mt-0.5 text-[11px] leading-4">
              Prompts stay on this device. Nothing is sent anywhere.
            </Text>
          </View>
          <Switch
            value={remindersEnabled}
            onValueChange={setRemindersEnabled}
            thumbColor={remindersEnabled ? '#00e5ff' : '#94a3b8'}
            trackColor={{ false: '#1c3a55', true: '#0a4f63' }}
          />
        </View>

        <Text className="text-muted mt-4 mb-2 text-[10px] font-bold tracking-wider uppercase">
          Preferred time
        </Text>
        <View className="flex-row flex-wrap gap-2">
          {TIMES.map((time) => {
            const on = time === reminderTime;
            return (
              <Pressable
                key={time}
                onPress={() => setReminderTime(time)}
                className={`rounded-xl border px-3.5 py-2.5 active:opacity-70 ${
                  on ? 'border-hud bg-hud/15' : 'border-border'
                }`}
              >
                <Text className={`text-[12px] font-bold ${on ? 'text-hud' : 'text-muted'}`}>
                  {time}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </HudPanel>

      <SectionLabel>Cadence plan</SectionLabel>
      {CADENCES.map((item) => (
        <View
          key={item.id}
          className="mb-2 flex-row items-start gap-3 rounded-2xl border p-4"
          style={{ borderColor: `${PIECE_COLOR[item.piece]}44`, backgroundColor: '#0b1c3199' }}
        >
          <View
            className="h-9 w-9 items-center justify-center rounded-xl"
            style={{ backgroundColor: `${PIECE_COLOR[item.piece]}26` }}
          >
            <Text className="text-sm font-bold" style={{ color: PIECE_COLOR[item.piece] }}>
              {item.piece}
            </Text>
          </View>
          <View className="flex-1">
            <Text className="text-foreground text-[13px] font-bold">{item.title}</Text>
            <Text className="text-muted mt-0.5 text-[11px] leading-4">{item.detail}</Text>
          </View>
          <Text className="text-hud/80 text-[10px] font-bold uppercase">{item.every}</Text>
        </View>
      ))}

      <Disclaimer />
    </ScreenShell>
  );
}
