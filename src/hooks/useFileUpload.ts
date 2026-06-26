import { useMutation } from '@tanstack/react-query';

import { filesService } from '@/api/files.service';
import type { FileType } from '@/types';

export function useFileUpload() {
  const uploadSingle = useMutation({
    mutationFn: ({
      projectId,
      file,
      type,
    }: {
      projectId: string;
      file: File;
      type?: FileType;
    }) => filesService.uploadSingle({ projectId, file, type }),
  });

  const uploadMulti = useMutation({
    mutationFn: async ({
      projectId,
      files,
      type,
    }: {
      projectId: string;
      files: File[];
      type?: FileType;
    }) =>
      Promise.all(
        files.map((file) =>
          filesService.uploadSingle({
            projectId,
            file,
            type,
          }),
        ),
      ),
  });

  return {
    uploadSingle,
    uploadMulti,
  };
}
