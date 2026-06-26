import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { filesService } from '@/api/files.service';
import type { FileType } from '@/types';

export function useFiles(projectId?: string) {
  const queryClient = useQueryClient();

  const filesQuery = useQuery({
    queryKey: ['files', projectId],
    queryFn: () => filesService.getByProject(projectId as string),
    enabled: Boolean(projectId),
  });

  const uploadFiles = useMutation({
    mutationFn: async ({
      files,
      type,
    }: {
      files: File[];
      type?: FileType;
    }) =>
      Promise.all(
        files.map((file) =>
          filesService.uploadSingle({
            projectId: projectId as string,
            file,
            type,
          }),
        ),
      ),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ['files', projectId],
        }),
        queryClient.invalidateQueries({
          queryKey: ['project', projectId],
        }),
      ]);
    },
  });

  const deleteFile = useMutation({
    mutationFn: (fileId: string) => filesService.delete(fileId),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ['files', projectId],
        }),
        queryClient.invalidateQueries({
          queryKey: ['project', projectId],
        }),
      ]);
    },
  });

  return {
    filesQuery,
    uploadFiles,
    deleteFile,
  };
}
