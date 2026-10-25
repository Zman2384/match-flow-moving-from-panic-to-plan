import { useEffect } from 'react';
import { View } from 'react-native';
import {
  cancelAnimation,
  createAnimatedComponent,
  useAnimatedProps,
  useReducedMotion,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Defs, LinearGradient, Path, Stop, Text as SvgText } from 'react-native-svg';

import { HUD, LINE_SOFT, SILVER, SILVER_LIGHT, STEEL } from '@/lib/palette';
import { cn } from '@/lib/utils';

const AnimatedPath = createAnimatedComponent(Path);
const HEARTBEAT =
  'M278 103 H310 L317 98 L324 109 L332 87 L341 117 L349 103 H375 L382 99 L389 106 L396 103 H456';

/**
 * Font-backed, resolution-independent lettering; puzzle artwork stays separate.
 * Brand rule: site fonts only — Bebas Neue for MATCH, Playfair Display italic for Flow.
 */
export function MatchFlowWordmark({ className }: { className?: string }) {
  const reducedMotion = useReducedMotion();
  const offset = useSharedValue(190);

  useEffect(() => {
    if (!reducedMotion) {
      offset.value = withRepeat(withTiming(-190, { duration: 2400 }), -1, false);
    }
    return () => cancelAnimation(offset);
  }, [offset, reducedMotion]);

  const trailProps = useAnimatedProps(() => ({ strokeDashoffset: offset.value }));

  return (
    <View
      className={cn('w-full self-center', className)}
      style={{ maxWidth: 460, aspectRatio: 460 / 126 }}
      accessible
      accessibilityRole="header"
      accessibilityLabel="MATCH Flow"
    >
      <Svg width="100%" height="100%" viewBox="0 0 460 126">
        <Defs>
          <LinearGradient id="armor" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor={SILVER_LIGHT} />
            <Stop offset="0.42" stopColor={SILVER} />
            <Stop offset="0.49" stopColor={STEEL} />
            <Stop offset="0.54" stopColor={SILVER_LIGHT} />
            <Stop offset="1" stopColor={STEEL} />
          </LinearGradient>
        </Defs>
        <SvgText
          x="4"
          y="89"
          fontSize="104"
          fontFamily="BebasNeue_400Regular"
          fill={LINE_SOFT}
          stroke={LINE_SOFT}
          strokeWidth="2"
        >
          MATCH
        </SvgText>
        <SvgText
          x="2"
          y="86"
          fontSize="104"
          fontFamily="BebasNeue_400Regular"
          fill="url(#armor)"
          stroke={SILVER_LIGHT}
          strokeWidth="0.5"
        >
          MATCH
        </SvgText>
        <SvgText
          x="244"
          y="86"
          fontSize="92"
          fontFamily="PlayfairDisplay_700Bold_Italic"
          fill={HUD}
          stroke={HUD}
          strokeWidth="6"
          opacity="0.14"
        >
          Flow
        </SvgText>
        <SvgText
          x="244"
          y="86"
          fontSize="92"
          fontFamily="PlayfairDisplay_700Bold_Italic"
          fill={HUD}
        >
          Flow
        </SvgText>
        <Path d={HEARTBEAT} fill="none" stroke={HUD} strokeWidth="7" opacity="0.1" />
        <Path d={HEARTBEAT} fill="none" stroke={HUD} strokeWidth="1.5" opacity="0.5" />
        {!reducedMotion ? (
          <AnimatedPath
            animatedProps={trailProps}
            d={HEARTBEAT}
            fill="none"
            stroke={HUD}
            strokeWidth="2.5"
            strokeDasharray="45 145"
            strokeLinecap="round"
          />
        ) : null}
      </Svg>
    </View>
  );
}
