import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { useNotifications } from '@/hooks/useNotifications';
import { useI18n } from '@/i18n';
import { getApiErrorMessage } from '@/lib/errors';
import { useNotificationStore } from '@/store/zustand/notificationStore';
import { formatDate } from '@/utils/formatDate';

export function NotificationList() {
  const notifications = useNotificationStore((state) => state.notifications);
  const { notificationsQuery, markAsRead, markAllAsRead } = useNotifications();
  const { t } = useI18n();

  const actionError = markAsRead.error ?? markAllAsRead.error;
  const isUpdating = markAsRead.isPending || markAllAsRead.isPending;

  return (
    <section className='space-y-4'>
      <div className='flex flex-wrap items-center justify-between gap-3'>
        <div>
          <h1 className='text-2xl font-bold text-slate-900 dark:text-slate-100'>{t('notificationsTitle')}</h1>
          <p className='text-sm text-slate-500 dark:text-slate-400'>{t('notificationsSubtitle')}</p>
        </div>
        {notifications.length ? (
          <Button
            variant='outline'
            onClick={() => markAllAsRead.mutate()}
            disabled={isUpdating}
          >
            {isUpdating ? t('notificationsMarking') : t('commonMarkAllRead')}
          </Button>
        ) : null}
      </div>

      {notificationsQuery.isLoading ? <LoadingSpinner /> : null}

      {actionError ? (
        <p className='text-sm text-red-600'>
          {getApiErrorMessage(actionError, t('notificationsSingleError'))}
        </p>
      ) : null}

      {!notifications.length && !notificationsQuery.isLoading ? (
        <p className='text-sm text-slate-500'>{t('notificationsEmpty')}</p>
      ) : null}

      <ul className='space-y-2'>
        {notifications.map((notification) => (
          <li
            key={notification.id}
            className='flex items-start justify-between gap-3 rounded-lg border border-slate-200 bg-white p-4'
          >
            <div>
              <p className='text-sm text-slate-800'>{notification.message}</p>
              <p className='mt-1 text-xs text-slate-400'>
                {formatDate(notification.createdAt)}
              </p>
            </div>
            {!notification.isRead ? (
              <Button
                size='sm'
                variant='outline'
                onClick={() => markAsRead.mutate(notification.id)}
                disabled={markAsRead.isPending}
              >
                {markAsRead.isPending ? t('notificationsMarking') : t('commonMarkRead')}
              </Button>
            ) : null}
          </li>
        ))}
      </ul>
    </section>
  );
}
