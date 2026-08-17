import { describe, it, expect } from 'vitest';
import { canRoleAccessTab, getDefaultTabForRole, ROLE_PERMITTED_TABS, ROLE_LABELS } from '../utils/rbac';
import { UserRole } from '../types';

describe('RBAC Utility & Role Permissions', () => {
  it('allows super_admin access to all dashboard tabs', () => {
    const allTabs = [
      'overview', 'keuangan', 'donasi_ziswaf', 'inventaris',
      'agenda_event', 'surat_dokumen', 'website_cms', 'broadcast', 'audit_log'
    ];
    for (const tab of allTabs) {
      expect(canRoleAccessTab('super_admin', tab)).toBe(true);
    }
  });

  it('restricts bendahara to overview, keuangan, and donasi_ziswaf only', () => {
    expect(canRoleAccessTab('bendahara', 'overview')).toBe(true);
    expect(canRoleAccessTab('bendahara', 'keuangan')).toBe(true);
    expect(canRoleAccessTab('bendahara', 'donasi_ziswaf')).toBe(true);

    // Denied
    expect(canRoleAccessTab('bendahara', 'surat_dokumen')).toBe(false);
    expect(canRoleAccessTab('bendahara', 'website_cms')).toBe(false);
    expect(canRoleAccessTab('bendahara', 'audit_log')).toBe(false);
    expect(canRoleAccessTab('bendahara', 'inventaris')).toBe(false);
  });

  it('restricts sekretaris to overview, agenda, surat, cms, and broadcast', () => {
    expect(canRoleAccessTab('sekretaris', 'overview')).toBe(true);
    expect(canRoleAccessTab('sekretaris', 'agenda_event')).toBe(true);
    expect(canRoleAccessTab('sekretaris', 'surat_dokumen')).toBe(true);
    expect(canRoleAccessTab('sekretaris', 'website_cms')).toBe(true);
    expect(canRoleAccessTab('sekretaris', 'broadcast')).toBe(true);

    // Denied
    expect(canRoleAccessTab('sekretaris', 'keuangan')).toBe(false);
    expect(canRoleAccessTab('sekretaris', 'inventaris')).toBe(false);
    expect(canRoleAccessTab('sekretaris', 'audit_log')).toBe(false);
  });

  it('restricts admin_inventaris to overview and inventaris only', () => {
    expect(canRoleAccessTab('admin_inventaris', 'overview')).toBe(true);
    expect(canRoleAccessTab('admin_inventaris', 'inventaris')).toBe(true);

    // Denied
    expect(canRoleAccessTab('admin_inventaris', 'keuangan')).toBe(false);
    expect(canRoleAccessTab('admin_inventaris', 'surat_dokumen')).toBe(false);
    expect(canRoleAccessTab('admin_inventaris', 'audit_log')).toBe(false);
  });

  it('restricts viewer to overview only', () => {
    expect(canRoleAccessTab('viewer', 'overview')).toBe(true);

    // Denied
    expect(canRoleAccessTab('viewer', 'keuangan')).toBe(false);
    expect(canRoleAccessTab('viewer', 'donasi_ziswaf')).toBe(false);
    expect(canRoleAccessTab('viewer', 'inventaris')).toBe(false);
    expect(canRoleAccessTab('viewer', 'audit_log')).toBe(false);
  });

  it('returns default fallback tab correctly', () => {
    expect(getDefaultTabForRole('super_admin')).toBe('overview');
    expect(getDefaultTabForRole('bendahara')).toBe('overview');
    expect(getDefaultTabForRole('unknown_role' as UserRole)).toBe('overview');
  });

  it('has readable labels for all roles', () => {
    expect(ROLE_LABELS.super_admin).toBe('Super Admin');
    expect(ROLE_LABELS.ketua_dkm).toBe('Ketua DKM');
    expect(ROLE_LABELS.bendahara).toBe('Bendahara');
    expect(ROLE_LABELS.sekretaris).toBe('Sekretaris');
    expect(ROLE_LABELS.admin_inventaris).toBe('Admin Inventaris & Sarpras');
    expect(ROLE_LABELS.viewer).toBe('Viewer / Auditor');
  });
});
