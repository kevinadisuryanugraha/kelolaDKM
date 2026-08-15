/**
 * Demo mode allows the frontend to run without the Laravel backend.
 *
 * - Enabled automatically in development (`vite dev`).
 * - Can be explicitly enabled in production builds via `VITE_DEMO_MODE=true`.
 * - OFF by default in production builds.
 */
export const isDemoModeEnabled = (): boolean =>
  import.meta.env.DEV === true || import.meta.env.VITE_DEMO_MODE === 'true';
