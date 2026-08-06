import { ChevronLeft } from 'lucide-react-native';
import type { Href } from 'expo-router';
import type { ReactNode } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { HudBackdrop } from '@/components/HudBackdrop';
import { goBackOrReplace } from '@/lib/navigation';

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
}: ScreenShellProps) {
  const insets = useSafeAreaInsets();

  const header = (
    <View className="px-5 pt-2 pb-4">
      {showBack ? (
        <Pressable
          onPress={() => goBackOrReplace(backHref)}
          hitSlop={10}
          className="border-hud/30 bg-hud/10 mb-3 flex-row items-center gap-1 self-start rounded-full border px-3 py-1.5 active:opacity-70"
        >
          <ChevronLeft size={14} color="#00e5ff" />
          <Text className="text-hud text-[11px] font-semibold">{backLabel}</Text>
        </Pressable>
      ) : null}
      <Text className="text-foreground text-2xl font-bold">{title}</Text>
      {subtitle ? <Text className="text-muted mt-1 text-xs">{subtitle}</Text> : null}
      {hint ? (
        <View className="border-hud/25 bg-hud/[0.07] mt-3 flex-row items-center gap-2 rounded-xl border px-3 py-2">
          <Text className="text-hud text-[11px] font-semibold">💡 {hint}</Text>
        </View>
      ) : null}
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
          </>
        ) : (
          <ScrollView
            contentContainerStyle={{ paddingBottom: insets.bottom + 40 }}
            showsVerticalScrollIndicator={false}
          >
            {header}
            <View className="px-5">{children}</View>
          </ScrollView>
        )}
      </View>
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
          {status ? <Text className="text-hud/60 text-[9px] font-semibold">{status}</Text> : null}
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

export function Disclaimer() {
  return (
    <View className="border-border/60 mt-8 rounded-2xl border border-dashed p-4">
      <Text className="text-muted text-[11px] leading-5">
        Educational tool only — not medical advice. In an emergency call your local emergency number
        or go to the nearest emergency department. Everything you enter stays on this device.
      </Text>
    </View>
  );
}
