import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  commentsService,
  type CreateCommentPayload,
} from '@/api/comments.service';

export function useComments(projectId?: string) {
  const queryClient = useQueryClient();

  const commentsQuery = useQuery({
    queryKey: ['comments', projectId],
    queryFn: () => commentsService.getByProject(projectId as string),
    enabled: Boolean(projectId),
  });

  const createComment = useMutation({
    mutationFn: (payload: CreateCommentPayload) =>
      commentsService.create(projectId as string, payload),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ['comments', projectId],
        }),
        queryClient.invalidateQueries({
          queryKey: ['project', projectId],
        }),
      ]);
    },
  });

  return {
    commentsQuery,
    createComment,
  };
}
