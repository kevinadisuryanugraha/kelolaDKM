import React from 'react';
import { cn } from '../../lib/utils';

interface AvatarProps {
  src?: string;
  name: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const gradients = [
  'from-emerald-500 to-teal-600',
  'from-blue-500 to-indigo-600',
  'from-amber-500 to-orange-600',
  'from-rose-500 to-pink-600',
  'from-violet-500 to-purple-600',
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
  lg: 'w-14 h-14 text-lg',
};

export const Avatar: React.FC<AvatarProps> = ({ src, name, size = 'md', className }) => {
  const initials = name
    .split(' ')
    .filter(w => w.length > 1 && w[0] !== w[0].toLowerCase())
    .map(w => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase() || name[0].toUpperCase();

  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={cn(sizes[size], 'rounded-full object-cover border border-slate-200 dark:border-slate-700 shrink-0', className)}
      />
    );
  }

  return (
    <div
      className={cn(
        sizes[size],
        'rounded-full bg-gradient-to-br flex items-center justify-center font-bold text-white shrink-0 shadow-sm',
        hashColor(name),
        className
      )}
      title={name}
    >
      {initials}
    </div>
  );
};
