import { useState, type FormEvent } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useI18n } from '@/i18n';

export interface MeetingFormValues {
  scheduledAt: string;
  location: string;
  notes: string;
}

const initialValues: MeetingFormValues = {
  scheduledAt: '',
  location: '',
  notes: '',
};

export function MeetingForm({
  onSubmit,
  isSubmitting,
}: {
  onSubmit: (values: MeetingFormValues) => void;
  isSubmitting?: boolean;
}) {
  const { t } = useI18n();
  const [values, setValues] = useState<MeetingFormValues>(initialValues);

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
      <div className='grid gap-3 md:grid-cols-2'>
        <div className='space-y-1'>
          <label className='text-sm font-medium text-slate-700 dark:text-slate-200'>
            {t('projectMeetingDateTime')}
          </label>
          <Input
            type='datetime-local'
            value={values.scheduledAt}
            onChange={(event) =>
              setValues((current) => ({
                ...current,
                scheduledAt: event.target.value,
              }))
            }
            required
          />
        </div>
        <div className='space-y-1'>
          <label className='text-sm font-medium text-slate-700 dark:text-slate-200'>
            {t('projectMeetingLocation')}
          </label>
          <Input
            value={values.location}
            onChange={(event) =>
              setValues((current) => ({
                ...current,
                location: event.target.value,
              }))
            }
            placeholder={t('projectMeetingLocationPlaceholder')}
          />
        </div>
      </div>
      <div className='space-y-1'>
        <label className='text-sm font-medium text-slate-700 dark:text-slate-200'>
          {t('projectMeetingNotes')}
        </label>
        <Textarea
          value={values.notes}
          onChange={(event) =>
            setValues((current) => ({
              ...current,
              notes: event.target.value,
            }))
          }
          placeholder={t('projectMeetingNotesPlaceholder')}
        />
      </div>
      <Button type='submit' disabled={isSubmitting}>
        {isSubmitting ? t('projectSchedulingMeeting') : t('projectScheduleMeeting')}
      </Button>
    </form>
  );
}
