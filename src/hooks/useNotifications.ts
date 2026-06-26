import { useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { notificationsService } from '@/api/notifications.service';
import { useNotificationStore } from '@/store/zustand/notificationStore';

export function useNotifications() {
  const queryClient = useQueryClient();
  const setNotifications = useNotificationStore(
    (state) => state.setNotifications,
  );

  const notificationsQuery = useQuery({
    queryKey: ['notifications', 'me'],
    queryFn: notificationsService.getMine,
  });

  useEffect(() => {
    if (notificationsQuery.data) {
      setNotifications(notificationsQuery.data);
    }
  }, [notificationsQuery.data, setNotifications]);

  const markAsRead = useMutation({
    mutationFn: notificationsService.markAsRead,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['notifications', 'me'],
      });
    },
  });

  const markAllAsRead = useMutation({
    mutationFn: notificationsService.markAllAsRead,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['notifications', 'me'],
      });
    },
  });

  return {
    notificationsQuery,
    markAsRead,
    markAllAsRead,
  };
}
