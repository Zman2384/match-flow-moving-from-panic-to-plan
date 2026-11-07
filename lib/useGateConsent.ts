import { useEffect, useState } from 'react';

import { useMatchStore } from '@/lib/store';

/** Wait for saved consent before allowing the navigator to mount private screens. */
export function useGateConsent() {
  const ageConfirmed = useMatchStore((s) => s.ageConfirmed);
  const [hydrated, setHydrated] = useState(() => useMatchStore.persist.hasHydrated());

  useEffect(() => {
    const unsubscribe = useMatchStore.persist.onFinishHydration(() => setHydrated(true));
    setHydrated(useMatchStore.persist.hasHydrated());
    return unsubscribe;
  }, []);

  return { ageConfirmed, hydrated };
}
