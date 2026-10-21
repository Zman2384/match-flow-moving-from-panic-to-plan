import { Link } from 'expo-router';
import {
  Bell,
  BookOpen,
  Brain,
  ChartNoAxesColumn,
  CheckCheck,
  FlaskConical,
  Gauge,
  Ghost,
  MapPin,
  MessageSquareQuote,
  MessagesSquare,
  Radar,
  Siren,
  Sparkles,
  Users,
  Workflow,
} from '@/lib/icons';
import { Pressable, Text, View } from 'react-native';

import { BodyText } from '@/components/ScreenShell';
import { PIECE_COLOR } from '@/lib/match';
import type { ToolEntry } from '@/lib/tools';

const ICONS = {
  gauge: Gauge,
  flask: FlaskConical,
  message: MessageSquareQuote,
  siren: Siren,
  map: MapPin,
  check: CheckCheck,
  radar: Radar,
  brain: Brain,
  users: Users,
  sparkles: Sparkles,
  workflow: Workflow,
  book: BookOpen,
  chart: ChartNoAxesColumn,
  bell: Bell,
  ghost: Ghost,
  guide: MessagesSquare,
} as const;

export function ToolCard({ tool }: { tool: ToolEntry }) {
  const Icon = ICONS[tool.icon];

  return (
    <Link href={tool.href} asChild>
      <Pressable className="border-hud/20 bg-panel/70 mb-3 flex-row items-start gap-3 rounded-2xl border p-4 active:opacity-70">
        <View
          className="h-11 w-11 items-center justify-center rounded-xl"
          style={{
            backgroundColor: `${tool.accent}22`,
            borderWidth: 1,
            borderColor: `${tool.accent}55`,
          }}
        >
          <Icon size={20} color={tool.accent} />
        </View>
        <View className="flex-1">
          <Text className="text-foreground text-base font-bold">{tool.title}</Text>
          <BodyText className="text-muted mt-1">{tool.blurb}</BodyText>
          <View className="mt-2 flex-row gap-1">
            {tool.pieces.map((piece) => (
              <View
                key={piece}
                className="h-4 w-4 items-center justify-center rounded"
                style={{ backgroundColor: `${PIECE_COLOR[piece]}33` }}
              >
                <Text className="text-[8px] font-bold" style={{ color: PIECE_COLOR[piece] }}>
                  {piece}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </Pressable>
    </Link>
  );
}
