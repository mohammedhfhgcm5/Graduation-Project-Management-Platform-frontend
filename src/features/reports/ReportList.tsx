import type { ProgressReport } from '@/types';
import { formatDate } from '@/utils/formatDate';
import { useI18n } from '@/i18n';

export function ReportList({ reports }: { reports: ProgressReport[] }) {
  const { t } = useI18n();

  if (!reports.length) {
    return <p className='text-sm text-slate-500 dark:text-slate-400'>{t('projectNoReports')}</p>;
  }

  return (
    <ul className='space-y-2'>
      {reports.map((report) => (
        <li
          key={report.id}
          className='rounded-2xl border border-slate-200/80 bg-slate-50/80 p-4 shadow-sm dark:border-white/10 dark:bg-white/[0.03]'
        >
          <div className='flex flex-wrap items-center justify-between gap-2'>
            <p className='font-medium text-slate-900 dark:text-slate-100'>
              {t('reportWeekLabel', { weekNumber: report.weekNumber })}
            </p>
            <p className='text-xs text-slate-400 dark:text-slate-500'>
              {formatDate(report.createdAt)}
            </p>
          </div>
          {report.author?.name ? (
            <p className='mt-1 text-sm text-slate-500 dark:text-slate-400'>
              {t('projectAuthor')}: {report.author.name}
            </p>
          ) : null}
          <p className='mt-2 text-sm leading-6 text-slate-700 dark:text-slate-300'>
            {report.content}
          </p>
        </li>
      ))}
    </ul>
  );
}
