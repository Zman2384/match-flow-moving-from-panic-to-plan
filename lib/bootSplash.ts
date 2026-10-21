import { Platform } from 'react-native';

/**
 * Fades out the static boot splash in public/index.html. Called once fonts are
 * ready and the first real screen has had two frames to paint, so the visitor
 * never sees a blank frame between the splash and the app.
 */
export function hideBootSplash(): void {
  if (Platform.OS !== 'web' || typeof document === 'undefined') return;
  const splash = document.getElementById('boot-splash');
  if (!splash) return;
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      splash.classList.add('bs-out');
      setTimeout(() => {
        splash.remove();
        document.getElementById('boot-splash-css')?.remove();
      }, 300);
    });
  });
}
