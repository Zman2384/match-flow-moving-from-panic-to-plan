import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import { Button } from 'heroui-native';
import { ExternalLink } from 'lucide-react-native';
import { useState } from 'react';
import { Linking, Pressable, Text, View } from 'react-native';

import { MatchPiece } from '@/components/BrandArt';
import { BodyText, ScreenShell } from '@/components/ScreenShell';
import { RESOURCE_GROUPS } from '@/lib/content';
import { MATCH_PIECES, PIECE_BY_KEY, type PieceKey } from '@/lib/match';
import { HUD, LINE } from '@/lib/palette';

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
      <Button
        variant="secondary"
        className="border-hud/40 bg-hud/10 mb-4 border"
        onPress={() => router.push('/tools/curriculum')}
      >
        <Button.Label className="text-hud font-body text-base">HARNESS curriculum</Button.Label>
      </Button>
      <View className="mb-4 flex-row gap-2">
        {MATCH_PIECES.map((item) => {
          const on = item.key === piece;
          return (
            <Pressable
              key={item.key}
              onPress={() => {
                if (piece === item.key) return;
                void Haptics.selectionAsync();
                setPiece(item.key);
              }}
              className="flex-1 items-center rounded-xl border py-2.5 active:opacity-70"
              style={{
                borderColor: on ? item.color : LINE,
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
        <BodyText className="text-foreground mt-1">{active.summary}</BodyText>
      </View>

      {group?.tips.map((tip) => (
        <View key={tip.title} className="border-border bg-panel/60 mt-3 rounded-2xl border p-4">
          <Text className="text-foreground text-base font-bold">{tip.title}</Text>
          <BodyText className="text-muted mt-1">{tip.body}</BodyText>
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
              <ExternalLink size={15} color={HUD} />
              <Text className="text-foreground flex-1 text-base font-semibold">{link.label}</Text>
            </Pressable>
          ))}
        </>
      ) : null}
    </ScreenShell>
  );
}
