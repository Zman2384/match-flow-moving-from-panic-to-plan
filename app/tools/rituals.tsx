import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';

import { BodyText, HudPanel, ScreenShell } from '@/components/ScreenShell';
import { AFFIRMATIONS, RITUAL_CARDS } from '@/lib/content';
import { PANEL } from '@/lib/palette';

const WINDOWS = ['morning', 'midday', 'evening', 'night'] as const;

export default function RitualsScreen() {
  const [window, setWindow] = useState<(typeof WINDOWS)[number]>('morning');
  const [index, setIndex] = useState(0);
  const [openId, setOpenId] = useState<string | null>(RITUAL_CARDS[0]?.id ?? null);

  const lines = AFFIRMATIONS[window];
  const line = lines[index % lines.length];

  return (
    <ScreenShell
      title="Ritual Cards"
      subtitle="Short practices that keep protection feeling like self-respect"
      hint="Habits stick when they feel like care instead of homework."
    >
      <HudPanel label="Grounding line" status={window}>
        <BodyText className="text-foreground">{line}</BodyText>
        <View className="mt-4 flex-row flex-wrap gap-2">
          {WINDOWS.map((item) => {
            const on = item === window;
            return (
              <Pressable
                key={item}
                onPress={() => {
                  setWindow(item);
                  setIndex(0);
                }}
                className={`rounded-full border px-3 py-1.5 active:opacity-70 ${
                  on ? 'border-hud bg-hud/15' : 'border-border'
                }`}
              >
                <Text
                  className={`text-[10px] font-bold tracking-wider uppercase ${
                    on ? 'text-hud' : 'text-muted'
                  }`}
                >
                  {item}
                </Text>
              </Pressable>
            );
          })}
        </View>
        <Pressable
          onPress={() => setIndex((i) => i + 1)}
          className="border-hud bg-hud/10 mt-3 items-center rounded-xl border py-2.5 active:opacity-70"
        >
          <Text className="text-hud text-[11px] font-bold tracking-widest uppercase">
            Another line
          </Text>
        </Pressable>
      </HudPanel>

      <View className="mt-4">
        {RITUAL_CARDS.map((card) => {
          const open = openId === card.id;
          return (
            <View
              key={card.id}
              className="mb-3 overflow-hidden rounded-2xl border"
              style={{ borderColor: `${card.accent}44`, backgroundColor: `${PANEL}99` }}
            >
              <Pressable
                onPress={() => setOpenId(open ? null : card.id)}
                className="p-4 active:opacity-70"
              >
                <Text
                  className="text-[10px] font-bold tracking-widest uppercase"
                  style={{ color: card.accent }}
                >
                  {card.category} · {card.window}
                </Text>
                <Text className="text-foreground mt-1 text-base font-bold">{card.title}</Text>
                <BodyText className="text-muted mt-1">{card.prompt}</BodyText>
              </Pressable>

              {open ? (
                <View className="px-4 pb-4">
                  {card.practice.map((step, i) => (
                    <View key={step} className="mb-2 flex-row gap-3">
                      <Text className="text-[11px] font-bold" style={{ color: card.accent }}>
                        {i + 1}
                      </Text>
                      <BodyText className="text-muted flex-1">{step}</BodyText>
                    </View>
                  ))}
                </View>
              ) : null}
            </View>
          );
        })}
      </View>
    </ScreenShell>
  );
}
