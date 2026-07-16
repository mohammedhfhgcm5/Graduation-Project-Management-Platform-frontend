import { api } from '@/api/api';
import type {
  DiscussionSchedule,
  DiscussionScheduleItem,
  PaginatedResponse,
  Project,
  UserSummary,
} from '@/types';

export interface DiscussionSchedulesQuery {
  page?: number;
  limit?: number;
  academicYear?: string;
  semester?: string;
  date?: string;
}

export interface DiscussionScheduleItemPayload {
  projectId?: string;
  projectTitle?: string;
  studentNames?: string[];
  supervisorNames?: string[];
  committeeNames: string[];
  startsAt: string;
  endsAt: string;
  room?: string;
  slotOrder: number;
}

export interface CreateDiscussionSchedulePayload {
  title: string;
  academicYear: string;
  semester: string;
  discussionDate: string;
  department?: string;
  location?: string;
  chairName?: string;
  items: DiscussionScheduleItemPayload[];
}

export type UpdateDiscussionSchedulePayload = Partial<
  Omit<CreateDiscussionSchedulePayload, 'items'>
> & {
  items?: DiscussionScheduleItemPayload[];
};

type DiscussionScheduleApiResponse = unknown;
type DiscussionSchedulesApiResponse = unknown;

function normalizeStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item) => (typeof item === 'string' ? item.trim() : ''))
    .filter(Boolean);
}

function normalizeUserSummary(value: unknown): UserSummary | null {
  if (!value || typeof value !== 'object') {
    return null;
  }

  const user = value as Partial<UserSummary>;

  if (typeof user.id !== 'string' || typeof user.name !== 'string') {
    return null;
  }

  return {
    id: user.id,
    name: user.name,
    email: typeof user.email === 'string' ? user.email : '',
    role: user.role ?? 'STUDENT',
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

function normalizeScheduleItem(
  payload: unknown,
  index: number,
): DiscussionScheduleItem {
  const item =
    payload && typeof payload === 'object'
      ? (payload as Partial<DiscussionScheduleItem>)
      : {};

  return {
    id: typeof item.id === 'string' ? item.id : `item-${index + 1}`,
    projectId:
      typeof item.projectId === 'string' || item.projectId === null
        ? item.projectId
        : undefined,
    project:
      item.project && typeof item.project === 'object'
        ? (item.project as Project)
        : null,
    projectTitle: typeof item.projectTitle === 'string' ? item.projectTitle : '',
    studentNames: normalizeStringArray(item.studentNames),
    supervisorNames: normalizeStringArray(item.supervisorNames),
    committeeNames: normalizeStringArray(item.committeeNames),
    startsAt: typeof item.startsAt === 'string' ? item.startsAt : '',
    endsAt: typeof item.endsAt === 'string' ? item.endsAt : '',
    room:
      typeof item.room === 'string' || item.room === null
        ? item.room
        : undefined,
    slotOrder: typeof item.slotOrder === 'number' ? item.slotOrder : index + 1,
    createdAt: typeof item.createdAt === 'string' ? item.createdAt : undefined,
    updatedAt: typeof item.updatedAt === 'string' ? item.updatedAt : undefined,
  };
}

function normalizeSchedule(
  payload: DiscussionScheduleApiResponse,
): DiscussionSchedule {
  const schedule =
    payload && typeof payload === 'object'
      ? (payload as Partial<DiscussionSchedule>)
      : {};
  const rawItems = Array.isArray(schedule.items) ? schedule.items : [];

  return {
    id: typeof schedule.id === 'string' ? schedule.id : '',
    title: typeof schedule.title === 'string' ? schedule.title : '',
    academicYear:
      typeof schedule.academicYear === 'string' ? schedule.academicYear : '',
    semester: typeof schedule.semester === 'string' ? schedule.semester : '',
    discussionDate:
      typeof schedule.discussionDate === 'string' ? schedule.discussionDate : '',
    department:
      typeof schedule.department === 'string' || schedule.department === null
        ? schedule.department
        : undefined,
    location:
      typeof schedule.location === 'string' || schedule.location === null
        ? schedule.location
        : undefined,
    chairName:
      typeof schedule.chairName === 'string' || schedule.chairName === null
        ? schedule.chairName
        : undefined,
    createdBy: normalizeUserSummary(schedule.createdBy),
    items: rawItems
      .map((item, index) => normalizeScheduleItem(item, index))
      .sort((left, right) => left.slotOrder - right.slotOrder),
    createdAt: typeof schedule.createdAt === 'string' ? schedule.createdAt : undefined,
    updatedAt: typeof schedule.updatedAt === 'string' ? schedule.updatedAt : undefined,
  };
}

function normalizeSchedulesResponse(
  payload: DiscussionSchedulesApiResponse,
  query: DiscussionSchedulesQuery,
): PaginatedResponse<DiscussionSchedule> {
  const fallbackPage = query.page ?? 1;
  const fallbackLimit = query.limit ?? 10;

  if (Array.isArray(payload)) {
    const data = payload.map((schedule) => normalizeSchedule(schedule));

    return {
      data,
      total: data.length,
      page: fallbackPage,
      limit: query.limit ?? (data.length || fallbackLimit),
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
    ? listCandidate.map((schedule) => normalizeSchedule(schedule))
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

export const discussionSchedulesService = {
  async getSchedules(query: DiscussionSchedulesQuery = {}) {
    const response = await api.get<DiscussionSchedulesApiResponse>(
      '/discussion-schedules',
      {
        params: query,
      },
    );

    return normalizeSchedulesResponse(response.data, query);
  },

  async getScheduleById(id: string) {
    const response = await api.get<DiscussionScheduleApiResponse>(
      `/discussion-schedules/${id}`,
    );

    return normalizeSchedule(response.data);
  },

  async createSchedule(payload: CreateDiscussionSchedulePayload) {
    const response = await api.post<DiscussionScheduleApiResponse>(
      '/discussion-schedules',
      payload,
    );

    return normalizeSchedule(response.data);
  },

  async updateSchedule(id: string, payload: UpdateDiscussionSchedulePayload) {
    const response = await api.patch<DiscussionScheduleApiResponse>(
      `/discussion-schedules/${id}`,
      payload,
    );

    return normalizeSchedule(response.data);
  },

  async deleteSchedule(id: string) {
    await api.delete(`/discussion-schedules/${id}`);
  },

  async downloadPdf(id: string) {
    const response = await api.get<Blob>(`/discussion-schedules/${id}/pdf`, {
      responseType: 'blob',
    });

    return response.data;
  },
};
