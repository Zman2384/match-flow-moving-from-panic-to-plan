import { Trash2 } from 'lucide-react-native';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, Text, TextInput, View } from 'react-native';

import { BodyText, HudPanel, ScreenShell, SectionLabel } from '@/components/ScreenShell';
import { STATE_FAIL } from '@/lib/palette';
import { useMatchStore } from '@/lib/store';

const STARTERS = [
  {
    prompt: 'Has this partner shared a recent test result?',
    ifYes: 'Confirm the date, then continue with barriers as agreed.',
    ifNo: 'Barriers stay on for everything, no exceptions tonight.',
  },
  {
    prompt: 'Have I taken my medication as scheduled this week?',
    ifYes: 'Proceed with the plan I already decided.',
    ifNo: 'Add a barrier layer and set the reminder before anything starts.',
  },
  {
    prompt: 'Am I sober enough to consent and be understood?',
    ifYes: 'Continue and run one mid-point check-in.',
    ifNo: 'Stop here. Get water, get a ride, revisit another day.',
  },
];

export default function FlowBuilderScreen() {
  const flowNodes = useMatchStore((s) => s.flowNodes);
  const addFlowNode = useMatchStore((s) => s.addFlowNode);
  const removeFlowNode = useMatchStore((s) => s.removeFlowNode);

  const [prompt, setPrompt] = useState('');
  const [ifYes, setIfYes] = useState('');
  const [ifNo, setIfNo] = useState('');

  const ready = prompt.trim() && ifYes.trim() && ifNo.trim();

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flex: 1 }}
    >
      <ScreenShell
        title="Decision Flow"
        subtitle="Decide once, while calm, so the moment does not decide for you"
        hint="Write the branch you actually struggle with, not the easy one."
      >
        <HudPanel label="Build a branch">
          <Labeled label="If this is true...">
            <TextInput
              value={prompt}
              onChangeText={setPrompt}
              placeholder="The question you will face"
              placeholderTextColorClassName="accent-muted"
              className="border-border bg-panel-deep text-foreground rounded-xl border px-3 py-3 text-sm"
            />
          </Labeled>
          <Labeled label="Then, if yes">
            <TextInput
              value={ifYes}
              onChangeText={setIfYes}
              placeholder="What you do"
              placeholderTextColorClassName="accent-muted"
              className="border-border bg-panel-deep text-foreground rounded-xl border px-3 py-3 text-sm"
            />
          </Labeled>
          <Labeled label="Then, if no">
            <TextInput
              value={ifNo}
              onChangeText={setIfNo}
              placeholder="What you do instead"
              placeholderTextColorClassName="accent-muted"
              className="border-border bg-panel-deep text-foreground rounded-xl border px-3 py-3 text-sm"
            />
          </Labeled>
          <Pressable
            disabled={!ready}
            onPress={() => {
              addFlowNode({ prompt: prompt.trim(), ifYes: ifYes.trim(), ifNo: ifNo.trim() });
              setPrompt('');
              setIfYes('');
              setIfNo('');
            }}
            className={`items-center rounded-xl py-3 ${
              ready ? 'bg-hud active:opacity-80' : 'bg-panel-deep'
            }`}
          >
            <Text
              className={`text-xs font-bold tracking-widest uppercase ${
                ready ? 'text-abyss' : 'text-muted'
              }`}
            >
              Add branch
            </Text>
          </Pressable>
        </HudPanel>

        <SectionLabel>Starter branches</SectionLabel>
        {STARTERS.map((starter) => (
          <Pressable
            key={starter.prompt}
            onPress={() => {
              setPrompt(starter.prompt);
              setIfYes(starter.ifYes);
              setIfNo(starter.ifNo);
            }}
            className="border-border bg-panel/60 mb-2 rounded-2xl border p-4 active:opacity-70"
          >
            <Text className="text-foreground text-base font-semibold">{starter.prompt}</Text>
            <BodyText className="text-hud/70 mt-1">Tap to load into the builder</BodyText>
          </Pressable>
        ))}

        <SectionLabel>My flow ({flowNodes.length})</SectionLabel>
        {flowNodes.length === 0 ? (
          <BodyText className="text-muted">
            Empty for now. Two or three branches is usually enough.
          </BodyText>
        ) : (
          flowNodes.map((node, index) => (
            <View key={node.id} className="border-hud/25 bg-panel/70 mb-3 rounded-2xl border p-4">
              <View className="flex-row items-start justify-between gap-3">
                <Text className="text-hud text-[10px] font-bold tracking-widest uppercase">
                  Branch {index + 1}
                </Text>
                <Pressable onPress={() => removeFlowNode(node.id)} hitSlop={8}>
                  <Trash2 size={14} color={STATE_FAIL} />
                </Pressable>
              </View>
              <Text className="text-foreground mt-1.5 text-base font-semibold">{node.prompt}</Text>
              <View className="mt-3 gap-2">
                <View className="border-state-pass/35 bg-state-pass/10 rounded-xl border p-3">
                  <Text className="text-state-pass text-[10px] font-bold uppercase">Yes</Text>
                  <BodyText className="text-muted mt-0.5">{node.ifYes}</BodyText>
                </View>
                <View className="border-state-fail/45 bg-state-fail/15 rounded-xl border p-3">
                  <Text className="text-state-fail text-[10px] font-bold uppercase">No</Text>
                  <BodyText className="text-muted mt-0.5">{node.ifNo}</BodyText>
                </View>
              </View>
            </View>
          ))
        )}
      </ScreenShell>
    </KeyboardAvoidingView>
  );
}

function Labeled({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <View className="mb-3">
      <Text className="text-muted mb-1.5 text-[10px] font-bold tracking-wider uppercase">
        {label}
      </Text>
      {children}
    </View>
  );
}
