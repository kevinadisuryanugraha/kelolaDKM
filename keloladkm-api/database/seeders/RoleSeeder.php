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

        // Super admin gets everything
        Role::findByName('super_admin')->givePermissionTo(Permission::all());

        // Create default admin user.
        // Password MUST be provided via .env (DEFAULT_ADMIN_PASSWORD) in production;
        // the fallback below is only for local development.
        $user = User::firstOrCreate(
            ['email' => 'admin@masjidnuruliman.or.id'],
            [
                'name' => 'H. M. Zamzami, S.E.',
                'password' => bcrypt((string) env('DEFAULT_ADMIN_PASSWORD', 'password')),
                'phone' => '0812-9988-1122',
                'role' => 'super_admin',
                'department' => 'Badan Pengurus Harian',
            ]
        );
        $user->assignRole('super_admin');
    }
}
