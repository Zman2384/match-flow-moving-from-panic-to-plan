import { router } from 'expo-router';
import { ChevronRight, Eye, FileText, Lock, ShieldCheck, Stethoscope } from '@/lib/icons';
import type { LucideIcon } from 'lucide-react-native';
import { Pressable, Text, View } from 'react-native';

import { BodyText, HudPanel, ScreenShell } from '@/components/ScreenShell';
import {
  LEGAL_CONTACT_EMAIL,
  LEGAL_DOCUMENTS,
  LEGAL_LAST_UPDATED,
  LEGAL_VERSION,
  type LegalIconKey,
} from '@/lib/legal';
import { STEEL } from '@/lib/palette';

const ICONS: Record<LegalIconKey, LucideIcon> = {
  document: FileText,
  lock: Lock,
  stethoscope: Stethoscope,
  shield: ShieldCheck,
  eye: Eye,
};

export default function LegalIndexScreen() {
  return (
    <ScreenShell
      title="Legal & Compliance"
      subtitle={`Version ${LEGAL_VERSION} · Updated ${LEGAL_LAST_UPDATED}`}
    >
      <BodyText className="text-muted mb-5">
        MATCH Flow is an educational tool built on a local-first, no-tracking privacy model. Review
        the documents that govern your use of the app.
      </BodyText>

      {LEGAL_DOCUMENTS.map((doc) => {
        const Icon = ICONS[doc.icon];
        return (
          <Pressable
            key={doc.id}
            onPress={() => router.push({ pathname: '/legal/[doc]', params: { doc: doc.id } })}
            accessibilityRole="button"
            accessibilityLabel={`${doc.title}. ${doc.summary}`}
            className="border-border bg-panel/60 mb-3 flex-row items-center gap-3 rounded-2xl border p-4 active:opacity-70"
          >
            <View
              className="h-12 w-12 items-center justify-center rounded-2xl"
              style={{ backgroundColor: `${doc.accent}26` }}
            >
              <Icon size={20} color={doc.accent} />
            </View>
            <View className="flex-1">
              <Text className="text-foreground text-base font-bold">{doc.title}</Text>
              <BodyText className="text-muted mt-0.5">{doc.summary}</BodyText>
            </View>
            <ChevronRight size={16} color={STEEL} />
          </Pressable>
        );
      })}

      <HudPanel label="Reminder" className="mt-3">
        <BodyText className="text-muted">
          <Text className="text-foreground font-bold">
            MATCH Flow is for educational purposes only
          </Text>{' '}
          and is not medical advice. Always consult a qualified healthcare provider for personal
          medical decisions. In an emergency, call 911 or your local emergency number.
        </BodyText>
      </HudPanel>

      <View className="border-border/60 mt-6 rounded-2xl border border-dashed p-4">
        <Text className="font-body text-muted text-[13px] leading-5">
          Questions about any document: {LEGAL_CONTACT_EMAIL}. These drafts describe how this build
          actually stores data — no accounts, no sync, no sale of information. Have them reviewed by
          a licensed attorney in your operating jurisdiction before public release.
        </Text>
      </View>
    </ScreenShell>
  );
}
