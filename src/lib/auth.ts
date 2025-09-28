
import axios from 'axios';

// Minimal, clean auth helper module
// Prefer VITE_API_URL, fall back to NEXT_PUBLIC_API_URL for compatibility
const API_URL = (import.meta.env.VITE_API_URL as string) || (import.meta.env.NEXT_PUBLIC_API_URL as string) || '';

if (!API_URL) {
  console.warn('[auth] VITE_API_URL / NEXT_PUBLIC_API_URL is not set. API calls may fail.');
}

const api = axios.create({ baseURL: API_URL, headers: { 'Content-Type': 'application/json' } });

// Debug: log runtime API base url
console.debug('[auth] Using API base URL:', API_URL);

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';

export type UserPayload = { id: number; name: string; role_id?: number; [k: string]: any } | null;

export type LoginResponse = {
  token: string;
  user: { id: number; name: string; role_id?: number; [k: string]: any };
  permissions?: any[];
  allowedViews?: any[];
  session?: Record<string, any>;
  [k: string]: any;
};

export async function login(email: string, password: string): Promise<LoginResponse> {
  const res = await api.post('/login', { email, password });
  const data = res.data as LoginResponse;

  if (data?.token) {
    setToken(data.token);
  }

  if (data?.user) {
    const enrichedUser = {
      ...data.user,
      permissions: data.permissions ?? data.user?.permissions,
      allowedViews: data.allowedViews ?? data.user?.allowedViews,
      session: data.session ?? data.user?.session,
    };

    setUser(enrichedUser);
    data.user = enrichedUser;
  } else {
    setUser(null);
  }

  return data;
}

/**
 * Fetch the authenticated user's enriched data from the backend (/me).
 * Will set local user state when successful.
 */
export async function fetchMe(): Promise<any> {
  try {
    // Prefer the existing protected /user endpoint (your routes define /user)
    // Fall back to /me if /user is not present in another backend
    let res;
    try {
      res = await api.get('/user');
    } catch (e) {
      // try /me as fallback
      res = await api.get('/me');
    }
    const data: any = res.data;

  // Backend may return either a plain User object, or an envelope { user, permissions, allowedViews }
  const user = data.user ?? data;
    const enrichedUser = {
      ...user,
      permissions: data.permissions ?? user?.permissions,
      allowedViews: data.allowedViews ?? user?.allowedViews,
      session: data.session ?? user?.session,
    };

    setUser(enrichedUser);
    return data;
  } catch (err: any) {
    // If unauthorized, clear local state
    const status = err?.response?.status;
    if (status === 401) {
      setToken(null);
      setUser(null);
    }
    throw err;
  }
}

export function setToken(token: string | null) {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    localStorage.removeItem(TOKEN_KEY);
    delete api.defaults.headers.common['Authorization'];
  }
}

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setUser(user: any | null) {
  if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));
  else localStorage.removeItem(USER_KEY);
}

export function getCurrentUser(): any | null {
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try { return JSON.parse(raw); } catch { return null; }
}

export async function logout(): Promise<void> {
  try {
    await api.post('/logout');
  } finally {
    setToken(null);
    setUser(null);
  }
}

// Auto-logout on 401 responses (optional behavior)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    if (status === 401) {
      // Clear local auth state
      setToken(null);
      setUser(null);
    }
    return Promise.reject(error);
  }
);

export function isAdminOrSpecialUser(user: any | null): boolean {
  if (!user) return false;
  // Support multiple shapes from backend: role_id, nested role object, or roles array
  if (user.id === 6) return true;
  if (user.role_id === 1) return true;
  if (user.role && (user.role.id === 1 || user.role_id === 1)) return true;
  if (Array.isArray(user.roles) && user.roles.some((r: any) => r?.id === 1)) return true;
  return false;
}

// init
const token = getToken();
if (token) api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

export { api };

// Parse configurable migration permission ids from env (comma-separated)
const MIGRATION_PERMISSION_IDS: number[] = (() => {
  const raw = (import.meta.env.VITE_MIGRATION_PERMISSION_IDS as string) || '';
  if (!raw) return [];
  return raw.split(',').map(s => Number(s.trim())).filter(n => !Number.isNaN(n));
})();

// Reusable: check a user object (and optional related arrays) for migration access
export function hasMigrationAccessFromUser(user: any | null, options: { permissions?: any[]; allowedViews?: any[] } = {}): boolean {
  if (!user) return false;

  // 1) explicit role or special user id (quick allow)
  if (user.role_id === 1 || user.id === 6) return true;

  // 2) allowedViews: come either from options or embedded on the user
  const allowedViews = options.allowedViews ?? user.allowedViews ?? [];
  if (Array.isArray(allowedViews) && allowedViews.some((v: any) => v?.view_path === '/academico/migrar-estudiantes')) return true;

  // 3) permissions: options override, otherwise check user.permissions
  const permissions = options.permissions ?? user.permissions ?? [];
  if (Array.isArray(permissions)) {
    // a) configured explicit ids via env
    if (MIGRATION_PERMISSION_IDS.length > 0) {
      if (permissions.some((p: any) => MIGRATION_PERMISSION_IDS.includes(Number(p?.permission_id || p?.permission?.id || -1)))) return true;
    }

    // b) fallback: common known id (backend) 91
    if (permissions.some((p: any) => Number(p?.permission_id || p?.permission?.id) === 91)) return true;

    // c) name heuristics (permission name contains 'migr')
    if (permissions.some((p: any) => {
      const name = p?.permission?.name || p?.name || '';
      return typeof name === 'string' && name.toLowerCase().includes('migr');
    })) return true;

    // d) also accept simple string entries that mention 'migr'
    if (permissions.some((p: any) => typeof p === 'string' && p.toLowerCase().includes('migr'))) return true;
  }

  return false;
}

// Backwards-compatible: accept the full login response object and delegate to the reusable check
export function hasMigrationAccessFromLogin(data: any): boolean {
  if (!data) return false;
  const user = data.user ?? data;
  return hasMigrationAccessFromUser(user, { permissions: data.permissions, allowedViews: data.allowedViews });
}
