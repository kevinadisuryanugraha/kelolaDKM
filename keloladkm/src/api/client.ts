import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
  headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
  withCredentials: true,
});

// Auto-attach token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('dkm_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auth
export const login = (email: string, password: string) =>
  api.post('/login', { email, password }).then(r => r.data);

export const logout = () =>
  api.post('/logout').then(r => r.data);

export const getMe = () =>
  api.get('/me').then(r => r.data);

// Financial
export const getTransactions = (params?: any) =>
  api.get('/financial-transactions', { params }).then(r => r.data);

export const createTransaction = (data: any) =>
  api.post('/financial-transactions', data).then(r => r.data);

export const getAccounts = () =>
  api.get('/financial-accounts').then(r => r.data);

export const getBudgets = () =>
  api.get('/budget-plans').then(r => r.data);

// Donations
export const getCampaigns = () =>
  api.get('/donation-campaigns').then(r => r.data);

export const createCampaign = (data: any) =>
  api.post('/donation-campaigns', data).then(r => r.data);

export const getDonorRecords = () =>
  api.get('/donor-records').then(r => r.data);

export const createDonorRecord = (data: any) =>
  api.post('/donor-records', data).then(r => r.data);

// Qurban
export const getQurbanParticipants = () =>
  api.get('/qurban-participants').then(r => r.data);

export const createQurbanParticipant = (data: any) =>
  api.post('/qurban-participants', data).then(r => r.data);

// Inventory
export const getInventoryItems = () =>
  api.get('/inventory-items').then(r => r.data);

export const createInventoryItem = (data: any) =>
  api.post('/inventory-items', data).then(r => r.data);

// Kajian
export const getKajianEvents = () =>
  api.get('/kajian-events').then(r => r.data);

export const createKajianEvent = (data: any) =>
  api.post('/kajian-events', data).then(r => r.data);

// Letters
export const getLetters = () =>
  api.get('/official-letters').then(r => r.data);

export const createLetter = (data: any) =>
  api.post('/official-letters', data).then(r => r.data);

// CMS
export const getArticles = () =>
  api.get('/cms-articles').then(r => r.data);

// Audit
export const getAuditLogs = () =>
  api.get('/audit-logs').then(r => r.data);

// Dashboard
export const getDashboardOverview = () =>
  api.get('/dashboard/overview').then(r => r.data);

export default api;
