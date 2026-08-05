import { Image, useWindowDimensions, View } from 'react-native';

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
