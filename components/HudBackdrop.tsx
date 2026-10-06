import { useWindowDimensions, View } from 'react-native';

import { LinearGradient } from '@/components/ui/primitives/LinearGradient';

/** Deterministic pseudo-random so the starfield never reshuffles between renders. */
function hash(seed: number) {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}

const STAR_COUNT = 64;

/** Fixed navy-to-black starfield behind every screen. Purely decorative. */
export function HudBackdrop() {
  const { width, height } = useWindowDimensions();

  const starfieldHeight = height * 0.52;

  const stars = Array.from({ length: STAR_COUNT }, (_, i) => {
    const seed = i * 3.3;
    const depth = hash(seed);
    return {
      seed,
      left: hash(i * 1.7) * width,
      top: hash(i * 2.1) * starfieldHeight,
      size: depth < 0.75 ? 1 : 2,
      opacity: 0.18 + depth * 0.5,
    };
  });

  return (
    <View pointerEvents="none" className="absolute inset-0 overflow-hidden">
      {/* Navy-to-black vertical fall. */}
      <LinearGradient
        colors={['#0d1a2e', '#081426', '#030d1a'] as const}
        locations={[0, 0.55, 1] as const}
        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
      />

      {/* Starfield above the horizon. */}
      {stars.map((star) => (
        <View
          key={`star-${star.seed}`}
          className="absolute rounded-full bg-white"
          style={{
            left: star.left,
            top: star.top,
            width: star.size,
            height: star.size,
            opacity: star.opacity,
          }}
        />
      ))}

      {/* Signal vignette. */}
      <View className="bg-hud/[0.07] absolute -top-24 -left-24 h-64 w-64 rounded-full blur-3xl" />
    </View>
  );
}
