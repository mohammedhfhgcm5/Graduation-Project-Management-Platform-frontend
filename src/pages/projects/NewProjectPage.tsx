import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

import { authService } from '@/api/auth.service';
import { filesService } from '@/api/files.service';
import { ProjectForm, type ProjectFormValues } from '@/components/forms/ProjectForm';
import { Button } from '@/components/ui/button';
import {
  ProjectMemberChips,
  ProjectMemberOption,
} from '@/features/projects/ProjectMembers';
import { useProjects } from '@/hooks/useProjects';
import { useI18n } from '@/i18n';
import { getApiErrorMessage } from '@/lib/errors';
import { useAuthStore } from '@/store/zustand/authStore';

function normalizeTechStack(value: string) {
  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

function formatFileSize(size: number) {
  if (size < 1024) {
    return `${size} B`;
  }

  if (size < 1024 * 1024) {
    return `${(size / 1024).toFixed(1)} KB`;
  }

  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

const panelClassName =
  'rounded-[1.5rem] border border-slate-200/80 bg-white/85 p-5 shadow-[0_18px_45px_rgba(15,23,42,0.06)] backdrop-blur-sm dark:border-white/10 dark:bg-slate-950/45 dark:shadow-[0_20px_50px_rgba(2,6,23,0.3)]';

export function NewProjectPage() {
  const navigate = useNavigate();
  const { createProject } = useProjects();
  const user = useAuthStore((state) => state.user);
  const { t } = useI18n();
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const studentsQuery = useQuery({
    queryKey: ['users', 'STUDENT'],
    queryFn: () => authService.getUsers('STUDENT'),
    enabled: user?.role === 'STUDENT',
  });

  const availableStudents = (studentsQuery.data ?? []).filter(
    (student) => student.id !== user?.id,
  );
  const selectedTeammates = availableStudents.filter((student) =>
    selectedStudentIds.includes(student.id),
  );
  const currentTeam = user ? [user, ...selectedTeammates] : selectedTeammates;

  const handleRemoveFile = (indexToRemove: number) => {
    setSelectedFiles((current) =>
      current.filter((_, fileIndex) => fileIndex !== indexToRemove),
    );
  };

  const handleStudentToggle = (studentId: string) => {
    setSelectedStudentIds((currentSelection) => {
      if (currentSelection.includes(studentId)) {
        return currentSelection.filter((id) => id !== studentId);
      }

      if (currentSelection.length >= 2) {
        return currentSelection;
      }

      return [...currentSelection, studentId];
    });
  };

  const handleSubmit = async (values: ProjectFormValues) => {
    setError('');
    setIsSubmitting(true);

    try {
      const createdProject = await createProject.mutateAsync({
        title: values.title,
        description: values.description,
        techStack: normalizeTechStack(values.techStack),
        studentIds: selectedStudentIds.length ? selectedStudentIds : undefined,
      });

      if (selectedFiles.length) {
        await Promise.all(
          selectedFiles.map((file) =>
            filesService.uploadSingle({
              projectId: createdProject.id,
              file,
              type: 'PROPOSAL',
            }),
          ),
        );
      }

      navigate(`/projects/${createdProject.id}`, { replace: true });
    } catch (submissionError) {
      setError(getApiErrorMessage(submissionError, t('projectsCreateError')));
      setIsSubmitting(false);
      return;
    }

    setIsSubmitting(false);
  };

  return (
    <section className='space-y-6'>
      <div className='overflow-hidden rounded-[1.85rem] border border-slate-200/80 bg-white/90 shadow-[0_24px_60px_rgba(15,23,42,0.08)] backdrop-blur-sm dark:border-white/10 dark:bg-slate-950/50 dark:shadow-[0_28px_70px_rgba(2,6,23,0.36)]'>
        <div className='relative px-6 py-6'>
          <div className='absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(99,102,241,0.14),transparent_42%),radial-gradient(circle_at_right,rgba(56,189,248,0.12),transparent_32%)] dark:bg-[radial-gradient(circle_at_top_left,rgba(99,102,241,0.22),transparent_38%),radial-gradient(circle_at_right,rgba(16,185,129,0.12),transparent_32%)]' />
          <div className='relative flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between'>
            <div className='space-y-3'>
              <p className='text-[11px] font-bold uppercase tracking-[0.18em] text-violet-600 dark:text-violet-300'>
                {t('projectsNew')}
              </p>
              <h1 className='text-3xl font-black tracking-tight text-slate-950 dark:text-slate-50'>
                {t('projectsCreateTitle')}
              </h1>
              <p className='max-w-2xl text-sm leading-7 text-slate-600 dark:text-slate-300'>
                {t('projectsCreateSubtitle')}
              </p>
            </div>

            <div className='grid gap-3 sm:grid-cols-2'>
              <div className='rounded-2xl border border-slate-200/80 bg-white/75 px-4 py-3 shadow-sm dark:border-white/10 dark:bg-white/[0.04]'>
                <p className='text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400'>
                  {t('projectStudent')}
                </p>
                <p className='mt-1 text-sm font-semibold text-slate-900 dark:text-slate-100'>
                  {currentTeam.length}
                </p>
              </div>
              <div className='rounded-2xl border border-slate-200/80 bg-white/75 px-4 py-3 shadow-sm dark:border-white/10 dark:bg-white/[0.04]'>
                <p className='text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400'>
                  {t('projectPendingFiles')}
                </p>
                <p className='mt-1 text-sm font-semibold text-slate-900 dark:text-slate-100'>
                  {selectedFiles.length
                    ? t('projectSelectedFiles', { count: selectedFiles.length })
                    : t('projectNoFiles')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className='grid gap-6 xl:grid-cols-[minmax(0,1.1fr),420px]'>
        <div className={panelClassName}>
          <div className='mb-5 space-y-1'>
            <h2 className='text-lg font-semibold tracking-tight text-slate-900 dark:text-slate-50'>
              {t('projectOverview')}
            </h2>
            <p className='text-sm text-slate-500 dark:text-slate-400'>
              {t('projectsCreateSubtitle')}
            </p>
          </div>

          <ProjectForm
            submitLabel={t('projectsCreateButton')}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            disabled={isSubmitting}
          />

          {error ? <p className='mt-4 text-sm text-red-600 dark:text-red-400'>{error}</p> : null}
        </div>

        <aside className={`${panelClassName} h-fit space-y-5`}>
          <div>
            <div className='flex items-start justify-between gap-3'>
              <div className='space-y-1'>
                <h2 className='text-lg font-semibold tracking-tight text-slate-900 dark:text-slate-50'>
                  {t('projectStudentTeam')}
                </h2>
                <p className='text-sm leading-6 text-slate-500 dark:text-slate-400'>
                  {t('projectStudentTeamHelp')}
                </p>
              </div>
              <span className='inline-flex min-w-[2.25rem] items-center justify-center rounded-full border border-slate-200 bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700 dark:border-white/10 dark:bg-white/[0.05] dark:text-slate-200'>
                {currentTeam.length}
              </span>
            </div>

            <div className='mt-4 rounded-2xl border border-slate-200/80 bg-slate-50/80 p-4 dark:border-white/10 dark:bg-white/[0.03]'>
              <ProjectMemberChips members={currentTeam} emptyLabel='-' tone='violet' />
            </div>

            {studentsQuery.isLoading ? (
              <p className='mt-4 text-sm text-slate-500 dark:text-slate-400'>
                {t('commonLoading')}
              </p>
            ) : null}

            {studentsQuery.error ? (
              <p className='mt-4 text-sm text-red-600 dark:text-red-400'>
                {getApiErrorMessage(studentsQuery.error, t('errorLoadUsers'))}
              </p>
            ) : null}

            {!studentsQuery.isLoading && availableStudents.length ? (
              <div className='mt-4 grid gap-3'>
                {availableStudents.map((student) => {
                  const isSelected = selectedStudentIds.includes(student.id);

                  return (
                    <ProjectMemberOption
                      key={student.id}
                      member={student}
                      selected={isSelected}
                      tone='violet'
                      disabled={
                        isSubmitting || (!isSelected && selectedStudentIds.length >= 2)
                      }
                      onClick={() => handleStudentToggle(student.id)}
                    />
                  );
                })}
              </div>
            ) : null}

            {!studentsQuery.isLoading && !availableStudents.length ? (
              <div className='mt-4 rounded-2xl border border-dashed border-slate-300/80 bg-slate-50/50 p-5 text-center dark:border-white/10 dark:bg-white/[0.02]'>
                <p className='text-sm text-slate-500 dark:text-slate-400'>
                  {t('projectStudentTeamEmpty')}
                </p>
              </div>
            ) : null}
          </div>

          <div>
            <div className='flex items-start justify-between gap-3'>
              <div className='space-y-1'>
                <h2 className='text-lg font-semibold tracking-tight text-slate-900 dark:text-slate-50'>
                  {t('projectPendingFiles')}
                </h2>
                <p className='text-sm leading-6 text-slate-500 dark:text-slate-400'>
                  {t('projectPendingFilesHelp')}
                </p>
              </div>
              <span className='inline-flex min-w-[2.25rem] items-center justify-center rounded-full border border-slate-200 bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700 dark:border-white/10 dark:bg-white/[0.05] dark:text-slate-200'>
                {selectedFiles.length}
              </span>
            </div>

            <div className='mt-4 rounded-2xl border border-slate-200/80 bg-slate-50/80 p-4 dark:border-white/10 dark:bg-white/[0.03]'>
              <input
                className='block w-full rounded-xl border border-dashed border-slate-300 bg-white px-4 py-3 text-sm text-slate-600 shadow-[inset_0_1px_2px_rgba(15,23,42,0.04)] transition-colors file:mr-4 file:rounded-full file:border-0 file:bg-gradient-to-r file:from-violet-600 file:to-indigo-600 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:border-violet-300 hover:file:opacity-95 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-300 dark:hover:border-white/[0.18]'
                type='file'
                multiple
                disabled={isSubmitting}
                onChange={(event) => setSelectedFiles(Array.from(event.target.files ?? []))}
              />

              <p className='mt-3 text-sm text-slate-500 dark:text-slate-400'>
                {selectedFiles.length
                  ? t('projectSelectedFiles', { count: selectedFiles.length })
                  : t('projectNoFiles')}
              </p>
            </div>

            {selectedFiles.length ? (
              <ul className='mt-4 space-y-2'>
                {selectedFiles.map((file, index) => (
                  <li
                    key={`${file.name}-${file.lastModified}-${index}`}
                    className='flex items-center justify-between gap-3 rounded-2xl border border-slate-200/80 bg-slate-50/80 p-4 shadow-sm dark:border-white/10 dark:bg-white/[0.03]'
                  >
                    <div className='min-w-0'>
                      <p className='truncate text-sm font-medium text-slate-900 dark:text-slate-100'>
                        {file.name}
                      </p>
                      <p className='mt-1 text-xs text-slate-500 dark:text-slate-400'>
                        {formatFileSize(file.size)}
                      </p>
                    </div>
                    <Button
                      variant='ghost'
                      size='sm'
                      className='border border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-100 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-200 dark:hover:bg-white/[0.08]'
                      onClick={() => handleRemoveFile(index)}
                      disabled={isSubmitting}
                    >
                      {t('commonDelete')}
                    </Button>
                  </li>
                ))}
              </ul>
            ) : (
              <div className='mt-4 rounded-2xl border border-dashed border-slate-300/80 bg-slate-50/50 p-5 text-center dark:border-white/10 dark:bg-white/[0.02]'>
                <p className='text-sm text-slate-500 dark:text-slate-400'>
                  {t('projectNoFiles')}
                </p>
              </div>
            )}
          </div>
        </aside>
      </div>
    </section>
  );
}
