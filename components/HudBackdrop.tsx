import { View } from 'react-native';

/**
 * Fixed HUD grid + vignette used behind every screen.
 * Purely decorative and non-interactive.
 */
export function HudBackdrop() {
  return (
    <View pointerEvents="none" className="absolute inset-0">
      {Array.from({ length: 26 }, (_, row) => row * 40).map((top) => (
        <View
          key={`h-${top}`}
          className="bg-hud/[0.06] absolute right-0 left-0 h-px"
          style={{ top }}
        />
      ))}
      {Array.from({ length: 14 }, (_, col) => col * 40).map((left) => (
        <View
          key={`v-${left}`}
          className="bg-hud/[0.06] absolute top-0 bottom-0 w-px"
          style={{ left }}
        />
      ))}
      <View className="bg-hud/[0.07] absolute -top-24 -left-24 h-64 w-64 rounded-full blur-3xl" />
    </View>
  );
}
