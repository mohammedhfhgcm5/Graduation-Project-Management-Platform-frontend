import { useState, type FormEvent } from 'react';

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useI18n } from '@/i18n';

export function CommentForm({
  onSubmit,
  isSubmitting,
}: {
  onSubmit: (content: string) => void;
  isSubmitting?: boolean;
}) {
  const { t } = useI18n();
  const [content, setContent] = useState('');

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!content.trim()) {
      return;
    }

    onSubmit(content);
    setContent('');
  };

  return (
    <form
      className='space-y-3 rounded-2xl border border-slate-200/80 bg-slate-50/80 p-4 dark:border-white/10 dark:bg-white/[0.03]'
      onSubmit={handleSubmit}
    >
      <Textarea
        value={content}
        onChange={(event) => setContent(event.target.value)}
        placeholder={t('projectCommentsPlaceholder')}
      />
      <Button type='submit' size='sm' disabled={isSubmitting || !content.trim()}>
        {isSubmitting ? t('projectPostingComment') : t('projectPostComment')}
      </Button>
    </form>
  );
}
