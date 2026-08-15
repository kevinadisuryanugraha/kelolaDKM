import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../../context/AppContext';
import { InventoryItem } from '../../types';
import { FilterTabs } from '../common/FilterTabs';
import { DataTable, DataTableColumn } from '../common/DataTable';
import { Package, Plus, QrCode, Download, X } from 'lucide-react';
import { GlassCard } from '../common/GlassCard';

export const InventarisSarprasModule: React.FC = () => {
  const { inventoryItems, addInventoryItem, roomBookings, openExportModal } = useApp();

  const [activeTab, setActiveTab] = useState<'inventory' | 'booking'>('inventory');
  const [selectedQrItem, setSelectedQrItem] = useState<InventoryItem | null>(null);
  const [isAddItemOpen, setIsAddItemOpen] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [category, setCategory] = useState<'Elektronik' | 'Mebel & Interior' | 'Alat Ibadah' | 'Lainnya'>('Elektronik');
  const [location, setLocation] = useState('Ruang Utama Sholat');
  const [quantity] = useState<number>(1);
  const [unit] = useState('Unit');
  const [condition] = useState<'Sangat Baik' | 'Baik' | 'Perlu Perbaikan'>('Sangat Baik');
  const [purchasePrice, setPurchasePrice] = useState<number>(5000000);

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    addInventoryItem({
      name,
      category,
      location,
      quantity,
      unit,
      condition,
      purchaseDate: new Date().toISOString().slice(0, 10),
      purchasePrice: Number(purchasePrice),
      currentValue: Number(purchasePrice) * 0.9,
      notes: 'Pencatatan aset baru via KelolaDKM'
    });
    setIsAddItemOpen(false);
    setName('');
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
        <button
          onClick={() => setSelectedQrItem(item)}
          className="px-3 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-emerald-500/10 text-slate-700 dark:text-slate-300 rounded-xl font-mono text-[10px] font-bold flex items-center gap-1 mx-auto border border-slate-200/60 dark:border-slate-700/60"
        >
          <QrCode className="w-3.5 h-3.5 text-emerald-600" />
          <span>Scan</span>
        </button>
      )
    }
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header Card */}
      <GlassCard className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4" glow="emerald" hoverEffect={false}>
        <div>
          <h2 className="font-bold text-xl text-slate-900 dark:text-white flex items-center gap-2">
            <Package className="w-6 h-6 text-amber-500" />
            <span>Modul Inventaris, Aset & Booking Sarpras</span>
          </h2>
          <p className="text-xs text-slate-500 font-medium">Pencatatan Aset Masjid, Barcode QR Code, Penyusutan & Booking Ruangan</p>
        </div>

        <div className="flex items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setIsAddItemOpen(true)}
            className="px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white rounded-2xl text-xs font-bold shadow-md flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Aset Inventaris</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => openExportModal('Laporan Aset Inventaris Masjid', inventoryItems)}
            className="px-4 py-2.5 bg-slate-100/80 dark:bg-slate-800/80 hover:bg-slate-200 text-slate-700 dark:text-slate-200 rounded-2xl text-xs font-bold flex items-center gap-2 border border-slate-200/60 dark:border-slate-700/60"
          >
            <Download className="w-4 h-4" />
            <span>Export Aset</span>
          </motion.button>
        </div>
      </GlassCard>

      {/* Tabs */}
      <FilterTabs
        tabs={[
          { id: 'inventory', label: 'Daftar Aset & QR Code' },
          { id: 'booking', label: 'Jadwal Booking Ruangan / Sarpras' }
        ]}
        activeTab={activeTab}
        onChange={(id) => setActiveTab(id as any)}
      />

      {/* Tab 1: Inventory Table */}
      {activeTab === 'inventory' && (
        <GlassCard className="p-0 overflow-hidden" glow="emerald" hoverEffect={false}>
          <DataTable columns={inventoryColumns} data={inventoryItems} keyField="id" minWidth="min-w-[900px]" />
        </GlassCard>
      )}

      {/* Tab 2: Booking */}
      {activeTab === 'booking' && (
        <GlassCard className="p-6 space-y-4" glow="emerald" hoverEffect={false}>
          <h3 className="font-bold text-base text-slate-900 dark:text-white">Daftar Peminjaman Ruangan & Sarpras</h3>
          <div className="space-y-3">
            {roomBookings.map((b) => (
              <div key={b.id} className="p-4 bg-slate-100/60 dark:bg-slate-800/60 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-slate-900 dark:text-white text-sm">{b.eventName}</div>
                  <div className="text-slate-500 font-medium">
                    Pemohon: {b.applicantName} • {b.roomName}
                  </div>
                  <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono mt-0.5 font-bold">{b.startDate} s/d {b.endDate}</div>
                </div>
                <span className="px-3 py-1 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 rounded-full font-bold text-[10px] border border-emerald-500/20">
                  {b.status}
                </span>
              </div>
            ))}
          </div>
        </GlassCard>
      )}

      {/* QR Code Modal */}
      <AnimatePresence>
        {selectedQrItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 max-w-sm w-full p-6 text-center space-y-4 shadow-2xl"
            >
              <h3 className="font-bold text-base text-slate-900 dark:text-white">QR Code Label Inventaris</h3>
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-inner w-44 h-44 mx-auto flex flex-col items-center justify-center">
                <QrCode className="w-32 h-32 text-slate-900" />
              </div>
              <div className="space-y-1">
                <div className="font-mono font-bold text-xs text-emerald-600 dark:text-emerald-400">{selectedQrItem.code}</div>
                <div className="font-bold text-sm text-slate-900 dark:text-white">{selectedQrItem.name}</div>
                <p className="text-[11px] text-slate-500 font-medium">Lokasi: {selectedQrItem.location}</p>
              </div>
              <button
                onClick={() => setSelectedQrItem(null)}
                className="w-full py-2.5 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white rounded-2xl text-xs font-bold"
              >
                Tutup QR Label
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal Add Item */}
      <AnimatePresence>
        {isAddItemOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 max-w-md w-full p-6 space-y-4 my-8 shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800/80 pb-3">
                <h3 className="font-bold text-base text-slate-900 dark:text-white">Pencatatan Aset Inventaris Baru</h3>
                <button onClick={() => setIsAddItemOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddItem} className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-600 dark:text-slate-400 mb-1.5">Nama Aset / Barang</label>
                  <input
                    type="text"
                    placeholder="Contoh: Sound System Wireless Shure"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none text-slate-900 dark:text-white"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-semibold text-slate-600 dark:text-slate-400 mb-1.5">Kategori</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value as any)}
                      className="w-full px-4 py-2.5 bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none text-slate-900 dark:text-white"
                    >
                      <option value="Elektronik">Elektronik</option>
                      <option value="Mebel & Interior">Mebel & Interior</option>
                      <option value="Alat Ibadah">Alat Ibadah</option>
                      <option value="Lainnya">Lainnya</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-600 dark:text-slate-400 mb-1.5">Lokasi</label>
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-600 dark:text-slate-400 mb-1.5">Harga Beli (Rp)</label>
                  <input
                    type="number"
                    value={purchasePrice}
                    onChange={(e) => setPurchasePrice(Number(e.target.value))}
                    className="w-full px-4 py-2.5 bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl font-mono text-slate-900 dark:text-white"
                    required
                  />
                </div>

                <button type="submit" className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white font-bold rounded-2xl shadow-md">
                  Simpan & Generate Label Barcode QR
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
