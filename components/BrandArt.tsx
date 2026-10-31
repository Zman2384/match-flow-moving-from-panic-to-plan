import { Image, useWindowDimensions, View } from 'react-native';

import type { PieceKey } from '@/lib/match';
import { cn } from '@/lib/utils';

/** Source artwork is 1830 x 1030. */
const BANNER_ASPECT = 1830 / 1030;
/** The MATCH Flow banner (match-flow-banner.webp) is 1888 x 1056. */
const FLOW_BANNER_ASPECT = 1888 / 1056;
/** The 3D MATCH Framework title (match-framework-3d.webp) is 1200 x 286, transparent and cropped tight. */
const FRAMEWORK_ASPECT = 1200 / 286;

/**
 * Brand puzzle lockup (assets/match-puzzle-wordmark.webp) keeps the 1255 x 396 RGBA
 * artboard. Its white plate was keyed out to true transparency, so it sits
 * straight on the starfield with no panel behind it. These fractions are the
 * measured bounding box of the visible pieces inside that artboard, so the
 * lockup never carries dead padding.
 */
const PUZZLE_CANVAS_WIDTH = 1255;
const PUZZLE_CANVAS_HEIGHT = 396;
const PUZZLE_CONTENT_LEFT = 34 / PUZZLE_CANVAS_WIDTH;
const PUZZLE_CONTENT_TOP = 26 / PUZZLE_CANVAS_HEIGHT;
const PUZZLE_CONTENT_WIDTH = 1160 / PUZZLE_CANVAS_WIDTH;
const PUZZLE_CONTENT_HEIGHT = 342 / PUZZLE_CANVAS_HEIGHT;
/** Width / height of the cropped lockup. */
const PUZZLE_ASPECT = 1160 / 342;

function useArtWidth(gutter: number, max: number) {
  const { width } = useWindowDimensions();
  return Math.min(Math.max(width - gutter, 200), max);
}

/** MATCH Flow command-center banner. Decorative header art. */
export function MatchFlowBanner({ className }: { className?: string }) {
  const width = useArtWidth(40, 560);
  const height = width / FLOW_BANNER_ASPECT;

  return (
    <View
      className={cn(
        'border-hud/25 bg-panel-deep/60 self-center overflow-hidden rounded-3xl border',
        className,
      )}
      style={{ width, height }}
    >
      <Image
        source={require('../assets/match-flow-banner.webp')}
        style={{ width, height }}
        resizeMode="cover"
        accessibilityLabel="MATCH Flow. Panic to a Plan. The Biomedical Command Center."
      />
    </View>
  );
}

/** Full MATCH Flow lockup used in place of a text title on the consent gate. */
export function MatchFlowHero({ className }: { className?: string }) {
  const width = useArtWidth(48, 520);
  const height = width / FLOW_BANNER_ASPECT;

  return (
    <View
      className={cn(
        'border-hud/25 bg-panel-deep/60 self-center overflow-hidden rounded-3xl border',
        className,
      )}
      style={{ width, height }}
    >
      <Image
        source={require('../assets/match-flow-banner.webp')}
        style={{ width, height }}
        resizeMode="cover"
        accessibilityLabel="MATCH Flow. Panic to a Plan. The Biomedical Command Center: your science-based wingman for real-world friction."
      />
    </View>
  );
}

/** Supplied MATCH Flow icon, displayed without a panel alongside the title. */
export function MatchFlowIcon({
  className,
  width: requestedWidth,
}: {
  className?: string;
  width?: number;
}) {
  const responsiveWidth = useArtWidth(48, 420);
  const width = requestedWidth ?? responsiveWidth;
  const source = require('../assets/match-flow-icon.webp');
  const height = width / BANNER_ASPECT;

  return (
    <View className={cn('self-center', className)} style={{ width, height }}>
      <Image
        source={source}
        style={{ width, height }}
        resizeMode="contain"
        accessibilityLabel="MATCH Flow icon — gold flame with cyan heartbeat and magenta arrow"
      />
    </View>
  );
}

/** Framework title: the 3D MATCH Framework render, transparent, drawn with no panel behind it. */
export function MatchFrameworkTitle({ className }: { className?: string }) {
  const width = useArtWidth(48, 520);
  const height = width / FRAMEWORK_ASPECT;

  return (
    <View className={cn('self-center', className)} style={{ width, height }}>
      <Image
        source={require('../assets/match-framework-3d.webp')}
        style={{ width, height }}
        resizeMode="contain"
        accessibilityLabel="MATCH Framework — Medications, Awareness, Tools, Communication, Habits"
      />
    </View>
  );
}

/**
 * Individual MATCH puzzle pieces (assets/match-piece-*.png). Each is a
 * transparent 360 x 384 PNG cut from the official five-piece artwork, centred
 * on a shared canvas so every tile renders at the same footprint.
 */
const PIECE_SOURCE: Record<PieceKey, number> = {
  M: require('../assets/match-piece-m.webp'),
  A: require('../assets/match-piece-a.webp'),
  T: require('../assets/match-piece-t.webp'),
  C: require('../assets/match-piece-c.webp'),
  H: require('../assets/match-piece-h.webp'),
};

const PIECE_LABEL: Record<PieceKey, string> = {
  M: 'M — Medications',
  A: 'A — Awareness',
  T: 'T — Tools',
  C: 'C — Communication',
  H: 'H — Habits',
};

/** Width / height of one puzzle-piece canvas. */
export const MATCH_PIECE_ASPECT = 360 / 384;

/** Pixel width of a tile rendered at the given height. */
export function matchPieceWidth(height: number) {
  return height * MATCH_PIECE_ASPECT;
}

interface MatchPieceProps {
  pieceKey: PieceKey;
  /** Rendered tile height in pixels; width follows the artwork aspect. */
  height: number;
  /** Dim the tile when the piece is inactive / unselected. */
  dimmed?: boolean;
  className?: string;
}

/** One MATCH puzzle piece (M, A, T, C or H) on a transparent background. */
export function MatchPiece({ pieceKey, height, dimmed = false, className }: MatchPieceProps) {
  const width = matchPieceWidth(height);

  return (
    <View className={className} style={{ width, height, opacity: dimmed ? 0.32 : 1 }}>
      <Image
        source={PIECE_SOURCE[pieceKey]}
        style={{ width, height }}
        resizeMode="contain"
        accessibilityLabel={PIECE_LABEL[pieceKey]}
      />
    </View>
  );
}

/** Interlocking puzzle-piece wordmark spelling M A T C H. Transparent artwork. */
export function MatchWordmark({ width, className }: { width?: number; className?: string }) {
  const responsive = useArtWidth(72, 340);
  const artWidth = width ?? responsive;
  const artHeight = artWidth / PUZZLE_ASPECT;
  const fullWidth = artWidth / PUZZLE_CONTENT_WIDTH;
  const fullHeight = artHeight / PUZZLE_CONTENT_HEIGHT;

  return (
    <View
      className={cn('self-center overflow-hidden', className)}
      style={{ width: artWidth, height: artHeight }}
    >
      <Image
        source={require('../assets/match-puzzle-wordmark.webp')}
        style={{
          position: 'absolute',
          left: -fullWidth * PUZZLE_CONTENT_LEFT,
          top: -fullHeight * PUZZLE_CONTENT_TOP,
          width: fullWidth,
          height: fullHeight,
        }}
        resizeMode="stretch"
        accessibilityLabel="MATCH — Medications, Awareness, Tools, Communication, Habits"
      />
    </View>
  );
}
