
import axios from 'axios';

// Minimal, clean auth helper module
// Prefer VITE_API_URL, fall back to NEXT_PUBLIC_API_URL for compatibility
const API_URL = (import.meta.env.VITE_API_URL as string) || (import.meta.env.NEXT_PUBLIC_API_URL as string) || '';

if (!API_URL) {
  console.warn('[auth] VITE_API_URL / NEXT_PUBLIC_API_URL is not set. API calls may fail.');
}

const api = axios.create({ baseURL: API_URL, headers: { 'Content-Type': 'application/json' } });

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
  return user.role_id === 1 || user.id === 6;
}

// init
const token = getToken();
if (token) api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

export { api };
