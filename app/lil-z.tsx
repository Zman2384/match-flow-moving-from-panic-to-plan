import * as Haptics from 'expo-haptics';
import { router, useFocusEffect } from 'expo-router';
import { Brain, Send, Trash2, X } from '@/lib/icons';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BackChip } from '@/components/BackChip';
import { HudBackdrop } from '@/components/HudBackdrop';
import { LilZAvatar, LilZThinking } from '@/components/LilZ';
import { BodyText, BrandFooter, Disclaimer } from '@/components/ScreenShell';
import {
  askLilZ,
  buildPlanContext,
  crisisCard,
  LILZ_GREETING,
  type LilZMessage,
  QUICK_PROMPTS,
  checkLiveAvailable,
  targetFor,
} from '@/lib/lilz';
import { INK_ON_SIGNAL, HUD, HUD_DIM, LINE, STEEL } from '@/lib/palette';
import { useMatchStore } from '@/lib/store';

const CYAN = HUD;
const TRACK_OFF = LINE;

/** The model is told to write plainly; strip any markdown emphasis that slips through. */
function plain(text: string) {
  return text.replace(/\*\*(.+?)\*\*/g, '$1').replace(/^#+\s*/gm, '');
}

export default function LilZScreen() {
  const insets = useSafeAreaInsets();
  const scrollRef = useRef<ScrollView>(null);
  const [draft, setDraft] = useState('');
  const [pending, setPending] = useState(false);
  const [memoryOpen, setMemoryOpen] = useState(false);
  // A fresh visit starts private; live processing is never silently remembered.
  const [liveEnabled, setLiveEnabled] = useState(false);
  // The Live AI switch only appears once the server confirms it is set up.
  const [liveAvailable, setLiveAvailable] = useState(false);
  useEffect(() => {
    let active = true;
    void checkLiveAvailable().then((available) => {
      if (active) setLiveAvailable(available);
    });
    return () => {
      active = false;
    };
  }, []);

  const messages = useMatchStore((s) => s.lilzMessages);
  const previousMessageCount = useRef(messages.length);
  /**
   * Bumped when the chat is cleared or the screen loses focus, so a reply that
   * arrives afterwards is dropped instead of refilling a cleared conversation.
   */
  const generation = useRef(0);
  useFocusEffect(
    useCallback(() => {
      setLiveEnabled(false);
      return () => {
        generation.current += 1;
      };
    }, []),
  );
  const memories = useMatchStore((s) => s.lilzMemories);
  const memoryEnabled = useMatchStore((s) => s.lilzMemoryEnabled);
  const addLilzMessage = useMatchStore((s) => s.addLilzMessage);
  const clearLilzChat = useMatchStore((s) => s.clearLilzChat);
  const rememberLilz = useMatchStore((s) => s.rememberLilz);
  const forgetLilz = useMatchStore((s) => s.forgetLilz);
  const setLilzMemoryEnabled = useMatchStore((s) => s.setLilzMemoryEnabled);

  const greeting = useMemo<LilZMessage>(
    () => ({ id: 'greeting', role: 'guide', text: LILZ_GREETING, at: '' }),
    [],
  );

  const send = useCallback(
    async (raw: string) => {
      const text = raw.trim();
      if (!text || pending) return;

      setDraft('');
      setPending(true);
      const requestGeneration = generation.current;
      const crisis = crisisCard(text);
      addLilzMessage({ role: 'user', text, crisis: Boolean(crisis) });

      if (crisis) {
        addLilzMessage({ role: 'guide', text: crisis, crisis: true });
        setPending(false);
        return;
      }

      const state = useMatchStore.getState();
      const ghosts = Object.values(state.ghostRecords);
      const reply = await askLilZ({
        liveAllowed: liveAvailable && liveEnabled,
        messages: state.lilzMessages,
        planContext: buildPlanContext({
          armed: state.armed,
          sessions: state.sessions.length,
          checkIns: state.checkIns.length,
          ghostsNamed: ghosts.length,
          ghostsDisarmed: ghosts.filter((ghost) => ghost.disarmedAt !== null).length,
          spectrum: state.ghostSpectrum,
          remindersEnabled: state.remindersEnabled,
          stressTestBest: state.stressTestBest,
        }),
        memories: state.lilzMemoryEnabled ? state.lilzMemories.map((memory) => memory.text) : [],
      });

      if (requestGeneration !== generation.current) {
        setPending(false);
        return;
      }

      addLilzMessage({
        role: 'guide',
        text: reply.reply,
        actions: reply.actions,
        offline: reply.offline,
        notice: reply.notice,
      });
      for (const fact of reply.remember) rememberLilz(fact);
      setPending(false);
      if (reply.notice) void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    },
    [addLilzMessage, liveAvailable, liveEnabled, pending, rememberLilz],
  );

  const transcript = messages.length > 0 ? messages : [greeting];

  return (
    <View className="bg-background flex-1">
      <HudBackdrop />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1, paddingTop: insets.top + 8 }}
      >
        <View className="border-hud/15 border-b px-5 pt-2 pb-3">
          <View className="mb-3 flex-row flex-wrap items-center gap-2">
            <BackChip label="Command Center" href="/(tabs)" />
          </View>

          <View className="flex-row items-center gap-3">
            <LilZAvatar size={46} pulse />
            <View className="flex-1">
              <Text className="text-foreground text-xl font-bold">Lil Z</Text>
              <BodyText className="text-muted">
                Christopher Zacharie&apos;s digital avatar · your guide, not your doctor
              </BodyText>
            </View>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="What Lil Z remembers"
              onPress={() => setMemoryOpen((open) => !open)}
              className="border-hud/30 bg-hud/10 h-9 w-9 items-center justify-center rounded-full border active:opacity-70"
            >
              <Brain size={16} color={CYAN} />
            </Pressable>
            {messages.length > 0 ? (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Clear this conversation"
                onPress={() => {
                  generation.current += 1;
                  clearLilzChat();
                }}
                className="border-border/60 h-9 w-9 items-center justify-center rounded-full border active:opacity-70"
              >
                <Trash2 size={16} color={STEEL} />
              </Pressable>
            ) : null}
          </View>

          <Disclaimer compact className="mt-3" />
        </View>

        {memoryOpen ? (
          <View className="border-hud/15 bg-panel-deep/90 border-b px-5 py-4">
            <View className="flex-row items-center justify-between">
              <View className="flex-1 pr-3">
                <Text className="text-hud font-mono text-[10px] tracking-[2px] uppercase">
                  Agent memory
                </Text>
                <BodyText className="text-muted mt-1">
                  Saved on this device. If you enable live AI, saved facts are sent with your chat.
                  Turn memory off to erase them.
                </BodyText>
              </View>
              <Switch
                value={memoryEnabled}
                onValueChange={setLilzMemoryEnabled}
                thumbColor={memoryEnabled ? CYAN : STEEL}
                trackColor={{ false: TRACK_OFF, true: HUD_DIM }}
              />
            </View>

            {memoryEnabled ? (
              memories.length > 0 ? (
                <View className="mt-3 gap-2">
                  {memories.map((memory) => (
                    <View
                      key={memory.id}
                      className="border-hud/20 flex-row items-center gap-2 rounded-xl border bg-black/25 px-3 py-2"
                    >
                      <BodyText className="text-foreground flex-1">{memory.text}</BodyText>
                      <Pressable
                        accessibilityRole="button"
                        accessibilityLabel={`Forget: ${memory.text}`}
                        onPress={() => forgetLilz(memory.id)}
                        className="active:opacity-70"
                      >
                        <X size={14} color={STEEL} />
                      </Pressable>
                    </View>
                  ))}
                </View>
              ) : (
                <BodyText className="text-muted mt-3">
                  Nothing saved yet. Tell Lil Z something worth remembering — which PrEP you take,
                  what you are working on — and it lands here.
                </BodyText>
              )
            ) : null}
          </View>
        ) : null}

        <ScrollView
          ref={scrollRef}
          className="flex-1"
          contentContainerStyle={{ padding: 20, gap: 14 }}
          onContentSizeChange={() => {
            if (previousMessageCount.current !== messages.length) {
              previousMessageCount.current = messages.length;
              scrollRef.current?.scrollToEnd({ animated: true });
            }
          }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {liveAvailable ? (
            <View className="border-hud/25 bg-panel-deep/80 rounded-2xl border p-4">
              <View className="flex-row items-center gap-3">
                <Text className="text-foreground flex-1 text-base font-semibold">
                  Live AI replies
                </Text>
                <Switch
                  accessibilityLabel="Allow live AI processing for this visit"
                  value={liveEnabled}
                  disabled={pending}
                  onValueChange={(enabled) => {
                    setLiveEnabled(enabled);
                    void Haptics.selectionAsync();
                  }}
                  thumbColor={liveEnabled ? CYAN : STEEL}
                  trackColor={{ false: TRACK_OFF, true: HUD_DIM }}
                />
              </View>
              <BodyText className="text-foreground/80 mt-2">
                Off by default. Turning this on sends recent chat messages, a MATCH plan summary and
                saved memories through our AI service to Anthropic (Claude). Avoid names or
                identifying details. Turning it off stops future sends; it cannot recall anything
                already sent.
              </BodyText>
            </View>
          ) : null}
          {transcript.map((message) => (
            <Bubble key={message.id} message={message} />
          ))}

          {pending ? (
            <View className="flex-row items-end gap-2">
              <LilZAvatar size={26} />
              <View className="border-hud/25 bg-panel-deep/85 rounded-2xl rounded-bl-md border px-4 py-3">
                <LilZThinking />
              </View>
            </View>
          ) : null}

          <BrandFooter />
        </ScrollView>

        <View
          className="border-hud/15 border-t px-4 pt-3"
          style={{ paddingBottom: insets.bottom + 10 }}
        >
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 8, paddingBottom: 10, paddingHorizontal: 2 }}
            keyboardShouldPersistTaps="handled"
          >
            {QUICK_PROMPTS.map((quick) => (
              <Pressable
                key={quick.label}
                accessibilityRole="button"
                onPress={() => void send(quick.prompt)}
                disabled={pending}
                style={{ opacity: pending ? 0.4 : 1 }}
                className="border-hud/30 bg-hud/10 rounded-full border px-3 py-1.5 active:opacity-70"
              >
                <Text className="text-hud text-[11px] font-semibold">{quick.label}</Text>
              </Pressable>
            ))}
          </ScrollView>

          <View className="border-hud/25 bg-panel-deep/90 flex-row items-end gap-2 rounded-2xl border px-3 py-2">
            <TextInput
              value={draft}
              onChangeText={setDraft}
              placeholder="Ask Lil Z anything…"
              placeholderTextColor={STEEL}
              multiline
              className="font-body text-foreground flex-1 text-base leading-6"
              style={{ minHeight: 36, maxHeight: 112 }}
              onSubmitEditing={() => void send(draft)}
            />
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Send"
              onPress={() => void send(draft)}
              disabled={pending || draft.trim().length === 0}
              style={{ opacity: pending || draft.trim().length === 0 ? 0.3 : 1 }}
              className="bg-hud h-9 w-9 items-center justify-center rounded-full active:opacity-80"
            >
              <Send size={16} color={INK_ON_SIGNAL} />
            </Pressable>
          </View>

          <Text className="font-body text-muted/70 mt-2 text-center text-[13px]">
            {liveAvailable && liveEnabled
              ? 'Live AI on — chat context is sent for replies.'
              : 'On-device briefing — no chat is sent.'}
          </Text>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

function Bubble({ message }: { message: LilZMessage }) {
  if (message.role === 'user') {
    return (
      <View className="items-end">
        <View className="border-hud/40 bg-hud/15 max-w-[85%] rounded-2xl rounded-br-md border px-4 py-3">
          <Text className="font-body text-foreground text-base leading-6">{message.text}</Text>
        </View>
      </View>
    );
  }

  const actions = (message.actions ?? [])
    .map((action) => targetFor(action))
    .filter((target): target is NonNullable<ReturnType<typeof targetFor>> => target !== null);

  return (
    <View className="flex-row items-start gap-2">
      <LilZAvatar size={26} className="mt-1" />
      <View
        className={`max-w-[88%] flex-1 rounded-2xl rounded-bl-md border px-4 py-3 ${
          message.crisis ? 'border-match-t/70 bg-match-t/15' : 'border-hud/25 bg-panel-deep/85'
        }`}
      >
        <Text className="font-body text-foreground text-base leading-6">{plain(message.text)}</Text>

        {message.notice ? (
          <Text className="font-body text-muted mt-2 text-[13px] italic">{message.notice}</Text>
        ) : null}

        {actions.length > 0 ? (
          <View className="mt-3 flex-row flex-wrap gap-2">
            {actions.map((target) => (
              <Pressable
                key={target.label}
                accessibilityRole="button"
                onPress={() => router.push(target.href)}
                className="border-hud/40 bg-hud/10 flex-row items-center gap-1 rounded-full border px-3 py-1.5 active:opacity-70"
              >
                <Text className="text-hud text-[11px] font-bold">{target.label} →</Text>
              </Pressable>
            ))}
          </View>
        ) : null}
      </View>
    </View>
  );
}
