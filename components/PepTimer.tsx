import { router } from 'expo-router';
import { MapPin, MessageSquareQuote, Minus, Navigation, Plus, Timer, Trash2 } from '@/lib/icons';
import { type ReactNode, useEffect, useState } from 'react';
import { Linking, Pressable, Text, View } from 'react-native';

import { BodyText } from '@/components/ScreenShell';
import {
  CAUTION,
  HUD,
  INK_ON_SIGNAL,
  PANEL,
  SILVER_LIGHT,
  STATE_FAIL,
  STEEL_SOFT,
} from '@/lib/palette';
import { useMatchStore } from '@/lib/store';

const HOUR = 60 * 60 * 1000;
const WINDOW_HOURS = 72;
const MAX_HOURS_AGO = 96;
const QUICK_HOURS = [0, 2, 6, 12, 24, 48];

const BEN_TAUB_MAPS =
  'https://www.google.com/maps/search/?api=1&query=Ben+Taub+Hospital+Emergency+Center+Houston+TX';

/** Final hours use the brand alarm colour; a passed window drops to steel. */
const FINAL = STATE_FAIL;
const PASSED = STEEL_SOFT;

interface Zone {
  label: string;
  body: string;
  color: string;
}

/**
 * Every zone inside the window says "go now". PEP should start as soon as
 * possible and no later than 72 hours; earlier zones are not "safer to wait".
 */
function zoneFor(elapsedHours: number): Zone {
  if (elapsedHours < 24) {
    return {
      label: 'Hours 0–24 · Go now',
      body: 'The sooner PEP starts, the better it works. Go to an emergency department or urgent PEP clinic now.',
      color: HUD,
    };
  }
  if (elapsedHours < 48) {
    return {
      label: 'Hours 24–48 · Still in the window',
      body: 'You still have time, but do not wait for an appointment or a callback. Go now.',
      color: CAUTION,
    };
  }
  if (elapsedHours < WINDOW_HOURS) {
    return {
      label: 'Hours 48–72 · Final hours',
      body: 'Go to an emergency department now and say: “I need to be evaluated for HIV PEP.”',
      color: FINAL,
    };
  }
  return {
    label: 'The 72-hour window has passed',
    body: 'PEP is generally not started after 72 hours, but you still need care: get tested for HIV and STIs now and at follow-up, and ask about PrEP going forward.',
    color: PASSED,
  };
}

function pad(n: number) {
  return n.toString().padStart(2, '0');
}

function splitRemaining(ms: number) {
  const total = Math.max(0, Math.floor(ms / 1000));
  return {
    h: Math.floor(total / 3600),
    m: Math.floor((total % 3600) / 60),
    s: total % 60,
  };
}

function formatLogged(iso: string) {
  return new Date(iso).toLocaleString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

function hoursAgoLabel(h: number) {
  if (h === 0) return 'Just now';
  return h === 1 ? '1 hour ago' : `${h} hours ago`;
}

/** Ask when the exposure happened, then start the clock. */
function StartClock({ onStart }: { onStart: (hoursAgo: number) => void }) {
  const [hoursAgo, setHoursAgo] = useState(0);
  const step = (delta: number) =>
    setHoursAgo((h) => Math.min(MAX_HOURS_AGO, Math.max(0, h + delta)));

  return (
    <View>
      <BodyText className="text-foreground">
        When did the possible exposure happen? Your best guess is fine.
      </BodyText>

      <View className="mt-3 flex-row flex-wrap gap-2">
        {QUICK_HOURS.map((h) => {
          const active = hoursAgo === h;
          return (
            <Pressable
              key={h}
              onPress={() => setHoursAgo(h)}
              accessibilityRole="button"
              accessibilityState={{ selected: active }}
              className="rounded-full border px-3 py-2 active:opacity-70"
              style={{
                borderColor: active ? HUD : `${HUD}44`,
                backgroundColor: active ? `${HUD}26` : 'transparent',
              }}
            >
              <Text className="text-foreground text-[13px] font-semibold">
                {h === 0 ? 'Just now' : `${h}h ago`}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <View className="border-hud/25 mt-3 flex-row items-center justify-between rounded-xl border px-2 py-2">
        <Pressable
          onPress={() => step(-1)}
          accessibilityLabel="One hour less"
          className="h-11 w-11 items-center justify-center rounded-lg active:opacity-70"
        >
          <Minus size={18} color={HUD} />
        </Pressable>
        <Text className="text-foreground font-mono text-[15px]">{hoursAgoLabel(hoursAgo)}</Text>
        <Pressable
          onPress={() => step(1)}
          accessibilityLabel="One hour more"
          className="h-11 w-11 items-center justify-center rounded-lg active:opacity-70"
        >
          <Plus size={18} color={HUD} />
        </Pressable>
      </View>

      <Pressable
        onPress={() => onStart(hoursAgo)}
        accessibilityRole="button"
        className="bg-hud mt-4 flex-row items-center justify-center gap-2 rounded-xl py-4 active:opacity-80"
      >
        <Timer size={18} color={INK_ON_SIGNAL} />
        <Text
          className="font-mono text-[14px] font-bold tracking-wider uppercase"
          style={{ color: INK_ON_SIGNAL }}
        >
          Start my 72-hour clock
        </Text>
      </Pressable>
    </View>
  );
}

/** Live countdown to the end of the 72-hour PEP window. */
function Countdown({ exposureAt }: { exposureAt: string }) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const start = new Date(exposureAt).getTime();
  const elapsedHours = (now - start) / HOUR;
  const remainingMs = start + WINDOW_HOURS * HOUR - now;
  const zone = zoneFor(elapsedHours);
  const { h, m, s } = splitRemaining(remainingMs);
  const remainingPct = Math.max(0, Math.min(1, remainingMs / (WINDOW_HOURS * HOUR)));
  const open = remainingMs > 0;

  return (
    <View>
      <View
        className="items-center rounded-xl border px-3 py-5"
        style={{ borderColor: `${zone.color}55`, backgroundColor: `${zone.color}12` }}
      >
        <Text className="text-muted font-mono text-[11px] tracking-widest uppercase">
          {open ? 'Time left in the PEP window' : 'PEP window'}
        </Text>
        <Text
          accessibilityLabel={
            open ? `${h} hours, ${m} minutes left in the PEP window` : 'The PEP window has passed'
          }
          className="mt-1 font-mono text-[44px] font-bold tracking-tight"
          style={{ color: open ? SILVER_LIGHT : PASSED }}
        >
          {pad(h)}:{pad(m)}:{pad(s)}
        </Text>
        <View className="mt-0.5 flex-row gap-9">
          {['Hours', 'Min', 'Sec'].map((unit) => (
            <Text key={unit} className="text-muted font-mono text-[11px] tracking-widest uppercase">
              {unit}
            </Text>
          ))}
        </View>

        <View className="bg-panel-deep mt-4 h-2.5 w-full overflow-hidden rounded-full">
          <View
            className="h-full rounded-full"
            style={{ width: `${remainingPct * 100}%`, backgroundColor: zone.color }}
          />
        </View>
      </View>

      <Text
        className="mt-4 font-mono text-[12px] font-bold tracking-wider uppercase"
        style={{ color: zone.color }}
      >
        {zone.label}
      </Text>
      <BodyText className="text-foreground mt-1">{zone.body}</BodyText>
      <Text className="text-muted mt-2 text-[12px]">
        Clock started from: {formatLogged(exposureAt)}
      </Text>
    </View>
  );
}

function ActionButton({
  icon,
  label,
  onPress,
  primary = false,
}: {
  icon: ReactNode;
  label: string;
  onPress: () => void;
  primary?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      className="mb-2 flex-row items-center gap-3 rounded-xl border px-4 py-3.5 active:opacity-70"
      style={{
        borderColor: primary ? HUD : `${HUD}33`,
        backgroundColor: primary ? `${HUD}22` : `${PANEL}cc`,
      }}
    >
      {icon}
      <Text className="text-foreground flex-1 text-[15px] font-semibold">{label}</Text>
    </Pressable>
  );
}

/**
 * 72-hour PEP window timer. The start time lives only on this device
 * (Zero Stigma Tax): nothing is uploaded, and Erase removes it at once.
 */
export function PepTimer() {
  const exposureAt = useMatchStore((s) => s.pepExposureAt);
  const setPepExposure = useMatchStore((s) => s.setPepExposure);
  const clearPepExposure = useMatchStore((s) => s.clearPepExposure);
  // The PEP request script only applies inside the window (checked on each render).
  const windowPassed =
    exposureAt !== null && Date.now() - new Date(exposureAt).getTime() >= WINDOW_HOURS * HOUR;

  return (
    <View
      className="mb-5 overflow-hidden rounded-2xl border p-4"
      style={{ borderColor: `${HUD}44`, backgroundColor: `${PANEL}e6` }}
    >
      <View className="mb-3 flex-row items-center gap-2">
        <Timer size={16} color={HUD} />
        <Text className="text-hud font-mono text-[12px] font-bold tracking-widest uppercase">
          72-hour PEP window
        </Text>
      </View>

      {exposureAt ? (
        <Countdown exposureAt={exposureAt} />
      ) : (
        <StartClock
          onStart={(hoursAgo) =>
            setPepExposure(new Date(Date.now() - hoursAgo * HOUR).toISOString())
          }
        />
      )}

      <View className="mt-4">
        <ActionButton
          primary
          icon={<MapPin size={18} color={HUD} />}
          label="Find care near me"
          onPress={() => router.push('/tools/clinics')}
        />
        <ActionButton
          icon={<Navigation size={18} color={HUD} />}
          label="Directions: Ben Taub ER (Houston, 24/7)"
          onPress={() => void Linking.openURL(BEN_TAUB_MAPS).catch(() => undefined)}
        />
        {windowPassed ? null : (
          <ActionButton
            icon={<MessageSquareQuote size={18} color={HUD} />}
            label="What to say at the ER"
            onPress={() =>
              router.push({ pathname: '/tools/scripts', params: { script: 'clinic-pep' } })
            }
          />
        )}
      </View>

      <View className="border-border mt-2 flex-row items-center gap-3 border-t pt-3">
        <Text className="text-muted flex-1 text-[12px] leading-5">
          Saved only on this phone. Nothing is uploaded.
        </Text>
        {exposureAt ? (
          <Pressable
            onPress={clearPepExposure}
            accessibilityRole="button"
            accessibilityLabel="Erase the PEP timer from this phone"
            className="flex-row items-center gap-1.5 rounded-lg px-3 py-2 active:opacity-70"
          >
            <Trash2 size={14} color={FINAL} />
            <Text className="text-[13px] font-semibold" style={{ color: FINAL }}>
              Erase timer
            </Text>
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}
