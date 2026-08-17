import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../../context/AppContext';
import { InventoryItem, RoomBooking } from '../../types';
import { FilterTabs } from '../common/FilterTabs';
import { DataTable, DataTableColumn } from '../common/DataTable';
import {
  Package,
  Plus,
  QrCode,
  Download,
  X,
  ArrowLeft,
  ChevronRight,
  Save,
  CheckCircle2,
  MapPin,
  Building,
  Tag,
  Calendar,
  Layers,
  Printer
} from 'lucide-react';
import { GlassCard } from '../common/GlassCard';

export const InventarisSarprasModule: React.FC = () => {
  const { inventoryItems, addInventoryItem, roomBookings, openExportModal, showToast } = useApp();

  const [activeTab, setActiveTab] = useState<'inventory' | 'booking'>('inventory');
  const [selectedQrItem, setSelectedQrItem] = useState<InventoryItem | null>(null);
  const [isAddItemView, setIsAddItemView] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [category, setCategory] = useState<'Elektronik' | 'Mebel & Interior' | 'Alat Ibadah' | 'Lainnya'>('Elektronik');
  const [location, setLocation] = useState('Ruang Utama Sholat');
  const [quantity, setQuantity] = useState<number>(1);
  const [unit, setUnit] = useState('Unit');
  const [condition, setCondition] = useState<'Sangat Baik' | 'Baik' | 'Perlu Perbaikan'>('Sangat Baik');
  const [purchasePrice, setPurchasePrice] = useState<number>(5000000);
  const [notes, setNotes] = useState('');

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      showToast('Nama aset inventaris wajib diisi!', 'error');
      return;
    }

    addInventoryItem({
      name,
      category,
      location,
      quantity: Number(quantity),
      unit,
      condition,
      purchaseDate: new Date().toISOString().slice(0, 10),
      purchasePrice: Number(purchasePrice),
      currentValue: Number(purchasePrice) * 0.9,
      notes: notes || 'Pencatatan aset baru via KelolaDKM'
    });
    setIsAddItemView(false);
    setName('');
    setNotes('');
    showToast(`Aset "${name}" berhasil dicatat dan label QR otomatis digenerate!`, 'success');
  };

  const inventoryColumns: DataTableColumn<InventoryItem>[] = [
    { key: 'code', header: 'Kode Aset', className: 'font-mono font-bold text-emerald-600 dark:text-emerald-400 whitespace-nowrap' },
    {
      key: 'name',
      header: 'Nama Aset / Barang',
      render: (item) => (
        <div>
          <div className="font-bold text-slate-900 dark:text-slate-100">{item.name}</div>
          <div className="text-[10px] text-slate-400">{item.notes}</div>
        </div>
      )
    },
    {
      key: 'category',
      header: 'Kategori & Lokasi',
      render: (item) => (
        <div>
          <span className="px-2.5 py-0.5 bg-slate-100 dark:bg-slate-800 font-bold rounded-full text-[10px] border border-slate-200/60 dark:border-slate-700/60 whitespace-nowrap">
            {item.category}
          </span>
          <span className="text-[10px] text-slate-500 font-medium block mt-0.5 whitespace-nowrap">{item.location}</span>
        </div>
      )
    },
    {
      key: 'quantity',
      header: 'Jumlah',
      className: 'text-center font-bold font-mono text-slate-900 dark:text-white whitespace-nowrap',
      render: (item) => `${item.quantity} ${item.unit}`
    },
    {
      key: 'condition',
      header: 'Kondisi',
      className: 'text-center whitespace-nowrap',
      render: (item) => (
        <span
          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold whitespace-nowrap ${
            item.condition === 'Sangat Baik'
              ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20'
              : 'bg-amber-500/10 text-amber-800 dark:text-amber-300 border border-amber-500/20'
          }`}
        >
          {item.condition}
        </span>
      )
    },
    {
      key: 'purchasePrice',
      header: 'Nilai Beli (Rp)',
      className: 'text-right font-mono font-bold text-slate-900 dark:text-white whitespace-nowrap',
      render: (item) => `Rp ${item.purchasePrice.toLocaleString('id-ID')}`
    },
    {
      key: 'actions',
      header: 'QR Code',
      className: 'text-center whitespace-nowrap',
      render: (item) => (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setSelectedQrItem(selectedQrItem?.id === item.id ? null : item)}
          className={`px-3 py-1.5 rounded-xl text-[10px] font-bold flex items-center gap-1 mx-auto transition-all ${
            selectedQrItem?.id === item.id
              ? 'bg-emerald-600 text-white'
              : 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30'
          }`}
        >
          <QrCode className="w-3 h-3" />
          <span>{selectedQrItem?.id === item.id ? 'Tutup Label' : 'Label QR'}</span>
        </motion.button>
      )
    }
  ];

  const bookingColumns: DataTableColumn<RoomBooking>[] = [
    { key: 'id', header: 'ID Booking', className: 'font-mono text-slate-500 font-bold whitespace-nowrap' },
    { key: 'roomName', header: 'Ruangan', className: 'font-bold text-slate-900 dark:text-white whitespace-nowrap' },
    { key: 'applicantName', header: 'Pemohon / Instansi', className: 'font-semibold whitespace-nowrap' },
    { key: 'activityName', header: 'Nama Kegiatan' },
    { key: 'date', header: 'Tanggal Pelaksanaan', className: 'font-mono text-slate-500 whitespace-nowrap' },
    { key: 'timeSlot', header: 'Waktu', className: 'font-mono font-bold text-emerald-600 dark:text-emerald-400 whitespace-nowrap' },
    {
      key: 'status',
      header: 'Status',
      className: 'text-center whitespace-nowrap',
      render: (b) => (
        <span
          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
            b.status === 'Disetujui'
              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
              : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
          }`}
        >
          {b.status}
        </span>
      )
    }
  ];

  // Dedicated Full-Page Form View for Adding New Inventory Item
  if (isAddItemView) {
    return (
      <div className="space-y-6 pb-16">
        {/* Navigation & Breadcrumbs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <button
            onClick={() => setIsAddItemView(false)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs font-bold text-slate-700 dark:text-slate-200 hover:text-emerald-600 hover:border-emerald-500 shadow-xs transition-all w-fit"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Daftar Inventaris & Sarpras</span>
          </button>

          <div className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
            <span>Sarpras</span>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-emerald-600 dark:text-emerald-400 font-bold">Registrasi Aset Inventaris Baru</span>
          </div>
        </div>

        {/* Full-Page Form Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Form: Inputs */}
          <GlassCard className="lg:col-span-7 p-6 sm:p-8 space-y-6" glow="emerald" hoverEffect={false}>
            <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
              <h2 className="font-bold text-xl text-slate-900 dark:text-white flex items-center gap-2">
                <Package className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                <span>Formulir Pencatatan Aset Inventaris Masjid</span>
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Catat aset inventaris fisik masjid, spesifikasi, lokasi penempatan, dan nilai perolehan untuk otomatisasi barcode QR.
              </p>
            </div>

            <form onSubmit={handleAddItem} className="space-y-5 text-xs">
              {/* Asset Name */}
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Nama Aset / Perlengkapan *
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Sound System Wireless Shure SLX-D 4 Channel"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none"
                  required
                />
              </div>

              {/* Category & Location */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">Kategori Aset</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs font-semibold text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none"
                  >
                    <option value="Elektronik">⚡ Elektronik & Audio</option>
                    <option value="Mebel & Interior">🪑 Mebel & Interior</option>
                    <option value="Alat Ibadah">🕌 Alat & Sarana Ibadah</option>
                    <option value="Lainnya">📦 Lainnya / Perlengkapan</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">Lokasi Penempatan</label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Contoh: Ruang Utama Sholat Lantai 1"
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none"
                    required
                  />
                </div>
              </div>

              {/* Quantity & Unit & Condition */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">Jumlah</label>
                  <input
                    type="number"
                    min={1}
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs font-mono font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">Satuan</label>
                  <input
                    type="text"
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    placeholder="Unit / Set / Pcs"
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">Kondisi Fisik</label>
                  <select
                    value={condition}
                    onChange={(e) => setCondition(e.target.value as any)}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs font-semibold text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none"
                  >
                    <option value="Sangat Baik">🟢 Sangat Baik (100%)</option>
                    <option value="Baik">🟡 Baik (Normal)</option>
                    <option value="Perlu Perbaikan">🔴 Perlu Perbaikan</option>
                  </select>
                </div>
              </div>

              {/* Purchase Price */}
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Estimasi Harga / Nilai Perolehan (Rupiah) *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 font-bold">
                    Rp
                  </div>
                  <input
                    type="number"
                    min={0}
                    step={50000}
                    value={purchasePrice}
                    onChange={(e) => setPurchasePrice(Number(e.target.value))}
                    className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-base font-mono font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none"
                    required
                  />
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">Catatan Tambahan</label>
                <textarea
                  rows={2}
                  placeholder="Keterangan merk, garansi, atau sumber pengadaan infaq..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full p-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none leading-relaxed"
                />
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddItemView(false)}
                  className="px-5 py-3 text-slate-500 hover:text-slate-800 dark:hover:text-white font-semibold text-xs rounded-2xl"
                >
                  Batal
                </button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="px-7 py-3 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white font-bold rounded-2xl text-xs shadow-md flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  <span>Simpan & Generate Barcode QR</span>
                </motion.button>
              </div>
            </form>
          </GlassCard>

          {/* Right: Live Asset Card & Barcode QR Preview */}
          <div className="lg:col-span-5 space-y-6">
            <GlassCard className="p-6 space-y-4" glow="emerald" hoverEffect={false}>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center gap-2">
                <QrCode className="w-4 h-4 text-emerald-600" />
                <span>Simulasi Label Inventaris & QR Code</span>
              </h3>

              <div className="bg-slate-50 dark:bg-slate-800/80 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 space-y-4 text-xs">
                <div className="text-center space-y-1">
                  <span className="text-[10px] px-2.5 py-0.5 bg-emerald-600 text-white font-bold rounded-full">
                    ASET RESMI MASJID NURUL IMAN
                  </span>
                  <h4 className="font-bold text-slate-900 dark:text-white text-base">
                    {name || '[Nama Aset Inventaris]'}
                  </h4>
                  <p className="text-[11px] text-slate-500 font-mono">Kode Aset Otomatis: AST-{String(inventoryItems.length + 1).padStart(3, '0')}</p>
                </div>

                <div className="w-32 h-32 bg-white dark:bg-slate-900 p-2.5 rounded-2xl mx-auto border-2 border-slate-200 dark:border-slate-700 shadow-inner flex flex-col items-center justify-center space-y-1.5">
                  <QrCode className="w-16 h-16 text-slate-900 dark:text-emerald-400" />
                  <span className="text-[9px] font-mono font-bold text-slate-500">AST-{String(inventoryItems.length + 1).padStart(3, '0')}</span>
                </div>

                <div className="border-t border-slate-200 dark:border-slate-700 pt-3 space-y-2 text-[11px]">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Kategori:</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">{category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Lokasi:</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">{location}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Kondisi Fisik:</span>
                    <span className="font-bold text-emerald-600">{condition}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Estimasi Nilai:</span>
                    <span className="font-bold font-mono text-slate-900 dark:text-white">Rp {purchasePrice.toLocaleString('id-ID')}</span>
                  </div>
                </div>
              </div>
            </GlassCard>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Header Card */}
      <GlassCard className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4" glow="emerald" hoverEffect={false}>
        <div>
          <h2 className="font-bold text-xl text-slate-900 dark:text-white flex items-center gap-2">
            <Package className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            <span>Modul Inventaris & Sarana Prasarana DKM</span>
          </h2>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Database aset fisik masjid, pencetakan label barcode QR, dan manajemen permohonan booking ruangan.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              setActiveTab('inventory');
              setIsAddItemView(true);
            }}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-sm flex items-center gap-2 transition-all"
          >
            <Plus className="w-4 h-4 text-white" />
            <span>Tambah Aset Baru</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => openExportModal('Daftar Aset & Inventaris DKM', inventoryItems)}
            className="px-4 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold flex items-center gap-2 border border-slate-200 dark:border-slate-700 transition-all"
          >
            <Download className="w-4 h-4 text-emerald-600" />
            <span>Export Inventaris</span>
          </motion.button>
        </div>
      </GlassCard>

      {/* Filter Tabs */}
      <FilterTabs
        tabs={[
          { id: 'inventory', labelKey: 'dashboard.tabs.inventory' },
          { id: 'booking', labelKey: 'dashboard.tabs.booking' }
        ]}
        activeTab={activeTab}
        onChange={(t) => setActiveTab(t as any)}
      />

      {/* Inline Dedicated QR Label Card when clicked */}
      <AnimatePresence>
        {selectedQrItem && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 15 }}
          >
            <GlassCard className="p-6 border-2 border-emerald-500/40 space-y-4" glow="emerald" hoverEffect={false}>
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <QrCode className="w-5 h-5 text-emerald-600" />
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                    Label Barcode QR Resmi: {selectedQrItem.name}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedQrItem(null)}
                  className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-lg"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-6 bg-slate-50 dark:bg-slate-800/80 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-700/80">
                <div className="w-28 h-28 bg-white dark:bg-slate-900 p-2 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col items-center justify-center shrink-0">
                  <QrCode className="w-16 h-16 text-emerald-600" />
                  <span className="text-[9px] font-mono font-bold text-slate-500">{selectedQrItem.code}</span>
                </div>

                <div className="space-y-1.5 text-xs flex-1 text-center sm:text-left">
                  <div className="text-[10px] font-mono text-emerald-600 font-bold">{selectedQrItem.code} • DKM MASJID JAMI NURUL IMAN</div>
                  <h4 className="font-bold text-base text-slate-900 dark:text-white">{selectedQrItem.name}</h4>
                  <p className="text-slate-500 text-xs">Penempatan: {selectedQrItem.location} • Kondisi: {selectedQrItem.condition}</p>
                  <p className="text-slate-400 text-[11px] font-mono">Nilai Aset: Rp {selectedQrItem.purchasePrice.toLocaleString('id-ID')} ({selectedQrItem.quantity} {selectedQrItem.unit})</p>
                </div>

                <button
                  onClick={() => showToast(`Label QR untuk ${selectedQrItem.name} siap dicetak!`, 'success')}
                  className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm shrink-0"
                >
                  <Printer className="w-4 h-4" />
                  <span>Cetak Stiker Label</span>
                </button>
              </div>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tab 1: Inventory Table */}
      {activeTab === 'inventory' && (
        <GlassCard className="p-0 overflow-hidden" glow="emerald" hoverEffect={false}>
          <DataTable columns={inventoryColumns} data={inventoryItems} keyField="id" minWidth="min-w-[900px]" />
        </GlassCard>
      )}

      {/* Tab 2: Room Bookings Table */}
      {activeTab === 'booking' && (
        <GlassCard className="p-0 overflow-hidden" glow="emerald" hoverEffect={false}>
          <DataTable columns={bookingColumns} data={roomBookings} keyField="id" minWidth="min-w-[850px]" />
        </GlassCard>
      )}
    </div>
  );
};
