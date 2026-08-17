<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RoleSeeder extends Seeder
{
    public function run(): void
    {
        $roles = [
            'super_admin' => 'Super Admin — Akses penuh seluruh sistem',
            'ketua_dkm' => 'Ketua DKM — Approval & Laporan Utama',
            'wakil_ketua' => 'Wakil Ketua',
            'sekretaris' => 'Sekretaris — Surat & Dokumen',
            'bendahara' => 'Bendahara DKM — Kas, COA & Buku Besar',
            'admin_keuangan' => 'Admin Keuangan — Donasi, Zakat & Infaq',
            'admin_inventaris' => 'Admin Inventaris — Barang, Sarpras & QR',
            'imam_muadzin' => 'Imam, Muadzin & Khatib',
            'relawan' => 'Relawan & Panitia — Qurban & Event',
            'jamaah_donatur' => 'Jamaah / Donatur — Lihat Transparansi',
            'viewer' => 'Viewer / Auditor',
        ];

        $modules = [
            'transactions', 'accounts', 'budgets', 'campaigns', 'donors',
            'qurban', 'inventory', 'kajian', 'letters', 'articles', 'audit-logs',
        ];

        $actions = ['view', 'create', 'update', 'delete', 'export', 'approve'];

        // Create permissions for each module
        foreach ($modules as $module) {
            foreach ($actions as $action) {
                Permission::firstOrCreate(['name' => "$module.$action"]);
            }
        }

        // Create roles
        foreach ($roles as $name => $desc) {
            Role::firstOrCreate(['name' => $name]);
        }

        // Assign Permissions to Roles
        // 1. Super Admin: full access to everything
        Role::findByName('super_admin')->syncPermissions(Permission::all());

        // 2. Ketua DKM: approvals, finances, agenda, letters, and audit logs
        $ketuaPermissions = Permission::where(function ($q) {
            $q->where('name', 'like', 'transactions.%')
              ->orWhere('name', 'like', 'budgets.%')
              ->orWhere('name', 'like', 'letters.%')
              ->orWhere('name', 'like', 'kajian.%')
              ->orWhere('name', 'accounts.view')
              ->orWhere('name', 'accounts.export')
              ->orWhere('name', 'audit-logs.view');
        })->get();
        Role::findByName('ketua_dkm')->syncPermissions($ketuaPermissions);
        Role::findByName('wakil_ketua')->syncPermissions($ketuaPermissions);

        // 3. Bendahara: full financial, budgeting, donations, ziswaf, and qurban
        $bendaharaPermissions = Permission::where(function ($q) {
            $q->where('name', 'like', 'transactions.%')
              ->orWhere('name', 'like', 'accounts.%')
              ->orWhere('name', 'like', 'budgets.%')
              ->orWhere('name', 'like', 'campaigns.%')
              ->orWhere('name', 'like', 'donors.%')
              ->orWhere('name', 'like', 'qurban.%');
        })->get();
        Role::findByName('bendahara')->syncPermissions($bendaharaPermissions);

        // 4. Admin Keuangan: finance operations and donations
        $adminKeuanganPermissions = Permission::where(function ($q) {
            $q->whereIn('name', [
                'transactions.view', 'transactions.create', 'transactions.update', 'transactions.export',
                'accounts.view', 'accounts.export',
                'budgets.view', 'budgets.export',
            ])
            ->orWhere('name', 'like', 'campaigns.%')
            ->orWhere('name', 'like', 'donors.%')
            ->orWhere('name', 'like', 'qurban.%');
        })->get();
        Role::findByName('admin_keuangan')->syncPermissions($adminKeuanganPermissions);

        // 5. Sekretaris: letters, agenda/kajian, articles/CMS
        $sekretarisPermissions = Permission::where(function ($q) {
            $q->where('name', 'like', 'letters.%')
              ->orWhere('name', 'like', 'kajian.%')
              ->orWhere('name', 'like', 'articles.%');
        })->get();
        Role::findByName('sekretaris')->syncPermissions($sekretarisPermissions);

        // 6. Admin Inventaris: inventory & room facilities
        $inventarisPermissions = Permission::where('name', 'like', 'inventory.%')->get();
        Role::findByName('admin_inventaris')->syncPermissions($inventarisPermissions);

        // 7. Imam & Muadzin: agenda and public events
        $imamPermissions = Permission::whereIn('name', ['kajian.view', 'kajian.create', 'kajian.update'])->get();
        Role::findByName('imam_muadzin')->syncPermissions($imamPermissions);

        // 8. Relawan: event viewing & qurban checking
        $relawanPermissions = Permission::whereIn('name', [
            'kajian.view', 'donors.view', 'campaigns.view', 'qurban.view', 'qurban.update',
        ])->get();
        Role::findByName('relawan')->syncPermissions($relawanPermissions);

        // 9. Viewer / Auditor: read-only & export access to all modules
        $viewerPermissions = Permission::where(function ($q) {
            $q->where('name', 'like', '%.view')
              ->orWhere('name', 'like', '%.export');
        })->get();
        Role::findByName('viewer')->syncPermissions($viewerPermissions);
        Role::findByName('jamaah_donatur')->syncPermissions($viewerPermissions);

        // Default password helper (from .env or local fallback)
        $defaultPassword = bcrypt((string) env('DEFAULT_ADMIN_PASSWORD', 'password123'));

        // Seed sample users for each primary role
        $sampleUsers = [
            [
                'email' => 'admin@masjidnuruliman.or.id',
                'name' => 'Super Admin',
                'role' => 'super_admin',
                'phone' => '0812-9988-1122',
                'department' => 'Sistem Informasi & IT DKM',
            ],
            [
                'email' => 'ketua@masjidnuruliman.or.id',
                'name' => 'H. M. Zamzami, S.E.',
                'role' => 'ketua_dkm',
                'phone' => '0812-1111-2222',
                'department' => 'Badan Pengurus Harian',
            ],
            [
                'email' => 'bendahara@masjidnuruliman.or.id',
                'name' => 'H. Rahmat Hidayat',
                'role' => 'bendahara',
                'phone' => '0813-3333-4444',
                'department' => 'Bidang Keuangan & ZISWAF',
            ],
            [
                'email' => 'sekretaris@masjidnuruliman.or.id',
                'name' => 'H. Fikri Ramadhan',
                'role' => 'sekretaris',
                'phone' => '0815-5555-6666',
                'department' => 'Sekretariat & Administrasi',
            ],
            [
                'email' => 'inventaris@masjidnuruliman.or.id',
                'name' => 'Dedi Kurniawan',
                'role' => 'admin_inventaris',
                'phone' => '0817-7777-8888',
                'department' => 'Bidang Sarana & Prasarana',
            ],
            [
                'email' => 'auditor@masjidnuruliman.or.id',
                'name' => 'Auditor Eksternal',
                'role' => 'viewer',
                'phone' => '0819-9999-0000',
                'department' => 'Pengawas & Dewan Penasehat',
            ],
        ];

        foreach ($sampleUsers as $u) {
            $user = User::updateOrCreate(
                ['email' => $u['email']],
                [
                    'name' => $u['name'],
                    'password' => $defaultPassword,
                    'phone' => $u['phone'],
                    'role' => $u['role'],
                    'department' => $u['department'],
                ]
            );
            $user->syncRoles([$u['role']]);
        }
    }
}
