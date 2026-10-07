import type { Href } from 'expo-router';

import { GHOST_COLOR, HUD, MATCH_COLOR } from '@/lib/palette';

import type { PieceKey } from '@/lib/match';

export interface ToolEntry {
  id: string;
  title: string;
  blurb: string;
  href: Href;
  /** lucide-react-native icon name rendered by ToolCard. */
  icon:
    | 'gauge'
    | 'flask'
    | 'message'
    | 'siren'
    | 'map'
    | 'check'
    | 'radar'
    | 'brain'
    | 'users'
    | 'sparkles'
    | 'workflow'
    | 'book'
    | 'chart'
    | 'bell'
    | 'ghost'
    | 'guide';
  accent: string;
  pieces: PieceKey[];
  category: 'Assess' | 'Rehearse' | 'Respond' | 'Sustain';
}

export const TOOLS: ToolEntry[] = [
  {
    id: 'safer-score',
    title: 'SafER Score',
    blurb: 'Nine questions that expose which layer is carrying too much weight.',
    href: '/tools/safer-score',
    icon: 'gauge',
    accent: HUD,
    pieces: ['M', 'A', 'T', 'C', 'H'],
    category: 'Assess',
  },
  {
    id: 'ghost-vault',
    title: 'Digital Ghost Vault',
    blurb: 'Name the fears blocking care and map each one to a MATCH piece.',
    href: '/tools/ghost-vault',
    icon: 'ghost',
    accent: GHOST_COLOR.internal,
    pieces: ['A', 'C', 'H'],
    category: 'Assess',
  },
  {
    id: 'stress-test',
    title: 'Stress Test Lab',
    blurb: 'Run your plan through six failure scenarios and see what holds.',
    href: '/tools/stress-test',
    icon: 'flask',
    accent: MATCH_COLOR.T,
    pieces: ['M', 'T'],
    category: 'Assess',
  },
  {
    id: 'analytics',
    title: 'Shield Analytics',
    blurb: 'Score history, layer balance, and streaks over time.',
    href: '/tools/analytics',
    icon: 'chart',
    accent: MATCH_COLOR.A,
    pieces: ['A', 'H'],
    category: 'Assess',
  },
  {
    id: 'scripts',
    title: 'Script Vault',
    blurb: 'Rehearsed language for disclosure, refusal, and clinic visits.',
    href: '/tools/scripts',
    icon: 'message',
    accent: MATCH_COLOR.C,
    pieces: ['C'],
    category: 'Rehearse',
  },
  {
    id: 'flow-builder',
    title: 'Decision Flow',
    blurb: 'Build your own if-this-then-that boundary tree.',
    href: '/tools/flow-builder',
    icon: 'workflow',
    accent: MATCH_COLOR.C,
    pieces: ['C', 'H'],
    category: 'Rehearse',
  },
  {
    id: 'frameworks',
    title: 'Relationship Frameworks',
    blurb: 'Agreement models from monogamy to open structures.',
    href: '/tools/frameworks',
    icon: 'users',
    accent: MATCH_COLOR.A,
    pieces: ['C', 'A'],
    category: 'Rehearse',
  },
  {
    id: 'lil-z',
    title: 'Ask Lil Z',
    blurb: "Christopher Zacharie's digital avatar, on call for the questions you can't Google.",
    href: '/lil-z',
    icon: 'guide',
    accent: HUD,
    pieces: ['M', 'A', 'T', 'C', 'H'],
    category: 'Respond',
  },
  {
    id: 'emergency',
    title: 'Emergency Protocols',
    blurb: 'Step-by-step response for exposure, failure, and assault.',
    href: '/tools/emergency',
    icon: 'siren',
    accent: MATCH_COLOR.T,
    pieces: ['M', 'A'],
    category: 'Respond',
  },
  {
    id: 'clinics',
    title: 'Clinic Finder',
    blurb: 'Find nearby clinics from a ZIP code, address or current location.',
    href: '/tools/clinics',
    icon: 'map',
    accent: MATCH_COLOR.M,
    pieces: ['M', 'A'],
    category: 'Respond',
  },
  {
    id: 'live-session',
    title: 'Live Session',
    blurb: 'A guided pre-encounter sweep with a check-out timer.',
    href: '/tools/live-session',
    icon: 'radar',
    accent: MATCH_COLOR.H,
    pieces: ['T', 'C', 'H'],
    category: 'Respond',
  },
  {
    id: 'checkin',
    title: 'Weekly Check-In',
    blurb: 'Five-item sweep to keep every layer alive.',
    href: '/tools/checkin',
    icon: 'check',
    accent: MATCH_COLOR.H,
    pieces: ['H'],
    category: 'Sustain',
  },
  {
    id: 'anxiety',
    title: 'Anxiety Reframe',
    blurb: 'Separate the fear from the evidence, then pick one action.',
    href: '/tools/anxiety',
    icon: 'brain',
    accent: GHOST_COLOR.internal,
    pieces: ['A', 'H'],
    category: 'Sustain',
  },
  {
    id: 'rituals',
    title: 'Ritual Cards',
    blurb: 'Short grounding practices for before, during, and after.',
    href: '/tools/rituals',
    icon: 'sparkles',
    accent: MATCH_COLOR.C,
    pieces: ['H'],
    category: 'Sustain',
  },
  {
    id: 'reminders',
    title: 'Maintenance Reminders',
    blurb: 'Doses, restocks, and testing cadence in one schedule.',
    href: '/tools/reminders',
    icon: 'bell',
    accent: MATCH_COLOR.M,
    pieces: ['H', 'M'],
    category: 'Sustain',
  },
  {
    id: 'resources',
    title: 'Knowledge Base',
    blurb: 'Plain-language briefings for each MATCH piece.',
    href: '/tools/resources',
    icon: 'book',
    accent: MATCH_COLOR.A,
    pieces: ['M', 'A', 'T', 'C', 'H'],
    category: 'Sustain',
  },
];

export const TOOL_CATEGORIES: ToolEntry['category'][] = [
  'Assess',
  'Rehearse',
  'Respond',
  'Sustain',
];

export const CATEGORY_BLURB: Record<ToolEntry['category'], string> = {
  Assess: 'Measure where your protection actually stands',
  Rehearse: 'Practise the words and decisions before you need them',
  Respond: 'What to do when something goes wrong',
  Sustain: 'Keep the plan alive week after week',
};
