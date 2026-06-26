import type { ReactNode } from 'react';
import { cn } from '@/utils/cn';

type BadgeVariant = 'default' | 'success' | 'warning' | 'danger';

const variantClasses: Record<BadgeVariant, string> = {
  default:
    'border border-slate-200 bg-slate-100 text-slate-700 [--dot:#6366f1] dark:border-white/10 dark:bg-white/5 dark:text-slate-300',
  success:
    'border border-emerald-200 bg-emerald-50 text-emerald-700 [--dot:#10b981] dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-300',
  warning:
    'border border-amber-200 bg-amber-50 text-amber-700 [--dot:#f59e0b] dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-300',
  danger:
    'border border-red-200 bg-red-50 text-red-700 [--dot:#ef4444] dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300',
};

export function Badge({
  children,
  variant = 'default',
  className,
}: {
  children: ReactNode;
  variant?: BadgeVariant;
  className?: string;
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-semibold tracking-wide transition-all duration-200 hover:-translate-y-px',
        variantClasses[variant],
        className,
      )}
    >
      {/* animated dot */}
      <span
        className="inline-block h-1.5 w-1.5 rounded-full animate-pulse"
        style={{ backgroundColor: 'var(--dot)' }}
      />
      {children}
    </span>
  );
}
