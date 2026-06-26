import { useQuery } from '@tanstack/react-query';

import { projectsService } from '@/api/projects.service';

export function useProject(id?: string) {
  return useQuery({
    queryKey: ['project', id],
    queryFn: () => projectsService.getProjectById(id as string),
    enabled: Boolean(id),
  });
}
