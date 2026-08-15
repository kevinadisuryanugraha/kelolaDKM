import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  UserRole,
  FinancialAccount,
  FinancialTransaction,
  BudgetPlan,
  DonationCampaign,
  DonorRecord,
  QurbanParticipant,
  InventoryItem,
  RoomBooking,
  OfficialLetter,
  AuditLog,
  KajianEvent
} from '../types';
import {
  FINANCIAL_TRANSACTIONS,
  COA_ACCOUNTS,
  BUDGET_PLANS,
  DONATION_CAMPAIGNS,
  DONOR_RECORDS,
  QURBAN_PARTICIPANTS,
  INVENTORY_ITEMS,
  ROOM_BOOKINGS,
  OFFICIAL_LETTERS,
  AUDIT_LOGS,
  KAJIAN_EVENTS
} from '../data/mockData';
import {
  fetchAllDashboardData,
  createTransaction as apiCreateTransaction,
  createCampaign as apiCreateCampaign,
  createDonorRecord as apiCreateDonorRecord,
  createQurbanParticipant as apiCreateQurban,
  createInventoryItem as apiCreateInventory,
  createLetter as apiCreateLetter,
  createKajianEvent as apiCreateKajian,
} from '../api/dataService';

interface ToastNotification {
  id: string;
  type: 'success' | 'info' | 'error';
  message: string;
}

interface AppContextType {
  activeAppTab: 'public' | 'dashboard';
  setActiveAppTab: (tab: 'public' | 'dashboard') => void;
  publicSubTab: string;
  setPublicSubTab: (tab: string) => void;
  dashboardSubTab: string;
  setDashboardSubTab: (tab: string) => void;
  
  // Auth
  isAuthenticated: boolean;
  authUser: any;
  login: (token: string, user: any) => void;
  logout: () => void;
  showLoginModal: boolean;
  setShowLoginModal: (show: boolean) => void;
  
  // Role simulation
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  
  // Data states
  transactions: FinancialTransaction[];
  addTransaction: (tx: Omit<FinancialTransaction, 'id' | 'status' | 'refNumber'>) => void;
  approveTransaction: (id: string) => void;

  accounts: FinancialAccount[];
  budgets: BudgetPlan[];
  
  campaigns: DonationCampaign[];
  addCampaign: (campaign: Omit<DonationCampaign, 'id' | 'collectedAmount' | 'donorCount'>) => void;
  
  donorRecords: DonorRecord[];
  addDonorRecord: (donor: Omit<DonorRecord, 'id' | 'date' | 'status'>) => void;
  
  qurbanParticipants: QurbanParticipant[];
  addQurbanParticipant: (participant: Omit<QurbanParticipant, 'id' | 'couponCode' | 'isDistributed'>) => void;
  toggleQurbanDistributed: (id: string) => void;
  
  inventoryItems: InventoryItem[];
  addInventoryItem: (item: Omit<InventoryItem, 'id' | 'code' | 'qrCode'>) => void;
  
  roomBookings: RoomBooking[];
  addRoomBooking: (booking: Omit<RoomBooking, 'id' | 'status'>) => void;
  
  letters: OfficialLetter[];
  addLetter: (letter: Omit<OfficialLetter, 'id' | 'status'>) => void;
  
  auditLogs: AuditLog[];
  addAuditLog: (action: string, module: string, details: string) => void;

  kajianEvents: KajianEvent[];
  addKajianEvent: (event: Omit<KajianEvent, 'id'>) => void;
  
  // Toasts
  toasts: ToastNotification[];
  showToast: (message: string, type?: 'success' | 'info' | 'error') => void;
  
  // Running text (public website ticker)
  runningText: string;
  setRunningText: (text: string) => void;

  // Export Modal state
  exportModalData: { isOpen: boolean; title: string; data: any[] };
  openExportModal: (title: string, data: any[]) => void;
  closeExportModal: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // ── localStorage helpers ──
  const loadFromStorage = <T,>(key: string, fallback: T): T => {
    try { const raw = localStorage.getItem(`dkm_${key}`); return raw ? JSON.parse(raw) : fallback; }
    catch { return fallback; }
  };

  const getInitialTab = (): 'public' | 'dashboard' => {
    try {
      const params = new URLSearchParams(window.location.search);
      const tab = params.get('tab');
      if (tab === 'dashboard' || tab === 'public') return tab;
      const raw = localStorage.getItem('dkm_activeAppTab');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed === 'dashboard' || parsed === 'public') return parsed;
      }
    } catch { /* fallback */ }
    return 'public';
  };

  const getInitialSubTab = (type: 'public' | 'dashboard'): string => {
    try {
      const params = new URLSearchParams(window.location.search);
      const urlTab = params.get('tab') || 'public';
      const urlSub = params.get('sub');
      if (urlTab === type && urlSub) return urlSub;
      const raw = localStorage.getItem(`dkm_${type}SubTab`);
      if (raw) return JSON.parse(raw);
    } catch { /* fallback */ }
    return type === 'dashboard' ? 'overview' : 'home';
  };

  const [activeAppTab, setActiveAppTab] = useState<'public' | 'dashboard'>(getInitialTab);
  const [publicSubTab, setPublicSubTab] = useState<string>(() => getInitialSubTab('public'));
  const [dashboardSubTab, setDashboardSubTab] = useState<string>(() => getInitialSubTab('dashboard'));

  useEffect(() => {
    localStorage.setItem('dkm_activeAppTab', JSON.stringify(activeAppTab));
  }, [activeAppTab]);

  useEffect(() => {
    localStorage.setItem('dkm_publicSubTab', JSON.stringify(publicSubTab));
  }, [publicSubTab]);

  useEffect(() => {
    localStorage.setItem('dkm_dashboardSubTab', JSON.stringify(dashboardSubTab));
  }, [dashboardSubTab]);

  // Auth
  const [authUser, setAuthUser] = useState<any>(() => loadFromStorage('authUser', null));
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => !!localStorage.getItem('dkm_token'));
  const [showLoginModal, setShowLoginModal] = useState(false);

  const login = async (token: string, user: any) => {
    localStorage.setItem('dkm_token', token);
    localStorage.setItem('dkm_authUser', JSON.stringify(user));
    setAuthUser(user);
    setIsAuthenticated(true);
    setCurrentRole(user.role || 'ketua_dkm');
    setShowLoginModal(false);
    setActiveAppTab('dashboard');

    // Data hydration happens in a dedicated effect below (covers fresh login
    // and page reload with an existing token).
  };

  const logout = () => {
    localStorage.removeItem('dkm_token');
    localStorage.removeItem('dkm_authUser');
    setAuthUser(null);
    setIsAuthenticated(false);
    setActiveAppTab('public');
  };

  const [currentRole, setCurrentRole] = useState<UserRole>('ketua_dkm');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => loadFromStorage('darkMode', false));
  
  // Apply dark class to <html>
  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
    localStorage.setItem('dkm_darkMode', JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  const [transactions, setTransactions] = useState<FinancialTransaction[]>(() => loadFromStorage('transactions', FINANCIAL_TRANSACTIONS));
  const [accounts, setAccounts] = useState<FinancialAccount[]>(() => loadFromStorage('accounts', COA_ACCOUNTS));
  const [budgets, setBudgets] = useState<BudgetPlan[]>(() => loadFromStorage('budgets', BUDGET_PLANS));
  const [campaigns, setCampaigns] = useState<DonationCampaign[]>(DONATION_CAMPAIGNS);
  const [donorRecords, setDonorRecords] = useState<DonorRecord[]>(DONOR_RECORDS);
  const [qurbanParticipants, setQurbanParticipants] = useState<QurbanParticipant[]>(QURBAN_PARTICIPANTS);
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>(INVENTORY_ITEMS);
  const [roomBookings, setRoomBookings] = useState<RoomBooking[]>(ROOM_BOOKINGS);
  const [letters, setLetters] = useState<OfficialLetter[]>(OFFICIAL_LETTERS);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(AUDIT_LOGS);
  const [kajianEvents, setKajianEvents] = useState<KajianEvent[]>(KAJIAN_EVENTS);

  // Hydrate dashboard data from the API whenever the user is authenticated
  // (covers both a fresh login and a page reload with an existing token).
  useEffect(() => {
    if (!isAuthenticated) return;
    (async () => {
      try {
        const data = await fetchAllDashboardData();
        setTransactions(data.transactions);
        setAccounts(data.accounts);
        setBudgets(data.budgets);
        setCampaigns(data.campaigns);
        setDonorRecords(data.donorRecords);
        setQurbanParticipants(data.qurbanParticipants);
        setInventoryItems(data.inventoryItems);
        setLetters(data.letters);
        setAuditLogs(data.auditLogs);
        setKajianEvents(data.kajianEvents);
      } catch {
        // Keep current (localStorage/mock) data when offline.
      }
    })();
  }, [isAuthenticated]);
  
  const [runningText, setRunningText] = useState<string>(
    '🕌 Selamat Datang di Masjid Jami Nurul Iman Pejaten Timur • Infaq Jumat Pekan Ini: Rp 8.450.000 • Kajian Subuh Sabtu Bersama KH. Ahmad Fauzi • Donasi QRIS Tersedia 24 Jam'
  );

  const [toasts, setToasts] = useState<ToastNotification[]>([]);
  const [exportModalData, setExportModalData] = useState<{ isOpen: boolean; title: string; data: any[] }>({
    isOpen: false,
    title: '',
    data: []
  });

  // ── Persist data mutations ──
  useEffect(() => { localStorage.setItem('dkm_transactions', JSON.stringify(transactions)); }, [transactions]);
  useEffect(() => { localStorage.setItem('dkm_accounts', JSON.stringify(accounts)); }, [accounts]);
  useEffect(() => { localStorage.setItem('dkm_budgets', JSON.stringify(budgets)); }, [budgets]);
  useEffect(() => { localStorage.setItem('dkm_campaigns', JSON.stringify(campaigns)); }, [campaigns]);
  useEffect(() => { localStorage.setItem('dkm_donorRecords', JSON.stringify(donorRecords)); }, [donorRecords]);
  useEffect(() => { localStorage.setItem('dkm_qurbanParticipants', JSON.stringify(qurbanParticipants)); }, [qurbanParticipants]);
  useEffect(() => { localStorage.setItem('dkm_inventoryItems', JSON.stringify(inventoryItems)); }, [inventoryItems]);
  useEffect(() => { localStorage.setItem('dkm_roomBookings', JSON.stringify(roomBookings)); }, [roomBookings]);
  useEffect(() => { localStorage.setItem('dkm_letters', JSON.stringify(letters)); }, [letters]);
  useEffect(() => { localStorage.setItem('dkm_auditLogs', JSON.stringify(auditLogs)); }, [auditLogs]);
  useEffect(() => { localStorage.setItem('dkm_kajianEvents', JSON.stringify(kajianEvents)); }, [kajianEvents]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    const id = 'toast-' + Date.now();
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const addAuditLog = (action: string, module: string, details: string) => {
    const newLog: AuditLog = {
      id: 'LOG-' + Math.floor(1000 + Math.random() * 9000),
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      userName: currentRole === 'ketua_dkm' ? 'H. M. Zamzami' : 'Pengurus DKM',
      userRole: currentRole.toUpperCase(),
      action,
      module,
      details,
      ipAddress: '180.252.110.15'
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  const addTransaction = (tx: Omit<FinancialTransaction, 'id' | 'status' | 'refNumber'>) => {
    const id = 'TRX-' + new Date().getFullYear() + '-' + String(transactions.length + 90).padStart(3, '0');
    const refNumber = (tx.type === 'Masuk' ? 'INV/' : 'EXP/') + new Date().toISOString().slice(0, 10).replace(/-/g, '') + '/' + String(transactions.length + 1).padStart(3, '0');
    
    const newTx: FinancialTransaction = {
      ...tx,
      id,
      status: 'Approved',
      refNumber
    };
    
    setTransactions((prev) => [newTx, ...prev]);
    apiCreateTransaction({ ...tx, ref_number: refNumber }).catch(() => {});
    addAuditLog('ADD_TRANSACTION', 'Keuangan', `Menambahkan transaksi ${tx.type}: Rp ${tx.amount.toLocaleString('id-ID')} (${tx.description})`);
    showToast(`Transaksi ${tx.type} sebesar Rp ${tx.amount.toLocaleString('id-ID')} berhasil dicatat!`, 'success');
  };

  const approveTransaction = (id: string) => {
    setTransactions((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: 'Approved' } : t))
    );
    addAuditLog('APPROVE_TRANSACTION', 'Keuangan', `Menyetujui transaksi ${id}`);
    showToast(`Transaksi ${id} telah disetujui`, 'success');
  };

  const addCampaign = (campaign: Omit<DonationCampaign, 'id' | 'collectedAmount' | 'donorCount'>) => {
    const id = 'CMP-' + String(campaigns.length + 1).padStart(2, '0');
    const newCmp: DonationCampaign = {
      ...campaign,
      id,
      collectedAmount: 0,
      donorCount: 0
    };
    setCampaigns((prev) => [newCmp, ...prev]);
    apiCreateCampaign({ ...campaign, collected_amount: 0, donor_count: 0 }).catch(() => {});
    addAuditLog('CREATE_CAMPAIGN', 'Donasi', `Membuat program campaign donasi baru: ${campaign.title}`);
    showToast(`Campaign ${campaign.title} berhasil dipublikasikan!`, 'success');
  };

  const addDonorRecord = (donor: Omit<DonorRecord, 'id' | 'date' | 'status'>) => {
    const id = 'DNR-' + Math.floor(100 + Math.random() * 900);
    const date = new Date().toISOString().slice(0, 10);
    const newDonor: DonorRecord = {
      ...donor,
      id,
      date,
      status: 'Diterima'
    };
    setDonorRecords((prev) => [newDonor, ...prev]);
    
    // Update campaign collected amount
    setCampaigns((prev) =>
      prev.map((c) =>
        c.id === donor.campaignId
          ? {
              ...c,
              collectedAmount: c.collectedAmount + donor.amount,
              donorCount: c.donorCount + 1
            }
          : c
      )
    );
    
    apiCreateDonorRecord({ ...donor, date }).catch(() => {});
    addAuditLog('DONATION_RECEIVED', 'Donasi', `Donasi diterima dari ${donor.donorName} sebesar Rp ${donor.amount.toLocaleString('id-ID')}`);
    showToast(`Alhamdulillah, donasi sebesar Rp ${donor.amount.toLocaleString('id-ID')} berhasil diterima!`, 'success');
  };

  const addQurbanParticipant = (participant: Omit<QurbanParticipant, 'id' | 'couponCode' | 'isDistributed'>) => {
    const id = 'QRB-' + String(qurbanParticipants.length + 1).padStart(3, '0');
    const couponCode = 'KPN-' + participant.animalType.substring(0, 2).toUpperCase() + '-' + Math.floor(10 + Math.random() * 90);
    const newQrb: QurbanParticipant = {
      ...participant,
      id,
      couponCode,
      isDistributed: false
    };
    setQurbanParticipants((prev) => [newQrb, ...prev]);
    apiCreateQurban({ ...participant, coupon_code: couponCode, is_distributed: false }).catch(() => {});
    addAuditLog('REGISTER_QURBAN', 'Qurban', `Pendaftaran hewan Qurban ${participant.animalType} atas nama ${participant.participantName}`);
    showToast(`Pendaftaran Qurban atas nama ${participant.participantName} berhasil disimpan dengan Kode Kupon: ${couponCode}`, 'success');
  };

  const toggleQurbanDistributed = (id: string) => {
    setQurbanParticipants((prev) =>
      prev.map((q) => (q.id === id ? { ...q, isDistributed: !q.isDistributed } : q))
    );
    showToast(`Status distribusi kupon Qurban diperbarui`, 'info');
  };

  const addInventoryItem = (item: Omit<InventoryItem, 'id' | 'code' | 'qrCode'>) => {
    const id = 'INV-' + Math.floor(10 + Math.random() * 90);
    const code = 'AST-' + item.category.substring(0, 3).toUpperCase() + '-' + new Date().getFullYear() + '-' + id;
    const qrCode = 'QR-' + code;
    const newItem: InventoryItem = {
      ...item,
      id,
      code,
      qrCode
    };
    setInventoryItems((prev) => [newItem, ...prev]);
    apiCreateInventory({ ...item, code, qr_code: qrCode }).catch(() => {});
    addAuditLog('ADD_INVENTORY', 'Inventaris', `Mencatat aset inventaris baru: ${item.name}`);
    showToast(`Barang inventaris ${item.name} berhasil ditambahkan!`, 'success');
  };

  const addRoomBooking = (booking: Omit<RoomBooking, 'id' | 'status'>) => {
    const id = 'BKG-' + String(roomBookings.length + 1).padStart(3, '0');
    const newBkg: RoomBooking = {
      ...booking,
      id,
      status: 'Disetujui'
    };
    setRoomBookings((prev) => [newBkg, ...prev]);
    addAuditLog('BOOK_ROOM', 'Sarpras', `Permohonan booking ruangan ${booking.roomName} oleh ${booking.applicantName}`);
    showToast(`Booking ${booking.roomName} berhasil disetujui & dicatat!`, 'success');
  };

  const addLetter = (letter: Omit<OfficialLetter, 'id' | 'status'>) => {
    const id = 'LTR-' + String(letters.length + 1).padStart(3, '0');
    const newLtr: OfficialLetter = {
      ...letter,
      id,
      status: 'Diproses'
    };
    setLetters((prev) => [newLtr, ...prev]);
    apiCreateLetter({ ...letter }).catch(() => {});
    addAuditLog('CREATE_LETTER', 'Surat', `Membuat surat ${letter.type}: ${letter.subject}`);
    showToast(`Surat ${letter.type} dengan nomor ${letter.letterNumber} berhasil disimpan!`, 'success');
  };

  const addKajianEvent = (event: Omit<KajianEvent, 'id'>) => {
    const id = 'KJ-' + String(kajianEvents.length + 1).padStart(3, '0');
    const newEv: KajianEvent = { ...event, id };
    setKajianEvents((prev) => [newEv, ...prev]);
    apiCreateKajian({ ...event }).catch(() => {});
    addAuditLog('ADD_KAJIAN', 'Agenda', `Menambahkan jadwal kajian baru: ${event.title}`);
    showToast(`Agenda Kajian "${event.title}" berhasil dipublikasikan!`, 'success');
  };

  const openExportModal = (title: string, data: any[]) => {
    setExportModalData({ isOpen: true, title, data });
  };

  const closeExportModal = () => {
    setExportModalData({ isOpen: false, title: '', data: [] });
  };

  return (
    <AppContext.Provider
      value={{
        activeAppTab,
        setActiveAppTab,
        publicSubTab,
        setPublicSubTab,
        dashboardSubTab,
        setDashboardSubTab,
        isAuthenticated,
        authUser,
        login,
        logout,
        showLoginModal,
        setShowLoginModal,
        currentRole,
        setCurrentRole,
        isDarkMode,
        toggleDarkMode,
        transactions,
        addTransaction,
        approveTransaction,
        accounts,
        budgets,
        campaigns,
        addCampaign,
        donorRecords,
        addDonorRecord,
        qurbanParticipants,
        addQurbanParticipant,
        toggleQurbanDistributed,
        inventoryItems,
        addInventoryItem,
        roomBookings,
        addRoomBooking,
        letters,
        addLetter,
        auditLogs,
        addAuditLog,
        kajianEvents,
        addKajianEvent,
        runningText,
        setRunningText,
        toasts,
        showToast,
        exportModalData,
        openExportModal,
        closeExportModal
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
