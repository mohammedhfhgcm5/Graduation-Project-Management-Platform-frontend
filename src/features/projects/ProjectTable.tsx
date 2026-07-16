import { Link } from 'react-router-dom';

import { ProjectMemberSummary } from '@/features/projects/ProjectMembers';
import { ProjectStatusBadge } from '@/features/projects/ProjectStatusBadge';
import { useI18n } from '@/i18n';
import type { Project } from '@/types';
import { formatDate } from '@/utils/formatDate';
import { getProjectStudents, getProjectSupervisors } from '@/utils/projectMembers';

export function ProjectTable({ projects }: { projects: Project[] }) {
  const { t } = useI18n();

  return (
    <div className='overflow-hidden rounded-[1.75rem] border border-slate-200/80 bg-white/85 shadow-[0_18px_45px_rgba(15,23,42,0.08)] backdrop-blur-sm dark:border-white/10 dark:bg-slate-950/45 dark:shadow-[0_24px_60px_rgba(2,6,23,0.42)]'>
      <div className='overflow-x-auto'>
        <table className='min-w-[960px] w-full border-collapse text-start text-sm'>
          <thead className='border-b border-slate-200/80 bg-gradient-to-r from-slate-50 via-white to-slate-50/80 dark:border-white/10 dark:from-slate-950/95 dark:via-slate-900/80 dark:to-slate-950/95'>
            <tr>
              <th className='px-5 py-4 text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400'>
                {t('projectsTableTitle')}
              </th>
              <th className='px-5 py-4 text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400'>
                {t('projectsTableStatus')}
              </th>
              <th className='px-5 py-4 text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400'>
                {t('projectsTableProgress')}
              </th>
              <th className='px-5 py-4 text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400'>
                {t('projectsTableOwner')}
              </th>
              <th className='px-5 py-4 text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400'>
                {t('projectsTableSupervisor')}
              </th>
              <th className='px-5 py-4 text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400'>
                {t('projectsTableUpdated')}
              </th>
              <th className='px-5 py-4 text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400'>
                {t('commonView')}
              </th>
            </tr>
          </thead>
          <tbody className='divide-y divide-slate-200/80 dark:divide-white/[0.05]'>
            {projects.map((project) => {
              const progress = Math.min(100, Math.max(0, project.progress));
              const students = getProjectStudents(project);
              const supervisors = getProjectSupervisors(project);

              return (
                <tr
                  key={project.id}
                  className='group transition-colors duration-200 even:bg-slate-50/35 hover:bg-violet-50/80 dark:even:bg-white/[0.02] dark:hover:bg-white/[0.05]'
                >
                  <td className='px-5 py-4 align-top'>
                    <div className='min-w-[260px]'>
                      <p className='font-semibold text-slate-900 dark:text-slate-50'>
                        {project.title}
                      </p>
                      <p className='mt-1 line-clamp-2 text-xs leading-5 text-slate-500 dark:text-slate-400'>
                        {project.description || '-'}
                      </p>
                    </div>
                  </td>
                  <td className='px-5 py-4 align-middle text-slate-600 dark:text-slate-300'>
                    <div className='min-w-[140px]'>
                      <ProjectStatusBadge status={project.status} />
                    </div>
                  </td>
                  <td className='px-5 py-4 align-middle'>
                    <div className='min-w-[170px] space-y-2'>
                      <div className='flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400'>
                        <span>{progress}%</span>
                      </div>
                      <div className='h-2 rounded-full bg-slate-200 dark:bg-white/10'>
                        <div
                          className='h-full rounded-full bg-gradient-to-r from-violet-500 via-indigo-500 to-sky-500 transition-[width] duration-300'
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className='min-w-[220px] px-5 py-4 align-middle'>
                    <ProjectMemberSummary
                      members={students}
                      emptyLabel='-'
                      maxVisible={2}
                      tone='violet'
                    />
                  </td>
                  <td className='min-w-[220px] px-5 py-4 align-middle'>
                    <ProjectMemberSummary
                      members={supervisors}
                      emptyLabel={t('projectNoSupervisor')}
                      maxVisible={2}
                      tone='emerald'
                    />
                  </td>
                  <td className='min-w-[140px] px-5 py-4 align-middle text-sm text-slate-500 dark:text-slate-400'>
                    {formatDate(project.updatedAt)}
                  </td>
                  <td className='px-5 py-4 align-middle'>
                    <Link
                      className='inline-flex items-center rounded-full border border-slate-300/80 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-violet-400/60 hover:bg-violet-50 hover:text-violet-700 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-200 dark:hover:border-violet-400/50 dark:hover:bg-violet-500/10 dark:hover:text-violet-200'
                      to={`/projects/${project.id}`}
                    >
                      {t('commonView')}
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
