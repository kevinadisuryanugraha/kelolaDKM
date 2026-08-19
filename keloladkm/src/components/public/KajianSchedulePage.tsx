import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useApp } from '../../context/AppContext';
import { Search, MapPin, MessageCircle } from 'lucide-react';
import { PageHeader } from '../common/PageHeader';
import { GlassCard } from '../common/GlassCard';
import { Avatar } from '../common/Avatar';
import { formatWhatsAppMessage, openWhatsAppDirect } from '../../utils/whatsappGateway';

export const KajianSchedulePage: React.FC = () => {
  const { kajianEvents, showToast } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = ['All', 'Tafsir', 'Fiqh', 'Tematik', 'Akhlaq', 'Remaja'];

  const filteredEvents = kajianEvents.filter((event) => {
    const matchesCat = selectedCategory === 'All' || event.category === selectedCategory;
    const matchesSearch =
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.speaker.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-12 pb-16">
      {/* Header Banner */}
      <PageHeader
        badgeKey="pages.kajian.badge"
        titleKey="pages.kajian.title"
        subtitleKey="pages.kajian.subtitle"
      />

      {/* Filter & Search Bar */}
      <GlassCard className="p-4 sm:p-5" glow="emerald" hoverEffect={false}>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Search Input */}
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Cari judul kajian / Ustadz..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs focus:ring-2 focus:ring-emerald-500 outline-none text-slate-900 dark:text-white font-medium"
            />
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow-md'
                    : 'bg-slate-100/60 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 hover:text-emerald-600'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </GlassCard>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEvents.map((item, idx) => (
          <GlassCard
            key={item.id}
            className="p-6 flex flex-col justify-between space-y-4"
            glow="emerald"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: idx * 0.08 }}
          >
            <div className="space-y-3.5">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-bold text-[10px] rounded-full uppercase tracking-wider border border-emerald-500/20">
                  {item.category}
                </span>
                <span className="text-xs font-mono font-bold text-amber-600 dark:text-amber-400">
                  {item.date} • {item.time} WIB
                </span>
              </div>

              <h3 className="font-bold text-base text-slate-900 dark:text-white hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors leading-snug">
                {item.title}
              </h3>

              <div className="flex items-center gap-3 bg-slate-100/60 dark:bg-slate-800/60 p-3 rounded-2xl border border-slate-200/80 dark:border-slate-700/80">
                <Avatar
                  src={item.speakerAvatar}
                  name={item.speaker}
                  size="md"
                  className="w-12 h-12 text-sm rounded-2xl border-2 border-emerald-500/40 shrink-0 shadow-sm"
                />
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white">{item.speaker}</div>
                  <div className="text-[11px] text-slate-500 font-medium">{item.speakerTitle}</div>
                </div>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed">
                {item.description}
              </p>
            </div>

            <div className="pt-3 border-t border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between text-xs">
              <span className="text-[11px] text-slate-500 font-medium flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-rose-500" /> {item.location}
              </span>
              <button
                onClick={() => {
                  const msg = formatWhatsAppMessage({
                    recipientPhone: '',
                    recipientName: 'Sahabat Jamaah',
                    type: 'BROADCAST_KAJIAN',
                    data: {
                      title: item.title,
                      speaker: item.speaker,
                      date: item.date,
                      time: item.time,
                    }
                  });
                  openWhatsAppDirect('', msg);
                  showToast(`Membuka WhatsApp untuk jadwal kajian "${item.title}"`, 'info');
                }}
                className="px-3.5 py-1.5 bg-emerald-500/10 hover:bg-emerald-600 hover:text-white text-emerald-700 dark:text-emerald-300 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all border border-emerald-500/20"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>Ingatkan WA</span>
              </button>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
};
