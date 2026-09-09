import { router } from 'expo-router';
import { useEffect } from 'react';
import { Image, Pressable, Text, View } from 'react-native';
import {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

import { AnimatedView } from '@/components/ui/primitives/AnimatedView';
import { MATCH_COLOR, NAVY } from '@/lib/palette';
import { cn } from '@/lib/utils';

/**
 * Source art (assets/lil-z-avatar.png) is a 1024 x 1024 portrait on the brand navy.
 * These fractions are the measured square crop around the head and shoulders, so the
 * circular frame never shows dead canvas.
 */
const CROP_SIDE = 0.62;
const CROP_LEFT = 0.19;
const CROP_TOP = 0.04;

const MAGENTA = MATCH_COLOR.T;
const GOLD = MATCH_COLOR.C;

interface LilZAvatarProps {
  size?: number;
  /** Cyan HUD ring around the portrait. */
  ring?: boolean;
  /** Magenta + gold radar pulses, the app's "active companion" signal. */
  pulse?: boolean;
  className?: string;
}

/** Lil Z's portrait, cropped to a circle inside the tactical HUD ring. */
export function LilZAvatar({ size = 44, ring = true, pulse = false, className }: LilZAvatarProps) {
  const full = size / CROP_SIDE;

  return (
    <View
      style={{ width: size, height: size }}
      className={cn('items-center justify-center', className)}
    >
      {pulse ? (
        <>
          <RadarPulse size={size} color={MAGENTA} delay={0} />
          <RadarPulse size={size} color={GOLD} delay={900} />
        </>
      ) : null}
      <View
        className={cn('overflow-hidden rounded-full', ring ? 'border-hud/70 border' : '')}
        style={{ width: size, height: size, backgroundColor: NAVY }}
      >
        <Image
          source={require('../assets/lil-z-avatar.png')}
          style={{
            position: 'absolute',
            left: -full * CROP_LEFT,
            top: -full * CROP_TOP,
            width: full,
            height: full,
          }}
          resizeMode="stretch"
          accessibilityLabel="Lil Z"
        />
      </View>
    </View>
  );
}

function RadarPulse({ size, color, delay }: { size: number; color: string; delay: number }) {
  const progress = useSharedValue(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      progress.value = withRepeat(
        withTiming(1, { duration: 2200, easing: Easing.out(Easing.quad) }),
        -1,
        false,
      );
    }, delay);
    return () => clearTimeout(timer);
  }, [delay, progress]);

  const style = useAnimatedStyle(() => ({
    opacity: 0.5 * (1 - progress.value),
    transform: [{ scale: 1 + progress.value * 0.7 }],
  }));

  return (
    <AnimatedView
      pointerEvents="none"
      className="absolute rounded-full border"
      style={[{ width: size, height: size, borderColor: color }, style]}
    />
  );
}

/** Three-dot thinking indicator on the cyan telemetry beat. */
export function LilZThinking() {
  return (
    <View className="flex-row items-center gap-1.5">
      <Dot delay={0} />
      <Dot delay={160} />
      <Dot delay={320} />
    </View>
  );
}

function Dot({ delay }: { delay: number }) {
  const beat = useSharedValue(0.3);

  useEffect(() => {
    const timer = setTimeout(() => {
      beat.value = withRepeat(withTiming(1, { duration: 520 }), -1, true);
    }, delay);
    return () => clearTimeout(timer);
  }, [beat, delay]);

  const style = useAnimatedStyle(() => ({ opacity: beat.value }));

  return <AnimatedView className="bg-hud h-1.5 w-1.5 rounded-full" style={style} />;
}

/**
 * Floating companion dock. Sits opposite the panic button so both stay reachable,
 * and opens the full Lil Z conversation.
 */
export function LilZDock({ bottomOffset = 24 }: { bottomOffset?: number }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Ask Lil Z, your sexual health guide"
      onPress={() => router.push('/lil-z')}
      className="border-hud/40 bg-panel-deep/95 absolute left-4 flex-row items-center gap-2 rounded-full border py-1.5 pr-3.5 pl-1.5 active:opacity-80"
      style={{ bottom: bottomOffset }}
    >
      <LilZAvatar size={30} pulse />
      <View>
        <Text className="text-hud text-[11px] font-bold tracking-wider uppercase">Ask Lil Z</Text>
        <Text className="text-muted text-[9px]">Your guide, 24/7</Text>
      </View>
    </Pressable>
  );
}
