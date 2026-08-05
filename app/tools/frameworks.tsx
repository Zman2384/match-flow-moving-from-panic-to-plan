import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';

import { Disclaimer, HudPanel, ScreenShell } from '@/components/ScreenShell';
import { RELATIONSHIP_FRAMEWORKS } from '@/lib/content';
import { useMatchStore } from '@/lib/store';

export default function FrameworksScreen() {
  const relationshipStyle = useMatchStore((s) => s.relationshipStyle);
  const setRelationshipStyle = useMatchStore((s) => s.setRelationshipStyle);
  const [openId, setOpenId] = useState<string | null>(relationshipStyle);

  return (
    <ScreenShell
      title="Relationship Frameworks"
      subtitle="Agreement models and the protection work each one implies"
      hint="No structure is safer than another. What matters is whether the agreement is explicit."
    >
      <HudPanel label="Why this matters">
        <Text className="text-muted text-[13px] leading-5">
          Most protection failures are agreement failures: two people running different assumptions.
          Pick the model that matches your life, then read the tools it needs.
        </Text>
      </HudPanel>

      <View className="mt-4">
        {RELATIONSHIP_FRAMEWORKS.map((framework) => {
          const open = openId === framework.id;
          const selected = relationshipStyle === framework.id;
          return (
            <View
              key={framework.id}
              className="mb-3 overflow-hidden rounded-2xl border"
              style={{
                borderColor: selected ? framework.accent : `${framework.accent}44`,
                backgroundColor: '#0b1c3199',
              }}
            >
              <Pressable
                onPress={() => setOpenId(open ? null : framework.id)}
                className="flex-row items-center gap-3 p-4 active:opacity-70"
              >
                <View
                  className="h-10 w-10 items-center justify-center rounded-xl"
                  style={{ backgroundColor: `${framework.accent}22` }}
                >
                  <Text className="text-base">{framework.emoji}</Text>
                </View>
                <View className="flex-1">
                  <Text
                    className="text-[10px] font-bold tracking-widest uppercase"
                    style={{ color: framework.accent }}
                  >
                    {framework.category}
                  </Text>
                  <Text className="text-foreground mt-0.5 text-[14px] font-bold">
                    {framework.title}
                  </Text>
                </View>
                {selected ? (
                  <Text
                    className="text-[9px] font-bold uppercase"
                    style={{ color: framework.accent }}
                  >
                    Mine
                  </Text>
                ) : null}
              </Pressable>

              {open ? (
                <View className="px-4 pb-4">
                  <Text className="text-muted text-[12px] leading-5">{framework.description}</Text>
                  <Text
                    className="mt-3 text-[12px] font-semibold italic"
                    style={{ color: framework.accent }}
                  >
                    “{framework.motto}”
                  </Text>

                  <View className="mt-3 gap-2">
                    {framework.tools.map((tool) => (
                      <View key={tool.name} className="bg-panel-deep rounded-xl p-3">
                        <Text className="text-foreground text-[12px] font-bold">{tool.name}</Text>
                        <Text className="text-muted mt-0.5 text-[11px] leading-4">
                          {tool.detail}
                        </Text>
                      </View>
                    ))}
                  </View>

                  <Pressable
                    onPress={() => setRelationshipStyle(framework.id)}
                    className="mt-3 items-center rounded-xl border py-3 active:opacity-70"
                    style={{
                      borderColor: framework.accent,
                      backgroundColor: selected ? `${framework.accent}26` : 'transparent',
                    }}
                  >
                    <Text
                      className="text-[11px] font-bold tracking-widest uppercase"
                      style={{ color: framework.accent }}
                    >
                      {selected ? 'Selected as my model' : 'This is my model'}
                    </Text>
                  </Pressable>
                </View>
              ) : null}
            </View>
          );
        })}
      </View>

      <Disclaimer />
    </ScreenShell>
  );
}
