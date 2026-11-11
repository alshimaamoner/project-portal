import { AuthContext } from './useAuth';
import { useState } from 'react';
import type { ReactNode } from 'react';
import { login as apiLogin } from '../api/mockApi';
import type { User } from '../types';

function readUser(): User | null {
  try {
    const value: unknown = JSON.parse(localStorage.getItem('portal-user') ?? 'null');
    if (typeof value === 'object' && value !== null && 'id' in value && typeof value.id === 'string' && 'username' in value && typeof value.username === 'string' && 'name' in value && typeof value.name === 'string' && 'role' in value && (value.role === 'admin' || value.role === 'member')) {
      return { id: value.id, username: value.username, name: value.name, role: value.role };
    }
  } catch { /* An unavailable or corrupted session starts signed out. */ }
  return null;
}
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState(readUser);
  async function login(username: string) {
    const next = await apiLogin(username);
    try { localStorage.setItem('portal-user', JSON.stringify(next)); } catch { /* Session still works in memory. */ }
    setUser(next);
  }
  function logout() {
    try { localStorage.removeItem('portal-user'); } catch { /* Storage may be unavailable. */ }
    setUser(null);
  }
  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>;
}
