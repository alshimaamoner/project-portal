import type { Project, User } from '../types';
const LATENCY_MS = 700;
const FAILURE_RATE = 0.2;
const users: User[] = [
  { id: 'u1', username: 'sara', name: 'Sara Mahmoud', role: 'admin' },
  { id: 'u2', username: 'youssef', name: 'Youssef Adel', role: 'member' },
];
const projects: Project[] = [
  { id: 'p1', name: 'Customer Mobile App', description: 'Native app for account management and payments.', status: 'active', ownerName: 'Sara Mahmoud', startDate: '2026-03-01', dueDate: '2026-12-15' },
  { id: 'p2', name: 'Billing Migration', description: 'Move invoicing to the new billing platform.', status: 'on_hold', ownerName: 'Youssef Adel', startDate: '2026-05-10', dueDate: '2027-02-28' },
  { id: 'p3', name: 'Web Portal Redesign', description: 'Refresh the self-service web portal.', status: 'active', ownerName: 'Sara Mahmoud', startDate: '2026-07-01', dueDate: '2027-0131' },
  { id: 'p4', name: 'Support Chatbot', description: 'First-line chatbot for common support questions.', status: 'completed', ownerName: 'Youssef Adel', startDate: '2026-01-15', dueDate: '2026-09-30' },
  { id: 'p5', name: 'Analytics Dashboard', description: 'Internal dashboard for product usage metrics.', status: 'active', ownerName: 'Youssef Adel', startDate: '2026-08-20', dueDate: '2027-03-31' },
];
function simulate<T>(fn: () => T): Promise<T> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() < FAILURE_RATE) {
        reject(new Error('Network error: please try again.'));
        return;
      }
      try {
        resolve(fn());
      } catch (err) {
        reject(err);
      }
    }, LATENCY_MS);
  });
}
export function login(username: string): Promise<User> {
  return simulate(() => {
    const user = users.find((u) => u.username === username.trim().toLowerCase());
    if (!user) throw new Error('Unknown username.');
    return { ...user };
  });
}
export function fetchProjects(): Promise<Project[]> {
  return simulate(() => projects.map((p) => ({ ...p })));
}
export function fetchProject(id: string): Promise<Project | null> {
  return simulate(() => {
    const project = projects.find((p) => p.id === id);
    return project ? { ...project } : null;});
}
