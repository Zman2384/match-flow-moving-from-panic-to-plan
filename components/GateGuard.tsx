import { router, useSegments } from 'expo-router';
import { useEffect, useState } from 'react';

import { useMatchStore } from '@/lib/store';

/** Routes a visitor can open before completing the 18+ gate. */
const OPEN_ROUTES = new Set(['gate', 'legal', '+not-found']);

/**
 * Sends anyone without completed gate consent to /gate, whatever route they arrived on —
 * tabs, tools, Lil Z, settings or a pasted deep link (M-1). Waits for stored consent to load
 * so a returning user is never bounced while storage hydrates.
 */
export function GateGuard() {
  const segments = useSegments();
  const ageConfirmed = useMatchStore((s) => s.ageConfirmed);
  const [hydrated, setHydrated] = useState(() => useMatchStore.persist.hasHydrated());

  useEffect(() => {
    if (hydrated) return undefined;
    return useMatchStore.persist.onFinishHydration(() => setHydrated(true));
  }, [hydrated]);

  const first = segments[0] ?? '';

  useEffect(() => {
    if (!hydrated || ageConfirmed) return;
    if (OPEN_ROUTES.has(first)) return;
    router.replace('/gate');
  }, [hydrated, ageConfirmed, first]);

  return null;
}
