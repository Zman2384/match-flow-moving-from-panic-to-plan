import { useMemo, useState } from 'react';
import { Link } from 'expo-router';
import { Pressable, Text, View } from 'react-native';

import { BodyText, HudPanel, ScreenShell, SectionLabel } from '@/components/ScreenShell';
import { STRESS_SCENARIOS } from '@/lib/content';
import { PIECE_BY_KEY, pieceScores } from '@/lib/match';
import { LINE_SOFT, STATE_FAIL, STATE_PASS, STEEL } from '@/lib/palette';
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
          <BodyText className="text-muted mt-2">
            {pct >= 80
              ? 'Redundant enough that one failure does not cascade. Keep the medication layer current.'
              : pct >= 50
                ? 'Half your scenarios hold. The gaps are all in the same place — add a second independent layer.'
                : 'Most scenarios broke through. Arm one medication option and one tool option, then retest.'}
          </BodyText>
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
              <Text className="text-foreground text-base font-semibold">{item.title}</Text>
              <BodyText className="text-muted mt-0.5">{item.fallback}</BodyText>
            </View>
            <Text
              className="text-[10px] font-bold uppercase"
              style={{ color: outcomes[i] ? STATE_PASS : STATE_FAIL }}
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
          <Text className="text-hud font-mono text-xs tracking-widest uppercase">Run again</Text>
        </Pressable>
      </ScreenShell>
    );
  }

  return (
    <ScreenShell
      title="Stress Test Lab"
      subtitle={`Scenario ${index + 1} of ${STRESS_SCENARIOS.length}`}
      hint="Results come from the plan you armed on the My Shield tab."
    >
      <BodyText className="text-muted mb-3">
        Supplemental readiness drills, not clinical risk predictions. Canonical dossiers A–H use
        written pivots and rehearsed scripts rather than a pass/fail score.
      </BodyText>
      <Link
        href={{ pathname: '/tools/lesson', params: { chapter: '17' } }}
        className="text-hud font-body mb-4 text-base"
      >
        Open Lesson 17 dossiers
      </Link>
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
                borderColor: on ? piece.color : LINE_SOFT,
                backgroundColor: on ? `${piece.color}1f` : 'transparent',
              }}
            >
              <Text className="text-[11px] font-bold" style={{ color: on ? piece.color : STEEL }}>
                {piece.key} · {piece.name}
              </Text>
              <Text className="text-[10px]" style={{ color: on ? STATE_PASS : STATE_FAIL }}>
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
            borderColor: holds ? `${STATE_PASS}66` : `${STATE_FAIL}66`,
            backgroundColor: holds ? `${STATE_PASS}14` : `${STATE_FAIL}14`,
          }}
        >
          <Text
            className="font-mono text-[10px] tracking-widest uppercase"
            style={{ color: holds ? STATE_PASS : STATE_FAIL }}
          >
            {holds ? 'Shield held' : 'Shield broke'}
          </Text>
          <BodyText className="text-foreground mt-1.5">{scenario.fallback}</BodyText>
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
        <Text className="text-abyss font-mono text-xs tracking-widest uppercase">
          {revealed ? 'Next scenario' : 'Run the scenario'}
        </Text>
      </Pressable>
    </ScreenShell>
  );
}
