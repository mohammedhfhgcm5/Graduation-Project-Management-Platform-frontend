import type { Comment as ProjectComment } from '@/types';

import { CommentItem } from '@/features/comments/CommentItem';
import { useI18n } from '@/i18n';

export function CommentList({ comments }: { comments: ProjectComment[] }) {
  const { t } = useI18n();

  if (!comments.length) {
    return (
      <p className='text-sm text-slate-500 dark:text-slate-400'>{t('projectNoComments')}</p>
    );
  }

  return (
    <ul className='space-y-2'>
      {comments.map((comment) => (
        <CommentItem key={comment.id} comment={comment} />
      ))}
    </ul>
  );
}
