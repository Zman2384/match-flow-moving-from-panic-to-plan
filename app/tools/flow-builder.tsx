import { Trash2 } from 'lucide-react-native';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, Text, TextInput, View } from 'react-native';

import { Disclaimer, HudPanel, ScreenShell, SectionLabel } from '@/components/ScreenShell';
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
            <Text className="text-foreground text-[12px] font-semibold">{starter.prompt}</Text>
            <Text className="text-hud/70 mt-1 text-[11px]">Tap to load into the builder</Text>
          </Pressable>
        ))}

        <SectionLabel>My flow ({flowNodes.length})</SectionLabel>
        {flowNodes.length === 0 ? (
          <Text className="text-muted text-[12px]">
            Empty for now. Two or three branches is usually enough.
          </Text>
        ) : (
          flowNodes.map((node, index) => (
            <View key={node.id} className="border-hud/25 bg-panel/70 mb-3 rounded-2xl border p-4">
              <View className="flex-row items-start justify-between gap-3">
                <Text className="text-hud text-[10px] font-bold tracking-widest uppercase">
                  Branch {index + 1}
                </Text>
                <Pressable onPress={() => removeFlowNode(node.id)} hitSlop={8}>
                  <Trash2 size={14} color="#f87171" />
                </Pressable>
              </View>
              <Text className="text-foreground mt-1.5 text-[13px] font-semibold">
                {node.prompt}
              </Text>
              <View className="mt-3 gap-2">
                <View className="rounded-xl border border-[#4ade8055] bg-[#4ade8014] p-3">
                  <Text className="text-[10px] font-bold text-[#4ade80] uppercase">Yes</Text>
                  <Text className="text-muted mt-0.5 text-[12px] leading-5">{node.ifYes}</Text>
                </View>
                <View className="rounded-xl border border-[#f8717155] bg-[#f8717114] p-3">
                  <Text className="text-danger text-[10px] font-bold uppercase">No</Text>
                  <Text className="text-muted mt-0.5 text-[12px] leading-5">{node.ifNo}</Text>
                </View>
              </View>
            </View>
          ))
        )}

        <Disclaimer />
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
