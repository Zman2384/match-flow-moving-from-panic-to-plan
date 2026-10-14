import type { PieceKey } from '@/lib/match';

export interface LessonSection {
  title: string;
  items: string[];
}
export interface LessonDetail {
  number: number;
  pages: string;
  objectives: string[];
  activities: string[];
  sections: LessonSection[];
  takeaway: string;
  prompts?: string[];
  note?: string;
}
export const RESPECT_CHECK = [
  "Am I doing this because I want to, or because I'm afraid of what happens if I don't?",
  'Would I be okay if my best friend saw this decision? — the friend who wants good things for you, not a judgmental relative. “They’d be worried about me” is data too.',
  'Am I treating my body like something to manage, or something to protect? Managing is damage control. Protecting is leadership.',
];
export const COMMUNICATION_SCRIPTS = [
  {
    title: 'The Pre-Game',
    text: 'Hey, before we get too into this, I want to make sure we’re both safe. Have you been tested recently?',
  },
  {
    title: 'The Barrier Pivot',
    text: 'I like using condoms because they let me relax completely and just enjoy you.',
  },
  {
    title: 'The Boundary Setting',
    text: 'I’m curious about trying [A], but I’m not ready for [B] tonight. How do we make this good for both of us?',
  },
  {
    title: 'The Gentle Hold',
    text: 'I hear you, and this is still non-negotiable for me. It isn’t about trust — it’s just how I take care of myself.',
  },
  {
    title: 'The Exit Line',
    text: 'If we can’t find a way to make this safe for both of us, tonight isn’t happening — and that’s okay.',
  },
];
export const PLAN_STEPS = [
  {
    title: 'Name Your Ghosts',
    prompt:
      'The fear that shows up most · where I am on the Emotional Transition Spectrum today · one ghost I’m ready to name out loud this week.',
  },
  {
    title: '[M] Medications',
    prompt:
      'PrEP or the provider conversation · where to get PEP at any hour · Doxy-PEP prescription discussion · HPV, hepatitis B and mpox status · contraception and emergency contraception if pregnancy is possible. My medication layer in one sentence.',
  },
  {
    title: '[A] Awareness',
    prompt:
      'Last testing date and sites · next test scheduled · what I actually know about my current partner’s status.',
  },
  {
    title: '[T] Tools',
    prompt:
      'Condoms in date, right size, stored cool · compatible lube · dams or gloves relevant to what I do · a restock trigger so I never hit zero.',
  },
  {
    title: '[C] Communication',
    prompt: 'My opening line · my exact words when someone pushes back · my exit line.',
  },
  {
    title: '[H] Habits',
    prompt:
      'Restock reminder · buddy-system contact for high-stakes nights · one habit I’ll commit to for thirty days.',
  },
];
export interface CanonicalGhost {
  id: string;
  name: string;
  piece: PieceKey;
  shield: string;
  move: string;
}
export const CANONICAL_GHOSTS: CanonicalGhost[] = [
  {
    id: 'rejection',
    name: 'Rejection',
    piece: 'C',
    shield:
      'A partner who leaves because you asked for safety just saved you months. Data about them, delivered early and cheaply.',
    move: 'Say the Pre-Game script to one person.',
  },
  {
    id: 'judgment',
    name: 'Judgment',
    piece: 'C',
    shield: 'Your history is a fact, not a verdict.',
    move: 'Read the sentence you’re most afraid to say out loud once.',
  },
  {
    id: 'mood-killer',
    name: 'Vibe-Killer',
    piece: 'T',
    shield: 'The pause is two seconds. The anxiety of skipping it lasts two weeks.',
    move: 'Put your barrier within arm’s reach of where sex actually happens.',
  },
  {
    id: 'positive-result',
    name: 'Positive Result',
    piece: 'A',
    shield: 'Care and treatment exist. Not knowing has never made anything smaller.',
    move: 'Book the test before you finish talking yourself out of it.',
  },
  {
    id: 'cost',
    name: 'Cost',
    piece: 'A',
    shield:
      'Sliding scale, Ryan White, county charity care, and free at-home kits exist; eligibility varies.',
    move: 'Locate one sliding-scale clinic in your county and save the number.',
  },
  {
    id: 'paper-trail',
    name: 'Paper Trail',
    piece: 'C',
    shield:
      'Many sexual health clinics offer confidential services. Confirm billing and insurance notices before care.',
    move: 'Call one clinic and ask: “Do you offer confidential billing?”',
  },
  {
    id: 'phone',
    name: 'Phone',
    piece: 'A',
    shield: 'Many clinics now book online.',
    move: 'Book online, or ask one person to sit next to you while you call.',
  },
  {
    id: 'bureaucracy',
    name: 'Bureaucracy',
    piece: 'A',
    shield: 'Four terms handle much of an intake desk: sliding scale, confidential, PEP, panel.',
    move: 'Learn those four terms; ask which tests and sites a panel includes.',
  },
  {
    id: 'needle',
    name: 'Needle',
    piece: 'C',
    shield: 'Tell the technician while sitting down: accommodations are part of care.',
    move: 'Practise “I’m nervous about blood draws” before you reach the chair.',
  },
  {
    id: 'language',
    name: 'Language',
    piece: 'C',
    shield: '“Can you say that again more simply?” is a complete sentence.',
    move: 'Write three questions on your phone before the appointment.',
  },
  {
    id: 'disclosure',
    name: 'Disclosure',
    piece: 'C',
    shield: 'Rehearsed, early, on your terms — not at 1 a.m. and not as an apology.',
    move: 'Draft your disclosure sentence now, while nothing is at stake.',
  },
  {
    id: 'stigma-tax',
    name: 'Stigma Tax',
    piece: 'M',
    shield: 'PrEP is preparation. So is a seatbelt. Nobody reads a seatbelt as a confession.',
    move: 'Ask about PrEP once. The asking is the whole hurdle.',
  },
  {
    id: 'timing',
    name: 'Timing',
    piece: 'C',
    shield: 'There is no expiration on a boundary.',
    move: 'Practise two words until automatic: “Hold on.”',
  },
  {
    id: 'access',
    name: 'Access',
    piece: 'A',
    shield:
      'Locators map testing, PrEP and PEP by ZIP; at-home kits may be available. Transit is a logistics problem, not a character flaw.',
    move: 'Enter your ZIP in a national locator and save the door you can use. Verify hours and services.',
  },
  {
    id: 'silence',
    name: 'Silence',
    piece: 'H',
    shield: 'Frame it as maintenance, not suspicion. Routine beats interrogation.',
    move: 'Send the text: “I’m booking a panel — want to go together?”',
  },
  {
    id: 'perfection',
    name: 'Perfection',
    piece: 'H',
    shield: 'One bad night does not erase the whole plan. Name what held, then repair the gap.',
    move: 'Name the layer that DID hold last time something went wrong.',
  },
];
export interface CanonicalDossier {
  letter: string;
  title: string;
  scene: string;
  friction: string;
  pivot: PieceKey;
  script: string;
  safety?: string;
}
export const CANONICAL_DOSSIERS: CanonicalDossier[] = [
  {
    letter: 'A',
    title: 'The Broken Barrier',
    scene: '1 a.m., the condom broke and you both noticed a beat late.',
    friction: 'Panic wants you to spiral or pretend it didn’t happen.',
    pivot: 'M',
    script:
      'That broke. I’m going to get checked out tonight — can you tell me your last test date?',
    safety:
      'Possible HIV exposure: emergency department now for PEP evaluation. Do not delay for a partner’s answer.',
  },
  {
    letter: 'B',
    title: 'The 72-Hour Window',
    scene: 'High-risk exposure Friday; Saturday care is closed until Monday.',
    friction: 'The Access Ghost says wait until Monday.',
    pivot: 'M',
    script: 'I need to be evaluated for PEP. My exposure was Friday night.',
    safety: 'Monday may be past 72 hours. Go to an emergency department now; earlier is better.',
  },
  {
    letter: 'C',
    title: 'The Missed Doses',
    scene: 'Travel wrecked the routine; two PrEP doses missed this week.',
    friction: 'The Perfection Ghost says the whole thing is blown.',
    pivot: 'M',
    script:
      'I’ve missed doses. I’m checking my restart instructions — let’s use condoms while I confirm protection.',
    safety:
      'Restart and missed-dose instructions depend on the regimen. Ask your provider or pharmacist; do not double doses. Recent exposure may need urgent PEP evaluation.',
  },
  {
    letter: 'D',
    title: 'The New Partner',
    scene: 'First time with someone new; the testing conversation never happened.',
    friction: 'The Timing Ghost says it’s too late to ask.',
    pivot: 'C',
    script: 'Before we go further — when were you last tested? I’m happy to go first.',
  },
  {
    letter: 'E',
    title: 'The Uninsured Visit',
    scene: 'Testing needed, no insurance, ten dollars before someone asks for a card.',
    friction: 'The Cost Ghost says walk out.',
    pivot: 'A',
    script: 'I’m uninsured. How do I apply for sliding scale or charity care today?',
  },
  {
    letter: 'F',
    title: 'The Substance Night',
    scene: 'Several drinks in, moving faster than planned.',
    friction: 'Decisions get harder exactly when judgment is compromised.',
    pivot: 'H',
    script: 'I’m going to slow this down. Let me grab a condom.',
    safety:
      'Win this before the night starts: limits, supplies and a buddy plan. A barrier does not establish consent; stop if either person cannot freely consent.',
  },
  {
    letter: 'G',
    title: 'The Long-Distance Reunion',
    scene: 'Months apart, no testing updates; asking now feels like an accusation.',
    friction: 'The Silence Ghost says asking ruins the reunion.',
    pivot: 'A',
    script: 'Let’s both get a panel this week — I’d rather have certainty than assume.',
  },
  {
    letter: 'H',
    title: 'The Disclosure',
    scene: 'Living with HIV; the conversation is coming late and under pressure.',
    friction: 'The Disclosure Ghost wants an apology.',
    pivot: 'C',
    script:
      'I’m living with HIV and I’m undetectable, which means zero risk of sexual transmission. Ask me anything.',
    safety:
      'U=U requires sustained viral suppression. Other STIs and pregnancy need separate layers. Disclosure law varies: consult qualified local advice. Choose this drill only if it applies, or as voluntary ally practice.',
  },
];
export const CHALLENGE_ACTIONS = [
  'Named a ghost out loud to someone I trust',
  'Ran the full Anxiety Audit on paper',
  'Practised the Pre-Game script out loud',
  'Practised the Gentle Hold',
  'Said my Exit Line to a mirror or voice memo',
  'Checked every condom for date and damage',
  'Saved my nearest 24/7 PEP access point',
  'Bookmarked a national locator',
  'Asked about PrEP',
  'Asked about a Doxy-PEP prescription on file',
  'Checked HPV, hepatitis B and mpox status',
  'Asked for site-specific testing rather than urine only',
  'Told a partner my last test date without being asked',
  'Set a restock reminder that repeats',
  'Ran the three-second pause as a physical drill',
  'Wrote my pivot for a broken condom',
  'Worked two dossiers',
  'Filled in every step of Build Your MATCH Plan',
  'Saved a copy of my plan',
  'Learned the four intake words',
  'Explained U=U correctly to another person',
  'Turned down something I didn’t want without over-explaining',
  'Noticed a decision made from respect instead of fear',
  'Restocked before running out',
];
export const LESSON_DETAILS: LessonDetail[] = [
  {
    number: 1,
    pages: '6',
    objectives: [
      'Reframe SafER sex as self-love and leadership, not a list of rules.',
      'Run the Respect Check privately, with no sharing required.',
      'Distinguish fear-based decisions from respect-based decisions.',
      'Identify one small, repeatable act of leadership.',
    ],
    activities: [
      'Two Words Icebreaker: two words about sexual health right now (5 min).',
      'Respect Check Solo Pass: run all three questions privately (8 min).',
      'Field Notes: one fear-based decision identified; one repeatable act of leadership chosen; status no longer treated as a verdict.',
      'Your First Move: the act I start this week and how I’ll know it’s working.',
    ],
    sections: [
      { title: 'The Respect Check — teach verbatim', items: RESPECT_CHECK },
      {
        title: 'Read the decision',
        items: [
          'If the decision makes you feel more like yourself afterward, it was probably respect. If it makes you feel smaller, it was fear wearing respect’s clothes.',
        ],
      },
    ],
    takeaway: 'Respect yourself first; every other tool is just backup.',
    prompts: ['One leadership act I’ll start this week', 'How I’ll know it’s working'],
  },
  {
    number: 2,
    pages: '7',
    objectives: [
      'Validate fear as a biological and social reality, not a character flaw.',
      'Externalize specific anxieties through the Anxiety Audit.',
      'Place yourself on the Emotional Transition Spectrum; Cautious is a valid stage.',
      'Convert each ghost into a practical next step.',
    ],
    activities: [
      'The Anxiety Audit: private, no sharing required (15 min).',
      'Biological Normalization: “These are responses, not flaws” (5 min).',
      'Spectrum Placement: privately mark where you sit today (3 min).',
      'Optional Pair Share: what would change if a concrete plan addressed your ghosts? (15 min).',
      'Start with the fear that made your stomach drop; the full catalogue follows in Lesson 16.',
    ],
    sections: [
      {
        title: 'The Anxiety Audit',
        items: [
          'Write down every ghost, including the embarrassing ones. Do not edit.',
          'Beside each, write what you would actually do if it came true — the practical version, not the spiral.',
          'Separate health concerns from fears about being liked, being enough, or being left. Those fears are real too; support belongs with them.',
        ],
      },
      {
        title: 'Emotional Transition Spectrum',
        items: [
          'Fearful: everything feels like a wall; a normal starting point.',
          'Cautious: gathering real information instead of guessing.',
          'Prepared: tools and scripts are in place.',
          'Fearless: confident in your choices; ghosts named and disarmed.',
        ],
      },
    ],
    takeaway: 'The ghost you name today is the first thing your MATCH plan will silence.',
    note: 'The Audit is a back-pocket tool, not a one-time exercise. Ghosts return in new relationships and new life stages.',
  },
  {
    number: 3,
    pages: '8',
    objectives: [
      'Name Rejection, Judgment and Mood-Killer as conversation barriers.',
      'Deliver the three opening scripts fluently.',
      'Hold the line under pushback with the Gentle Hold and Exit Line.',
      'Understand consent as a loop, not a checkbox.',
      'Complete the Rehearsal Protocol.',
    ],
    activities: [
      'Bridge from Lesson 2’s Rejection Ghost (10 min).',
      'Role-Play Triads: Speaker / Listener / Observer, rotate; include a pushback round (30 min).',
      'Consent Loop: “Is this still good?” / “How does this feel?” You may change your order or leave at any time.',
      'Write Your Own: a Pre-Game script in words you’d say and one non-negotiable sentence.',
      'Commitment: one conversation I’ll have this week (10 min).',
    ],
    sections: [
      { title: 'Vocal armor', items: COMMUNICATION_SCRIPTS.map((s) => `${s.title}: “${s.text}”`) },
      {
        title: 'Rehearsal Protocol',
        items: [
          'Read it silently once. Notice resistance.',
          'Say it out loud to yourself. Notice where your voice drops.',
          'Say it to a mirror, a friend, or a voice memo.',
          'Say it in the room where it will actually matter.',
        ],
      },
    ],
    takeaway: 'Silence is risk. Conversation is protection.',
    prompts: ['My Pre-Game script', 'My non-negotiable sentence'],
    note: 'Consent can be withdrawn for any reason without explanation. Guilt over a changed mind is a red flag, not a mixed signal.',
  },
  {
    number: 4,
    pages: '9',
    objectives: [
      'Demonstrate external and internal condom use.',
      'Distinguish perfect-use and typical-use pregnancy figures; they are not STI estimates.',
      'Apply the DOs and DON’Ts, including pinching the external condom tip.',
      'Reject double-bagging; use one barrier at a time.',
      'Match material to need; natural membrane is not an HIV/STI barrier.',
      'Build a separate pregnancy-prevention layer if relevant.',
    ],
    activities: [
      'Condom Demo & Practice on anatomical models.',
      'Common Mistakes Gallery: wallet storage, teeth, oil-based lube, doubling up, reuse.',
      'Internal Condom Walkthrough: inner ring inserted, outer ring outside; guide penetration into the pouch. Follow the product’s instructions and indicated use.',
      'Pleasure Mapping: fit, texture and integrating barriers into foreplay.',
      'The Ask: “Condoms are my STI layer. What would you recommend as a second layer for pregnancy, and what should I keep on hand for emergencies?”',
      'Gear Check: six boxes, including your emergency-contraception plan.',
    ],
    sections: [
      {
        title: 'Pregnancy layers',
        items: [
          'Barrier: external or internal condom; also reduces STI risk.',
          'Daily / scheduled: pill, patch, ring or injection with a provider.',
          'Long-acting: IUD or implant; method-specific duration.',
          'Emergency contraception: levonorgestrel, ulipristal or a copper IUD. Sooner is better; confirm the method and window with a provider or pharmacist.',
        ],
      },
      {
        title: 'Materials',
        items: [
          'Latex: common and effective; not for latex allergy.',
          'Polyurethane / polyisoprene: latex-free options; check lubricant compatibility.',
          'Natural membrane / lambskin: pregnancy prevention, not HIV or STI prevention.',
        ],
      },
    ],
    takeaway: 'One at a time, every time — and know your second layer.',
  },
  {
    number: 5,
    pages: '10',
    objectives: [
      'Reject the assumption that oral sex is risk-free.',
      'Use dams, gloves and finger cots appropriately.',
      'Build a dam from a condom.',
      'Ask for testing at relevant exposure sites.',
    ],
    activities: [
      'DIY Dental Dam: unroll a non-lubricated condom, snip tip and base, cut down one side, unfold.',
      'Pleasure hack: compatible water-based lube on the body side.',
      'Dam discipline: one new dam each time; never flip it over.',
      'Gloves & finger cots: address hangnails and cuts.',
      'Three-Site Script Rehearsal: say the sentence out loud once.',
      'Gear Check: dams, gloves and your three-site testing line.',
    ],
    sections: [
      {
        title: 'The three-site correction',
        items: [
          'A urine-only panel can miss throat or rectal chlamydia and gonorrhea.',
          '“I’d like three-site testing — throat and rectal swabs as well as urine, please.”',
          'Choose specimens according to anatomy and exposure; blood testing covers different infections.',
        ],
      },
    ],
    takeaway:
      'Peace of mind is an aphrodisiac — and a urine-only panel is not a clean bill of health.',
  },
  {
    number: 6,
    pages: '10–11',
    objectives: [
      'Explain why friction reduction belongs in protection.',
      'Match lubricant to barrier and toy material.',
      'Distinguish porous from non-porous materials.',
      'Run the Golden Rule of Sharing.',
    ],
    activities: [
      'Lube Station: compare water-based and silicone-based; test compatibility claims.',
      'Porous vs. Non-Porous Sort: jelly, rubber and TPR versus silicone, glass and stainless steel.',
      'Cleaning Demo: follow manufacturer instructions for each material and any motorized parts.',
      'Sharing Protocol: say the three steps aloud; consider whether you’d follow them mid-moment.',
      'Gear Check: your lube, your toy materials and your sharing protocol.',
    ],
    sections: [
      {
        title: 'Lube compatibility',
        items: [
          'Water-based: broadly compatible; reapply when it dries.',
          'Silicone-based: longer-lasting with latex and nitrile barriers; check toy compatibility, particularly silicone toys.',
          'Oil-based: never with latex; check every other barrier’s instructions rather than assuming all non-latex products are compatible.',
        ],
      },
      {
        title: 'The Golden Rule of Sharing',
        items: [
          'Put a fresh condom on the toy.',
          'Use it.',
          'Remove and change the condom before the toy touches another person or a different body site. Clean according to manufacturer instructions.',
        ],
      },
    ],
    takeaway: 'Friction reduction is infection prevention. Match the lube to the material.',
    note: 'Cleaning depends on the material and the manufacturer’s instructions. Not every non-porous toy can be boiled or put in a dishwasher.',
  },
  {
    number: 7,
    pages: '12',
    objectives: [
      'Keep the ~99% sexual-exposure estimate specific to oral PrEP taken as prescribed.',
      'Describe a layer independent of a partner’s permission or honesty.',
      'Match the three formats to a real routine.',
      'Discuss gender-affirming hormone coordination.',
      'Name and refuse the Stigma Tax.',
    ],
    activities: [
      'PrEP Overview: mechanism, effectiveness, three formats.',
      'Format-to-Life Match: which fits your routine and why? A fit exercise, not a gatekeeping quiz.',
      'Access Mapping: PrEPLocator.org, insurance and patient-assistance programs.',
      'Hormone Coordination Script: practise aloud.',
      'The Ask: “I’d like to talk about starting PrEP. Can we go over which option fits my life and what my coverage looks like?”',
    ],
    sections: [
      {
        title: 'Three formats',
        items: [
          'Daily oral: discuss Truvada or Descovy; Descovy is not indicated for receptive vaginal exposure.',
          'Cabotegravir (Apretude): every two months after the initiation schedule.',
          'Lenacapavir (Yeztugo): twice-yearly maintenance after the required initiation regimen. Separate evidence; do not transfer the oral 99% figure.',
        ],
      },
      {
        title: 'Hormone coordination',
        items: [
          '“I’m on gender-affirming hormone therapy. I’d like PrEP, and I want my monitoring coordinated with the provider who manages my hormones.”',
        ],
      },
    ],
    takeaway:
      'Taking PrEP isn’t an admission of recklessness. It’s a declaration that you are prepared.',
    note: 'Medication names, effectiveness figures and access rules change over time. Confirm every clinical detail with a licensed provider.',
  },
  {
    number: 8,
    pages: '13',
    objectives: [
      'Start PEP as soon as possible, no later than 72 hours after a possible HIV exposure.',
      'Use an emergency department; another setting only if it can evaluate and provide PEP promptly.',
      'Complete the prescribed 28-day course.',
      'Identify a 24-hour access point before it is needed.',
    ],
    activities: [
      'Save It Now, while calm: use locator.hiv.gov and verify 24-hour PEP evaluation; save the access point.',
      'The Sentence: “I need to be evaluated for PEP.”',
      '72-Hour Timeline Drill: calculate actual elapsed hours from an exposure.',
      'PEP → PrEP Transition: emergency prevention is a tactical success, not a moral failure.',
    ],
    sections: [
      {
        title: 'Hour / move',
        items: [
          '0–2: go now; earlier is better, but two hours is not a separate clinical cutoff.',
          '2–24: go today, not tomorrow.',
          '24–72: go immediately; do not self-assess your way out of care.',
          'More than 72: seek prompt clinical evaluation, testing and a prevention plan. Do not decide care is pointless.',
        ],
      },
    ],
    takeaway: 'Emergency rooms don’t close. Start fast, complete fully.',
    note: '72 hours is the outer limit for starting PEP, not a target. Do not wait for a search, a drill or a phone call: go now.',
  },
  {
    number: 9,
    pages: '13',
    objectives: [
      'Describe prescription Doxy-PEP: 200 mg within 72 hours after sex, ideally sooner; no more than 200 mg in 24 hours.',
      'Distinguish the syphilis, chlamydia and gonorrhea reduction estimates.',
      'State that it does not prevent HIV, herpes or HPV.',
      'Use it as a redundant layer, not a replacement for Tools or Communication.',
      'Discuss eligibility and a prescription before it is needed.',
    ],
    activities: [
      'Evidence Review: syphilis ~80–87%, chlamydia ~87–88%, gonorrhea only ~50–55% (CDC, 2024). Study estimates, not guarantees.',
      'What It Doesn’t Do: name three viral infections it does not prevent.',
      'Antibiotic stewardship: evidence and CDC recommendations focus on specific populations; candidacy belongs with a provider.',
      'The Script: “I’ve heard about Doxy-PEP as a backup for STI prevention. Based on my life right now, can we get a prescription on file for me just in case?”',
    ],
    sections: [],
    takeaway: 'One dose to restore your shield — and know exactly what it doesn’t cover.',
  },
  {
    number: 10,
    pages: '14–15',
    objectives: [
      'Explain sustained undetectable viral load and zero sexual HIV transmission risk accurately.',
      'Practise status-neutral care language.',
      'Deliver disclosure using the fact → science → door structure.',
      'Recognize that disclosure law varies and may predate U=U.',
    ],
    activities: [
      'U=U Explainer + One-Sentence Test: explain it to another person.',
      'Language Practice: status-neutral versus stigmatizing card sort.',
      'Disclosure Script Draft: write it while nothing is at stake; rewrite in your own words.',
      'Consistency framing: medication as self-respect, not a reminder of diagnosis.',
      'Legal note: disclosure laws vary by state. A legal aid or HIV services organization can advise you.',
      'Optional guest speaker: lived experience, voluntary participation.',
    ],
    sections: [
      {
        title: 'Disclosure — three things to hold first',
        items: [
          'U=U is a fact to state, not a case to argue.',
          'Disclosure is not an apology.',
          'Choose the timing: early, calm and on ground you picked — not under pressure.',
        ],
      },
      {
        title: 'The fact → the science → the door',
        items: [
          '“I’m living with HIV, and I’m undetectable — which means there’s zero risk of transmitting it to you sexually. I wanted you to hear that from me, early. Ask me anything.”',
          '“I can tell that’s a lot to take in. Take the time you need — and if you want to read about U=U before we talk again, I’ll send you a link.”',
          'Someone needing time is different from someone turning cruel. You do not owe a second conversation to someone who is unsafe.',
        ],
      },
    ],
    takeaway: 'Undetectable = Untransmittable. Science has changed the story of HIV.',
  },
  {
    number: 11,
    pages: '14–15',
    objectives: [
      'Discuss HPV, hepatitis B and mpox vaccines with a provider.',
      'Recognize hepatitis C: no vaccine; ask for testing by name.',
      'Plan a testing cadence for your exposures and prevention regimen.',
      'Apply test-specific window periods.',
      'Ask for appropriate testing sites regardless of gender assumptions.',
    ],
    activities: [
      'Immunity & Testing Tracker: HPV, hepatitis B, mpox, HIV, relevant-site STI testing and hepatitis C, each with status and next due date.',
      'Window Period Puzzle: exposure date versus test date; repeat with three tests.',
      'Ask-For-It Round: “Can you include a hepatitis C screen with the rest?”',
      'Discuss three-to-six-month testing when appropriate with a provider.',
      'At-home options when the clinic is the barrier.',
      'Name one free or low-cost testing access point.',
    ],
    sections: [
      {
        title: 'Say this at the clinic',
        items: [
          '“Given my last exposure was [date], is it too early for this test to be meaningful — and should I retest?”',
          'Window periods vary by assay. Confirm timing with the clinic running your test.',
        ],
      },
    ],
    takeaway:
      'Knowing your status is an act of self-respect — and a negative test only covers what your body had time to register.',
  },
  {
    number: 12,
    pages: '16',
    objectives: [
      'Apply layers to kink, group settings, fluid bonding and substance nights without lecturing.',
      'Practise pre-scene negotiation, safewords, aftercare and equipment hygiene.',
      'Treat blood exposure as its own category.',
      'Run a pre-game plan before substance use affects decision-making.',
    ],
    activities: [
      'Continuum of Risk: name a layer that makes each activity safer.',
      'Kink Scenario Discussions: BDSM, group and fetish safety.',
      'Blood-Play Hygiene: never share blades; sterile single-use equipment for blood exposure.',
      'Substance Pre-Game: limits, buddy system, kit and medication plan before heading out.',
      'Crisis Communication: condom breaks mid-sex; when to seek emergency PEP care.',
      'Safewords: “Red” stops everything immediately, no negotiation.',
      'Aftercare: check-in, grounding, water and closeness by consent.',
      'Pre-Game Checklist: limits, buddy, kit, medication and a way home.',
    ],
    sections: [
      {
        title: 'Adult-only scope',
        items: [
          'This lesson belongs in the MATCH adult track, not a CAPE youth room.',
          'Blood exposure adds hepatitis B, hepatitis C and HIV concerns. Hepatitis B has a vaccine; hepatitis C does not, but treatment can cure it.',
          'Fluid bonding requires explicit negotiation and shared testing information; it does not eliminate STI risk.',
        ],
      },
    ],
    takeaway:
      'No activity is inherently unsafe — layers make everything SafER. Desire is not a risk factor.',
    note: 'Layers lower risk; they do not erase it. Some activities carry real risk even with every layer in place.',
  },
  {
    number: 13,
    pages: '16–17',
    objectives: [
      'Assemble five pieces into a personal Modular Protection Engine.',
      'Define each MATCH layer in your own words.',
      'Understand the SafER Score as educational readiness, not infection probability.',
      'Explain dynamic redundancy: when one layer breaks, activate another.',
    ],
    activities: [
      'Five-Piece Assembly: name all five letters without looking.',
      'Strongest / Weakest Layer: name what is strongest, weakest and what would fix it.',
      'SafER Score Walkthrough: build readiness layer by layer in a volunteer scenario.',
      'Field Notes: one broken layer does not mean the plan failed.',
    ],
    sections: [
      {
        title: 'MATCH definitions',
        items: [
          'M · Medications: PrEP, PEP, Doxy-PEP, ART, vaccines and contraception where relevant.',
          'A · Awareness: status, partners’ status, window periods and reading the room.',
          'T · Tools: external/internal condoms, dams, gloves and lubricant that reduces friction.',
          'C · Communication: boundaries, testing conversations, disclosure and enthusiastic consent.',
          'H · Habits: stocking supplies, adherence and checking in after sex.',
        ],
      },
    ],
    takeaway: 'Prevention isn’t one-size-fits-all. It’s a puzzle you solve for yourself.',
  },
  {
    number: 14,
    pages: '17–18',
    objectives: [
      'Move from a static checklist to living logic when something breaks.',
      'Run baseline → inject chaos → pivot.',
      'Write a pivot for each of five real-world breaks.',
      'Name the Mindset of Protection once the plan has been tested.',
    ],
    activities: [
      'DRAFT (8 min): write a concrete baseline plan before disruption.',
      'DISRUPT (1 min): one Constraint Card face-down per participant; flip simultaneously on signal, no early looks.',
      'ADAPT (8 min): revise under time pressure; identify actual fail-safes, not wishes.',
      'DEBRIEF (8 min): name layers that held and gaps exposed; adjusting is the goal, not perfection.',
      'Stress-Test Worksheet: write five pivots in your own words.',
    ],
    sections: [
      {
        title: 'Constraint Cards',
        items: [
          'Late-Night Emergency: no pharmacy open; three hours in — nearest ER?',
          'The Buzz: drinking; communication inaccessible — what is your fail-safe?',
          'Empty Go-Bag: kit empty — which layer steps forward?',
          'New Partner, Unknown Status: partner declines disclosure; you’re on PrEP — how does the plan hold?',
        ],
      },
      {
        title: 'Five breaks / pivots',
        items: [
          'Condom breaks or slips: seek prompt PEP evaluation if HIV exposure is possible; know 24/7 access.',
          'Missed PrEP doses: do not double up; get regimen-specific restart advice and use backup layers. Recent exposure may need PEP.',
          'Partner pressure: “I relax more when we’re protected.” If they cannot respect that, leave safely.',
          'Supplies run out: appropriate improvised dam, backup lube or a conversation about another activity.',
          'Clinic closed: identify an emergency department now, not during the crisis.',
        ],
      },
      {
        title: 'Analytical debrief',
        items: [
          'No lube and drinking: which letter is your primary shield and why? Discuss M and C without ignoring capacity for consent.',
          'Did your plan rely on a pharmacy? How does elapsed time change the next move?',
          'How do PrEP or U=U change panic when a condom is unavailable? Medication is an active layer, not a last resort.',
          'Now name the Mindset of Protection: when external tools are unavailable, identify what still holds and pivot.',
        ],
      },
    ],
    takeaway: 'A plan that only works under perfect conditions is not a plan — it is a wish.',
    prompts: [
      'Broken barrier: my pivot',
      'Missed doses: my pivot',
      'Partner pressure: my pivot',
      'Empty kit: my pivot',
      'Clinic closed: my pivot',
    ],
  },
  {
    number: 15,
    pages: '18',
    objectives: [
      'Recognize that acute stress can make decision-making harder.',
      'Run Pause · Pivot · Protect as a physical drill.',
      'Name the first MATCH layer to pivot to when Tools fail.',
    ],
    activities: [
      'Three-Second Drill: count out loud before responding to a scenario; repeat three times.',
      'Post-Spike Inventory: what is still true? A broken condom does not erase PrEP; a fuzzy moment does not erase self-worth.',
      'First Pivot Naming: name the layer you turn to first.',
      'Say a boundary sentence out loud once.',
      'Field Notes: what still held, and your first pivot.',
    ],
    sections: [
      {
        title: 'Pause · Pivot · Protect',
        items: [
          'Pause: stop, breathe and count to three if safe to do so.',
          'Pivot: identify a redundant layer of your MATCH plan.',
          'Protect: take the next concrete action; do not delay emergency care.',
        ],
      },
    ],
    takeaway: 'Protection begins with you — before any tool or partner.',
    note: 'A short pause helps you ground and choose. It is a habit, not a guarantee.',
  },
  {
    number: 16,
    pages: '19–20',
    objectives: [
      'Find your two or three loudest ghosts among the sixteen.',
      'Match each to a shield and MATCH letter.',
      'Complete one move this week.',
    ],
    activities: [
      'Find Your Three: mark the two or three that made your chest tighten.',
      'Letter Assignment: name each ghost’s MATCH letter.',
      'One Move, Today: choose a move and schedule it.',
      'Optional anonymous Gallery Walk across the sixteen; no public identification required.',
    ],
    sections: [],
    takeaway: 'Every ghost has a shield. This is the index.',
  },
  {
    number: 17,
    pages: '20–21',
    objectives: [
      'Rehearse eight named nights before living them.',
      'Write the script and pivot: imagined practice is not written practice.',
      'For each dossier, name scene, friction, pivot, spoken line, own words and prerequisites.',
    ],
    activities: [
      'One dossier per week for eight weeks, or all eight in an afternoon.',
      'Workshop: work at least two all the way through in writing.',
      'Win Dossier F before the night starts.',
      'Dossier H is voluntary for those it applies to, or voluntary ally practice without outing anyone.',
    ],
    sections: [],
    takeaway: 'Rehearse the night before you live it.',
  },
  {
    number: 18,
    pages: '21',
    objectives: [
      'Complete all six steps for life right now.',
      'Close the Ghost → MATCH loop from Step 1.',
      'Leave with a plan accessible in your phone, not only on a shelf.',
    ],
    activities: [
      'Guided individual completion; optional pair share of one element.',
      'Return to Lesson 2 and Lesson 16 ghosts; confirm each has an addressed MATCH piece.',
      'Review Lesson 14: which letter held, which exposed a gap?',
      'Keep a copy you can reach under pressure.',
      'Closing Circle: “I feel more fearless because…”',
    ],
    sections: [],
    takeaway: 'Your plan is uniquely yours — dynamic, realistic, and empowering.',
    prompts: PLAN_STEPS.map((s) => `${s.title}: ${s.prompt}`),
  },
  {
    number: 19,
    pages: '22–23',
    objectives: [
      'Turn knowledge into specific, completable actions.',
      'Actions need not happen in order or one per day.',
      'Finish named actions, not vague intentions.',
    ],
    activities: [
      'Launch in-session: complete at least one action before leaving.',
      'Optional cohort check-in at day 15.',
      'Day 30 Debrief: the habit that stuck, the one that didn’t and what I’m carrying forward.',
    ],
    sections: [],
    takeaway: 'Thirty days is long enough to build a habit and short enough to finish.',
    prompts: ['Day 30: what stuck, what didn’t, what comes next'],
  },
];
export const APPENDIX_FRAMING =
  'These forms build trust and make conversations concrete. They are not contracts, they transfer no legal obligation, and they do not replace medical advice. Consent remains withdrawable at any moment regardless of what anyone has signed.';
export const APPENDIX_SUMMARIES = [
  'A · Boundary Setting Worksheet: limits, consent check-in frequency and mode, communication style, non-negotiables and flexible areas. You alone; Lesson 3.',
  'B · Partner Communication Agreement: STI status, testing history, contraception, SafER methods, boundaries and five commitments. Both partners; Lessons 3 or 12.',
  'C · Sexual Health Communication Agreement: fuller consent and commitment statements. Both partners; Lesson 12.',
  'D · MATCH Framework Worksheet: five layers and physical, emotional, relational and emergency Strength Shield. You alone; Lesson 13.',
  'E · Fearless Foundations: protection quadrants, conversation practice, Power Statement, reflection and signature. You alone; Lessons 18 or 19.',
];
