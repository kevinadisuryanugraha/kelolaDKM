import React from 'react';
import { motion, HTMLMotionProps } from 'motion/react';
import { cn } from '../../lib/utils';

interface GlassCardProps extends HTMLMotionProps<'div'> {
  children: React.ReactNode;
  className?: string;
  glow?: 'emerald' | 'gold' | 'slate' | 'none';
  hoverEffect?: boolean;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className,
  glow = 'emerald',
  hoverEffect = true,
  ...props
}) => {
  const glowStyles = {
    emerald: 'hover:border-emerald-500/30 dark:hover:border-emerald-500/40 hover:shadow-emerald-500/10',
    gold: 'hover:border-amber-500/30 dark:hover:border-amber-500/40 hover:shadow-amber-500/10',
    slate: 'hover:border-slate-400/30 dark:hover:border-slate-400/40 hover:shadow-slate-500/10',
    none: '',
  };

  return (
    <motion.div
      whileHover={hoverEffect ? { y: -3, transition: { duration: 0.2 } } : undefined}
      className={cn(
        'relative overflow-hidden rounded-2xl border backdrop-blur-md transition-all duration-300',
        // Light mode
        'bg-white/80 border-slate-200/80 shadow-sm text-slate-900',
        // Dark mode
        'dark:bg-slate-900/70 dark:border-slate-800/80 dark:shadow-xl dark:text-slate-100',
        glowStyles[glow],
        className
      )}
      {...props}
    >
      {/* Decorative subtle border top highlight */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent pointer-events-none" />
      {children}
    </motion.div>
  );
};
