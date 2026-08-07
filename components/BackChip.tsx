import { router, type Href } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import { Pressable, Text } from 'react-native';

import { goBackOrReplace } from '@/lib/navigation';

const HUD = '#00e5ff';

export type BackChipMode = 'history' | 'jump' | 'push';

interface BackChipProps {
  /** Destination name shown on the chip. */
  label?: string;
  href?: Href;
  /**
   * history — pop the stack, falling back to href when opened directly.
   * jump    — go straight to href (tab-to-tab moves, no stack to pop).
   * push    — open href as a new screen (gate review from the Command Center).
   */
  mode?: BackChipMode;
  className?: string;
}

export function BackChip({
  label = 'Command Center',
  href = '/(tabs)',
  mode = 'history',
  className = '',
}: BackChipProps) {
  const onPress = () => {
    if (mode === 'jump') router.navigate(href);
    else if (mode === 'push') router.push(href);
    else goBackOrReplace(href);
  };

  return (
    <Pressable
      onPress={onPress}
      hitSlop={10}
      accessibilityRole="button"
      accessibilityLabel={`Back to ${label}`}
      className={`border-hud/30 bg-hud/10 flex-row items-center gap-1 self-start rounded-full border px-3 py-1.5 active:opacity-70 ${className}`}
    >
      <ChevronLeft size={14} color={HUD} />
      <Text className="text-hud text-[11px] font-semibold">{label}</Text>
    </Pressable>
  );
}

/** True when the chip target already is the Command Center tab. */
export function isCommandCenter(href: Href) {
  return typeof href === 'string' && (href === '/' || href.startsWith('/(tabs)'));
}
