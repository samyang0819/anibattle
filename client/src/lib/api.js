// src/lib/api.js
import { getToken, clearToken } from "./auth";

// Base URL for API.
// Uses Vite env variable in production.
// Falls back to localhost during local development.
const API_BASE =
  import.meta.env.VITE_API_URL?.replace(/\/$/, "") ||
  "http://localhost:3000"; 

/**
 * Attempts to parse JSON safely.
 * If the response body is empty or invalid JSON,
 * we return null instead of throwing.
 */
async function safeJson(res) {
  try {
    return await res.json();
  } catch {
    return null;
  }
}

/**
 * Central API helper.
 *
 * Handles:
 * - Attaching auth token automatically
 * - JSON serialization
 * - Unified error handling
 * - Auto-logout on 401
 *
 * This keeps fetch logic consistent across the app.
 */
export async function api(path, { method = "GET", body, headers = {} } = {}) {
  const token = getToken();

  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers: {
      // Only attach JSON header if body exists
      ...(body ? { "Content-Type": "application/json" } : {}),

      // Attach Bearer token if user is authenticated
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await safeJson(res);

  // If backend says unauthorized,
  // immediately clear token so UI doesn't think user is still logged in.
  if (res.status === 401) clearToken();

  // Normalize error responses so calling code
  // only deals with thrown Errors.
  if (!res.ok) {
    const msg =
      data?.error ||
      data?.message ||
      `Request failed (${res.status})`;
    throw new Error(msg);
  }

  // Always return an object to avoid undefined checks everywhere
  return data ?? {};
}