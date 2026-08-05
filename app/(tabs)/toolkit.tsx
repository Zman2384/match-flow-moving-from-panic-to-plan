import { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { HudBackdrop } from '@/components/HudBackdrop';
import { PanicButton } from '@/components/PanicButton';
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
          <Text className="text-hud text-[10px] font-bold tracking-[3px] uppercase">
            Tactical toolkit
          </Text>
          <Text className="text-foreground mt-1 text-2xl font-bold">
            {TOOLS.length} tools, one system
          </Text>
          <Text className="text-muted mt-1 text-xs">
            Every tool strengthens at least one MATCH piece.
          </Text>
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
              <Text className="text-foreground text-sm font-bold">{group.category}</Text>
              <Text className="text-muted mt-0.5 mb-3 text-[11px]">
                {CATEGORY_BLURB[group.category]}
              </Text>
              {group.items.map((tool) => (
                <ToolCard key={tool.id} tool={tool} />
              ))}
            </View>
          ))}
        </View>
      </ScrollView>
      <PanicButton bottomOffset={24} />
    </View>
  );
}
