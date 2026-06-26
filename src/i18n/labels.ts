import type { TranslateFn } from '@/i18n/I18nProvider';
import type { FileType, ProjectStatus, UserRole } from '@/types';

export function getRoleLabel(role: UserRole, t: TranslateFn) {
  return t(`role_${role}`);
}

export function getProjectStatusLabel(status: ProjectStatus, t: TranslateFn) {
  return t(`status_${status}`);
}

export function getFileTypeLabel(type: FileType, t: TranslateFn) {
  return t(`fileType_${type}`);
}
