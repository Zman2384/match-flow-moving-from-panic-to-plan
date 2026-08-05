import { useMemo, useState } from 'react';
import { Pressable, Text, View } from 'react-native';

import { HexScore } from '@/components/HexScore';
import { Disclaimer, HudPanel, ScreenShell, SectionLabel } from '@/components/ScreenShell';
import { RISK_QUESTIONS } from '@/lib/content';
import { MATCH_PIECES, PIECE_BY_KEY, type PieceKey, scoreTier } from '@/lib/match';
import { useMatchStore } from '@/lib/store';

export default function SaferScoreScreen() {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const addRiskResult = useMatchStore((s) => s.addRiskResult);
  const history = useMatchStore((s) => s.riskResults);

  const answeredCount = Object.keys(answers).length;
  const complete = answeredCount === RISK_QUESTIONS.length;

  const { exposure, protection, byPiece, weakest } = useMemo(() => {
    const maxTotal = RISK_QUESTIONS.reduce(
      (sum, q) => sum + Math.max(...q.options.map((o) => o.points)),
      0,
    );
    const raw = RISK_QUESTIONS.reduce((sum, q) => sum + (answers[q.id] ?? 0), 0);
    const pieceTotals: Record<PieceKey, { got: number; max: number }> = {
      M: { got: 0, max: 0 },
      A: { got: 0, max: 0 },
      T: { got: 0, max: 0 },
      C: { got: 0, max: 0 },
      H: { got: 0, max: 0 },
    };
    for (const q of RISK_QUESTIONS) {
      pieceTotals[q.piece].got += answers[q.id] ?? 0;
      pieceTotals[q.piece].max += Math.max(...q.options.map((o) => o.points));
    }
    let worst: PieceKey = 'M';
    let worstRatio = -1;
    for (const piece of MATCH_PIECES) {
      const entry = pieceTotals[piece.key];
      const ratio = entry.max === 0 ? 0 : entry.got / entry.max;
      if (ratio > worstRatio) {
        worstRatio = ratio;
        worst = piece.key;
      }
    }
    const exposurePct = maxTotal === 0 ? 0 : Math.round((raw / maxTotal) * 100);
    return {
      exposure: exposurePct,
      protection: 100 - exposurePct,
      byPiece: pieceTotals,
      weakest: worst,
    };
  }, [answers]);

  const tier = scoreTier(protection);

  if (submitted) {
    return (
      <ScreenShell title="SafER result" subtitle="A snapshot of exposure versus coverage right now">
        <View className="items-center py-2">
          <HexScore
            score={protection}
            label={tier.label}
            color={tier.color}
            caption="Coverage index"
          />
        </View>

        <HudPanel label="Read-out" status={`${exposure}% exposure`} className="mt-4">
          <Text className="text-muted text-[13px] leading-5">{tier.blurb}</Text>
          <View className="mt-4 gap-2">
            {MATCH_PIECES.map((piece) => {
              const entry = byPiece[piece.key];
              const pct = entry.max === 0 ? 0 : Math.round((1 - entry.got / entry.max) * 100);
              return (
                <View key={piece.key} className="flex-row items-center gap-3">
                  <Text className="w-4 text-xs font-bold" style={{ color: piece.color }}>
                    {piece.key}
                  </Text>
                  <View className="bg-panel-deep h-2 flex-1 overflow-hidden rounded-full">
                    <View
                      className="h-2 rounded-full"
                      style={{ width: `${pct}%`, backgroundColor: piece.color }}
                    />
                  </View>
                  <Text className="text-muted w-9 text-right text-[10px]">{pct}%</Text>
                </View>
              );
            })}
          </View>
        </HudPanel>

        <View
          className="mt-4 rounded-2xl border p-4"
          style={{
            borderColor: `${PIECE_BY_KEY[weakest].color}55`,
            backgroundColor: `${PIECE_BY_KEY[weakest].color}14`,
          }}
        >
          <Text
            className="text-[10px] font-bold tracking-widest uppercase"
            style={{ color: PIECE_BY_KEY[weakest].color }}
          >
            Highest-leverage fix
          </Text>
          <Text className="text-foreground mt-1 text-sm font-bold">
            {PIECE_BY_KEY[weakest].emoji} {PIECE_BY_KEY[weakest].name}
          </Text>
          <Text className="text-muted mt-1 text-[12px] leading-5">
            {PIECE_BY_KEY[weakest].summary}
          </Text>
        </View>

        <Pressable
          onPress={() => {
            setAnswers({});
            setSubmitted(false);
          }}
          className="border-hud bg-hud/15 mt-5 items-center rounded-2xl border py-3.5 active:opacity-80"
        >
          <Text className="text-hud text-xs font-bold tracking-widest uppercase">
            Run assessment again
          </Text>
        </Pressable>

        {history.length > 1 ? (
          <>
            <SectionLabel>Previous runs</SectionLabel>
            {history.slice(1, 6).map((entry) => (
              <View
                key={entry.date}
                className="border-border bg-panel/60 mb-2 flex-row items-center justify-between rounded-xl border px-4 py-3"
              >
                <Text className="text-muted text-[11px]">
                  {new Date(entry.date).toLocaleDateString()}
                </Text>
                <Text className="text-foreground text-sm font-bold">{entry.score}</Text>
              </View>
            ))}
          </>
        ) : null}

        <Disclaimer />
      </ScreenShell>
    );
  }

  return (
    <ScreenShell
      title="SafER Score"
      subtitle={`${answeredCount} of ${RISK_QUESTIONS.length} answered`}
      hint="Answer honestly — the score is only useful if it reflects a normal week."
    >
      <View className="bg-panel-deep mb-5 h-1.5 w-full overflow-hidden rounded-full">
        <View
          className="bg-hud h-1.5 rounded-full"
          style={{ width: `${(answeredCount / RISK_QUESTIONS.length) * 100}%` }}
        />
      </View>

      {RISK_QUESTIONS.map((question, index) => {
        const piece = PIECE_BY_KEY[question.piece];
        return (
          <View
            key={question.id}
            className="mb-3 overflow-hidden rounded-2xl border"
            style={{ borderColor: `${piece.color}40`, backgroundColor: '#0b1c3199' }}
          >
            <View
              className="flex-row items-center gap-2 px-4 py-2.5"
              style={{ backgroundColor: `${piece.color}18` }}
            >
              <Text className="text-[10px] font-bold" style={{ color: piece.color }}>
                {piece.key} · Q{index + 1}
              </Text>
            </View>
            <View className="p-4">
              <Text className="text-foreground text-[13px] leading-5 font-semibold">
                {question.prompt}
              </Text>
              <View className="mt-3 gap-2">
                {question.options.map((option) => {
                  const on = answers[question.id] === option.points;
                  return (
                    <Pressable
                      key={option.label}
                      onPress={() =>
                        setAnswers((prev) => ({ ...prev, [question.id]: option.points }))
                      }
                      className={`rounded-xl border px-3 py-3 active:opacity-70 ${
                        on ? 'bg-panel' : 'border-border/70'
                      }`}
                      style={on ? { borderColor: piece.color } : undefined}
                    >
                      <Text
                        className={`text-[12px] font-semibold ${
                          on ? 'text-foreground' : 'text-muted'
                        }`}
                      >
                        {option.label}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>
          </View>
        );
      })}

      <Pressable
        disabled={!complete}
        onPress={() => {
          addRiskResult({ score: protection, weakest });
          setSubmitted(true);
        }}
        className={`mt-3 items-center rounded-2xl py-4 ${
          complete ? 'bg-hud active:opacity-80' : 'bg-panel-deep'
        }`}
      >
        <Text
          className={`text-xs font-bold tracking-widest uppercase ${
            complete ? 'text-abyss' : 'text-muted'
          }`}
        >
          {complete ? 'Calculate SafER score' : `${RISK_QUESTIONS.length - answeredCount} left`}
        </Text>
      </Pressable>

      <Disclaimer />
    </ScreenShell>
  );
}
