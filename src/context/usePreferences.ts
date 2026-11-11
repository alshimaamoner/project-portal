import { createContext, useContext } from 'react';
export const PreferencesContext = createContext<{ compact: boolean; toggle: () => void } | undefined>(undefined);
export function usePreferences() {
  const context = useContext(PreferencesContext);
  if (!context) throw new Error('usePreferences must be used within a PreferencesProvider.');
  return context;
}
