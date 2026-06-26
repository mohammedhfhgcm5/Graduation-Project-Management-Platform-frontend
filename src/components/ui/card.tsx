import type { ReactNode } from 'react';
import { cn } from '@/utils/cn';

/* ─── Card ─────────────────────────────────────────────── */
export function Card({
  className,
  children,
  /** Glows with a soft color on hover. Pass a Tailwind color class e.g. "violet" */
  glow,
}: {
  className?: string;
  children: ReactNode;
  glow?: 'violet' | 'emerald' | 'amber' | 'red' | 'sky';
}) {
  const glowColor: Record<string, string> = {
    violet:  'before:from-violet-600/20',
    emerald: 'before:from-emerald-500/20',
    amber:   'before:from-amber-400/20',
    red:     'before:from-red-500/20',
    sky:     'before:from-sky-500/20',
  };

  return (
    <div
      className={cn(
        // surface
        'relative overflow-hidden rounded-2xl',
        'bg-white/[0.03] border border-white/[0.07]',
        'p-5',
        // top-edge shimmer line
        'before:pointer-events-none before:absolute before:inset-x-0 before:top-0 before:h-px',
        'before:bg-gradient-to-r before:from-transparent before:via-white/15 before:to-transparent',
        // glow on hover (bottom-left radial using pseudo + opacity)
        glow && [
          'after:pointer-events-none after:absolute after:-right-8 after:-top-8',
          'after:h-32 after:w-32 after:rounded-full after:blur-3xl',
          'after:bg-gradient-radial after:opacity-0',
          'after:transition-opacity after:duration-500',
          'hover:after:opacity-100',
          glow && glowColor[glow],
        ],
        // lift on hover
        'transition-all duration-300 ease-out',
        'hover:-translate-y-1 hover:border-slate-300/80 dark:hover:border-white/[0.12]',
        'hover:shadow-[0_18px_42px_rgba(15,23,42,0.14)] dark:hover:shadow-[0_16px_48px_rgba(0,0,0,0.45)]',
        className,
      )}
    >
      {children}
    </div>
  );
}

/* ─── CardHeader ────────────────────────────────────────── */
export function CardHeader({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return <div className={cn('mb-4', className)}>{children}</div>;
}

/* ─── CardIcon ──────────────────────────────────────────── */
export function CardIcon({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={cn(
        'mb-3.5 flex h-10 w-10 items-center justify-center rounded-xl text-lg',
        'bg-white/8 border border-white/8',
        className,
      )}
    >
      {children}
    </div>
  );
}

/* ─── CardTitle ─────────────────────────────────────────── */
export function CardTitle({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <h3
      className={cn(
        'text-base font-bold tracking-tight text-slate-100',
        className,
      )}
    >
      {children}
    </h3>
  );
}

/* ─── CardContent ───────────────────────────────────────── */
export function CardContent({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return <div className={cn('space-y-3', className)}>{children}</div>;
}

/* ─── CardStat  (big metric number) ─────────────────────── */
export function CardStat({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <p
      className={cn(
        'bg-gradient-to-br from-white to-slate-400 bg-clip-text text-3xl font-extrabold text-transparent',
        className,
      )}
    >
      {children}
    </p>
  );
}
