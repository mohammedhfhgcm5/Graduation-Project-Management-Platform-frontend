import type { Project } from '@/types';
import { formatDate } from '@/utils/formatDate';

import { ProjectMemberChips } from '@/features/projects/ProjectMembers';
import { ProjectStatusBadge } from '@/features/projects/ProjectStatusBadge';
import { useI18n } from '@/i18n';
import { getProjectStudents, getProjectSupervisors } from '@/utils/projectMembers';

export function ProjectDetail({ project }: { project: Project }) {
  const { t } = useI18n();
  const progress = Math.min(Math.max(project.progress, 0), 100);
  const students = getProjectStudents(project);
  const supervisors = getProjectSupervisors(project);

  return (
    <section className='overflow-hidden rounded-[1.85rem] border border-slate-200/80 bg-white/90 shadow-[0_24px_60px_rgba(15,23,42,0.08)] backdrop-blur-sm dark:border-white/10 dark:bg-slate-950/50 dark:shadow-[0_28px_70px_rgba(2,6,23,0.36)]'>
      <div className='relative overflow-hidden border-b border-slate-200/80 px-6 py-6 dark:border-white/10'>
        <div className='absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(99,102,241,0.14),transparent_42%),radial-gradient(circle_at_right,rgba(56,189,248,0.12),transparent_32%)] dark:bg-[radial-gradient(circle_at_top_left,rgba(99,102,241,0.22),transparent_38%),radial-gradient(circle_at_right,rgba(16,185,129,0.12),transparent_32%)]' />
        <div className='relative flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between'>
          <div className='space-y-3'>
            <h1 className='text-2xl font-black tracking-tight text-slate-950 dark:text-slate-50 md:text-3xl'>
              {project.title}
            </h1>
            <p className='max-w-3xl text-sm leading-7 text-slate-600 dark:text-slate-300'>
              {project.description || '-'}
            </p>
          </div>
          <div className='shrink-0'>
            <ProjectStatusBadge status={project.status} />
          </div>
        </div>
      </div>

      <div className='space-y-6 px-6 py-6'>
        <div className='grid gap-4 md:grid-cols-2 xl:grid-cols-4'>
          <div className='space-y-1 rounded-2xl border border-slate-200/80 bg-slate-50/80 p-4 dark:border-white/10 dark:bg-white/[0.03]'>
            <p className='text-xs font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400'>
              {t('projectStudent')}
            </p>
            <ProjectMemberChips members={students} emptyLabel='-' tone='violet' />
          </div>
          <div className='space-y-1 rounded-2xl border border-slate-200/80 bg-slate-50/80 p-4 dark:border-white/10 dark:bg-white/[0.03]'>
            <p className='text-xs font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400'>
              {t('projectSupervisor')}
            </p>
            <ProjectMemberChips
              members={supervisors}
              emptyLabel={t('projectNoSupervisor')}
              tone='emerald'
            />
          </div>
          <div className='space-y-1 rounded-2xl border border-slate-200/80 bg-slate-50/80 p-4 dark:border-white/10 dark:bg-white/[0.03]'>
            <p className='text-xs font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400'>
              {t('projectCreatedAt')}
            </p>
            <p className='text-sm font-medium text-slate-900 dark:text-slate-100'>
              {formatDate(project.createdAt)}
            </p>
          </div>
          <div className='space-y-1 rounded-2xl border border-slate-200/80 bg-slate-50/80 p-4 dark:border-white/10 dark:bg-white/[0.03]'>
            <p className='text-xs font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400'>
              {t('projectUpdatedAt')}
            </p>
            <p className='text-sm font-medium text-slate-900 dark:text-slate-100'>
              {formatDate(project.updatedAt)}
            </p>
          </div>
        </div>

        <div className='grid gap-4 xl:grid-cols-[minmax(0,1.25fr),minmax(280px,0.75fr)]'>
          <div className='rounded-2xl border border-slate-200/80 bg-slate-50/80 p-4 dark:border-white/10 dark:bg-white/[0.03]'>
            <div className='flex items-center justify-between gap-3 text-sm font-medium text-slate-600 dark:text-slate-300'>
              <span>{t('projectProgress')}</span>
              <span className='text-base font-bold text-slate-950 dark:text-slate-50'>
                {progress}%
              </span>
            </div>
            <div className='mt-4 h-3 overflow-hidden rounded-full bg-slate-200 dark:bg-white/10'>
              <div
                className='h-full rounded-full bg-gradient-to-r from-violet-500 via-indigo-500 to-sky-500 transition-all duration-300'
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <div className='rounded-2xl border border-slate-200/80 bg-slate-50/80 p-4 dark:border-white/10 dark:bg-white/[0.03]'>
            <p className='text-sm font-semibold text-slate-800 dark:text-slate-100'>
              {t('projectTechStackList')}
            </p>
            <div className='mt-3 flex flex-wrap gap-2'>
              {project.techStack.length ? (
                project.techStack.map((item) => (
                  <span
                    key={item}
                    className='inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700 shadow-sm dark:border-white/10 dark:bg-white/[0.05] dark:text-slate-200'
                  >
                    {item}
                  </span>
                ))
              ) : (
                <span className='text-sm text-slate-500 dark:text-slate-400'>-</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
