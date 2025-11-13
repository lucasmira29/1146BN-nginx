import { useEffect, useState, type ReactNode } from 'react';
import { AuthContext } from './AuthContext';
import type { UserContextType } from '@/types/authContextType';
import { decodeToken, getToken, removeToken } from '@/utils/handleToken';

interface Props {
  children: ReactNode;
}

export function AuthProvider({ children }: Props) {
  const [user, setUser] = useState<UserContextType | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  function login(user : UserContextType) {
    setUser(user);
  }

  function logout() {
    setUser(null);
    removeToken();
  }

  useEffect(() => {
    const token = getToken();
    if (token) {
      try {
        const userDecoded = decodeToken(token);
        setUser(userDecoded);
      } catch (error) {
        console.error('Erro ao decodificar token:', error);
        logout();
      }
    }
    setIsLoading(false);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}
