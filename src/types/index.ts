export type UserRole = 'STUDENT' | 'SUPERVISOR' | 'HEAD';

export type ProjectStatus =
  | 'PENDING_APPROVAL'
  | 'APPROVED'
  | 'IN_PROGRESS'
  | 'UNDER_REVIEW'
  | 'COMPLETED'
  | 'REJECTED';

export type FileType =
  | 'PROPOSAL'
  | 'PROGRESS_REPORT'
  | 'FINAL_REPORT'
  | 'PRESENTATION'
  | 'OTHER';

export interface UserSummary {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department?: string | null;
  avatarUrl?: string | null;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department?: string | null;
  avatarUrl?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProjectFile {
  id: string;
  projectId: string;
  type: FileType;
  url: string;
  filename: string;
  size?: number | null;
  uploadedAt: string;
}

export interface Comment {
  id: string;
  projectId: string;
  authorId: string;
  author?: User;
  content: string;
  createdAt: string;
}

export interface ProgressReport {
  id: string;
  projectId: string;
  authorId: string;
  author?: User;
  content: string;
  weekNumber: number;
  createdAt: string;
}

export interface Meeting {
  id: string;
  projectId: string;
  scheduledById: string;
  scheduledBy?: User;
  scheduledAt: string;
  location?: string | null;
  notes?: string | null;
  createdAt: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  status: ProjectStatus;
  progress: number;
  techStack: string[];
  students: UserSummary[];
  supervisors: UserSummary[];
  student?: UserSummary | null;
  supervisor?: UserSummary | null;
  files?: ProjectFile[];
  progressReports?: ProgressReport[];
  comments?: Comment[];
  meetings?: Meeting[];
  createdAt: string;
  updatedAt: string;
}

export interface DiscussionScheduleItem {
  id: string;
  projectId?: string | null;
  project?: Project | null;
  projectTitle: string;
  studentNames: string[];
  supervisorNames: string[];
  committeeNames: string[];
  startsAt: string;
  endsAt: string;
  room?: string | null;
  slotOrder: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface DiscussionSchedule {
  id: string;
  title: string;
  academicYear: string;
  semester: string;
  discussionDate: string;
  department?: string | null;
  location?: string | null;
  chairName?: string | null;
  createdBy?: UserSummary | null;
  items: DiscussionScheduleItem[];
  createdAt?: string;
  updatedAt?: string;
}

export interface AppNotification {
  id: string;
  userId: string;
  message: string;
  isRead: boolean;
  link?: string | null;
  createdAt: string;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
}
