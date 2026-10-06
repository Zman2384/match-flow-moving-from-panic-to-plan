/**
 * MATCH Flow brand palette — the single source of truth for colors passed
 * outside `className` (icon props, SVG strokes, native switches, map markers).
 *
 * Every value here mirrors a token in global.css. Nothing off-brand belongs in
 * this file, and no screen should invent a hex of its own: the brand spec allows
 * the five MATCH pillars, the cyan active signal, the three ghost-grid hues, the
 * caution banner and the navy HUD chrome below.
 */

/** Active signal — Neon Cyan telemetry / heartbeat. */
export const HUD = '#00bdbd';
/** Dim signal for inactive rails and switch tracks. */
export const HUD_DIM = '#0a4f63';

/** Atmosphere — dark navy starfield falling to black. */
export const NAVY = '#0d1a2e';
export const ABYSS = '#030d1a';
export const PANEL = '#0d1f36';
export const PANEL_DEEP = '#061222';

/** MATCH framework palette, keyed by piece. */
export const MATCH_COLOR = {
  M: '#90b14b',
  A: '#6e99a3',
  T: '#a8005d',
  C: '#dfc401',
  H: '#ff751f',
} as const;

/** Ghost-grid categories. */
export const GHOST_COLOR = {
  logistical: '#03c8e0',
  relational: '#e05780',
  internal: '#a87ee0',
} as const;

/** Mandated caution banner — gold headline on an orange edge. */
export const CAUTION = '#dfc401';
export const CAUTION_SOFT = '#f6d9ae';
export const CAUTION_EDGE = '#ff751f';

/** Pass / fail readouts, drawn from the framework palette. */
export const STATE_PASS = MATCH_COLOR.M;
export const STATE_FAIL = MATCH_COLOR.T;

/** Navy-tinted HUD chrome: text, hairlines and inactive states. */
export const SILVER = '#b8c6d5';
export const SILVER_LIGHT = '#edf4fa';
export const STEEL = '#5f7791';
export const STEEL_SOFT = '#7f8ea3';
export const LINE = '#1c3a55';
export const LINE_SOFT = '#33506b';
/** Ink used on top of a lit cyan or gold surface. */
export const INK_ON_SIGNAL = '#03121f';
