import { Button } from '@/components/ui/button';

export function EmptyState({
  title,
  description,
  actionLabel,
  onAction,
}: {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <div className='rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center'>
      <h3 className='text-lg font-semibold text-slate-900'>{title}</h3>
      <p className='mx-auto mt-2 max-w-lg text-sm text-slate-600'>{description}</p>
      {actionLabel && onAction ? (
        <Button onClick={onAction} className='mt-4'>
          {actionLabel}
        </Button>
      ) : null}
    </div>
  );
}
