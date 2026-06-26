import * as React from 'react';

import { useI18n } from '@/i18n';
import { cn } from '@/utils/cn';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  state?: 'default' | 'success' | 'error';
  surface?: 'light' | 'dark';
}

const stateRing: Record<NonNullable<InputProps['state']>, string> = {
  default: 'focus:border-violet-500 focus:ring-violet-500/20',
  success:
    'border-emerald-500/50 focus:border-emerald-500 focus:ring-emerald-500/15',
  error: 'border-red-500/50 focus:border-red-500 focus:ring-red-500/15',
};

const surfaceClasses: Record<NonNullable<InputProps['surface']>, string> = {
  light: [
    'border-slate-300 bg-white text-slate-900',
    'shadow-[inset_0_1px_2px_rgba(15,23,42,0.04)]',
    'placeholder:text-slate-400',
    'hover:border-slate-400 hover:bg-white',
    'focus:bg-white',
    'dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-100',
    'dark:placeholder:text-slate-500 dark:hover:border-white/[0.18] dark:hover:bg-white/[0.06]',
    'dark:focus:bg-violet-500/[0.04]',
  ].join(' '),
  dark: [
    'border-white/10 bg-white/[0.04] text-slate-100',
    'shadow-[inset_0_1px_3px_rgba(0,0,0,0.25)]',
    'placeholder:text-slate-500',
    'hover:border-white/[0.18] hover:bg-white/[0.06]',
    'focus:bg-violet-500/[0.04]',
  ].join(' '),
};

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type = 'text',
      leftIcon,
      rightIcon,
      state = 'default',
      surface = 'light',
      ...props
    },
    ref,
  ) => {
    const { isRtl } = useI18n();
    const startPadding = leftIcon ? (isRtl ? 'pr-10 pl-4' : 'pl-10 pr-4') : 'px-4';
    const endPadding = rightIcon ? (isRtl ? 'pl-10' : 'pr-10') : '';
    const iconColorClass =
      surface === 'dark'
        ? 'text-slate-500 group-focus-within:text-violet-300'
        : 'text-slate-400 group-focus-within:text-violet-500';

    return (
      <div className='group relative w-full'>
        {leftIcon ? (
          <span
            className={cn(
              'pointer-events-none absolute top-1/2 -translate-y-1/2 transition-colors duration-200',
              isRtl ? 'right-3.5' : 'left-3.5',
              iconColorClass,
            )}
          >
            {leftIcon}
          </span>
        ) : null}

        <input
          ref={ref}
          type={type}
          className={cn(
            'h-11 w-full rounded-[10px] border text-sm transition-all duration-200',
            startPadding,
            endPadding,
            'focus:outline-none focus:ring-[3px]',
            surfaceClasses[surface],
            stateRing[state],
            'disabled:pointer-events-none disabled:opacity-40',
            className,
          )}
          {...props}
        />

        {rightIcon ? (
          <span
            className={cn(
              'pointer-events-none absolute top-1/2 -translate-y-1/2 transition-colors duration-200',
              isRtl ? 'left-3.5' : 'right-3.5',
              iconColorClass,
            )}
          >
            {rightIcon}
          </span>
        ) : null}
      </div>
    );
  },
);

Input.displayName = 'Input';
