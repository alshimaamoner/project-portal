import { usePreferences } from '../context/usePreferences';
export default function SettingsPage() {
  const { compact, toggle } = usePreferences();
  return <><div className="page-heading"><div><p className="eyebrow">MAKE YOURSELF AT HOME</p><h1>Settings<span>.</span></h1><p>A workspace that works your way.</p></div><span className="count-tag">ADMIN SPACE</span></div><section className="detail-card"><h2>Workspace preferences</h2><div className="setting-row"><div><label htmlFor="compact">Compact list</label><p>Show projects in a denser list, with more room for the big picture.</p></div><input className="toggle" type="checkbox" role="switch" id="compact" checked={compact} onChange={toggle}/></div><p className="muted">Your preference is saved automatically on this device.</p></section></>;
}
