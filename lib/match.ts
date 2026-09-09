/**
 * The MATCH framework — five "puzzle pieces" of layered sexual health protection.
 * Weights sum to 100 and drive the SafER shield score.
 */

import { HUD, MATCH_COLOR } from '@/lib/palette';

export type PieceKey = 'M' | 'A' | 'T' | 'C' | 'H';

export interface MatchOption {
  id: string;
  label: string;
  /** Points contributed toward this piece's weight when armed. */
  points: number;
  detail: string;
}

export interface MatchPiece {
  key: PieceKey;
  name: string;
  emoji: string;
  color: string;
  weight: number;
  tagline: string;
  summary: string;
  options: MatchOption[];
}

export const MATCH_PIECES: MatchPiece[] = [
  {
    key: 'M',
    name: 'Medications',
    emoji: '💊',
    color: MATCH_COLOR.M,
    weight: 40,
    tagline: 'Medical shields that lower transmission risk',
    summary:
      'Biomedical layers such as PrEP, PEP, Doxy-PEP, treatment as prevention, and vaccines. This is the heaviest piece because consistent medication is the strongest single lever most people control.',
    options: [
      {
        id: 'prep-daily',
        label: 'Daily oral PrEP',
        points: 22,
        detail: 'One pill a day, taken consistently.',
      },
      {
        id: 'prep-injectable',
        label: 'Long-acting injectable PrEP',
        points: 22,
        detail: 'Clinic injections on a fixed schedule.',
      },
      {
        id: 'prep-ondemand',
        label: 'On-demand / event-driven PrEP',
        points: 14,
        detail: 'Dosing around planned encounters.',
      },
      {
        id: 'art',
        label: 'On treatment, undetectable',
        points: 22,
        detail: 'Sustained viral suppression via ART.',
      },
      {
        id: 'doxypep',
        label: 'Doxy-PEP on hand',
        points: 8,
        detail: 'Bacterial STI prophylaxis after exposure.',
      },
      {
        id: 'vaccines',
        label: 'Vaccines current',
        points: 6,
        detail: 'HPV, hepatitis A/B, mpox as advised.',
      },
      {
        id: 'pep-plan',
        label: 'I know where to get PEP fast',
        points: 4,
        detail: 'A named 24/7 access point inside 72 hours.',
      },
    ],
  },
  {
    key: 'A',
    name: 'Awareness',
    emoji: '🧠',
    color: MATCH_COLOR.A,
    weight: 10,
    tagline: 'Knowing your status, their status, and your schedule',
    summary:
      'Testing cadence, knowing your own results, and having a repeatable way to learn a partner’s status without guessing.',
    options: [
      {
        id: 'tested-3mo',
        label: 'Tested in the last 3 months',
        points: 4,
        detail: 'Recent full-panel screening.',
      },
      {
        id: 'test-schedule',
        label: 'Standing testing schedule',
        points: 3,
        detail: 'Recurring reminder, not a "when I remember".',
      },
      {
        id: 'partner-status',
        label: 'I ask partners about status',
        points: 2,
        detail: 'Every partner, before the encounter.',
      },
      {
        id: 'symptom-literacy',
        label: 'I know what symptoms to watch for',
        points: 1,
        detail: 'Recognise and act on early signs.',
      },
    ],
  },
  {
    key: 'T',
    name: 'Tools',
    emoji: '🛡️',
    color: MATCH_COLOR.T,
    weight: 15,
    tagline: 'Physical barriers and supplies you actually have',
    summary:
      'Barriers only work if they are within arm’s reach, the right size, and paired with compatible lube.',
    options: [
      {
        id: 'condoms',
        label: 'External / internal condoms stocked',
        points: 7,
        detail: 'In date, correct fit, easy to reach.',
      },
      {
        id: 'lube',
        label: 'Compatible lube stocked',
        points: 3,
        detail: 'Water or silicone based, not oil with latex.',
      },
      {
        id: 'gloves-dams',
        label: 'Gloves / dams available',
        points: 2,
        detail: 'For manual and oral barriers.',
      },
      {
        id: 'go-bag',
        label: 'Portable kit I carry',
        points: 3,
        detail: 'Supplies travel with you, not just at home.',
      },
    ],
  },
  {
    key: 'C',
    name: 'Communication',
    emoji: '💬',
    color: MATCH_COLOR.C,
    weight: 15,
    tagline: 'Consent, disclosure, and boundary language',
    summary:
      'Words you have already rehearsed. Under pressure people fall back on scripts, so the script needs to exist first.',
    options: [
      {
        id: 'disclosure',
        label: 'I can state my status plainly',
        points: 4,
        detail: 'No hedging, no apology.',
      },
      {
        id: 'boundaries',
        label: 'My hard limits are named',
        points: 4,
        detail: 'Written down before the moment.',
      },
      {
        id: 'consent-checks',
        label: 'I run consent check-ins',
        points: 4,
        detail: 'Freely given, reversible, informed, enthusiastic, specific.',
      },
      {
        id: 'exit-line',
        label: 'I have a rehearsed exit line',
        points: 3,
        detail: 'One sentence that ends things cleanly.',
      },
    ],
  },
  {
    key: 'H',
    name: 'Habits',
    emoji: '🔁',
    color: MATCH_COLOR.H,
    weight: 20,
    tagline: 'Routines that keep the other four pieces alive',
    summary:
      'Protection decays without maintenance. Habits are the refill, the reminder, the restock, and the check-in.',
    options: [
      {
        id: 'reminders',
        label: 'Dose / refill reminders set',
        points: 6,
        detail: 'Automated, not memory-based.',
      },
      {
        id: 'restock',
        label: 'Monthly supply restock',
        points: 5,
        detail: 'Count and replace before you run out.',
      },
      {
        id: 'weekly-checkin',
        label: 'Weekly safety check-in',
        points: 4,
        detail: 'Five-item sweep of your plan.',
      },
      {
        id: 'sober-rule',
        label: 'A personal substance rule',
        points: 3,
        detail: 'A line you decided while sober.',
      },
      {
        id: 'safety-contact',
        label: 'A safety contact who knows my plans',
        points: 2,
        detail: 'Someone expecting a check-out text.',
      },
    ],
  },
];

export const PIECE_BY_KEY: Record<PieceKey, MatchPiece> = buildPieceRecord(MATCH_PIECES);

function buildPieceRecord(pieces: readonly MatchPiece[]): Record<PieceKey, MatchPiece> {
  const M = pieces.find((piece) => piece.key === 'M');
  const A = pieces.find((piece) => piece.key === 'A');
  const T = pieces.find((piece) => piece.key === 'T');
  const C = pieces.find((piece) => piece.key === 'C');
  const H = pieces.find((piece) => piece.key === 'H');
  if (!M || !A || !T || !C || !H) {
    throw new Error('MATCH_PIECES is missing one of the required M/A/T/C/H entries.');
  }
  return { M, A, T, C, H };
}

export const PIECE_COLOR: Record<PieceKey, string> = {
  M: MATCH_COLOR.M,
  A: MATCH_COLOR.A,
  T: MATCH_COLOR.T,
  C: MATCH_COLOR.C,
  H: MATCH_COLOR.H,
};

export interface ScoreTier {
  label: string;
  color: string;
  blurb: string;
}

export function scoreTier(score: number): ScoreTier {
  if (score >= 85) {
    return {
      label: 'Fortified',
      color: MATCH_COLOR.M,
      blurb: 'Multiple independent layers. One failure will not sink you.',
    };
  }
  if (score >= 65) {
    return {
      label: 'Solid',
      color: HUD,
      blurb: 'Strong core coverage with a couple of thin spots.',
    };
  }
  if (score >= 45) {
    return {
      label: 'Partial',
      color: MATCH_COLOR.C,
      blurb: 'Real protection, but too dependent on a single layer.',
    };
  }
  if (score >= 20) {
    return {
      label: 'Exposed',
      color: MATCH_COLOR.H,
      blurb: 'Thin coverage. Add a medication layer.',
    };
  }
  return {
    label: 'Critical',
    color: MATCH_COLOR.T,
    blurb: 'No puzzle pieces armed. Start with one medication and one tool.',
  };
}

/** Per-piece earned points, capped at each piece's weight. */
export function pieceScores(armed: Record<string, boolean>): Record<PieceKey, number> {
  const scoreFor = (piece: MatchPiece) =>
    Math.min(
      piece.options.reduce((sum, option) => (armed[option.id] ? sum + option.points : sum), 0),
      piece.weight,
    );
  return {
    M: scoreFor(PIECE_BY_KEY.M),
    A: scoreFor(PIECE_BY_KEY.A),
    T: scoreFor(PIECE_BY_KEY.T),
    C: scoreFor(PIECE_BY_KEY.C),
    H: scoreFor(PIECE_BY_KEY.H),
  };
}

export function saferScore(armed: Record<string, boolean>): number {
  const scores = pieceScores(armed);
  return Math.round(MATCH_PIECES.reduce((sum, piece) => sum + scores[piece.key], 0));
}

export function armedCount(armed: Record<string, boolean>): number {
  return Object.values(armed).filter(Boolean).length;
}
