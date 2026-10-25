// oxlint-disable-next-line eslint-plugin-import/no-unassigned-import
import '../global.css';

import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BebasNeue_400Regular } from '@expo-google-fonts/bebas-neue';
import { DMSans_400Regular, useFonts } from '@expo-google-fonts/dm-sans';
import { PlayfairDisplay_700Bold_Italic } from '@expo-google-fonts/playfair-display';
import { SpaceMono_400Regular } from '@expo-google-fonts/space-mono';
import Constants, { ExecutionEnvironment } from 'expo-constants';
import { Platform } from 'react-native';
import { useEffect } from 'react';
import * as DevClient from 'expo-dev-client';
import { HeroUINativeProvider } from 'heroui-native/provider';
import { Uniwind } from 'uniwind';
import {
  ErrorBoundary as ExpoErrorBoundary,
  type ErrorBoundaryProps,
  router,
  SplashScreen,
  Stack,
} from 'expo-router';

import { addNudgeTapListener, NOTIFICATIONS_SUPPORTED, syncReminders } from '@/lib/notifications';
import { hideBootSplash } from '@/lib/bootSplash';
import { initPostHog } from '@/lib/posthog';
import { NAVY } from '@/lib/palette';
import { registerServiceWorker } from '@/lib/registerServiceWorker';
import { reportErrorToParent } from '@/lib/reportPreviewError';
import { useMatchStore } from '@/lib/store';
import { GateGuard } from '@/components/GateGuard';
import { InstallPrompt } from '@/components/InstallPrompt';

/**
 * Custom ErrorBoundary that reports React render errors to the parent window (Bilt preview iframe)
 * and then renders the default Expo error UI.
 */
function ErrorBoundary({ error, retry }: ErrorBoundaryProps) {
  useEffect(() => {
    if (Platform.OS === 'web' && error) {
      const message = [error.message, error.stack].filter(Boolean).join('\n');
      reportErrorToParent(message);
    }
  }, [error]);
  return <ExpoErrorBoundary error={error} retry={retry} />;
}

export { ErrorBoundary };

// Starter is light-only by default. Remove this when implementing requested dark mode.
Uniwind.setTheme('light');

void SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    // Brand type stack: Bebas Neue (titles), Space Mono (labels), DM Sans (body).
    DMSans_400Regular,
    BebasNeue_400Regular,
    SpaceMono_400Regular,
    // Wordmark "Flow" only. Brand rule: the four site fonts, nothing else.
    PlayfairDisplay_700Bold_Italic,
  });

  // Report uncaught JS errors and unhandled promise rejections to parent (Bilt preview iframe)
  useEffect(() => {
    if (Platform.OS !== 'web' || typeof window === 'undefined') return undefined;

    const handleError = (event: ErrorEvent) => {
      const message = event.error?.stack ?? event.message ?? 'Unknown error';
      reportErrorToParent(message);
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      const err = event.reason;
      const message =
        err instanceof Error ? [err.message, err.stack].filter(Boolean).join('\n') : String(err);
      reportErrorToParent(message);
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);
    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);

  // Inject Google Fonts link tag for web to ensure fonts load through proxy
  // Also register font family names as fallback if expo-font fails
  useEffect(() => {
    if (Platform.OS === 'web') {
      // Check if link already exists
      const existingLink = document.querySelector(
        'link[href*="fonts.googleapis.com/css2?family=DM+Sans"]',
      );

      if (!existingLink) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href =
          'https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=Bebas+Neue&family=Space+Mono:wght@400;700&family=Playfair+Display:ital,wght@1,700&display=swap';
        link.crossOrigin = 'anonymous';
        document.head.appendChild(link);
      }

      // Note: The @import in global.css and the link tag above ensure the brand
      // faces load. expo-font registers the family names (DMSans_400Regular,
      // BebasNeue_400Regular, SpaceMono_400Regular). If expo-font fails due to
      // proxy issues the faces are still available via the Google Fonts CDN link.
    }
  }, []);

  useEffect(() => {
    const isExpoGo = Constants.executionEnvironment === ExecutionEnvironment.StoreClient;
    if (__DEV__ && Platform.OS !== 'web' && !isExpoGo) {
      const timer = setTimeout(() => {
        DevClient.closeMenu();
        DevClient.hideMenu();
      }, 1000);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, []);

  useEffect(() => {
    if (Platform.OS === 'web') {
      initPostHog();
    }
  }, []);

  useEffect(() => {
    registerServiceWorker();
  }, []);

  // Keep the on-device nudge schedule alive across launches, and never prompt
  // for permission on a cold start — the reminders screen owns that ask.
  useEffect(() => {
    if (!NOTIFICATIONS_SUPPORTED) return undefined;
    const rebuild = () => {
      void syncReminders({ prompt: false });
    };
    if (useMatchStore.persist.hasHydrated()) {
      rebuild();
      return undefined;
    }
    return useMatchStore.persist.onFinishHydration(rebuild);
  }, []);

  // Tapping a nudge opens the cadence plan it came from.
  useEffect(() => {
    const subscription = addNudgeTapListener((href) => {
      router.push(href);
    });
    return () => subscription.remove();
  }, []);

  useEffect(() => {
    if (loaded || error) {
      void SplashScreen.hideAsync();
      hideBootSplash();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <HeroUINativeProvider>
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: NAVY },
            animation: 'slide_from_right',
          }}
        >
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="gate" options={{ animation: 'fade' }} />
          <Stack.Screen name="piece/[key]" />
          <Stack.Screen name="settings" />
          <Stack.Screen name="lil-z" />
          <Stack.Screen name="legal/index" />
          <Stack.Screen name="legal/[doc]" />
          <Stack.Screen name="tools/safer-score" />
          <Stack.Screen name="tools/stress-test" />
          <Stack.Screen name="tools/analytics" />
          <Stack.Screen name="tools/scripts" />
          <Stack.Screen name="tools/flow-builder" />
          <Stack.Screen name="tools/frameworks" />
          <Stack.Screen name="tools/emergency" />
          <Stack.Screen name="tools/clinics" />
          <Stack.Screen name="tools/live-session" />
          <Stack.Screen name="tools/checkin" />
          <Stack.Screen name="tools/anxiety" />
          <Stack.Screen name="tools/ghost-vault" />
          <Stack.Screen name="tools/rituals" />
          <Stack.Screen name="tools/reminders" />
          <Stack.Screen name="tools/resources" />
          <Stack.Screen name="tools/curriculum" />
          <Stack.Screen name="tools/lesson" />
        </Stack>
        <GateGuard />
        <InstallPrompt />
      </HeroUINativeProvider>
    </GestureHandlerRootView>
  );
}
