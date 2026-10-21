import { Surface } from 'heroui-native/surface';
import type { LucideIcon } from 'lucide-react-native';
import { Text, View } from 'react-native';

import { HUD } from '@/lib/palette';

/** Native equivalent of .chapter-hero: 190pt floor, 15% decorative icon. */
export function ChapterHero({
  title,
  subtitle,
  icon: Icon,
}: {
  title: string;
  subtitle?: string;
  icon: LucideIcon;
}) {
  return (
    <Surface className="border-hud/30 bg-panel-deep/80 relative min-h-[190px] justify-end overflow-hidden rounded-3xl border p-5">
      <View
        className="absolute top-3 right-3"
        style={{ opacity: 0.15 }}
        pointerEvents="none"
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
      >
        <Icon size={142} color={HUD} strokeWidth={1} />
      </View>
      <View className="bg-hud mb-4 h-1 w-12 rounded-full" />
      <Text
        accessibilityRole="header"
        className="text-foreground font-display text-3xl tracking-wide"
      >
        {title}
      </Text>
      {subtitle ? (
        <Text className="font-body text-foreground/80 mt-2 text-base leading-6">{subtitle}</Text>
      ) : null}
    </Surface>
  );
}
