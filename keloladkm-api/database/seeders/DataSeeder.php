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
        // COA
        foreach ([
            ['code' => '101.1', 'name' => 'Kas Tunai Utama Masjid', 'type' => 'Aset', 'balance' => 18_500_000],
            ['code' => '101.2', 'name' => 'Kas Tunai Kotak Infaq', 'type' => 'Aset', 'balance' => 7_200_000],
            ['code' => '102.1', 'name' => 'Bank BSI - Rekening Kas Operasional', 'type' => 'Aset', 'balance' => 142_800_000],
            ['code' => '102.2', 'name' => 'Bank BSI - Rekening ZISWAF', 'type' => 'Aset', 'balance' => 52_000_000],
            ['code' => '102.3', 'name' => 'Bank Mandiri - Rekening Pembangunan', 'type' => 'Aset', 'balance' => 28_000_000],
            ['code' => '401.1', 'name' => 'Infaq Salat Jumat', 'type' => 'Penerimaan', 'balance' => 85_400_000],
            ['code' => '401.2', 'name' => 'Donasi Online & QRIS', 'type' => 'Penerimaan', 'balance' => 64_200_000],
            ['code' => '402.1', 'name' => 'Penerimaan Zakat Mal & Fitrah', 'type' => 'Penerimaan', 'balance' => 48_000_000],
            ['code' => '501.1', 'name' => 'Beban Listrik, Air & Wi-Fi', 'type' => 'Pengeluaran', 'balance' => 14_500_000],
            ['code' => '501.2', 'name' => 'Honorarium Imam, Muadzin & Marbot', 'type' => 'Pengeluaran', 'balance' => 28_000_000],
            ['code' => '502.1', 'name' => 'Pemeliharaan AC, Sound System & Karpet', 'type' => 'Pengeluaran', 'balance' => 12_400_000],
        ] as $c) {
            FinancialAccount::create($c);
        }

        // Transactions
        foreach ([
            ['ref_number' => 'TRX-2026-089', 'date' => '2026-07-24', 'type' => 'Masuk', 'account_code' => '401.1', 'account_name' => 'Infaq Salat Jumat', 'description' => 'Infaq Kotak Salat Jumat Pekan IV Juli 2026', 'amount' => 8_450_000, 'category' => 'Infaq Jumat', 'recorded_by' => 'H. Rahmat Hidayat', 'status' => 'Approved'],
            ['ref_number' => 'TRX-2026-088', 'date' => '2026-07-23', 'type' => 'Keluar', 'account_code' => '501.1', 'account_name' => 'Beban Listrik, Air & Wi-Fi', 'description' => 'Tagihan PLN & Indihome Juli 2026', 'amount' => 3_250_000, 'category' => 'Operasional', 'recorded_by' => 'H. Rahmat Hidayat', 'status' => 'Approved'],
            ['ref_number' => 'TRX-2026-087', 'date' => '2026-07-22', 'type' => 'Masuk', 'account_code' => '401.2', 'account_name' => 'Donasi Online & QRIS', 'description' => 'Donasi QRIS Jamaah - Renovasi Kanopi', 'amount' => 5_000_000, 'category' => 'Donasi Pembangunan', 'recorded_by' => 'Admin QRIS', 'status' => 'Approved'],
            ['ref_number' => 'TRX-2026-086', 'date' => '2026-07-21', 'type' => 'Keluar', 'account_code' => '502.1', 'account_name' => 'Pemeliharaan AC & Sound System', 'description' => 'Service 8 Unit AC Inverter', 'amount' => 1_400_000, 'category' => 'Maintenance', 'recorded_by' => 'Ir. H. Budi Santoso', 'status' => 'Approved'],
            ['ref_number' => 'TRX-2026-085', 'date' => '2026-07-20', 'type' => 'Masuk', 'account_code' => '402.1', 'account_name' => 'Penerimaan Zakat Mal', 'description' => 'Zakat Mal Bpk H. Hartono Pejaten', 'amount' => 12_500_000, 'category' => 'Zakat', 'recorded_by' => 'H. Rahmat Hidayat', 'status' => 'Approved'],
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
        AuditLog::create(['timestamp' => '2026-07-24 09:15:22', 'user_name' => 'H. Rahmat Hidayat', 'user_role' => 'Bendahara', 'action' => 'CREATE_TRANSACTION', 'module' => 'Keuangan', 'details' => 'Menambahkan transaksi Kas Masuk Rp 8.450.000 (Infaq Jumat)', 'ip_address' => '180.252.110.45']);
        AuditLog::create(['timestamp' => '2026-07-24 08:30:10', 'user_name' => 'H. M. Zamzami', 'user_role' => 'Ketua DKM', 'action' => 'APPROVE_BUDGET', 'module' => 'Approval', 'details' => 'Menyetujui pengajuan 2 unit Microphone Wireless Shure', 'ip_address' => '180.252.110.12']);
        AuditLog::create(['timestamp' => '2026-07-23 16:45:00', 'user_name' => 'Ustadz Abdullah', 'user_role' => 'Sekretaris', 'action' => 'UPDATE_AGENDA', 'module' => 'Website CMS', 'details' => 'Memperbarui poster & jadwal Kajian Subuh KH. Ahmad Fauzi', 'ip_address' => '180.252.112.89']);

        echo "\n  ✅ DataSeeder: ".FinancialTransaction::count().' transactions, '
            .DonationCampaign::count().' campaigns, '
            .InventoryItem::count().' items, '
            .KajianEvent::count()." events seeded.\n";
    }
}
