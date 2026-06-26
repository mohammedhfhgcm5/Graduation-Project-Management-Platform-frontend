import * as React from 'react';
import { cn } from '@/utils/cn';

type ButtonVariant = 'default' | 'secondary' | 'outline' | 'ghost' | 'danger';
type ButtonSize = 'default' | 'sm' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

const variantClasses: Record<ButtonVariant, string> = {
  default: [
    'bg-gradient-to-br from-violet-600 to-indigo-600 text-white font-bold',
    'shadow-[0_0_0_1px_rgba(109,40,217,0.5),0_4px_14px_rgba(67,56,202,0.4)]',
    'hover:shadow-[0_0_0_1px_rgba(109,40,217,0.7),0_8px_24px_rgba(67,56,202,0.5)]',
    'hover:brightness-110',
  ].join(' '),

  secondary: [
    'bg-slate-800 text-white font-bold border border-slate-700',
    'shadow-[0_1px_3px_rgba(0,0,0,0.25)]',
    'hover:bg-slate-700 hover:border-slate-600',
  ].join(' '),

  outline: [
    'bg-transparent text-violet-700 font-bold border-2 border-violet-500',
    'hover:bg-violet-50 hover:border-violet-600 hover:text-violet-800',
  ].join(' '),

  ghost: [
    'bg-transparent text-slate-700 font-bold border border-slate-300',
    'hover:text-slate-900 hover:bg-slate-100 hover:border-slate-400',
  ].join(' '),

  danger: [
    'bg-gradient-to-br from-red-600 to-red-700 text-white font-bold',
    'shadow-[0_0_0_1px_rgba(185,28,28,0.5),0_4px_14px_rgba(185,28,28,0.35)]',
    'hover:shadow-[0_0_0_1px_rgba(185,28,28,0.7),0_8px_24px_rgba(185,28,28,0.45)]',
    'hover:brightness-110',
  ].join(' '),
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'h-8 px-3.5 text-xs rounded-lg',
  default: 'h-10 px-5 text-[13.5px] rounded-[10px]',
  lg: 'h-12 px-7 text-[15px] rounded-xl',
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        // base
        'relative inline-flex items-center justify-center gap-2 font-semibold tracking-[0.01em]',
        'overflow-hidden transition-all duration-200',
        // spring-like hover lift
        'hover:-translate-y-0.5 hover:scale-[1.02]',
        'active:translate-y-0 active:scale-[0.98]',
        // accessibility
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent',
        'disabled:pointer-events-none disabled:opacity-40',
        variantClasses[variant],
        sizeClasses[size],
        className,
      )}
      {...props}
    >
      {/* shimmer overlay on hover */}
      <span
        className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-150 hover:opacity-100"
        style={{ background: 'rgba(255,255,255,0.07)' }}
      />
      {props.children}
    </button>
  ),
);

Button.displayName = 'Button';