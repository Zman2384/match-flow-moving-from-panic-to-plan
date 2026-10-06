import { Image, useWindowDimensions, View } from 'react-native';

import type { PieceKey } from '@/lib/match';
import { cn } from '@/lib/utils';

/** Source artwork is 1830 x 1030. */
const BANNER_ASPECT = 1830 / 1030;

/**
 * Brand puzzle lockup (assets/match-puzzle-wordmark.png) is a 1255 x 396 RGBA
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
  const height = width / BANNER_ASPECT;

  return (
    <View
      className={cn(
        'border-hud/25 bg-panel-deep/60 self-center overflow-hidden rounded-3xl border',
        className,
      )}
      style={{ width, height }}
    >
      <Image
        source={require('../assets/match-flow-banner.png')}
        style={{ width, height }}
        resizeMode="cover"
        accessibilityLabel="MATCH Flow — The Biomedical Command Center"
      />
    </View>
  );
}

/** Full MATCH Flow lockup used in place of a text title on the consent gate. */
export function MatchFlowHero({ className }: { className?: string }) {
  const width = useArtWidth(48, 520);
  const height = width / BANNER_ASPECT;

  return (
    <View
      className={cn(
        'border-hud/25 bg-panel-deep/60 self-center overflow-hidden rounded-3xl border',
        className,
      )}
      style={{ width, height }}
    >
      <Image
        source={require('../assets/match-flow-hero.png')}
        style={{ width, height }}
        resizeMode="cover"
        accessibilityLabel="MATCH Flow — The Biomedical Command Center. Your science-based wingman for real-world friction."
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
  const source = require('../assets/match-flow-icon.png');
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

/** Framework title lockup with unused vertical artboard padding clipped away. */
export function MatchFrameworkTitle({ className }: { className?: string }) {
  const width = useArtWidth(48, 520);
  const source = require('../assets/match-framework-title.png');
  const fullHeight = width * (666 / 2000);
  const height = fullHeight * 0.54;

  return (
    <View className={cn('self-center overflow-hidden', className)} style={{ width, height }}>
      <Image
        source={source}
        style={{
          position: 'absolute',
          top: -fullHeight * 0.24,
          width,
          height: fullHeight,
        }}
        resizeMode="contain"
        accessibilityLabel="MATCH Framework — Medications, Awareness, Tools, Communication, Habits"
      />
    </View>
  );
}

/**
 * Single-piece slices of the wordmark artboard (1536 x 1024). Each piece is
 * cropped straight out of the shared PNG, so the five tiles stay pixel-identical
 * to the full lockup and there is only one asset to keep in sync.
 */
const SLICE_LEFT: Record<PieceKey, number> = {
  M: 72 / 1536,
  A: 349.5 / 1536,
  T: 627 / 1536,
  C: 904.5 / 1536,
  H: 1182 / 1536,
};
const SLICE_TOP = 304 / 1024;
const SLICE_WIDTH = 260 / 1536;
const SLICE_HEIGHT = 397 / 1024;

/** Width / height of one cropped puzzle tile. */
export const MATCH_PIECE_ASPECT = (SLICE_WIDTH * 1536) / (SLICE_HEIGHT * 1024);

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

/** One MATCH puzzle tile (M, A, T, C or H) cropped from the wordmark artwork. */
export function MatchPiece({ pieceKey, height, dimmed = false, className }: MatchPieceProps) {
  const width = matchPieceWidth(height);
  const fullWidth = width / SLICE_WIDTH;
  const fullHeight = height / SLICE_HEIGHT;

  return (
    <View
      className={cn('overflow-hidden', className)}
      style={{ width, height, opacity: dimmed ? 0.32 : 1 }}
    >
      <Image
        source={require('../assets/match-wordmark.png')}
        style={{
          position: 'absolute',
          left: -fullWidth * SLICE_LEFT[pieceKey],
          top: -fullHeight * SLICE_TOP,
          width: fullWidth,
          height: fullHeight,
        }}
        resizeMode="stretch"
        accessibilityLabel={pieceKey}
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
        source={require('../assets/match-puzzle-wordmark.png')}
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
