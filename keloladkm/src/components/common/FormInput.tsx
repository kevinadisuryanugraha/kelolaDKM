import React from 'react';
import { cn } from '../../lib/utils';

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  monospace?: boolean;
}

export const FormInput: React.FC<FormInputProps> = ({ label, error, monospace, className, id, ...props }) => {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');
  return (
    <div className="space-y-1.5">
      {label && (
        <label htmlFor={inputId} className="block text-xs font-semibold text-slate-600 dark:text-slate-400">
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={cn(
          'w-full px-4 py-2.5 bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700',
          'rounded-2xl text-xs focus:ring-2 focus:ring-emerald-500 outline-none text-slate-900 dark:text-white',
          'placeholder:text-slate-400 dark:placeholder:text-slate-500',
          monospace && 'font-mono',
          error && 'border-rose-300 dark:border-rose-700 focus:ring-rose-500',
          className
        )}
        {...props}
      />
      {error && <p className="text-[10px] text-rose-500 font-medium">{error}</p>}
    </div>
  );
};

interface FormSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
}

export const FormSelect: React.FC<FormSelectProps> = ({ label, error, className, id, children, ...props }) => {
  const selectId = id || label?.toLowerCase().replace(/\s+/g, '-');
  return (
    <div className="space-y-1.5">
      {label && (
        <label htmlFor={selectId} className="block text-xs font-semibold text-slate-600 dark:text-slate-400">
          {label}
        </label>
      )}
      <select
        id={selectId}
        className={cn(
          'w-full px-4 py-2.5 bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700',
          'rounded-2xl text-xs font-semibold focus:ring-2 focus:ring-emerald-500 outline-none text-slate-900 dark:text-white',
          error && 'border-rose-300 dark:border-rose-700',
          className
        )}
        {...props}
      >
        {children}
      </select>
      {error && <p className="text-[10px] text-rose-500 font-medium">{error}</p>}
    </div>
  );
};

interface FormTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const FormTextarea: React.FC<FormTextareaProps> = ({ label, error, className, id, ...props }) => {
  const textareaId = id || label?.toLowerCase().replace(/\s+/g, '-');
  return (
    <div className="space-y-1.5">
      {label && (
        <label htmlFor={textareaId} className="block text-xs font-semibold text-slate-600 dark:text-slate-400">
          {label}
        </label>
      )}
      <textarea
        id={textareaId}
        className={cn(
          'w-full p-4 bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700',
          'rounded-2xl text-xs focus:ring-2 focus:ring-emerald-500 outline-none text-slate-900 dark:text-white',
          'placeholder:text-slate-400 dark:placeholder:text-slate-500',
          error && 'border-rose-300 dark:border-rose-700',
          className
        )}
        {...props}
      />
      {error && <p className="text-[10px] text-rose-500 font-medium">{error}</p>}
    </div>
  );
};
