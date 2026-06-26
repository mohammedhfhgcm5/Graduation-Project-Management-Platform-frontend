import { useState, type FormEvent } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useI18n } from '@/i18n';

export interface ReportFormValues {
  weekNumber: number;
  content: string;
}

const initialValues: ReportFormValues = {
  weekNumber: 1,
  content: '',
};

export function ReportForm({
  onSubmit,
  isSubmitting,
}: {
  onSubmit: (values: ReportFormValues) => void;
  isSubmitting?: boolean;
}) {
  const { t } = useI18n();
  const [values, setValues] = useState<ReportFormValues>(initialValues);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit(values);
    setValues(initialValues);
  };

  return (
    <form
      className='space-y-3 rounded-2xl border border-slate-200/80 bg-slate-50/80 p-4 dark:border-white/10 dark:bg-white/[0.03]'
      onSubmit={handleSubmit}
    >
      <div className='space-y-1'>
        <label className='text-sm font-medium text-slate-700 dark:text-slate-200'>
          {t('projectWeekNumber')}
        </label>
        <Input
          type='number'
          min={1}
          value={values.weekNumber}
          onChange={(event) =>
            setValues((current) => ({
              ...current,
              weekNumber: Number(event.target.value) || 1,
            }))
          }
          required
        />
      </div>
      <div className='space-y-1'>
        <label className='text-sm font-medium text-slate-700 dark:text-slate-200'>
          {t('projectReportContent')}
        </label>
        <Textarea
          value={values.content}
          onChange={(event) =>
            setValues((current) => ({
              ...current,
              content: event.target.value,
            }))
          }
          placeholder={t('projectReportContentPlaceholder')}
          required
        />
      </div>
      <Button type='submit' disabled={isSubmitting}>
        {isSubmitting ? t('projectSubmittingReport') : t('projectSubmitReport')}
      </Button>
    </form>
  );
}
