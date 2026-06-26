import { api } from '@/api/api';
import type { ProgressReport } from '@/types';

export interface CreateReportPayload {
  content: string;
  weekNumber: number;
}

export const reportsService = {
  async getByProject(projectId: string) {
    const response = await api.get<ProgressReport[]>(`/reports/${projectId}`);
    return response.data;
  },

  async create(projectId: string, payload: CreateReportPayload) {
    const response = await api.post<ProgressReport>(
      `/reports/${projectId}`,
      payload,
    );
    return response.data;
  },
};
