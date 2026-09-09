import { Link } from 'expo-router';
import { ChevronRight, RotateCcw } from 'lucide-react-native';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { MatchPiece } from '@/components/BrandArt';
import { BackChip } from '@/components/BackChip';
import { HexScore } from '@/components/HexScore';
import { HudBackdrop } from '@/components/HudBackdrop';
import { LilZDock } from '@/components/LilZ';
import { BodyText, BrandFooter, Disclaimer } from '@/components/ScreenShell';
import { MATCH_PIECES, pieceScores, saferScore, scoreTier } from '@/lib/match';
import { LINE_SOFT, PANEL, STEEL } from '@/lib/palette';
import { useMatchStore } from '@/lib/store';

export default function PlanScreen() {
  const insets = useSafeAreaInsets();
  const armed = useMatchStore((s) => s.armed);
  const toggleOption = useMatchStore((s) => s.toggleOption);
  const resetPlan = useMatchStore((s) => s.resetPlan);
  const planUpdatedAt = useMatchStore((s) => s.planUpdatedAt);

  const score = saferScore(armed);
  const tier = scoreTier(score);
  const scores = pieceScores(armed);

  return (
    <View className="bg-background flex-1">
      <HudBackdrop />
      <ScrollView
        contentContainerStyle={{ paddingTop: insets.top + 12, paddingBottom: 48 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="px-5 pb-3">
          <BackChip mode="jump" />
        </View>

        <View className="flex-row items-start justify-between px-5">
          <View className="flex-1">
            <Text className="text-hud text-[10px] font-bold tracking-[3px] uppercase">
              MATCH plan builder
            </Text>
            <Text className="text-foreground mt-1 text-2xl font-bold">Arm your layers</Text>
            <BodyText className="text-muted mt-1">
              {planUpdatedAt
                ? `Last updated ${new Date(planUpdatedAt).toLocaleDateString()}`
                : 'Nothing armed yet — tap what is true for you today.'}
            </BodyText>
          </View>
          <Pressable
            onPress={resetPlan}
            hitSlop={8}
            className="border-border bg-panel/70 ml-3 h-9 w-9 items-center justify-center rounded-full border active:opacity-60"
          >
            <RotateCcw size={15} color={STEEL} />
          </Pressable>
        </View>

        <Disclaimer className="mx-5 mt-3" />

        <View className="mt-4 items-center">
          <HexScore score={score} label={tier.label} color={tier.color} size={126} />
        </View>

        <View className="mt-4 px-5">
          {MATCH_PIECES.map((piece) => {
            const earned = scores[piece.key];
            const pct = Math.round((earned / piece.weight) * 100);
            return (
              <View
                key={piece.key}
                className="mb-4 overflow-hidden rounded-3xl border"
                style={{ borderColor: `${piece.color}44`, backgroundColor: `${PANEL}99` }}
              >
                <View
                  className="flex-row items-center gap-3 px-4 py-3"
                  style={{ backgroundColor: `${piece.color}1a` }}
                >
                  <MatchPiece pieceKey={piece.key} height={38} />
                  <View className="flex-1">
                    <Text className="text-foreground text-base font-bold">
                      {piece.emoji} {piece.name}
                    </Text>
                    <BodyText className="text-muted">{piece.tagline}</BodyText>
                  </View>
                  <View className="items-end">
                    <Text className="text-base font-bold" style={{ color: piece.color }}>
                      {earned}/{piece.weight}
                    </Text>
                    <Text className="text-muted text-[9px]">{pct}% armed</Text>
                  </View>
                </View>

                <View className="bg-panel-deep h-1 w-full">
                  <View
                    className="h-1"
                    style={{ width: `${pct}%`, backgroundColor: piece.color }}
                  />
                </View>

                <View className="p-3">
                  {piece.options.map((option) => {
                    const on = armed[option.id];
                    return (
                      <Pressable
                        key={option.id}
                        onPress={() => toggleOption(option.id)}
                        className={`mb-2 flex-row items-start gap-3 rounded-2xl border p-3 active:opacity-70 ${
                          on ? 'bg-panel' : 'border-border/70 bg-transparent'
                        }`}
                        style={on ? { borderColor: piece.color } : undefined}
                      >
                        <View
                          className="mt-0.5 h-5 w-5 items-center justify-center rounded-md border"
                          style={{
                            borderColor: on ? piece.color : LINE_SOFT,
                            backgroundColor: on ? piece.color : 'transparent',
                          }}
                        >
                          {on ? <Text className="text-[11px] font-bold text-black">✓</Text> : null}
                        </View>
                        <View className="flex-1">
                          <Text
                            className={`text-base font-semibold ${
                              on ? 'text-foreground' : 'text-muted'
                            }`}
                          >
                            {option.label}
                          </Text>
                          <BodyText className="text-muted mt-0.5">{option.detail}</BodyText>
                        </View>
                        <Text className="text-muted text-[11px] font-bold">+{option.points}</Text>
                      </Pressable>
                    );
                  })}

                  <Link href={{ pathname: '/piece/[key]', params: { key: piece.key } }} asChild>
                    <Pressable className="mt-1 flex-row items-center justify-center gap-1 py-2 active:opacity-60">
                      <Text className="text-[11px] font-bold" style={{ color: piece.color }}>
                        Why this piece matters
                      </Text>
                      <ChevronRight size={13} color={piece.color} />
                    </Pressable>
                  </Link>
                </View>
              </View>
            );
          })}
        </View>

        <BrandFooter className="px-5" />
      </ScrollView>
      <LilZDock bottomOffset={24} />
    </View>
  );
}
