import * as Haptics from 'expo-haptics';
import { router, useLocalSearchParams } from 'expo-router';
import { Button } from 'heroui-native';
import { BookOpen } from 'lucide-react-native';
import { useState } from 'react';
import { Text, View } from 'react-native';

import { BodyText, ScreenShell } from '@/components/ScreenShell';
import {
  CURRICULUM_APPENDICES,
  CURRICULUM_EDITION,
  CURRICULUM_MODULES,
  CURRICULUM_SOURCE_NOTE,
} from '@/lib/curriculum';

export default function CurriculumScreen() {
  const { module: initialModule } = useLocalSearchParams<{ module?: string }>();
  const [moduleNumber, setModuleNumber] = useState(() => {
    const number = Number(initialModule);
    return CURRICULUM_MODULES.some((item) => item.number === number) ? number : 1;
  });
  const active =
    CURRICULUM_MODULES.find((item) => item.number === moduleNumber) ?? CURRICULUM_MODULES[0];

  return (
    <ScreenShell
      title={CURRICULUM_EDITION}
      chapterIcon={BookOpen}
      subtitle="MATCH your protection · Adult track"
      showGuide={false}
    >
      <BodyText className="text-foreground">6 modules · 19 chapters · Appendices A–E</BodyText>
      <View className="border-caution-edge/40 bg-caution-edge/10 mt-3 rounded-2xl border p-4">
        <BodyText className="text-caution-soft">{CURRICULUM_SOURCE_NOTE}</BodyText>
      </View>
      <View className="mt-4 gap-2">
        {[0, 3].map((start) => (
          <View key={start} className="flex-row gap-2">
            {CURRICULUM_MODULES.slice(start, start + 3).map((item) => (
              <Button
                key={item.number}
                variant="secondary"
                className={`flex-1 rounded-xl border ${item.number === moduleNumber ? 'border-hud bg-hud/15' : 'border-border bg-panel/80'}`}
                accessibilityLabel={`Module ${item.number}: ${item.title}`}
                accessibilityState={{ selected: item.number === moduleNumber }}
                onPress={() => {
                  if (item.number === moduleNumber) return;
                  void Haptics.selectionAsync();
                  setModuleNumber(item.number);
                }}
              >
                <Button.Label
                  numberOfLines={1}
                  className="text-foreground font-body text-base"
                >{`Mod ${item.number}`}</Button.Label>
              </Button>
            ))}
          </View>
        ))}
      </View>
      <Text className="text-hud mt-6 text-xl font-bold">{`${active.number} · ${active.title}`}</Text>
      {active.chapters.map((chapter) => (
        <View
          key={chapter.number}
          className="border-border bg-panel-deep/90 mt-3 rounded-2xl border p-4"
        >
          <Text className="text-hud text-base font-semibold">{`Chapter ${chapter.number}`}</Text>
          <Text className="text-foreground mt-1 text-lg font-bold">{chapter.title}</Text>
          <BodyText className="text-foreground mt-3">{chapter.focus}</BodyText>
          {chapter.briefing ? (
            <BodyText className="text-muted mt-3">{chapter.briefing}</BodyText>
          ) : null}
          {chapter.sourceGap ? (
            <BodyText className="text-caution-soft mt-3">{chapter.sourceGap}</BodyText>
          ) : null}
          <Button
            variant="secondary"
            className="border-hud/40 bg-hud/10 mt-4 h-auto min-h-12 border px-3 py-3"
            onPress={() => router.push(chapter.tool.href)}
          >
            <Button.Label className="font-body text-hud shrink text-center text-base">
              {chapter.tool.label}
            </Button.Label>
          </Button>
        </View>
      ))}
      <View className="border-border bg-panel-deep/90 mt-6 rounded-2xl border p-4">
        <Text className="text-foreground text-lg font-bold">Reproducible appendices</Text>
        {CURRICULUM_APPENDICES.map((appendix) => (
          <BodyText
            key={appendix.letter}
            className="text-muted mt-2"
          >{`${appendix.letter} · ${appendix.title}`}</BodyText>
        ))}
        <BodyText className="text-caution-soft mt-3">
          Appendix pages and the five workshop delivery models were not included. No unverified
          handouts or timetables are reproduced here. This adult curriculum is separate from the
          CAPE youth packet.
        </BodyText>
      </View>
    </ScreenShell>
  );
}
