import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { useFiles } from '@/hooks/useFiles';
import { getFileTypeLabel, useI18n } from '@/i18n';
import { getApiErrorMessage } from '@/lib/errors';
import type { FileType } from '@/types';

const fileTypes: FileType[] = [
  'PROPOSAL',
  'PROGRESS_REPORT',
  'FINAL_REPORT',
  'PRESENTATION',
  'OTHER',
];

export function FileUpload({
  projectId,
  allowMultiple = false,
  defaultType = 'OTHER',
}: {
  projectId: string;
  allowMultiple?: boolean;
  defaultType?: FileType;
}) {
  const { uploadFiles } = useFiles(projectId);
  const { t } = useI18n();
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [selectedType, setSelectedType] = useState<FileType>(defaultType);
  const [error, setError] = useState('');

  const handleUpload = async () => {
    if (!selectedFiles.length) {
      return;
    }

    setError('');

    try {
      await uploadFiles.mutateAsync({
        files: allowMultiple ? selectedFiles : [selectedFiles[0]],
        type: selectedType,
      });
      setSelectedFiles([]);
    } catch (uploadError) {
      setError(getApiErrorMessage(uploadError, t('projectUploadError')));
    }
  };

  return (
    <div className='rounded-2xl border border-slate-200/80 bg-slate-50/80 p-4 dark:border-white/10 dark:bg-white/[0.03]'>
      <div className='grid gap-3 md:grid-cols-[1fr_200px_auto] md:items-center'>
        <input
          className='block w-full rounded-xl border border-dashed border-slate-300 bg-white px-4 py-3 text-sm text-slate-600 shadow-[inset_0_1px_2px_rgba(15,23,42,0.04)] transition-colors file:mr-4 file:rounded-full file:border-0 file:bg-gradient-to-r file:from-violet-600 file:to-indigo-600 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:border-violet-300 hover:file:opacity-95 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-300 dark:hover:border-white/[0.18]'
          type='file'
          multiple={allowMultiple}
          onChange={(event) =>
            setSelectedFiles(Array.from(event.target.files ?? []))
          }
        />
        <select
          className='h-11 rounded-xl border border-slate-300 bg-white px-4 text-sm text-slate-800 shadow-[inset_0_1px_2px_rgba(15,23,42,0.04)] transition-all duration-200 hover:border-slate-400 focus:border-violet-500 focus:outline-none focus:ring-[3px] focus:ring-violet-500/20 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-100 dark:hover:border-white/[0.18] dark:focus:bg-violet-500/[0.04]'
          value={selectedType}
          onChange={(event) => setSelectedType(event.target.value as FileType)}
        >
          {fileTypes.map((type) => (
            <option key={type} value={type}>
              {getFileTypeLabel(type, t)}
            </option>
          ))}
        </select>
        <Button
          onClick={handleUpload}
          disabled={!selectedFiles.length || uploadFiles.isPending}
        >
          {uploadFiles.isPending ? t('projectUploading') : t('projectUpload')}
        </Button>
      </div>

      {selectedFiles.length ? (
        <p className='mt-3 text-sm text-slate-500 dark:text-slate-400'>
          {t('projectSelectedFiles', { count: selectedFiles.length })}
        </p>
      ) : null}

      {error ? <p className='mt-3 text-sm text-red-600 dark:text-red-400'>{error}</p> : null}
    </div>
  );
}
