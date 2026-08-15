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
// Each mutation returns the server-created record (snake_case → camelCase)
// or null when the backend is offline.

async function mutate(apiCall: () => Promise<any>) {
  try {
    const res = await apiCall();
    return snakeToCamel(res?.data?.data ?? res?.data ?? res);
  } catch {
    return null;
  }
}

export const createTransaction = (data: any) => mutate(() => api.createTransaction(camelToSnake(data)));
export const createCampaign = (data: any) => mutate(() => api.createCampaign(camelToSnake(data)));
export const createDonorRecord = (data: any) => mutate(() => api.createDonorRecord(camelToSnake(data)));
export const createQurbanParticipant = (data: any) => mutate(() => api.createQurbanParticipant(camelToSnake(data)));
export const createInventoryItem = (data: any) => mutate(() => api.createInventoryItem(camelToSnake(data)));
export const createRoomBooking = (data: any) => mutate(() => api.createRoomBooking(camelToSnake(data)));
export const createLetter = (data: any) => mutate(() => api.createLetter(camelToSnake(data)));
export const createKajianEvent = (data: any) => mutate(() => api.createKajianEvent(camelToSnake(data)));

export { STORAGE_KEYS, load, save };
