import { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BackChip } from '@/components/BackChip';
import { HudBackdrop } from '@/components/HudBackdrop';
import { LilZDock } from '@/components/LilZ';
import { PanicButton } from '@/components/PanicButton';
import { BodyText, BrandFooter, Disclaimer } from '@/components/ScreenShell';
import { ToolCard } from '@/components/ToolCard';
import { CATEGORY_BLURB, TOOLS, TOOL_CATEGORIES, type ToolEntry } from '@/lib/tools';

type Filter = 'All' | ToolEntry['category'];

const FILTERS: Filter[] = ['All', ...TOOL_CATEGORIES];

export default function ToolkitScreen() {
  const insets = useSafeAreaInsets();
  const [filter, setFilter] = useState<Filter>('All');

  const groups =
    filter === 'All'
      ? TOOL_CATEGORIES.map((category) => ({
          category,
          items: TOOLS.filter((t) => t.category === category),
        }))
      : [{ category: filter, items: TOOLS.filter((t) => t.category === filter) }];

  return (
    <View className="bg-background flex-1">
      <HudBackdrop />
      <ScrollView
        contentContainerStyle={{ paddingTop: insets.top + 12, paddingBottom: 48 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="px-5">
          <BackChip mode="jump" className="mb-3" />
          <Text className="text-hud text-[10px] font-bold tracking-[3px] uppercase">
            Tactical toolkit
          </Text>
          <Text className="text-foreground mt-1 text-2xl font-bold">
            {TOOLS.length} tools, one system
          </Text>
          <BodyText className="text-muted mt-1">
            Every tool strengthens at least one MATCH piece.
          </BodyText>
          <Disclaimer className="mt-3" />
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 20, gap: 8, paddingVertical: 16 }}
        >
          {FILTERS.map((item) => {
            const on = filter === item;
            return (
              <Pressable
                key={item}
                onPress={() => setFilter(item)}
                className={`rounded-full border px-4 py-2 active:opacity-70 ${
                  on ? 'border-hud bg-hud/15' : 'border-border bg-panel/60'
                }`}
              >
                <Text
                  className={`text-[11px] font-bold tracking-wider uppercase ${
                    on ? 'text-hud' : 'text-muted'
                  }`}
                >
                  {item}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        <View className="px-5">
          {groups.map((group) => (
            <View key={group.category} className="mb-4">
              <Text className="text-foreground text-base font-bold">{group.category}</Text>
              <BodyText className="text-muted mt-0.5 mb-3">
                {CATEGORY_BLURB[group.category]}
              </BodyText>
              {group.items.map((tool) => (
                <ToolCard key={tool.id} tool={tool} />
              ))}
            </View>
          ))}
        </View>

        <BrandFooter className="px-5" />
      </ScrollView>
      <LilZDock bottomOffset={24} />
      <PanicButton bottomOffset={24} />
    </View>
  );
}
