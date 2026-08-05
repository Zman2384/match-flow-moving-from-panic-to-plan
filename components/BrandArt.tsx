import { Image, useWindowDimensions, View } from 'react-native';

import type { PieceKey } from '@/lib/match';
import { cn } from '@/lib/utils';

/** Source artwork is 1830 x 1030. */
const BANNER_ASPECT = 1830 / 1030;

/**
 * Generated wordmark is 1536 x 1024 with transparent padding above and below the
 * puzzle row. These fractions crop the artboard down to the pieces themselves so
 * the wordmark does not carry a tall empty box around it.
 */
const WORDMARK_ASPECT = 1536 / 1024;
const WORDMARK_CONTENT_TOP = 0.275;
const WORDMARK_CONTENT_HEIGHT = 0.44;

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

/** Interlocking puzzle-piece wordmark spelling M A T C H. */
export function MatchWordmark({ width, className }: { width?: number; className?: string }) {
  const responsive = useArtWidth(72, 340);
  const artWidth = width ?? responsive;
  const artHeight = artWidth / WORDMARK_ASPECT;

  return (
    <View
      className={cn('self-center overflow-hidden', className)}
      style={{ width: artWidth, height: artHeight * WORDMARK_CONTENT_HEIGHT }}
    >
      <Image
        source={require('../assets/match-wordmark.png')}
        style={{
          position: 'absolute',
          left: 0,
          top: -artHeight * WORDMARK_CONTENT_TOP,
          width: artWidth,
          height: artHeight,
        }}
        resizeMode="contain"
        accessibilityLabel="MATCH"
      />
    </View>
  );
}
