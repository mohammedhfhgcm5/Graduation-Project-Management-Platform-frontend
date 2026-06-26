import { api } from '@/api/api';
import type { AppNotification } from '@/types';

export const notificationsService = {
  async getMine() {
    const response = await api.get<AppNotification[]>('/notifications/me');
    return response.data;
  },

  async markAsRead(id: string) {
    await api.patch(`/notifications/${id}/read`);
  },

  async markAllAsRead() {
    await api.patch('/notifications/read-all');
  },
};
