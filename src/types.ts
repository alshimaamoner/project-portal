export type Role = 'admin' | 'member';
export type ProjectStatus = 'active' | 'on_hold' | 'completed';
export interface User {
  id: string;
  username: string;
  name: string;
  role: Role;
}
export interface Project {
  id: string;
  name: string;
  description: string;
  status: ProjectStatus;
  ownerName: string;
  startDate: string; // YYYY-MM-DD
  dueDate: string; // YYYY-MM-DD
}
