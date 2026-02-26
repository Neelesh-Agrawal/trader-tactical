const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

const TOKEN_STORAGE_KEY = 'trader_tactical_auth_tokens';

export interface AuthTokens {
  access: string;
  refresh: string;
}

export interface ApiError extends Error {
  status?: number;
  details?: unknown;
}

export function getAuthTokens(): AuthTokens | null {
  try {
    const raw = localStorage.getItem(TOKEN_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as AuthTokens;
  } catch {
    return null;
  }
}

export function setAuthTokens(tokens: AuthTokens | null) {
  if (!tokens) {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    return;
  }
  localStorage.setItem(TOKEN_STORAGE_KEY, JSON.stringify(tokens));
}

interface ApiFetchOptions extends RequestInit {
  /** Whether to send Authorization header (default: true) */
  auth?: boolean;
}

export async function apiFetch<T>(
  path: string,
  options: ApiFetchOptions = {},
): Promise<T> {
  const url = `${API_BASE_URL}${path}`;

  const { auth = true, headers, ...rest } = options;

  const finalHeaders: HeadersInit = {
    'Content-Type': 'application/json',
    ...(headers || {}),
  };

  if (auth) {
    const tokens = getAuthTokens();
    if (tokens?.access) {
      (finalHeaders as Record<string, string>)['Authorization'] =
        `Bearer ${tokens.access}`;
    }
  }

  const response = await fetch(url, {
    ...rest,
    headers: finalHeaders,
  });

  if (!response.ok) {
    let message = `Request failed with status ${response.status}`;
    let details: unknown;

    try {
      const data = await response.json();
      details = data;

      // Common DRF error shapes: { detail: "..." } or field errors
      if (typeof data === 'object' && data && 'detail' in data) {
        message = (data as { detail: string }).detail;
      }
    } catch {
      // Ignore JSON parse errors, keep default message
    }

    const error: ApiError = new Error(message);
    error.status = response.status;
    if (details !== undefined) {
      error.details = details;
    }
    throw error;
  }

  // Some endpoints may legitimately return no content (204)
  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

