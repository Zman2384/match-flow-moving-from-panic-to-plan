import { router, useLocalSearchParams } from 'expo-router';
import { Pressable, Text, View } from 'react-native';

import { BodyText, ScreenShell } from '@/components/ScreenShell';
import {
  getLegalDocument,
  LEGAL_LAST_UPDATED,
  LEGAL_VERSION,
  type LegalSection,
} from '@/lib/legal';

export default function LegalDocumentScreen() {
  const { doc: docParam } = useLocalSearchParams<{ doc: string }>();
  const doc = getLegalDocument(docParam);

  if (!doc) {
    return (
      <ScreenShell
        title="Document not found"
        subtitle="This legal document is no longer available"
        backLabel="Legal & Compliance"
        backHref="/legal"
      >
        <Pressable
          onPress={() => router.replace('/legal')}
          className="bg-hud items-center rounded-xl py-3 active:opacity-80"
        >
          <Text className="text-abyss text-xs font-bold tracking-widest uppercase">
            Back to all documents
          </Text>
        </Pressable>
      </ScreenShell>
    );
  }

  return (
    <ScreenShell
      title={doc.title}
      subtitle={`Version ${LEGAL_VERSION} · Last updated ${LEGAL_LAST_UPDATED}`}
      backLabel="Legal & Compliance"
      backHref="/legal"
    >
      <View
        className="overflow-hidden rounded-2xl border p-4"
        style={{ borderColor: `${doc.accent}55`, backgroundColor: `${doc.accent}12` }}
      >
        <Text
          className="text-[10px] font-bold tracking-[2px] uppercase"
          style={{ color: doc.accent }}
        >
          {doc.summary}
        </Text>
        <BodyText className="text-foreground/90 mt-2">{doc.intro}</BodyText>
      </View>

      {doc.sections.map((section) => (
        <Section key={section.heading} section={section} accent={doc.accent} />
      ))}

      <View className="border-border/60 mt-8 rounded-2xl border border-dashed p-4">
        <Text className="font-body text-muted text-[13px] leading-5">
          {doc.title} · Version {LEGAL_VERSION} · {LEGAL_LAST_UPDATED}. Retain a copy for your
          records; the text may be revised in a future release.
        </Text>
      </View>
    </ScreenShell>
  );
}

function Section({ section, accent }: { section: LegalSection; accent: string }) {
  return (
    <View className="mt-6">
      <View className="flex-row items-start gap-2">
        <View className="mt-[7px] h-1.5 w-1.5 rounded-full" style={{ backgroundColor: accent }} />
        <Text className="text-foreground flex-1 text-base font-bold">{section.heading}</Text>
      </View>

      {section.body ? <BodyText className="text-muted mt-2">{section.body}</BodyText> : null}

      {section.bullets ? (
        <View className="mt-3 gap-2">
          {section.bullets.map((bullet) => (
            <View key={bullet} className="bg-panel-deep/70 flex-row gap-2 rounded-xl p-3">
              <BodyText style={{ color: accent }}>·</BodyText>
              <BodyText className="text-muted flex-1">{bullet}</BodyText>
            </View>
          ))}
        </View>
      ) : null}
    </View>
  );
}
