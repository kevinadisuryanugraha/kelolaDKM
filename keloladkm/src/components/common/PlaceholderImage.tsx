import React from 'react';
import { cn } from '../../lib/utils';

interface PlaceholderImageProps {
  category: string;
  title: string;
  className?: string;
}

const categoryConfig: Record<string, { gradient: string; icon: string }> = {
  Renovasi: {
    gradient: 'from-emerald-800 via-emerald-700 to-teal-800',
    icon: '🕌',
  },
  Operasional: {
    gradient: 'from-blue-800 via-blue-700 to-indigo-800',
    icon: '🌟',
  },
  'Social/Yatim': {
    gradient: 'from-amber-700 via-amber-600 to-orange-700',
    icon: '🤲',
  },
  Qurban: {
    gradient: 'from-rose-800 via-rose-700 to-red-800',
    icon: '🐑',
  },
  Wakaf: {
    gradient: 'from-violet-800 via-violet-700 to-purple-800',
    icon: '🏛️',
  },
  Dakwah: {
    gradient: 'from-emerald-800 via-teal-700 to-cyan-800',
    icon: '📖',
  },
  Pengumuman: {
    gradient: 'from-indigo-800 via-blue-700 to-slate-800',
    icon: '📢',
  },
  Kegiatan: {
    gradient: 'from-teal-800 via-emerald-700 to-emerald-900',
    icon: '🕌',
  },
  Sosial: {
    gradient: 'from-amber-800 via-orange-700 to-amber-900',
    icon: '🤝',
  },
};

/** 
 * Universal placeholder image — themed gradient with category icon.
 */
export const PlaceholderImage: React.FC<PlaceholderImageProps> = ({ category, title, className }) => {
  const config = categoryConfig[category] || categoryConfig.Dakwah || categoryConfig.Operasional;

  return (
    <div
      className={cn(
        'w-full h-full flex flex-col items-center justify-center p-6 text-center bg-gradient-to-br select-none',
        config.gradient,
        className
      )}
    >
      <span className="text-4xl mb-2.5 opacity-90 drop-shadow">{config.icon}</span>
      <span className="text-white/80 text-[10px] font-bold uppercase tracking-wider mb-1 px-2.5 py-0.5 rounded-full bg-black/20 backdrop-blur-xs">
        {category}
      </span>
      <span className="text-white text-xs font-semibold leading-snug line-clamp-2 max-w-[220px] drop-shadow-xs">
        {title}
      </span>
    </div>
  );
};
