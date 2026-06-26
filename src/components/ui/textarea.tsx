import * as React from 'react';

import { cn } from '@/utils/cn';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  state?: 'default' | 'success' | 'error';
  surface?: 'light' | 'dark';
}

const stateRing: Record<NonNullable<TextareaProps['state']>, string> = {
  default: 'focus:border-violet-500 focus:ring-violet-500/20',
  success:
    'border-emerald-500/50 focus:border-emerald-500 focus:ring-emerald-500/15',
  error: 'border-red-500/50 focus:border-red-500 focus:ring-red-500/15',
};

const surfaceClasses: Record<NonNullable<TextareaProps['surface']>, string> = {
  light: [
    'border-slate-300 bg-white text-slate-900',
    'shadow-[inset_0_1px_2px_rgba(15,23,42,0.04)]',
    'placeholder:text-slate-400',
    'hover:border-slate-400 hover:bg-white',
    'focus:bg-white',
    'dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-100',
    'dark:placeholder:text-slate-500 dark:hover:border-white/[0.18] dark:hover:bg-white/[0.06]',
    'dark:focus:bg-violet-500/[0.03]',
  ].join(' '),
  dark: [
    'border-white/10 bg-white/[0.04] text-slate-100',
    'shadow-[inset_0_1px_3px_rgba(0,0,0,0.25)]',
    'placeholder:text-slate-500',
    'hover:border-white/[0.18] hover:bg-white/[0.06]',
    'focus:bg-violet-500/[0.03]',
  ].join(' '),
};

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, state = 'default', surface = 'light', ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn(
        'min-h-[110px] w-full rounded-[10px] border px-4 py-3 text-sm leading-relaxed',
        'resize-y transition-all duration-200',
        'focus:outline-none focus:ring-[3px]',
        surfaceClasses[surface],
        stateRing[state],
        'disabled:pointer-events-none disabled:opacity-40',
        className,
      )}
      {...props}
    />
  ),
);

Textarea.displayName = 'Textarea';
