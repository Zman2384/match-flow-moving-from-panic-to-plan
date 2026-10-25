import type { Href } from 'expo-router';

import { CANONICAL_GHOSTS } from '@/lib/curriculum-lessons';

import type { PieceKey } from '@/lib/match';
import { PIECE_BY_KEY } from '@/lib/match';
import { GHOST_COLOR, HUD, MATCH_COLOR } from '@/lib/palette';

/**
 * "Naming the Ghosts" — the Anxiety Audit as data.
 *
 * A ghost is a vague fear that blocks care. Named, it stops being a monster and
 * becomes a task that a MATCH piece can carry. Nothing here is stored: the
 * user's named ghosts live only in the local store (lib/store.ts).
 */

export type GhostCategoryId = 'relational' | 'logistical' | 'clinical';

export interface GhostCategory {
  id: GhostCategoryId;
  /** Short label used on filter chips. */
  label: string;
  /** Full label used in headers. */
  fullLabel: string;
  /** Ghost grid color from the brand palette. */
  color: string;
  blurb: string;
}

export const GHOST_CATEGORIES: GhostCategory[] = [
  {
    id: 'relational',
    label: 'Relational',
    fullLabel: 'Relational & emotional',
    color: GHOST_COLOR.relational,
    blurb: 'Fears that live between you and another person.',
  },
  {
    id: 'logistical',
    label: 'Logistical',
    fullLabel: 'Logistical & bureaucratic',
    color: GHOST_COLOR.logistical,
    blurb: 'Friction from phones, paperwork, money, and front desks.',
  },
  {
    id: 'clinical',
    label: 'Clinical',
    fullLabel: 'Technical & clinical',
    color: GHOST_COLOR.internal,
    blurb: 'Fears about bodies, results, failure, and procedures.',
  },
];

export const CATEGORY_BY_ID: Record<GhostCategoryId, GhostCategory> = {
  relational: GHOST_CATEGORIES[0],
  logistical: GHOST_CATEGORIES[1],
  clinical: GHOST_CATEGORIES[2],
};

/** Pillars the logic engine assigns to a self-written ghost, by category. */
export const CATEGORY_PIECES: Record<GhostCategoryId, PieceKey[]> = {
  relational: ['C', 'H'],
  logistical: ['A', 'M'],
  clinical: ['M', 'T'],
};

export interface GhostArchetype {
  id: string;
  name: string;
  category: GhostCategoryId;
  /** What the ghost whispers — written in its voice, not yours. */
  fear: string;
  /** The counter-move that turns it into a task. */
  disarm: string;
  /** MATCH pieces that carry this fear once it is named. */
  pieces: PieceKey[];
  href?: Href;
  hrefLabel?: string;
}

export const LEGACY_GHOSTS: GhostArchetype[] = [
  // ── Relational & emotional ────────────────────────────────────────────────
  {
    id: 'rejection',
    name: 'Fear of rejection',
    category: 'relational',
    fear: 'If I bring up protection or testing, they will lose interest and leave.',
    disarm:
      'Rejection is information, not a verdict. Rehearse one disclosure line until saying it costs you nothing — a partner who exits over protection told you something useful early.',
    pieces: ['C'],
    href: '/tools/scripts',
    hrefLabel: 'Rehearse in the Script Vault',
  },
  {
    id: 'judgment',
    name: 'Fear of judgment',
    category: 'relational',
    fear: 'They will judge my testing history, my status, my number of partners, what I like.',
    disarm:
      'Status is a lab value, not a character grade. Practice a flat, factual sentence about your history so it lands as data instead of a confession.',
    pieces: ['C', 'A'],
    href: '/tools/scripts',
    hrefLabel: 'Rehearse in the Script Vault',
  },
  {
    id: 'mood-killer',
    name: 'The mood-killer ghost',
    category: 'relational',
    fear: 'Stopping for protection kills the vibe and makes me the awkward one.',
    disarm:
      'Friction comes from fumbling, not from protecting. Stage supplies within arm’s reach and write one line that keeps the momentum instead of breaking it.',
    pieces: ['T', 'C'],
    href: '/tools/live-session',
    hrefLabel: 'Stage the sweep in Live Session',
  },
  {
    id: 'trust',
    name: 'The trust ghost',
    category: 'relational',
    fear: 'I cannot tell whether they are being fully honest with me.',
    disarm:
      'Build layers that hold whether or not they are honest. Your medication and testing cadence do not depend on anyone else’s answer.',
    pieces: ['A', 'M'],
    href: '/tools/safer-score',
    hrefLabel: 'Check your independent layers',
  },
  {
    id: 'silence',
    name: 'The silence ghost',
    category: 'relational',
    fear: 'Saying nothing feels safer than starting the conversation.',
    disarm:
      'Silence is not neutral — it hands the decision to the other person. One rehearsed opener costs ten seconds and keeps the decision yours.',
    pieces: ['C'],
    href: '/tools/scripts',
    hrefLabel: 'Pick an opener',
  },
  {
    id: 'past-future',
    name: 'The past & future ghosts',
    category: 'relational',
    fear: 'What happened before is going to happen again, and it will follow me into whatever comes next.',
    disarm:
      'A past failure is a design note. Name what broke, add the layer that would have caught it, then let the plan carry the memory instead of your nervous system.',
    pieces: ['H', 'C'],
    href: '/tools/stress-test',
    hrefLabel: 'Rerun it in the Stress Test',
  },
  {
    id: 'shame',
    name: 'The shame ghost',
    category: 'relational',
    fear: 'Wanting protection means something is wrong with me.',
    disarm:
      'Preparation is the opposite of a defect — a pilot who runs a checklist is not a worse pilot. Treat every armed layer as evidence of self-respect.',
    pieces: ['H', 'M'],
    href: '/tools/rituals',
    hrefLabel: 'Ground it with a ritual',
  },
  {
    id: 'culture',
    name: 'Religious or cultural conflict',
    category: 'relational',
    fear: 'Protecting myself puts me at odds with my family, faith, or community.',
    disarm:
      'You are allowed to hold your values and your health at once. Decide who needs to know, who does not, and what language you use in each room.',
    pieces: ['C', 'H'],
    href: '/tools/frameworks',
    hrefLabel: 'Map your agreements',
  },
  {
    id: 'regret',
    name: 'Fear of post-sex regret',
    category: 'relational',
    fear: 'Afterwards I will feel wrecked about what I did or did not do.',
    disarm:
      'Decide your lines while calm, not at 1 a.m. A rule set sober is the thing that protects you when cortisol is running the room.',
    pieces: ['H', 'A'],
    href: '/tools/checkin',
    hrefLabel: 'Set your weekly sweep',
  },

  // ── Logistical & bureaucratic ─────────────────────────────────────────────
  {
    id: 'cost',
    name: 'The cost ghost',
    category: 'logistical',
    fear: 'I will be turned away — or shamed at the desk — because I cannot pay.',
    disarm:
      'Cost is a gate with known keys: sliding-scale clinics, health-department programs, and manufacturer assistance for PrEP and lenacapavir. Find the key before you need the door.',
    pieces: ['M', 'A'],
    href: '/tools/clinics',
    hrefLabel: 'Find low-cost access',
  },
  {
    id: 'paper-trail',
    name: 'The confidentiality ghost',
    category: 'logistical',
    fear: 'Testing will show up on a parent’s or partner’s insurance and blow up my life.',
    disarm:
      'Ask one question before booking: "Will this generate an explanation of benefits?" Health-department and Title X clinics can often test without a paper trail.',
    pieces: ['A', 'M'],
    href: '/tools/clinics',
    hrefLabel: 'Look for confidential testing',
  },
  {
    id: 'phone',
    name: 'The phone ghost',
    category: 'logistical',
    fear: 'I cannot make myself call to book the appointment.',
    disarm:
      'Write the twelve words you need before dialling, or skip the call entirely — online booking and text lines exist precisely for this.',
    pieces: ['C', 'A'],
    href: '/tools/scripts',
    hrefLabel: 'Load the clinic script',
  },
  {
    id: 'bureaucracy',
    name: 'The bureaucracy ghost',
    category: 'logistical',
    fear: 'The forms, the intake questions, the front desk — I will get it wrong and be exposed.',
    disarm:
      'Nobody is graded on paperwork. "I am here for a full panel" is a complete answer, and every blank you skip can be asked about later.',
    pieces: ['A', 'C'],
    href: '/tools/scripts',
    hrefLabel: 'Rehearse the intake',
  },
  {
    id: 'language',
    name: 'The language ghost',
    category: 'logistical',
    fear: 'I do not understand the words they use, and asking makes me look stupid.',
    disarm:
      'Learn six terms and the room changes: full panel, window period, PEP, PrEP, Doxy-PEP, viral suppression. "Say that in plain language" is a legitimate request.',
    pieces: ['A'],
    href: '/tools/resources',
    hrefLabel: 'Read the plain-language briefings',
  },
  {
    id: 'access',
    name: 'The access ghost',
    category: 'logistical',
    fear: 'I genuinely do not know where to go or who to ask.',
    disarm:
      'Pick one access point now and save it — while calm, not mid-crisis. A named clinic with hours beats a search bar at 2 a.m.',
    pieces: ['A', 'M'],
    href: '/tools/clinics',
    hrefLabel: 'Save an access point',
  },

  // ── Technical & clinical ──────────────────────────────────────────────────
  {
    id: 'technical-failure',
    name: 'Fear of technical failure',
    category: 'clinical',
    fear: 'The condom breaks and I have no idea what to do next.',
    disarm:
      'Practice while calm: Save a 24-hour access point from locator.hiv.gov. Verify that it is open 24 hours and can evaluate you for PEP. Say “I need to be evaluated for PEP” out loud. After a possible HIV exposure, go to the nearest emergency department now — do not delay care to complete the drill. PEP must start as soon as possible, within 72 hours.',
    pieces: ['T', 'M'],
    href: '/tools/emergency',
    hrefLabel: 'Open the 72-hour protocol',
  },
  {
    id: 'positive-result',
    name: 'Fear of a positive result',
    category: 'clinical',
    fear: 'If I test, I might find out — so I would rather not know.',
    disarm:
      'Not testing does not change your status, it only delays treatment. Modern HIV treatment reaches undetectable and untransmittable; most bacterial STIs are cured in a week.',
    pieces: ['A', 'M'],
    href: '/tools/resources',
    hrefLabel: 'Read what a result actually means',
  },
  {
    id: 'needle',
    name: 'The needle ghost',
    category: 'clinical',
    fear: 'Blood draws and clinical rooms make my body shut down.',
    disarm:
      'Say it out loud at check-in: "Needles are hard for me." You can lie down, look away, and ask for the smallest gauge — and some screening uses a finger stick or swab.',
    pieces: ['A', 'M'],
    href: '/tools/rituals',
    hrefLabel: 'Run a grounding ritual first',
  },
  {
    id: 'timing',
    name: 'The timing ghost',
    category: 'clinical',
    fear: 'There is never a right moment to raise any of this.',
    disarm:
      'The right moment is before clothes come off, in daylight, by text if that is easier. A pre-booked conversation beats a perfect one that never happens.',
    pieces: ['C', 'H'],
    href: '/tools/flow-builder',
    hrefLabel: 'Build the decision point',
  },
  {
    id: 'disclosure',
    name: 'Fear of disclosure',
    category: 'clinical',
    fear: 'I will have to tell them my status, or ask for theirs, and I will freeze.',
    disarm:
      'Lead with your own line — disclosure invites disclosure. Two sentences, no apology, then a direct question.',
    pieces: ['C', 'A'],
    href: '/tools/scripts',
    hrefLabel: 'Load a disclosure script',
  },
  {
    id: 'pain',
    name: 'Fear of pain',
    category: 'clinical',
    fear: 'Barriers hurt, exams hurt, and I will just have to endure it.',
    disarm:
      'Pain is usually a fit or friction problem, not a fact. Correct size, more lube, a different barrier, or a slower exam with a stated stop word all change the experience.',
    pieces: ['T'],
    href: '/tools/resources',
    hrefLabel: 'Read the tools briefing',
  },
  {
    id: 'body',
    name: 'The body ghost',
    category: 'clinical',
    fear: 'I feel disconnected from my own body and unsure what is normal for it.',
    disarm:
      'Baseline first, judgment never. Learn what your normal looks and feels like so change registers early — that is awareness, not vanity.',
    pieces: ['H', 'A'],
    href: '/tools/checkin',
    hrefLabel: 'Start a weekly baseline',
  },
];

export const GHOSTS: GhostArchetype[] = CANONICAL_GHOSTS.map((ghost) => {
  const previous = LEGACY_GHOSTS.find((item) => item.id === ghost.id);
  return {
    id: ghost.id,
    name: ghost.name,
    category: previous?.category ?? (ghost.id === 'stigma-tax' ? 'relational' : 'clinical'),
    fear: ghost.shield,
    disarm: `Move this week: ${ghost.move}`,
    pieces: [ghost.piece],
    href:
      ghost.piece === 'C'
        ? '/tools/scripts'
        : ghost.piece === 'A'
          ? '/tools/clinics'
          : ghost.piece === 'M'
            ? '/piece/M'
            : ghost.piece === 'T'
              ? '/piece/T'
              : '/tools/reminders',
    hrefLabel: 'Take the next step',
  };
});

export const GHOST_BY_ID: Record<string, GhostArchetype> = Object.fromEntries(
  [...LEGACY_GHOSTS, ...GHOSTS].map((ghost) => [ghost.id, ghost]),
);

/** The four positions on the emotional transition spectrum. */
export type SpectrumId = 'fearful' | 'cautious' | 'prepared' | 'fearless';

export interface SpectrumStage {
  id: SpectrumId;
  label: string;
  /** One-line state description. */
  state: string;
  /** What the app suggests you do from here. */
  guidance: string;
  color: string;
}

export const SPECTRUM: SpectrumStage[] = [
  {
    id: 'fearful',
    label: 'Fearful',
    state: 'Paralysed. The fear has no shape yet, so every option feels equally impossible.',
    guidance:
      'Name one ghost. Only one. Naming is the whole task right now — the plan can wait until the fear has edges.',
    color: MATCH_COLOR.T,
  },
  {
    id: 'cautious',
    label: 'Cautious',
    state: 'Gathering data. You are looking at it, carefully, from a safe distance.',
    guidance:
      'Name two or three ghosts and read what pillar each one belongs to. You are building a task list, not a verdict.',
    color: MATCH_COLOR.C,
  },
  {
    id: 'prepared',
    label: 'Prepared',
    state: 'Proactive readiness. The fears are named and each one has a layer behind it.',
    guidance:
      'Disarm what you have named: arm the matching MATCH piece, then check the score move in your favour.',
    color: HUD,
  },
  {
    id: 'fearless',
    label: 'Fearless',
    state: 'Full agency. The fear still shows up — it just no longer decides anything.',
    guidance:
      'Keep the vault current. Add new ghosts as life changes them, and run the Stress Test so the muscle memory stays.',
    color: MATCH_COLOR.M,
  },
];

export const DEFAULT_SPECTRUM: SpectrumId = 'cautious';

export const SPECTRUM_BY_ID: Record<SpectrumId, SpectrumStage> = {
  fearful: SPECTRUM[0],
  cautious: SPECTRUM[1],
  prepared: SPECTRUM[2],
  fearless: SPECTRUM[3],
};

/** A ghost as the vault renders it, whether pre-loaded or written by the user. */
export interface GhostEntry {
  id: string;
  name: string;
  category: GhostCategoryId;
  fear: string;
  disarm: string;
  pieces: PieceKey[];
  href?: Href;
  hrefLabel?: string;
  custom: boolean;
}

export function archetypeEntry(ghost: GhostArchetype): GhostEntry {
  return { ...ghost, custom: false };
}

export function customEntry(ghost: {
  id: string;
  label: string;
  category: GhostCategoryId;
}): GhostEntry {
  return {
    id: ghost.id,
    name: ghost.label,
    category: ghost.category,
    fear: 'Your own words. Nobody else will ever read this.',
    disarm: `The logic engine files this under ${CATEGORY_BY_ID[ghost.category].fullLabel.toLowerCase()}. Arm the pillars below and it stops running loose.`,
    pieces: CATEGORY_PIECES[ghost.category],
    custom: true,
  };
}

/** Pillar demand across ghosts that are named but not yet disarmed, heaviest first. */
export function pieceDemand(entries: GhostEntry[]): { piece: PieceKey; count: number }[] {
  const counts = new Map<PieceKey, number>();
  for (const entry of entries) {
    for (const piece of entry.pieces) {
      counts.set(piece, (counts.get(piece) ?? 0) + 1);
    }
  }
  const rows: { piece: PieceKey; count: number }[] = [];
  for (const [piece, count] of counts) rows.push({ piece, count });
  return rows.sort(
    (a, b) => b.count - a.count || PIECE_BY_KEY[b.piece].weight - PIECE_BY_KEY[a.piece].weight,
  );
}
