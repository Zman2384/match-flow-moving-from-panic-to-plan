import type { Href } from 'expo-router';
import type { ReactNode } from 'react';
import type { StyleProp, TextStyle } from 'react-native';
import { ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BackChip, isCommandCenter } from '@/components/BackChip';
import { HudBackdrop } from '@/components/HudBackdrop';
import { LilZDock } from '@/components/LilZ';

interface ScreenShellProps {
  title: string;
  subtitle?: string;
  hint?: string;
  children: ReactNode;
  /** Render children without a ScrollView (for FlatList screens). */
  plain?: boolean;
  showBack?: boolean;
  /** Label on the back chip. Defaults to the Command Center. */
  backLabel?: string;
  /** Where back goes when the screen was opened directly with no history. */
  backHref?: Href;
  /** Floating Lil Z dock. Off for screens whose own controls sit bottom-left. */
  showGuide?: boolean;
}

export function ScreenShell({
  title,
  subtitle,
  hint,
  children,
  plain = false,
  showBack = true,
  backLabel = 'Command Center',
  backHref = '/(tabs)',
  showGuide = true,
}: ScreenShellProps) {
  const insets = useSafeAreaInsets();

  const header = (
    <View className="px-5 pt-2 pb-4">
      {showBack ? (
        <View className="mb-3 flex-row flex-wrap items-center gap-2">
          <BackChip label={backLabel} href={backHref} />
          {isCommandCenter(backHref) ? null : (
            <BackChip label="Command Center" href="/(tabs)" mode="jump" />
          )}
        </View>
      ) : null}
      <Text className="text-foreground text-2xl font-bold">{title}</Text>
      {subtitle ? <BodyText className="text-muted mt-1">{subtitle}</BodyText> : null}
      {hint ? (
        <View className="border-hud/25 bg-hud/[0.07] mt-3 flex-row items-center gap-2 rounded-xl border px-3 py-2">
          <Text className="text-hud text-[13px] font-semibold">💡 {hint}</Text>
        </View>
      ) : null}
      <Disclaimer compact className="mt-3" />
    </View>
  );

  return (
    <View className="bg-background flex-1">
      <HudBackdrop />
      <View className="flex-1" style={{ paddingTop: insets.top + 8 }}>
        {plain ? (
          <>
            {header}
            <View className="flex-1">{children}</View>
            <BrandFooter className="px-5 pb-2" />
          </>
        ) : (
          <ScrollView
            contentContainerStyle={{ paddingBottom: insets.bottom + (showGuide ? 96 : 40) }}
            showsVerticalScrollIndicator={false}
          >
            {header}
            <View className="px-5">{children}</View>
            <BrandFooter className="px-5" />
          </ScrollView>
        )}
      </View>
      {showGuide ? <LilZDock bottomOffset={insets.bottom + 16} /> : null}
    </View>
  );
}

/** Bordered HUD panel with an optional status strip header. */
export function HudPanel({
  label,
  status,
  children,
  className = '',
}: {
  label?: string;
  status?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <View
      className={`border-hud/25 bg-panel-deep/80 overflow-hidden rounded-3xl border ${className}`}
    >
      {label ? (
        <View className="border-hud/20 flex-row items-center justify-between border-b bg-black/25 px-4 py-3">
          <View className="flex-row items-center gap-2">
            <View className="bg-hud h-1.5 w-1.5 rounded-full" />
            <Text className="text-hud text-[10px] font-bold tracking-[2px] uppercase">{label}</Text>
          </View>
          {status ? <Text className="text-hud/60 text-[10px] font-semibold">{status}</Text> : null}
        </View>
      ) : null}
      <View className="p-4">{children}</View>
    </View>
  );
}

export function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <Text className="text-hud/70 mt-6 mb-3 text-[11px] font-bold tracking-[2px] uppercase">
      {children}
    </Text>
  );
}

/**
 * Body copy at the brand minimum: Bree Serif, 16pt, generous leading.
 * Use for every paragraph, description and helper line — HUD micro-labels
 * and numeric readouts keep their own tighter treatment.
 */
export function BodyText({
  children,
  className = '',
  style,
}: {
  children: ReactNode;
  className?: string;
  style?: StyleProp<TextStyle>;
}) {
  return (
    <Text className={`font-body text-base leading-6 ${className}`} style={style}>
      {children}
    </Text>
  );
}

/**
 * Mandated yellow/orange safety banner. `compact` is the always-on header
 * form; the full form carries the emergency and data-sovereignty lines too.
 */
export function Disclaimer({
  compact = false,
  className = '',
}: {
  compact?: boolean;
  className?: string;
}) {
  return (
    <View
      className={`border-caution-edge/50 bg-caution-edge/[0.1] flex-row items-start gap-2.5 rounded-2xl border px-3.5 py-3 ${className}`}
    >
      <View className="bg-caution mt-1.5 h-2 w-2 rounded-full" />
      <View className="flex-1">
        <Text className="text-caution text-[13px] font-bold tracking-[0.6px] uppercase">
          Educational Tool — Not Medical Advice
        </Text>
        <BodyText className="text-caution-soft mt-1">
          {compact
            ? 'Consult a qualified healthcare provider for prescriptions, diagnoses and any medical decision.'
            : 'Consult a qualified healthcare provider for prescriptions, diagnoses and any medical decision. In an emergency call your local emergency number or go to the nearest emergency department. Everything you enter stays on this device.'}
        </BodyText>
      </View>
    </View>
  );
}

/** Mandated brand footer. The wording is fixed — do not reword or split it. */
export function BrandFooter({ className = '' }: { className?: string }) {
  return (
    <View className={`border-hud/15 mt-8 items-center border-t pt-5 ${className}`}>
      <Text className="font-body text-muted text-center text-[13px] leading-5">
        The HARNESS Project LLC | theharnessproject.org. For educational purposes only. Not medical
        advice. © 2026 Christopher Zacharie.
      </Text>
    </View>
  );
}
