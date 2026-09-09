import { useLocalSearchParams } from 'expo-router';
import { Text, View } from 'react-native';

import { MatchPiece } from '@/components/BrandArt';
import { BodyText, HudPanel, ScreenShell, SectionLabel } from '@/components/ScreenShell';
import { ToolCard } from '@/components/ToolCard';
import { RESOURCE_GROUPS } from '@/lib/content';
import { PIECE_BY_KEY, type PieceKey, pieceScores } from '@/lib/match';
import { INK_ON_SIGNAL } from '@/lib/palette';
import { useMatchStore } from '@/lib/store';
import { TOOLS } from '@/lib/tools';

const VALID: readonly PieceKey[] = ['M', 'A', 'T', 'C', 'H'];

function isPieceKey(value: string): value is PieceKey {
  return (VALID as readonly string[]).includes(value);
}

export default function PieceDetail() {
  const params = useLocalSearchParams<{ key?: string }>();
  const armed = useMatchStore((s) => s.armed);
  const toggleOption = useMatchStore((s) => s.toggleOption);

  const raw = (params.key ?? 'M').toUpperCase();
  const key = isPieceKey(raw) ? raw : 'M';
  const piece = PIECE_BY_KEY[key];
  const earned = pieceScores(armed)[key];
  const group = RESOURCE_GROUPS.find((g) => g.piece === key);
  const relatedTools = TOOLS.filter((t) => t.pieces.includes(key)).slice(0, 3);

  return (
    <ScreenShell
      title={`${piece.emoji} ${piece.name}`}
      subtitle={piece.tagline}
      hint={`This piece is worth ${piece.weight} of 100 points on your shield.`}
    >
      <MatchPiece pieceKey={key} height={92} className="mb-4 self-center" />
      <HudPanel label={`Piece ${piece.key}`} status={`${earned}/${piece.weight} armed`}>
        <BodyText className="text-muted">{piece.summary}</BodyText>
        <View className="bg-panel-deep mt-4 h-2 w-full overflow-hidden rounded-full">
          <View
            className="h-2 rounded-full"
            style={{
              width: `${(earned / piece.weight) * 100}%`,
              backgroundColor: piece.color,
            }}
          />
        </View>
      </HudPanel>

      <SectionLabel>Arm this piece</SectionLabel>
      {piece.options.map((option) => {
        const on = armed[option.id];
        return (
          <View
            key={option.id}
            className="border-border bg-panel/60 mb-2 flex-row items-center rounded-2xl border p-4"
          >
            <View className="flex-1 pr-3">
              <Text className={`text-base font-semibold ${on ? 'text-foreground' : 'text-muted'}`}>
                {option.label}
              </Text>
              <BodyText className="text-muted mt-0.5">{option.detail}</BodyText>
            </View>
            <Text
              onPress={() => toggleOption(option.id)}
              className="rounded-full border px-3 py-1.5 text-[11px] font-bold"
              style={{
                color: on ? INK_ON_SIGNAL : piece.color,
                backgroundColor: on ? piece.color : 'transparent',
                borderColor: piece.color,
              }}
            >
              {on ? 'Armed' : 'Arm'}
            </Text>
          </View>
        );
      })}

      {group ? (
        <>
          <SectionLabel>Briefing</SectionLabel>
          {group.tips.map((tip) => (
            <View key={tip.title} className="border-hud/20 bg-panel/60 mb-2 rounded-2xl border p-4">
              <Text className="text-foreground text-base font-bold">{tip.title}</Text>
              <BodyText className="text-muted mt-1">{tip.body}</BodyText>
            </View>
          ))}
        </>
      ) : null}

      <SectionLabel>Tools that strengthen this</SectionLabel>
      {relatedTools.map((tool) => (
        <ToolCard key={tool.id} tool={tool} />
      ))}
    </ScreenShell>
  );
}
