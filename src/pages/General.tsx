import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
export function HomePage() {
  return <main className="home"><div className="hero"><p className="eyebrow"><span className="live-dot" /> A SHARED SPACE FOR GREAT WORK</p><h1>Big ideas.<br />Clear direction<span>.</span></h1><p className="hero-copy">Bring your projects into focus. A calmer place to see what’s happening, what’s next, and who’s making it happen.</p><Link className="button" to="/dashboard">Open your workspace <span>↗</span></Link><div className="hero-meta"><span>01 / PLAN</span><span>02 / COLLABORATE</span><span>03 / MAKE PROGRESS</span></div></div><div className="hero-art" aria-hidden="true"><div className="orbit orbit-one"/><div className="orbit orbit-two"/><div className="art-caption">LESS FRICTION.<br />MORE FORWARD.</div><div className="floating-card"><span className="live-dot"/> WORK IN MOTION<div className="art-bars"><i/><i/><i/><i/><i/></div><strong>Good things take a team.</strong></div><span className="art-star">✳</span><span className="art-bottom">THE NEXT CHAPTER STARTS HERE ↗</span></div></main>;
}
function redirectTarget(state: unknown): string {
  if (typeof state === 'object' && state !== null && 'from' in state && typeof state.from === 'string' && state.from.startsWith('/') && !state.from.startsWith('//') && !state.from.startsWith('/login')) return state.from;
  return '/dashboard';
}
export function LoginPage() {
  const { user, login } = useAuth();
  const location = useLocation();
  const [username, setUsername] = useState('');
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');
  if (user) return <Navigate to={redirectTarget(location.state)} replace />;
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setPending(true); setError('');
    try { await login(username); } catch (failure) { setError(failure instanceof Error ? failure.message : 'Unable to sign in.'); } finally { setPending(false); }
  }
  return <main className="login-page"><div className="login-intro"><p className="eyebrow">YOUR TEAM’S NEXT CHAPTER</p><h1>Welcome<br />back<span>.</span></h1><p>Pick up where you left off.<br />Your workspace is waiting.</p><span className="login-symbol" aria-hidden="true">✳</span></div><form className="login-form" onSubmit={submit}><p className="eyebrow">LET’S GET TO WORK</p><h2>Sign in to Project Portal</h2><p>One place for everything you’re building.</p><label htmlFor="username">Username</label><input id="username" autoComplete="username" value={username} onChange={event => setUsername(event.target.value)} placeholder="Enter your username" required disabled={pending}/>{error && <p role="alert" className="error-text">{error}</p>}<button className="button" disabled={pending || !username.trim()}>{pending ? 'Signing in…' : 'Sign in →'}</button><div className="demo-note"><strong>Take a look around</strong><p>Use <code>sara</code> for admin access or <code>youssef</code> for member access. No password needed.</p></div></form></main>;
}
export function NotFoundPage() { return <main className="empty"><p className="eyebrow">404 / OFF THE MAP</p><h1>Not found</h1><p>We couldn’t find that page. Let’s get you back on track.</p><Link className="button" to="/">Back to Home ↗</Link></main>; }
