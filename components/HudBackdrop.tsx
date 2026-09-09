import { useWindowDimensions, View } from 'react-native';

import { LinearGradient } from '@/components/ui/primitives/LinearGradient';

/** Deterministic pseudo-random so the starfield never reshuffles between renders. */
function hash(seed: number) {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}

const STAR_COUNT = 64;

/**
 * Fixed atmosphere behind every screen: a dark navy-to-black starfield with a
 * high-density, perspective-warped digital grid floor. Purely decorative and
 * non-interactive.
 */
export function HudBackdrop() {
  const { width, height } = useWindowDimensions();

  // The grid floor occupies the lower band; its horizon sits where the
  // starfield fades out.
  const horizon = height * 0.52;
  const floorHeight = height - horizon;

  // Horizontal rails: spacing grows with the square of depth so the floor
  // reads as receding rather than flat.
  const rails = Array.from({ length: 22 }, (_, i) => {
    const t = (i + 1) / 22;
    return {
      top: horizon + floorHeight * t * t,
      opacity: 0.04 + t * 0.14,
    };
  });

  // Verticals converge on a single vanishing point on the horizon.
  const vanishX = width / 2;
  const lanes = Array.from({ length: 19 }, (_, i) => {
    const t = (i - 9) / 9;
    // Cubic spread pushes lanes toward the screen edges at the near plane,
    // giving the high-density centre the brand's warped look.
    const bottomX = vanishX + t * width * 1.35 * (0.45 + 0.55 * Math.abs(t));
    const dx = bottomX - vanishX;
    const angle = Math.atan2(floorHeight, dx);
    const length = Math.hypot(dx, floorHeight);
    return {
      length,
      rotate: `${90 - (angle * 180) / Math.PI}deg`,
      opacity: 0.05 + (1 - Math.abs(t)) * 0.1,
    };
  });

  const stars = Array.from({ length: STAR_COUNT }, (_, i) => {
    const depth = hash(i * 3.3);
    return {
      left: hash(i * 1.7) * width,
      top: hash(i * 2.1) * horizon,
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
      {stars.map((star, i) => (
        <View
          key={`star-${i}`}
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

      {/* Perspective grid floor. */}
      {rails.map((rail) => (
        <View
          key={`rail-${rail.top}`}
          className="bg-hud absolute right-0 left-0 h-px"
          style={{ top: rail.top, opacity: rail.opacity }}
        />
      ))}
      {lanes.map((lane, i) => (
        <View
          key={`lane-${i}`}
          className="bg-hud absolute w-px"
          style={{
            left: vanishX,
            top: horizon,
            height: lane.length,
            opacity: lane.opacity,
            transform: [
              { translateY: lane.length / 2 },
              { rotate: lane.rotate },
              { translateY: -lane.length / 2 },
            ],
          }}
        />
      ))}

      {/* Horizon glow where the floor meets the field. */}
      <View className="bg-hud/25 absolute right-0 left-0 h-px" style={{ top: horizon }} />
      <LinearGradient
        colors={['rgba(0,189,189,0.12)', 'rgba(0,189,189,0)'] as const}
        style={{ position: 'absolute', left: 0, right: 0, top: horizon - 60, height: 60 }}
      />

      {/* Signal vignette. */}
      <View className="bg-hud/[0.07] absolute -top-24 -left-24 h-64 w-64 rounded-full blur-3xl" />
    </View>
  );
}
