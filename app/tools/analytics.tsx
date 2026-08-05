import { Text, View } from 'react-native';

import { Disclaimer, HudPanel, ScreenShell, SectionLabel } from '@/components/ScreenShell';
import { MATCH_PIECES, pieceScores, saferScore, scoreTier } from '@/lib/match';
import { useMatchStore } from '@/lib/store';

export default function AnalyticsScreen() {
  const armed = useMatchStore((s) => s.armed);
  const sessions = useMatchStore((s) => s.sessions);
  const checkIns = useMatchStore((s) => s.checkIns);
  const riskResults = useMatchStore((s) => s.riskResults);

  const score = saferScore(armed);
  const tier = scoreTier(score);
  const scores = pieceScores(armed);

  const history = [...riskResults].toReversed().slice(-10);
  const maxCheck = Math.max(1, ...checkIns.map((c) => c.total));
  const avgCheck =
    checkIns.length === 0
      ? 0
      : Math.round(
          (checkIns.reduce((sum, c) => sum + c.completed / c.total, 0) / checkIns.length) * 100,
        );

  const environments = sessions.reduce<Record<string, number>>((acc, session) => {
    acc[session.environment] = (acc[session.environment] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <ScreenShell
      title="Shield Analytics"
      subtitle="Everything computed on this device from your own entries"
    >
      <HudPanel label="Current shield" status={tier.label}>
        <Text className="text-foreground text-5xl font-bold">
          {score}
          <Text className="text-muted text-lg font-semibold"> / 100</Text>
        </Text>
        <Text className="text-muted mt-2 text-[12px] leading-5">{tier.blurb}</Text>
      </HudPanel>

      <SectionLabel>Layer balance</SectionLabel>
      <View className="border-border bg-panel/60 rounded-2xl border p-4">
        {MATCH_PIECES.map((piece) => {
          const pct = Math.round((scores[piece.key] / piece.weight) * 100);
          return (
            <View key={piece.key} className="mb-3 flex-row items-center gap-3">
              <Text className="w-16 text-[11px] font-bold" style={{ color: piece.color }}>
                {piece.key} · {piece.weight}
              </Text>
              <View className="bg-panel-deep h-2.5 flex-1 overflow-hidden rounded-full">
                <View
                  className="h-2.5 rounded-full"
                  style={{ width: `${pct}%`, backgroundColor: piece.color }}
                />
              </View>
              <Text className="text-muted w-10 text-right text-[10px]">{pct}%</Text>
            </View>
          );
        })}
      </View>

      <SectionLabel>SafER score history</SectionLabel>
      {history.length === 0 ? (
        <Text className="text-muted text-[12px]">
          No assessments yet. Run the SafER Score tool to start a trend line.
        </Text>
      ) : (
        <View className="border-border bg-panel/60 rounded-2xl border p-4">
          <View className="h-32 flex-row items-end gap-2">
            {history.map((entry) => (
              <View key={entry.date} className="flex-1 items-center">
                <View
                  className="bg-hud w-full rounded-t"
                  style={{ height: `${Math.max(6, entry.score)}%` }}
                />
                <Text className="text-muted mt-1 text-[8px]">
                  {new Date(entry.date).toLocaleDateString(undefined, {
                    month: 'numeric',
                    day: 'numeric',
                  })}
                </Text>
              </View>
            ))}
          </View>
        </View>
      )}

      <SectionLabel>Maintenance</SectionLabel>
      <View className="flex-row gap-3">
        <Stat label="Check-ins logged" value={`${checkIns.length}`} />
        <Stat label="Avg completion" value={`${avgCheck}%`} />
        <Stat label="Items per sweep" value={`${maxCheck}`} />
      </View>

      <SectionLabel>Session contexts</SectionLabel>
      {sessions.length === 0 ? (
        <Text className="text-muted text-[12px]">
          Log a session from the Live Session tool to see patterns here.
        </Text>
      ) : (
        <View className="border-border bg-panel/60 rounded-2xl border p-4">
          {Object.entries(environments).map(([name, count]) => (
            <View key={name} className="mb-2.5 flex-row items-center gap-3">
              <Text className="text-muted w-24 text-[11px]">{name}</Text>
              <View className="bg-panel-deep h-2 flex-1 overflow-hidden rounded-full">
                <View
                  className="bg-hud h-2 rounded-full"
                  style={{ width: `${(count / sessions.length) * 100}%` }}
                />
              </View>
              <Text className="text-foreground w-6 text-right text-[11px] font-bold">{count}</Text>
            </View>
          ))}
        </View>
      )}

      <Disclaimer />
    </ScreenShell>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <View className="border-border bg-panel/60 flex-1 rounded-2xl border p-3">
      <Text className="text-foreground text-lg font-bold">{value}</Text>
      <Text className="text-muted mt-0.5 text-[9px] font-semibold tracking-wider uppercase">
        {label}
      </Text>
    </View>
  );
}
