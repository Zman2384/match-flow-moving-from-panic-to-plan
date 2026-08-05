import { Star } from 'lucide-react-native';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, Text, TextInput, View } from 'react-native';

import { Disclaimer, HudPanel, ScreenShell, SectionLabel } from '@/components/ScreenShell';
import { SCRIPT_SITUATIONS } from '@/lib/content';
import { PIECE_COLOR } from '@/lib/match';
import { useMatchStore } from '@/lib/store';

type Group = 'field' | 'clinic' | 'saved' | 'mine';

const GROUPS: { id: Group; label: string }[] = [
  { id: 'field', label: 'In the moment' },
  { id: 'clinic', label: 'Clinic & care' },
  { id: 'saved', label: 'Starred' },
  { id: 'mine', label: 'My scripts' },
];

export default function ScriptVaultScreen() {
  const [group, setGroup] = useState<Group>('field');
  const [openId, setOpenId] = useState<string | null>(SCRIPT_SITUATIONS[0]?.id ?? null);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');

  const favoriteScriptIds = useMatchStore((s) => s.favoriteScriptIds);
  const toggleFavoriteScript = useMatchStore((s) => s.toggleFavoriteScript);
  const customScripts = useMatchStore((s) => s.customScripts);
  const addCustomScript = useMatchStore((s) => s.addCustomScript);
  const removeCustomScript = useMatchStore((s) => s.removeCustomScript);

  const situations =
    group === 'saved'
      ? SCRIPT_SITUATIONS.filter((s) => s.lines.some((line) => favoriteScriptIds.includes(line.id)))
      : group === 'mine'
        ? []
        : SCRIPT_SITUATIONS.filter((s) => s.group === group);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flex: 1 }}
    >
      <ScreenShell
        title="Script Vault"
        subtitle="Language you rehearse now so it is available under pressure"
        hint="Star the lines that sound like you. Starred lines get their own tab."
      >
        <View className="mb-4 flex-row flex-wrap gap-2">
          {GROUPS.map((item) => {
            const on = group === item.id;
            return (
              <Pressable
                key={item.id}
                onPress={() => setGroup(item.id)}
                className={`rounded-full border px-3.5 py-2 active:opacity-70 ${
                  on ? 'border-hud bg-hud/15' : 'border-border bg-panel/60'
                }`}
              >
                <Text
                  className={`text-[11px] font-bold tracking-wider uppercase ${
                    on ? 'text-hud' : 'text-muted'
                  }`}
                >
                  {item.label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {group === 'mine' ? (
          <>
            <HudPanel label="Write your own">
              <TextInput
                value={title}
                onChangeText={setTitle}
                placeholder="What is this for?"
                placeholderTextColorClassName="accent-muted"
                className="border-border bg-panel-deep text-foreground mb-3 rounded-xl border px-3 py-3 text-sm"
              />
              <TextInput
                value={body}
                onChangeText={setBody}
                placeholder="The exact sentence you want to be able to say"
                placeholderTextColorClassName="accent-muted"
                multiline
                className="border-border bg-panel-deep text-foreground min-h-[96px] rounded-xl border px-3 py-3 text-sm"
                style={{ textAlignVertical: 'top' }}
              />
              <Pressable
                disabled={!title.trim() || !body.trim()}
                onPress={() => {
                  addCustomScript({ title: title.trim(), body: body.trim(), situation: 'custom' });
                  setTitle('');
                  setBody('');
                }}
                className={`mt-3 items-center rounded-xl py-3 ${
                  title.trim() && body.trim() ? 'bg-hud active:opacity-80' : 'bg-panel-deep'
                }`}
              >
                <Text
                  className={`text-xs font-bold tracking-widest uppercase ${
                    title.trim() && body.trim() ? 'text-abyss' : 'text-muted'
                  }`}
                >
                  Save script
                </Text>
              </Pressable>
            </HudPanel>

            {customScripts.length === 0 ? (
              <Text className="text-muted mt-4 text-[12px]">
                Nothing saved yet. Your own words beat a template every time.
              </Text>
            ) : (
              <>
                <SectionLabel>Saved by you</SectionLabel>
                {customScripts.map((script) => (
                  <View
                    key={script.id}
                    className="border-hud/25 bg-panel/70 mb-2 rounded-2xl border p-4"
                  >
                    <Text className="text-hud text-[10px] font-bold tracking-widest uppercase">
                      {script.title}
                    </Text>
                    <Text className="text-foreground mt-1.5 text-[13px] leading-5">
                      “{script.body}”
                    </Text>
                    <Text
                      onPress={() => removeCustomScript(script.id)}
                      className="text-danger mt-2 text-[11px] font-bold"
                    >
                      Delete
                    </Text>
                  </View>
                ))}
              </>
            )}
          </>
        ) : situations.length === 0 ? (
          <Text className="text-muted text-[12px]">
            No starred lines yet. Tap the star on any script to keep it here.
          </Text>
        ) : (
          situations.map((situation) => {
            const open = openId === situation.id;
            const lines =
              group === 'saved'
                ? situation.lines.filter((line) => favoriteScriptIds.includes(line.id))
                : situation.lines;
            return (
              <View
                key={situation.id}
                className="border-hud/20 bg-panel/60 mb-3 overflow-hidden rounded-2xl border"
              >
                <Pressable
                  onPress={() => setOpenId(open ? null : situation.id)}
                  className="flex-row items-center gap-3 p-4 active:opacity-70"
                >
                  <View className="flex-1">
                    <Text className="text-foreground text-[14px] font-bold">{situation.title}</Text>
                    <Text className="text-muted mt-0.5 text-[11px]">{situation.description}</Text>
                  </View>
                  <View className="flex-row gap-1">
                    {situation.pieces.map((piece) => (
                      <View
                        key={piece}
                        className="h-4 w-4 items-center justify-center rounded"
                        style={{ backgroundColor: `${PIECE_COLOR[piece]}33` }}
                      >
                        <Text
                          className="text-[8px] font-bold"
                          style={{ color: PIECE_COLOR[piece] }}
                        >
                          {piece}
                        </Text>
                      </View>
                    ))}
                  </View>
                </Pressable>

                {open ? (
                  <View className="border-hud/15 border-t p-4 pt-3">
                    {lines.map((line) => {
                      const starred = favoriteScriptIds.includes(line.id);
                      return (
                        <View key={line.id} className="mb-3">
                          <View className="flex-row items-start justify-between gap-3">
                            <Text className="text-hud/80 flex-1 text-[10px] font-bold tracking-wider uppercase">
                              {line.goal}
                            </Text>
                            <Pressable
                              hitSlop={8}
                              onPress={() => toggleFavoriteScript(line.id)}
                              className="active:opacity-60"
                            >
                              <Star
                                size={15}
                                color={starred ? '#dfc401' : '#5f7791'}
                                fill={starred ? '#dfc401' : 'transparent'}
                              />
                            </Pressable>
                          </View>
                          <Text className="text-foreground mt-1 text-[13px] leading-5">
                            “{line.text}”
                          </Text>
                          {line.followUp ? (
                            <Text className="text-muted mt-1 text-[11px] leading-4 italic">
                              If they push back: “{line.followUp}”
                            </Text>
                          ) : null}
                        </View>
                      );
                    })}
                  </View>
                ) : null}
              </View>
            );
          })
        )}

        <Disclaimer />
      </ScreenShell>
    </KeyboardAvoidingView>
  );
}
