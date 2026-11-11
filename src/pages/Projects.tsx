import { useCallback } from 'react';
import { Link, useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { fetchProject, fetchProjects } from '../api/mockApi';
import { withLoading } from '../components/hocs';
import { useResource } from '../hooks/useResource';
import type { Resource } from '../hooks/useResource';
import type { Project, ProjectStatus } from '../types';
import { usePreferences } from '../context/usePreferences';
const statusLabels: Record<ProjectStatus, string> = { active: 'Active', on_hold: 'On hold', completed: 'Completed' };
const statuses: ProjectStatus[] = ['active', 'on_hold', 'completed'];
function formatDate(value: string) {
  const normalized = value.replace(/^(\d{4})-(\d{2})(\d{2})$/, '$1-$2-$3');
  const date = new Date(`${normalized}T00:00:00Z`);
  return Number.isNaN(date.getTime()) ? 'Date unavailable' : new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' }).format(date);
}
function ErrorState({ message, retry }: { message: string; retry: () => void }) { return <div className="empty" role="alert"><h2>A small bump in the road</h2><p>{message}</p><button onClick={retry} className="button">Retry ↻</button></div>; }
function Status({ value }: { value: ProjectStatus }) { return <span className={`status ${value}`}><span />{statusLabels[value]}</span>; }
function ProjectsPage({ resource, retry }: { resource: Exclude<Resource<Project[]>, { status: 'loading' }>; retry: () => void }) {
  const [params, setParams] = useSearchParams();
  const { compact } = usePreferences();
  const location = useLocation();
  if (resource.status === 'error') return <ErrorState message={resource.message} retry={retry}/>;
  const query = params.get('q') ?? '';
  const status = params.get('status') ?? '';
  const filtered = resource.data.filter(project => (!status || project.status === status) && project.name.toLowerCase().includes(query.toLowerCase()));
  function filter(key: string, value: string) { setParams(previous => { const next = new URLSearchParams(previous); if (value) next.set(key, value); else next.delete(key); return next; }, { replace: true }); }
  return <><div className="page-heading"><div><p className="eyebrow">YOUR WORK, IN ONE PLACE</p><h1>Projects<span>.</span></h1><p>A shared view of what we’re building together.</p></div><span className="count-tag">{resource.data.length.toString().padStart(2, '0')} TOTAL PROJECTS</span></div><div className="filter-bar"><label className="search" htmlFor="project-search"><span aria-hidden="true">⌕</span><span className="sr-only" id="project-search-label">Search projects</span><input id="project-search" aria-labelledby="project-search-label" value={query} onChange={event => filter('q', event.target.value)} placeholder="Search projects…" /></label><label className="status-filter">Status<select value={status} onChange={event => filter('status', event.target.value)}><option value="">All statuses</option>{statuses.map(item => <option key={item} value={item}>{statusLabels[item]}</option>)}</select></label></div><div className="list-heading"><span>{filtered.length} {filtered.length === 1 ? 'project' : 'projects'}</span><span>EVERY PROJECT IS A STEP FORWARD ↗</span></div><div className={`project-list ${compact ? 'compact' : ''}`}>{filtered.map((project, index) => <Link key={project.id} to={project.id} state={{ fromApp: true, from: location.pathname + location.search }} className="project-row"><span className={`project-icon icon-${index % 3}`}>{project.name.split(' ').map(word => word[0]).slice(0, 2).join('')}</span><div className="project-name"><h2>{project.name}</h2>{!compact && <p>{project.description}</p>}</div><Status value={project.status}/><span className="project-owner">{project.ownerName}<small>Project owner</small></span><span className="row-arrow">↗</span></Link>)}{filtered.length === 0 && <div className="empty"><h2>No projects found</h2><p>Try a different name or status.</p><button className="text-button" onClick={() => setParams({})}>Clear filters</button></div>}</div><p className="workspace-note"><span className="live-dot"/> A little progress, every day.</p></>;
}
const LoadingProjects = withLoading(ProjectsPage);
export function ProjectsRoute() { const { resource, retry } = useResource(fetchProjects); return <LoadingProjects isLoading={resource.status === 'loading'} resource={resource.status === 'loading' ? { status: 'error', message: '' } : resource} retry={retry}/>; }
function OverviewPage({ resource, retry }: { resource: Exclude<Resource<Project[]>, { status: 'loading' }>; retry: () => void }) {
  if (resource.status === 'error') return <ErrorState message={resource.message} retry={retry}/>;
  return <><div className="page-heading"><div><p className="eyebrow">THE BIG PICTURE</p><h1>Overview<span>.</span></h1><p>Small steps. Shared ambition. Here’s where we stand.</p></div><Link className="button" to="projects">Explore projects ↗</Link></div><div className="stats">{statuses.map(status => <Link to={`projects?status=${status}`} className="stat" key={status}><Status value={status}/><strong>{resource.data.filter(project => project.status === status).length.toString().padStart(2, '0')}</strong><span>View projects ↗</span></Link>)}</div><div className="overview-banner"><p className="eyebrow">BETTER, TOGETHER</p><h2>Make room for<br />what’s next.</h2><p>Keep the whole team moving in the same direction.</p><Link to="projects">See all {resource.data.length} projects →</Link><span aria-hidden="true">✳</span></div></>;
}
const LoadingOverview = withLoading(OverviewPage);
export function OverviewRoute() { const { resource, retry } = useResource(fetchProjects); return <LoadingOverview isLoading={resource.status === 'loading'} resource={resource.status === 'loading' ? { status: 'error', message: '' } : resource} retry={retry}/>; }
function ProjectDetailsPage({ resource, retry }: { resource: Exclude<Resource<Project | null>, { status: 'loading' }>; retry: () => void }) {
  const navigate = useNavigate(); const location = useLocation();
  function back() { const state: unknown = location.state; if (typeof state === 'object' && state !== null && 'fromApp' in state && state.fromApp === true) navigate(-1); else navigate('/dashboard/projects'); }
  if (resource.status === 'error') return <ErrorState message={resource.message} retry={retry}/>;
  const project = resource.data;
  return <><button className="back-button" onClick={back}>← Back</button>{!project ? <div className="empty"><h1>Project not found</h1><p>This project may have moved or no longer exists.</p></div> : <><div className="page-heading"><div><p className="eyebrow">PROJECT / {project.id.toUpperCase()}</p><h1>{project.name}<span>.</span></h1><p>{project.description}</p></div><Status value={project.status}/></div><div className="detail-card"><h2>Project at a glance</h2><dl><div><dt>Project owner</dt><dd>{project.ownerName}</dd></div><div><dt>Status</dt><dd><Status value={project.status}/></dd></div><div><dt>Start date</dt><dd>{formatDate(project.startDate)}</dd></div><div><dt>Due date</dt><dd>{formatDate(project.dueDate)}</dd></div></dl></div></>}</>;
}
const LoadingDetails = withLoading(ProjectDetailsPage);
export function ProjectDetailsRoute() {
  const { projectId } = useParams();
  const fetcher = useCallback(() => fetchProject(projectId ?? ''), [projectId]);
  const { resource, retry } = useResource(fetcher);
  return <LoadingDetails isLoading={resource.status === 'loading'} resource={resource.status === 'loading' ? { status: 'error', message: '' } : resource} retry={retry}/>;
}
