import { Link, router } from 'expo-router';
import { Ghost, Lock, Plus, ShieldCheck, Sparkles, Trash2 } from 'lucide-react-native';
import { useMemo, useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, Text, TextInput, View } from 'react-native';

import { GlitchLabel, VaultCore } from '@/components/GhostVaultCore';
import { BodyText, HudPanel, ScreenShell, SectionLabel } from '@/components/ScreenShell';
import {
  archetypeEntry,
  CATEGORY_BY_ID,
  customEntry,
  GHOST_CATEGORIES,
  GHOSTS,
  LEGACY_GHOSTS,
  type GhostCategoryId,
  type GhostEntry,
  pieceDemand,
  SPECTRUM,
  SPECTRUM_BY_ID,
} from '@/lib/ghosts';
import { PIECE_BY_KEY, type PieceKey } from '@/lib/match';
import { ABYSS, HUD, LINE, STATE_FAIL, STEEL_SOFT } from '@/lib/palette';
import { type GhostRecord, useMatchStore } from '@/lib/store';

type Filter = GhostCategoryId | 'all';

export default function GhostVaultScreen() {
  const records = useMatchStore((s) => s.ghostRecords);
  const customGhosts = useMatchStore((s) => s.customGhosts);
  const spectrum = useMatchStore((s) => s.ghostSpectrum);
  const setGhostSpectrum = useMatchStore((s) => s.setGhostSpectrum);
  const nameGhost = useMatchStore((s) => s.nameGhost);
  const addCustomGhost = useMatchStore((s) => s.addCustomGhost);

  const [filter, setFilter] = useState<Filter>('all');
  const [ownGhost, setOwnGhost] = useState('');
  const [ownCategory, setOwnCategory] = useState<GhostCategoryId>('relational');

  const entries = useMemo<GhostEntry[]>(
    () => [
      ...customGhosts.map(customEntry),
      ...GHOSTS.map(archetypeEntry),
      ...LEGACY_GHOSTS.filter(
        (ghost) => records[ghost.id] && !GHOSTS.some((item) => item.id === ghost.id),
      ).map((ghost) => archetypeEntry({ ...ghost, name: `${ghost.name} (saved supplemental)` })),
    ],
    [customGhosts, records],
  );

  const named = useMemo(() => {
    const withRecord = entries
      .map((entry) => ({ entry, record: records[entry.id] }))
      .filter((row): row is { entry: GhostEntry; record: GhostRecord } => Boolean(row.record));
    return [...withRecord].sort((a, b) => b.record.namedAt.localeCompare(a.record.namedAt));
  }, [entries, records]);

  const loose = useMemo(
    () =>
      entries.filter(
        (entry) => !records[entry.id] && (filter === 'all' || entry.category === filter),
      ),
    [entries, records, filter],
  );

  const disarmedCount = named.filter((row) => row.record.disarmedAt).length;
  const charge = named.length === 0 ? 0 : Math.round((disarmedCount / named.length) * 100);
  const priorities = useMemo(
    () => pieceDemand(named.filter((row) => !row.record.disarmedAt).map((row) => row.entry)),
    [named],
  );

  const stage = SPECTRUM_BY_ID[spectrum];
  const canAdd = ownGhost.trim().length > 1;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flex: 1 }}
    >
      <ScreenShell
        title="Digital Ghost Vault"
        chapterIcon={Ghost}
        subtitle="Name the fear, map it to a piece, watch the glitch solidify"
        hint="A fear you can name is a task. A fear you cannot name runs the whole night."
      >
        <HudPanel label="Before you start">
          <BodyText className="text-muted">
            Fear is a biological response, not a character flaw. Your body is doing exactly what it
            evolved to do — flooding the system so you freeze instead of act. Naming the specific
            ghost gives that flood somewhere to go.
          </BodyText>
        </HudPanel>

        <SectionLabel>Emotional transition spectrum</SectionLabel>
        <HudPanel label="Where you are right now" status={stage.label.toUpperCase()}>
          <View className="flex-row gap-1.5">
            {SPECTRUM.map((item) => {
              const active = item.id === spectrum;
              return (
                <Pressable
                  key={item.id}
                  onPress={() => setGhostSpectrum(item.id)}
                  accessibilityRole="button"
                  accessibilityLabel={`Mark yourself as ${item.label}`}
                  className="flex-1 items-center rounded-xl border py-2.5 active:opacity-70"
                  style={{
                    borderColor: active ? item.color : LINE,
                    backgroundColor: active ? `${item.color}22` : 'transparent',
                  }}
                >
                  <Text
                    className="text-[10px] font-bold tracking-wider uppercase"
                    style={{ color: active ? item.color : STEEL_SOFT }}
                  >
                    {item.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <View className="mt-3 h-1 flex-row overflow-hidden rounded-full bg-black/40">
            {SPECTRUM.map((item, index) => (
              <View
                key={item.id}
                className="flex-1"
                style={{
                  backgroundColor:
                    index <= SPECTRUM.findIndex((s) => s.id === spectrum)
                      ? stage.color
                      : 'transparent',
                  opacity: index <= SPECTRUM.findIndex((s) => s.id === spectrum) ? 0.8 : 0,
                }}
              />
            ))}
          </View>

          <BodyText className="text-foreground mt-3">{stage.state}</BodyText>
          <View className="border-hud/25 bg-hud/[0.07] mt-3 rounded-xl border p-3">
            <Text className="text-hud text-[10px] font-bold tracking-[2px] uppercase">
              Next move
            </Text>
            <BodyText className="text-foreground/90 mt-1">{stage.guidance}</BodyText>
          </View>
        </HudPanel>

        <SectionLabel>Vault core</SectionLabel>
        <HudPanel label="Ghosts named & disarmed" status={`${charge}% CHARGE`}>
          <VaultCore charge={charge} named={named.length} disarmed={disarmedCount} />

          <View className="mt-3 h-2 overflow-hidden rounded-full bg-black/50">
            <View
              className="bg-hud h-full rounded-full"
              style={{ width: `${named.length === 0 ? 0 : charge}%` }}
            />
          </View>
          <View className="mt-2 flex-row justify-between">
            <BodyText className="text-muted">
              {named.length} named of {entries.length} in the library
            </BodyText>
            <Text className="text-hud text-base font-bold">{disarmedCount} disarmed</Text>
          </View>

          <View className="border-hud/20 mt-4 flex-row items-center gap-2 rounded-xl border border-dashed p-3">
            <Lock size={14} color={HUD} />
            <BodyText className="text-muted flex-1">
              Your Ghost Audit stays on this device. No account or upload. Use Settings to erase it;
              device backups may retain a copy.
            </BodyText>
          </View>
        </HudPanel>

        {priorities.length > 0 ? (
          <>
            <SectionLabel>Logic engine</SectionLabel>
            <HudPanel label="Armor priorities" status="FROM YOUR LIVE GHOSTS">
              <BodyText className="text-muted mb-3">
                Every ghost still loose maps to a MATCH piece. These are the pieces carrying your
                fear right now.
              </BodyText>
              {priorities.map(({ piece: key, count }) => {
                const piece = PIECE_BY_KEY[key];
                return (
                  <Link key={key} href={{ pathname: '/piece/[key]', params: { key } }} asChild>
                    <Pressable
                      className="mb-2 flex-row items-center gap-3 rounded-xl border p-3 active:opacity-70"
                      style={{
                        borderColor: `${piece.color}55`,
                        backgroundColor: `${piece.color}12`,
                      }}
                    >
                      <View
                        className="h-9 w-9 items-center justify-center rounded-lg"
                        style={{ backgroundColor: `${piece.color}2e` }}
                      >
                        <Text className="text-sm font-bold" style={{ color: piece.color }}>
                          {key}
                        </Text>
                      </View>
                      <View className="flex-1">
                        <Text className="text-foreground text-base font-bold">{piece.name}</Text>
                        <BodyText className="text-muted">{piece.tagline}</BodyText>
                      </View>
                      <Text className="text-[11px] font-bold" style={{ color: piece.color }}>
                        {count} {count === 1 ? 'ghost' : 'ghosts'}
                      </Text>
                    </Pressable>
                  </Link>
                );
              })}
            </HudPanel>
          </>
        ) : null}

        {named.length > 0 ? (
          <>
            <SectionLabel>In the light</SectionLabel>
            {named.map((row) => (
              <NamedGhostCard key={row.entry.id} entry={row.entry} record={row.record} />
            ))}
          </>
        ) : null}

        <SectionLabel>Still glitching</SectionLabel>
        <View className="mb-3 flex-row flex-wrap gap-2">
          <FilterChip
            label="All"
            color={HUD}
            active={filter === 'all'}
            onPress={() => setFilter('all')}
          />
          {GHOST_CATEGORIES.map((category) => (
            <FilterChip
              key={category.id}
              label={category.label}
              color={category.color}
              active={filter === category.id}
              onPress={() => setFilter(category.id)}
            />
          ))}
        </View>

        {loose.length === 0 ? (
          <View className="border-hud/25 bg-panel/50 items-center rounded-2xl border border-dashed p-6">
            <ShieldCheck size={22} color={HUD} />
            <Text className="text-foreground mt-2 text-center text-base font-semibold">
              Nothing loose in this category.
            </Text>
            <BodyText className="text-muted mt-1 text-center">
              Every ghost here is named. Add your own below if one is missing.
            </BodyText>
          </View>
        ) : (
          loose.map((entry, index) => (
            <LooseGhostCard
              key={entry.id}
              entry={entry}
              delay={(index % 6) * 260}
              onName={() => nameGhost(entry.id)}
            />
          ))
        )}

        <SectionLabel>Your own words</SectionLabel>
        <HudPanel label="Private entry">
          <BodyText className="text-muted mb-3">
            If your ghost is not on the list, write it. One sentence is enough — the engine files it
            by category and hands you the matching pieces.
          </BodyText>
          <TextInput
            value={ownGhost}
            onChangeText={setOwnGhost}
            placeholder="What exactly are you afraid of?"
            placeholderTextColorClassName="accent-muted"
            multiline
            className="border-border bg-panel-deep text-foreground font-body min-h-[72px] rounded-2xl border px-3 py-3 text-base"
            style={{ textAlignVertical: 'top' }}
          />
          <View className="mt-3 flex-row flex-wrap gap-2">
            {GHOST_CATEGORIES.map((category) => (
              <FilterChip
                key={category.id}
                label={category.label}
                color={category.color}
                active={ownCategory === category.id}
                onPress={() => setOwnCategory(category.id)}
              />
            ))}
          </View>
          <Pressable
            disabled={!canAdd}
            onPress={() => {
              addCustomGhost(ownGhost.trim(), ownCategory);
              setOwnGhost('');
            }}
            accessibilityRole="button"
            accessibilityLabel="Drag this ghost into the light"
            className={`mt-4 flex-row items-center justify-center gap-2 rounded-2xl py-4 ${
              canAdd ? 'bg-hud active:opacity-80' : 'bg-panel-deep'
            }`}
          >
            <Plus size={15} color={canAdd ? ABYSS : STEEL_SOFT} />
            <Text
              className={`text-xs font-bold tracking-widest uppercase ${
                canAdd ? 'text-abyss' : 'text-muted'
              }`}
            >
              Drag it into the light
            </Text>
          </Pressable>
        </HudPanel>

        <Pressable
          onPress={() => router.push('/tools/anxiety')}
          accessibilityRole="button"
          accessibilityLabel="Open the Anxiety Reframe tool"
          className="border-hud/25 bg-panel/60 mt-4 flex-row items-center gap-3 rounded-2xl border p-4 active:opacity-70"
        >
          <Sparkles size={18} color={HUD} />
          <View className="flex-1">
            <Text className="text-foreground text-base font-bold">
              Spiralling on one specific night?
            </Text>
            <BodyText className="text-muted mt-0.5">
              The Anxiety Reframe separates that fear from the evidence and gives you one action.
            </BodyText>
          </View>
        </Pressable>
      </ScreenShell>
    </KeyboardAvoidingView>
  );
}

function FilterChip({
  label,
  color,
  active,
  onPress,
}: {
  label: string;
  color: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      className="rounded-full border px-3 py-1.5 active:opacity-70"
      style={{
        borderColor: active ? color : LINE,
        backgroundColor: active ? `${color}22` : 'transparent',
      }}
    >
      <Text
        className="text-[11px] font-bold tracking-wider uppercase"
        style={{ color: active ? color : STEEL_SOFT }}
      >
        {label}
      </Text>
    </Pressable>
  );
}

function PieceChips({ pieces }: { pieces: PieceKey[] }) {
  return (
    <View className="flex-row flex-wrap gap-1.5">
      {pieces.map((key) => {
        const piece = PIECE_BY_KEY[key];
        return (
          <Link key={key} href={{ pathname: '/piece/[key]', params: { key } }} asChild>
            <Pressable
              className="flex-row items-center gap-1.5 rounded-lg border px-2 py-1 active:opacity-70"
              style={{ borderColor: `${piece.color}66`, backgroundColor: `${piece.color}18` }}
            >
              <Text className="text-[10px] font-bold" style={{ color: piece.color }}>
                {key}
              </Text>
              <Text className="text-[10px] font-semibold" style={{ color: piece.color }}>
                {piece.name}
              </Text>
            </Pressable>
          </Link>
        );
      })}
    </View>
  );
}

/** Unprocessed fear — dim, dashed, glitching until it is named. */
function LooseGhostCard({
  entry,
  delay,
  onName,
}: {
  entry: GhostEntry;
  delay: number;
  onName: () => void;
}) {
  const category = CATEGORY_BY_ID[entry.category];

  return (
    <Pressable
      onPress={onName}
      accessibilityRole="button"
      accessibilityLabel={`Name the ghost: ${entry.name}`}
      className="mb-2.5 rounded-2xl border border-dashed p-4 active:opacity-60"
      style={{ borderColor: `${category.color}55`, backgroundColor: `${category.color}0d` }}
    >
      <View className="flex-row items-start gap-3">
        <View
          className="h-9 w-9 items-center justify-center rounded-lg"
          style={{ backgroundColor: `${category.color}22` }}
        >
          <Ghost size={17} color={category.color} />
        </View>
        <View className="flex-1">
          <GlitchLabel text={entry.name} color={category.color} delay={delay} />
          <BodyText className="text-muted mt-1.5">“{entry.fear}”</BodyText>
          <View className="mt-2.5 flex-row items-center gap-1.5">
            <Plus size={12} color={category.color} />
            <Text
              className="text-[10px] font-bold tracking-widest uppercase"
              style={{ color: category.color }}
            >
              Name it
            </Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

/** A named ghost: solid, mapped to pieces, with a private note and a disarm switch. */
function NamedGhostCard({ entry, record }: { entry: GhostEntry; record: GhostRecord }) {
  const category = CATEGORY_BY_ID[entry.category];
  const toggleGhostDisarmed = useMatchStore((s) => s.toggleGhostDisarmed);
  const releaseGhost = useMatchStore((s) => s.releaseGhost);
  const setGhostNote = useMatchStore((s) => s.setGhostNote);
  const [note, setNote] = useState(record.note);
  const disarmed = Boolean(record.disarmedAt);

  return (
    <View
      className="border-hud/25 bg-panel-deep/80 mb-2.5 overflow-hidden rounded-2xl border"
      style={disarmed ? { borderColor: `${HUD}66` } : undefined}
    >
      <View
        className="flex-row items-center justify-between border-b border-black/30 px-4 py-2.5"
        style={{ backgroundColor: `${category.color}1a` }}
      >
        <Text
          className="text-[9px] font-bold tracking-[2px] uppercase"
          style={{ color: category.color }}
        >
          {category.fullLabel}
        </Text>
        <Text className="text-muted text-[9px] font-semibold">
          {disarmed ? 'DISARMED' : 'IN THE LIGHT'}
        </Text>
      </View>

      <View className="p-4">
        <View className="flex-row items-start gap-3">
          <View
            className="h-9 w-9 items-center justify-center rounded-lg border"
            style={{
              borderColor: disarmed ? `${HUD}66` : `${category.color}55`,
              backgroundColor: disarmed ? `${HUD}1f` : `${category.color}1f`,
            }}
          >
            {disarmed ? (
              <ShieldCheck size={17} color={HUD} />
            ) : (
              <Ghost size={17} color={category.color} />
            )}
          </View>
          <View className="flex-1">
            <Text className="text-foreground text-base font-bold">{entry.name}</Text>
            {entry.custom ? null : <BodyText className="text-muted mt-1">“{entry.fear}”</BodyText>}
          </View>
        </View>

        <View className="border-hud/20 bg-hud/[0.06] mt-3 rounded-xl border p-3">
          <Text className="text-hud text-[10px] font-bold tracking-[2px] uppercase">
            Counter-move
          </Text>
          <BodyText className="text-foreground/90 mt-1">{entry.disarm}</BodyText>
        </View>

        <Text className="text-hud/70 mt-3 mb-2 text-[10px] font-bold tracking-[2px] uppercase">
          Carried by
        </Text>
        <PieceChips pieces={entry.pieces} />

        <TextInput
          value={note}
          onChangeText={setNote}
          onEndEditing={() => setGhostNote(entry.id, note.trim())}
          onBlur={() => setGhostNote(entry.id, note.trim())}
          placeholder="Private note — what this one actually costs you"
          placeholderTextColorClassName="accent-muted"
          multiline
          className="border-border bg-panel-deep text-foreground font-body mt-3 min-h-[60px] rounded-xl border px-3 py-2.5 text-base"
          style={{ textAlignVertical: 'top' }}
        />

        {entry.href && entry.hrefLabel ? (
          <Link href={entry.href} asChild>
            <Pressable className="mt-3 flex-row items-center justify-center gap-1.5 py-2 active:opacity-60">
              <Text className="text-hud text-[11px] font-bold">{entry.hrefLabel} →</Text>
            </Pressable>
          </Link>
        ) : null}

        <View className="mt-3 flex-row items-center gap-2">
          <Pressable
            onPress={() => toggleGhostDisarmed(entry.id)}
            accessibilityRole="button"
            accessibilityLabel={disarmed ? `Re-arm ${entry.name}` : `Disarm ${entry.name}`}
            className={`flex-1 flex-row items-center justify-center gap-2 rounded-xl py-3 active:opacity-80 ${
              disarmed ? 'border-hud/40 border bg-transparent' : 'bg-hud'
            }`}
          >
            <ShieldCheck size={14} color={disarmed ? HUD : ABYSS} />
            <Text
              className={`text-[11px] font-bold tracking-widest uppercase ${
                disarmed ? 'text-hud' : 'text-abyss'
              }`}
            >
              {disarmed ? 'Disarmed' : 'Mark disarmed'}
            </Text>
          </Pressable>
          <Pressable
            onPress={() => releaseGhost(entry.id)}
            accessibilityRole="button"
            accessibilityLabel={`Remove ${entry.name} from the vault`}
            hitSlop={8}
            className="border-border h-11 w-11 items-center justify-center rounded-xl border active:opacity-70"
          >
            <Trash2 size={15} color={STATE_FAIL} />
          </Pressable>
        </View>
      </View>
    </View>
  );
}
