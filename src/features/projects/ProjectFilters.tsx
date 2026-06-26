import type { ProjectStatus } from '@/types';
import { setSearchFilter, setStatusFilter } from '@/store/redux/projectsSlice';
import { useAppDispatch, useAppSelector } from '@/store/redux/hooks';
import { getProjectStatusLabel, useI18n } from '@/i18n';

const statuses: ProjectStatus[] = [
  'PENDING_APPROVAL',
  'APPROVED',
  'IN_PROGRESS',
  'UNDER_REVIEW',
  'COMPLETED',
  'REJECTED',
];

export function ProjectFilters() {
  const dispatch = useAppDispatch();
  const filters = useAppSelector((state) => state.projects.filters);
  const { t } = useI18n();

  return (
    <div className='flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 md:flex-row md:items-center dark:border-white/10 dark:bg-[#161320]'>
      <input
        className='h-10 rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-900 placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-100 dark:placeholder:text-slate-500 md:flex-1'
        placeholder={t('projectsSearchPlaceholder')}
        value={filters.search}
        onChange={(event) => dispatch(setSearchFilter(event.target.value))}
      />

      <select
        className='h-10 rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-100'
        value={filters.status}
        onChange={(event) =>
          dispatch(setStatusFilter(event.target.value as ProjectStatus | 'ALL'))
        }
      >
        <option value='ALL'>{t('projectsAllStatuses')}</option>
        {statuses.map((status) => (
          <option key={status} value={status}>
            {getProjectStatusLabel(status, t)}
          </option>
        ))}
      </select>
    </div>
  );
}
