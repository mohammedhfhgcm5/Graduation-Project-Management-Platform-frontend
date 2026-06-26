import { create } from 'zustand';

import type { AppNotification } from '@/types';

interface NotificationState {
  notifications: AppNotification[];
  unreadCount: number;
  setNotifications: (notifications: AppNotification[]) => void;
  markAsRead: (id: string) => void;
  clearNotifications: () => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: [],
  unreadCount: 0,
  setNotifications: (notifications) =>
    set({
      notifications,
      unreadCount: notifications.filter((notification) => !notification.isRead)
        .length,
    }),
  markAsRead: (id) =>
    set((state) => {
      const notifications = state.notifications.map((notification) =>
        notification.id === id
          ? {
              ...notification,
              isRead: true,
            }
          : notification,
      );

      return {
        notifications,
        unreadCount: notifications.filter((notification) => !notification.isRead)
          .length,
      };
    }),
  clearNotifications: () =>
    set({
      notifications: [],
      unreadCount: 0,
    }),
}));
