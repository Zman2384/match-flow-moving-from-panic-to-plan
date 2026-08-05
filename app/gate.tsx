import { router } from 'expo-router';
import { ShieldCheck } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { HudBackdrop } from '@/components/HudBackdrop';
import { MATCH_PIECES } from '@/lib/match';
import { useMatchStore } from '@/lib/store';

const CHECKS = [
  {
    id: 'age',
    label: 'I am 18 or older',
    detail: 'This app discusses adult sexual health in explicit, clinical terms.',
  },
  {
    id: 'edu',
    label: 'I understand this is educational',
    detail: 'MATCH Flow is not medical advice and does not replace a clinician.',
  },
  {
    id: 'local',
    label: 'I know my data stays on this device',
    detail: 'Nothing you enter is uploaded. Wiping the app wipes the data.',
  },
];

export default function GateScreen() {
  const insets = useSafeAreaInsets();
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const confirmAge = useMatchStore((s) => s.confirmAge);
  const allChecked = CHECKS.every((c) => checked[c.id]);

  return (
    <View className="bg-background flex-1">
      <HudBackdrop />
      <ScrollView
        contentContainerStyle={{
          paddingTop: insets.top + 48,
          paddingBottom: insets.bottom + 40,
          paddingHorizontal: 24,
        }}
        showsVerticalScrollIndicator={false}
      >
        <View className="items-center">
          <View className="border-hud/40 bg-hud/10 h-16 w-16 items-center justify-center rounded-2xl border">
            <ShieldCheck size={30} color="#00e5ff" />
          </View>
          <Text className="text-foreground mt-5 text-3xl font-bold">MATCH Flow</Text>
          <Text className="text-hud mt-1 text-[11px] font-bold tracking-[3px] uppercase">
            Layered protection system
          </Text>
          <Text className="text-muted mt-4 text-center text-sm leading-5">
            Five puzzle pieces — Medications, Awareness, Tools, Communication, Habits — stacked into
            one shield. No single layer has to be perfect.
          </Text>
        </View>

        <View className="mt-7 flex-row justify-center gap-2">
          {MATCH_PIECES.map((piece) => (
            <View
              key={piece.key}
              className="h-10 w-10 items-center justify-center rounded-xl border"
              style={{ backgroundColor: `${piece.color}22`, borderColor: `${piece.color}66` }}
            >
              <Text className="text-base font-bold" style={{ color: piece.color }}>
                {piece.key}
              </Text>
            </View>
          ))}
        </View>

        <View className="mt-8 gap-3">
          {CHECKS.map((check) => {
            const on = checked[check.id];
            return (
              <Pressable
                key={check.id}
                onPress={() => setChecked((prev) => ({ ...prev, [check.id]: !prev[check.id] }))}
                className={`flex-row items-start gap-3 rounded-2xl border p-4 active:opacity-70 ${
                  on ? 'border-hud/60 bg-hud/10' : 'border-border bg-panel/60'
                }`}
              >
                <View
                  className={`mt-0.5 h-5 w-5 items-center justify-center rounded-md border ${
                    on ? 'border-hud bg-hud' : 'border-border'
                  }`}
                >
                  {on ? <Text className="text-abyss text-[11px] font-bold">✓</Text> : null}
                </View>
                <View className="flex-1">
                  <Text className="text-foreground text-sm font-semibold">{check.label}</Text>
                  <Text className="text-muted mt-1 text-[11px] leading-4">{check.detail}</Text>
                </View>
              </Pressable>
            );
          })}
        </View>

        <Pressable
          disabled={!allChecked}
          onPress={() => {
            confirmAge();
            router.replace('/(tabs)');
          }}
          className={`mt-7 items-center rounded-2xl py-4 ${
            allChecked ? 'bg-hud active:opacity-80' : 'bg-panel-deep'
          }`}
        >
          <Text
            className={`text-sm font-bold tracking-widest uppercase ${
              allChecked ? 'text-abyss' : 'text-muted'
            }`}
          >
            Enter command center
          </Text>
        </Pressable>

        <Text className="text-muted mt-6 text-center text-[10px] leading-4">
          In an emergency, call your local emergency number. For exposure within 72 hours, go to the
          nearest emergency department and ask about PEP.
        </Text>
      </ScrollView>
    </View>
  );
}
