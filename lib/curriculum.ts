import type { Href } from 'expo-router';

export const MATCH_BOOK_TITLE = 'MATCH Your Protection: Science as Your Wingman';
export const CURRICULUM_EDITION = 'MATCH Your Protection';
export const CURRICULUM_SOURCE_NOTE =
  'Each lesson follows a chapter of the book. Medication names, effectiveness figures and access rules change over time: confirm every clinical detail with a licensed provider. After a possible HIV exposure, go to an emergency room now.';

/** Published study estimates, not individual protection probabilities or prescribing advice. */
export const CLINICAL_BRIEFINGS = {
  doxy: 'Doxy-PEP is prescription doxycycline: 200 mg within 72 hours after sex, ideally sooner, and no more than 200 mg in 24 hours. A provider must assess eligibility. Studies report relative reductions of about 80–87% for syphilis, 87–88% for chlamydia, and only 50–55% for gonorrhea (CDC, 2024). The evidence comes mainly from cisgender men who have sex with men and transgender women. These are study estimates, not guarantees; the gonorrhea gap matters. It does not prevent HIV, viral STIs, or pregnancy.',
  windows:
    'Approximate detection windows: laboratory HIV antigen/antibody testing, 18–45 days; rapid HIV antibody testing, 23–90 days; chlamydia and gonorrhea, 1–2 weeks; syphilis, 3–6 weeks; hepatitis C antibody, 8–11 weeks. Test type, medication and circumstances affect timing. An early negative result does not rule out infection. Ask a provider when to test and repeat; do not wait for a window to seek care after an exposure or with symptoms.',
  sites:
    'Ask about throat, rectal and urine/genital testing according to exposure sites and anatomy. A urine-only panel can miss a throat or rectal infection. Blood testing covers different infections; there is no universal “full panel.”',
  vaccines:
    'Ask about HPV vaccination (Gardasil 9), hepatitis B vaccination and mpox vaccination (JYNNEOS, a two-dose series). Eligibility and schedules belong with a provider. Vaccines reduce risk; they do not replace the other MATCH layers.',
  hepatitisC:
    'Hepatitis C has no vaccine. It is curable for most people with direct-acting antivirals, commonly over 8–12 weeks. It may not be included in routine screening: ask for hepatitis C testing by name. A provider decides which test and treatment fit.',
  hormones:
    'PrEP has no known clinically significant interaction with estrogen or testosterone used in gender-affirming care. Tell both providers about your medications. Oral PrEP may require kidney monitoring; monitoring depends on the regimen.',
  pregnancy:
    'If pregnancy is possible, add a separate layer: barriers, daily or scheduled contraception, or long-acting contraception. PrEP and Doxy-PEP do not prevent pregnancy. After an exposure, ask a pharmacist or clinician about emergency contraception now. Windows differ by method, generally up to 3–5 days; hours matter. Some emergency contraception pills are available over the counter in the US; other options require a prescription or clinician.',
  lambskin:
    'Lambskin or natural-membrane condoms can help prevent pregnancy but do not protect against HIV or other STIs. Choose a barrier labeled for STI prevention; check material and lubricant compatibility.',
  blood:
    'Blood exposure is its own risk category. Needle play, cutting and skin-breaking impact can transmit hepatitis B or C and HIV. Use sterile, single-use equipment, never shared between people; do not reuse it. Layers reduce risk, not eliminate it. After a possible HIV exposure, go to an emergency department now for PEP evaluation.',
  disclosure:
    'Use three parts: the fact, the science, the door. “I live with HIV. I am on treatment with a sustained undetectable viral load, so I do not transmit HIV sexually. What would you like to ask?” U=U does not prevent other STIs or pregnancy. Some jurisdictions retain HIV-specific disclosure laws that do not reflect U=U. Seek qualified local legal advice; the app cannot determine your legal obligations.',
  prep: 'Compare three PrEP formats with a provider: daily oral medication, cabotegravir injections every two months after initiation, and twice-yearly lenacapavir injections (Yeztugo) with the required initiation regimen. HIV testing is required before starting and during care. Eligibility, time to protection, missed-dose instructions and monitoring differ. Event-driven 2-1-1 is not a fourth universally suitable format; it is off-label in the US and requires a provider discussion.',
  score:
    'The SafER Score is an educational plan-readiness checklist, not a validated clinical risk calculation or a percentage chance of avoiding infection. No single tool covers every outcome. Five interlocking MATCH layers add redundancy; a high score never cancels urgent exposure care.',
} as const;

export interface CurriculumChapter {
  number: number;
  title: string;
  focus: string;
  briefing?: string;
  tool: { label: string; href: Href };
}
export interface CurriculumModule {
  number: number;
  title: string;
  chapters: CurriculumChapter[];
}

export const CURRICULUM_MODULES: CurriculumModule[] = [
  {
    number: 1,
    title: 'Mindset of Protection',
    chapters: [
      {
        number: 1,
        title: 'Own Your Health — It Starts With Yourself',
        focus: 'The Respect Check: protection starts with self-respect and agency.',
        tool: { label: 'Ground yourself', href: '/tools/rituals' },
      },
      {
        number: 2,
        title: 'Ghost Hunting: Turning Fear Into Data',
        focus: 'The Anxiety Audit: name a fear, then connect it to a MATCH layer and an action.',
        tool: { label: 'Open the Anxiety Audit', href: '/tools/ghost-vault' },
      },
      {
        number: 3,
        title: 'The Erotic Art of Communication',
        focus: 'Rehearse consent, boundaries and pushback scripts before the high-friction moment.',
        tool: { label: 'Rehearse a script', href: '/tools/scripts' },
      },
    ],
  },
  {
    number: 2,
    title: 'Sexual Barriers',
    chapters: [
      {
        number: 4,
        title: 'Condoms — The Frontline',
        focus: 'Condom materials and the pregnancy layer.',
        briefing: `${CLINICAL_BRIEFINGS.lambskin}\n\n${CLINICAL_BRIEFINGS.pregnancy}`,
        tool: { label: 'Check your tools', href: '/piece/T' },
      },
      {
        number: 5,
        title: 'Mouths Count Too: The Art of Oral Protection',
        focus: 'Oral protection and three-site testing.',
        briefing: CLINICAL_BRIEFINGS.sites,
        tool: { label: 'Ask for site-specific testing', href: '/tools/scripts' },
      },
      {
        number: 6,
        title: 'Smooth Moves: Lube and Toys',
        focus:
          'Compatible lube, toys and the sharing protocol. Change barriers between partners and sites; clean toys according to their instructions.',
        tool: { label: 'Review the Tools layer', href: '/piece/T' },
      },
    ],
  },
  {
    number: 3,
    title: 'Medical Shields',
    chapters: [
      {
        number: 7,
        title: 'PrEP: Your Biological Armor',
        focus: 'Three PrEP formats and gender-affirming care.',
        briefing: `${CLINICAL_BRIEFINGS.prep}\n\n${CLINICAL_BRIEFINGS.hormones}`,
        tool: { label: 'Review Medications', href: '/piece/M' },
      },
      {
        number: 8,
        title: 'PEP: The Emergency Brake',
        focus:
          'After a possible HIV exposure, go to an emergency room now. PEP must start as soon as possible, within 72 hours, and the course is 28 days. Do not delay care for a call, appointment or search. Use locator.hiv.gov to plan access while calm; it is not a substitute for urgent care.',
        tool: { label: 'Open emergency steps', href: '/tools/emergency' },
      },
      {
        number: 9,
        title: 'The Bacterial Backup: Doxy-PEP',
        focus: 'Bacterial backup, candidacy and the gonorrhea gap.',
        briefing: CLINICAL_BRIEFINGS.doxy,
        tool: { label: 'Rehearse the provider conversation', href: '/tools/scripts' },
      },
      {
        number: 10,
        title: 'ART and the Science of Certainty',
        focus: 'ART, U=U and disclosure.',
        briefing: CLINICAL_BRIEFINGS.disclosure,
        tool: { label: 'Open disclosure scripts', href: '/tools/scripts' },
      },
      {
        number: 11,
        title: 'Immunity Unlocked: Vaccines and Testing',
        focus: 'Vaccines, hepatitis C, window periods and three-site testing.',
        briefing: `${CLINICAL_BRIEFINGS.vaccines}\n\n${CLINICAL_BRIEFINGS.hepatitisC}\n\n${CLINICAL_BRIEFINGS.windows}\n\n${CLINICAL_BRIEFINGS.sites}`,
        tool: { label: 'Plan testing', href: '/tools/reminders' },
      },
    ],
  },
  {
    number: 4,
    title: 'Real Talk',
    chapters: [
      {
        number: 12,
        title: 'Pleasure, Kink, and Playing It Smart',
        focus:
          'Adult track only: kink, substances, blood-borne risk and fluid bonding. Set consent and substance boundaries while clear-headed; fluid bonding does not replace testing or prevention layers.',
        briefing: CLINICAL_BRIEFINGS.blood,
        tool: { label: 'Rehearse boundaries', href: '/tools/scripts' },
      },
    ],
  },
  {
    number: 5,
    title: 'Your Perfect MATCH',
    chapters: [
      {
        number: 13,
        title: 'Piecing Together the Puzzle: The MATCH Framework',
        focus:
          'Medications, Awareness, Tools, Communication and Habits work as interlocking layers.',
        briefing: CLINICAL_BRIEFINGS.score,
        tool: { label: 'Build your shield', href: '/(tabs)/plan' },
      },
      {
        number: 14,
        title: 'The Plan Stress Test',
        focus:
          'From checklist to living strategy: a plan that only works under perfect conditions is a wish. Draft it, disrupt it, adapt it, then debrief what held.',
        tool: { label: 'Stress-test your plan', href: '/tools/stress-test' },
      },
      {
        number: 15,
        title: 'Surviving the 1 a.m. Reality',
        focus:
          'Pause · Pivot · Protect. Interrupt the panic, identify the missing layer, and take the next protective action without delaying urgent care.',
        tool: { label: 'Open emergency steps', href: '/tools/emergency' },
      },
    ],
  },
  {
    number: 6,
    title: 'The Field Kit',
    chapters: [
      {
        number: 16,
        title: 'The Ghost Catalogue',
        focus: 'Sixteen ghosts, each with a named shield, a MATCH letter and a move for this week.',
        tool: { label: 'Open the Ghost Vault', href: '/tools/ghost-vault' },
      },
      {
        number: 17,
        title: 'Stress-Test Dossiers',
        focus: 'Eight canonical drills connect disruptions to backup layers.',
        tool: { label: 'Practise in the Stress Test Lab', href: '/tools/stress-test' },
      },
      {
        number: 18,
        title: 'Build Your MATCH Plan',
        focus: 'Six steps, beginning with Step 1 · Name Your Ghosts.',
        tool: { label: 'Review your armed layers', href: '/(tabs)/plan' },
      },
      {
        number: 19,
        title: 'The 30-Day Fearless Challenge',
        focus: 'Thirty days of named actions that turn protection into a routine.',
        tool: { label: 'Set a maintenance routine', href: '/tools/reminders' },
      },
    ],
  },
];

export const CURRICULUM_APPENDICES = [
  { letter: 'A', title: 'Boundary Setting' },
  { letter: 'B', title: 'Partner Comms' },
  { letter: 'C', title: 'Sexual Health Comms' },
  { letter: 'D', title: 'MATCH Framework' },
  { letter: 'E', title: 'Fearless Foundations' },
] as const;
