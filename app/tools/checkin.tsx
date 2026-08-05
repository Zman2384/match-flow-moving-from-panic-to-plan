import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, Text, TextInput, View } from 'react-native';

import { Disclaimer, HudPanel, ScreenShell, SectionLabel } from '@/components/ScreenShell';
import { MATCH_PIECES, type PieceKey } from '@/lib/match';
import { useMatchStore } from '@/lib/store';

const ITEMS: { id: string; piece: PieceKey; label: string; detail: string }[] = [
  {
    id: 'm',
    piece: 'M',
    label: 'Medication supply covers the next 14 days',
    detail: 'Count what is left, not what you remember buying.',
  },
  {
    id: 'a',
    piece: 'A',
    label: 'My next test is on the calendar',
    detail: 'A date, not an intention.',
  },
  {
    id: 't',
    piece: 'T',
    label: 'Barriers and lube restocked and in date',
    detail: 'Check expiry printed on the wrapper.',
  },
  {
    id: 'c',
    piece: 'C',
    label: 'I said something honest about a limit this week',
    detail: 'Practice keeps the language available.',
  },
  {
    id: 'h',
    piece: 'H',
    label: 'Reminders and check-out habits still working',
    detail: 'If you ignored them, change the time.',
  },
];

export default function CheckInScreen() {
  const [checks, setChecks] = useState<Record<string, boolean>>({});
  const [note, setNote] = useState('');
  const addCheckIn = useMatchStore((s) => s.addCheckIn);
  const checkIns = useMatchStore((s) => s.checkIns);

  const completed = ITEMS.filter((item) => checks[item.id]).length;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flex: 1 }}
    >
      <ScreenShell
        title="Weekly Check-In"
        subtitle="Five items, one per MATCH piece"
        hint="Protection decays quietly. This is the sweep that catches it."
      >
        <HudPanel label="This week" status={`${completed}/${ITEMS.length}`}>
          <View className="bg-panel-deep h-2 w-full overflow-hidden rounded-full">
            <View
              className="bg-hud h-2 rounded-full"
              style={{ width: `${(completed / ITEMS.length) * 100}%` }}
            />
          </View>
        </HudPanel>

        <SectionLabel>Sweep</SectionLabel>
        {ITEMS.map((item) => {
          const on = checks[item.id];
          const color = MATCH_PIECES.find((p) => p.key === item.piece)?.color ?? '#00e5ff';
          return (
            <Pressable
              key={item.id}
              onPress={() => setChecks((prev) => ({ ...prev, [item.id]: !prev[item.id] }))}
              className={`mb-2 flex-row items-start gap-3 rounded-2xl border p-4 active:opacity-70 ${
                on ? 'bg-panel' : 'border-border/70 bg-panel/40'
              }`}
              style={on ? { borderColor: color } : undefined}
            >
              <View
                className="mt-0.5 h-5 w-5 items-center justify-center rounded-md border"
                style={{
                  borderColor: on ? color : '#33506b',
                  backgroundColor: on ? color : 'transparent',
                }}
              >
                {on ? <Text className="text-[11px] font-bold text-black">✓</Text> : null}
              </View>
              <View className="flex-1">
                <Text className="text-[10px] font-bold" style={{ color }}>
                  {item.piece}
                </Text>
                <Text
                  className={`mt-0.5 text-[13px] font-semibold ${
                    on ? 'text-foreground' : 'text-muted'
                  }`}
                >
                  {item.label}
                </Text>
                <Text className="text-muted mt-0.5 text-[11px]">{item.detail}</Text>
              </View>
            </Pressable>
          );
        })}

        <SectionLabel>Note to future you</SectionLabel>
        <TextInput
          value={note}
          onChangeText={setNote}
          placeholder="What almost slipped this week?"
          placeholderTextColorClassName="accent-muted"
          multiline
          className="border-border bg-panel-deep text-foreground min-h-[88px] rounded-2xl border px-3 py-3 text-sm"
          style={{ textAlignVertical: 'top' }}
        />

        <Pressable
          onPress={() => {
            addCheckIn({ completed, total: ITEMS.length, note: note.trim() });
            setChecks({});
            setNote('');
          }}
          className="bg-hud mt-4 items-center rounded-2xl py-4 active:opacity-80"
        >
          <Text className="text-abyss text-xs font-bold tracking-widest uppercase">
            Save check-in
          </Text>
        </Pressable>

        {checkIns.length > 0 ? (
          <>
            <SectionLabel>History</SectionLabel>
            {checkIns.slice(0, 8).map((entry) => (
              <View
                key={entry.id}
                className="border-border bg-panel/60 mb-2 rounded-2xl border p-4"
              >
                <View className="flex-row items-center justify-between">
                  <Text className="text-muted text-[11px]">
                    {new Date(entry.date).toLocaleDateString()}
                  </Text>
                  <Text className="text-hud text-[12px] font-bold">
                    {entry.completed}/{entry.total}
                  </Text>
                </View>
                {entry.note ? (
                  <Text className="text-foreground mt-1.5 text-[12px] leading-5">{entry.note}</Text>
                ) : null}
              </View>
            ))}
          </>
        ) : null}

        <Disclaimer />
      </ScreenShell>
    </KeyboardAvoidingView>
  );
}
