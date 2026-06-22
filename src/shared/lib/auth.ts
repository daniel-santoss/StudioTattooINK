import type { UserRole, AuthUser } from '@/shared/types';

// ========================================
// Auth Service Interface
// Abstraction layer over localStorage — the rest of the app consumes
// this interface, making it trivial to swap for Auth.js/NextAuth later.
// ========================================

export interface IAuthService {
  /** Returns the current user role, or null if not authenticated */
  getRole(): UserRole | null;

  /** Whether the user is currently authenticated */
  isAuthenticated(): boolean;

  /** Get the current user's display info */
  getUser(): AuthUser | null;

  /** Authenticate with a given role (mock) */
  login(role: UserRole): void;

  /** Clear authentication */
  logout(): void;
}

// ========================================
// localStorage-based Implementation (Mock)
// ========================================

const STORAGE_KEY = 'ink_role';

class LocalStorageAuthService implements IAuthService {
  getRole(): UserRole | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(STORAGE_KEY) as UserRole | null;
  }

  isAuthenticated(): boolean {
    return this.getRole() !== null;
  }

  getUser(): AuthUser | null {
    const role = this.getRole();
    if (!role) return null;

    // Mock user data based on role
    const names: Record<UserRole, string> = {
      client: 'Cliente',
      artist: 'Alex Rivera',
      admin: 'Admin',
    };

    return { role, name: names[role] };
  }

  login(role: UserRole): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEY, role);
  }

  logout(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(STORAGE_KEY);
  }
}

// ========================================
// Singleton Export
// To swap implementations later, change only this line.
// ========================================

export const authService: IAuthService = new LocalStorageAuthService();
