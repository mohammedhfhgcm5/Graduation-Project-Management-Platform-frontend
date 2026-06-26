import { Bell } from 'lucide-react';

import { useNotifications } from '@/hooks/useNotifications';
import { useNotificationStore } from '@/store/zustand/notificationStore';

export function NotificationBell() {
  const unreadCount = useNotificationStore((state) => state.unreadCount);
  useNotifications();

  return (
    <div className='relative inline-flex items-center'>
      <Bell className='h-5 w-5 text-slate-700 dark:text-slate-200' />
      {unreadCount > 0 ? (
        <span className='absolute -right-2 -top-2 min-w-5 rounded-full bg-red-600 px-1 text-center text-xs font-semibold text-white'>
          {unreadCount > 99 ? '99+' : unreadCount}
        </span>
      ) : null}
    </div>
  );
}
