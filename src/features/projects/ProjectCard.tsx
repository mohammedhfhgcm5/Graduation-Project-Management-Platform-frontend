import type { Project } from '@/types';
import { formatDate } from '@/utils/formatDate';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ProjectMemberSummary } from '@/features/projects/ProjectMembers';
import { ProjectStatusBadge } from '@/features/projects/ProjectStatusBadge';
import { useI18n } from '@/i18n';
import { getProjectStudents, getProjectSupervisors } from '@/utils/projectMembers';

export function ProjectCard({ project }: { project: Project }) {
  const { t } = useI18n();
  const students = getProjectStudents(project);
  const supervisors = getProjectSupervisors(project);

  return (
    <Card>
      <CardHeader>
        <div className='flex items-center justify-between gap-3'>
          <CardTitle>{project.title}</CardTitle>
          <ProjectStatusBadge status={project.status} />
        </div>
      </CardHeader>
      <CardContent>
        <p className='line-clamp-3 text-sm text-slate-600 dark:text-slate-300'>
          {project.description}
        </p>
        <div className='grid gap-3 md:grid-cols-2'>
          <div className='space-y-1'>
            <p className='text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400'>
              {t('projectStudent')}
            </p>
            <ProjectMemberSummary members={students} emptyLabel='-' maxVisible={2} tone='violet' />
          </div>
          <div className='space-y-1'>
            <p className='text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400'>
              {t('projectSupervisor')}
            </p>
            <ProjectMemberSummary
              members={supervisors}
              emptyLabel={t('projectNoSupervisor')}
              maxVisible={2}
              tone='emerald'
            />
          </div>
        </div>
        <p className='text-xs text-slate-500 dark:text-slate-400'>
          {t('projectsTableUpdated')} {formatDate(project.updatedAt)}
        </p>
      </CardContent>
    </Card>
  );
}
