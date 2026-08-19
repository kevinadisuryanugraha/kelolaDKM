import React from 'react';
import { motion } from 'motion/react';
import { cn } from '../../lib/utils';
import { useI18n } from '../../i18n/I18nContext';

interface PageHeaderProps {
  title?: string;
  titleKey?: string;
  subtitle?: string;
  subtitleKey?: string;
  badge?: string;
  badgeKey?: string;
  action?: React.ReactNode;
  centered?: boolean;
  className?: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title = '',
  titleKey,
  subtitle,
  subtitleKey,
  badge,
  badgeKey,
  action,
  centered = false,
  className,
}) => {
  const { t } = useI18n();
  const resolvedTitle = titleKey ? t(titleKey) : title;
  const resolvedSubtitle = subtitleKey ? t(subtitleKey) : subtitle;
  const resolvedBadge = badgeKey ? t(badgeKey) : badge;

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
        {resolvedBadge && (
          <div className={cn('inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-emerald-700 dark:text-emerald-300 border border-slate-200 dark:border-slate-700', centered && 'mx-auto')}>
            {resolvedBadge}
          </div>
        )}

        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 dark:text-white leading-tight break-words">
          {resolvedTitle}
        </h1>

        {resolvedSubtitle && (
          <p className="text-xs sm:text-sm md:text-base text-slate-600 dark:text-slate-300 font-normal leading-relaxed max-w-2xl">
            {resolvedSubtitle}
          </p>
        )}
      </motion.div>

      {action && (
        <div className={cn('mt-4 md:mt-0', !centered && 'md:absolute md:right-0 md:bottom-8 flex items-center gap-2.5 flex-wrap')}>
          {action}
        </div>
      )}
    </div>
  );
};
