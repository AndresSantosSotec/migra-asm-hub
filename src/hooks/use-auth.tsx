import { login, logout, isAdminOrSpecialUser, hasMigrationAccessFromUser, setToken, setUser, fetchMe } from '../lib/auth';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

export function useLogin() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await login(email, password);
      // If backend sent a token, persist it first so subsequent /me call is authenticated
      if (data && data.token) {
        setToken(data.token);
      }

      // Fetch authoritative user data from backend (/me) when available
      let meData: any = null;
      try {
        meData = await fetchMe();
      } catch (err) {
        // If fetchMe fails, fall back to the login response user object
        meData = { user: data?.user ?? null, permissions: data?.permissions, allowedViews: data?.allowedViews };
      }

      const userForCheck = meData?.user ?? data?.user ?? null;

      // Debug: only log when migration access is detected
      if (hasMigrationAccessFromUser(userForCheck, { permissions: meData?.permissions, allowedViews: meData?.allowedViews })) {
        const safe = { user_id: userForCheck?.id ?? null, hasToken: !!data?.token };
        console.debug('[useLogin] login response (migration access):', safe);
      }

      // Decide final redirect using authoritative data
      if (userForCheck && (isAdminOrSpecialUser(userForCheck) || hasMigrationAccessFromUser(userForCheck, { permissions: meData?.permissions, allowedViews: meData?.allowedViews }))) {
        // Already saved token above
        setUser(userForCheck);
        navigate('/dashboard');
      } else {
        // Not allowed
        setToken(null);
        setUser(null);
        navigate('/404');
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error de autenticación');
    } finally {
      setLoading(false);
    }
  };

  return { handleLogin, error, loading };
}

export function useLogout() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    setError(null);
    try {
      await logout();
      navigate('/login', { replace: true });
    } catch (err: any) {
      setError(err?.response?.data?.error || 'Error al cerrar sesión');
    } finally {
      setLoading(false);
    }
  };

  return { handleLogout, error, loading };
}
