export type ClinicSearchKind = 'clinic' | 'prep' | 'testing' | 'pep' | 'pharmacy';
export interface SearchLocation {
  latitude: number;
  longitude: number;
}
export type ClinicSearchOrigin = { address: string } | { coordinate: SearchLocation };
export interface NearbyClinic {
  id: string;
  name: string;
  address: string;
  distanceMiles: number;
  phone: string | null;
  openNow: boolean | null;
  mapsUrl: string;
  attributions: { provider: string; uri?: string }[];
}
export interface ClinicSearchResults {
  clinics: NearbyClinic[];
  originLabel: string;
}
export const CLINIC_SEARCH_KINDS: { id: ClinicSearchKind; label: string }[] = [
  { id: 'clinic', label: 'Clinics' },
  { id: 'prep', label: 'PrEP' },
  { id: 'testing', label: 'STI testing' },
  { id: 'pep', label: 'Emergency departments' },
  { id: 'pharmacy', label: 'Pharmacies' },
];

// Use the same public-function transport as the existing Lil Z integration.
// No session is created, and no search is persisted or attached to a plan.
async function callFinder(body: object): Promise<ClinicSearchResults> {
  const url = process.env.EXPO_PUBLIC_BILT_URL;
  const key = process.env.EXPO_PUBLIC_BILT_ANON_KEY ?? '';
  if (!url) throw new Error('Nearby search is unavailable. Please try again later.');
  let response: Response;
  try {
    response = await fetch(`${url}/functions/v1/clinic-search`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', apikey: key, Authorization: `Bearer ${key}` },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(25000),
    });
  } catch {
    throw new Error('Could not connect. Check your connection and try again.');
  }
  const data: ClinicSearchResults & { error?: string } = await response.json();
  if (!response.ok || data.error) {
    throw new Error(data.error || 'Clinic search failed. Please try again.');
  }
  return data;
}

export async function checkClinicSearch(): Promise<void> {
  await callFinder({ action: 'status' });
}

export function searchClinics(origin: ClinicSearchOrigin, kind: ClinicSearchKind) {
  return callFinder({ ...origin, kind });
}
