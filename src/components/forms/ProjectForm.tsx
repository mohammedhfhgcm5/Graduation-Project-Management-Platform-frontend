import { useState, type FormEvent } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useI18n } from '@/i18n';

export interface ProjectFormValues {
  title: string;
  description: string;
  techStack: string;
}

export function ProjectForm({
  initialValues,
  submitLabel,
  onSubmit,
  isSubmitting,
  disabled,
}: {
  initialValues?: ProjectFormValues;
  submitLabel?: string;
  onSubmit: (values: ProjectFormValues) => void;
  isSubmitting?: boolean;
  disabled?: boolean;
}) {
  const { t } = useI18n();
  const [values, setValues] = useState<ProjectFormValues>({
    title: initialValues?.title ?? '',
    description: initialValues?.description ?? '',
    techStack: initialValues?.techStack ?? '',
  });

  const normalizedValues = {
    title: values.title.trim(),
    description: values.description.trim(),
    techStack: values.techStack.trim(),
  };

  const isSubmitDisabled =
    disabled ||
    isSubmitting ||
    !normalizedValues.title ||
    !normalizedValues.description ||
    !normalizedValues.techStack;

  const fieldClassName =
    'space-y-2 rounded-2xl border border-slate-200/80 bg-slate-50/80 p-4 dark:border-white/10 dark:bg-white/[0.03]';

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isSubmitDisabled) {
      return;
    }

    onSubmit(normalizedValues);
  };

  return (
    <form className='space-y-5' onSubmit={handleSubmit}>
      <div className={fieldClassName}>
        <label className='text-sm font-semibold text-slate-800 dark:text-slate-100' htmlFor='project-title'>
          {t('projectTitle')}
        </label>
        <Input
          id='project-title'
          value={values.title}
          onChange={(event) =>
            setValues((current) => ({ ...current, title: event.target.value }))
          }
          placeholder={t('projectTitlePlaceholder')}
          disabled={disabled}
          autoFocus
          required
        />
      </div>

      <div className={fieldClassName}>
        <label
          className='text-sm font-semibold text-slate-800 dark:text-slate-100'
          htmlFor='project-tech-stack'
        >
          {t('projectTechStack')}
        </label>
        <Input
          id='project-tech-stack'
          value={values.techStack}
          onChange={(event) =>
            setValues((current) => ({
              ...current,
              techStack: event.target.value,
            }))
          }
          placeholder={t('projectTechStackPlaceholder')}
          disabled={disabled}
          required
        />
      </div>

      <div className={fieldClassName}>
        <label
          className='text-sm font-semibold text-slate-800 dark:text-slate-100'
          htmlFor='project-description'
        >
          {t('projectDescription')}
        </label>
        <Textarea
          id='project-description'
          className='min-h-[180px]'
          value={values.description}
          onChange={(event) =>
            setValues((current) => ({
              ...current,
              description: event.target.value,
            }))
          }
          placeholder={t('projectDescriptionPlaceholder')}
          disabled={disabled}
          required
        />
      </div>

      <div className='flex justify-end pt-1'>
        <Button type='submit' className='w-full sm:w-auto' disabled={isSubmitDisabled}>
          {isSubmitting ? t('commonSaving') : submitLabel ?? t('commonSave')}
        </Button>
      </div>
    </form>
  );
}
