<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;

class ResetAdminPassword extends Command
{
    protected $signature = 'admin:reset-password {email? : Admin email}';

    protected $description = 'Reset password for admin user (prompts securely)';

    public function handle(): int
    {
        $email = $this->argument('email') ?? 'admin@masjidnuruliman.or.id';

        $user = User::where('email', $email)->first();

        if (! $user) {
            $this->error("User dengan email '$email' tidak ditemukan.");

            return 1;
        }

        $password = $this->secret('Masukkan password baru (min. 8 karakter)');
        if (strlen($password) < 8) {
            $this->error('Password minimal 8 karakter.');

            return 1;
        }

        $confirm = $this->secret('Konfirmasi password baru');
        if ($password !== $confirm) {
            $this->error('Password tidak cocok.');

            return 1;
        }

        $user->update(['password' => bcrypt($password)]);

        $this->info("✅ Password untuk {$user->name} ({$user->email}) berhasil diubah.");
        $this->warn('⚠️  Simpan password ini di tempat aman. Jangan commit ke repository.');

        return 0;
    }
}
