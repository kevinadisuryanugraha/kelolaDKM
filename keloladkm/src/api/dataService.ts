/**
 * Data service layer — API-first with localStorage fallback.
 * Tries backend API; on failure falls back to localStorage + mock data.
 */
import * as api from './client';
import { snakeToCamel, camelToSnake } from '../lib/utils';
import {
  FINANCIAL_TRANSACTIONS, COA_ACCOUNTS, BUDGET_PLANS,
  DONATION_CAMPAIGNS, DONOR_RECORDS,
  QURBAN_PARTICIPANTS, INVENTORY_ITEMS, ROOM_BOOKINGS,
  OFFICIAL_LETTERS, AUDIT_LOGS, KAJIAN_EVENTS
} from '../data/mockData';

const STORAGE_KEYS = {
  transactions: 'dkm_transactions',
  accounts: 'dkm_accounts',
  budgets: 'dkm_budgets',
  campaigns: 'dkm_campaigns',
  donorRecords: 'dkm_donorRecords',
  qurbanParticipants: 'dkm_qurbanParticipants',
  inventoryItems: 'dkm_inventoryItems',
  roomBookings: 'dkm_roomBookings',
  letters: 'dkm_letters',
  auditLogs: 'dkm_auditLogs',
  kajianEvents: 'dkm_kajianEvents',
  authUser: 'dkm_authUser',
  token: 'dkm_token',
};

// ── Storage helpers ──
const load = <T,>(key: string, fallback: T): T => {
  try { const raw = localStorage.getItem(key); return raw ? JSON.parse(raw) : fallback; }
  catch { return fallback; }
};

const save = (key: string, data: unknown) => {
  try { localStorage.setItem(key, JSON.stringify(data)); } catch { /* quota exceeded */ }
};

// ── API-first fetch with localStorage fallback ──
async function apiFirst<T>(apiCall: () => Promise<any>, storageKey: string, fallback: T): Promise<T> {
  try {
    const res = await apiCall();
    // Laravel returns snake_case; the frontend types use camelCase.
    const data = snakeToCamel(res?.data?.data ?? res?.data ?? res);
    if (Array.isArray(data)) { save(storageKey, data); return data as T; }
    if (data && typeof data === 'object') { save(storageKey, data); return data as T; }
    return load(storageKey, fallback);
  } catch {
    return load(storageKey, fallback);
  }
}

// ── Public API (fetches all data, hydrates context) ──

export async function fetchAllDashboardData() {
  const [transactions, accounts, budgets, campaigns, donorRecords, qurbanParticipants,
    inventoryItems, roomBookings, letters, auditLogs, kajianEvents] = await Promise.all([
    apiFirst(() => api.getTransactions(), STORAGE_KEYS.transactions, FINANCIAL_TRANSACTIONS),
    apiFirst(() => api.getAccounts(), STORAGE_KEYS.accounts, COA_ACCOUNTS),
    apiFirst(() => api.getBudgets(), STORAGE_KEYS.budgets, BUDGET_PLANS),
    apiFirst(() => api.getCampaigns(), STORAGE_KEYS.campaigns, DONATION_CAMPAIGNS),
    apiFirst(() => api.getDonorRecords?.() ?? Promise.resolve(DONOR_RECORDS), STORAGE_KEYS.donorRecords, DONOR_RECORDS),
    apiFirst(() => api.getQurbanParticipants?.() ?? Promise.resolve(QURBAN_PARTICIPANTS), STORAGE_KEYS.qurbanParticipants, QURBAN_PARTICIPANTS),
    apiFirst(() => api.getInventoryItems?.() ?? Promise.resolve(INVENTORY_ITEMS), STORAGE_KEYS.inventoryItems, INVENTORY_ITEMS),
    apiFirst(() => api.getRoomBookings?.() ?? Promise.resolve(ROOM_BOOKINGS), STORAGE_KEYS.roomBookings, ROOM_BOOKINGS),
    apiFirst(() => api.getLetters?.() ?? Promise.resolve(OFFICIAL_LETTERS), STORAGE_KEYS.letters, OFFICIAL_LETTERS),
    apiFirst(() => api.getAuditLogs?.() ?? Promise.resolve(AUDIT_LOGS), STORAGE_KEYS.auditLogs, AUDIT_LOGS),
    apiFirst(() => api.getKajianEvents?.() ?? Promise.resolve(KAJIAN_EVENTS), STORAGE_KEYS.kajianEvents, KAJIAN_EVENTS),
  ]);

  return { transactions, accounts, budgets, campaigns, donorRecords, qurbanParticipants, inventoryItems, roomBookings, letters, auditLogs, kajianEvents };
}

// ── Mutations ──
// Each mutation returns the server-created record (snake_case → camelCase),
// or null when the backend is offline. Offline mutations are queued and
// retried later via flushPendingMutations().

const PENDING_KEY = 'dkm_pending_mutations';

type PendingMutation = { type: string; payload: any; queuedAt: number };

export function getPendingMutations(): PendingMutation[] {
  try { return JSON.parse(localStorage.getItem(PENDING_KEY) || '[]'); }
  catch { return []; }
}

export function clearPendingMutations(): void {
  try { localStorage.removeItem(PENDING_KEY); } catch {}
}

function enqueueMutation(type: string, payload: any): void {
  try {
    const queue = getPendingMutations();
    queue.push({ type, payload, queuedAt: Date.now() });
    localStorage.setItem(PENDING_KEY, JSON.stringify(queue));
  } catch { /* quota exceeded */ }
}

async function mutate(type: string, apiCall: () => Promise<any>, payload: any) {
  try {
    const res = await apiCall();
    return snakeToCamel(res?.data?.data ?? res?.data ?? res);
  } catch {
    enqueueMutation(type, payload);
    return null;
  }
}

const MUTATION_HANDLERS: Record<string, (payload: any) => Promise<any>> = {
  transaction: (p) => api.createTransaction(camelToSnake(p)),
  campaign: (p) => api.createCampaign(camelToSnake(p)),
  donor_record: (p) => api.createDonorRecord(camelToSnake(p)),
  qurban_participant: (p) => api.createQurbanParticipant(camelToSnake(p)),
  inventory_item: (p) => api.createInventoryItem(camelToSnake(p)),
  room_booking: (p) => api.createRoomBooking(camelToSnake(p)),
  letter: (p) => api.createLetter(camelToSnake(p)),
  kajian_event: (p) => api.createKajianEvent(camelToSnake(p)),
};

export async function flushPendingMutations(): Promise<void> {
  const queue = getPendingMutations();
  if (queue.length === 0) return;

  const remaining: PendingMutation[] = [];
  for (const item of queue) {
    const handler = MUTATION_HANDLERS[item.type];
    if (!handler) continue;
    try {
      await handler(item.payload);
    } catch {
      remaining.push(item);
    }
  }

  try { localStorage.setItem(PENDING_KEY, JSON.stringify(remaining)); } catch {}
}

export const createTransaction = (data: any) => mutate('transaction', () => api.createTransaction(camelToSnake(data)), data);
export const createCampaign = (data: any) => mutate('campaign', () => api.createCampaign(camelToSnake(data)), data);
export const createDonorRecord = (data: any) => mutate('donor_record', () => api.createDonorRecord(camelToSnake(data)), data);
export const createQurbanParticipant = (data: any) => mutate('qurban_participant', () => api.createQurbanParticipant(camelToSnake(data)), data);
export const createInventoryItem = (data: any) => mutate('inventory_item', () => api.createInventoryItem(camelToSnake(data)), data);
export const createRoomBooking = (data: any) => mutate('room_booking', () => api.createRoomBooking(camelToSnake(data)), data);
export const createLetter = (data: any) => mutate('letter', () => api.createLetter(camelToSnake(data)), data);
export const createKajianEvent = (data: any) => mutate('kajian_event', () => api.createKajianEvent(camelToSnake(data)), data);

export { STORAGE_KEYS, load, save };
