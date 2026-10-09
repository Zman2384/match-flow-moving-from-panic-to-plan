/**
 * Lil Z — Christopher Zacharie's digital avatar and the MATCH Flow sexual health guide.
 *
 * The persona and the clinical rules live in the `lil-z` bilt-cloud function, not here,
 * so the app bundle carries no prompt and no model key. This module owns the client
 * contract: message shapes, the screens Lil Z is allowed to hand you off to, the plan
 * context that gets attached to a turn, crisis interception, and the offline briefing
 * engine that answers the core clinical questions with no network at all.
 *
 * Zero Stigma Tax: transcript and memories are saved locally. Live replies require
 * explicit permission for each visit and send recent chat, saved facts and a structured
 * plan summary. Private notes from other screens are never attached automatically;
 * chat itself may contain personal details the user types.
 */

import type { Href } from 'expo-router';

import { CLINICAL_BRIEFINGS } from '@/lib/curriculum';
import { SPECTRUM_BY_ID, type SpectrumId } from '@/lib/ghosts';
import { MATCH_PIECES, pieceScores, saferScore, scoreTier } from '@/lib/match';

export type LilZRole = 'user' | 'guide';

/** One screen hand-off chip attached to a Lil Z reply. */
export interface LilZAction {
  id: string;
  label: string;
}

export interface LilZMessage {
  id: string;
  role: LilZRole;
  text: string;
  at: string;
  actions?: LilZAction[];
  /** Answered by the on-device briefing engine rather than the live model. */
  offline?: boolean;
  /** Why the reply came from the briefing engine instead of the live guide. */
  notice?: string;
  /** Crisis card injected locally, always shown before anything else. */
  crisis?: boolean;
}

/** A durable fact Lil Z carries into later chats. Device-local, capped, user-deletable. */
export interface LilZMemory {
  id: string;
  text: string;
  at: string;
}

export interface LilZReply {
  reply: string;
  actions: LilZAction[];
  remember: string[];
  offline: boolean;
  /** Shown once under the reply when the live model could not be reached. */
  notice?: string;
}

/**
 * Screens Lil Z may send you to. The function returns ids from this same list and
 * anything unrecognised is dropped, so a reply can never invent a route.
 */
export const LILZ_TARGETS: Record<string, { label: string; href: Href }> = {
  plan: { label: 'My Shield', href: '/(tabs)/plan' },
  'safer-score': { label: 'SafER Score', href: '/tools/safer-score' },
  'stress-test': { label: 'Stress Test Lab', href: '/tools/stress-test' },
  'live-session': { label: 'Live Session', href: '/tools/live-session' },
  scripts: { label: 'Script Vault', href: '/tools/scripts' },
  emergency: { label: 'Emergency Protocols', href: '/tools/emergency' },
  clinics: { label: 'Clinic Finder', href: '/tools/clinics' },
  checkin: { label: 'Weekly Check-In', href: '/tools/checkin' },
  'ghost-vault': { label: 'Ghost Vault', href: '/tools/ghost-vault' },
  anxiety: { label: 'Anxiety Reframe', href: '/tools/anxiety' },
  analytics: { label: 'Shield Analytics', href: '/tools/analytics' },
  rituals: { label: 'Ritual Cards', href: '/tools/rituals' },
  reminders: { label: 'Reminders', href: '/tools/reminders' },
  curriculum: { label: 'HARNESS curriculum', href: '/tools/curriculum' },
  resources: { label: 'Knowledge Base', href: '/tools/resources' },
  frameworks: { label: 'Frameworks', href: '/tools/frameworks' },
  'flow-builder': { label: 'Decision Flow', href: '/tools/flow-builder' },
  settings: { label: 'Settings', href: '/settings' },
};

export function targetFor(action: LilZAction): { label: string; href: Href } | null {
  const target = LILZ_TARGETS[action.id];
  if (!target) return null;
  return { label: action.label || target.label, href: target.href };
}

/** Opening line, written in Lil Z's voice. Never stored until the user speaks. */
export const LILZ_GREETING =
  "Hey — I'm Lil Z, Christopher Zacharie's digital avatar and your guide in here.\n\nAsk me about PrEP, PEP, Doxy-PEP, testing, barriers, or the words to use in a hard conversation. If something just went wrong, say so plainly and we'll find a next step.\n\nI start with on-device briefings. Live AI is optional and sends chat context off-device only after you turn it on. Where do you want to start?";

export interface QuickPrompt {
  label: string;
  prompt: string;
}

export const QUICK_PROMPTS: QuickPrompt[] = [
  { label: 'Give me the tour', prompt: 'I am new here. Give me the tour of MATCH Flow.' },
  {
    label: 'The condom broke',
    prompt: 'A condom broke about an hour ago. What do I do right now?',
  },
  {
    label: 'Which PrEP fits me?',
    prompt: 'Walk me through the PrEP options in 2026 and how they differ.',
  },
  {
    label: 'I missed a dose',
    prompt: 'I missed a PrEP dose. How much does that matter and what should I do?',
  },
  {
    label: 'Words for the talk',
    prompt: 'Give me a script for telling a new partner I want us both tested.',
  },
  { label: "I'm spiralling", prompt: 'I am anxious and spiralling about a risk I took.' },
  {
    label: 'How often to test',
    prompt: 'How often should I test, and what are the window periods?',
  },
  {
    label: 'What is U=U?',
    prompt: 'Explain U=U and what an undetectable viral load actually means.',
  },
];

/* ------------------------------------------------------------------ *
 * Plan context
 * ------------------------------------------------------------------ */

export interface LilZPlanSnapshot {
  armed: Record<string, boolean>;
  sessions: number;
  checkIns: number;
  ghostsNamed: number;
  ghostsDisarmed: number;
  spectrum: SpectrumId;
  remindersEnabled: boolean;
  stressTestBest: number | null;
}

/**
 * Compact, structured summary of the local MATCH plan. Option labels and counts only —
 * no free text the user typed, so private notes never travel.
 */
export function buildPlanContext(snapshot: LilZPlanSnapshot): string {
  const score = saferScore(snapshot.armed);
  const scores = pieceScores(snapshot.armed);
  const tier = scoreTier(score);
  const lines: string[] = [`SafER Score ${score}/100 (${tier.label}).`];

  for (const piece of MATCH_PIECES) {
    const armedLabels = piece.options
      .filter((option) => snapshot.armed[option.id])
      .map((option) => option.label);
    lines.push(
      `[${piece.key}] ${piece.name} ${scores[piece.key]}/${piece.weight} — ${
        armedLabels.length > 0 ? armedLabels.join(', ') : 'nothing armed'
      }`,
    );
  }

  lines.push(
    `Logged: ${snapshot.sessions} live sessions, ${snapshot.checkIns} weekly check-ins.`,
    `Ghost Vault: ${snapshot.ghostsNamed} named, ${snapshot.ghostsDisarmed} disarmed. Emotional spectrum stage: ${SPECTRUM_BY_ID[snapshot.spectrum].label}.`,
    `Maintenance nudges: ${snapshot.remindersEnabled ? 'on' : 'off'}.`,
  );
  if (snapshot.stressTestBest !== null) {
    lines.push(`Best stress test result: ${snapshot.stressTestBest}%.`);
  }
  return lines.join('\n');
}

/** The thinnest MATCH piece, used for the companion's nudge line on the Command Center. */
export function thinnestPiece(armed: Record<string, boolean>) {
  const scores = pieceScores(armed);
  return MATCH_PIECES.reduce((worst, piece) =>
    scores[piece.key] / piece.weight < scores[worst.key] / worst.weight ? piece : worst,
  );
}

/* ------------------------------------------------------------------ *
 * Crisis interception — answered on-device, instantly, before any network call
 * ------------------------------------------------------------------ */

const CRISIS_PATTERN =
  /\b(kill myself|killing myself|end my life|suicid\w*|want to die|don'?t want to (be here|live)|self ?harm|hurt myself|cutting myself|overdose)\b/i;

const CRISIS_CARD =
  "I'm going to stop and say this first, because it matters more than anything else in this app: what you just told me deserves a real person, right now.\n\n- In the US, call or text 988 — Suicide & Crisis Lifeline, 24/7.\n- Prefer texting? Text HOME to 741741 for the Crisis Text Line.\n- Outside the US, call your local emergency number.\n- If you are in immediate danger, go to the nearest emergency department.\n\nI'm a sexual health guide, not a mental health provider, so I won't pretend to carry this with you alone. You reached out — that counts. I'm still here when you want to talk about the health side.";

/** Returns the crisis card when a message needs one, otherwise null. */
export function crisisCard(text: string): string | null {
  return CRISIS_PATTERN.test(text) ? CRISIS_CARD : null;
}

/* ------------------------------------------------------------------ *
 * Offline briefing engine — no key, no signal, still useful
 * ------------------------------------------------------------------ */

interface Briefing {
  match: RegExp;
  reply: string;
  actions: LilZAction[];
  doseQuestion?: boolean;
  urgent?: boolean;
}

const BRIEFINGS: Briefing[] = [
  {
    match: /\b(curriculum|harness|chapter|module|field kit|fearless challenge)\b/i,
    reply:
      'MATCH Flow follows MATCH Your Protection: Science as Your Wingman, for adults 18 and older. The HARNESS adult curriculum v2.0 has six modules, 19 chapters and 19 lessons: Mindset of Protection (1–3), Sexual Barriers (4–6), Medical Shields (7–11), Real Talk (12), Your Perfect MATCH (13–15), and Field Kit (16–19). Five reproducible appendices (A–E) are part of the curriculum. The free MATCH workshop pack is a separate 5-session adult letter lab, not a preview of the book and not for middle school. CAPE Flow is the separate grades 6–12 surface. The app currently has the chapter map and safety briefings drawn from supplied pages 1–5, not all 98 pages. Missing manuscript lessons, catalogue entries, dossiers and challenge actions are not invented.',
    actions: [{ id: 'curriculum', label: 'Open the curriculum' }],
  },
  {
    match: /\b(hepatitis c|hcv|hepatitis|vaccine|vaccines|gardasil|jynneos|mpox)\b/i,
    reply: `${CLINICAL_BRIEFINGS.vaccines}\n\n${CLINICAL_BRIEFINGS.hepatitisC}`,
    actions: [{ id: 'resources', label: 'Read the briefing' }],
  },
  {
    match: /\b(pregnancy|pregnant|contraception|plan b)\b/i,
    reply: CLINICAL_BRIEFINGS.pregnancy,
    actions: [{ id: 'clinics', label: 'Find care' }],
  },
  {
    match: /\b(needle play|blood play|blood.borne|cutting|shared needles)\b/i,
    reply: CLINICAL_BRIEFINGS.blood,
    actions: [{ id: 'emergency', label: 'Emergency steps' }],
  },
  {
    match: /\b(safer score|readiness|risk percentage)\b/i,
    reply: CLINICAL_BRIEFINGS.score,
    actions: [{ id: 'plan', label: 'Review your layers' }],
  },
  {
    urgent: true,
    match:
      /\b(pep|broke|broken|slipped|slipped off|exposure|exposed|unprotected|condomless|bareback|assault)\b/i,
    reply:
      "Let's take this in order. Take one slow breath while arranging care — do not delay.\n\n- Go to the nearest emergency department now for urgent PEP evaluation after a possible HIV exposure. PEP must start as soon as possible, ideally within 24 hours and no later than 72 hours. Do not wait for a call, an appointment or test results.\n- If prescribed, PEP is a 28-day course. Ask the clinician about follow-up testing and prevention.\n- Use locator.hiv.gov to prepare an access plan while calm, not to postpone urgent care.\n- If pregnancy is possible, ask about emergency contraception now; method-specific windows differ.\n- Doxy-PEP is a separate prescription and eligibility conversation. It does not replace PEP.\n\nYou're taking care of yourself right now — that matters.",
    actions: [{ id: 'emergency', label: 'Emergency department plan' }],
  },
  {
    match:
      /\b(prep|descovy|truvada|f\/taf|f\/tdf|apretude|cabotegravir|lenacapavir|yeztugo|2-1-1)\b/i,
    reply: `${CLINICAL_BRIEFINGS.prep}\n\n${CLINICAL_BRIEFINGS.hormones}\n\nPrEP reduces sexual HIV acquisition risk by about 99% when taken as prescribed, not risk from every infection. Ask your provider how long your regimen takes to protect your exposure sites.`,
    actions: [
      { id: 'plan', label: 'Arm Medications' },
      { id: 'resources', label: 'Read the briefing' },
    ],
  },
  {
    match: /\b(doxy|doxycycline|chlamydia|syphilis|gonorrhea|gonorrhoea|bacterial)\b/i,
    reply: CLINICAL_BRIEFINGS.doxy,
    actions: [
      { id: 'plan', label: 'Add to my plan' },
      { id: 'clinics', label: 'Find a clinic' },
    ],
  },
  {
    match: /\b(test|testing|screen|screening|window period|results|panel)\b/i,
    reply: `Testing is maintenance, not a verdict.\n\n${CLINICAL_BRIEFINGS.windows}\n\n${CLINICAL_BRIEFINGS.sites}\n\n${CLINICAL_BRIEFINGS.hepatitisC}\n\nAsk for a testing schedule tailored to your PrEP regimen, exposures and symptoms.`,
    actions: [
      { id: 'reminders', label: 'Set a cadence' },
      { id: 'clinics', label: 'Find testing' },
    ],
  },
  {
    match: /\b(condom|barrier|lube|dam|glove|internal condom|latex)\b/i,
    reply: `Barriers work when they are available, correctly used and paired with compatible lube.\n\n${CLINICAL_BRIEFINGS.lambskin}\n\nUse water- or silicone-based lube with latex; never oil. Change barriers between partners and sites. Dams add protection for oral contact. Check toy and barrier instructions for material compatibility.\n\n${CLINICAL_BRIEFINGS.pregnancy}`,
    actions: [
      { id: 'plan', label: 'Arm Tools' },
      { id: 'checkin', label: 'Restock check' },
    ],
  },
  {
    match: /\b(u=u|undetectable|untransmittable|viral load|art|positive|poz|hiv treatment)\b/i,
    reply: `U=U is settled science: a person on ART with a sustained undetectable viral load does not transmit HIV sexually. Staying in care maintains suppression.\n\n${CLINICAL_BRIEFINGS.disclosure}`,
    actions: [
      { id: 'scripts', label: 'Disclosure scripts' },
      { id: 'resources', label: 'Read the briefing' },
    ],
  },
  {
    match:
      /\b(script|disclose|disclosure|the talk|tell (him|her|them)|boundar|consent|say no|refus|negotiat)\b/i,
    reply:
      'Under pressure nobody improvises — you fall back on whatever script exists. So the script has to exist first.\n\nStatus and testing, plainly:\n"Before we go further — I test every three months and I\'m on PrEP. Where are you at?"\n\nBoundary, no apology attached:\n"I use condoms. That\'s not a negotiation for me, it\'s just how I have sex."\n\nExit line, kept short:\n"I\'m not feeling this tonight. I\'m going to head out."\n\nFRIES is the consent test: freely given, reversible, informed, enthusiastic, specific. Your boundary is a complete sentence — it does not need a reason after it.',
    actions: [
      { id: 'scripts', label: 'Script Vault' },
      { id: 'flow-builder', label: 'Build my flow' },
    ],
  },
  {
    match:
      /\b(anxious|anxiety|panic|panicking|scared|terrified|spiral|spiralling|spiraling|overwhelm|freaking out|can'?t breathe|shame|ashamed|stigma)\b/i,
    reply:
      "That sounds really stressful — let's slow down for a second before any logistics.\n\nThree slow breaths. In for four, hold for four, out for six. Do it now; I'll wait.\n\nStill buzzing? Run 5-4-3-2-1: five things you can see, four you can feel, three you can hear, two you can smell, one you can taste.\n\nHere's the reframe: fear is a biological response, not a character flaw. It's data about what you care about. Once it has a name it becomes a task, and tasks have tools.\n\nStay Protected. Stay Fearless.",
    actions: [
      { id: 'ghost-vault', label: 'Name the ghost' },
      { id: 'rituals', label: 'Grounding cards' },
    ],
  },
  {
    doseQuestion: true,
    match: /\b(missed|forgot|late dose|skipped)\b/i,
    reply:
      'A missed dose is a data point, not a failure.\n\n- Follow the instructions for your exact medication; do not improvise extra doses. Ask your prescriber or pharmacist if you are unsure.\n- For a late cabotegravir or lenacapavir injection, contact your prescribing clinic promptly for a restart or bridging plan.\n- If protection may have lapsed and a possible HIV exposure occurred, go to the nearest emergency department now for urgent PEP evaluation. PEP must start as soon as possible, within 72 hours. Do not delay care for a phone call.\n\nThen fix the system: set a reminder and a refill buffer.',
    actions: [
      { id: 'reminders', label: 'Set reminders' },
      { id: 'emergency', label: 'Check the window' },
    ],
  },
  {
    match: /\b(cost|afford|money|insurance|parents|confidential|paper trail|free|uninsured)\b/i,
    reply:
      'Money and privacy are real barriers, not excuses — and both have workarounds.\n\n- PrEP assistance programs and manufacturer support cover many uninsured people; clinics know these by name, ask the front desk directly.\n- Ask for confidential billing when you book. Many sexual health clinics never generate an insurance statement at all.\n- Health department and community clinics often test free, no insurance touched.\n- One sentence that opens all of it: "I need this to stay confidential and I need to know the cost before we start."\n\nThe fear of the paper trail is a ghost worth naming — it has a specific counter-move, which is what the vault is for.',
    actions: [
      { id: 'clinics', label: 'Find a clinic' },
      { id: 'ghost-vault', label: 'Name that ghost' },
    ],
  },
  {
    match:
      /\b(tour|walkthrough|walk me through|new here|get started|how does this|lost|what is match)\b/i,
    reply:
      "Here's the whole system in one pass. MATCH is five interlocking layers — no single one is 100%, five together are hard to break.\n\n- [M] Medications — PrEP, PEP, Doxy-PEP, treatment as prevention, vaccines. Heaviest layer.\n- [A] Awareness — testing rhythm, knowing your status and theirs.\n- [T] Tools — barriers and supplies actually within reach.\n- [C] Communication — the words, rehearsed before you need them.\n- [H] Habits — refills, restocks, the weekly sweep.\n\nStart in My Shield and arm what's already true for you; the SafER Score shows you where the thin spot is. Then Stress Test it, keep Emergency Protocols close for the 1 a.m. moments, and use the Script Vault before the conversation, not during it.\n\nWhat do you want to handle first?",
    actions: [
      { id: 'plan', label: 'My Shield' },
      { id: 'safer-score', label: 'SafER Score' },
      { id: 'emergency', label: 'Emergency' },
    ],
  },
];

const OFFLINE_DEFAULT =
  "I'm using the on-device briefing, so I can work from the app's built-in guidance rather than reason freely about your exact situation. Optional live AI replies are a separate choice.\n\nWhat I can hand you straight away:\n- The 72-hour window after a possible exposure, step by step\n- The 2026 PrEP options and how they differ\n- Doxy-PEP, testing cadence and window periods\n- Barriers, lube compatibility and fit\n- U=U and what undetectable means\n- Word-for-word scripts for disclosure and boundaries\n- A grounding exercise if you're spiralling\n\nName one of those, or open the Knowledge Base for the full briefings.";

/** Keyword-routed answer from the built-in curriculum. Used when the model is unreachable. */
export function offlineBriefing(question: string): { reply: string; actions: LilZAction[] } {
  const normalized = question.replace(/\bdoxy[\s-]*pep\b/gi, 'doxy');
  // Urgent exposure takes priority even when a question also names a curriculum topic.
  const urgent = BRIEFINGS.find((briefing) => briefing.urgent && briefing.match.test(normalized));
  const dose = BRIEFINGS.find(
    (briefing) => briefing.doseQuestion && briefing.match.test(normalized),
  );
  const found = urgent ?? dose ?? BRIEFINGS.find((briefing) => briefing.match.test(normalized));
  if (found) return { reply: found.reply, actions: found.actions };
  return {
    reply: OFFLINE_DEFAULT,
    actions: [
      { id: 'resources', label: 'Knowledge Base' },
      { id: 'emergency', label: 'Emergency' },
    ],
  };
}

/* ------------------------------------------------------------------ *
 * Live model call
 * ------------------------------------------------------------------ */

const FUNCTION_URL = process.env.EXPO_PUBLIC_BILT_URL
  ? `${process.env.EXPO_PUBLIC_BILT_URL}/functions/v1/lil-z`
  : null;

const ANON_KEY = process.env.EXPO_PUBLIC_BILT_ANON_KEY ?? '';

const NOTICE: Record<string, string> = {
  no_model: 'Live guidance is not configured yet, so this came from my on-device briefing.',
  bad_key: 'My model key was rejected, so this came from my on-device briefing.',
  no_credit:
    'The account behind my live voice is out of credit, so this came from my on-device briefing.',
  busy: 'Too many requests at once, so this came from my on-device briefing. Try again shortly.',
  network: "I couldn't reach the network, so this came from my on-device briefing.",
  upstream: 'The model was unavailable just now, so this came from my on-device briefing.',
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function parseActions(value: unknown): LilZAction[] {
  if (!Array.isArray(value)) return [];
  const actions: LilZAction[] = [];
  for (const entry of value) {
    if (!isRecord(entry)) continue;
    const id = typeof entry.id === 'string' ? entry.id : '';
    if (!LILZ_TARGETS[id]) continue;
    actions.push({ id, label: typeof entry.label === 'string' ? entry.label : '' });
  }
  return actions.slice(0, 3);
}

function parseStrings(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((entry): entry is string => typeof entry === 'string' && entry.length > 0);
}

function fallback(question: string, code: string): LilZReply {
  const local = offlineBriefing(question);
  return {
    reply: local.reply,
    actions: local.actions,
    remember: [],
    offline: true,
    notice: NOTICE[code] ?? NOTICE.upstream,
  };
}

export interface AskLilZInput {
  liveAllowed: boolean;
  /** Full local transcript; only recent non-crisis turns may be sent. */
  messages: LilZMessage[];
  planContext: string;
  memories: string[];
}

/** Sends a turn to the guide. Falls back to the on-device briefing on any failure. */
export async function askLilZ({
  liveAllowed,
  messages,
  planContext,
  memories,
}: AskLilZInput): Promise<LilZReply> {
  const lastUser = [...messages].toReversed().find((message) => message.role === 'user');
  const question = lastUser?.text ?? '';
  const crisis = crisisCard(question);
  if (crisis) return { reply: crisis, actions: [], remember: [], offline: true };
  if (!liveAllowed) return { ...offlineBriefing(question), remember: [], offline: true };

  if (!FUNCTION_URL) return fallback(question, 'network');

  try {
    const response = await fetch(FUNCTION_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: ANON_KEY,
        Authorization: `Bearer ${ANON_KEY}`,
      },
      body: JSON.stringify({
        messages: messages
          .filter(
            (message) => !message.crisis && !(message.role === 'user' && crisisCard(message.text)),
          )
          .slice(-14)
          .map((message) => ({ role: message.role, text: message.text })),
        planContext,
        memories,
      }),
    });

    const payload: unknown = await response.json().catch(() => null);

    if (!response.ok) {
      const code =
        isRecord(payload) && typeof payload.code === 'string' ? payload.code : 'upstream';
      return fallback(question, code);
    }

    if (!isRecord(payload) || typeof payload.reply !== 'string' || payload.reply.length === 0) {
      return fallback(question, 'upstream');
    }

    return {
      reply: payload.reply,
      actions: parseActions(payload.actions),
      remember: parseStrings(payload.remember).slice(0, 2),
      offline: false,
    };
  } catch {
    return fallback(question, 'network');
  }
}
