import { router } from 'expo-router';
import { Brain, Send, Trash2, X } from 'lucide-react-native';
import { useCallback, useMemo, useRef, useState } from 'react';
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
import {
  askLilZ,
  buildPlanContext,
  crisisCard,
  LILZ_GREETING,
  type LilZMessage,
  QUICK_PROMPTS,
  targetFor,
} from '@/lib/lilz';
import { useMatchStore } from '@/lib/store';

const CYAN = '#00e5ff';
const TRACK_OFF = '#1B2A44';

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

  const messages = useMatchStore((s) => s.lilzMessages);
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
      addLilzMessage({ role: 'user', text });

      const crisis = crisisCard(text);
      if (crisis) addLilzMessage({ role: 'guide', text: crisis, crisis: true });

      const state = useMatchStore.getState();
      const ghosts = Object.values(state.ghostRecords);
      const reply = await askLilZ({
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

      addLilzMessage({
        role: 'guide',
        text: reply.reply,
        actions: reply.actions,
        offline: reply.offline,
        notice: reply.notice,
      });
      for (const fact of reply.remember) rememberLilz(fact);
      setPending(false);
    },
    [addLilzMessage, pending, rememberLilz],
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
              <Text className="text-muted text-[11px]">
                Christopher Zacharie&apos;s digital avatar · your guide, not your doctor
              </Text>
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
                onPress={clearLilzChat}
                className="border-border/60 h-9 w-9 items-center justify-center rounded-full border active:opacity-70"
              >
                <Trash2 size={16} color="#8FA3BF" />
              </Pressable>
            ) : null}
          </View>

          <View className="mt-3 rounded-xl border border-[#FF751F]/40 bg-[#FF751F]/10 px-3 py-2">
            <Text className="text-[11px] font-semibold text-[#FFB27A]">
              Educational Tool — Not Medical Advice. Talk to a qualified provider about
              prescriptions and diagnoses.
            </Text>
          </View>
        </View>

        {memoryOpen ? (
          <View className="border-hud/15 bg-panel-deep/90 border-b px-5 py-4">
            <View className="flex-row items-center justify-between">
              <View className="flex-1 pr-3">
                <Text className="text-hud text-[10px] font-bold tracking-[2px] uppercase">
                  Agent memory
                </Text>
                <Text className="text-muted mt-1 text-[11px] leading-4">
                  Lets Lil Z carry a few facts between chats. Stored on this device only, and wiped
                  with everything else.
                </Text>
              </View>
              <Switch
                value={memoryEnabled}
                onValueChange={setLilzMemoryEnabled}
                thumbColor={memoryEnabled ? CYAN : '#94a3b8'}
                trackColor={{ false: TRACK_OFF, true: '#0a4f63' }}
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
                      <Text className="text-foreground flex-1 text-[12px] leading-4">
                        {memory.text}
                      </Text>
                      <Pressable
                        accessibilityRole="button"
                        accessibilityLabel={`Forget: ${memory.text}`}
                        onPress={() => forgetLilz(memory.id)}
                        className="active:opacity-70"
                      >
                        <X size={14} color="#8FA3BF" />
                      </Pressable>
                    </View>
                  ))}
                </View>
              ) : (
                <Text className="text-muted mt-3 text-[11px]">
                  Nothing saved yet. Tell Lil Z something worth remembering — which PrEP you take,
                  what you are working on — and it lands here.
                </Text>
              )
            ) : null}
          </View>
        ) : null}

        <ScrollView
          ref={scrollRef}
          className="flex-1"
          contentContainerStyle={{ padding: 20, gap: 14 }}
          onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: true })}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
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
              placeholderTextColor="#6A7E9C"
              multiline
              className="text-foreground flex-1 text-[14px] leading-5"
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
              <Send size={16} color="#04121F" />
            </Pressable>
          </View>

          <Text className="text-muted/70 mt-2 text-center text-[9px]">
            No accounts, no names. This conversation lives on your device.
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
          <Text className="text-foreground text-[14px] leading-5">{message.text}</Text>
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
          message.crisis ? 'border-[#A8005D]/70 bg-[#A8005D]/15' : 'border-hud/25 bg-panel-deep/85'
        }`}
      >
        <Text className="text-foreground text-[14px] leading-5">{plain(message.text)}</Text>

        {message.notice ? (
          <Text className="text-muted mt-2 text-[10px] italic">{message.notice}</Text>
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
