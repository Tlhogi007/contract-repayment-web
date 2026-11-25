import { ApiError } from './api-error-class';
import type {
  AuthResponse,
  AuthUser,
  Contract,
  ContractListResponse,
} from './types';

export { ApiError };

const API_BASE = (import.meta.env.VITE_API_BASE_URL ?? '').replace(/\/$/, '');

const TOKEN_KEY = 'cr_access_token';
const EMAIL_KEY = 'cr_email';

export function getStoredToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function getStoredEmail(): string | null {
  return localStorage.getItem(EMAIL_KEY);
}

export function setSession(token: string, email: string): void {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(EMAIL_KEY, email);
}

export function clearSession(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(EMAIL_KEY);
}

function formatMessage(body: unknown): string {
  if (!body || typeof body !== 'object') {
    return 'Request failed';
  }
  const message = (body as { message?: unknown }).message;
  if (Array.isArray(message)) {
    return message.map(String).join('; ');
  }
  if (typeof message === 'string' && message.length > 0) {
    return message;
  }
  return 'Request failed';
}

async function api<T>(
  path: string,
  init: RequestInit = {},
  auth = true,
): Promise<T> {
  const headers = new Headers(init.headers);
  if (!headers.has('Content-Type') && init.body) {
    headers.set('Content-Type', 'application/json');
  }
  if (auth) {
    const token = getStoredToken();
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
  }

  const res = await fetch(`${API_BASE}${path}`, { ...init, headers });
  if (res.status === 204) {
    return undefined as T;
  }

  const text = await res.text();
  let body: unknown = null;
  if (text) {
    try {
      body = JSON.parse(text) as unknown;
    } catch {
      body = { message: text };
    }
  }

  if (!res.ok) {
    throw new ApiError(formatMessage(body), res.status);
  }

  return body as T;
}

export const authApi = {
  register(email: string, password: string): Promise<AuthResponse> {
    return api<AuthResponse>(
      '/auth/register',
      { method: 'POST', body: JSON.stringify({ email, password }) },
      false,
    );
  },
  login(email: string, password: string): Promise<AuthResponse> {
    return api<AuthResponse>(
      '/auth/login',
      { method: 'POST', body: JSON.stringify({ email, password }) },
      false,
    );
  },
  me(): Promise<AuthUser> {
    return api<AuthUser>('/auth/me');
  },
};

export const contractsApi = {
  list(params?: {
    limit?: number;
    cursor?: string;
  }): Promise<ContractListResponse> {
    const q = new URLSearchParams();
    if (params?.limit) q.set('limit', String(params.limit));
    if (params?.cursor) q.set('cursor', params.cursor);
    const suffix = q.toString() ? `?${q}` : '';
    return api<ContractListResponse>(`/contracts${suffix}`);
  },
  create(principalCents: number): Promise<Contract> {
    return api<Contract>('/contracts', {
      method: 'POST',
      body: JSON.stringify({ principalCents }),
    });
  },
  update(
    id: string,
    principalCents: number,
    expectedUpdatedAt: string,
  ): Promise<Contract> {
    return api<Contract>(`/contracts/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ principalCents, expectedUpdatedAt }),
    });
  },
  remove(id: string): Promise<void> {
    return api<void>(`/contracts/${id}`, { method: 'DELETE' });
  },
};
