import { useEffect } from 'react';
import {
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';

import {
  projectsService,
  type ChangeProjectStatusPayload,
  type CreateProjectPayload,
  type UpdateProjectPayload,
} from '@/api/projects.service';
import { useAppDispatch, useAppSelector } from '@/store/redux/hooks';
import { setProjects } from '@/store/redux/projectsSlice';
import { useAuthStore } from '@/store/zustand/authStore';

export function useProjects() {
  const dispatch = useAppDispatch();
  const { page, limit, filters } = useAppSelector((state) => state.projects);
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);

  const projectsQuery = useQuery({
    queryKey: ['projects', page, limit, filters.status, filters.search],
    queryFn: () =>
      projectsService.getProjects({
        page,
        limit,
        status: filters.status === 'ALL' ? undefined : filters.status,
        search: filters.search.trim() ? filters.search : undefined,
      }),
  });

  useEffect(() => {
    if (!projectsQuery.data) {
      return;
    }

    dispatch(
      setProjects({
        list: projectsQuery.data.data ?? [],
        total: projectsQuery.data.total ?? 0,
      }),
    );
  }, [dispatch, projectsQuery.data]);

  const createProject = useMutation({
    mutationFn: (payload: CreateProjectPayload) =>
      projectsService.createProject(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });

  const updateProject = useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateProjectPayload;
    }) => {
      if (user?.role === 'SUPERVISOR' && payload.progress !== undefined) {
        throw new Error('Supervisors cannot update project progress.');
      }

      return projectsService.updateProject(id, payload);
    },
    onSuccess: async (_, variables) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['projects'] }),
        queryClient.invalidateQueries({ queryKey: ['project', variables.id] }),
      ]);
    },
  });

  const changeProjectStatus = useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: ChangeProjectStatusPayload;
    }) => projectsService.changeStatus(id, payload),
    onSuccess: async (_, variables) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['projects'] }),
        queryClient.invalidateQueries({ queryKey: ['project', variables.id] }),
      ]);
    },
  });

  const deleteProject = useMutation({
    mutationFn: (id: string) => projectsService.deleteProject(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });

  return {
    projectsQuery,
    createProject,
    updateProject,
    changeProjectStatus,
    deleteProject,
  };
}
