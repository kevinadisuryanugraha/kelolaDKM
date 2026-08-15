/**
 * Data service layer — API-first with localStorage fallback.
 * Tries backend API; on failure falls back to localStorage + mock data.
 */
import * as api from './client';
import {
  FINANCIAL_TRANSACTIONS, DONATION_CAMPAIGNS, DONOR_RECORDS,
  QURBAN_PARTICIPANTS, INVENTORY_ITEMS, ROOM_BOOKINGS,
  OFFICIAL_LETTERS, AUDIT_LOGS, KAJIAN_EVENTS
} from '../data/mockData';

const STORAGE_KEYS = {
  transactions: 'dkm_transactions',
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
    // Normalize response: { data: [...] } or { data: { data: [...] } }
    const data = res?.data?.data ?? res?.data ?? res;
    if (Array.isArray(data)) { save(storageKey, data); return data as T; }
    if (data && typeof data === 'object') { save(storageKey, data); return data as T; }
    return load(storageKey, fallback);
  } catch {
    return load(storageKey, fallback);
  }
}

// ── Public API (fetches all data, hydrates context) ──

export async function fetchAllDashboardData() {
  const [transactions, campaigns, donorRecords, qurbanParticipants,
    inventoryItems, letters, auditLogs, kajianEvents] = await Promise.all([
    apiFirst(() => api.getTransactions(), STORAGE_KEYS.transactions, FINANCIAL_TRANSACTIONS),
    apiFirst(() => api.getCampaigns(), STORAGE_KEYS.campaigns, DONATION_CAMPAIGNS),
    apiFirst(() => api.getDonorRecords?.() ?? Promise.resolve(DONOR_RECORDS), STORAGE_KEYS.donorRecords, DONOR_RECORDS),
    apiFirst(() => api.getQurbanParticipants?.() ?? Promise.resolve(QURBAN_PARTICIPANTS), STORAGE_KEYS.qurbanParticipants, QURBAN_PARTICIPANTS),
    apiFirst(() => api.getInventoryItems?.() ?? Promise.resolve(INVENTORY_ITEMS), STORAGE_KEYS.inventoryItems, INVENTORY_ITEMS),
    apiFirst(() => api.getLetters?.() ?? Promise.resolve(OFFICIAL_LETTERS), STORAGE_KEYS.letters, OFFICIAL_LETTERS),
    apiFirst(() => api.getAuditLogs?.() ?? Promise.resolve(AUDIT_LOGS), STORAGE_KEYS.auditLogs, AUDIT_LOGS),
    apiFirst(() => api.getKajianEvents?.() ?? Promise.resolve(KAJIAN_EVENTS), STORAGE_KEYS.kajianEvents, KAJIAN_EVENTS),
  ]);

  return { transactions, campaigns, donorRecords, qurbanParticipants, inventoryItems, letters, auditLogs, kajianEvents };
}

// ── Mutations (API-first, localStorage on failure) ──

export async function createTransaction(data: any) {
  try { await api.createTransaction(data); } catch { /* offline */ }
}

export async function createCampaign(data: any) {
  try { await api.createCampaign(data); } catch { /* offline */ }
}

export async function createDonorRecord(data: any) {
  try { await api.createDonorRecord(data); } catch { /* offline */ }
}

export async function createQurbanParticipant(data: any) {
  try { await api.createQurbanParticipant(data); } catch { /* offline */ }
}

export async function createInventoryItem(data: any) {
  try { await api.createInventoryItem(data); } catch { /* offline */ }
}

export async function createLetter(data: any) {
  try { await api.createLetter(data); } catch { /* offline */ }
}

export async function createKajianEvent(data: any) {
  try { await api.createKajianEvent(data); } catch { /* offline */ }
}

export { STORAGE_KEYS, load, save };
