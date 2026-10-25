import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Image, Pressable, ScrollView, Text, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BackChip } from '@/components/BackChip';
import { MatchFlowHero, MatchFlowIcon, MatchFrameworkTitle } from '@/components/BrandArt';
import { MatchFlowWordmark } from '@/components/MatchFlowWordmark';
import { HudBackdrop } from '@/components/HudBackdrop';
import { BodyText, BrandFooter, Disclaimer } from '@/components/ScreenShell';
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
    label: 'I understand my privacy choices',
    detail:
      'Plans and Ghost Audits are saved here. Lil Z starts on-device; optional live AI sends chat context off-device. Device backups may keep a separate copy.',
  },
];

export default function GateScreen() {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const shieldWidth = Math.min(Math.max(width - 48, 0), 520);
  const confirmAge = useMatchStore((s) => s.confirmAge);
  const revokeAge = useMatchStore((s) => s.revokeAge);
  const ageConfirmed = useMatchStore((s) => s.ageConfirmed);
  // Boxes start unchecked. They show as checked only when this device has a completed gate on
  // file (the user's own stored answers), never as a default.
  const [checked, setChecked] = useState<Record<string, boolean>>(() =>
    ageConfirmed ? Object.fromEntries(CHECKS.map((c) => [c.id, true])) : {},
  );
  const allChecked = CHECKS.every((c) => checked[c.id]);

  // Stored consent can arrive after first render (storage hydrates async). Reflect it once it does.
  useEffect(() => {
    if (ageConfirmed) setChecked(Object.fromEntries(CHECKS.map((c) => [c.id, true])));
  }, [ageConfirmed]);

  const toggle = (id: string) => {
    const next = !checked[id];
    setChecked((prev) => ({ ...prev, [id]: next }));
    // Unchecking any box withdraws consent: every route back into the app stays closed until
    // the user completes the gate again (M-1).
    if (!next && ageConfirmed) revokeAge();
  };

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
        {ageConfirmed && allChecked ? <BackChip className="mb-5" /> : null}

        <View className="items-center">
          <View className="mb-4 w-full max-w-[520px] flex-row items-center gap-3 self-center">
            <MatchFlowIcon width={76} />
            <View className="flex-1">
              <MatchFlowWordmark />
            </View>
          </View>
          <MatchFlowHero />
          <BodyText className="text-foreground mt-5 text-center">
            Build your protection plan, stress-test it, and practice the words — before the moment,
            not during it.
          </BodyText>
          <Text className="text-hud mt-5 font-mono text-[11px] tracking-[3px] uppercase">
            Layered protection system
          </Text>
          <BodyText className="text-muted mt-3 text-center">
            Five puzzle pieces — Medications, Awareness, Tools, Communication, Habits — stacked into
            one shield. No single layer has to be perfect.
          </BodyText>
        </View>

        <MatchFrameworkTitle className="mt-6" />
        <Image
          source={require('../assets/match-framework-shield-pieces.webp')}
          className="mt-3 self-center"
          style={{ width: shieldWidth, height: shieldWidth * (1030 / 1830) }}
          resizeMode="contain"
          accessibilityLabel="Metallic MATCH shield with five colored interlocking protection pieces"
        />

        <Disclaimer className="mt-6" />

        <View className="mt-8 gap-3">
          {CHECKS.map((check) => {
            const on = checked[check.id];
            return (
              <Pressable
                key={check.id}
                onPress={() => toggle(check.id)}
                accessibilityRole="checkbox"
                accessibilityState={{ checked: on }}
                accessibilityLabel={check.label}
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
                  <Text className="text-foreground text-base font-semibold">{check.label}</Text>
                  <BodyText className="text-muted mt-1">{check.detail}</BodyText>
                </View>
              </Pressable>
            );
          })}
        </View>

        <View className="border-border bg-panel/40 mt-4 rounded-2xl border p-4">
          <BodyText className="text-muted">
            By continuing you agree to the Terms of Service and confirm you have read the Privacy
            Policy and Medical Disclaimer.
          </BodyText>
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
            <Text className="text-hud text-[13px] font-semibold">
              All legal & compliance documents →
            </Text>
          </Pressable>
        </View>

        <Pressable
          disabled={!allChecked}
          accessibilityRole="button"
          accessibilityState={{ disabled: !allChecked }}
          accessibilityHint={allChecked ? undefined : 'Confirm all three items to continue.'}
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
        {allChecked ? null : (
          <Text className="text-muted mt-2 text-center text-[12px]">
            Confirm all three items to continue.
          </Text>
        )}

        <BodyText className="text-muted mt-6 text-center">
          In an emergency, call your local emergency number. If a possible HIV exposure is inside 72
          hours, go to an emergency department now and ask to be evaluated for PEP. Do not delay
          care.
        </BodyText>

        <BrandFooter />
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
