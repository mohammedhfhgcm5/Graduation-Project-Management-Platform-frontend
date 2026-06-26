import type { Project, UserSummary } from '@/types';

function dedupeMembers(members: Array<UserSummary | null | undefined>) {
  const seenMemberIds = new Set<string>();

  return members.filter((member): member is UserSummary => {
    if (!member || seenMemberIds.has(member.id)) {
      return false;
    }

    seenMemberIds.add(member.id);
    return true;
  });
}

export function getProjectStudents(
  project?: Pick<Project, 'students' | 'student'> | null,
) {
  return dedupeMembers([...(project?.students ?? []), project?.student]);
}

export function getProjectSupervisors(
  project?: Pick<Project, 'supervisors' | 'supervisor'> | null,
) {
  return dedupeMembers([...(project?.supervisors ?? []), project?.supervisor]);
}

export function isProjectStudent(
  project: Pick<Project, 'students' | 'student'> | null | undefined,
  userId?: string | null,
) {
  if (!project || !userId) {
    return false;
  }

  return getProjectStudents(project).some((student) => student.id === userId);
}

export function isProjectSupervisor(
  project: Pick<Project, 'supervisors' | 'supervisor'> | null | undefined,
  userId?: string | null,
) {
  if (!project || !userId) {
    return false;
  }

  return getProjectSupervisors(project).some(
    (supervisor) => supervisor.id === userId,
  );
}

export function getUserInitials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

export function haveSameIds(left: string[], right: string[]) {
  if (left.length !== right.length) {
    return false;
  }

  const normalizedLeft = [...left].sort();
  const normalizedRight = [...right].sort();

  return normalizedLeft.every((id, index) => id === normalizedRight[index]);
}
