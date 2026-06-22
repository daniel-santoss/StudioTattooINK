import { describe, it, expect, beforeEach } from 'vitest';
import { authService } from '../lib/auth';

describe('Auth Service', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('should start unauthenticated', () => {
    expect(authService.isAuthenticated()).toBe(false);
    expect(authService.getRole()).toBeNull();
    expect(authService.getUser()).toBeNull();
  });

  it('should authenticate client', () => {
    authService.login('client');
    expect(authService.isAuthenticated()).toBe(true);
    expect(authService.getRole()).toBe('client');
    expect(authService.getUser()?.name).toBe('Cliente');
  });

  it('should authenticate artist', () => {
    authService.login('artist');
    expect(authService.isAuthenticated()).toBe(true);
    expect(authService.getRole()).toBe('artist');
    expect(authService.getUser()?.name).toBe('Alex Rivera');
  });

  it('should logout correctly', () => {
    authService.login('admin');
    expect(authService.isAuthenticated()).toBe(true);
    
    authService.logout();
    expect(authService.isAuthenticated()).toBe(false);
    expect(authService.getRole()).toBeNull();
  });
});
