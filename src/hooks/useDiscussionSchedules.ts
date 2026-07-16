import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  discussionSchedulesService,
  type CreateDiscussionSchedulePayload,
  type DiscussionSchedulesQuery,
  type UpdateDiscussionSchedulePayload,
} from '@/api/discussionSchedules.service';

export function useDiscussionSchedules(query: DiscussionSchedulesQuery = {}) {
  const queryClient = useQueryClient();

  const schedulesQuery = useQuery({
    queryKey: [
      'discussion-schedules',
      query.page,
      query.limit,
      query.academicYear,
      query.semester,
      query.date,
    ],
    queryFn: () => discussionSchedulesService.getSchedules(query),
  });

  const createSchedule = useMutation({
    mutationFn: (payload: CreateDiscussionSchedulePayload) =>
      discussionSchedulesService.createSchedule(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['discussion-schedules'],
      });
    },
  });

  const updateSchedule = useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateDiscussionSchedulePayload;
    }) => discussionSchedulesService.updateSchedule(id, payload),
    onSuccess: async (_, variables) => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ['discussion-schedules'],
        }),
        queryClient.invalidateQueries({
          queryKey: ['discussion-schedule', variables.id],
        }),
      ]);
    },
  });

  const deleteSchedule = useMutation({
    mutationFn: (id: string) => discussionSchedulesService.deleteSchedule(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['discussion-schedules'],
      });
    },
  });

  const downloadPdf = useMutation({
    mutationFn: (id: string) => discussionSchedulesService.downloadPdf(id),
  });

  return {
    schedulesQuery,
    createSchedule,
    updateSchedule,
    deleteSchedule,
    downloadPdf,
  };
}
