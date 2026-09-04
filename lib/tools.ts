import type { Href } from 'expo-router';

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
    | 'ghost';
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
    accent: '#22d3ee',
    pieces: ['M', 'A', 'T', 'C', 'H'],
    category: 'Assess',
  },
  {
    id: 'ghost-vault',
    title: 'Digital Ghost Vault',
    blurb: 'Name the fears blocking care and map each one to a MATCH piece.',
    href: '/tools/ghost-vault',
    icon: 'ghost',
    accent: '#a87ee0',
    pieces: ['A', 'C', 'H'],
    category: 'Assess',
  },
  {
    id: 'stress-test',
    title: 'Stress Test Lab',
    blurb: 'Run your plan through six failure scenarios and see what holds.',
    href: '/tools/stress-test',
    icon: 'flask',
    accent: '#a78bfa',
    pieces: ['M', 'T'],
    category: 'Assess',
  },
  {
    id: 'analytics',
    title: 'Shield Analytics',
    blurb: 'Score history, layer balance, and streaks over time.',
    href: '/tools/analytics',
    icon: 'chart',
    accent: '#38bdf8',
    pieces: ['A', 'H'],
    category: 'Assess',
  },
  {
    id: 'scripts',
    title: 'Script Vault',
    blurb: 'Rehearsed language for disclosure, refusal, and clinic visits.',
    href: '/tools/scripts',
    icon: 'message',
    accent: '#dfc401',
    pieces: ['C'],
    category: 'Rehearse',
  },
  {
    id: 'flow-builder',
    title: 'Decision Flow',
    blurb: 'Build your own if-this-then-that boundary tree.',
    href: '/tools/flow-builder',
    icon: 'workflow',
    accent: '#f472b6',
    pieces: ['C', 'H'],
    category: 'Rehearse',
  },
  {
    id: 'frameworks',
    title: 'Relationship Frameworks',
    blurb: 'Agreement models from monogamy to open structures.',
    href: '/tools/frameworks',
    icon: 'users',
    accent: '#60a5fa',
    pieces: ['C', 'A'],
    category: 'Rehearse',
  },
  {
    id: 'emergency',
    title: 'Emergency Protocols',
    blurb: 'Step-by-step response for exposure, failure, and assault.',
    href: '/tools/emergency',
    icon: 'siren',
    accent: '#f87171',
    pieces: ['M', 'A'],
    category: 'Respond',
  },
  {
    id: 'clinics',
    title: 'Clinic Finder',
    blurb: 'PEP, PrEP, testing and pharmacy access points on a map.',
    href: '/tools/clinics',
    icon: 'map',
    accent: '#34d399',
    pieces: ['M', 'A'],
    category: 'Respond',
  },
  {
    id: 'live-session',
    title: 'Live Session',
    blurb: 'A guided pre-encounter sweep with a check-out timer.',
    href: '/tools/live-session',
    icon: 'radar',
    accent: '#fb923c',
    pieces: ['T', 'C', 'H'],
    category: 'Respond',
  },
  {
    id: 'checkin',
    title: 'Weekly Check-In',
    blurb: 'Five-item sweep to keep every layer alive.',
    href: '/tools/checkin',
    icon: 'check',
    accent: '#4ade80',
    pieces: ['H'],
    category: 'Sustain',
  },
  {
    id: 'anxiety',
    title: 'Anxiety Reframe',
    blurb: 'Separate the fear from the evidence, then pick one action.',
    href: '/tools/anxiety',
    icon: 'brain',
    accent: '#c084fc',
    pieces: ['A', 'H'],
    category: 'Sustain',
  },
  {
    id: 'rituals',
    title: 'Ritual Cards',
    blurb: 'Short grounding practices for before, during, and after.',
    href: '/tools/rituals',
    icon: 'sparkles',
    accent: '#facc15',
    pieces: ['H'],
    category: 'Sustain',
  },
  {
    id: 'reminders',
    title: 'Maintenance Reminders',
    blurb: 'Doses, restocks, and testing cadence in one schedule.',
    href: '/tools/reminders',
    icon: 'bell',
    accent: '#fbbf24',
    pieces: ['H', 'M'],
    category: 'Sustain',
  },
  {
    id: 'resources',
    title: 'Knowledge Base',
    blurb: 'Plain-language briefings for each MATCH piece.',
    href: '/tools/resources',
    icon: 'book',
    accent: '#94a3b8',
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
