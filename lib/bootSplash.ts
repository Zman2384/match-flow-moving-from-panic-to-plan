import { Platform } from 'react-native';

/**
 * Fades out the static boot splash in public/index.html. Called once fonts are
 * ready and the first real screen has had two frames to paint, so the visitor
 * never sees a blank frame between the splash and the app.
 *
 * M-9: the splash is dropped from the accessibility tree the moment the app is
 * ready, and a timer backs up requestAnimationFrame (which browsers pause in
 * background tabs), so a "Loading… / Still loading" status is never left
 * behind for screen readers after content has loaded.
 */
export function hideBootSplash(): void {
  if (Platform.OS !== 'web' || typeof document === 'undefined') return;
  const splash = document.getElementById('boot-splash');
  if (!splash || splash.dataset.hiding === '1') return;
  splash.dataset.hiding = '1';

  splash.setAttribute('aria-hidden', 'true');
  splash.removeAttribute('role');
  splash.removeAttribute('aria-live');

  let fading = false;
  const fade = () => {
    if (fading) return;
    fading = true;
    splash.classList.add('bs-out');
    setTimeout(() => {
      splash.remove();
      document.getElementById('boot-splash-css')?.remove();
    }, 300);
  };

  requestAnimationFrame(() => {
    requestAnimationFrame(fade);
  });
  setTimeout(fade, 500);
}
