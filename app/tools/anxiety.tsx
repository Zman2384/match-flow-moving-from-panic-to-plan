import { router } from 'expo-router';
import { Ghost } from '@/lib/icons';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, Text, TextInput, View } from 'react-native';

import { BodyText, HudPanel, ScreenShell, SectionLabel } from '@/components/ScreenShell';
import { GHOST_COLOR } from '@/lib/palette';
import { useMatchStore } from '@/lib/store';

const STEPS = [
  {
    key: 'fear',
    label: 'The fear',
    prompt: 'Name the worry in one sentence, as literally as you can.',
    placeholder: 'What is the thought that keeps returning?',
  },
  {
    key: 'evidence',
    label: 'The evidence',
    prompt: 'What actually happened, stripped of interpretation?',
    placeholder: 'Facts only — what was used, said, taken, tested?',
  },
  {
    key: 'action',
    label: 'One action',
    prompt: 'The smallest useful step you can take in the next 24 hours.',
    placeholder: 'Book a test, call a line, take a dose, tell a friend.',
  },
] as const;

export default function AnxietyScreen() {
  const [fear, setFear] = useState('');
  const [evidence, setEvidence] = useState('');
  const [action, setAction] = useState('');
  const addAnxietyEntry = useMatchStore((s) => s.addAnxietyEntry);
  const removeAnxietyEntry = useMatchStore((s) => s.removeAnxietyEntry);
  const entries = useMatchStore((s) => s.anxietyEntries);

  const values: Record<string, string> = { fear, evidence, action };
  const setters: Record<string, (text: string) => void> = {
    fear: setFear,
    evidence: setEvidence,
    action: setAction,
  };
  const ready = fear.trim() && evidence.trim() && action.trim();

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flex: 1 }}
    >
      <ScreenShell
        title="Anxiety Reframe"
        subtitle="Separate the fear from the evidence, then pick one action"
        hint="Waiting on a test result is where most spirals happen. Write it down instead of replaying it."
      >
        <HudPanel label="Grounding">
          <BodyText className="text-muted">
            Anxiety is not proof of exposure. It is a signal to check your layers and take one
            concrete step — then stop researching for the night.
          </BodyText>
        </HudPanel>

        <Pressable
          onPress={() => router.push('/tools/ghost-vault')}
          accessibilityRole="button"
          accessibilityLabel="Open the Digital Ghost Vault"
          className="border-hud/25 bg-panel/60 mt-3 flex-row items-center gap-3 rounded-2xl border p-4 active:opacity-70"
        >
          <Ghost size={18} color={GHOST_COLOR.internal} />
          <View className="flex-1">
            <Text className="text-foreground text-base font-bold">
              Same fear keeps coming back?
            </Text>
            <BodyText className="text-muted mt-0.5">
              Name it once in the Ghost Vault and map it to the MATCH piece that carries it.
            </BodyText>
          </View>
        </Pressable>

        {STEPS.map((step) => (
          <View key={step.key} className="mt-4">
            <Text className="text-hud font-mono text-[10px] tracking-widest uppercase">
              {step.label}
            </Text>
            <Text className="text-muted mt-1 mb-2 text-[11px]">{step.prompt}</Text>
            <TextInput
              value={values[step.key]}
              onChangeText={setters[step.key]}
              placeholder={step.placeholder}
              placeholderTextColorClassName="accent-muted"
              multiline
              className="border-border bg-panel-deep text-foreground min-h-[80px] rounded-2xl border px-3 py-3 text-sm"
              style={{ textAlignVertical: 'top' }}
            />
          </View>
        ))}

        <Pressable
          disabled={!ready}
          onPress={() => {
            addAnxietyEntry({
              fear: fear.trim(),
              evidence: evidence.trim(),
              action: action.trim(),
            });
            setFear('');
            setEvidence('');
            setAction('');
          }}
          className={`mt-5 items-center rounded-2xl py-4 ${
            ready ? 'bg-hud active:opacity-80' : 'bg-panel-deep'
          }`}
        >
          <Text
            className={`text-xs font-bold tracking-widest uppercase ${
              ready ? 'text-abyss' : 'text-muted'
            }`}
          >
            Save entry
          </Text>
        </Pressable>

        {entries.length > 0 ? (
          <>
            <SectionLabel>Log</SectionLabel>
            {entries.map((entry) => (
              <View
                key={entry.id}
                className="border-border bg-panel/60 mb-2 rounded-2xl border p-4"
              >
                <Text className="text-muted text-[10px]">
                  {new Date(entry.date).toLocaleDateString()}
                </Text>
                <Text className="text-foreground mt-1.5 text-base font-semibold">{entry.fear}</Text>
                <BodyText className="text-muted mt-1">Evidence: {entry.evidence}</BodyText>
                <BodyText className="text-hud mt-1">Action: {entry.action}</BodyText>
                <Text
                  onPress={() => removeAnxietyEntry(entry.id)}
                  className="text-danger mt-2 text-[11px] font-bold"
                >
                  Delete
                </Text>
              </View>
            ))}
          </>
        ) : null}
      </ScreenShell>
    </KeyboardAvoidingView>
  );
}
