import * as Haptics from 'expo-haptics';
import { router, useLocalSearchParams } from 'expo-router';
import { Button } from 'heroui-native/button';
import { BookOpen } from '@/lib/icons';
import { useState } from 'react';
import { Text, View } from 'react-native';

import { BodyText, ScreenShell } from '@/components/ScreenShell';
import { APPENDIX_FRAMING, APPENDIX_SUMMARIES } from '@/lib/curriculum-lessons';
import { CURRICULUM_EDITION, CURRICULUM_MODULES, CURRICULUM_SOURCE_NOTE } from '@/lib/curriculum';

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
      subtitle="Science as Your Wingman · the adult curriculum"
      showGuide={false}
    >
      <BodyText className="text-foreground">
        Adults 18+ · 6 modules · 19 lessons · Appendices A–E
      </BodyText>
      <BodyText className="text-muted mt-3">{CURRICULUM_SOURCE_NOTE}</BodyText>
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
          <Button
            variant="secondary"
            className="border-hud bg-hud/15 mt-4 h-auto min-h-12 border px-3 py-3"
            onPress={() =>
              router.push({
                pathname: '/tools/lesson',
                params: { chapter: String(chapter.number) },
              })
            }
          >
            <Button.Label className="font-body text-hud text-base">Open lesson</Button.Label>
          </Button>
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
        <Text className="text-foreground text-lg font-bold">Appendices A–E</Text>
        <BodyText className="text-caution-soft mt-3">{APPENDIX_FRAMING}</BodyText>
        {APPENDIX_SUMMARIES.map((summary) => (
          <BodyText key={summary} className="text-muted mt-3">
            {summary}
          </BodyText>
        ))}
        <BodyText className="text-muted mt-3">
          The full forms are printed in the back of MATCH Your Protection.
        </BodyText>
      </View>
    </ScreenShell>
  );
}
