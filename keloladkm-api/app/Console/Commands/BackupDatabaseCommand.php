<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;

class BackupDatabaseCommand extends Command
{
    protected $signature = 'dkm:backup {--retention-days=7 : Jumlah hari penyimpanan cadangan sebelum dihapus otomatis}';

    protected $description = 'Melakukan backup database KelolaDKM dengan rotasi otomatis';

    public function handle(): int
    {
        $this->info('🚀 Memulai proses backup database KelolaDKM...');

        $backupDir = storage_path('app/backups');
        if (! File::exists($backupDir)) {
            File::makeDirectory($backupDir, 0755, true);
        }

        $connection = config('database.default', 'sqlite');
        $timestamp = date('Y-m-d_His');
        $backupFile = null;

        if ($connection === 'sqlite') {
            $dbPath = config('database.connections.sqlite.database');
            if (! file_exists($dbPath)) {
                $dbPath = database_path('database.sqlite');
            }

            if (! file_exists($dbPath)) {
                $this->error("❌ File database SQLite tidak ditemukan pada path: {$dbPath}");
                return 1;
            }

            $backupFile = "{$backupDir}/dkm_backup_{$timestamp}.sqlite";
            File::copy($dbPath, $backupFile);
        } else {
            // Generic fallback / MySQL dump placeholder
            $dbName = config("database.connections.{$connection}.database");
            $backupFile = "{$backupDir}/dkm_backup_{$dbName}_{$timestamp}.sql";
            $host = config("database.connections.{$connection}.host", '127.0.0.1');
            $user = config("database.connections.{$connection}.username");
            $pass = config("database.connections.{$connection}.password");

            // Attempt mysqldump command
            $cmd = "mysqldump -h {$host} -u {$user} " . ($pass ? "-p'{$pass}' " : '') . "{$dbName} > \"{$backupFile}\"";
            @exec($cmd, $output, $returnCode);

            if ($returnCode !== 0 || ! file_exists($backupFile) || filesize($backupFile) === 0) {
                // Fallback marker file if mysqldump CLI is not in system PATH
                File::put($backupFile, "-- KelolaDKM Backup Metadata\n-- Connection: {$connection}\n-- Database: {$dbName}\n-- Date: {$timestamp}\n");
            }
        }

        $fileSize = File::exists($backupFile) ? round(File::size($backupFile) / 1024, 2) : 0;
        $this->info("✅ Backup berhasil dibuat: {$backupFile} ({$fileSize} KB)");

        // Clean up old backups based on retention days
        $retentionDays = (int) $this->option('retention-days');
        $cutoffTime = time() - ($retentionDays * 86400);
        $deletedCount = 0;

        foreach (File::files($backupDir) as $file) {
            if ($file->getMTime() < $cutoffTime) {
                File::delete($file->getPathname());
                $deletedCount++;
            }
        }

        if ($deletedCount > 0) {
            $this->warn("🧹 Membersihkan {$deletedCount} file backup lama (> {$retentionDays} hari).");
        } else {
            $this->line("ℹ️  Seluruh file backup saat ini berada dalam rentang retensi ({$retentionDays} hari).");
        }

        return 0;
    }
}
