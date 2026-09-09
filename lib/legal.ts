/**
 * MATCH Flow — Legal & Compliance content.
 *
 * These are working drafts written to match how this app actually behaves
 * (local-first storage, no accounts, no server sync). Edit the constants below
 * once and every document picks up the change. Have a licensed attorney in your
 * operating jurisdiction review the text before public release.
 */

import { GHOST_COLOR, HUD, MATCH_COLOR } from '@/lib/palette';

export type LegalDocId = 'terms' | 'privacy' | 'medical' | 'safety' | 'accessibility';

export type LegalIconKey = 'document' | 'lock' | 'stethoscope' | 'shield' | 'eye';

export interface LegalSection {
  heading: string;
  body?: string;
  bullets?: string[];
}

export interface LegalDocument {
  id: LegalDocId;
  title: string;
  /** One-line summary shown on the index row. */
  summary: string;
  icon: LegalIconKey;
  accent: string;
  intro: string;
  sections: LegalSection[];
}

/** Single source of truth for the identifying details used across all documents. */
export const LEGAL_ENTITY = 'MATCH Flow';
export const LEGAL_CONTACT_EMAIL = 'legal@matchflow.app';
export const LEGAL_PRIVACY_EMAIL = 'privacy@matchflow.app';
export const LEGAL_ACCESSIBILITY_EMAIL = 'access@matchflow.app';
export const LEGAL_GOVERNING_LAW = 'the State of Delaware, United States';
export const LEGAL_LAST_UPDATED = 'August 5, 2026';
export const LEGAL_VERSION = '1.0';

export const LEGAL_DOCUMENTS: LegalDocument[] = [
  {
    id: 'terms',
    title: 'Terms of Service',
    summary: 'EULA, license, prohibited conduct, purchases',
    icon: 'document',
    accent: GHOST_COLOR.internal,
    intro: `These Terms of Service ("Terms") are a binding agreement between you and ${LEGAL_ENTITY} ("we", "us") covering your use of the ${LEGAL_ENTITY} mobile and web application (the "App"). By installing, opening, or continuing to use the App you accept these Terms. If you do not accept them, delete the App.`,
    sections: [
      {
        heading: '1. Eligibility',
        body: 'The App is intended for adults only. You must be at least 18 years old, or the age of majority where you live if that is higher. The App discusses adult sexual health in explicit, clinical language. The consent gate you complete on first launch records your confirmation of age and of the educational nature of the App; that confirmation is stored only on your device.',
      },
      {
        heading: '2. Licence grant',
        body: 'We grant you a personal, limited, revocable, non-exclusive, non-transferable, non-sublicensable licence to install and use one copy of the App on devices you own or control, for your own non-commercial use. All rights not expressly granted are reserved.',
      },
      {
        heading: '3. Licence restrictions',
        body: 'You may not:',
        bullets: [
          'copy, modify, translate, or create derivative works of the App except as permitted by applicable law;',
          'reverse engineer, decompile, or disassemble the App, or attempt to extract its source code, except to the limited extent that this restriction is prohibited by law;',
          'rent, lease, lend, sell, sublicense, or redistribute the App or your account credentials for any paid feature;',
          'remove or obscure any proprietary notice, watermark, or attribution;',
          'use the App to build a competing product or to train a machine-learning model on its content;',
          'circumvent any usage limit, paywall, or technical protection measure.',
        ],
      },
      {
        heading: '4. What the App is, and is not',
        body: 'The App is an educational and organisational tool. It helps you plan, rehearse, and record your own sexual-health practices across five layers — Medications, Awareness, Tools, Communication, Habits. It is not a medical device, not a diagnostic tool, not a source of medical advice, and not a substitute for a clinician, a laboratory test, or emergency services. Using the App creates no clinician-patient, counsellor-client, or professional relationship of any kind. See the Medical Disclaimer for full detail.',
      },
      {
        heading: '5. Prohibited conduct',
        body: 'You agree not to use the App:',
        bullets: [
          'to harass, coerce, deceive, pressure, or endanger another person;',
          'to record, share, or disclose another person’s health status, test results, or sexual history without their explicit, freely given consent;',
          'to misrepresent your own status, test history, or protective measures to a partner;',
          'to make clinical decisions for another person, or to present App content as a professional medical opinion;',
          'in any way that violates applicable law, including laws on public health reporting, consent, and non-disclosure of status;',
          'to interfere with, disrupt, or overload any service the App relies on.',
        ],
      },
      {
        heading: '6. Your content and your data',
        body: 'Everything you type into the App — plans, scripts, session logs, check-ins, contacts, notes — is written to your device’s local storage. We do not host it, back it up, or have any means of retrieving it. You are solely responsible for that content, for keeping your device secure, and for any backup you choose to make. Deleting the App, or using "Wipe all local data" in Settings, destroys that content permanently. We cannot restore it.',
      },
      {
        heading: '7. Purchases and subscriptions',
        body: 'Any paid feature is sold and billed through the platform store that distributed your copy of the App (Apple App Store or Google Play). We never see or store your payment card details.',
        bullets: [
          'Prices are shown in the store before you confirm and may vary by region and over time.',
          'Subscriptions renew automatically for the same term until you cancel. Cancel at least 24 hours before the period ends to avoid the next charge.',
          'Manage or cancel a subscription in your platform account settings, not in the App. We cannot cancel it for you.',
          'Refunds are handled entirely by the platform store under its own policy. We have no ability to issue, deny, or expedite a store refund.',
          'One-time purchases and any promotional credit have no cash value and are not transferable between platforms or accounts.',
          'If a paid feature is discontinued, we will make a reasonable effort to give advance notice in the App.',
        ],
      },
      {
        heading: '8. Intellectual property',
        body: 'The App, its interface, its written educational content, its artwork including the MATCH puzzle lockup, and its name and marks are owned by us or our licensors and are protected by copyright, trademark, and other laws. Third-party medical guidance summarised in the App remains the property of its authors and is used for reference and education only.',
      },
      {
        heading: '9. Changes to the App and to these Terms',
        body: 'We may add, change, or remove features at any time. We may revise these Terms; when we do, we will update the "last updated" date shown in the App. Material changes will be surfaced in the App before they take effect. Continuing to use the App after a revision means you accept the revised Terms.',
      },
      {
        heading: '10. Termination',
        body: 'This licence ends automatically if you breach these Terms, and ends whenever you delete the App. On termination you must stop using the App. Sections 8, 11, 12, 13, and 15 survive termination.',
      },
      {
        heading: '11. Disclaimer of warranties',
        body: 'The App is provided "as is" and "as available", without warranty of any kind. To the fullest extent permitted by law we disclaim all warranties, express or implied, including merchantability, fitness for a particular purpose, non-infringement, and any warranty that the App will be uninterrupted, error-free, medically accurate, complete, or current. Some jurisdictions do not allow the exclusion of certain warranties, so parts of this section may not apply to you.',
      },
      {
        heading: '12. Limitation of liability',
        body: 'To the fullest extent permitted by law, we are not liable for any indirect, incidental, special, consequential, exemplary, or punitive damages, nor for lost data, lost profits, personal injury, illness, transmission of infection, or emotional distress arising from your use of or reliance on the App. Our total aggregate liability for all claims relating to the App will not exceed the greater of the amount you paid us in the twelve months before the claim, or twenty-five US dollars (USD 25). Nothing in these Terms limits liability that cannot lawfully be limited, including liability for fraud, gross negligence, or death or personal injury caused by our negligence.',
      },
      {
        heading: '13. Indemnity',
        body: 'You agree to indemnify and hold us harmless from any claim, demand, loss, or expense, including reasonable legal fees, arising from your misuse of the App, your breach of these Terms, or your disclosure of another person’s information without their consent.',
      },
      {
        heading: '14. Platform terms',
        body: 'These Terms are between you and us, not with Apple or Google. Those platforms have no obligation to provide support for the App. Apple and Google are third-party beneficiaries of these Terms and may enforce them. You confirm you are not located in a country subject to a US embargo and are not on a prohibited-party list.',
      },
      {
        heading: '15. Governing law and disputes',
        body: `These Terms are governed by the laws of ${LEGAL_GOVERNING_LAW}, without regard to conflict-of-law rules, except where mandatory consumer protection law in your country of residence applies. Before filing any claim, contact us at ${LEGAL_CONTACT_EMAIL} and give us 30 days to resolve the issue informally. If it cannot be resolved, the dispute will be heard in the courts of that jurisdiction, unless the law of your residence gives you the right to bring proceedings locally.`,
      },
      {
        heading: '16. Miscellaneous',
        body: 'If a provision is found unenforceable, the rest remain in effect. Our failure to enforce a provision is not a waiver of it. These Terms, together with the Privacy Policy and Medical Disclaimer, are the entire agreement between us about the App.',
      },
      {
        heading: '17. Contact',
        body: `Questions about these Terms: ${LEGAL_CONTACT_EMAIL}.`,
      },
    ],
  },
  {
    id: 'privacy',
    title: 'Privacy Policy',
    summary: 'Zero Stigma Tax model, CCPA, GDPR, COPPA',
    icon: 'lock',
    accent: MATCH_COLOR.H,
    intro: `${LEGAL_ENTITY} is built local-first. There is no account, no login, no profile, and no server that stores what you write. This policy explains what that means in practice and what rights you have under GDPR, CCPA/CPRA, and other privacy laws.`,
    sections: [
      {
        heading: 'The Zero Stigma Tax model',
        body: 'Sexual-health apps usually charge a hidden price: you hand over the most stigmatising data you have in exchange for a feature. We refuse that trade. Our design rule is that no sensitive detail you enter may leave your device. That is what we call the Zero Stigma Tax model, and it is enforced by architecture rather than by promise — there is no sync endpoint for your health data to travel to.',
        bullets: [
          'No account creation, email address, phone number, or password.',
          'No advertising identifiers, ad SDKs, or data brokers.',
          'No sale, rental, or sharing of personal information — ever, to anyone.',
          'No behavioural profiling, cross-app tracking, or lookalike audiences.',
          'No requirement that you identify yourself to use any feature.',
        ],
      },
      {
        heading: 'What stays on your device',
        body: 'The following is written to your device’s local app storage and nowhere else:',
        bullets: [
          'Your consent-gate confirmations and MATCH plan selections.',
          'SafER Score answers, results, and history.',
          'Session records, check-ins, anxiety-log entries, and ritual streaks.',
          'Saved and custom scripts, and your decision-flow builder nodes.',
          'Emergency and safety-network contact names, numbers, and relationships.',
          'Saved clinics, reminder preferences, and any free-text note you write.',
        ],
      },
      {
        heading: 'What we never collect',
        body: 'We do not collect your name, email, address, precise location, contacts list, photos, device identifiers tied to you, HIV or STI status, test results, medication use, partner information, or any other special-category health data. We have no database of users because we have no users to put in one.',
      },
      {
        heading: 'Device permissions',
        body: 'Where the App asks for a permission, it is used for that single purpose in the moment and nothing is transmitted to us:',
        bullets: [
          'Phone dialler — to place a call you tap in the emergency sheet. We do not read your call log.',
          'Notifications — to show local reminders scheduled on your device. Reminder content never leaves the device.',
          'Location, if you enable it on the clinic map — used in-session to centre the map. It is not stored or sent to us.',
        ],
      },
      {
        heading: 'Third parties',
        body: 'The App has very few outside dependencies, and none of them receive your health data.',
        bullets: [
          'Platform stores (Apple, Google) handle distribution, crash reporting you opt into at the OS level, and any purchase. Their own privacy policies apply to those interactions.',
          'Map tiles on the clinic screen are requested from a map provider, which necessarily sees the map area being viewed. No clinic you save and no note you write is included in that request.',
          'Fonts are loaded from a public font CDN on the web build, which sees a standard web request.',
          'Product analytics are not enabled in released builds. Anonymous, non-identifying usage counters may run only inside our internal development preview and are never linked to a person or to any content you enter.',
        ],
      },
      {
        heading: 'Legal bases (GDPR / UK GDPR)',
        body: 'Because we do not process your personal data on our systems, we are not a controller of the content you keep locally — you are. Where we do process limited technical data (for example, an outbound map tile request), we rely on legitimate interests in delivering the feature you asked for, and on your consent where consent is required. If you are in the EEA, UK, or Switzerland and believe we hold data about you, write to us and we will respond within one month.',
      },
      {
        heading: 'Your rights under GDPR',
        body: 'You have the rights of access, rectification, erasure, restriction, portability, objection, and the right not to be subject to solely automated decision-making. In this App those rights are exercised directly and instantly:',
        bullets: [
          'Access and rectification — every stored value is visible and editable in the screen that created it.',
          'Erasure — Settings → "Wipe all local data" destroys everything immediately. Deleting the App does the same.',
          'Restriction and objection — stop using a feature, or revoke its permission in your OS settings.',
          'Portability — data is held in a standard local store on your device; we do not withhold it behind an export gate.',
          'Complaint — you may lodge a complaint with your national supervisory authority at any time.',
        ],
      },
      {
        heading: 'California rights (CCPA / CPRA)',
        body: 'For California residents:',
        bullets: [
          'We do not sell personal information and have not in the preceding 12 months.',
          'We do not share personal information for cross-context behavioural advertising.',
          'We do not use or disclose sensitive personal information beyond the purposes permitted by CPRA — in fact we do not receive it at all.',
          'Your rights to know, correct, delete, and limit use of sensitive information are satisfied by the on-device controls described above, and you may also contact us to make a formal request.',
          'We will never discriminate against you for exercising a privacy right.',
        ],
      },
      {
        heading: 'Children (COPPA)',
        body: 'The App is rated for adults and is not directed to children. We do not knowingly collect information from anyone under 13, and the App is not intended for anyone under 18. If you believe a minor has used the App on a device you control, wipe the local data in Settings and remove the App.',
      },
      {
        heading: 'Security',
        body: 'Your data is protected by your device: its lock screen, its encryption, and the operating system’s app sandbox. Keep your device passcode enabled and its software up to date. Note that an unencrypted device backup made by your computer or cloud provider may include App data; that backup is governed by your backup provider, not by us.',
      },
      {
        heading: 'Retention and international transfers',
        body: 'We retain nothing, so there is nothing to expire and no personal data to transfer across borders. Data you keep locally is retained until you delete it.',
      },
      {
        heading: 'Changes and contact',
        body: `If this policy changes we will update the "last updated" date and surface material changes in the App. Privacy questions and formal requests: ${LEGAL_PRIVACY_EMAIL}.`,
      },
    ],
  },
  {
    id: 'medical',
    title: 'Medical Disclaimer',
    summary: 'Educational only, no emergency services',
    icon: 'stethoscope',
    accent: MATCH_COLOR.T,
    intro: `${LEGAL_ENTITY} is an educational tool. Nothing in it is medical advice, diagnosis, or treatment, and it must not be used in place of care from a qualified professional. Read this section before acting on anything the App shows you.`,
    sections: [
      {
        heading: 'This is not an emergency service',
        body: 'The App cannot summon help. In an emergency, call your local emergency number (911 in the United States) or go to the nearest emergency department. Do not use the App to triage a medical emergency, an overdose, self-harm risk, or an assault.',
      },
      {
        heading: 'Time-critical situations',
        body: 'Some exposures have a clock on them. Post-exposure prophylaxis (PEP) is most effective the sooner it is started and is generally not offered beyond 72 hours after exposure. If you may have been exposed, seek care immediately rather than working through screens in this App. If you have experienced sexual assault, contact local emergency services or a specialist support line; evidence collection and preventive treatment are both time-sensitive.',
      },
      {
        heading: 'No professional relationship',
        body: 'Using the App, reading its content, or entering information into it does not create a clinician-patient, therapist-client, or advisory relationship with us or with anyone. We do not review what you enter. No one is monitoring your logs or your SafER Score.',
      },
      {
        heading: 'Educational content, not clinical guidance',
        body: 'Explanations of prevention strategies, medications, testing windows, and risk factors are general summaries written for a lay audience. They are simplified, may be incomplete, and may not reflect the most recent guidance in your country.',
        bullets: [
          'The App does not prescribe, and it does not give dosing, timing, interaction, or contraindication advice for any medication.',
          'Only a licensed prescriber can determine whether PrEP, PEP, a vaccine, or a treatment is appropriate for you.',
          'Testing windows shown in the App are approximations. Only a laboratory result interpreted by a clinician can tell you your status.',
          'Nothing in the App detects, diagnoses, or rules out an infection or any other condition.',
        ],
      },
      {
        heading: 'Scores and outputs are self-reported estimates',
        body: 'The SafER Score, shield percentage, stress-test results, and analytics are arithmetic over answers you gave yourself. They are prompts for reflection and conversation, not risk measurements, probabilities of transmission, or clinical assessments. A high score does not mean you are safe, and a low score does not mean you are ill.',
      },
      {
        heading: 'Local variation',
        body: 'Availability of medications, testing, vaccines, clinics, and legal protections differs by country, state, and clinic. Clinic and hotline entries in the App may be out of date, may have moved, or may no longer offer a service. Confirm details directly before you rely on them.',
      },
      {
        heading: 'Individual circumstances',
        body: 'Pregnancy, immune status, existing conditions, other medications, and drug or alcohol use all change what is appropriate for you. The App knows none of this. Discuss your actual situation with a clinician.',
      },
      {
        heading: 'No reliance',
        body: 'You use the App at your own risk and remain solely responsible for your health decisions. To the extent permitted by law, we accept no liability for any outcome arising from reliance on App content. If anything in the App conflicts with advice from your clinician, follow your clinician.',
      },
      {
        heading: 'Report an inaccuracy',
        body: `If you find content in the App that is medically wrong or out of date, tell us at ${LEGAL_CONTACT_EMAIL} so we can correct it.`,
      },
    ],
  },
  {
    id: 'safety',
    title: 'Safety & Facilitator Protocols',
    summary: 'Governance for facilitated & institutional use',
    icon: 'shield',
    accent: MATCH_COLOR.M,
    intro: `${LEGAL_ENTITY} was designed for private, individual use. When it is used in a facilitated setting — a clinic, a classroom, a harm-reduction programme, a peer group — additional rules apply. These protocols are binding on any facilitator or institution that deploys the App with other people.`,
    sections: [
      {
        heading: 'Who this applies to',
        body: 'Anyone who introduces the App to another person in a professional, educational, clinical, peer-support, custodial, or organisational context. That includes clinicians, health educators, outreach and harm-reduction workers, peer facilitators, counsellors, researchers, and institutional IT deployers.',
      },
      {
        heading: 'Core principles',
        bullets: [
          'Voluntary. Participation is always optional, with a stated alternative for anyone who declines.',
          'Private by default. A participant’s entries are theirs. A facilitator does not read them, request them, or store them.',
          'No coercion. App use is never a condition of receiving care, housing, education, benefits, release, or any other service.',
          'No data extraction. The App must not be used as a covert intake, screening, surveillance, or research-collection instrument.',
          'Dignity. Sessions are conducted without moralising, shaming, or assumptions about a participant’s identity, practices, or status.',
        ],
      },
      {
        heading: 'Before a session',
        body: 'Facilitators must, in plain language:',
        bullets: [
          'state that the App is educational and not medical advice, and that it cannot call for help;',
          'state that entries stay on the device being used, and who else can access that device;',
          'state that no one will read the participant’s entries, and then honour that;',
          'confirm participants are 18 or older, or that an appropriate adult-education framework and guardian consent process is in place where local law permits younger participants;',
          'offer an opt-out that carries no penalty;',
          'give participants the emergency numbers relevant to the region, on paper or verbally, independently of the App.',
        ],
      },
      {
        heading: 'Facilitator conduct',
        bullets: [
          'Do not ask a participant to reveal their status, test results, partners, or scores to the group or to you.',
          'Do not enter another person’s information into a device on their behalf without their explicit request.',
          'Do not photograph, screenshot, or transcribe a participant’s screen.',
          'Do not present App content as your own clinical opinion, and do not exceed your scope of practice.',
          'Do not use the App to make or justify a clinical, disciplinary, custodial, or eligibility decision about a participant.',
          'Do refer to a qualified clinician whenever a question moves from education to individual care.',
        ],
      },
      {
        heading: 'Shared and loaned devices',
        body: 'If participants use a device they do not own, the device is treated as public.',
        bullets: [
          'Tell participants clearly, before they type anything, that the device is shared.',
          'Run Settings → "Wipe all local data" at the end of every session, in front of the participant where possible.',
          'Disable cloud backup and screen-content sharing on loaned devices.',
          'Never configure device management to collect app content, screenshots, or keystrokes.',
          'Encourage anyone who wants to keep a plan to rebuild it on their own device.',
        ],
      },
      {
        heading: 'Disclosures, risk, and mandatory reporting',
        body: 'Facilitated sessions surface disclosures. Prepare for them before you start.',
        bullets: [
          'Know your jurisdiction’s mandatory reporting duties and disclose those limits to participants at the start, not after a disclosure.',
          'If a participant discloses abuse, coercion, trafficking, assault, or risk of self-harm, stop the App activity and follow your organisation’s safeguarding procedure and local law.',
          'Have current referral routes on hand: emergency services, sexual assault services, crisis lines, and a named clinical contact.',
          'Do not record the disclosure in the App. The App is not a case-management or clinical record system and must not be used as one.',
        ],
      },
      {
        heading: 'Institutional deployment',
        bullets: [
          'The App holds no server-side record; do not represent it to your governance board as a data source, an EHR integration, or an audit trail.',
          'Do not attempt to extract, mirror, or centralise local App storage. Doing so breaches these protocols and the Terms of Service.',
          'Complete your own privacy and equity impact assessment before deploying in a custodial, school, or workplace setting.',
          'Ensure the deployment is accessible: see the Accessibility Statement and provide an alternative format on request.',
          'Research use requires ethics-board approval and a consent process independent of the App. The App is not a data-collection instrument.',
        ],
      },
      {
        heading: 'Incidents',
        body: `Report a safety incident, a protocol breach, or a participant complaint to your organisation’s safeguarding lead first, and to us at ${LEGAL_CONTACT_EMAIL} where the App itself is implicated. We may withdraw permission to use the App in a facilitated setting where these protocols are breached.`,
      },
      {
        heading: 'Review',
        body: 'Facilitators should re-read these protocols before each programme cycle and whenever the App is updated. Nothing here replaces your own professional obligations, licensure conditions, or organisational policy — where they are stricter, they win.',
      },
    ],
  },
  {
    id: 'accessibility',
    title: 'Accessibility Statement',
    summary: 'WCAG 2.1 AA commitment',
    icon: 'eye',
    accent: HUD,
    intro: `We want ${LEGAL_ENTITY} to be usable by everyone, including people who use screen readers, magnification, switch control, voice control, or larger text. Our target is conformance with WCAG 2.1 Level AA, applied to a native mobile interface.`,
    sections: [
      {
        heading: 'Our commitment',
        body: 'Accessibility is treated as part of the definition of done for a feature, not a later pass. We aim for WCAG 2.1 Level AA and we test against the accessibility features built into iOS and Android rather than only against a checklist.',
      },
      {
        heading: 'What we have implemented',
        bullets: [
          'A dark, high-contrast interface with body and label text kept above the AA contrast ratio against its background.',
          'Interactive controls sized to at least the platform minimum touch target, with extra hit area on small chips and icons.',
          'Meaning is never carried by colour alone — status is also stated in text or with a label.',
          'Screen-reader labels and roles on buttons, toggles, and score elements, including the MATCH piece tiles, so each announces its letter and state.',
          'A logical reading and focus order that follows the visual layout, with scrollable content on every screen that can overflow.',
          'Layouts that reflow at larger system text sizes rather than clipping.',
          'Forms that keep the field visible above the keyboard, with visible labels rather than placeholder-only fields.',
          'Motion kept short and purposeful, with no flashing content and nothing that moves faster than the information it conveys.',
        ],
      },
      {
        heading: 'Known limitations',
        body: 'We would rather name gaps than claim conformance we have not earned. Currently:',
        bullets: [
          'The clinic map is a visual component; the clinic list beside it is the accessible equivalent and is the recommended route for screen-reader users.',
          'Some analytics charts convey trend visually; the underlying numbers are shown as text, but a full data-table alternative is still outstanding.',
          'The MATCH puzzle artwork is decorative where a text label already names the same piece, and is marked accordingly.',
          'A small number of legend labels use type below 11 points; we are raising these as screens are revised.',
          'The web build has had less assistive-technology testing than the native builds.',
        ],
      },
      {
        heading: 'Platform features that help',
        body: 'The App is built to work with VoiceOver and Dynamic Type on iOS, TalkBack and font-size scaling on Android, and system-level settings for bold text, increased contrast, reduced motion, and reduced transparency. Enabling these in your device settings changes the App as well.',
      },
      {
        heading: 'If something blocks you',
        body: `Tell us and we will treat it as a defect, not a request. Email ${LEGAL_ACCESSIBILITY_EMAIL} with the screen, what you were trying to do, your device, and the assistive technology you use. We aim to acknowledge within 5 business days and to give you a fix or a workaround with a timeframe. If you need any content in this App in another format, ask and we will provide it.`,
      },
      {
        heading: 'Assessment and status',
        body: `This statement reflects an internal self-assessment of version ${LEGAL_VERSION} of the App, combined with manual screen-reader and text-scaling testing. It has not been verified by a third-party audit. We review it whenever a significant feature ships.`,
      },
    ],
  },
];

export function getLegalDocument(id: string | undefined): LegalDocument | undefined {
  return LEGAL_DOCUMENTS.find((doc) => doc.id === id);
}
