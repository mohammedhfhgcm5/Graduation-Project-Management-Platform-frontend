import { useState, type ReactNode } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';

import { authService } from '@/api/auth.service';
import { projectsService } from '@/api/projects.service';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { CommentForm } from '@/components/forms/CommentForm';
import { Button } from '@/components/ui/button';
import { CommentList } from '@/features/comments/CommentList';
import { FileList } from '@/features/files/FileList';
import { FileUpload } from '@/features/files/FileUpload';
import { MeetingForm } from '@/features/meetings/MeetingForm';
import { MeetingList } from '@/features/meetings/MeetingList';
import { ProjectDetail } from '@/features/projects/ProjectDetail';
import { ProjectMemberOption } from '@/features/projects/ProjectMembers';
import { ReportForm } from '@/features/reports/ReportForm';
import { ReportList } from '@/features/reports/ReportList';
import { useComments } from '@/hooks/useComments';
import { useFiles } from '@/hooks/useFiles';
import { useMeetings } from '@/hooks/useMeetings';
import { useProject } from '@/hooks/useProject';
import { useReports } from '@/hooks/useReports';
import { getProjectStatusLabel, useI18n } from '@/i18n';
import { getApiErrorMessage } from '@/lib/errors';
import { useAuthStore } from '@/store/zustand/authStore';
import type { ProjectStatus } from '@/types';
import { cn } from '@/utils/cn';
import {
  getProjectSupervisors,
  haveSameIds,
  isProjectStudent,
  isProjectSupervisor,
} from '@/utils/projectMembers';

const statuses: ProjectStatus[] = [
  'PENDING_APPROVAL',
  'APPROVED',
  'IN_PROGRESS',
  'UNDER_REVIEW',
  'COMPLETED',
  'REJECTED',
];

const sectionClassName =
  'rounded-[1.5rem] border border-slate-200/80 bg-white/85 p-5 shadow-[0_18px_45px_rgba(15,23,42,0.06)] backdrop-blur-sm dark:border-white/10 dark:bg-slate-950/45 dark:shadow-[0_20px_50px_rgba(2,6,23,0.3)]';

const sectionTitleClassName =
  'text-lg font-semibold tracking-tight text-slate-900 dark:text-slate-50';

const sectionErrorClassName = 'text-sm text-red-600 dark:text-red-400';

const selectClassName =
  'h-11 w-full rounded-xl border border-slate-300 bg-white px-4 text-sm text-slate-800 shadow-[inset_0_1px_2px_rgba(15,23,42,0.04)] transition-all duration-200 hover:border-slate-400 focus:border-violet-500 focus:outline-none focus:ring-[3px] focus:ring-violet-500/20 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-100 dark:hover:border-white/[0.18] dark:focus:bg-violet-500/[0.04]';

function DetailSection({
  title,
  className,
  children,
}: {
  title: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section className={cn(sectionClassName, className)}>
      <h2 className={sectionTitleClassName}>{title}</h2>
      <div className='mt-4 space-y-4'>{children}</div>
    </section>
  );
}

export function ProjectDetailPage() {
  const { id } = useParams();
  const user = useAuthStore((state) => state.user);
  const queryClient = useQueryClient();
  const { t } = useI18n();

  const {
    data: project,
    isLoading,
    error: projectError,
  } = useProject(id);

  const { commentsQuery, createComment } = useComments(id);
  const { meetingsQuery, createMeeting } = useMeetings(id);
  const { reportsQuery, createReport } = useReports(id);
  const { filesQuery, deleteFile } = useFiles(id);

  const [pendingStatus, setPendingStatus] = useState<ProjectStatus | null>(null);
  const [pendingSupervisorIds, setPendingSupervisorIds] = useState<string[] | null>(null);

  const selectedStatus = pendingStatus ?? project?.status ?? 'PENDING_APPROVAL';
  const currentSupervisorIds = getProjectSupervisors(project).map(
    (supervisor) => supervisor.id,
  );
  const selectedSupervisorIds = pendingSupervisorIds ?? currentSupervisorIds;

  const supervisorsQuery = useQuery({
    queryKey: ['users', 'SUPERVISOR'],
    queryFn: () => authService.getUsers('SUPERVISOR'),
    enabled: user?.role === 'HEAD',
  });

  const changeProjectStatus = useMutation({
    mutationFn: (status: ProjectStatus) =>
      projectsService.changeStatus(id as string, { status }),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['project', id] }),
        queryClient.invalidateQueries({ queryKey: ['projects'] }),
      ]);
    },
  });

  const assignSupervisor = useMutation({
    mutationFn: (supervisorIds: string[]) =>
      projectsService.assignSupervisor(id as string, { supervisorIds }),
    onSuccess: async () => {
      setPendingSupervisorIds(null);
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['project', id] }),
        queryClient.invalidateQueries({ queryKey: ['projects'] }),
      ]);
    },
  });

  if (isLoading) {
    return <LoadingSpinner label={t('projectDetailLoading')} />;
  }

  if (projectError) {
    return (
      <div className={sectionClassName}>
        <p className={sectionErrorClassName}>
          {getApiErrorMessage(projectError, t('errorLoadProject'))}
        </p>
      </div>
    );
  }

  if (!project) {
    return (
      <div className={sectionClassName}>
        <p className='text-sm text-slate-500 dark:text-slate-400'>
          {t('projectNotFound')}
        </p>
      </div>
    );
  }

  const isAssignedStudent = isProjectStudent(project, user?.id);
  const isAssignedSupervisor = isProjectSupervisor(project, user?.id);
  const canAccessProject = Boolean(
    user && (user.role === 'HEAD' || isAssignedStudent || isAssignedSupervisor),
  );
  const canManageStatus = isAssignedSupervisor;
  const canComment = isAssignedSupervisor;
  const canScheduleMeetings = isAssignedSupervisor;
  const canSubmitReports = isAssignedStudent;
  const canUploadFiles = isAssignedStudent;
  const canDeleteFiles = isAssignedStudent || isAssignedSupervisor;
  const supervisors = supervisorsQuery.data ?? [];

  const handleSupervisorToggle = (supervisorId: string) => {
    setPendingSupervisorIds((currentSelection) => {
      const selection = currentSelection ?? currentSupervisorIds;

      if (selection.includes(supervisorId)) {
        return selection.filter((id) => id !== supervisorId);
      }

      if (selection.length >= 3) {
        return selection;
      }

      return [...selection, supervisorId];
    });
  };

  if (!canAccessProject) {
    return (
      <div className={sectionClassName}>
        <p className='text-sm text-slate-500 dark:text-slate-400'>
          {t('projectAccessDenied')}
        </p>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      <ProjectDetail project={project} />

      <div className='grid gap-6 xl:grid-cols-2'>
        {canManageStatus ? (
          <DetailSection title={t('projectStatusUpdate')}>
            <div className='flex flex-col gap-3 lg:flex-row lg:items-center'>
              <select
                className={cn(selectClassName, 'lg:flex-1')}
                value={selectedStatus}
                onChange={(event) =>
                  setPendingStatus(event.target.value as ProjectStatus)
                }
              >
                {statuses.map((status) => (
                  <option key={status} value={status}>
                    {getProjectStatusLabel(status, t)}
                  </option>
                ))}
              </select>
              <Button
                className='w-full lg:w-auto'
                onClick={() => changeProjectStatus.mutate(selectedStatus)}
                disabled={
                  changeProjectStatus.isPending || selectedStatus === project.status
                }
              >
                {changeProjectStatus.isPending
                  ? t('commonSaving')
                  : t('projectStatusUpdateButton')}
              </Button>
            </div>
            {changeProjectStatus.error ? (
              <p className={sectionErrorClassName}>
                {getApiErrorMessage(
                  changeProjectStatus.error,
                  t('projectStatusUpdateError'),
                )}
              </p>
            ) : null}
          </DetailSection>
        ) : null}

        {user?.role === 'HEAD' ? (
          <DetailSection title={t('projectAssignSupervisor')}>
            <div className='flex items-start justify-between gap-3 rounded-2xl border border-slate-200/80 bg-slate-50/80 p-4 dark:border-white/10 dark:bg-white/[0.03]'>
              <div>
                <p className='text-sm font-medium text-slate-800 dark:text-slate-100'>
                  {t('projectSupervisorListLabel')}
                </p>
                <p className='mt-1 text-sm text-slate-500 dark:text-slate-400'>
                  {t('projectSupervisorSelectionHelp')}
                </p>
              </div>
              <span className='inline-flex min-w-[2.25rem] items-center justify-center rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-bold text-slate-700 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-200'>
                {selectedSupervisorIds.length}
              </span>
            </div>

            {supervisorsQuery.isLoading ? (
              <p className='text-sm text-slate-500 dark:text-slate-400'>
                {t('commonLoading')}
              </p>
            ) : null}

            {!supervisorsQuery.isLoading && supervisors.length ? (
              <div className='grid gap-3 md:grid-cols-2 xl:grid-cols-3'>
                {supervisors.map((supervisor) => {
                  const isSelected = selectedSupervisorIds.includes(supervisor.id);

                  return (
                    <ProjectMemberOption
                      key={supervisor.id}
                      member={supervisor}
                      selected={isSelected}
                      tone='emerald'
                      disabled={
                        assignSupervisor.isPending ||
                        (!isSelected && selectedSupervisorIds.length >= 3)
                      }
                      onClick={() => handleSupervisorToggle(supervisor.id)}
                    />
                  );
                })}
              </div>
            ) : null}

            {!supervisorsQuery.isLoading && !supervisors.length ? (
              <p className='text-sm text-slate-500 dark:text-slate-400'>
                {t('commonNoData')}
              </p>
            ) : null}

            <div className='flex flex-col gap-3 lg:flex-row lg:items-center'>
              <Button
                className='w-full lg:w-auto'
                onClick={() => assignSupervisor.mutate(selectedSupervisorIds)}
                disabled={
                  !selectedSupervisorIds.length ||
                  assignSupervisor.isPending ||
                  haveSameIds(selectedSupervisorIds, currentSupervisorIds)
                }
              >
                {assignSupervisor.isPending
                  ? t('commonSaving')
                  : t('projectAssignSupervisorButton')}
              </Button>
            </div>

            {supervisorsQuery.error ? (
              <p className={sectionErrorClassName}>
                {getApiErrorMessage(supervisorsQuery.error, t('errorGeneric'))}
              </p>
            ) : null}
            {assignSupervisor.error ? (
              <p className={sectionErrorClassName}>
                {getApiErrorMessage(
                  assignSupervisor.error,
                  t('projectAssignSupervisorError'),
                )}
              </p>
            ) : null}
          </DetailSection>
        ) : null}

        <DetailSection className='xl:col-span-2' title={t('projectFiles')}>
          {canUploadFiles ? (
            <FileUpload projectId={project.id} allowMultiple defaultType='OTHER' />
          ) : null}
          {filesQuery.error ? (
            <p className={sectionErrorClassName}>
              {getApiErrorMessage(filesQuery.error, t('errorLoadFiles'))}
            </p>
          ) : null}
          <FileList
            files={filesQuery.data ?? []}
            canDelete={canDeleteFiles}
            onDelete={(fileId) => deleteFile.mutate(fileId)}
            isDeleting={deleteFile.isPending}
          />
        </DetailSection>

        <DetailSection title={t('projectReports')}>
          {canSubmitReports ? (
            <ReportForm
              onSubmit={(values) => createReport.mutate(values)}
              isSubmitting={createReport.isPending}
            />
          ) : null}
          {createReport.error ? (
            <p className={sectionErrorClassName}>
              {getApiErrorMessage(createReport.error, t('errorSaveReport'))}
            </p>
          ) : null}
          {reportsQuery.error ? (
            <p className={sectionErrorClassName}>
              {getApiErrorMessage(reportsQuery.error, t('errorLoadReports'))}
            </p>
          ) : null}
          <ReportList reports={reportsQuery.data ?? []} />
        </DetailSection>

        <DetailSection title={t('projectComments')}>
          {canComment ? (
            <CommentForm
              onSubmit={(content) => createComment.mutate({ content })}
              isSubmitting={createComment.isPending}
            />
          ) : null}
          {createComment.error ? (
            <p className={sectionErrorClassName}>
              {getApiErrorMessage(createComment.error, t('errorSaveComment'))}
            </p>
          ) : null}
          {commentsQuery.error ? (
            <p className={sectionErrorClassName}>
              {getApiErrorMessage(commentsQuery.error, t('errorLoadComments'))}
            </p>
          ) : null}
          <CommentList comments={commentsQuery.data ?? []} />
        </DetailSection>

        <DetailSection className='xl:col-span-2' title={t('projectMeetings')}>
          {canScheduleMeetings ? (
            <MeetingForm
              onSubmit={(values) =>
                createMeeting.mutate({
                  scheduledAt: values.scheduledAt,
                  location: values.location || undefined,
                  notes: values.notes || undefined,
                })
              }
              isSubmitting={createMeeting.isPending}
            />
          ) : null}
          {createMeeting.error ? (
            <p className={sectionErrorClassName}>
              {getApiErrorMessage(createMeeting.error, t('errorSaveMeeting'))}
            </p>
          ) : null}
          {meetingsQuery.error ? (
            <p className={sectionErrorClassName}>
              {getApiErrorMessage(meetingsQuery.error, t('errorLoadMeetings'))}
            </p>
          ) : null}
          <MeetingList meetings={meetingsQuery.data ?? []} />
        </DetailSection>
      </div>
    </div>
  );
}
