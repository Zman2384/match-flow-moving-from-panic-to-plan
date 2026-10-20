import * as Haptics from 'expo-haptics';
import { router, useLocalSearchParams } from 'expo-router';
import { Button } from 'heroui-native';
import { BookOpen } from 'lucide-react-native';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Text, TextInput, View } from 'react-native';

import { BodyText, ScreenShell } from '@/components/ScreenShell';
import { CURRICULUM_MODULES } from '@/lib/curriculum';
import {
  CANONICAL_DOSSIERS,
  CANONICAL_GHOSTS,
  CHALLENGE_ACTIONS,
  LESSON_DETAILS,
} from '@/lib/curriculum-lessons';
import { STEEL } from '@/lib/palette';
import { useMatchStore } from '@/lib/store';

function Section({ title, items }: { title: string; items: string[] }) {
  return (
    <View className="border-border bg-panel-deep/90 mt-4 rounded-2xl border p-4">
      <Text className="text-hud text-lg font-bold">{title}</Text>
      {items.map((item, index) => (
        <BodyText key={item} className="text-foreground mt-3">{`${index + 1}. ${item}`}</BodyText>
      ))}
    </View>
  );
}

function Note({ noteKey, label }: { noteKey: string; label: string }) {
  const value = useMatchStore((s) => s.curriculumNotes[noteKey] ?? '');
  const setNote = useMatchStore((s) => s.setCurriculumNote);
  return (
    <View className="mt-4">
      <BodyText className="text-foreground mb-2">{label}</BodyText>
      <TextInput
        value={value}
        onChangeText={(text) => setNote(noteKey, text)}
        accessibilityLabel={label}
        multiline
        textAlignVertical="top"
        placeholder="In your own words"
        placeholderTextColor={STEEL}
        className="font-body text-foreground border-border bg-panel-deep rounded-xl border p-3 text-base"
        style={{ minHeight: 112 }}
      />
    </View>
  );
}

export default function LessonScreen() {
  const { chapter: parameter } = useLocalSearchParams<{ chapter?: string }>();
  const number = Number(parameter);
  const module = CURRICULUM_MODULES.find((item) =>
    item.chapters.some((chapter) => chapter.number === number),
  );
  const chapter = module?.chapters.find((item) => item.number === number);
  const lesson = LESSON_DETAILS.find((item) => item.number === number);
  const [dossierIndex, setDossierIndex] = useState(0);
  const completed = useMatchStore((s) => s.challengeCompleted);
  const toggleAction = useMatchStore((s) => s.toggleChallengeAction);
  const dossier = CANONICAL_DOSSIERS[dossierIndex];

  if (!chapter || !lesson || !module) {
    return (
      <ScreenShell title="Choose a lesson" showGuide={false}>
        <BodyText className="text-muted">That lesson is not available.</BodyText>
        <Button onPress={() => router.replace('/tools/curriculum')} className="mt-4">
          <Button.Label>Open curriculum</Button.Label>
        </Button>
      </ScreenShell>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flex: 1 }}
    >
      <ScreenShell
        title={chapter.title}
        chapterIcon={BookOpen}
        subtitle={`Module ${module.number} · Lesson ${number}`}
        backLabel="Curriculum"
        backHref={{ pathname: '/tools/curriculum', params: { module: String(module.number) } }}
        showGuide={false}
      >
        <BodyText className="text-foreground">{chapter.focus}</BodyText>
        <BodyText className="text-muted mt-3">
          Your notes stay on this device and save as you type.
        </BodyText>
        {lesson.note ? (
          <View className="border-caution-edge/40 bg-caution-edge/10 mt-4 rounded-2xl border p-4">
            <BodyText className="text-caution-soft">{lesson.note}</BodyText>
          </View>
        ) : null}
        <Section title="Key points" items={lesson.keyPoints} />
        {chapter.briefing ? <Section title="Clinical briefing" items={[chapter.briefing]} /> : null}
        {lesson.sections.map((section) => (
          <Section key={section.title} {...section} />
        ))}
        {number === 16 ? (
          <View className="mt-4">
            <Text className="text-hud text-lg font-bold">The sixteen ghosts</Text>
            {CANONICAL_GHOSTS.map((ghost) => (
              <View
                key={ghost.id}
                className="border-border bg-panel-deep/90 mt-3 rounded-2xl border p-4"
              >
                <Text className="text-foreground text-lg font-bold">{`${ghost.name} · ${ghost.piece}`}</Text>
                <BodyText className="text-muted mt-2">{ghost.shield}</BodyText>
                <BodyText className="text-foreground mt-3">{`Move this week: ${ghost.move}`}</BodyText>
              </View>
            ))}
            <Note
              noteKey="lesson-16-three"
              label="My three loudest ghosts and one move this week"
            />
          </View>
        ) : null}
        {number === 17 ? (
          <View className="mt-4">
            <Text className="text-hud text-lg font-bold">Dossiers A–H</Text>
            <View className="mt-3 flex-row flex-wrap gap-2">
              {CANONICAL_DOSSIERS.map((item, index) => (
                <Button
                  key={item.letter}
                  variant="secondary"
                  className={
                    index === dossierIndex ? 'border-hud bg-hud/15 border' : 'border-border border'
                  }
                  accessibilityLabel={`Dossier ${item.letter}: ${item.title}`}
                  accessibilityState={{ selected: index === dossierIndex }}
                  onPress={() => {
                    if (index !== dossierIndex) {
                      setDossierIndex(index);
                      void Haptics.selectionAsync();
                    }
                  }}
                >
                  <Button.Label>{item.letter}</Button.Label>
                </Button>
              ))}
            </View>
            <Section
              title={`${dossier.letter} · ${dossier.title}`}
              items={[
                `Scene: ${dossier.scene}`,
                `Friction: ${dossier.friction}`,
                `Pivot: ${dossier.pivot}`,
                `Say it once: “${dossier.script}”`,
              ]}
            />
            {dossier.safety ? (
              <BodyText className="text-caution-soft mt-4">{dossier.safety}</BodyText>
            ) : null}
            <Note
              key={`${dossier.letter}-words`}
              noteKey={`dossier-${dossier.letter}-words`}
              label="My spoken line in my own words"
            />
            <Note
              key={`${dossier.letter}-before`}
              noteKey={`dossier-${dossier.letter}-before`}
              label="What I need in place before this night happens"
            />
          </View>
        ) : null}
        {number === 19 ? (
          <View className="mt-4">
            <Text className="text-hud text-lg font-bold">{`${completed.length} of ${CHALLENGE_ACTIONS.length} actions complete`}</Text>
            <BodyText className="text-muted mt-2">
              Any order, as many as you like in a day. Aim to finish them inside thirty days.
            </BodyText>
            {CHALLENGE_ACTIONS.map((action, index) => (
              <Button
                key={action}
                variant="secondary"
                accessibilityRole="checkbox"
                accessibilityState={{ checked: completed.includes(index) }}
                className={`mt-3 h-auto min-h-12 justify-start rounded-xl border px-3 py-3 ${completed.includes(index) ? 'border-hud bg-hud/15' : 'border-border bg-panel-deep'}`}
                onPress={() => {
                  const checking = !completed.includes(index);
                  toggleAction(index);
                  void Haptics.selectionAsync();
                  if (checking)
                    void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                }}
              >
                <Button.Label className="font-body text-foreground shrink text-base">{`${completed.includes(index) ? 'Done · ' : ''}${action}`}</Button.Label>
              </Button>
            ))}
          </View>
        ) : null}
        {lesson.prompts?.map((prompt, index) => (
          <Note key={`${number}-${prompt}`} noteKey={`lesson-${number}-${index}`} label={prompt} />
        ))}
        <View className="border-hud/40 bg-hud/10 mt-5 rounded-2xl border p-4">
          <BodyText className="text-foreground">{`Key takeaway: “${lesson.takeaway}”`}</BodyText>
        </View>
        <Button
          variant="secondary"
          className="border-hud/40 mt-4 h-auto min-h-12 border py-3"
          onPress={() => router.push(chapter.tool.href)}
        >
          <Button.Label className="font-body text-hud shrink text-center text-base">
            {chapter.tool.label}
          </Button.Label>
        </Button>
        {number < 19 ? (
          <Button
            variant="secondary"
            className="mt-3"
            onPress={() =>
              router.replace({ pathname: '/tools/lesson', params: { chapter: String(number + 1) } })
            }
          >
            <Button.Label>{`Next lesson · ${number + 1}`}</Button.Label>
          </Button>
        ) : null}
      </ScreenShell>
    </KeyboardAvoidingView>
  );
}
