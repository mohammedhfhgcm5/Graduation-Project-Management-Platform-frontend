import { api } from '@/api/api';
import type { Meeting } from '@/types';

export interface CreateMeetingPayload {
  scheduledAt: string;
  location?: string;
  notes?: string;
}

export const meetingsService = {
  async getByProject(projectId: string) {
    const response = await api.get<Meeting[]>(`/meetings/${projectId}`);
    return response.data;
  },

  async create(projectId: string, payload: CreateMeetingPayload) {
    const response = await api.post<Meeting>(`/meetings/${projectId}`, payload);
    return response.data;
  },
};
