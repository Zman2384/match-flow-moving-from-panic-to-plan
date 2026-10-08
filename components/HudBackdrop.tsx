import { useWindowDimensions, View } from 'react-native';

import { LinearGradient } from '@/components/ui/primitives/LinearGradient';
import { Svg, Path } from '@/components/ui/primitives/Svg';
import { ABYSS, HUD, NAVY, PANEL_DEEP } from '@/lib/palette';

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
  const horizon = height * 0.62;
  const floorHeight = height - horizon;
  const floorLines = [0.008, 0.018, 0.035, 0.06, 0.1, 0.15, 0.22, 0.31, 0.42, 0.55, 0.71, 0.9];
  const gridPath = [
    ...Array.from({ length: 25 }, (_, i) => {
      const offset = (i - 12) * width * 0.16;
      return `M ${width / 2 + offset * 0.045} ${horizon} L ${width / 2 + offset} ${height}`;
    }),
    ...floorLines.map((depth) => `M 0 ${horizon + depth * floorHeight} H ${width}`),
  ].join(' ');

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
        colors={[NAVY, PANEL_DEEP, ABYSS] as const}
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

      {/* A low-luminance perspective floor keeps text and emergency controls dominant. */}
      <Svg width={width} height={height} style={{ position: 'absolute' }}>
        <Path d={gridPath} stroke={HUD} strokeWidth={0.7} opacity={0.14} fill="none" />
      </Svg>

      {/* Signal vignette. */}
      <View className="bg-hud/[0.07] absolute -top-24 -left-24 h-64 w-64 rounded-full blur-3xl" />
    </View>
  );
}
