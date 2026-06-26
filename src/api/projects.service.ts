import { api } from '@/api/api';
import type {
  PaginatedResponse,
  Project,
  ProjectStatus,
  UserRole,
  UserSummary,
} from '@/types';

export interface ProjectsQuery {
  page?: number;
  limit?: number;
  status?: ProjectStatus;
  search?: string;
}

export interface CreateProjectPayload {
  title: string;
  description: string;
  techStack: string[];
  progress?: number;
  studentIds?: string[];
}

export interface UpdateProjectPayload {
  title?: string;
  description?: string;
  progress?: number;
}

export interface ChangeProjectStatusPayload {
  status: ProjectStatus;
}

export interface AssignSupervisorPayload {
  supervisorIds: string[];
}

type ProjectsApiResponse = unknown;
type ProjectApiResponse = Omit<Project, 'students' | 'supervisors' | 'student' | 'supervisor'> & {
  students?: unknown;
  supervisors?: unknown;
  student?: unknown;
  supervisor?: unknown;
};

function normalizeUserSummary(payload: unknown): UserSummary | null {
  if (!payload || typeof payload !== 'object') {
    return null;
  }

  const user = payload as Partial<UserSummary>;

  if (typeof user.id !== 'string' || typeof user.name !== 'string') {
    return null;
  }

  return {
    id: user.id,
    name: user.name,
    email: typeof user.email === 'string' ? user.email : '',
    role: (typeof user.role === 'string' ? user.role : 'STUDENT') as UserRole,
    department:
      typeof user.department === 'string' || user.department === null
        ? user.department
        : undefined,
    avatarUrl:
      typeof user.avatarUrl === 'string' || user.avatarUrl === null
        ? user.avatarUrl
        : undefined,
  };
}

function mergeMembers(members: unknown, legacyMember: unknown) {
  const normalizedMembers = Array.isArray(members)
    ? members
        .map((member) => normalizeUserSummary(member))
        .filter((member): member is UserSummary => Boolean(member))
    : [];
  const fallbackMember = normalizeUserSummary(legacyMember);
  const mergedMembers = fallbackMember
    ? [...normalizedMembers, fallbackMember]
    : normalizedMembers;

  return mergedMembers.filter(
    (member, index, list) =>
      list.findIndex((candidate) => candidate.id === member.id) === index,
  );
}

function normalizeProject(payload: ProjectApiResponse): Project {
  const students = mergeMembers(payload.students, payload.student);
  const supervisors = mergeMembers(payload.supervisors, payload.supervisor);

  return {
    ...payload,
    students,
    supervisors,
    student: students[0] ?? null,
    supervisor: supervisors[0] ?? null,
  };
}

function normalizeProjectsResponse(
  payload: ProjectsApiResponse,
  query: ProjectsQuery,
): PaginatedResponse<Project> {
  const fallbackPage = query.page ?? 1;
  const fallbackLimit = query.limit ?? 10;

  if (Array.isArray(payload)) {
    return {
      data: payload,
      total: payload.length,
      page: fallbackPage,
      limit: query.limit ?? (payload.length || fallbackLimit),
    };
  }

  if (!payload || typeof payload !== 'object') {
    return {
      data: [],
      total: 0,
      page: fallbackPage,
      limit: fallbackLimit,
    };
  }

  const normalizedPayload = payload as {
    data?: unknown;
    items?: unknown;
    results?: unknown;
    total?: unknown;
    page?: unknown;
    limit?: unknown;
  };

  const listCandidate =
    normalizedPayload.data ??
    normalizedPayload.items ??
    normalizedPayload.results ??
    [];
  const data = Array.isArray(listCandidate)
    ? listCandidate.map((project) =>
        normalizeProject(project as ProjectApiResponse),
      )
    : [];

  return {
    data,
    total:
      typeof normalizedPayload.total === 'number'
        ? normalizedPayload.total
        : data.length,
    page:
      typeof normalizedPayload.page === 'number'
        ? normalizedPayload.page
        : fallbackPage,
    limit:
      typeof normalizedPayload.limit === 'number'
        ? normalizedPayload.limit
        : query.limit ?? (data.length || fallbackLimit),
  };
}

export const projectsService = {
  async getProjects(query: ProjectsQuery) {
    const response = await api.get<ProjectsApiResponse>('/projects', {
      params: query,
    });
    return normalizeProjectsResponse(response.data, query);
  },

  async getProjectById(id: string) {
    const response = await api.get<ProjectApiResponse>(`/projects/${id}`);
    return normalizeProject(response.data);
  },

  async createProject(payload: CreateProjectPayload) {
    const response = await api.post<ProjectApiResponse>('/projects', payload);
    return normalizeProject(response.data);
  },

  async updateProject(id: string, payload: UpdateProjectPayload) {
    const response = await api.patch<ProjectApiResponse>(`/projects/${id}`, payload);
    return normalizeProject(response.data);
  },

  async changeStatus(id: string, payload: ChangeProjectStatusPayload) {
    const response = await api.patch<ProjectApiResponse>(`/projects/${id}/status`, payload);
    return normalizeProject(response.data);
  },

  async assignSupervisor(id: string, payload: AssignSupervisorPayload) {
    const response = await api.patch<ProjectApiResponse>(
      `/projects/${id}/supervisor`,
      payload,
    );
    return normalizeProject(response.data);
  },

  async deleteProject(id: string) {
    await api.delete(`/projects/${id}`);
  },
};
