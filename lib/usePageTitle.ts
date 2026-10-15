import { useCallback } from 'react';
import { Platform } from 'react-native';
import { useFocusEffect, usePathname } from 'expo-router';

/** The search title for the app's front page; keep in sync with app.config.ts web.name. */
export const HOME_TITLE = 'MATCH Flow: The Biomedical Command Center | The HARNESS Project';

/** Sets the browser tab / search title for the current screen on web. */
export function usePageTitle(title: string | undefined, app = 'MATCH Flow') {
  const pathname = usePathname();
  useFocusEffect(
    useCallback(() => {
      if (Platform.OS !== 'web' || typeof document === 'undefined') return;
      // Drop leading emoji/symbols so tabs read "Clinic Finder | MATCH Flow".
      const clean = title?.replace(/^[^\p{L}\p{N}]+/u, '').trim();
      document.title = pathname === '/' || !clean ? HOME_TITLE : `${clean} | ${app}`;
    }, [title, app, pathname]),
  );
}
