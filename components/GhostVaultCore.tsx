import { useEffect } from 'react';
import { Text, View } from 'react-native';
import Animated, {
  createAnimatedComponent,
  Easing,
  useAnimatedProps,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import Svg, {
  Circle,
  Defs,
  LinearGradient,
  Path,
  Polygon,
  RadialGradient,
  Stop,
} from 'react-native-svg';

import { HUD, HUD_DIM, LINE, MATCH_COLOR } from '@/lib/palette';

const AnimatedCircle = createAnimatedComponent(Circle);
const AnimatedPath = createAnimatedComponent(Path);
const AnimatedPolygon = createAnimatedComponent(Polygon);

const CENTER = 100;
const OUTER_R = 78;
const MID_R = 42;
const FACET_TOTAL = 12;

function vertex(index: number, radius: number) {
  const angle = ((-90 + 60 * index) * Math.PI) / 180;
  return [CENTER + radius * Math.cos(angle), CENTER + radius * Math.sin(angle)] as const;
}

function points(coords: readonly (readonly [number, number])[]) {
  return coords.map(([x, y]) => `${x.toFixed(2)},${y.toFixed(2)}`).join(' ');
}

/** Six outer plates and six inner core triangles, interleaved so charge fills by wedge. */
const FACETS = Array.from({ length: 6 }, (_, i) => {
  const next = (i + 1) % 6;
  return [
    {
      id: `plate-${i}`,
      kind: 'plate' as const,
      points: points([
        vertex(i, OUTER_R),
        vertex(next, OUTER_R),
        vertex(next, MID_R),
        vertex(i, MID_R),
      ]),
    },
    {
      id: `core-${i}`,
      kind: 'core' as const,
      points: points([vertex(i, MID_R), vertex(next, MID_R), [CENTER, CENTER] as const]),
    },
  ];
}).flat();

const SHIELD_OUTLINE = points(Array.from({ length: 6 }, (_, i) => vertex(i, OUTER_R)));
const SHIELD_HALO = points(Array.from({ length: 6 }, (_, i) => vertex(i, OUTER_R + 7)));

/** Cyan medical telemetry heartbeat, drawn under the shield. */
const HEARTBEAT = 'M4 176 H52 l7 -13 l6 26 l8 -38 l9 50 l7 -25 h14 l6 -10 l5 10 H196';

interface VaultCoreProps {
  /** 0-100 — share of named ghosts that have been disarmed. */
  charge: number;
  named: number;
  disarmed: number;
  size?: number;
}

/**
 * The vault core: a matte-metal geodesic shield whose facets solidify as named
 * ghosts get disarmed, lit by a gold flame and swept by radar pulses.
 */
export function VaultCore({ charge, named, disarmed, size = 220 }: VaultCoreProps) {
  const litFacets = named === 0 ? 0 : Math.max(1, Math.round((charge / 100) * FACET_TOTAL));

  const pulse = useSharedValue(0);
  const beat = useSharedValue(0);
  const solidify = useSharedValue(0);

  useEffect(() => {
    pulse.value = withRepeat(
      withTiming(1, { duration: 2600, easing: Easing.out(Easing.quad) }),
      -1,
    );
    beat.value = withRepeat(withTiming(1, { duration: 2200, easing: Easing.linear }), -1);
  }, [pulse, beat]);

  useEffect(() => {
    solidify.value = 0;
    solidify.value = withTiming(1, { duration: 700 });
  }, [litFacets, solidify]);

  const magentaRing = useAnimatedProps(() => ({
    r: MID_R + pulse.value * 56,
    opacity: 0.45 * (1 - pulse.value),
  }));

  const goldRing = useAnimatedProps(() => {
    const offset = (pulse.value + 0.5) % 1;
    return { r: MID_R + offset * 56, opacity: 0.32 * (1 - offset) };
  });

  const trail = useAnimatedProps(() => ({ strokeDashoffset: 460 - beat.value * 460 }));

  const facetSolidify = useAnimatedProps(() => ({ opacity: 0.45 + solidify.value * 0.55 }));

  return (
    <View className="items-center" style={{ width: size }}>
      <View style={{ width: size, height: size }}>
        <Svg viewBox="0 0 200 200" width={size} height={size}>
          <Defs>
            <LinearGradient id="ghostPlate" x1="0" y1="0" x2="1" y2="1">
              <Stop offset="0%" stopColor="#d8e3ef" stopOpacity={0.95} />
              <Stop offset="45%" stopColor="#8fa6bd" stopOpacity={0.8} />
              <Stop offset="100%" stopColor="#2c4763" stopOpacity={0.95} />
            </LinearGradient>
            <LinearGradient id="ghostCore" x1="0" y1="1" x2="0" y2="0">
              <Stop offset="0%" stopColor={HUD_DIM} stopOpacity={0.9} />
              <Stop offset="100%" stopColor={HUD} stopOpacity={0.85} />
            </LinearGradient>
            <RadialGradient id="ghostFlame" cx="50%" cy="50%" r="50%">
              <Stop offset="0%" stopColor="#fff6c9" stopOpacity={1} />
              <Stop offset="45%" stopColor={MATCH_COLOR.C} stopOpacity={0.9} />
              <Stop offset="100%" stopColor={MATCH_COLOR.C} stopOpacity={0} />
            </RadialGradient>
          </Defs>

          <Polygon
            points={SHIELD_HALO}
            fill="none"
            stroke={HUD}
            strokeOpacity={0.2}
            strokeWidth={0.8}
            strokeDasharray="3 7"
          />

          <AnimatedCircle
            cx={CENTER}
            cy={CENTER}
            fill="none"
            stroke={MATCH_COLOR.T}
            strokeWidth={1.4}
            animatedProps={magentaRing}
          />
          <AnimatedCircle
            cx={CENTER}
            cy={CENTER}
            fill="none"
            stroke={MATCH_COLOR.C}
            strokeWidth={1}
            animatedProps={goldRing}
          />

          {FACETS.map((facet, index) => {
            const lit = index < litFacets;
            if (!lit) {
              return (
                <Polygon
                  key={facet.id}
                  points={facet.points}
                  fill="#081627"
                  fillOpacity={0.85}
                  stroke={LINE}
                  strokeOpacity={0.7}
                  strokeWidth={0.7}
                  strokeDasharray="2 4"
                />
              );
            }
            return (
              <AnimatedPolygon
                key={facet.id}
                points={facet.points}
                fill={facet.kind === 'plate' ? 'url(#ghostPlate)' : 'url(#ghostCore)'}
                stroke={HUD}
                strokeOpacity={0.55}
                strokeWidth={0.8}
                animatedProps={facetSolidify}
              />
            );
          })}

          <Polygon
            points={SHIELD_OUTLINE}
            fill="none"
            stroke={HUD}
            strokeOpacity={0.85}
            strokeWidth={1.6}
          />

          <Circle cx={CENTER} cy={CENTER} r={22} fill="url(#ghostFlame)" />
          <Path
            d="M100 84 c7 9 12 13 12 21 a12 12 0 0 1 -24 0 c0 -8 5 -12 12 -21 z"
            fill="#ffe479"
            fillOpacity={0.95}
          />

          <AnimatedPath
            d={HEARTBEAT}
            fill="none"
            stroke={HUD}
            strokeWidth={1.8}
            strokeLinecap="round"
            strokeDasharray="120 340"
            animatedProps={trail}
          />
          <Path d={HEARTBEAT} fill="none" stroke={HUD} strokeOpacity={0.16} strokeWidth={1.2} />
        </Svg>

        <View pointerEvents="none" className="absolute inset-0 items-center justify-center">
          {named === 0 ? (
            <Text className="text-muted mt-14 px-10 text-center text-[13px] font-semibold">
              Name your first ghost to start.
            </Text>
          ) : (
            <>
              <Text className="text-foreground font-display mt-14 text-3xl tracking-wide">
                {disarmed}
                <Text className="text-muted text-base font-semibold"> / {named}</Text>
              </Text>
              <Text className="text-hud font-mono text-[9px] tracking-[2px] uppercase">
                disarmed
              </Text>
            </>
          )}
        </View>
      </View>
    </View>
  );
}

interface GlitchLabelProps {
  text: string;
  /** Ghost grid color for the offset channel. */
  color: string;
  /** Stagger so a list of ghosts does not pulse in unison. */
  delay?: number;
}

/**
 * Unprocessed fear: the label with two offset color channels that drift in and
 * out, the way an unstable signal does.
 */
export function GlitchLabel({ text, color, delay = 0 }: GlitchLabelProps) {
  const flicker = useSharedValue(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      flicker.value = withRepeat(
        withTiming(1, { duration: 1800, easing: Easing.inOut(Easing.quad) }),
        -1,
        true,
      );
    }, delay);
    return () => clearTimeout(timer);
  }, [flicker, delay]);

  const left = useAnimatedStyle(() => ({ opacity: 0.1 + flicker.value * 0.45 }));
  const right = useAnimatedStyle(() => ({ opacity: 0.45 - flicker.value * 0.35 }));

  return (
    <View className="relative self-start">
      <Animated.View
        pointerEvents="none"
        style={[{ position: 'absolute', left: -2, top: 0.5 }, left]}
      >
        <Text style={{ color, fontSize: 14, fontWeight: '700' }}>{text}</Text>
      </Animated.View>
      <Animated.View
        pointerEvents="none"
        style={[{ position: 'absolute', left: 2, top: -0.5 }, right]}
      >
        <Text style={{ color: HUD, fontSize: 14, fontWeight: '700' }}>{text}</Text>
      </Animated.View>
      <Text style={{ color: '#c3d2e2', fontSize: 14, fontWeight: '700' }}>{text}</Text>
    </View>
  );
}
