import React from 'react';
import { cn } from '../../lib/utils';

interface AvatarProps {
  src?: string;
  name: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  shape?: 'circle' | 'rounded';
  className?: string;
}

const gradients = [
  'from-emerald-600 to-teal-700',
  'from-blue-600 to-indigo-700',
  'from-amber-500 to-orange-600',
  'from-teal-600 to-emerald-700',
  'from-emerald-700 to-green-800',
];

function hashColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return gradients[Math.abs(hash) % gradients.length];
}

const sizes = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-14 h-14 text-base font-bold',
  xl: 'w-20 h-20 text-xl font-bold',
  '2xl': 'w-24 h-24 text-2xl font-bold',
};

export const Avatar: React.FC<AvatarProps> = ({
  src,
  name,
  size = 'md',
  shape = 'rounded',
  className,
}) => {
  const initials = name
    .replace(/(H\.|Drs\.|Ir\.|Dr\.|KH\.|Ustadz|Lc\.|MA\.|M\.Pd\.I|M\.Si\.|S\.E\.|S\.Q\.|S\.Pd\.I\.|Ak\.|CA)/g, '')
    .trim()
    .split(' ')
    .filter((w) => w.length > 0)
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase() || name.charAt(0).toUpperCase();

  const radiusClass = shape === 'circle' ? 'rounded-full' : 'rounded-2xl';

  if (src && src.trim() !== '') {
    return (
      <img
        src={src}
        alt={name}
        className={cn(
          sizes[size],
          radiusClass,
          'object-cover border border-slate-200 dark:border-slate-700 shrink-0',
          className
        )}
      />
    );
  }

  return (
    <div
      className={cn(
        sizes[size],
        radiusClass,
        'bg-gradient-to-br flex items-center justify-center text-white shrink-0 shadow-md border border-white/20 select-none',
        hashColor(name),
        className
      )}
      title={name}
    >
      {initials}
    </div>
  );
};
