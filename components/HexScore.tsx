import { useEffect } from 'react';
import { Text, View } from 'react-native';
import {
  createAnimatedComponent,
  useAnimatedProps,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Defs, LinearGradient, Polygon, Rect, Stop } from 'react-native-svg';

const AnimatedRect = createAnimatedComponent(Rect);

function hexPoints(size: number, inset: number) {
  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2 - inset;
  return Array.from({ length: 6 }, (_, i) => {
    const angle = (Math.PI / 3) * i - Math.PI / 2;
    return `${(cx + r * Math.sin(angle + Math.PI / 2)).toFixed(2)},${(cy - r * Math.cos(angle + Math.PI / 2)).toFixed(2)}`;
  }).join(' ');
}

interface HexScoreProps {
  score: number;
  size?: number;
  label: string;
  color: string;
  caption?: string;
}

/**
 * Hexagonal shield gauge. The fill height animates to the score percentage.
 */
export function HexScore({ score, size = 156, label, color, caption }: HexScoreProps) {
  const fill = useSharedValue(0);

  useEffect(() => {
    fill.value = withTiming(Math.max(0, Math.min(100, score)), { duration: 800 });
  }, [score, fill]);

  const animatedProps = useAnimatedProps(() => ({
    y: 100 - fill.value,
    height: fill.value,
  }));

  const outer = hexPoints(100, 4);
  const inner = hexPoints(100, 11);

  return (
    <View className="items-center" style={{ width: size }}>
      <View style={{ width: size, height: size }}>
        <Svg viewBox="0 0 100 100" width={size} height={size}>
          <Defs>
            <LinearGradient id="hexGrad" x1="0" y1="1" x2="0" y2="0">
              <Stop offset="0%" stopColor={color} stopOpacity={0.35} />
              <Stop offset="100%" stopColor={color} stopOpacity={0.95} />
            </LinearGradient>
          </Defs>
          <Polygon points={outer} fill="#0b1c31" stroke="#1c3a55" strokeWidth={1.5} />
          <Polygon points={inner} fill="#081627" />
          <AnimatedRect
            x={0}
            width={100}
            fill="url(#hexGrad)"
            clipPath="url(#none)"
            animatedProps={animatedProps}
            opacity={0.9}
          />
          <Polygon points={inner} fill="none" />
          <Polygon points={outer} fill="none" stroke={color} strokeWidth={2} />
          <Polygon
            points={hexPoints(100, 0)}
            fill="none"
            stroke={color}
            strokeOpacity={0.35}
            strokeWidth={0.6}
            strokeDasharray="2 6"
          />
        </Svg>
        <View pointerEvents="none" className="absolute inset-0 items-center justify-center">
          <Text className="text-foreground text-3xl font-bold">{Math.round(score)}</Text>
          <Text
            className="mt-0.5 text-[10px] font-bold tracking-widest uppercase"
            style={{ color }}
          >
            {label}
          </Text>
          {caption ? (
            <Text className="text-muted mt-1 px-3 text-center text-[9px]">{caption}</Text>
          ) : null}
        </View>
      </View>
    </View>
  );
}

interface PieceHexProps {
  letter: string;
  percent: number;
  color: string;
  armed: boolean;
}

/** Small per-piece hexagon used in the shield strip. */
export function PieceHex({ letter, percent, color, armed }: PieceHexProps) {
  const fill = useSharedValue(0);

  useEffect(() => {
    fill.value = withTiming(Math.max(0, Math.min(100, percent)), { duration: 700 });
  }, [percent, fill]);

  const animatedProps = useAnimatedProps(() => ({
    y: 100 - fill.value,
    height: fill.value,
  }));

  const points = hexPoints(100, 6);

  return (
    <View className="items-center gap-1.5">
      <View style={{ width: 52, height: 52 }}>
        <Svg viewBox="0 0 100 100" width={52} height={52}>
          <Defs>
            <LinearGradient id={`piece-${letter}`} x1="0" y1="1" x2="0" y2="0">
              <Stop offset="0%" stopColor={color} stopOpacity={0.25} />
              <Stop offset="100%" stopColor={color} stopOpacity={0.95} />
            </LinearGradient>
          </Defs>
          <Polygon points={points} fill="#0b1c31" stroke="#1c3a55" strokeWidth={1.5} />
          <AnimatedRect
            x={0}
            width={100}
            fill={`url(#piece-${letter})`}
            animatedProps={animatedProps}
          />
          <Polygon
            points={points}
            fill="none"
            stroke={color}
            strokeWidth={1.6}
            strokeOpacity={armed ? 0.9 : 0.35}
          />
        </Svg>
        <View pointerEvents="none" className="absolute inset-0 items-center justify-center">
          <Text className="text-lg font-bold" style={{ color: armed ? '#ffffff' : '#6b7280' }}>
            {letter}
          </Text>
        </View>
      </View>
      <Text
        className="text-[9px] font-bold tracking-wider uppercase"
        style={{ color: armed ? color : '#6b7280' }}
      >
        {Math.round(percent)}%
      </Text>
    </View>
  );
}
