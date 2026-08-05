import { Link, Redirect, router } from 'expo-router';
import { ArrowRight, Settings2, TriangleAlert } from 'lucide-react-native';
import { ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { MatchFlowBanner } from '@/components/BrandArt';
import { HexScore, PieceHex } from '@/components/HexScore';
import { HudBackdrop } from '@/components/HudBackdrop';
import { PanicButton } from '@/components/PanicButton';
import { ToolCard } from '@/components/ToolCard';
import { MATCH_PIECES, armedCount, pieceScores, saferScore, scoreTier } from '@/lib/match';
import { useMatchStore } from '@/lib/store';
import { TOOLS } from '@/lib/tools';

const FEATURED = ['safer-score', 'emergency', 'scripts', 'live-session'];

export default function CommandCenter() {
  const insets = useSafeAreaInsets();
  const ageConfirmed = useMatchStore((s) => s.ageConfirmed);
  const armed = useMatchStore((s) => s.armed);
  const sessions = useMatchStore((s) => s.sessions);
  const checkIns = useMatchStore((s) => s.checkIns);

  if (!ageConfirmed) return <Redirect href="/gate" />;

  const score = saferScore(armed);
  const tier = scoreTier(score);
  const scores = pieceScores(armed);
  const layers = armedCount(armed);
  const weakest = MATCH_PIECES.reduce((worst, piece) =>
    scores[piece.key] / piece.weight < scores[worst.key] / worst.weight ? piece : worst,
  );
  const featured = FEATURED.map((id) => TOOLS.find((t) => t.id === id)).filter(
    (t): t is (typeof TOOLS)[number] => !!t,
  );

  return (
    <View className="bg-background flex-1">
      <HudBackdrop />
      <ScrollView
        contentContainerStyle={{ paddingTop: insets.top + 12, paddingBottom: 48 }}
        showsVerticalScrollIndicator={false}
      >
        <MatchFlowBanner className="mb-5" />

        <View className="flex-row items-start justify-between px-5">
          <View>
            <Text className="text-hud text-[10px] font-bold tracking-[3px] uppercase">
              Command Center
            </Text>
            <Text className="text-foreground mt-1 text-2xl font-bold">Your shield today</Text>
          </View>
          <Link href="/settings" asChild>
            <View className="border-hud/30 bg-hud/10 h-9 w-9 items-center justify-center rounded-full border">
              <Settings2 size={16} color="#00e5ff" />
            </View>
          </Link>
        </View>

        <View className="mt-5 items-center">
          <HexScore score={score} label={tier.label} color={tier.color} />
          <Text className="text-muted mt-3 px-10 text-center text-xs leading-5">{tier.blurb}</Text>
        </View>

        <View className="mt-6 flex-row justify-between px-6">
          {MATCH_PIECES.map((piece) => (
            <PieceHex
              key={piece.key}
              letter={piece.key}
              color={piece.color}
              percent={(scores[piece.key] / piece.weight) * 100}
              armed={scores[piece.key] > 0}
            />
          ))}
        </View>

        <View className="mt-6 px-5">
          <View className="border-hud/25 bg-panel/70 flex-row rounded-2xl border">
            <Stat label="Layers armed" value={`${layers}`} />
            <Divider />
            <Stat label="Sessions logged" value={`${sessions.length}`} />
            <Divider />
            <Stat label="Check-ins" value={`${checkIns.length}`} />
          </View>
        </View>

        <View className="mt-4 px-5">
          <Link href={{ pathname: '/piece/[key]', params: { key: weakest.key } }} asChild>
            <View
              className="flex-row items-center gap-3 rounded-2xl border p-4"
              style={{ borderColor: `${weakest.color}55`, backgroundColor: `${weakest.color}14` }}
            >
              <TriangleAlert size={20} color={weakest.color} />
              <View className="flex-1">
                <Text
                  className="text-[10px] font-bold tracking-widest uppercase"
                  style={{ color: weakest.color }}
                >
                  Thinnest layer
                </Text>
                <Text className="text-foreground mt-0.5 text-sm font-bold">
                  {weakest.emoji} {weakest.name}
                </Text>
                <Text className="text-muted mt-0.5 text-[11px]">{weakest.tagline}</Text>
              </View>
              <ArrowRight size={18} color={weakest.color} />
            </View>
          </Link>
        </View>

        <View className="mt-6 px-5">
          <View className="mb-3 flex-row items-center justify-between">
            <Text className="text-hud/70 text-[11px] font-bold tracking-[2px] uppercase">
              Priority tools
            </Text>
            <Text
              className="text-hud text-[11px] font-semibold"
              onPress={() => router.push('/(tabs)/toolkit')}
            >
              See all
            </Text>
          </View>
          {featured.map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </View>
      </ScrollView>
      <PanicButton bottomOffset={24} />
    </View>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <View className="flex-1 items-center py-3">
      <Text className="text-foreground text-lg font-bold">{value}</Text>
      <Text className="text-muted mt-0.5 text-[9px] font-semibold tracking-wider uppercase">
        {label}
      </Text>
    </View>
  );
}

function Divider() {
  return <View className="bg-hud/20 my-3 w-px" />;
}
