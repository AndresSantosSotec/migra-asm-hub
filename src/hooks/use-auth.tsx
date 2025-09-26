import { login, isAdminOrSpecialUser, setToken, setUser } from '../lib/auth';
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
      if (data && data.token && isAdminOrSpecialUser(data.user)) {
        // Guardar token y datos usando utilidades comunes
        setToken(data.token);
        setUser(data.user);
        // Redirigir al dashboard o página principal
        navigate('/dashboard');
      } else {
        // No es admin ni usuario especial, redirigir a 404
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
