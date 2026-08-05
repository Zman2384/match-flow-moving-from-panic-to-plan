import { useMemo, useState } from 'react';
import { Pressable, Text, View } from 'react-native';

import { Disclaimer, HudPanel, ScreenShell, SectionLabel } from '@/components/ScreenShell';
import { STRESS_SCENARIOS } from '@/lib/content';
import { PIECE_BY_KEY, pieceScores } from '@/lib/match';
import { useMatchStore } from '@/lib/store';

export default function StressTestScreen() {
  const armed = useMatchStore((s) => s.armed);
  const recordStressTest = useMatchStore((s) => s.recordStressTest);
  const best = useMatchStore((s) => s.stressTestBest);
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [outcomes, setOutcomes] = useState<boolean[]>([]);

  const scores = pieceScores(armed);
  const scenario = STRESS_SCENARIOS[index];

  const holds = useMemo(() => {
    if (!scenario) return false;
    const compensating = scenario.compensators.filter((key) => scores[key] > 0).length;
    const criticalMissing = scenario.critical.filter((key) => scores[key] === 0).length;
    return compensating >= 1 && criticalMissing === 0;
  }, [scenario, scores]);

  const finished = index >= STRESS_SCENARIOS.length;

  if (finished) {
    const passed = outcomes.filter(Boolean).length;
    const pct = Math.round((passed / STRESS_SCENARIOS.length) * 100);
    return (
      <ScreenShell title="Stress test complete" subtitle="How your current plan held up">
        <HudPanel label="Result" status={`${passed}/${STRESS_SCENARIOS.length} held`}>
          <Text className="text-foreground text-5xl font-bold">{pct}%</Text>
          <Text className="text-muted mt-2 text-[13px] leading-5">
            {pct >= 80
              ? 'Redundant enough that one failure does not cascade. Keep the medication layer current.'
              : pct >= 50
                ? 'Half your scenarios hold. The gaps are all in the same place — add a second independent layer.'
                : 'Most scenarios broke through. Arm one medication option and one tool option, then retest.'}
          </Text>
          {best !== null ? (
            <Text className="text-hud mt-3 text-[11px] font-semibold">Personal best: {best}%</Text>
          ) : null}
        </HudPanel>

        <SectionLabel>Scenario log</SectionLabel>
        {STRESS_SCENARIOS.map((item, i) => (
          <View
            key={item.id}
            className="border-border bg-panel/60 mb-2 flex-row items-center rounded-2xl border p-4"
          >
            <View className="flex-1 pr-3">
              <Text className="text-foreground text-[13px] font-semibold">{item.title}</Text>
              <Text className="text-muted mt-0.5 text-[11px]">{item.fallback}</Text>
            </View>
            <Text
              className="text-[10px] font-bold uppercase"
              style={{ color: outcomes[i] ? '#4ade80' : '#f87171' }}
            >
              {outcomes[i] ? 'Held' : 'Broke'}
            </Text>
          </View>
        ))}

        <Pressable
          onPress={() => {
            setIndex(0);
            setOutcomes([]);
            setRevealed(false);
          }}
          className="border-hud bg-hud/15 mt-4 items-center rounded-2xl border py-3.5 active:opacity-80"
        >
          <Text className="text-hud text-xs font-bold tracking-widest uppercase">Run again</Text>
        </Pressable>

        <Disclaimer />
      </ScreenShell>
    );
  }

  return (
    <ScreenShell
      title="Stress Test Lab"
      subtitle={`Scenario ${index + 1} of ${STRESS_SCENARIOS.length}`}
      hint="Results come from the plan you armed on the My Shield tab."
    >
      <View className="bg-panel-deep mb-5 h-1.5 w-full overflow-hidden rounded-full">
        <View
          className="bg-hud h-1.5 rounded-full"
          style={{ width: `${(index / STRESS_SCENARIOS.length) * 100}%` }}
        />
      </View>

      <HudPanel label="Scenario" status={scenario.title}>
        <Text className="text-foreground text-[14px] leading-6">{scenario.setup}</Text>
      </HudPanel>

      <SectionLabel>Pieces under load</SectionLabel>
      <View className="flex-row flex-wrap gap-2">
        {[...new Set([...scenario.critical, ...scenario.compensators])].map((key) => {
          const piece = PIECE_BY_KEY[key];
          const on = scores[key] > 0;
          return (
            <View
              key={key}
              className="flex-row items-center gap-2 rounded-full border px-3 py-2"
              style={{
                borderColor: on ? piece.color : '#33506b',
                backgroundColor: on ? `${piece.color}1f` : 'transparent',
              }}
            >
              <Text
                className="text-[11px] font-bold"
                style={{ color: on ? piece.color : '#6b7f95' }}
              >
                {piece.key} · {piece.name}
              </Text>
              <Text className="text-[10px]" style={{ color: on ? '#4ade80' : '#f87171' }}>
                {on ? 'armed' : 'missing'}
              </Text>
            </View>
          );
        })}
      </View>

      {revealed ? (
        <View
          className="mt-5 rounded-2xl border p-4"
          style={{
            borderColor: holds ? '#4ade8066' : '#f8717166',
            backgroundColor: holds ? '#4ade8014' : '#f8717114',
          }}
        >
          <Text
            className="text-[10px] font-bold tracking-widest uppercase"
            style={{ color: holds ? '#4ade80' : '#f87171' }}
          >
            {holds ? 'Shield held' : 'Shield broke'}
          </Text>
          <Text className="text-foreground mt-1.5 text-[13px] leading-5">{scenario.fallback}</Text>
        </View>
      ) : null}

      <Pressable
        onPress={() => {
          if (!revealed) {
            setRevealed(true);
            return;
          }
          const nextOutcomes = [...outcomes, holds];
          setOutcomes(nextOutcomes);
          setRevealed(false);
          const nextIndex = index + 1;
          setIndex(nextIndex);
          if (nextIndex >= STRESS_SCENARIOS.length) {
            const passed = nextOutcomes.filter(Boolean).length;
            recordStressTest(Math.round((passed / STRESS_SCENARIOS.length) * 100));
          }
        }}
        className="bg-hud mt-5 items-center rounded-2xl py-4 active:opacity-80"
      >
        <Text className="text-abyss text-xs font-bold tracking-widest uppercase">
          {revealed ? 'Next scenario' : 'Run the scenario'}
        </Text>
      </Pressable>

      <Disclaimer />
    </ScreenShell>
  );
}
