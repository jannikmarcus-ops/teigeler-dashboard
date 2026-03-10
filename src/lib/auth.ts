/**
 * Auth-Utilities für Dashboard-Passwortschutz.
 * Nutzt Web Crypto API (kompatibel mit Edge Runtime / Middleware).
 */

const SALT = '__teigeler-dashboard-2026__';

export async function generateToken(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password + SALT);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

export const AUTH_COOKIE_NAME = 'dashboard_auth';
export const AUTH_MAX_AGE = 60 * 60 * 24 * 365; // 365 Tage
