import { ExternalLink } from 'lucide-react-native';
import { useState } from 'react';
import { Linking, Pressable, Text, View } from 'react-native';

import { MatchPiece } from '@/components/BrandArt';
import { Disclaimer, ScreenShell } from '@/components/ScreenShell';
import { RESOURCE_GROUPS } from '@/lib/content';
import { MATCH_PIECES, PIECE_BY_KEY, type PieceKey } from '@/lib/match';

export default function ResourcesScreen() {
  const [piece, setPiece] = useState<PieceKey>('M');
  const group = RESOURCE_GROUPS.find((g) => g.piece === piece);
  const active = PIECE_BY_KEY[piece];

  return (
    <ScreenShell
      title="Knowledge Base"
      subtitle="Plain-language briefings, one MATCH piece at a time"
      hint="Read the piece you scored lowest on first."
    >
      <View className="mb-4 flex-row gap-2">
        {MATCH_PIECES.map((item) => {
          const on = item.key === piece;
          return (
            <Pressable
              key={item.key}
              onPress={() => setPiece(item.key)}
              className="flex-1 items-center rounded-xl border py-2.5 active:opacity-70"
              style={{
                borderColor: on ? item.color : '#1c3a55',
                backgroundColor: on ? `${item.color}22` : 'transparent',
              }}
            >
              <MatchPiece pieceKey={item.key} height={34} dimmed={!on} />
            </Pressable>
          );
        })}
      </View>

      <View
        className="rounded-2xl border p-4"
        style={{ borderColor: `${active.color}55`, backgroundColor: `${active.color}14` }}
      >
        <Text
          className="text-[10px] font-bold tracking-widest uppercase"
          style={{ color: active.color }}
        >
          {active.name}
        </Text>
        <Text className="text-foreground mt-1 text-[13px] leading-5">{active.summary}</Text>
      </View>

      {group?.tips.map((tip) => (
        <View key={tip.title} className="border-border bg-panel/60 mt-3 rounded-2xl border p-4">
          <Text className="text-foreground text-[13px] font-bold">{tip.title}</Text>
          <Text className="text-muted mt-1 text-[12px] leading-5">{tip.body}</Text>
        </View>
      ))}

      {group?.links.length ? (
        <>
          <Text className="text-hud/70 mt-6 mb-3 text-[11px] font-bold tracking-[2px] uppercase">
            Go deeper
          </Text>
          {group.links.map((link) => (
            <Pressable
              key={link.url}
              onPress={() => void Linking.openURL(link.url).catch(() => undefined)}
              className="border-hud/25 bg-panel/70 mb-2 flex-row items-center gap-3 rounded-2xl border p-4 active:opacity-70"
            >
              <ExternalLink size={15} color="#00e5ff" />
              <Text className="text-foreground flex-1 text-[12px] font-semibold">{link.label}</Text>
            </Pressable>
          ))}
        </>
      ) : null}

      <Disclaimer />
    </ScreenShell>
  );
}
