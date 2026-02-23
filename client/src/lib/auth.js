// src/lib/auth.js

// Single source of truth for where we store the JWT.
// If we ever change storage strategy (cookie, sessionStorage, etc.),
// we only change it here.
const TOKEN_KEY = "token";

/**
 * Returns the stored JWT (if any).
 * Does NOT validate expiration — it only checks presence.
 */
export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

/**
 * Persists JWT in localStorage.
 * This keeps user logged in across page refreshes.
 */
export function setToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

/**
 * Removes JWT completely.
 * Used on logout or when backend returns 401.
 */
export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

/**
 * Basic authentication check.
 * Only verifies token exists — does NOT verify:
 * - Expiration
 * - Signature
 * - Whether backend still considers it valid
 *
 * For production apps, this should be paired
 * with a server-side verification step.
 */
export function isAuthed() {
  return Boolean(getToken());
}