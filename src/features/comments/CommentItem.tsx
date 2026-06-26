import type { Comment as ProjectComment } from '@/types';
import { formatDate } from '@/utils/formatDate';
import { useI18n } from '@/i18n';

export function CommentItem({ comment }: { comment: ProjectComment }) {
  const { t } = useI18n();

  return (
    <li className='rounded-2xl border border-slate-200/80 bg-slate-50/80 p-4 shadow-sm dark:border-white/10 dark:bg-white/[0.03]'>
      {comment.author?.name ? (
        <p className='mb-1 text-sm font-medium text-slate-900 dark:text-slate-100'>
          {t('projectAuthor')}: {comment.author.name}
        </p>
      ) : null}
      <p className='text-sm leading-6 text-slate-700 dark:text-slate-300'>{comment.content}</p>
      <p className='mt-2 text-xs text-slate-400 dark:text-slate-500'>
        {formatDate(comment.createdAt)}
      </p>
    </li>
  );
}
