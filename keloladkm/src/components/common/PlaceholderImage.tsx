import React from 'react';
import { cn } from '../../lib/utils';

interface PlaceholderImageProps {
  category: 'Renovasi' | 'Operasional' | 'Social/Yatim' | 'Qurban' | 'Wakaf';
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
};

/** 
 * Campaign placeholder image — themed gradient with category icon.
 * Ganti dengan foto asli di data/mockData.ts (field imageUrl).
 */
export const PlaceholderImage: React.FC<PlaceholderImageProps> = ({ category, title, className }) => {
  const config = categoryConfig[category] || categoryConfig.Operasional;

  return (
    <div
      className={cn(
        'w-full h-full flex flex-col items-center justify-center p-6 text-center bg-gradient-to-br',
        config.gradient,
        className
      )}
    >
      <span className="text-4xl mb-3 opacity-80">{config.icon}</span>
      <span className="text-white/80 text-[10px] font-semibold uppercase tracking-wider mb-1">
        {category}
      </span>
      <span className="text-white text-xs font-medium leading-tight line-clamp-3 max-w-[200px]">
        {title}
      </span>
    </div>
  );
};
