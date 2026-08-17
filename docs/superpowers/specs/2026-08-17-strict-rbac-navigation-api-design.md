# Strict Role-Based Access Control (RBAC) Design Specification

**Author:** Antigravity AI  
**Date:** 2026-08-17  
**Status:** Approved by User  

---

## 1. Overview & Objective
Implement strict role-based access control (RBAC) across:
1. **Frontend (`keloladkm`)**: Filter sidebar navigation menus according to active user role, restrict direct URL subtab navigation, and display access denied alerts/redirections when unauthorized.
2. **Backend API (`keloladkm-api`)**: Configure and assign specific role permissions in `RoleSeeder.php`, and enforce role/permission middleware across protected CRUD API endpoints in `routes/api.php`.
3. **Demo & Switcher Enhancements**: Provide accessible demo role switching for testing all primary DKM roles.

---

## 2. Role-to-Module Access Matrix

| Role | Allowed Dashboard Tabs | Key Permissions / Actions |
| :--- | :--- | :--- |
| **`super_admin`** | All tabs: `overview`, `keuangan`, `donasi_ziswaf`, `inventaris`, `agenda_event`, `surat_dokumen`, `website_cms`, `broadcast`, `audit_log` | Full access to all CRUD, approvals, audit trail, export |
| **`ketua_dkm`** | `overview`, `keuangan`, `agenda_event`, `surat_dokumen`, `audit_log` | Approvals, financial reviews, letters disposition, view logs |
| **`bendahara`** | `overview`, `keuangan`, `donasi_ziswaf` | Financial transactions entry, COA, budgets, bank reconciliation, donation records |
| **`sekretaris`** | `overview`, `agenda_event`, `surat_dokumen`, `website_cms`, `broadcast` | Official letters, agenda management, news articles, broadcast announcements |
| **`admin_inventaris`** | `overview`, `inventaris` | Inventory items, room bookings, facility maintenance |
| **`admin_keuangan`** | `overview`, `keuangan`, `donasi_ziswaf` | Financial entry & donation records (without final budget lock) |
| **`imam_muadzin`** | `overview`, `agenda_event` | Schedule viewing & event updates |
| **`relawan`** | `overview`, `agenda_event`, `donasi_ziswaf` | Event assistance, qurban participant checkin |
| **`viewer`** | `overview` | Read-only statistical summary and reports export |

---

## 3. Frontend Architecture (`keloladkm`)

### 3.1 Role Permissions Helper (`src/utils/rbac.ts`)
- Define `ROLE_PERMITTED_TABS: Record<UserRole, string[]>`
- Function `canRoleAccessTab(role: UserRole, tabId: string): boolean`
- Function `getDefaultTabForRole(role: UserRole): string`

### 3.2 Sidebar Navigation Filtering (`src/components/dashboard/DashboardMain.tsx`)
- Filter `menuNav` items using `canRoleAccessTab(currentRole, item.id)`.
- If active `dashboardSubTab` is not permitted for `currentRole`, automatically switch to `getDefaultTabForRole(currentRole)` and show an unauthorized toast notice.

### 3.3 Demo Account Switcher (`src/components/auth/LoginPage.tsx`)
- Include demo quick-login tiles for:
  - Super Admin (`super_admin`)
  - Ketua DKM (`ketua_dkm`)
  - Bendahara (`bendahara`)
  - Sekretaris (`sekretaris`)
  - Admin Inventaris (`admin_inventaris`)
  - Viewer (`viewer`)

---

## 4. Backend API Architecture (`keloladkm-api`)

### 4.1 Role & Permissions Seeding (`database/seeders/RoleSeeder.php`)
Assign explicit permissions:
- `super_admin`: all permissions
- `ketua_dkm`: `transactions.*`, `accounts.view`, `budgets.*`, `kajian.*`, `letters.*`, `audit-logs.view`
- `bendahara`: `transactions.*`, `accounts.*`, `budgets.*`, `donors.*`, `campaigns.*`, `qurban.*`
- `sekretaris`: `letters.*`, `kajian.*`, `articles.*`
- `admin_inventaris`: `inventory.*`
- `viewer`: `*.view`, `*.export`

### 4.2 Route Middleware Enforcement (`routes/api.php`)
Apply `role:...` middleware to grouped endpoints:
- Financial (`financial-transactions`, `financial-accounts`, `budget-plans`): `role:super_admin|ketua_dkm|bendahara|admin_keuangan`
- Donations & Ziswaf (`donor-records`, `donation-campaigns`, `qurban-participants`): `role:super_admin|bendahara|admin_keuangan|relawan`
- Inventory (`inventory-items`, `room-bookings`): `role:super_admin|admin_inventaris`
- Letters (`official-letters`): `role:super_admin|sekretaris|ketua_dkm`
- Articles CMS write (`cms-articles`): `role:super_admin|sekretaris`
- Kajian Agenda write (`kajian-events`): `role:super_admin|sekretaris|ketua_dkm|imam_muadzin`
- Audit Logs (`audit-logs`): `role:super_admin|ketua_dkm`

---

## 5. Verification Plan
1. **Frontend Manual & Automated Verification**:
   - Log in as Super Admin -> verify all 9 sidebar menus appear.
   - Switch to Bendahara -> verify only Overview, Keuangan, and Donasi ZISWAF appear.
   - Manually enter URL `?tab=dashboard&sub=audit_log` as Bendahara -> verify redirection and access denied notice.
   - Switch to Sekretaris -> verify Agenda, Surat, CMS, Broadcast appear, Keuangan & Inventaris hidden.
   - Switch to Viewer -> verify only Overview is visible.
2. **Backend API Verification**:
   - Run `php artisan test` or verify role permission middleware blocking unauthorized requests.
