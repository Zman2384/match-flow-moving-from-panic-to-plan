import * as Haptics from 'expo-haptics';
import { router, useLocalSearchParams } from 'expo-router';
import { Button } from 'heroui-native';
import { BookOpen } from 'lucide-react-native';
import { useState } from 'react';
import { Text, View } from 'react-native';

import { BodyText, ScreenShell } from '@/components/ScreenShell';
import {
  APPENDIX_FRAMING,
  APPENDIX_SUMMARIES,
  AUTHOR_REVIEW_ITEMS,
  WORKSHOP_MODELS,
} from '@/lib/curriculum-lessons';
import {
  CURRICULUM_EDITION,
  CURRICULUM_MODULES,
  CURRICULUM_SOURCE_NOTE,
  MATCH_BOOK_TITLE,
} from '@/lib/curriculum';

export default function CurriculumScreen() {
  const [showFacilitatorGuide, setShowFacilitatorGuide] = useState(false);
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
      subtitle={MATCH_BOOK_TITLE}
      showGuide={false}
    >
      <BodyText className="text-foreground">
        Adult track · 6 modules · 19 lessons · Appendix A–E guide
      </BodyText>
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
        <Text className="text-foreground text-lg font-bold">Appendix A–E guide</Text>
        <BodyText className="text-caution-soft mt-3">{APPENDIX_FRAMING}</BodyText>
        {APPENDIX_SUMMARIES.map((summary) => (
          <BodyText key={summary} className="text-muted mt-3">
            {summary}
          </BodyText>
        ))}
        <BodyText className="text-caution-soft mt-3">
          The supplied pages describe these forms but do not include their full reproducible
          interiors. These summaries are not replacement forms.
        </BodyText>
        <BodyText className="text-muted mt-3">
          The free MATCH workshop pack is a 5-session adult letter lab. It is not a preview of the
          19-chapter book and it is not for middle school.
        </BodyText>
      </View>
      <Button
        variant="secondary"
        className="mt-4 h-auto min-h-12 py-3"
        accessibilityState={{ expanded: showFacilitatorGuide }}
        onPress={() => {
          setShowFacilitatorGuide((value) => !value);
          void Haptics.selectionAsync();
        }}
      >
        <Button.Label className="font-body text-hud shrink text-center text-base">
          {showFacilitatorGuide ? 'Hide facilitator guide' : 'Workshop models and review notes'}
        </Button.Label>
      </Button>
      {showFacilitatorGuide ? (
        <View>
          <BodyText className="text-caution-soft mt-4">
            Facilitator use: do not explicitly name the Mindset of Protection concept until after
            the Lesson 14 blindside. Module headings are retained from the supplied outline. FAP
            remains facilitator-facing only. Workshop titles and schedules below are source
            summaries, not authorization to certify facilitators.
          </BodyText>
          {WORKSHOP_MODELS.map((model) => (
            <View
              key={model.title}
              className="border-border bg-panel-deep/90 mt-4 rounded-2xl border p-4"
            >
              <Text className="text-hud text-lg font-bold">{model.title}</Text>
              {model.schedule.map((row) => (
                <BodyText key={row} className="text-foreground mt-3">
                  {row}
                </BodyText>
              ))}
              {model.note ? (
                <BodyText className="text-caution-soft mt-3">{model.note}</BodyText>
              ) : null}
            </View>
          ))}
          <View className="border-border bg-panel-deep/90 mt-4 rounded-2xl border p-4">
            <Text className="text-hud text-lg font-bold">Author review and missing material</Text>
            {AUTHOR_REVIEW_ITEMS.map((item) => (
              <BodyText key={item} className="text-muted mt-3">
                {item}
              </BodyText>
            ))}
            <BodyText className="text-muted mt-3">
              Reprint or retire: old Ghost Prompt Cards, Persona Cards and EXT-E worksheet are not
              canonical app activities. Retain Constraint Cards; retag the Hard Pause as Lesson 15.
              Printed cards, downloads, educator licences and website copy require changes outside
              this app.
            </BodyText>
          </View>
        </View>
      ) : null}
    </ScreenShell>
  );
}
