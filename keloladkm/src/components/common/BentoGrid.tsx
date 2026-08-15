import React from 'react';
import { motion } from 'motion/react';
import { cn } from '../../lib/utils';

interface BentoGridProps {
  children: React.ReactNode;
  className?: string;
}

export const BentoGrid: React.FC<BentoGridProps> = ({ children, className }) => {
  return (
    <div
      className={cn(
        'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5 auto-rows-[175px]',
        className
      )}
    >
      {children}
    </div>
  );
};

interface BentoItemProps {
  children: React.ReactNode;
  className?: string;
  colSpan?: string;
  rowSpan?: string;
  title?: string;
  subtitle?: string;
  icon?: React.ReactNode;
  badge?: string;
}

export const BentoItem: React.FC<BentoItemProps> = ({
  children,
  className,
  colSpan = 'col-span-1',
  rowSpan = 'row-span-1',
  title,
  subtitle,
  icon,
  badge,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.4 }}
      className={cn(
        'group relative flex flex-col justify-between overflow-hidden rounded-3xl border p-4 sm:p-5 transition-all duration-300',
        'bg-white/90 border-slate-200/90 shadow-sm hover:shadow-md dark:bg-slate-900/90 dark:border-slate-800 dark:shadow-lg',
        'hover:border-emerald-500/40 dark:hover:border-emerald-500/40',
        colSpan,
        rowSpan,
        className
      )}
    >
      {/* Background glow on hover */}
      <div className="absolute -right-20 -bottom-20 w-48 h-48 rounded-full bg-emerald-500/5 dark:bg-emerald-500/10 blur-2xl group-hover:bg-emerald-500/15 transition-all duration-500 pointer-events-none" />

      {/* Item Top Bar (Icon & Badge) */}
      {(icon || badge) && (
        <div className="flex items-center justify-between z-10 shrink-0">
          {icon && (
            <div className="p-2 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 dark:bg-emerald-500/20 border border-emerald-500/20 shrink-0">
              {icon}
            </div>
          )}
          {badge && (
            <span className="text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20 shrink-0">
              {badge}
            </span>
          )}
        </div>
      )}

      {/* Item Header Title & Subtitle */}
      {title && (
        <div className="z-10 mt-1 shrink-0">
          <h3 className="font-bold text-[11px] uppercase tracking-wider text-slate-500 dark:text-slate-400 truncate">{title}</h3>
          {subtitle && <p className="text-[10px] text-slate-400 font-medium truncate">{subtitle}</p>}
        </div>
      )}

      {/* Item Body */}
      <div className="relative z-10 flex-1 flex flex-col justify-end min-w-0 overflow-hidden">
        {children}
      </div>
    </motion.div>
  );
};
