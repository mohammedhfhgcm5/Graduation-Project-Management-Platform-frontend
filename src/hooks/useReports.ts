import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  reportsService,
  type CreateReportPayload,
} from '@/api/reports.service';

export function useReports(projectId?: string) {
  const queryClient = useQueryClient();

  const reportsQuery = useQuery({
    queryKey: ['reports', projectId],
    queryFn: () => reportsService.getByProject(projectId as string),
    enabled: Boolean(projectId),
  });

  const createReport = useMutation({
    mutationFn: (payload: CreateReportPayload) =>
      reportsService.create(projectId as string, payload),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ['reports', projectId],
        }),
        queryClient.invalidateQueries({
          queryKey: ['project', projectId],
        }),
      ]);
    },
  });

  return {
    reportsQuery,
    createReport,
  };
}
