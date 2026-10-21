import { Link } from 'expo-router';
import { ChevronRight } from '@/lib/icons';
import { ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BackChip } from '@/components/BackChip';
import { HudBackdrop } from '@/components/HudBackdrop';
import { LilZDock } from '@/components/LilZ';
import { BodyText, BrandFooter } from '@/components/ScreenShell';
import { MATCH_PIECES, pieceScores, saferScore, scoreTier } from '@/lib/match';
import { STEEL } from '@/lib/palette';
import { useMatchStore } from '@/lib/store';

const LINKS = [
  { href: '/tools/analytics', label: 'Shield analytics', detail: 'Score history and balance' },
  { href: '/tools/checkin', label: 'Weekly check-in', detail: 'Keep every layer alive' },
  { href: '/tools/reminders', label: 'Maintenance reminders', detail: 'Doses, restocks, testing' },
  { href: '/tools/anxiety', label: 'Anxiety log', detail: 'Fear vs evidence entries' },
  { href: '/settings', label: 'Settings & privacy', detail: 'Contacts, wipe local data' },
] as const;

export default function MeScreen() {
  const insets = useSafeAreaInsets();
  const armed = useMatchStore((s) => s.armed);
  const sessions = useMatchStore((s) => s.sessions);
  const checkIns = useMatchStore((s) => s.checkIns);
  const riskResults = useMatchStore((s) => s.riskResults);
  const stressTestBest = useMatchStore((s) => s.stressTestBest);
  const relationshipStyle = useMatchStore((s) => s.relationshipStyle);

  const score = saferScore(armed);
  const tier = scoreTier(score);
  const scores = pieceScores(armed);

  return (
    <View className="bg-background flex-1">
      <HudBackdrop />
      <ScrollView
        contentContainerStyle={{ paddingTop: insets.top + 12, paddingBottom: 104 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="px-5">
          <BackChip mode="jump" className="mb-3" />
          <Text className="text-hud font-mono text-[10px] tracking-[3px] uppercase">
            Operator profile
          </Text>
          <Text className="text-foreground font-display mt-1 text-3xl tracking-wide">
            Your progress
          </Text>

          <View className="border-hud/25 bg-panel/70 mt-4 rounded-3xl border p-4">
            <View className="flex-row items-center justify-between">
              <Text className="text-muted font-mono text-[10px] tracking-widest uppercase">
                Current shield
              </Text>
              <Text className="text-base font-bold" style={{ color: tier.color }}>
                {tier.label}
              </Text>
            </View>
            <Text className="text-foreground font-display mt-1 text-5xl tracking-wide">
              {score}
              <Text className="text-muted text-base font-semibold"> / 100</Text>
            </Text>
            <View className="bg-panel-deep mt-3 h-2 w-full flex-row overflow-hidden rounded-full">
              {MATCH_PIECES.map((piece) => (
                <View
                  key={piece.key}
                  style={{ width: `${scores[piece.key]}%`, backgroundColor: piece.color }}
                />
              ))}
            </View>
            <View className="mt-2 flex-row justify-between">
              {MATCH_PIECES.map((piece) => (
                <Text key={piece.key} className="text-[9px]" style={{ color: piece.color }}>
                  {piece.key} {scores[piece.key]}
                </Text>
              ))}
            </View>
          </View>

          <View className="mt-4 flex-row flex-wrap gap-3">
            <Metric label="Sessions" value={`${sessions.length}`} />
            <Metric label="Check-ins" value={`${checkIns.length}`} />
            <Metric label="Assessments" value={`${riskResults.length}`} />
            <Metric
              label="Best stress test"
              value={stressTestBest === null ? '—' : `${stressTestBest}%`}
            />
          </View>

          {relationshipStyle ? (
            <View className="border-hud/25 bg-hud/[0.07] mt-4 rounded-2xl border p-4">
              <Text className="text-hud font-mono text-[10px] tracking-widest uppercase">
                Agreement model
              </Text>
              <Text className="text-foreground mt-1 text-base font-semibold capitalize">
                {relationshipStyle.replace(/-/g, ' ')}
              </Text>
            </View>
          ) : null}

          <Text className="text-hud/70 mt-6 mb-3 font-mono text-[11px] tracking-[2px] uppercase">
            Manage
          </Text>
          {LINKS.map((link) => (
            <Link key={link.href} href={link.href} asChild>
              <View className="border-border bg-panel/60 mb-2 flex-row items-center rounded-2xl border p-4">
                <View className="flex-1">
                  <Text className="text-foreground text-base font-semibold">{link.label}</Text>
                  <BodyText className="text-muted mt-0.5">{link.detail}</BodyText>
                </View>
                <ChevronRight size={16} color={STEEL} />
              </View>
            </Link>
          ))}
        </View>

        <BrandFooter className="px-5" />
      </ScrollView>
      <LilZDock bottomOffset={24} />
    </View>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <View className="border-border bg-panel/60 min-w-[46%] flex-1 rounded-2xl border p-4">
      <Text className="text-foreground text-xl font-bold">{value}</Text>
      <Text className="text-muted mt-0.5 font-mono text-[10px] tracking-wider uppercase">
        {label}
      </Text>
    </View>
  );
}
