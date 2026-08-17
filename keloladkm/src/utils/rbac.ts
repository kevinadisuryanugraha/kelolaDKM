import { UserRole } from '../types';

/**
 * Permitted dashboard tabs for each UserRole in KelolaDKM.
 */
export const ROLE_PERMITTED_TABS: Record<UserRole, string[]> = {
  super_admin: [
    'overview',
    'keuangan',
    'donasi_ziswaf',
    'inventaris',
    'agenda_event',
    'surat_dokumen',
    'website_cms',
    'broadcast',
    'audit_log'
  ],
  ketua_dkm: [
    'overview',
    'keuangan',
    'agenda_event',
    'surat_dokumen',
    'audit_log'
  ],
  wakil_ketua: [
    'overview',
    'keuangan',
    'agenda_event',
    'surat_dokumen',
    'audit_log'
  ],
  bendahara: [
    'overview',
    'keuangan',
    'donasi_ziswaf'
  ],
  admin_keuangan: [
    'overview',
    'keuangan',
    'donasi_ziswaf'
  ],
  sekretaris: [
    'overview',
    'agenda_event',
    'surat_dokumen',
    'website_cms',
    'broadcast'
  ],
  admin_inventaris: [
    'overview',
    'inventaris'
  ],
  imam_muadzin: [
    'overview',
    'agenda_event'
  ],
  relawan: [
    'overview',
    'agenda_event',
    'donasi_ziswaf'
  ],
  jamaah_donatur: [
    'overview'
  ],
  viewer: [
    'overview'
  ]
};

/**
 * Checks whether a given role has access to a specific dashboard subtab.
 */
export function canRoleAccessTab(role: UserRole | string, tabId: string): boolean {
  const permitted = ROLE_PERMITTED_TABS[role as UserRole];
  if (!permitted) {
    // If unknown role, default to only overview
    return tabId === 'overview';
  }
  return permitted.includes(tabId);
}

/**
 * Returns the default allowed tab for a role if attempting to access an unauthorized tab.
 */
export function getDefaultTabForRole(role: UserRole | string): string {
  const permitted = ROLE_PERMITTED_TABS[role as UserRole];
  if (permitted && permitted.length > 0) {
    return permitted[0];
  }
  return 'overview';
}

/**
 * Human readable role names
 */
export const ROLE_LABELS: Record<UserRole, string> = {
  super_admin: 'Super Admin',
  ketua_dkm: 'Ketua DKM',
  wakil_ketua: 'Wakil Ketua DKM',
  sekretaris: 'Sekretaris',
  bendahara: 'Bendahara',
  admin_keuangan: 'Admin Keuangan',
  admin_inventaris: 'Admin Inventaris & Sarpras',
  imam_muadzin: 'Imam & Muadzin',
  relawan: 'Relawan / Panitia',
  jamaah_donatur: 'Jamaah / Donatur',
  viewer: 'Viewer / Auditor'
};
