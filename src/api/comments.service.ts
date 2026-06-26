import { api } from '@/api/api';
import type { Comment } from '@/types';

export interface CreateCommentPayload {
  content: string;
}

export const commentsService = {
  async getByProject(projectId: string) {
    const response = await api.get<Comment[]>(`/comments/${projectId}`);
    return response.data;
  },

  async create(projectId: string, payload: CreateCommentPayload) {
    const response = await api.post<Comment>(`/comments/${projectId}`, payload);
    return response.data;
  },
};
