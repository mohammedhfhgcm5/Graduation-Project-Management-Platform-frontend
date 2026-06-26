import { Button } from '@/components/ui/button';
import { getFileTypeLabel, useI18n } from '@/i18n';
import type { ProjectFile } from '@/types';
import { resolveFileUrl } from '@/utils/resolveFileUrl';

function formatFileSize(size?: number | null) {
  if (!size) {
    return null;
  }

  if (size < 1024) {
    return `${size} B`;
  }

  if (size < 1024 * 1024) {
    return `${(size / 1024).toFixed(1)} KB`;
  }

  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

export function FileList({
  files,
  canDelete = false,
  onDelete,
  isDeleting = false,
}: {
  files: ProjectFile[];
  canDelete?: boolean;
  onDelete?: (fileId: string) => void;
  isDeleting?: boolean;
}) {
  const { t } = useI18n();

  if (!files.length) {
    return <p className='text-sm text-slate-500 dark:text-slate-400'>{t('projectNoFiles')}</p>;
  }

  return (
    <ul className='space-y-2'>
      {files.map((file) => (
        <li
          key={file.id}
          className='flex flex-col gap-3 rounded-2xl border border-slate-200/80 bg-slate-50/80 p-4 shadow-sm md:flex-row md:items-center md:justify-between dark:border-white/10 dark:bg-white/[0.03]'
        >
          <div className='space-y-1'>
            <p className='font-medium text-slate-900 dark:text-slate-100'>{file.filename}</p>
            <p className='text-sm text-slate-500 dark:text-slate-400'>
              {getFileTypeLabel(file.type, t)}
              {formatFileSize(file.size) ? ` | ${formatFileSize(file.size)}` : ''}
            </p>
          </div>
          <div className='flex items-center gap-2'>
            <a
              className='inline-flex h-9 items-center justify-center rounded-full border border-slate-300/80 bg-white px-4 text-sm font-medium text-slate-700 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-violet-400/60 hover:bg-violet-50 hover:text-violet-700 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-200 dark:hover:border-violet-400/50 dark:hover:bg-violet-500/10 dark:hover:text-violet-200'
              href={resolveFileUrl(file.url)}
              target='_blank'
              rel='noreferrer'
            >
              {t('commonOpen')}
            </a>
            {canDelete && onDelete ? (
              <Button
                variant='ghost'
                size='sm'
                className='border border-red-200 bg-red-50 text-red-700 hover:border-red-300 hover:bg-red-100 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-200 dark:hover:bg-red-500/15'
                onClick={() => onDelete(file.id)}
                disabled={isDeleting}
              >
                {t('projectDeleteFile')}
              </Button>
            ) : null}
          </div>
        </li>
      ))}
    </ul>
  );
}
