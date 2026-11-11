// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';
import { AppRoutes } from './App';
import { AuthProvider } from './context/AuthContext';
import { PreferencesProvider } from './context/PreferencesContext';
import { withAuth, withLoading } from './components/hocs';
import { fetchProject, fetchProjects, login } from './api/mockApi';
import type { User } from './types';
vi.mock('./api/mockApi', () => ({ fetchProjects: vi.fn(), fetchProject: vi.fn(), login: vi.fn() }));
const admin: User = { id: 'u1', username: 'sara', name: 'Sara Mahmoud', role: 'admin' };
const projects = [{ id: 'p1', name: 'Mobile App', description: 'An app.', status: 'active' as const, ownerName: 'Sara', startDate: '2026-03-01', dueDate: '2026-12-15' }, { id: 'p2', name: 'Web Portal', description: 'A portal.', status: 'completed' as const, ownerName: 'Sara', startDate: '2026-03-01', dueDate: '2026-12-15' }];
function mount(path: string) { return render(<MemoryRouter initialEntries={[path]}><AuthProvider><PreferencesProvider><AppRoutes/></PreferencesProvider></AuthProvider></MemoryRouter>); }
beforeEach(() => { localStorage.clear(); vi.resetAllMocks(); vi.mocked(fetchProjects).mockResolvedValue(projects); vi.mocked(fetchProject).mockResolvedValue(projects[0]); });
afterEach(cleanup);
function PrivatePage() { return <p>Private content</p>; }
const ProtectedPage = withAuth(PrivatePage);
function LocationProbe() { const location = useLocation(); return <><h1>Login destination</h1><output>{JSON.stringify(location.state)}</output></>; }
describe('portal routing and access', () => {
  it('renders Not found for an unknown URL', () => { mount('/missing/page'); expect(screen.getByRole('heading', { name: 'Not found' })).toBeInTheDocument(); });
  it('redirects signed-out users to login and remembers the requested URL', () => {
    render(<MemoryRouter initialEntries={['/private?q=web']}><AuthProvider><Routes><Route path="private" element={<ProtectedPage/>}/><Route path="login" element={<LocationProbe/>}/></Routes></AuthProvider></MemoryRouter>);
    expect(screen.getByRole('heading', { name: 'Login destination' })).toBeInTheDocument(); expect(screen.getByText('{"from":"/private?q=web"}')).toBeInTheDocument(); expect(screen.queryByText('Private content')).not.toBeInTheDocument();
  });
  it('returns to the requested page after login and saves the session', async () => {
    vi.mocked(login).mockResolvedValue(admin); mount('/dashboard/projects?q=mobile');
    fireEvent.change(screen.getByLabelText('Username'), { target: { value: 'sara' } }); fireEvent.click(screen.getByRole('button', { name: 'Sign in →' }));
    expect(await screen.findByRole('heading', { name: 'Projects.' })).toBeInTheDocument(); expect(screen.getByLabelText('Search projects')).toHaveValue('mobile'); expect(JSON.parse(localStorage.getItem('portal-user') ?? 'null')).toEqual(admin);
  });
  it('blocks members from settings', () => { localStorage.setItem('portal-user', JSON.stringify({ ...admin, role: 'member' })); mount('/dashboard/settings'); expect(screen.getByText('You do not have access to this page.')).toBeInTheDocument(); });
  it('shows lazy settings for admins and saves compact preference', async () => { localStorage.setItem('portal-user', JSON.stringify(admin)); mount('/dashboard/settings'); const toggle = await screen.findByRole('switch', { name: 'Compact list' }); fireEvent.click(toggle); expect(toggle).toBeChecked(); expect(localStorage.getItem('portal-compact')).toBe('true'); });
  it('handles corrupted sessions', () => { localStorage.setItem('portal-user', '{bad'); mount('/dashboard'); expect(screen.getByLabelText('Username')).toBeInTheDocument(); });
  it('retries project failures and preserves both URL filters', async () => {
    localStorage.setItem('portal-user', JSON.stringify(admin)); vi.mocked(fetchProjects).mockRejectedValueOnce(new Error('Network error: please try again.')); mount('/dashboard/projects?q=mobile');
    expect(await screen.findByRole('alert')).toHaveTextContent('Network error'); fireEvent.click(screen.getByRole('button', { name: /Retry/ })); await screen.findByRole('heading', { name: 'Projects.' });
    fireEvent.change(screen.getByLabelText('Status'), { target: { value: 'active' } }); expect(screen.getByLabelText('Search projects')).toHaveValue('mobile'); expect(screen.getByRole('heading', { name: 'Mobile App' })).toBeInTheDocument(); expect(screen.queryByRole('heading', { name: 'Web Portal' })).not.toBeInTheDocument();
    fireEvent.change(screen.getByLabelText('Search projects'), { target: { value: 'web' } }); expect(screen.getByLabelText('Status')).toHaveValue('active'); expect(screen.getByText('No projects found')).toBeInTheDocument();
  });
  it('shows project not found and provides a direct-entry Back fallback', async () => { localStorage.setItem('portal-user', JSON.stringify(admin)); vi.mocked(fetchProject).mockResolvedValue(null); mount('/dashboard/projects/nope'); await screen.findByRole('heading', { name: 'Project not found' }); fireEvent.click(screen.getByRole('button', { name: '← Back' })); await screen.findByRole('heading', { name: 'Projects.' }); });
  it('ignores a detail response after moving to a different project', async () => {
    localStorage.setItem('portal-user', JSON.stringify(admin)); let resolveFirst: (value: typeof projects[0]) => void = () => {};
    vi.mocked(fetchProject).mockImplementation((id: string) => id === 'p1' ? new Promise(resolve => { resolveFirst = resolve; }) : Promise.resolve(projects[1]));
    mount('/dashboard/projects'); fireEvent.click(await screen.findByRole('link', { name: /Mobile App/ })); fireEvent.click(screen.getByRole('link', { name: /Projects/ })); fireEvent.click(await screen.findByRole('link', { name: /Web Portal/ })); await screen.findByRole('heading', { name: 'Web Portal.' }); resolveFirst(projects[0]); await waitFor(() => expect(screen.getByRole('heading', { name: 'Web Portal.' })).toBeInTheDocument());
  });
});
function PropsProbe(props: { title: string }) { return <output>{Object.keys(props).join(',')}:{props.title}</output>; }
const LoadedProbe = withLoading(PropsProbe);
it('consumes the loading prop without forwarding it', () => { const { rerender } = render(<LoadedProbe title="Ready" isLoading/>); expect(screen.getByRole('status')).toBeInTheDocument(); rerender(<LoadedProbe title="Ready" isLoading={false}/>); expect(screen.getByText('title:Ready')).toBeInTheDocument(); });
