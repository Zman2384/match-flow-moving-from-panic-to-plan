import { Link } from 'expo-router';
import { ArrowRight, FlaskConical, MessageSquareQuote, Radar, ShieldHalf, X } from '@/lib/icons';
import { Pressable, Text, View } from 'react-native';

import { BodyText } from '@/components/ScreenShell';
import { HUD, MATCH_COLOR } from '@/lib/palette';
import { useMatchStore } from '@/lib/store';

const FEATURES = [
  {
    id: 'plan',
    title: 'Personalized Plan Builder',
    blurb:
      'Layer your plan across all five MATCH pieces — built around your life, partners, and risk.',
    href: '/(tabs)/plan',
    Icon: ShieldHalf,
    accent: HUD,
  },
  {
    id: 'stress',
    title: 'Stress-Test Your Plan',
    blurb:
      'Run it through real scenarios — substances, no supplies, partner pressure — and find the gaps first.',
    href: '/tools/stress-test',
    Icon: FlaskConical,
    accent: MATCH_COLOR.T,
  },
  {
    id: 'scripts',
    title: 'Words for Hard Moments',
    blurb:
      '50+ clinician-informed scripts for consent, status disclosure, condoms, and clinic visits.',
    href: '/tools/scripts',
    Icon: MessageSquareQuote,
    accent: MATCH_COLOR.C,
  },
  {
    id: 'live',
    title: 'Live Session Shield Score',
    blurb:
      'A readiness check before an encounter, based on your active layers. Not a medical risk score.',
    href: '/tools/live-session',
    Icon: Radar,
    accent: MATCH_COLOR.H,
  },
] as const;

/** First-run card: what MATCH Flow does. Dismissed once, stays dismissed on this device. */
export function IntroCard({ className = '' }: { className?: string }) {
  const introDismissed = useMatchStore((s) => s.introDismissed);
  const dismissIntro = useMatchStore((s) => s.dismissIntro);

  if (introDismissed) return null;

  return (
    <View className={`border-hud/35 bg-panel/80 rounded-2xl border p-4 ${className}`}>
      <View className="flex-row items-start justify-between gap-3">
        <View className="flex-1">
          <Text className="text-hud font-mono text-[10px] tracking-[3px] uppercase">
            Start here
          </Text>
          <Text className="text-foreground font-display mt-1 text-2xl tracking-wide">
            From panic to plan
          </Text>
        </View>
        <Pressable
          onPress={dismissIntro}
          hitSlop={10}
          accessibilityRole="button"
          accessibilityLabel="Dismiss the introduction"
          className="border-hud/30 h-8 w-8 items-center justify-center rounded-full border active:opacity-70"
        >
          <X size={14} color={HUD} />
        </Pressable>
      </View>

      <BodyText className="text-muted mt-2">
        Plans fall apart in the moment — tired, at a party, with someone new. MATCH Flow helps you
        prepare, practice, and stay consistent before the moment, not during it.
      </BodyText>

      <View className="mt-4 gap-2.5">
        {FEATURES.map(({ id, title, blurb, href, Icon, accent }) => (
          <Link key={id} href={href} asChild>
            <Pressable
              accessibilityRole="link"
              className="flex-row items-start gap-3 rounded-xl border p-3 active:opacity-70"
              style={{ borderColor: `${accent}40`, backgroundColor: `${accent}10` }}
            >
              <View
                className="h-9 w-9 items-center justify-center rounded-lg"
                style={{
                  backgroundColor: `${accent}22`,
                  borderWidth: 1,
                  borderColor: `${accent}55`,
                }}
              >
                <Icon size={18} color={accent} />
              </View>
              <View className="flex-1">
                <Text className="text-foreground text-[15px] font-bold">{title}</Text>
                <BodyText className="text-muted mt-0.5">{blurb}</BodyText>
              </View>
              <ArrowRight size={16} color={accent} />
            </Pressable>
          </Link>
        ))}
      </View>

      <Pressable
        onPress={dismissIntro}
        accessibilityRole="button"
        className="bg-hud mt-4 items-center rounded-xl py-3 active:opacity-80"
      >
        <Text className="text-abyss text-xs font-bold tracking-widest uppercase">Got it</Text>
      </Pressable>
    </View>
  );
}
