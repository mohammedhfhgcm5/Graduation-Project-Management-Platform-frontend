import type { ProjectStatus } from '@/types';

import { Badge } from '@/components/ui/badge';
import { getProjectStatusLabel, useI18n } from '@/i18n';

const statusMap: Record<
  ProjectStatus,
  { variant: 'default' | 'success' | 'warning' | 'danger' }
> = {
  PENDING_APPROVAL: { variant: 'warning' },
  APPROVED: { variant: 'success' },
  IN_PROGRESS: { variant: 'default' },
  UNDER_REVIEW: { variant: 'warning' },
  COMPLETED: { variant: 'success' },
  REJECTED: { variant: 'danger' },
};

export function ProjectStatusBadge({ status }: { status: ProjectStatus }) {
  const { t } = useI18n();

  return <Badge variant={statusMap[status].variant}>{getProjectStatusLabel(status, t)}</Badge>;
}
