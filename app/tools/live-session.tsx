import { useEffect, useState } from 'react';
import { Pressable, Text, View } from 'react-native';

import { BodyText, HudPanel, ScreenShell, SectionLabel } from '@/components/ScreenShell';
import { MATCH_PIECES, pieceScores, saferScore, scoreTier } from '@/lib/match';
import { HUD, LINE_SOFT } from '@/lib/palette';
import { useMatchStore } from '@/lib/store';

const SWEEP = [
  { id: 'meds', piece: 'M', label: 'Medication taken or current', detail: 'Dose logged, no gap.' },
  { id: 'supplies', piece: 'T', label: 'Barriers within reach', detail: 'Not in another room.' },
  {
    id: 'status',
    piece: 'A',
    label: 'Status conversation happened',
    detail: 'Asked and answered.',
  },
  { id: 'limits', piece: 'C', label: 'Limits stated out loud', detail: 'Including the hard no.' },
  { id: 'contact', piece: 'H', label: 'Someone knows where I am', detail: 'Check-out expected.' },
  { id: 'sober', piece: 'H', label: 'I am clear-headed enough to consent', detail: 'Both of us.' },
] as const;

const ENVIRONMENTS = ['Home', 'Their place', 'Hotel', 'Event', 'Unfamiliar'];
const MINDSETS = ['Grounded', 'Excited', 'Nervous', 'Under pressure'];
const PARTNERS = ['Long-term', 'Recurring', 'New', 'Unknown'];

export default function LiveSessionScreen() {
  const armed = useMatchStore((s) => s.armed);
  const addSession = useMatchStore((s) => s.addSession);

  const [checks, setChecks] = useState<Record<string, boolean>>({});
  const [environment, setEnvironment] = useState(ENVIRONMENTS[0]);
  const [mindset, setMindset] = useState(MINDSETS[0]);
  const [partner, setPartner] = useState(PARTNERS[0]);
  const [timerOn, setTimerOn] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [logged, setLogged] = useState(false);

  useEffect(() => {
    if (!timerOn) return undefined;
    const interval = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(interval);
  }, [timerOn]);

  const score = saferScore(armed);
  const tier = scoreTier(score);
  const scores = pieceScores(armed);
  const cleared = SWEEP.filter((item) => checks[item.id]).length;
  const readiness = Math.round((cleared / SWEEP.length) * 100);
  const mm = String(Math.floor(seconds / 60)).padStart(2, '0');
  const ss = String(seconds % 60).padStart(2, '0');

  return (
    <ScreenShell
      title="Live Session"
      subtitle="A short sweep before things start, and a timer for the check-out"
      hint="This stays on your device. Nothing is shared with anyone."
    >
      <HudPanel label="Readiness" status={`${readiness}%`}>
        <View className="flex-row items-end justify-between">
          <View>
            <Text className="text-foreground font-display text-5xl tracking-wide">{cleared}</Text>
            <Text className="text-muted font-mono text-[10px] tracking-wider uppercase">
              of {SWEEP.length} cleared
            </Text>
          </View>
          <View className="items-end">
            <Text className="text-sm font-bold" style={{ color: tier.color }}>
              Shield {score}
            </Text>
            <Text className="text-muted text-[10px]">{tier.label}</Text>
          </View>
        </View>
        <View className="bg-panel-deep mt-3 h-2 w-full overflow-hidden rounded-full">
          <View className="bg-hud h-2 rounded-full" style={{ width: `${readiness}%` }} />
        </View>
      </HudPanel>

      <SectionLabel>Pre-encounter sweep</SectionLabel>
      {SWEEP.map((item) => {
        const on = checks[item.id];
        const piece = MATCH_PIECES.find((p) => p.key === item.piece);
        const color = piece?.color ?? HUD;
        const armedPiece = piece ? scores[piece.key] > 0 : false;
        return (
          <Pressable
            key={item.id}
            onPress={() => setChecks((prev) => ({ ...prev, [item.id]: !prev[item.id] }))}
            className={`mb-2 flex-row items-start gap-3 rounded-2xl border p-4 active:opacity-70 ${
              on ? 'bg-panel' : 'border-border/70 bg-panel/40'
            }`}
            style={on ? { borderColor: color } : undefined}
          >
            <View
              className="mt-0.5 h-5 w-5 items-center justify-center rounded-md border"
              style={{
                borderColor: on ? color : LINE_SOFT,
                backgroundColor: on ? color : 'transparent',
              }}
            >
              {on ? <Text className="text-[11px] font-bold text-black">✓</Text> : null}
            </View>
            <View className="flex-1">
              <Text className={`text-base font-semibold ${on ? 'text-foreground' : 'text-muted'}`}>
                {item.label}
              </Text>
              <BodyText className="text-muted mt-0.5">{item.detail}</BodyText>
            </View>
            {!armedPiece ? (
              <Text className="text-[9px] font-bold uppercase" style={{ color }}>
                {item.piece} unarmed
              </Text>
            ) : null}
          </Pressable>
        );
      })}

      <SectionLabel>Context</SectionLabel>
      <Selector
        label="Environment"
        options={ENVIRONMENTS}
        value={environment}
        onChange={setEnvironment}
      />
      <Selector label="Mindset" options={MINDSETS} value={mindset} onChange={setMindset} />
      <Selector label="Partner" options={PARTNERS} value={partner} onChange={setPartner} />

      <SectionLabel>Check-out timer</SectionLabel>
      <View className="border-hud/25 bg-panel/70 items-center rounded-3xl border p-5">
        <Text className="text-foreground text-5xl font-bold tracking-widest">
          {mm}:{ss}
        </Text>
        <Text className="text-muted mt-1 text-[11px]">
          Start it when you arrive. Stop it when you text your contact.
        </Text>
        <View className="mt-4 flex-row gap-2 self-stretch">
          <Pressable
            onPress={() => setTimerOn((v) => !v)}
            className="bg-hud flex-1 items-center rounded-xl py-3 active:opacity-80"
          >
            <Text className="text-abyss font-mono text-[11px] tracking-widest uppercase">
              {timerOn ? 'Pause' : 'Start'}
            </Text>
          </Pressable>
          <Pressable
            onPress={() => {
              setTimerOn(false);
              setSeconds(0);
            }}
            className="border-border bg-panel-deep flex-1 items-center rounded-xl border py-3 active:opacity-70"
          >
            <Text className="text-muted font-mono text-[11px] tracking-widest uppercase">
              Reset
            </Text>
          </Pressable>
        </View>
      </View>

      <Pressable
        onPress={() => {
          addSession({ shieldScore: score, environment, mindset, partner });
          setLogged(true);
        }}
        className="border-hud bg-hud/15 mt-5 items-center rounded-2xl border py-4 active:opacity-80"
      >
        <Text className="text-hud font-mono text-xs tracking-widest uppercase">
          {logged ? 'Session logged' : 'Log this session'}
        </Text>
      </Pressable>
    </ScreenShell>
  );
}

function Selector({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <View className="mb-3">
      <Text className="text-muted mb-2 font-mono text-[10px] tracking-wider uppercase">
        {label}
      </Text>
      <View className="flex-row flex-wrap gap-2">
        {options.map((option) => {
          const on = option === value;
          return (
            <Pressable
              key={option}
              onPress={() => onChange(option)}
              className={`rounded-full border px-3 py-2 active:opacity-70 ${
                on ? 'border-hud bg-hud/15' : 'border-border bg-panel/60'
              }`}
            >
              <Text className={`text-[11px] font-semibold ${on ? 'text-hud' : 'text-muted'}`}>
                {option}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
