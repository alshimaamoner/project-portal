import { createContext, useContext } from 'react';
import type { User } from '../types';
export const AuthContext = createContext<{ user: User | null; login: (username: string) => Promise<void>; logout: () => void } | undefined>(undefined);
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider.');
  return context;
}
