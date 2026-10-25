import type { PieceKey } from '@/lib/match';

export interface LessonSection {
  title: string;
  items: string[];
}
export interface LessonDetail {
  number: number;
  /** Reader-facing key points. Objectives, activities and page refs stay in the facilitator materials. */
  keyPoints: string[];
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
      'PrEP or the provider conversation · where to get PEP at any hour · Doxy-PEP prescription discussion · HPV, hepatitis A, hepatitis B and mpox status · contraception and emergency contraception if pregnancy is possible. My medication layer in one sentence.',
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
    move: 'Practice “I’m nervous about blood draws” before you reach the chair.',
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
    move: 'Practice two words until automatic: “Hold on.”',
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
  'Practiced the Pre-Game script out loud',
  'Practiced the Gentle Hold',
  'Said my Exit Line to a mirror or voice memo',
  'Checked every condom for date and damage',
  'Saved my nearest 24/7 PEP access point',
  'Bookmarked a national locator',
  'Asked about PrEP',
  'Asked about a Doxy-PEP prescription on file',
  'Checked HPV, hepatitis A, hepatitis B and mpox status',
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
    keyPoints: [
      'SafER sex is self-respect and leadership, not a list of rules.',
      'Run the Respect Check on your own. Nobody else needs to see your answers.',
      'Fear-based decisions shrink you; respect-based decisions feel like you afterward.',
      'Pick one small act of leadership you can repeat.',
    ],
    sections: [
      { title: 'The Respect Check', items: RESPECT_CHECK },
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
    keyPoints: [
      'Fear is a normal biological and social response, not a character flaw.',
      'Naming each ghost on paper takes away much of its power.',
      'Cautious is a valid place to be on the Emotional Transition Spectrum.',
      'Every ghost can be turned into a practical next step.',
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
    prompts: ['The ghost I’m naming today, and my practical next step'],
  },
  {
    number: 3,
    keyPoints: [
      'Rejection, Judgment and Mood-Killer are the ghosts that keep people quiet.',
      'Three opening scripts get the conversation started; the Gentle Hold and Exit Line keep it on track under pushback.',
      'Consent is a loop you keep checking — “Is this still good?” — not a box you tick once.',
      'Practice out loud before the moment, using the Rehearsal Protocol below.',
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
    keyPoints: [
      'Use one condom at a time. Two together raise the chance of breakage.',
      'Pinch the tip of an external condom as you roll it on; keep condoms out of wallets and away from teeth and oil-based lube.',
      'Perfect-use and typical-use figures describe pregnancy, not STI protection.',
      'Natural-membrane condoms do not protect against HIV or STIs.',
      'If pregnancy is possible, add a separate pregnancy layer and know your emergency-contraception plan.',
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
    prompts: ['My barrier and my second layer'],
  },
  {
    number: 5,
    keyPoints: [
      'Oral sex is not risk-free.',
      'Dams, gloves and finger cots each have a job; use a new dam every time and never flip it over.',
      'You can make a dam from a non-lubricated condom: snip the tip and base, cut one side and unfold.',
      'Ask for testing at every site you were exposed — throat and rectal as well as urine.',
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
    prompts: ['The testing sentence I’ll say at my next visit'],
  },
  {
    number: 6,
    keyPoints: [
      'Reducing friction is part of infection prevention.',
      'Match the lubricant to the barrier and the toy material.',
      'Porous materials (jelly, rubber, TPR) are harder to clean than non-porous ones (silicone, glass, stainless steel).',
      'Follow the Golden Rule of Sharing below every time a toy moves between people or body sites.',
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
    prompts: ['My lube, my toy materials and my sharing routine'],
  },
  {
    number: 7,
    keyPoints: [
      'Oral PrEP taken as prescribed lowers sexual HIV risk by about 99%; that figure belongs to oral PrEP only.',
      'PrEP protects you without depending on a partner’s permission or honesty.',
      'There are three formats; pick the one that fits your routine with a provider.',
      'Find access through PrEPLocator.org, insurance or patient-assistance programs.',
      'Taking PrEP is preparation, not an admission of anything. Refuse the Stigma Tax.',
    ],
    sections: [
      {
        title: 'Three formats',
        items: [
          'Daily oral: discuss Truvada or Descovy; Descovy is not indicated for receptive vaginal exposure.',
          'Cabotegravir (Apretude): every two months after the initiation schedule.',
          'Lenacapavir (Yeztugo): FDA-approved June 2025, CDC-recommended. Twice-yearly maintenance after the required initiation regimen. Separate evidence; do not transfer the oral 99% figure.',
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
    prompts: ['The PrEP format that fits my life, and my next step to access it'],
  },
  {
    number: 8,
    keyPoints: [
      'Start PEP as soon as possible, no later than 72 hours after a possible HIV exposure.',
      'Go to an emergency department, or another setting only if it can evaluate and provide PEP right away.',
      'Say: “I need to be evaluated for PEP.”',
      'Finish the full 28-day course.',
      'Save a 24-hour access point now, while you are calm (locator.hiv.gov).',
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
    prompts: ['My saved 24-hour PEP access point'],
  },
  {
    number: 9,
    keyPoints: [
      'Doxy-PEP is prescription doxycycline: 200 mg within 72 hours after sex, ideally sooner, and no more than 200 mg in 24 hours.',
      'Studies report reductions of about 80–87% for syphilis and 87–88% for chlamydia (CDC, 2024). Early studies showed partial protection against gonorrhea; more recent data suggest that benefit has faded as resistance spreads. Protection against chlamydia and syphilis has held. These are study estimates, not guarantees; keep testing every 3–6 months.',
      'It does not prevent HIV, herpes or HPV.',
      'It is a backup layer, not a replacement for Tools or Communication.',
      'Ask a provider about eligibility and a prescription before you need it: “Based on my life right now, can we get a prescription on file for me just in case?”',
    ],
    sections: [],
    takeaway: 'One dose to restore your shield — and know exactly what it doesn’t cover.',
    prompts: ['What I’ll ask my provider about Doxy-PEP'],
  },
  {
    number: 10,
    keyPoints: [
      'Sustained undetectable viral load means zero risk of sexual HIV transmission (U=U).',
      'Status-neutral language keeps the focus on care, not blame.',
      'Disclosure can follow a simple shape: the fact, the science, the door.',
      'Disclosure laws vary by state and may predate U=U. A legal aid or HIV services organization can advise you.',
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
    prompts: ['U=U in one sentence, in my own words'],
  },
  {
    number: 11,
    keyPoints: [
      'Ask a provider about HPV, hepatitis A, hepatitis B and mpox vaccines.',
      'Hepatitis C has no vaccine; ask for the test by name.',
      'Set a testing schedule that fits your exposures and prevention plan; every three to six months is common when appropriate.',
      'Each test has its own window period. An early negative may need a retest.',
      'Ask for testing at the sites you were exposed, whatever assumptions are made about your gender. At-home kits help when the clinic is the barrier.',
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
    prompts: ['My next test and vaccine dates'],
  },
  {
    number: 12,
    keyPoints: [
      'Layers apply to kink, group settings, fluid bonding and substance nights too.',
      'Negotiate before a scene: limits, a safeword (“Red” stops everything immediately), aftercare and equipment hygiene.',
      'Never share blades; use sterile single-use equipment for any blood exposure.',
      'Make your plan before substances affect decisions: limits, a buddy, your kit, medications and a way home.',
      'If a condom breaks mid-sex, know when to seek emergency PEP care.',
    ],
    sections: [
      {
        title: 'Blood exposure and fluid bonding',
        items: [
          'Blood exposure adds hepatitis B, hepatitis C and HIV concerns. Hepatitis B has a vaccine; hepatitis C does not, but treatment can cure it.',
          'Fluid bonding requires explicit negotiation and shared testing information; it does not eliminate STI risk.',
        ],
      },
    ],
    takeaway:
      'No activity is inherently unsafe — layers make everything SafER. Desire is not a risk factor.',
    note: 'Layers lower risk; they do not erase it. Some activities carry real risk even with every layer in place.',
    prompts: ['My pre-game plan for my next big night'],
  },
  {
    number: 13,
    keyPoints: [
      'Your five MATCH pieces work together as one protection system.',
      'Define each layer in your own words, then name your strongest and weakest piece.',
      'The SafER Score measures readiness, not your chance of infection.',
      'When one layer breaks, activate another. One broken layer does not mean the plan failed.',
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
    prompts: ['My strongest layer, my weakest layer and the fix'],
  },
  {
    number: 14,
    keyPoints: [
      'A checklist only works when nothing goes wrong; a plan has to handle breaks.',
      'Write a baseline plan, imagine what breaks it, then write your pivot.',
      'Know your pivot for each of the five common breaks below.',
      'When external tools are unavailable, name what still holds and move to it.',
    ],
    sections: [
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
    keyPoints: [
      'Acute stress makes decisions harder; that is biology, not failure.',
      'Pause · Pivot · Protect is a drill you practice before you need it.',
      'After a spike, ask what is still true: a broken condom does not erase PrEP.',
      'Know which MATCH layer you turn to first when Tools fail.',
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
    prompts: ['My first pivot when Tools fail'],
  },
  {
    number: 16,
    keyPoints: [
      'Find the two or three ghosts that hit hardest among the sixteen below.',
      'Every ghost has a shield and a MATCH letter.',
      'Choose one move and do it this week.',
    ],
    sections: [],
    takeaway: 'Every ghost has a shield. This is the index.',
  },
  {
    number: 17,
    keyPoints: [
      'Rehearse eight named nights before you live them.',
      'Writing the script and pivot down beats imagining it.',
      'For each dossier: the scene, the friction, the pivot, the line you will say, your own words and what you need in place first.',
      'Dossier H is for those it applies to, or for practicing as an ally.',
    ],
    sections: [],
    takeaway: 'Rehearse the night before you live it.',
  },
  {
    number: 18,
    keyPoints: [
      'Complete all six steps for your life right now.',
      'Check that every ghost you named in Lessons 2 and 16 now has a MATCH piece answering it.',
      'Keep your plan on your phone, where you can reach it under pressure.',
    ],
    sections: [],
    takeaway: 'Your plan is uniquely yours — dynamic, realistic, and empowering.',
    prompts: PLAN_STEPS.map((s) => `${s.title}: ${s.prompt}`),
  },
  {
    number: 19,
    keyPoints: [
      'Turn what you know into specific actions you can finish.',
      'Actions do not need to happen in order or one per day.',
      'Finish named actions, not vague intentions.',
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
