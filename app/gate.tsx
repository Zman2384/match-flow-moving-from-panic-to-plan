import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BackChip } from '@/components/BackChip';
import { MatchFlowHero, MatchWordmark } from '@/components/BrandArt';
import { HudBackdrop } from '@/components/HudBackdrop';
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
  const confirmAge = useMatchStore((s) => s.confirmAge);
  const ageConfirmed = useMatchStore((s) => s.ageConfirmed);
  const [checked, setChecked] = useState<Record<string, boolean>>(() =>
    ageConfirmed ? Object.fromEntries(CHECKS.map((c) => [c.id, true])) : {},
  );
  const allChecked = CHECKS.every((c) => checked[c.id]);

  return (
    <View className="bg-background flex-1">
      <HudBackdrop />
      <ScrollView
        contentContainerStyle={{
          paddingTop: insets.top + 24,
          paddingBottom: insets.bottom + 40,
          paddingHorizontal: 24,
        }}
        showsVerticalScrollIndicator={false}
      >
        {ageConfirmed ? <BackChip className="mb-5" /> : null}

        <View className="items-center">
          <MatchFlowHero />
          <Text className="text-hud mt-5 text-[11px] font-bold tracking-[3px] uppercase">
            Layered protection system
          </Text>
          <Text className="text-muted mt-3 text-center text-sm leading-5">
            Five puzzle pieces — Medications, Awareness, Tools, Communication, Habits — stacked into
            one shield. No single layer has to be perfect.
          </Text>
        </View>

        <MatchWordmark className="mt-6" />

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

        <View className="border-border bg-panel/40 mt-4 rounded-2xl border p-4">
          <Text className="text-muted text-[11px] leading-4">
            By continuing you agree to the Terms of Service and confirm you have read the Privacy
            Policy and Medical Disclaimer.
          </Text>
          <View className="mt-3 flex-row flex-wrap gap-2">
            <GateLegalLink label="Terms of Service" docId="terms" />
            <GateLegalLink label="Privacy Policy" docId="privacy" />
            <GateLegalLink label="Medical Disclaimer" docId="medical" />
          </View>
          <Pressable
            onPress={() => router.push('/legal')}
            hitSlop={8}
            accessibilityRole="link"
            className="mt-3 self-start active:opacity-70"
          >
            <Text className="text-hud text-[11px] font-semibold">
              All legal & compliance documents →
            </Text>
          </Pressable>
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
            {ageConfirmed ? 'Back to command center' : 'Enter command center'}
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

function GateLegalLink({ label, docId }: { label: string; docId: string }) {
  return (
    <Pressable
      onPress={() => router.push({ pathname: '/legal/[doc]', params: { doc: docId } })}
      hitSlop={8}
      accessibilityRole="link"
      accessibilityLabel={`Read the ${label}`}
      className="border-hud/40 bg-hud/10 rounded-full border px-3 py-1.5 active:opacity-70"
    >
      <Text className="text-hud text-[10px] font-bold">{label}</Text>
    </Pressable>
  );
}
