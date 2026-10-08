import { CLINICAL_BRIEFINGS } from '@/lib/curriculum';
import type { PieceKey } from '@/lib/match';
import { GHOST_COLOR, HUD, MATCH_COLOR } from '@/lib/palette';

export interface ScriptLine {
  id: string;
  /** What the line is for. */
  goal: string;
  /** The rehearsable sentence. */
  text: string;
  /** Optional follow-up if they push back. */
  followUp?: string;
}

export interface ScriptSituation {
  id: string;
  title: string;
  description: string;
  pieces: PieceKey[];
  group: 'field' | 'clinic';
  lines: ScriptLine[];
}

export const SCRIPT_SITUATIONS: ScriptSituation[] = [
  {
    id: 'status-unknown',
    title: 'Status Unknown',
    description: 'They have not shared HIV or STI status yet',
    pieces: ['A', 'C'],
    group: 'field',
    lines: [
      {
        id: 'su-1',
        goal: 'Open the topic without accusation',
        text: 'Before anything happens — when were you last tested, and what did they screen for?',
        followUp: 'I ask everyone. It is not about you, it is my routine.',
      },
      {
        id: 'su-2',
        goal: 'Go first to lower the stakes',
        text: 'I will start: here is my last test date and what I am on. Your turn.',
      },
      {
        id: 'su-3',
        goal: 'Handle a vague answer',
        text: '"A while ago" is fine, I just need a rough month so I can decide what I am comfortable with.',
      },
      {
        id: 'su-4',
        goal: 'Proceed with barriers instead',
        text: 'Neither of us has recent results, so barriers stay on tonight. That is my line.',
      },
    ],
  },
  {
    id: 'partner-pushy',
    title: 'Partner Pushy',
    description: 'They are pressuring you to drop a barrier',
    pieces: ['C'],
    group: 'field',
    lines: [
      {
        id: 'pp-1',
        goal: 'Restate the boundary once, plainly',
        text: 'I hear you, and the answer is still yes to sex, no to skipping the condom.',
      },
      {
        id: 'pp-2',
        goal: 'Refuse to negotiate the boundary',
        text: 'This is not a bargaining position for me. It is a condition.',
      },
      {
        id: 'pp-3',
        goal: 'Name the pressure out loud',
        text: 'You have asked three times. Asking again is going to end this instead of change it.',
      },
      {
        id: 'pp-4',
        goal: 'Leave cleanly',
        text: 'I am going to head out. I would rather stop than do something I will regret.',
      },
    ],
  },
  {
    id: 'barrier-aversion',
    title: 'Barrier Aversion',
    description: 'They say condoms ruin it for them',
    pieces: ['T', 'C'],
    group: 'field',
    lines: [
      {
        id: 'ba-1',
        goal: 'Treat it as a fit problem',
        text: 'Most people who hate condoms are wearing the wrong size. I brought three options.',
      },
      {
        id: 'ba-2',
        goal: 'Fix sensation with lube',
        text: 'Dry friction is the real problem. A few drops inside and out changes everything.',
      },
      {
        id: 'ba-3',
        goal: 'Offer a lower-risk swap',
        text: 'If barriers are a hard no for you, we keep tonight to things that do not need one.',
      },
      {
        id: 'ba-4',
        goal: 'Hold the line',
        text: 'I like you enough to be honest: without one, I am not doing this.',
      },
    ],
  },
  {
    id: 'negotiation',
    title: 'Negotiation Needed',
    description: 'You need to agree on specific acts and limits',
    pieces: ['C'],
    group: 'field',
    lines: [
      {
        id: 'ng-1',
        goal: 'Build a yes / maybe / no list',
        text: 'Quick round: name one thing you definitely want, one maybe, and one hard no.',
      },
      {
        id: 'ng-2',
        goal: 'Set a stop signal',
        text: 'If either of us says "pause", everything stops with no explanation owed.',
      },
      {
        id: 'ng-3',
        goal: 'Confirm the agreement',
        text: 'So we agreed: these things yes, barriers for this, and we check in halfway.',
      },
    ],
  },
  {
    id: 'safety-concern',
    title: 'Safety Concern',
    description: 'You feel unsafe, cornered, or coerced',
    pieces: ['H'],
    group: 'field',
    lines: [
      {
        id: 'sc-1',
        goal: 'Create a low-conflict exit',
        text: 'My ride is outside and I have to go. I will text you.',
      },
      {
        id: 'sc-2',
        goal: 'Signal a friend',
        text: 'Give me one second, I have to answer this — my friend checks in at midnight.',
      },
      {
        id: 'sc-3',
        goal: 'Refuse without softening',
        text: 'No. I am leaving now.',
      },
      {
        id: 'sc-4',
        goal: 'Get to a public space',
        text: 'Let us step outside for air before anything else.',
      },
    ],
  },
  {
    id: 'hiv-disclosure',
    title: 'HIV disclosure',
    description: 'The fact, the science, the door',
    pieces: ['M', 'C'],
    group: 'field',
    lines: [
      { id: 'hd-1', goal: 'The fact', text: 'I live with HIV, and I am on treatment.' },
      {
        id: 'hd-2',
        goal: 'The science — when sustained suppression is confirmed',
        text: 'My viral load is sustained undetectable. U=U means I do not transmit HIV sexually. We still plan for other STIs and pregnancy where relevant.',
      },
      {
        id: 'hd-3',
        goal: 'The door',
        text: 'What would you like to ask? We can take time before deciding anything.',
      },
      {
        id: 'hd-4',
        goal: 'A bad reaction',
        text: 'I shared this to be honest, not to be judged. We can pause, and I can leave if this no longer feels respectful.',
      },
      {
        id: 'hd-5',
        goal: 'Check local legal obligations with qualified counsel',
        text: 'Can you connect me with qualified local advice on HIV disclosure laws? I understand some laws have not caught up with U=U.',
      },
    ],
  },
  {
    id: 'medical-question',
    title: 'Medical Question',
    description: 'You need to raise PrEP, vaccines, or testing',
    pieces: ['M', 'A'],
    group: 'field',
    lines: [
      {
        id: 'mq-1',
        goal: 'Explain what you are on',
        text: 'I am on PrEP, which means my HIV risk from this is extremely low even without a condom. Other STIs still need barriers.',
      },
      {
        id: 'mq-2',
        goal: 'Explain undetectable',
        text: 'I am on treatment and undetectable. That means I cannot transmit HIV sexually.',
      },
      {
        id: 'mq-3',
        goal: 'Suggest they get covered too',
        text: 'If you want the same coverage, PrEP is usually free or low cost. I can send you where I go.',
      },
    ],
  },
  {
    id: 'substance',
    title: 'Substance Impairment',
    description: 'Alcohol or drugs are clouding the call',
    pieces: ['H', 'C'],
    group: 'field',
    lines: [
      {
        id: 'sb-1',
        goal: 'Defer the decision to sober you',
        text: 'I made a rule sober: no new partners while I am this far gone. Rain check?',
      },
      {
        id: 'sb-2',
        goal: 'Check their capacity',
        text: 'You are pretty far along. I am not comfortable doing this tonight — let us get water.',
      },
      {
        id: 'sb-3',
        goal: 'Shrink the scope instead of stopping',
        text: 'Tonight stays at making out. That is the version of this I can consent to right now.',
      },
    ],
  },
  {
    id: 'post-breach',
    title: 'Post-Breach',
    description: 'A barrier failed or an exposure happened',
    pieces: ['T', 'M', 'A'],
    group: 'field',
    lines: [
      {
        id: 'pb-1',
        goal: 'Stop and say it immediately',
        text: 'Stop — it broke. I need a minute to sort out what happens next.',
      },
      {
        id: 'pb-2',
        goal: 'Get the facts you need',
        text: 'I have to ask directly: what is your status and when were you last tested?',
      },
      {
        id: 'pb-3',
        goal: 'Start the PEP clock',
        text: 'I am going to the nearest emergency department for urgent PEP evaluation. PEP must start within 72 hours and sooner is better.',
      },
      {
        id: 'pb-4',
        goal: 'Book follow-up testing',
        text: 'Which tests do I need now, and when should I repeat them based on my exposure and medications?',
      },
    ],
  },
  {
    id: 'clinic-testing',
    title: 'Clinic: Testing',
    description: 'Asking for a full STI screen',
    pieces: ['A'],
    group: 'clinic',
    lines: [
      {
        id: 'ct-1',
        goal: 'Ask for the full panel',
        text: 'I would like HIV and syphilis testing, plus gonorrhea and chlamydia testing at my exposure sites. Please discuss hepatitis B and test for hepatitis C by name.',
      },
      {
        id: 'ct-2',
        goal: 'Ask for site-specific swabs',
        text: 'Please include throat and rectal swabs, not just urine — that is where mine would show up.',
      },
      {
        id: 'ct-3',
        goal: 'Confirm how results arrive',
        text: 'How and when do I get results, and who else can see them?',
      },
    ],
  },
  {
    id: 'clinic-prep',
    title: 'Clinic: PrEP',
    description: 'Requesting PrEP from a provider',
    pieces: ['M'],
    group: 'clinic',
    lines: [
      {
        id: 'cp-1',
        goal: 'Ask directly',
        text: 'I want to start PrEP. What labs do you need before you can prescribe it?',
      },
      {
        id: 'cp-2',
        goal: 'Compare the options',
        text: 'Can we compare daily oral PrEP, cabotegravir every two months, and twice-yearly lenacapavir (Yeztugo), including monitoring and how each fits my routine?',
      },
      {
        id: 'cp-3',
        goal: 'Handle a cost objection',
        text: 'If cost is the barrier, which assistance programme does this clinic work with?',
      },
    ],
  },
  {
    id: 'clinic-doxypep',
    title: 'Clinic: Doxy-PEP',
    description: 'Requesting a Doxy-PEP prescription',
    pieces: ['M'],
    group: 'clinic',
    lines: [
      {
        id: 'cd-1',
        goal: 'Make the ask',
        text: 'I would like a standing Doxy-PEP prescription to keep on hand.',
      },
      {
        id: 'cd-2',
        goal: 'Confirm the dosing window',
        text: 'Confirm the dose and how quickly after exposure I need to take it.',
      },
      {
        id: 'cd-3',
        goal: 'Ask about eligibility',
        text: 'If I am not eligible, what would change that?',
      },
      {
        id: 'cd-4',
        goal: 'Ask about interactions',
        text: 'Does this interact with anything else I am taking?',
      },
    ],
  },
  {
    id: 'clinic-pep',
    title: 'Clinic: PEP Emergency',
    description: 'Urgent PEP request after exposure',
    pieces: ['M'],
    group: 'clinic',
    lines: [
      {
        id: 'ce-1',
        goal: 'Say it out loud',
        text: 'I need to be evaluated for PEP.',
      },
      {
        id: 'ce-2',
        goal: 'Escalate if stalled',
        text: 'This is time-sensitive. If you cannot start it here, who can, and can you call ahead?',
      },
    ],
  },
  {
    id: 'clinic-hiv',
    title: 'Clinic: Living with HIV',
    description: 'Ongoing treatment maintenance visit',
    pieces: ['M', 'H'],
    group: 'clinic',
    lines: [
      {
        id: 'ch-1',
        goal: 'Review the numbers',
        text: 'Walk me through my viral load and CD4 trend since the last visit.',
      },
      {
        id: 'ch-2',
        goal: 'Fix adherence friction',
        text: 'I miss doses on weekends. Is there a regimen or reminder setup that fits that better?',
      },
    ],
  },
  {
    id: 'clinic-judgment',
    title: 'Clinic: Handling Judgment',
    description: 'The provider is dismissive or moralising',
    pieces: ['C', 'H'],
    group: 'clinic',
    lines: [
      {
        id: 'cj-1',
        goal: 'Redirect to the request',
        text: 'I am not here for advice on my choices. I am here for a screen and a prescription.',
      },
      {
        id: 'cj-2',
        goal: 'Name it calmly',
        text: 'That comment felt like judgment. Can we stick to clinical questions?',
      },
      {
        id: 'cj-3',
        goal: 'Get the refusal on record',
        text: 'If you are declining to prescribe, please note the reason in my chart.',
      },
      {
        id: 'cj-4',
        goal: 'Ask for a different clinician',
        text: 'I would like to see another provider today.',
      },
      {
        id: 'cj-5',
        goal: 'Restate your authority',
        text: 'I know my own risk. I need a clinician who will work with it.',
      },
      {
        id: 'cj-6',
        goal: 'Leave and re-book',
        text: 'This is not working. I will get this done somewhere else.',
      },
    ],
  },
];

export interface EmergencyProtocol {
  id: string;
  title: string;
  subtitle: string;
  piece: PieceKey;
  clock: string | null;
  steps: string[];
  avoid: string[];
}

export const EMERGENCY_PROTOCOLS: EmergencyProtocol[] = [
  {
    id: 'barrier-broke',
    title: 'Barrier Broke',
    subtitle: 'A condom slipped, tore, or failed',
    piece: 'T',
    clock: 'PEP window: 72 hours, sooner is better',
    steps: [
      'Stop and separate. Do not keep going with a failed barrier.',
      'Do not douche or scrub internally — it can increase irritation and risk.',
      'Ask the partner directly for status and last test date.',
      'If HIV exposure is possible, go to the nearest emergency department now for urgent PEP evaluation.',
      'If you have Doxy-PEP, take it inside the recommended window.',
      'Book testing at two weeks and again at six weeks.',
    ],
    avoid: ['Waiting until morning to decide', 'Assuming one failure does not count'],
  },
  {
    id: 'missed-dose',
    title: 'Missed Dose',
    subtitle: 'You skipped PrEP or treatment',
    piece: 'M',
    clock: 'Act at the next dose slot',
    steps: [
      'Take the missed dose as soon as you remember, unless the next one is nearly due.',
      'Never double up to catch up.',
      'Count how many doses you have missed this week — that determines your coverage.',
      'If it is more than two in a row, treat yourself as unprotected until you speak to a prescriber.',
      'Add barriers for any encounter in the gap.',
      'Set an automated reminder before you close the app.',
    ],
    avoid: ['Guessing at your coverage', 'Silently stopping the medication'],
  },
  {
    id: 'boundary-pushed',
    title: 'Boundary Pushed',
    subtitle: 'Someone pressured or crossed your line',
    piece: 'C',
    clock: null,
    steps: [
      'Say the boundary once more, in a short flat sentence.',
      'If it is repeated, stop treating it as a misunderstanding.',
      'Move toward a door, a window, or other people.',
      'Message your safety contact with your location.',
      'Leave. You do not owe an explanation or an exit conversation.',
      'Afterwards, write down what happened while it is fresh.',
    ],
    avoid: ['Explaining yourself repeatedly', 'Staying to keep the peace'],
  },
  {
    id: 'status-unknown',
    title: 'Status Unknown',
    subtitle: 'You do not know their status',
    piece: 'A',
    clock: null,
    steps: [
      'Ask plainly: last test date, and what was screened.',
      'Treat "I am clean" as no information — it is not a result.',
      'If there is no answer, default to full barriers for everything.',
      'Keep the encounter to lower-risk activity.',
      'Book your own screen regardless of how tonight goes.',
    ],
    avoid: ['Reading confidence as evidence', 'Skipping barriers to avoid awkwardness'],
  },
  {
    id: 'no-supplies',
    title: 'No Supplies',
    subtitle: 'You are out of condoms or lube',
    piece: 'H',
    clock: null,
    steps: [
      'Do not substitute improvised barriers or oil-based lubricants with latex.',
      'Check 24-hour pharmacies, corner shops, and vending machines nearby.',
      'Many clinics and community organisations hand out free supplies.',
      'If nothing is available, shift to activities that do not need a barrier.',
      'Restock tomorrow and set a recurring reminder so this does not repeat.',
    ],
    avoid: ['Reusing a condom', 'Deciding "just this once"'],
  },
];

export interface HotlineEntry {
  label: string;
  value: string;
  note: string;
}

export const HOTLINES: HotlineEntry[] = [
  { label: 'Crisis Text Line', value: '741741', note: 'Text HOME to reach a crisis counsellor' },
  { label: 'Emergency services', value: '911', note: 'Immediate danger or medical emergency' },
];

export interface ResourceTip {
  title: string;
  body: string;
}

export interface ResourceGroup {
  piece: PieceKey;
  tips: ResourceTip[];
  links: { label: string; url: string }[];
}

export const RESOURCE_GROUPS: ResourceGroup[] = [
  {
    piece: 'M',
    tips: [
      {
        title: 'PrEP is not instant',
        body: 'Oral PrEP needs several days of dosing before it reaches protective levels. Use barriers while you ramp up.',
      },
      {
        title: 'PEP is an emergency, not an appointment',
        body: 'Go to the nearest emergency department now for urgent PEP evaluation. PEP must start as soon as possible, within 72 hours. Do not wait for a phone consultation or an appointment.',
      },
      {
        title: 'Undetectable means untransmittable',
        body: 'Sustained viral suppression prevents sexual HIV transmission. It does not cover other STIs.',
      },
      {
        title: 'Doxy-PEP targets bacteria only',
        body: CLINICAL_BRIEFINGS.doxy,
      },
      {
        title: 'Keep a refill buffer',
        body: 'Request refills at the one-week-remaining mark so a pharmacy delay never becomes a coverage gap.',
      },
      {
        title: 'Vaccines add a layer',
        body: CLINICAL_BRIEFINGS.vaccines,
      },
      { title: 'Hepatitis C: ask by name', body: CLINICAL_BRIEFINGS.hepatitisC },
      { title: 'PrEP formats', body: CLINICAL_BRIEFINGS.prep },
      { title: 'PrEP and gender-affirming care', body: CLINICAL_BRIEFINGS.hormones },
    ],
    links: [
      { label: 'CDC — HIV prevention', url: 'https://www.cdc.gov/hiv/basics/prevention.html' },
      { label: 'Find PrEP near you', url: 'https://preplocator.org' },
    ],
  },
  {
    piece: 'A',
    tips: [
      {
        title: 'Test by site, not just by blood',
        body: CLINICAL_BRIEFINGS.sites,
      },
      {
        title: 'Every three months is a baseline',
        body: 'If you have multiple or new partners, quarterly screening is the standard cadence.',
      },
      {
        title: 'Windows matter',
        body: CLINICAL_BRIEFINGS.windows,
      },
      {
        title: '"Clean" is not a status',
        body: 'Ask for a date and a list of what was screened. That is the only usable answer.',
      },
      {
        title: 'Keep your own record',
        body: 'Store your last test date somewhere you can read it out loud in ten seconds.',
      },
    ],
    links: [
      { label: 'Find a testing site', url: 'https://gettested.cdc.gov' },
      { label: 'CDC — STI screening guidance', url: 'https://www.cdc.gov/std/treatment/' },
    ],
  },
  {
    piece: 'T',
    tips: [
      {
        title: 'Fit beats willpower',
        body: 'Width, not length, decides comfort. A correctly sized condom is far less likely to be abandoned mid-encounter.',
      },
      {
        title: 'Oil destroys latex',
        body: 'Lotion, coconut oil, and petroleum jelly all weaken latex. Use water or silicone based lube.',
      },
      {
        title: 'Heat and wallets kill condoms',
        body: 'Glove boxes and back pockets degrade them. Store in a cool, flat, dark place.',
      },
      {
        title: 'Add lube inside and out',
        body: 'Most breakage is friction. A few drops on both sides reduces both breakage and numbness.',
      },
      { title: 'Condom materials matter', body: CLINICAL_BRIEFINGS.lambskin },
      { title: 'The pregnancy layer', body: CLINICAL_BRIEFINGS.pregnancy },
      {
        title: 'Toys and sharing',
        body: 'Change barriers between partners and body sites. Clean toys according to their manufacturer’s instructions; check silicone-lube compatibility with silicone toys. Avoid sharing porous toys that cannot be reliably cleaned.',
      },
      { title: 'Blood is its own category', body: CLINICAL_BRIEFINGS.blood },
      {
        title: 'Carry a duplicate kit',
        body: 'One kit at home helps only at home. Keep a second in the bag you always take out.',
      },
    ],
    links: [
      { label: 'CDC — condom effectiveness', url: 'https://www.cdc.gov/condomeffectiveness/' },
    ],
  },
  {
    piece: 'C',
    tips: [
      {
        title: 'Rehearse before you need it',
        body: 'Under arousal or pressure you will use whatever sentence is already loaded. Load a good one.',
      },
      { title: 'Disclosure: fact, science, door', body: CLINICAL_BRIEFINGS.disclosure },
      {
        title: 'Go first',
        body: 'Disclosing your own status and test date first makes the other person far more likely to answer honestly.',
      },
      {
        title: 'Boundaries are conditions, not offers',
        body: 'State them as facts. Framing them as requests invites negotiation.',
      },
      {
        title: 'Use FRIES for consent',
        body: 'Freely given, reversible, informed, enthusiastic, specific. If one is missing, stop.',
      },
      {
        title: 'One repeat, then exit',
        body: 'Say the boundary twice at most. A third ask is information about them, not a misunderstanding.',
      },
    ],
    links: [
      {
        label: 'Planned Parenthood — consent',
        url: 'https://www.plannedparenthood.org/learn/relationships/sexual-consent',
      },
      { label: 'RAINN support', url: 'https://www.rainn.org' },
    ],
  },
  {
    piece: 'H',
    tips: [
      {
        title: 'Automate what you will forget',
        body: 'Recurring alarms outperform intention. Put doses, refills, and testing on a calendar.',
      },
      {
        title: 'Restock on a date, not on empty',
        body: 'Pick a day each month to count supplies. Running out is a scheduling failure, not bad luck.',
      },
      {
        title: 'Decide substance rules sober',
        body: 'Set your line while clear-headed, then treat it as non-negotiable later.',
      },
      {
        title: 'Tell one person your plans',
        body: 'A safety contact expecting a check-out text changes your options if something goes wrong.',
      },
      {
        title: 'Review weekly, not yearly',
        body: 'A five-item weekly sweep keeps small gaps from compounding into a crisis.',
      },
    ],
    links: [{ label: 'CDC — sexual health basics', url: 'https://www.cdc.gov/sexualhealth/' }],
  },
];

export interface Clinic {
  id: string;
  name: string;
  kind: 'pep' | 'prep' | 'testing' | 'clinic' | 'pharmacy';
  distance: string;
  hours: string;
  services: string[];
  phone: string;
  address: string;
  latitude: number;
  longitude: number;
  slidingScale: boolean;
}

export const CLINIC_KINDS: { id: Clinic['kind']; label: string; emoji: string }[] = [
  { id: 'pep', label: 'PEP / Emergency', emoji: '🚨' },
  { id: 'prep', label: 'PrEP Provider', emoji: '💊' },
  { id: 'testing', label: 'STI Testing', emoji: '🧪' },
  { id: 'clinic', label: 'Sexual Health Clinic', emoji: '🏥' },
  { id: 'pharmacy', label: 'Pharmacy', emoji: '🏪' },
];

export const CLINICS: Clinic[] = [
  {
    id: 'c1',
    name: 'County General Emergency Department',
    kind: 'pep',
    distance: '1.2 mi',
    hours: 'Open 24 hours',
    services: ['PEP within 72h', 'Emergency care', 'On-site pharmacy'],
    phone: '1-555-0140',
    address: '1200 Harbor Blvd',
    latitude: 29.7101,
    longitude: -95.3982,
    slidingScale: false,
  },
  {
    id: 'c2',
    name: 'Northside Sexual Health Center',
    kind: 'clinic',
    distance: '2.4 mi',
    hours: 'Mon–Sat, 8:00–19:00',
    services: ['PrEP', 'Doxy-PEP', 'Full STI panel', 'Walk-ins'],
    phone: '1-555-0162',
    address: '48 Grant Street',
    latitude: 29.7604,
    longitude: -95.3698,
    slidingScale: true,
  },
  {
    id: 'c3',
    name: 'Riverside Community Testing',
    kind: 'testing',
    distance: '3.1 mi',
    hours: 'Tue–Fri, 10:00–18:00',
    services: ['Rapid HIV', 'Site-specific swabs', 'Free supplies'],
    phone: '1-555-0173',
    address: '905 River Road',
    latitude: 29.7452,
    longitude: -95.4102,
    slidingScale: true,
  },
  {
    id: 'c4',
    name: 'Eastgate PrEP Clinic',
    kind: 'prep',
    distance: '4.0 mi',
    hours: 'Mon–Fri, 9:00–17:00',
    services: ['Daily PrEP', 'Injectable PrEP', 'Insurance navigation'],
    phone: '1-555-0189',
    address: '77 Eastgate Plaza',
    latitude: 29.7712,
    longitude: -95.3355,
    slidingScale: true,
  },
  {
    id: 'c5',
    name: 'Meridian Pharmacy — 24h',
    kind: 'pharmacy',
    distance: '0.6 mi',
    hours: 'Open 24 hours',
    services: ['Condoms & lube', 'PrEP refills', 'Pharmacist consults'],
    phone: '1-555-0117',
    address: '15 Meridian Ave',
    latitude: 29.7288,
    longitude: -95.3854,
    slidingScale: false,
  },
  {
    id: 'c6',
    name: 'Southbank Youth Health Hub',
    kind: 'clinic',
    distance: '5.3 mi',
    hours: 'Mon–Thu, 12:00–20:00',
    services: ['Confidential care 18+', 'PrEP', 'Counselling'],
    phone: '1-555-0196',
    address: '310 Southbank Way',
    latitude: 29.6981,
    longitude: -95.3521,
    slidingScale: true,
  },
];

export interface StressScenario {
  id: string;
  title: string;
  setup: string;
  /** Pieces that carry the load if they are armed. */
  compensators: PieceKey[];
  /** Pieces whose absence hurts most here. */
  critical: PieceKey[];
  fallback: string;
}

export const STRESS_SCENARIOS: StressScenario[] = [
  {
    id: 's1',
    title: 'Barrier failure at 2am',
    setup: 'The condom tears mid-encounter with a partner whose status you never confirmed.',
    compensators: ['M', 'A'],
    critical: ['M'],
    fallback: 'A medication layer is what absorbs a tool failure. Barriers alone have no backup.',
  },
  {
    id: 's2',
    title: 'Two missed doses',
    setup: 'You realise you have skipped your last two doses and a planned encounter is tonight.',
    compensators: ['T', 'C', 'H'],
    critical: ['T'],
    fallback: 'When medication coverage drops, barriers and a clear conversation carry the night.',
  },
  {
    id: 's3',
    title: 'Supplies gone, plans on',
    setup: 'You get to their place and your kit is empty. Nothing is open nearby.',
    compensators: ['M', 'C', 'H'],
    critical: ['C'],
    fallback: 'Without tools, the deciding factor is whether you can renegotiate the activity.',
  },
  {
    id: 's4',
    title: 'Escalating pressure',
    setup: 'A partner keeps pushing to skip the barrier and frames your boundary as distrust.',
    compensators: ['C', 'H'],
    critical: ['C'],
    fallback: 'A rehearsed line and a rehearsed exit are the only things that work in real time.',
  },
  {
    id: 's5',
    title: 'Impaired judgment',
    setup: 'Several hours of drinking later, a new partner suggests going home with them.',
    compensators: ['H', 'M', 'C'],
    critical: ['H'],
    fallback: 'A rule you set sober is the only reliable decision-maker at this point.',
  },
  {
    id: 's6',
    title: 'Status disclosed mid-encounter',
    setup: 'A partner discloses a positive STI result after things have already started.',
    compensators: ['M', 'A', 'C'],
    critical: ['A'],
    fallback: 'Knowing what testing and treatment to request next is what turns this into a plan.',
  },
  {
    id: 's7',
    title: 'Travel with no clinic map',
    setup: 'You are three time zones from home, out of medication, and unsure where to go.',
    compensators: ['H', 'A'],
    critical: ['H'],
    fallback: 'A refill buffer and a saved clinic list are what make travel a non-event.',
  },
  {
    id: 's8',
    title: 'Group setting, low privacy',
    setup:
      'A party turns into a situation with less privacy and more improvisation than you expected.',
    compensators: ['T', 'C', 'H'],
    critical: ['C'],
    fallback:
      'Pre-decided limits are what keep an unplanned setting from making the decision for you.',
  },
];

export interface RiskQuestion {
  id: string;
  piece: PieceKey;
  prompt: string;
  options: { label: string; points: number }[];
}

export const RISK_QUESTIONS: RiskQuestion[] = [
  {
    id: 'q1',
    piece: 'M',
    prompt: 'Are you currently taking a preventive or suppressive medication?',
    options: [
      { label: 'Yes, consistently', points: 0 },
      { label: 'Yes, but I miss doses', points: 6 },
      { label: 'No', points: 14 },
    ],
  },
  {
    id: 'q2',
    piece: 'M',
    prompt:
      'PEP readiness drill: Save a 24-hour access point from locator.hiv.gov. Verify that it is open 24 hours and can evaluate you for PEP. Say “I need to be evaluated for PEP” out loud. Have you done both?',
    options: [
      { label: 'Yes, saved and rehearsed', points: 0 },
      { label: 'Only one step done', points: 5 },
      { label: 'Not yet', points: 10 },
    ],
  },
  {
    id: 'q3',
    piece: 'A',
    prompt: 'When was your last full STI screen?',
    options: [
      { label: 'Within 3 months', points: 0 },
      { label: '3–12 months ago', points: 6 },
      { label: 'Over a year, or never', points: 12 },
    ],
  },
  {
    id: 'q4',
    piece: 'A',
    prompt: 'Do you ask new partners for a test date before sex?',
    options: [
      { label: 'Always', points: 0 },
      { label: 'Sometimes', points: 5 },
      { label: 'Rarely', points: 10 },
    ],
  },
  {
    id: 'q5',
    piece: 'T',
    prompt: 'How often are barriers used with new partners?',
    options: [
      { label: 'Every time', points: 0 },
      { label: 'Most times', points: 6 },
      { label: 'Occasionally or never', points: 12 },
    ],
  },
  {
    id: 'q6',
    piece: 'T',
    prompt: 'Do you carry supplies with you when going out?',
    options: [
      { label: 'Yes, always', points: 0 },
      { label: 'Only if I plan to', points: 4 },
      { label: 'No', points: 8 },
    ],
  },
  {
    id: 'q7',
    piece: 'C',
    prompt: 'Have you stated your boundaries out loud to a partner in the last month?',
    options: [
      { label: 'Yes', points: 0 },
      { label: 'I meant to', points: 5 },
      { label: 'No', points: 9 },
    ],
  },
  {
    id: 'q8',
    piece: 'C',
    prompt: 'If someone pushed past a boundary, do you know exactly what you would say?',
    options: [
      { label: 'Yes, word for word', points: 0 },
      { label: 'Roughly', points: 5 },
      { label: 'No', points: 9 },
    ],
  },
  {
    id: 'q9',
    piece: 'H',
    prompt: 'How often do substances affect your decisions around sex?',
    options: [
      { label: 'Never', points: 0 },
      { label: 'Occasionally', points: 6 },
      { label: 'Often', points: 11 },
    ],
  },
  {
    id: 'q10',
    piece: 'H',
    prompt: 'Do you have reminders for doses, refills, or testing?',
    options: [
      { label: 'Yes, automated', points: 0 },
      { label: 'I rely on memory', points: 5 },
      { label: 'Nothing in place', points: 9 },
    ],
  },
];

export interface RelationshipFramework {
  id: string;
  emoji: string;
  category: string;
  title: string;
  description: string;
  motto: string;
  tools: { name: string; detail: string }[];
  accent: string;
}

export const RELATIONSHIP_FRAMEWORKS: RelationshipFramework[] = [
  {
    id: 'monogamous',
    emoji: '🔵',
    category: 'Monogamous Agreements',
    title: 'The Trust Bubble',
    description:
      'Exclusivity only protects you if it is defined out loud, tested at the start, and re-confirmed on a schedule.',
    motto: 'Clarity beats assumption.',
    tools: [
      {
        name: 'Shared testing ritual',
        detail: 'Both partners screen before dropping barriers, and again on an agreed interval.',
      },
      {
        name: 'Exclusivity, defined',
        detail: 'Name what counts and what does not. Assumed definitions are where breaches hide.',
      },
      {
        name: 'Monthly bubble check',
        detail: 'A short, unsentimental conversation: has anything changed?',
      },
      {
        name: 'Repair plan',
        detail: 'Agree in advance what happens if the agreement breaks, before it does.',
      },
    ],
    accent: MATCH_COLOR.A,
  },
  {
    id: 'casual',
    emoji: '🟡',
    category: 'Casual Encounters',
    title: 'The One-Night Shield',
    description:
      'Short encounters need pre-loaded defaults, because there is no time to invent a policy in the moment.',
    motto: 'Casual is not careless.',
    tools: [
      { name: 'Portable barrier kit', detail: 'Supplies leave the house with you, every time.' },
      {
        name: 'Disclosure opener',
        detail: 'A single sentence you always lead with, so it never gets skipped.',
      },
      {
        name: 'FRIES consent check',
        detail: 'A fast run through freely given, reversible, informed, enthusiastic, specific.',
      },
      {
        name: 'Aftercare pass',
        detail: 'Water, testing date, and a note on how it actually felt.',
      },
    ],
    accent: MATCH_COLOR.C,
  },
  {
    id: 'open',
    emoji: '🔴',
    category: 'Open & Poly',
    title: 'The Compass of Connection',
    description:
      'Multiple concurrent partners multiply the information flow. The framework is transparency infrastructure.',
    motto: 'Navigate with honesty, not secrecy.',
    tools: [
      {
        name: 'Safer-sex menu',
        detail: 'A written list of what is on and off the table with which partners.',
      },
      {
        name: 'Status dashboard',
        detail: 'Everyone knows the current testing cadence across the network.',
      },
      {
        name: 'Disclosure agreements',
        detail: 'Who gets told what, and how fast, when something changes.',
      },
      {
        name: 'Emotional boundaries',
        detail: 'Capacity limits named as clearly as physical ones.',
      },
    ],
    accent: MATCH_COLOR.T,
  },
  {
    id: 'solo',
    emoji: '🟣',
    category: 'Solo & Intentional',
    title: 'The Sovereign Standard',
    description:
      'Whether you are dating, on a break, or deliberately single, your standard should not depend on who is asking.',
    motto: 'My standard travels with me.',
    tools: [
      {
        name: 'Non-negotiables list',
        detail: 'Three lines that never move, regardless of chemistry.',
      },
      {
        name: 'Solo testing cadence',
        detail: 'Screening on your calendar, not on a partner’s prompt.',
      },
      {
        name: 'Re-entry checklist',
        detail: 'What has to be true before you become sexually active again.',
      },
      {
        name: 'Personal debrief',
        detail: 'A short reflection after encounters to catch drift early.',
      },
    ],
    accent: GHOST_COLOR.internal,
  },
];

export const AFFIRMATIONS: Record<'morning' | 'midday' | 'evening' | 'night', string[]> = {
  morning: [
    'My plan exists before the moment does.',
    'Protecting myself is not an insult to anyone.',
    'I get to be both wanted and careful.',
    'Today my boundaries are conditions, not requests.',
  ],
  midday: [
    'A boundary said plainly is a kindness to both of us.',
    'I do not owe anyone access to my body.',
    'I can want someone and still say not like this.',
    'Curiosity about my own limits is not weakness.',
  ],
  evening: [
    'Decisions I make sober are the ones I trust.',
    'Leaving early is a valid outcome.',
    'I check in before I check out.',
    'My comfort is data, not drama.',
  ],
  night: [
    'Nothing tonight is more urgent than my safety.',
    'I can pause anything, at any point, for any reason.',
    'The people worth my time do not need convincing.',
    'I end the day with my standard intact.',
  ],
};

export interface RitualCard {
  id: string;
  title: string;
  category: string;
  window: string;
  accent: string;
  prompt: string;
  practice: string[];
}

export const RITUAL_CARDS: RitualCard[] = [
  {
    id: 'mirror',
    title: 'Mirror Card',
    category: 'Energy & Readiness',
    window: '🌅 Morning ritual',
    accent: MATCH_COLOR.C,
    prompt: 'What kind of yes am I actually available for today?',
    practice: [
      'Name your energy level out of ten.',
      'Decide now what you are not up for tonight.',
      'Check one supply or one dose before you leave.',
    ],
  },
  {
    id: 'boundary-garden',
    title: 'Boundary Garden',
    category: 'Consent & Boundaries',
    window: '☀️ Midday ritual',
    accent: HUD,
    prompt: 'Which boundary needs tending rather than defending?',
    practice: [
      'Pick one limit you softened recently.',
      'Rewrite it as a flat statement.',
      'Say it out loud once, so it exists in your mouth.',
    ],
  },
  {
    id: 'trust-tree',
    title: 'Trust Tree',
    category: 'Trust & Connection',
    window: '🌙 Evening ritual',
    accent: GHOST_COLOR.relational,
    prompt: 'Who in my life would I actually call at 3am?',
    practice: [
      'Name one person on your safety network.',
      'Confirm their number is current in your contacts.',
      'Tell them roughly what your week looks like.',
    ],
  },
];
