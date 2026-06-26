import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  meetingsService,
  type CreateMeetingPayload,
} from '@/api/meetings.service';

export function useMeetings(projectId?: string) {
  const queryClient = useQueryClient();

  const meetingsQuery = useQuery({
    queryKey: ['meetings', projectId],
    queryFn: () => meetingsService.getByProject(projectId as string),
    enabled: Boolean(projectId),
  });

  const createMeeting = useMutation({
    mutationFn: (payload: CreateMeetingPayload) =>
      meetingsService.create(projectId as string, payload),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ['meetings', projectId],
        }),
        queryClient.invalidateQueries({
          queryKey: ['project', projectId],
        }),
      ]);
    },
  });

  return {
    meetingsQuery,
    createMeeting,
  };
}
