import { Link, NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
export function RootLayout() {
  const { user, logout } = useAuth();
  return <><header className="header"><Link className="brand" to="/"><span className="brand-mark">p</span> project<span className="brand-light">portal</span></Link><nav aria-label="Main navigation"><NavLink to="/" end>Home</NavLink><NavLink to="/dashboard">Dashboard</NavLink></nav><div className="account">{user ? <><span className="avatar">{user.name.split(' ').map(part => part[0]).join('')}</span><span>{user.name}<small>{user.role}</small></span><button className="text-button" onClick={logout}>Log out ↗</button></> : <Link className="button small" to="/login">Sign in ↗</Link>}</div></header><Outlet /><footer>PROJECT PORTAL <span>A little clarity. A lot of progress.</span><span>Team workspace · 2026</span></footer></>;
}
export function DashboardLayout() {
  return <div className="dashboard"><aside><p className="eyebrow">WORKSPACE</p><nav aria-label="Dashboard navigation"><NavLink to="/dashboard" end><span>◫</span> Overview</NavLink><NavLink to="/dashboard/projects"><span>▦</span> Projects</NavLink><NavLink to="/dashboard/settings"><span>⚙</span> Settings</NavLink></nav><div className="sidebar-note"><span className="live-dot" /> Made for moving forward<p>Your team. Your projects.<br />All in one place.</p></div></aside><main className="workspace"><Outlet /></main></div>;
}
