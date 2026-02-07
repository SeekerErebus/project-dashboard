/**
 * FlowDesk Demo Data Store — Static JSON, no API.
 *
 * Provides the same public API surface as the product store so that
 * page scripts work identically, but reads from static JSON imports
 * and uses in-memory state (localStorage-backed for persistence across
 * page navigations during a demo session).
 */

// ── Types ──────────────────────────────────────────────────────────────────────

export interface Project {
  id: string;
  title: string;
  client: string;
  status: 'lead' | 'active' | 'in-progress' | 'review' | 'completed';
  priority: 'high' | 'medium' | 'low';
  budget: number;
  spent: number;
  startDate: string | null;
  dueDate: string | null;
  progress: number;
  description: string;
  scope: string[];
  notes: string;
  color: string;
}

export interface Client {
  id: string;
  name: string;
  contact: string;
  email: string;
  phone: string;
  company: string;
  industry: string;
  status: 'active' | 'lead' | 'inactive';
  since: string;
  totalRevenue: number;
  avatar: string;
  notes: string;
}

export interface Task {
  id: string;
  title: string;
  project: string | null;
  priority: 'high' | 'medium' | 'low';
  status: 'todo' | 'in-progress' | 'done';
  dueDate: string;
  description: string;
  prompt: string;
  assignee: string;
  completedAt: string;
}

export interface ActivityItem {
  id: string;
  type: string;
  message: string;
  project: string | null;
  timestamp: string;
}

export interface MonthlyRevenue {
  month: string;
  revenue: number;
  expenses: number;
}

export interface RevenueSummary {
  thisMonth: number;
  lastMonth: number;
  thisQuarter: number;
  ytd: number;
  pendingInvoices: number;
  overdueInvoices: number;
}

export interface RevenueData {
  monthly: MonthlyRevenue[];
  summary: RevenueSummary;
}

export interface FlowDeskData {
  version: number;
  projects: Project[];
  clients: Client[];
  tasks: Task[];
  activity: ActivityItem[];
  revenue: RevenueData;
}

// ── Static seed data imports ────────────────────────────────────────────────────

import seedProjects from '../data/projects.json';
import seedClients from '../data/clients.json';
import seedTasks from '../data/tasks.json';
import seedActivity from '../data/activity.json';
import seedRevenue from '../data/revenue.json';

// ── In-memory state ────────────────────────────────────────────────────────────

const LS_KEY = 'flowdesk-demo-data';

function loadSeed(): FlowDeskData {
  return {
    version: 1,
    projects: structuredClone(seedProjects) as Project[],
    clients: structuredClone(seedClients) as Client[],
    tasks: (structuredClone(seedTasks) as any[]).map(migrateTask),
    activity: structuredClone(seedActivity) as ActivityItem[],
    revenue: structuredClone(seedRevenue) as RevenueData,
  };
}

function migrateTask(task: Partial<Task>): Task {
  return {
    id: task.id || '',
    title: task.title || '',
    project: task.project ?? null,
    priority: task.priority || 'medium',
    status: task.status || 'todo',
    dueDate: task.dueDate || '',
    description: task.description || '',
    prompt: task.prompt || '',
    assignee: task.assignee || '',
    completedAt: task.completedAt || '',
  };
}

let _data: FlowDeskData | null = null;

function getData(): FlowDeskData {
  if (_data) return _data;

  // Try loading from localStorage for session persistence
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem(LS_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        parsed.tasks = (parsed.tasks || []).map(migrateTask);
        _data = parsed;
        return _data;
      }
    } catch {
      // Ignore parse errors
    }
  }

  _data = loadSeed();
  return _data;
}

function persist() {
  if (typeof window !== 'undefined' && _data) {
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(_data));
    } catch {
      // Ignore quota errors
    }
  }
}

// ── Public API ──────────────────────────────────────────────────────────────────

/** Initialize the store. In the demo this is synchronous but returns a promise for API compat. */
export async function initStore(): Promise<FlowDeskData> {
  return getData();
}

/** Refresh cache — in demo, resets to seed data */
export async function refreshCache(): Promise<FlowDeskData> {
  _data = loadSeed();
  persist();
  return _data;
}

// ── Current User ──────────────────────────────────────────────────────────────

export interface CurrentUser {
  name: string;
  assigneeId: string;
  initials: string;
  role: string;
}

export function getCurrentUser(): CurrentUser {
  return {
    name: 'Alex Morgan',
    assigneeId: 'alex',
    initials: 'AM',
    role: 'Freelancer',
  };
}

export function isAssignedToCurrentUser(task: Task): boolean {
  const user = getCurrentUser();
  const a = task.assignee.toLowerCase().trim();
  return a === user.assigneeId || a === user.name.toLowerCase();
}

// ── Projects ────────────────────────────────────────────────────────────────────

export function getProjects(): Project[] {
  return getData().projects;
}

export function getProject(id: string): Project | undefined {
  return getData().projects.find((p) => p.id === id);
}

export function addProject(data: Omit<Project, 'id'>): Project {
  const id = `proj-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
  const project: Project = { id, ...data };
  getData().projects.push(project);
  persist();
  return project;
}

export function updateProject(id: string, updates: Partial<Omit<Project, 'id'>>): Project | undefined {
  const d = getData();
  const idx = d.projects.findIndex((p) => p.id === id);
  if (idx === -1) return undefined;
  d.projects[idx] = { ...d.projects[idx], ...updates };
  persist();
  return d.projects[idx];
}

export function deleteProject(id: string): boolean {
  const d = getData();
  const idx = d.projects.findIndex((p) => p.id === id);
  if (idx === -1) return false;
  d.projects.splice(idx, 1);
  d.tasks = d.tasks.filter((t) => t.project !== id);
  persist();
  return true;
}

// ── Clients ─────────────────────────────────────────────────────────────────────

export function getClients(): Client[] {
  return getData().clients;
}

export function getClient(id: string): Client | undefined {
  return getData().clients.find((c) => c.id === id);
}

export function addClient(data: Omit<Client, 'id'>): Client {
  const id = `client-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
  const client: Client = { id, ...data };
  getData().clients.push(client);
  persist();
  return client;
}

export function updateClient(id: string, updates: Partial<Omit<Client, 'id'>>): Client | undefined {
  const d = getData();
  const idx = d.clients.findIndex((c) => c.id === id);
  if (idx === -1) return undefined;
  d.clients[idx] = { ...d.clients[idx], ...updates };
  persist();
  return d.clients[idx];
}

export function deleteClient(id: string): boolean {
  const d = getData();
  const idx = d.clients.findIndex((c) => c.id === id);
  if (idx === -1) return false;
  d.clients.splice(idx, 1);
  persist();
  return true;
}

// ── Tasks ───────────────────────────────────────────────────────────────────────

export function getTasks(): Task[] {
  return getData().tasks;
}

export function getTask(id: string): Task | undefined {
  return getData().tasks.find((t) => t.id === id);
}

export function addTask(data: Partial<Omit<Task, 'id'>> & { title: string }): Task {
  const id = `task-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
  const task: Task = migrateTask({ id, ...data });
  getData().tasks.push(task);
  persist();
  return task;
}

export function updateTask(id: string, updates: Partial<Omit<Task, 'id'>>): Task | undefined {
  const d = getData();
  const idx = d.tasks.findIndex((t) => t.id === id);
  if (idx === -1) return undefined;

  const oldStatus = d.tasks[idx].status;
  if (updates.status === 'done' && oldStatus !== 'done') {
    updates.completedAt = new Date().toISOString();
  } else if (updates.status && updates.status !== 'done' && oldStatus === 'done') {
    updates.completedAt = '';
  }

  d.tasks[idx] = { ...d.tasks[idx], ...updates };
  persist();
  return d.tasks[idx];
}

export function deleteTask(id: string): boolean {
  const d = getData();
  const idx = d.tasks.findIndex((t) => t.id === id);
  if (idx === -1) return false;
  d.tasks.splice(idx, 1);
  persist();
  return true;
}

// ── Activity ────────────────────────────────────────────────────────────────────

export function getActivity(): ActivityItem[] {
  return getData().activity;
}

// ── Revenue ─────────────────────────────────────────────────────────────────────

export function getRevenue(): RevenueData {
  return getData().revenue;
}

// ── Legacy compat ───────────────────────────────────────────────────────────────

/** Reset to seed data */
export function resetToSeed(): void {
  _data = loadSeed();
  persist();
}

/** Export all data as JSON string */
export function exportData(): string {
  return JSON.stringify(getData(), null, 2);
}

/** @deprecated — use refreshCache() instead */
export async function syncFromDisk(): Promise<boolean> {
  try {
    await refreshCache();
    return true;
  } catch {
    return false;
  }
}
