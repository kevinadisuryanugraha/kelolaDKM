import React from 'react';
import { motion } from 'motion/react';
import { cn } from '../../lib/utils';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  badge?: string;
  action?: React.ReactNode;
  centered?: boolean;
  className?: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  badge,
  action,
  centered = false,
  className,
}) => {
  return (
    <div
      className={cn(
        'relative py-6 md:py-8 mb-6 border-b border-slate-200/80 dark:border-slate-800/80',
        centered && 'text-center flex flex-col items-center',
        className
      )}
    >
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="space-y-2 max-w-3xl"
      >
        {badge && (
          <div className={cn('inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-emerald-700 dark:text-emerald-300 border border-slate-200 dark:border-slate-700', centered && 'mx-auto')}>
            {badge}
          </div>
        )}

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-slate-900 dark:text-white">
          {title}
        </h1>

        {subtitle && (
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 font-normal leading-relaxed max-w-2xl">
            {subtitle}
          </p>
        )}
      </motion.div>

      {action && (
        <div className={cn('mt-6 md:mt-0', !centered && 'md:absolute md:right-0 md:bottom-8 flex items-center gap-3')}>
          {action}
        </div>
      )}
    </div>
  );
};
