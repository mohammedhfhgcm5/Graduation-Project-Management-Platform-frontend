import { useI18n } from '@/i18n';

export function LoadingSpinner({ label }: { label?: string }) {
  const { t } = useI18n();

  return (
    <div className='flex items-center gap-3 text-slate-500'>
      <span className='h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-slate-700' />
      <span>{label ?? t('commonLoading')}</span>
    </div>
  );
}
