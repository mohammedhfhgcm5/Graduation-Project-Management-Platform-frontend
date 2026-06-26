import type { ReactNode } from 'react';
import { cn } from '@/utils/cn';

/* ─── Table wrapper (adds rounded border + clip) ─────────── */
export function TableWrapper({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={cn(
        'overflow-hidden rounded-2xl',
        'border border-white/[0.07] bg-white/[0.03]',
        className,
      )}
    >
      {children}
    </div>
  );
}

/* ─── Table ─────────────────────────────────────────────── */
export function Table({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <table className={cn('w-full border-collapse text-start text-sm', className)}>
      {children}
    </table>
  );
}

/* ─── TableHeader ───────────────────────────────────────── */
export function TableHeader({ children }: { children: ReactNode }) {
  return (
    <thead className="border-b border-white/[0.07] bg-white/[0.04]">
      {children}
    </thead>
  );
}

/* ─── TableBody ─────────────────────────────────────────── */
export function TableBody({ children }: { children: ReactNode }) {
  return <tbody className="divide-y divide-white/[0.04]">{children}</tbody>;
}

/* ─── TableRow ──────────────────────────────────────────── */
export function TableRow({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <tr
      className={cn(
        'transition-colors duration-150',
        'hover:bg-white/[0.04] [&:hover_td]:text-slate-200',
        className,
      )}
    >
      {children}
    </tr>
  );
}

/* ─── TableHead ─────────────────────────────────────────── */
export function TableHead({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <th
      className={cn(
        'px-4 py-3 text-[11px] font-bold uppercase tracking-widest text-slate-500',
        className,
      )}
    >
      {children}
    </th>
  );
}

/* ─── TableCell ─────────────────────────────────────────── */
export function TableCell({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <td
      className={cn(
        'px-4 py-3.5 align-middle text-slate-400 transition-colors duration-150',
        className,
      )}
    >
      {children}
    </td>
  );
}
