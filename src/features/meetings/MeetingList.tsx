import type { Meeting } from '@/types';
import { formatDate } from '@/utils/formatDate';
import { useI18n } from '@/i18n';

export function MeetingList({ meetings }: { meetings: Meeting[] }) {
  const { t } = useI18n();

  if (!meetings.length) {
    return (
      <p className='text-sm text-slate-500 dark:text-slate-400'>{t('projectNoMeetings')}</p>
    );
  }

  return (
    <ul className='space-y-2'>
      {meetings.map((meeting) => (
        <li
          key={meeting.id}
          className='rounded-2xl border border-slate-200/80 bg-slate-50/80 p-4 shadow-sm dark:border-white/10 dark:bg-white/[0.03]'
        >
          <p className='font-medium text-slate-900 dark:text-slate-100'>
            {formatDate(meeting.scheduledAt)}
          </p>
          {meeting.location ? (
            <p className='text-sm text-slate-500 dark:text-slate-400'>
              {t('projectLocation')}: {meeting.location}
            </p>
          ) : null}
          {meeting.scheduledBy?.name ? (
            <p className='text-sm text-slate-500 dark:text-slate-400'>
              {t('projectScheduledBy')}: {meeting.scheduledBy.name}
            </p>
          ) : null}
          {meeting.notes ? (
            <p className='mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300'>
              {meeting.notes}
            </p>
          ) : null}
        </li>
      ))}
    </ul>
  );
}
