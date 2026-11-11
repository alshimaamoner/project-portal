import { PreferencesContext } from './usePreferences';
import { useState } from 'react';
import type { ReactNode } from 'react';
export function PreferencesProvider({ children }: { children: ReactNode }) {
  const [compact, setCompact] = useState(() => {
    try { return localStorage.getItem('portal-compact') === 'true'; } catch { return false; }
  });
  function toggle() {
    const next = !compact;
    try { localStorage.setItem('portal-compact', String(next)); } catch { /* Keep in-memory preference. */ }
    setCompact(next);
  }
  return <PreferencesContext.Provider value={{ compact, toggle }}>{children}</PreferencesContext.Provider>;
}
