<?php

namespace Database\Seeders;

use App\Models\AuditLog;
use App\Models\BudgetPlan;
use App\Models\CMSArticle;
use App\Models\DonationCampaign;
use App\Models\DonorRecord;
use App\Models\FinancialAccount;
use App\Models\FinancialTransaction;
use App\Models\InventoryItem;
use App\Models\KajianEvent;
use App\Models\OfficialLetter;
use App\Models\QurbanParticipant;
use Illuminate\Database\Seeder;

class DataSeeder extends Seeder
{
    public function run(): void
    {
        // COA Standar Riil Masjid Jami Nurul Iman
        foreach ([
            ['code' => '101.1', 'name' => 'Kas Tunai (Brankas DKM)', 'type' => 'Aset', 'balance' => 118_454],
            ['code' => '102.1', 'name' => 'Bank BSI & QRIS Operasional', 'type' => 'Aset', 'balance' => 8_990_000],
            ['code' => '401.1', 'name' => 'Infaq Sholat Jumat', 'type' => 'Penerimaan', 'balance' => 7_927_500],
            ['code' => '401.2', 'name' => 'Kotak Amal Warga RT 008', 'type' => 'Penerimaan', 'balance' => 1_617_000],
            ['code' => '401.3', 'name' => 'Infaq & Sadakoh Donatur', 'type' => 'Penerimaan', 'balance' => 6_720_000],
            ['code' => '401.4', 'name' => 'Penerimaan QRIS Nasional', 'type' => 'Penerimaan', 'balance' => 1_475_000],
            ['code' => '501.1', 'name' => 'Biaya Ibadah Sholat Jumat', 'type' => 'Pengeluaran', 'balance' => 6_600_000],
            ['code' => '501.2', 'name' => 'Biaya Kebersihan Masjid', 'type' => 'Pengeluaran', 'balance' => 3_520_000],
            ['code' => '501.3', 'name' => 'Biaya Majelis Ta\'lim & Kajian', 'type' => 'Pengeluaran', 'balance' => 5_300_000],
            ['code' => '501.4', 'name' => 'Tagihan Listrik PLN', 'type' => 'Pengeluaran', 'balance' => 2_173_172],
            ['code' => '501.5', 'name' => 'Program Sosial & Beras DKM', 'type' => 'Pengeluaran', 'balance' => 1_700_000],
            ['code' => '501.6', 'name' => 'Belanja Sarana & Perlengkapan', 'type' => 'Pengeluaran', 'balance' => 1_919_900],
        ] as $c) {
            FinancialAccount::create($c);
        }

        // Transactions Riil (Agustus, Juli, Juni 2026)
        foreach ([
            // Agustus 2026 (Minggu III)
            ['ref_number' => 'INV/20260819/001', 'date' => '2026-08-19', 'type' => 'Masuk', 'account_code' => '401.4', 'account_name' => 'Penerimaan QRIS Nasional', 'description' => 'Infaq QRIS Jamaah', 'amount' => 10_000, 'category' => 'QRIS', 'recorded_by' => 'T. Handoko', 'status' => 'Approved'],
            ['ref_number' => 'INV/20260818/001', 'date' => '2026-08-18', 'type' => 'Masuk', 'account_code' => '401.4', 'account_name' => 'Penerimaan QRIS Nasional', 'description' => 'Infaq QRIS Jamaah', 'amount' => 10_000, 'category' => 'QRIS', 'recorded_by' => 'T. Handoko', 'status' => 'Approved'],
            ['ref_number' => 'INV/20260817/001', 'date' => '2026-08-17', 'type' => 'Masuk', 'account_code' => '401.4', 'account_name' => 'Penerimaan QRIS Nasional', 'description' => 'Infaq QRIS Bpk Abdulloh Jusuf', 'amount' => 250_000, 'category' => 'QRIS', 'recorded_by' => 'T. Handoko', 'status' => 'Approved'],
            ['ref_number' => 'INV/20260816/001', 'date' => '2026-08-16', 'type' => 'Masuk', 'account_code' => '401.2', 'account_name' => 'Kotak Amal Warga RT 008', 'description' => 'Amal Jariah Warga RT 008', 'amount' => 100_000, 'category' => 'Kotak Warga', 'recorded_by' => 'T. Handoko', 'status' => 'Approved'],
            ['ref_number' => 'EXP/20260815/001', 'date' => '2026-08-15', 'type' => 'Keluar', 'account_code' => '501.3', 'account_name' => 'Biaya Majelis Ta\'lim & Kajian', 'description' => 'Biaya Majlis Ta\'lim Sabtu Pagi', 'amount' => 400_000, 'category' => 'Dakwah', 'recorded_by' => 'T. Handoko', 'status' => 'Approved'],
            ['ref_number' => 'EXP/20260814/002', 'date' => '2026-08-14', 'type' => 'Keluar', 'account_code' => '501.2', 'account_name' => 'Biaya Kebersihan Masjid', 'description' => 'Biaya Kebersihan Mingguan & Marbot', 'amount' => 225_000, 'category' => 'Kebersihan', 'recorded_by' => 'T. Handoko', 'status' => 'Approved'],
            ['ref_number' => 'EXP/20260814/001', 'date' => '2026-08-14', 'type' => 'Keluar', 'account_code' => '501.1', 'account_name' => 'Biaya Ibadah Sholat Jumat', 'description' => 'Honor Khotib & Petugas Sholat Jumat', 'amount' => 500_000, 'category' => 'Ibadah Jumat', 'recorded_by' => 'T. Handoko', 'status' => 'Approved'],
            ['ref_number' => 'INV/20260814/001', 'date' => '2026-08-14', 'type' => 'Masuk', 'account_code' => '401.1', 'account_name' => 'Infaq Sholat Jumat', 'description' => 'Infaq Sadakoh Sholat Jumat', 'amount' => 370_500, 'category' => 'Infaq Jumat', 'recorded_by' => 'T. Handoko', 'status' => 'Approved'],

            // Agustus 2026 (Minggu II)
            ['ref_number' => 'INV/20260811/001', 'date' => '2026-08-11', 'type' => 'Masuk', 'account_code' => '401.4', 'account_name' => 'Penerimaan QRIS Nasional', 'description' => 'Infaq QRIS Jamaah', 'amount' => 10_000, 'category' => 'QRIS', 'recorded_by' => 'T. Handoko', 'status' => 'Approved'],
            ['ref_number' => 'INV/20260809/001', 'date' => '2026-08-09', 'type' => 'Masuk', 'account_code' => '401.2', 'account_name' => 'Kotak Amal Warga RT 008', 'description' => 'Amal Jariah Warga RT 008', 'amount' => 125_000, 'category' => 'Kotak Warga', 'recorded_by' => 'T. Handoko', 'status' => 'Approved'],
            ['ref_number' => 'INV/20260808/001', 'date' => '2026-08-08', 'type' => 'Masuk', 'account_code' => '401.4', 'account_name' => 'Penerimaan QRIS Nasional', 'description' => 'Infaq QRIS Jamaah', 'amount' => 20_000, 'category' => 'QRIS', 'recorded_by' => 'T. Handoko', 'status' => 'Approved'],
            ['ref_number' => 'EXP/20260808/001', 'date' => '2026-08-08', 'type' => 'Keluar', 'account_code' => '501.3', 'account_name' => 'Biaya Majelis Ta\'lim & Kajian', 'description' => 'Biaya Majlis Ta\'lim Subuh', 'amount' => 400_000, 'category' => 'Dakwah', 'recorded_by' => 'T. Handoko', 'status' => 'Approved'],
            ['ref_number' => 'EXP/20260807/002', 'date' => '2026-08-07', 'type' => 'Keluar', 'account_code' => '501.2', 'account_name' => 'Biaya Kebersihan Masjid', 'description' => 'Biaya Kebersihan Mingguan', 'amount' => 225_000, 'category' => 'Kebersihan', 'recorded_by' => 'T. Handoko', 'status' => 'Approved'],
            ['ref_number' => 'EXP/20260807/001', 'date' => '2026-08-07', 'type' => 'Keluar', 'account_code' => '501.1', 'account_name' => 'Biaya Ibadah Sholat Jumat', 'description' => 'Biaya Ibadah Sholat Jumat', 'amount' => 500_000, 'category' => 'Ibadah Jumat', 'recorded_by' => 'T. Handoko', 'status' => 'Approved'],
            ['ref_number' => 'INV/20260807/002', 'date' => '2026-08-07', 'type' => 'Masuk', 'account_code' => '401.4', 'account_name' => 'Penerimaan QRIS Nasional', 'description' => 'Infaq QRIS Jamaah (4 Transaksi)', 'amount' => 135_000, 'category' => 'QRIS', 'recorded_by' => 'T. Handoko', 'status' => 'Approved'],
            ['ref_number' => 'INV/20260807/001', 'date' => '2026-08-07', 'type' => 'Masuk', 'account_code' => '401.1', 'account_name' => 'Infaq Sholat Jumat', 'description' => 'Infaq Sadakoh Sholat Jumat', 'amount' => 629_000, 'category' => 'Infaq Jumat', 'recorded_by' => 'T. Handoko', 'status' => 'Approved'],

            // Agustus 2026 (Minggu I)
            ['ref_number' => 'INV/20260806/001', 'date' => '2026-08-06', 'type' => 'Masuk', 'account_code' => '401.3', 'account_name' => 'Infaq & Sadakoh Donatur', 'description' => 'Infaq dari Hamba Allah (Bank & Tunai)', 'amount' => 550_000, 'category' => 'Donatur', 'recorded_by' => 'T. Handoko', 'status' => 'Approved'],
            ['ref_number' => 'EXP/20260805/001', 'date' => '2026-08-05', 'type' => 'Keluar', 'account_code' => '501.3', 'account_name' => 'Biaya Majelis Ta\'lim & Kajian', 'description' => 'Biaya Ta\'lim Ibu-Ibu', 'amount' => 500_000, 'category' => 'Dakwah', 'recorded_by' => 'T. Handoko', 'status' => 'Approved'],
            ['ref_number' => 'INV/20260805/001', 'date' => '2026-08-05', 'type' => 'Masuk', 'account_code' => '401.3', 'account_name' => 'Infaq & Sadakoh Donatur', 'description' => 'Infaq Bpk Sanusi', 'amount' => 50_000, 'category' => 'Donatur', 'recorded_by' => 'T. Handoko', 'status' => 'Approved'],
            ['ref_number' => 'EXP/20260803/001', 'date' => '2026-08-03', 'type' => 'Keluar', 'account_code' => '501.4', 'account_name' => 'Tagihan Listrik PLN', 'description' => 'Bayar Biaya Listrik PLN Masjid', 'amount' => 856_794, 'category' => 'Utilitas', 'recorded_by' => 'T. Handoko', 'status' => 'Approved'],
            ['ref_number' => 'INV/20260802/001', 'date' => '2026-08-02', 'type' => 'Masuk', 'account_code' => '401.2', 'account_name' => 'Kotak Amal Warga RT 008', 'description' => 'Kotak Amal Warga RT 008', 'amount' => 105_000, 'category' => 'Kotak Warga', 'recorded_by' => 'T. Handoko', 'status' => 'Approved'],
            ['ref_number' => 'EXP/20260801/001', 'date' => '2026-08-01', 'type' => 'Keluar', 'account_code' => '501.6', 'account_name' => 'Belanja Sarana & Perlengkapan', 'description' => 'Beli Lampu Bohlam Masjid', 'amount' => 169_900, 'category' => 'Sarana', 'recorded_by' => 'T. Handoko', 'status' => 'Approved'],
            ['ref_number' => 'INV/20260801/001', 'date' => '2026-08-01', 'type' => 'Masuk', 'account_code' => '401.3', 'account_name' => 'Infaq & Sadakoh Donatur', 'description' => 'Infaq Bpk Sunardono', 'amount' => 50_000, 'category' => 'Donatur', 'recorded_by' => 'T. Handoko', 'status' => 'Approved'],
            ['ref_number' => 'EXP/20260731/003', 'date' => '2026-07-31', 'type' => 'Keluar', 'account_code' => '501.5', 'account_name' => 'Program Sosial & Beras DKM', 'description' => 'Penyaluran Program Sosial DKM', 'amount' => 300_000, 'category' => 'Sosial', 'recorded_by' => 'T. Handoko', 'status' => 'Approved'],
            ['ref_number' => 'EXP/20260731/002', 'date' => '2026-07-31', 'type' => 'Keluar', 'account_code' => '501.2', 'account_name' => 'Biaya Kebersihan Masjid', 'description' => 'Beli Obat Pembersih Lantai & Biaya Kebersihan', 'amount' => 300_000, 'category' => 'Kebersihan', 'recorded_by' => 'T. Handoko', 'status' => 'Approved'],
            ['ref_number' => 'EXP/20260731/001', 'date' => '2026-07-31', 'type' => 'Keluar', 'account_code' => '501.1', 'account_name' => 'Biaya Ibadah Sholat Jumat', 'description' => 'Biaya Ibadah Sholat Jumat', 'amount' => 500_000, 'category' => 'Ibadah Jumat', 'recorded_by' => 'T. Handoko', 'status' => 'Approved'],
            ['ref_number' => 'INV/20260731/003', 'date' => '2026-07-31', 'type' => 'Masuk', 'account_code' => '401.3', 'account_name' => 'Infaq & Sadakoh Donatur', 'description' => 'Infaq Sadakoh Hamba Allah', 'amount' => 300_000, 'category' => 'Donatur', 'recorded_by' => 'T. Handoko', 'status' => 'Approved'],
            ['ref_number' => 'INV/20260731/002', 'date' => '2026-07-31', 'type' => 'Masuk', 'account_code' => '401.3', 'account_name' => 'Infaq & Sadakoh Donatur', 'description' => 'Kotak Amal Masjid Utama', 'amount' => 1_212_000, 'category' => 'Kotak Masjid', 'recorded_by' => 'T. Handoko', 'status' => 'Approved'],
            ['ref_number' => 'INV/20260731/001', 'date' => '2026-07-31', 'type' => 'Masuk', 'account_code' => '401.1', 'account_name' => 'Infaq Sholat Jumat', 'description' => 'Kotak Amal Sholat Jumat', 'amount' => 714_000, 'category' => 'Infaq Jumat', 'recorded_by' => 'T. Handoko', 'status' => 'Approved'],

            // Juli 2026
            ['ref_number' => 'EXP/20260728/001', 'date' => '2026-07-28', 'type' => 'Keluar', 'account_code' => '501.4', 'account_name' => 'Tagihan Listrik PLN', 'description' => 'Tagihan Listrik PLN Masjid Periode Juli 2026', 'amount' => 711_181, 'category' => 'Utilitas', 'recorded_by' => 'T. Handoko', 'status' => 'Approved'],
            ['ref_number' => 'EXP/20260727/001', 'date' => '2026-07-27', 'type' => 'Keluar', 'account_code' => '501.5', 'account_name' => 'Program Sosial & Beras DKM', 'description' => 'Beli Beras Program Sosial DKM untuk Warga', 'amount' => 1_400_000, 'category' => 'Sosial', 'recorded_by' => 'T. Handoko', 'status' => 'Approved'],
            ['ref_number' => 'INV/20260727/001', 'date' => '2026-07-27', 'type' => 'Masuk', 'account_code' => '401.3', 'account_name' => 'Infaq & Sadakoh Donatur', 'description' => 'Hamba Allah - Donasi Khusus Program Beras', 'amount' => 1_400_000, 'category' => 'Sosial', 'recorded_by' => 'T. Handoko', 'status' => 'Approved'],
            ['ref_number' => 'INV/20260726/001', 'date' => '2026-07-26', 'type' => 'Masuk', 'account_code' => '401.2', 'account_name' => 'Kotak Amal Warga RT 008', 'description' => 'Kotak Amal Warga RT 008', 'amount' => 145_000, 'category' => 'Kotak Warga', 'recorded_by' => 'T. Handoko', 'status' => 'Approved'],
            ['ref_number' => 'EXP/20260725/001', 'date' => '2026-07-25', 'type' => 'Keluar', 'account_code' => '501.3', 'account_name' => 'Biaya Majelis Ta\'lim & Kajian', 'description' => 'Biaya Majlis Ta\'lim Pekanan', 'amount' => 400_000, 'category' => 'Dakwah', 'recorded_by' => 'T. Handoko', 'status' => 'Approved'],
            ['ref_number' => 'INV/20260724/001', 'date' => '2026-07-24', 'type' => 'Masuk', 'account_code' => '401.1', 'account_name' => 'Infaq Sholat Jumat', 'description' => 'Kotak Amal Sholat Jumat Pekan IV Juli', 'amount' => 702_000, 'category' => 'Infaq Jumat', 'recorded_by' => 'T. Handoko', 'status' => 'Approved'],
            ['ref_number' => 'EXP/20260724/001', 'date' => '2026-07-24', 'type' => 'Keluar', 'account_code' => '501.1', 'account_name' => 'Biaya Ibadah Sholat Jumat', 'description' => 'Biaya Ibadah Sholat Jumat', 'amount' => 500_000, 'category' => 'Ibadah Jumat', 'recorded_by' => 'T. Handoko', 'status' => 'Approved'],

            // Juni 2026
            ['ref_number' => 'EXP/20260629/001', 'date' => '2026-06-29', 'type' => 'Keluar', 'account_code' => '501.6', 'account_name' => 'Belanja Sarana & Perlengkapan', 'description' => 'Belanja Kebutuhan Operasional Masjid', 'amount' => 252_000, 'category' => 'Sarana', 'recorded_by' => 'T. Handoko', 'status' => 'Approved'],
            ['ref_number' => 'EXP/20260628/001', 'date' => '2026-06-28', 'type' => 'Keluar', 'account_code' => '501.4', 'account_name' => 'Tagihan Listrik PLN', 'description' => 'Tagihan Listrik PLN Periode Juni 2026', 'amount' => 605_197, 'category' => 'Utilitas', 'recorded_by' => 'T. Handoko', 'status' => 'Approved'],
            ['ref_number' => 'EXP/20260627/001', 'date' => '2026-06-27', 'type' => 'Keluar', 'account_code' => '501.3', 'account_name' => 'Biaya Majelis Ta\'lim & Kajian', 'description' => 'Biaya Majelis Ta\'lim Bulanan', 'amount' => 1_600_000, 'category' => 'Dakwah', 'recorded_by' => 'T. Handoko', 'status' => 'Approved'],
            ['ref_number' => 'EXP/20260626/001', 'date' => '2026-06-26', 'type' => 'Keluar', 'account_code' => '501.2', 'account_name' => 'Biaya Kebersihan Masjid', 'description' => 'Biaya Kebersihan Masjid Bulan Juni', 'amount' => 1_445_000, 'category' => 'Kebersihan', 'recorded_by' => 'T. Handoko', 'status' => 'Approved'],
            ['ref_number' => 'EXP/20260625/001', 'date' => '2026-06-25', 'type' => 'Keluar', 'account_code' => '501.1', 'account_name' => 'Biaya Ibadah Sholat Jumat', 'description' => 'Biaya Sholat Jumat 4 Pekan Juni', 'amount' => 2_100_000, 'category' => 'Ibadah Jumat', 'recorded_by' => 'T. Handoko', 'status' => 'Approved'],
            ['ref_number' => 'INV/20260620/001', 'date' => '2026-06-20', 'type' => 'Masuk', 'account_code' => '401.2', 'account_name' => 'Kotak Amal Warga RT 008', 'description' => 'Kotak Amal dari Warga RT 008', 'amount' => 662_000, 'category' => 'Kotak Warga', 'recorded_by' => 'T. Handoko', 'status' => 'Approved'],
            ['ref_number' => 'INV/20260615/001', 'date' => '2026-06-15', 'type' => 'Masuk', 'account_code' => '401.3', 'account_name' => 'Infaq & Sadakoh Donatur', 'description' => 'Infaq Sadakoh Donatur & Jamaah', 'amount' => 880_000, 'category' => 'Donatur', 'recorded_by' => 'T. Handoko', 'status' => 'Approved'],
            ['ref_number' => 'INV/20260610/001', 'date' => '2026-06-10', 'type' => 'Masuk', 'account_code' => '401.3', 'account_name' => 'Infaq & Sadakoh Donatur', 'description' => 'Kotak Amal Masjid Utama', 'amount' => 1_995_000, 'category' => 'Kotak Masjid', 'recorded_by' => 'T. Handoko', 'status' => 'Approved'],
            ['ref_number' => 'INV/20260605/001', 'date' => '2026-06-05', 'type' => 'Masuk', 'account_code' => '401.1', 'account_name' => 'Infaq Sholat Jumat', 'description' => 'Kotak Amal Sholat Jumat Bulan Juni', 'amount' => 3_008_500, 'category' => 'Infaq Jumat', 'recorded_by' => 'T. Handoko', 'status' => 'Approved'],
        ] as $tx) {
            FinancialTransaction::create($tx);
        }

        // Budget
        foreach ([
            ['category' => 'Operasional Listrik, Air & Kebersihan', 'allocated_amount' => 45_000_000, 'used_amount' => 26_500_000, 'period' => 'Tahun 2026'],
            ['category' => 'Honorarium Imam, Muadzin & Marbot', 'allocated_amount' => 96_000_000, 'used_amount' => 56_000_000, 'period' => 'Tahun 2026'],
            ['category' => 'Program Dakwah, Kajian & Tabligh Akbar', 'allocated_amount' => 35_000_000, 'used_amount' => 18_200_000, 'period' => 'Tahun 2026'],
            ['category' => 'Renovasi Kanopi & Sound System Utama', 'allocated_amount' => 120_000_000, 'used_amount' => 85_000_000, 'period' => 'Tahun 2026'],
        ] as $b) {
            BudgetPlan::create($b);
        }

        // Campaigns
        DonationCampaign::create(['title' => 'Pengadaan & Renovasi Kanopi Selasar Barat', 'category' => 'Renovasi', 'target_amount' => 85_000_000, 'collected_amount' => 62_400_000, 'donor_count' => 142, 'deadline' => '2026-08-31', 'description' => 'Renovasi kanopi selasar seluas 120m²', 'is_urgent' => true]);
        DonationCampaign::create(['title' => 'Santunan 100 Anak Yatim & Dhuafa Pejaten Timur', 'category' => 'Social/Yatim', 'target_amount' => 50_000_000, 'collected_amount' => 38_200_000, 'donor_count' => 98, 'deadline' => '2026-08-15', 'description' => 'Program santunan bulanan berupa uang saku sekolah dan paket sembako']);
        DonationCampaign::create(['title' => 'Bantuan Operasional Ibadah & Syiar Ramadhan', 'category' => 'Operasional', 'target_amount' => 30_000_000, 'collected_amount' => 21_500_000, 'donor_count' => 64, 'deadline' => '2026-09-30', 'description' => 'Dukungan operasional ibadah Ramadhan, takjil gratis & syiar dakwah']);

        // Donors
        DonorRecord::create(['donor_name' => 'H. Bambang Sugipto', 'phone' => '081233445566', 'email' => 'bambang@gmail.com', 'donation_campaign_id' => 1, 'amount' => 2_500_000, 'method' => 'Transfer BSI', 'date' => '2026-07-23', 'status' => 'Diterima']);
        DonorRecord::create(['donor_name' => 'Hamba Allah', 'phone' => '081599001122', 'donation_campaign_id' => 2, 'amount' => 500_000, 'method' => 'QRIS', 'date' => '2026-07-23', 'status' => 'Diterima', 'is_anonymous' => true]);
        DonorRecord::create(['donor_name' => 'Hj. Ratna Sari', 'phone' => '081122334455', 'email' => 'ratna.sari@yahoo.com', 'donation_campaign_id' => 1, 'amount' => 1_000_000, 'method' => 'QRIS', 'date' => '2026-07-22', 'status' => 'Diterima']);

        // Qurban
        QurbanParticipant::create(['participant_name' => 'Kelompok H. Zamzami (1/7 Sapi Limosin A)', 'animal_type' => 'Sapi', 'group_name' => 'Sapi Limosin A - 380 Kg', 'phone' => '081299881122', 'amount' => 3_800_000, 'payment_status' => 'Lunas', 'coupon_code' => 'KPN-SP01-01']);
        QurbanParticipant::create(['participant_name' => 'Ibu Hj. Hendrawati', 'animal_type' => 'Kambing', 'phone' => '081377665544', 'amount' => 3_500_000, 'payment_status' => 'Lunas', 'coupon_code' => 'KPN-KB01-05', 'is_distributed' => true]);
        QurbanParticipant::create(['participant_name' => 'Bpk. Dr. Kurniawan', 'animal_type' => 'Domba Super', 'phone' => '081144556677', 'amount' => 4_200_000, 'payment_status' => 'DP', 'coupon_code' => 'KPN-DB01-02']);

        // Inventory
        InventoryItem::create(['code' => 'AST-AC-2024-001', 'name' => 'AC Inverter Daikin 2 PK Split Wall', 'category' => 'Elektronik', 'location' => 'Ruang Utama Sholat', 'quantity' => 6, 'unit' => 'Unit', 'condition' => 'Sangat Baik', 'purchase_date' => '2024-03-15', 'purchase_price' => 9_500_000, 'current_value' => 7_800_000, 'qr_code' => 'QR-AST-AC-2024-001', 'last_maintenance' => '2026-07-21', 'notes' => 'Service rutin pencucian evaporator']);
        InventoryItem::create(['code' => 'AST-SPK-2025-002', 'name' => 'Speaker Active Column Yamaha DBR15 1000W', 'category' => 'Elektronik', 'location' => 'Mimbar Utama & Selasar', 'quantity' => 4, 'unit' => 'Set', 'condition' => 'Sangat Baik', 'purchase_date' => '2025-01-10', 'purchase_price' => 14_200_000, 'current_value' => 12_500_000, 'qr_code' => 'QR-AST-SPK-2025-002', 'last_maintenance' => '2026-06-10', 'notes' => 'Termasuk digital mixer Soundcraft Signature 16']);
        InventoryItem::create(['code' => 'AST-KRP-2023-005', 'name' => 'Karpet Sajadah Import Turki Premium 16mm', 'category' => 'Alat Ibadah', 'location' => 'Ruang Utama Sholat', 'quantity' => 120, 'unit' => 'Meter', 'condition' => 'Baik', 'purchase_date' => '2023-09-01', 'purchase_price' => 650_000, 'current_value' => 500_000, 'qr_code' => 'QR-AST-KRP-2023-005', 'last_maintenance' => '2026-07-01', 'notes' => 'Vacuum cleaning mingguan']);
        InventoryItem::create(['code' => 'AST-MMB-2022-001', 'name' => 'Mimbar Jati Ukir Kaligrafi Jepara Custom', 'category' => 'Mebel & Interior', 'location' => 'Mihrab Utama', 'quantity' => 1, 'unit' => 'Unit', 'condition' => 'Sangat Baik', 'purchase_date' => '2022-05-10', 'purchase_price' => 25_000_000, 'current_value' => 25_000_000, 'qr_code' => 'QR-AST-MMB-2022-001', 'notes' => 'Bahan Kayu Jati Perhutani Grade A']);

        // Kajian
        KajianEvent::create(['title' => "Kajian Rutin Subuh: Tafsir Al-Qur'an Surah Al-Kahfi", 'speaker' => 'KH. Drs. Ahmad Fauzi, M.Ag.', 'speaker_title' => 'Ketua MUI Pasar Minggu', 'date' => '2026-07-26', 'time' => '05:15', 'location' => 'Ruang Utama Masjid Jami Nurul Iman', 'category' => 'Tafsir', 'description' => 'Menyelami keutamaan Surah Al-Kahfi dan pelajaran kepemimpinan pemuda Kahf']);
        KajianEvent::create(['title' => 'Kajian Muslimah & Keluarga: Fiqh Munakahat', 'speaker' => 'Ustadzah Hj. Dr. Nurul Hidayah, Lc., MA.', 'speaker_title' => 'Pakar Fiqh Keluarga & Dosen PTIN', 'date' => '2026-07-28', 'time' => '09:00', 'location' => 'Aula Lantai 2 Masjid', 'category' => 'Fiqh', 'description' => 'Panduan membangun komunikasi penuh rahmah dan pendidikan karakter anak']);
        KajianEvent::create(['title' => 'Tabligh Akbar Subuh Berjamaah & Santunan Yatim Pejaten', 'speaker' => 'Ustadz Farhan Al-Hafiz, Lc.', 'speaker_title' => 'Alumnus Univ. Al-Azhar Kairo & Imam Masjid', 'date' => '2026-08-02', 'time' => '04:45', 'location' => 'Ruang Utama & Selasar Masjid', 'category' => 'Tematik', 'description' => 'Mewujudkan Ukhuwah Islamiyah melalui gerakan kepedulian anak yatim dan dhuafa']);

        // Letters
        OfficialLetter::create(['letter_number' => '045/DKM-NI/PJM/VII/2026', 'type' => 'Keluar', 'sender_or_recipient' => 'Kelurahan Pejaten Timur', 'subject' => 'Permohonan Izin Tempat & Keramaian Tabligh Akbar', 'date' => '2026-07-20', 'disposition_to' => 'Sekretaris DKM', 'status' => 'Selesai']);
        OfficialLetter::create(['letter_number' => '112/KUA-PSM/VII/2026', 'type' => 'Masuk', 'sender_or_recipient' => 'KUA Kecamatan Pasar Minggu', 'subject' => 'Undangan Rapat Koordinasi Panitia ZISWAF', 'date' => '2026-07-22', 'disposition_to' => 'Ketua DKM & Bendahara', 'status' => 'Diproses']);

        // Articles
        CMSArticle::create(['title' => 'Keutamaan Menjaga Sholat Subuh Berjamaah & Dzikir Pagi', 'category' => 'Dakwah', 'author' => 'KH. Drs. Ahmad Fauzi, M.Ag.', 'date' => '2026-07-22', 'summary' => 'Rasulullah SAW bersabda bahwa dua rakaat sebelum Subuh lebih baik dari dunia dan seisinya.', 'content' => 'Sholat Subuh berjamaah di masjid membawa keberkahan luar biasa dalam kehidupan seorang muslim...', 'views' => 420, 'is_published' => true]);
        CMSArticle::create(['title' => 'Laporan Progres Renovasi Kanopi Selasar Masjid', 'category' => 'Pengumuman', 'author' => 'Sekretariat DKM', 'date' => '2026-07-20', 'summary' => 'Progres pengerjaan kanopi selasar telah mencapai 75%.', 'content' => 'Alhamdulillah, pengerjaan rangka baja ringan dan atap kanopi berjalan lancar...', 'views' => 615, 'is_published' => true]);

        // Audit Logs
        AuditLog::create(['timestamp' => '2026-08-19 10:15:22', 'user_name' => 'T. Handoko', 'user_role' => 'Bendahara', 'action' => 'CREATE_TRANSACTION', 'module' => 'Keuangan', 'details' => 'Menambahkan transaksi Kas Masuk Rp 250.000 (QRIS Bpk Abdulloh Jusuf)', 'ip_address' => '180.252.110.45']);
        AuditLog::create(['timestamp' => '2026-08-18 08:30:10', 'user_name' => 'H. Hamdani', 'user_role' => 'Ketua DKM', 'action' => 'APPROVE_BUDGET', 'module' => 'Approval', 'details' => 'Menyetujui realisasi pengeluaran kas ibadah sholat Jumat', 'ip_address' => '180.252.110.12']);
        AuditLog::create(['timestamp' => '2026-08-15 16:45:00', 'user_name' => 'Ustadz Abdullah', 'user_role' => 'Sekretaris', 'action' => 'UPDATE_AGENDA', 'module' => 'Website CMS', 'details' => 'Memperbarui poster & jadwal Kajian Subuh KH. Ahmad Fauzi', 'ip_address' => '180.252.112.89']);

        echo "\n  ✅ DataSeeder: ".FinancialTransaction::count().' transactions, '
            .DonationCampaign::count().' campaigns, '
            .InventoryItem::count().' items, '
            .KajianEvent::count()." events seeded.\n";
    }
}
