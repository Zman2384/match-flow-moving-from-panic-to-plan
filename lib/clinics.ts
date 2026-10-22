/**
 * Clinic Finder data. No server: the app builds links to official locators and
 * to a Google Maps search near the place the user typed or the ZIP found from
 * their location on the device. Nothing about the search is stored.
 */

export type ClinicSearchKind = 'clinic' | 'prep' | 'testing' | 'pep' | 'pharmacy';

export interface ClinicSearchKindInfo {
  id: ClinicSearchKind;
  label: string;
  /** Words for the Google Maps search. */
  mapsQuery: string;
  /** How the kind reads in a sentence ("See … on Google Maps"). */
  plural: string;
}

export const CLINIC_SEARCH_KINDS: ClinicSearchKindInfo[] = [
  {
    id: 'clinic',
    label: 'Clinics',
    mapsQuery: 'sexual health clinic',
    plural: 'sexual health clinics',
  },
  { id: 'prep', label: 'PrEP', mapsQuery: 'PrEP clinic', plural: 'PrEP clinics' },
  { id: 'testing', label: 'STI testing', mapsQuery: 'STI testing', plural: 'STI testing sites' },
  {
    id: 'pep',
    label: 'Emergency departments',
    mapsQuery: 'emergency room',
    plural: 'emergency rooms',
  },
  { id: 'pharmacy', label: 'Pharmacies', mapsQuery: 'pharmacy', plural: 'pharmacies' },
];

export interface OfficialFinder {
  id: string;
  name: string;
  operator: string;
  detail: string;
  url: string;
  /** Template with {zip}, used when the locator accepts a ZIP in its link. */
  zipUrl?: string;
  kinds: ClinicSearchKind[];
}

export const OFFICIAL_FINDERS: OfficialFinder[] = [
  {
    id: 'hiv-gov',
    name: 'HIV.gov Services Locator',
    operator: 'U.S. Department of Health & Human Services',
    detail: 'PEP, PrEP, testing and HIV care near you, including 24-hour sites.',
    url: 'https://locator.hiv.gov/',
    kinds: ['pep', 'prep', 'testing'],
  },
  {
    id: 'preplocator',
    name: 'PrEP Locator',
    operator: 'Emory University · PrEPLocator.org',
    detail: 'Providers who prescribe PrEP, with cost and insurance filters.',
    url: 'https://preplocator.org/',
    kinds: ['prep'],
  },
  {
    id: 'gettested',
    name: 'Get Tested',
    operator: 'CDC · Centers for Disease Control and Prevention',
    detail: 'Free, low-cost and confidential HIV, STI and hepatitis testing sites.',
    url: 'https://gettested.cdc.gov/',
    kinds: ['testing'],
  },
  {
    id: 'hrsa',
    name: 'Find a Health Center',
    operator: 'HRSA · U.S. Health Resources & Services Administration',
    detail: 'Community health centers that see you with or without insurance, on a sliding scale.',
    url: 'https://findahealthcenter.hrsa.gov/',
    zipUrl: 'https://findahealthcenter.hrsa.gov/?zip={zip}',
    kinds: ['clinic', 'prep', 'testing'],
  },
  {
    id: 'title-x',
    name: 'Title X Family Planning Clinics',
    operator: 'U.S. Office of Population Affairs',
    detail: 'Confidential sexual and reproductive health care, regardless of ability to pay.',
    url: 'https://opa-fpclinicdb.hhs.gov/',
    kinds: ['clinic', 'testing'],
  },
  {
    id: 'planned-parenthood',
    name: 'Planned Parenthood Health Centers',
    operator: 'Planned Parenthood Federation of America',
    detail: 'STI testing and treatment, PrEP and PEP at many locations, and sexual health care.',
    url: 'https://www.plannedparenthood.org/health-center',
    kinds: ['clinic', 'prep', 'testing'],
  },
];

export function findersFor(kind: ClinicSearchKind): OfficialFinder[] {
  return OFFICIAL_FINDERS.filter((finder) => finder.kinds.includes(kind));
}

/** A 5-digit ZIP if the text is (or starts with) one, else null. */
export function zipFrom(text: string): string | null {
  const match = text.trim().match(/^(\d{5})(?:-\d{4})?$/);
  return match ? match[1] : null;
}

export function finderUrl(finder: OfficialFinder, place: string): string {
  const zip = zipFrom(place);
  return finder.zipUrl && zip ? finder.zipUrl.replace('{zip}', zip) : finder.url;
}

/** Google Maps search (documented Maps URL API) for a kind of care near a place. */
export function mapsSearchUrl(kind: ClinicSearchKind, place: string): string {
  const info = CLINIC_SEARCH_KINDS.find((k) => k.id === kind) ?? CLINIC_SEARCH_KINDS[0];
  const near = zipFrom(place) ?? place.trim();
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${info.mapsQuery} near ${near}`,
  )}`;
}
