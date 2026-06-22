'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/shared/lib/auth';
import type { UserRole, AuthUser } from '@/shared/types';

/**
 * Hook de autenticação — consome a interface IAuthService.
 * Componentes usam este hook ao invés de acessar localStorage diretamente.
 */
export function useAuth() {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const currentUser = authService.getUser();
    setUser(currentUser);
    setIsLoading(false);
  }, []);

  const login = useCallback(
    (role: UserRole, redirectTo?: string) => {
      authService.login(role);
      setUser(authService.getUser());
      if (redirectTo) {
        router.push(redirectTo);
      }
    },
    [router]
  );

  const logout = useCallback(() => {
    authService.logout();
    setUser(null);
    router.push('/login');
  }, [router]);

  return {
    user,
    role: user?.role ?? null,
    isAuthenticated: user !== null,
    isLoading,
    login,
    logout,
  };
}
