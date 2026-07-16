import {
  useMemo,
  useState,
  type FormEvent,
  type ReactNode,
  type SelectHTMLAttributes,
} from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  ArrowDown,
  ArrowUp,
  CalendarDays,
  Download,
  FileText,
  Plus,
  Trash2,
} from 'lucide-react';

import {
  type CreateDiscussionSchedulePayload,
  type DiscussionScheduleItemPayload,
  type DiscussionSchedulesQuery,
} from '@/api/discussionSchedules.service';
import { projectsService } from '@/api/projects.service';
import { EmptyState } from '@/components/common/EmptyState';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useDiscussionSchedules } from '@/hooks/useDiscussionSchedules';
import { useI18n } from '@/i18n';
import { getApiErrorMessage } from '@/lib/errors';
import { useAuthStore } from '@/store/zustand/authStore';
import type { DiscussionSchedule, Project } from '@/types';
import { cn } from '@/utils/cn';
import { getProjectStudents, getProjectSupervisors } from '@/utils/projectMembers';

type RowSource = 'project' | 'manual';

interface ScheduleRowForm {
  key: string;
  source: RowSource;
  projectId: string;
  projectTitle: string;
  studentNames: string;
  supervisorNames: string;
  committeeNames: string;
  startsAt: string;
  endsAt: string;
  room: string;
}

interface ScheduleFormState {
  title: string;
  academicYear: string;
  semester: string;
  discussionDate: string;
  department: string;
  location: string;
  chairName: string;
  rows: ScheduleRowForm[];
}

const copy = {
  en: {
    title: 'Discussion schedules',
    subtitle:
      'Create a discussion table from existing projects and export it as PDF.',
    newSchedule: 'New schedule',
    listTitle: 'Saved schedules',
    titleLabel: 'Schedule title',
    titlePlaceholder: 'Graduation Project Committees 2025-2026 - First Semester',
    academicYear: 'Academic year',
    academicYearPlaceholder: '2025-2026',
    semester: 'Semester',
    semesterPlaceholder: 'First semester',
    discussionDate: 'Discussion date',
    department: 'Department',
    departmentPlaceholder: 'Communications and Informatics Department',
    location: 'Location',
    locationPlaceholder: 'Discussion hall',
    chairName: 'Chair name',
    chairNamePlaceholder: 'Dr. Hanadi Jadia',
    rows: 'Rows',
    addRow: 'Add row',
    removeRow: 'Remove row',
    moveUp: 'Move up',
    moveDown: 'Move down',
    source: 'Source',
    projectRow: 'From project',
    manualRow: 'Manual row',
    project: 'Project',
    selectProject: 'Select a project',
    projectPreview: 'Project snapshot',
    students: 'Students',
    supervisors: 'Supervisors',
    manualProjectTitle: 'Project title',
    manualProjectTitlePlaceholder: 'Financial transfer company app',
    manualStudents: 'Student names',
    manualStudentsPlaceholder: 'Separate names with commas',
    manualSupervisors: 'Supervisor names',
    committee: 'Committee names',
    committeePlaceholder: 'Dr. Hanadi Jadia, Dr. Iyad Hilali',
    startsAt: 'Starts at',
    endsAt: 'Ends at',
    room: 'Room',
    roomPlaceholder: 'Room 1',
    create: 'Create schedule',
    creating: 'Creating...',
    created: 'Schedule created.',
    filterAcademicYear: 'Filter academic year',
    filterSemester: 'Filter semester',
    filterDate: 'Filter date',
    clearFilters: 'Clear filters',
    emptyTitle: 'No discussion schedules yet',
    emptyDescription: 'Create the first schedule when the discussion day is ready.',
    pdf: 'PDF',
    delete: 'Delete',
    confirmDelete: 'Delete this discussion schedule?',
    loadingProjects: 'Loading projects...',
    noProjectSelected: 'Choose a project to preview its students and supervisors.',
    noNames: 'No names available',
    itemCount: '{{count}} rows',
    scheduleMeta: '{{academicYear}} - {{semester}}',
    manualHelp:
      'Manual rows are only for projects that are not already in the platform.',
    projectHelp:
      'When a project is selected, students and supervisors are sent from the backend snapshot.',
    requiredProject: 'Choose a project for every project row.',
    requiredManual:
      'Manual rows need a title, at least one student, and at least one supervisor.',
    requiredCommon: 'Fill the schedule title, academic year, semester, date, committee, and time fields.',
    invalidTime: 'Every row must end after it starts.',
    saveError: 'Could not save the schedule.',
    loadError: 'Could not load discussion schedules.',
    pdfError: 'Could not download the PDF.',
    deleteError: 'Could not delete the schedule.',
  },
  ar: {
    title: 'جداول المناقشات',
    subtitle: 'أنشئ جدول المناقشات من المشاريع الموجودة وصدّره كملف PDF.',
    newSchedule: 'جدول جديد',
    listTitle: 'الجداول المحفوظة',
    titleLabel: 'عنوان الجدول',
    titlePlaceholder: 'لجان مشاريع التخرج 2025-2026 - فصل أول',
    academicYear: 'السنة الدراسية',
    academicYearPlaceholder: '2025-2026',
    semester: 'الفصل',
    semesterPlaceholder: 'فصل أول',
    discussionDate: 'تاريخ المناقشة',
    department: 'القسم',
    departmentPlaceholder: 'قسم الاتصالات والمعلوماتية',
    location: 'المكان',
    locationPlaceholder: 'قاعة المناقشات',
    chairName: 'رئيس اللجنة',
    chairNamePlaceholder: 'د. هنادي جاديا',
    rows: 'الصفوف',
    addRow: 'إضافة صف',
    removeRow: 'حذف الصف',
    moveUp: 'تحريك للأعلى',
    moveDown: 'تحريك للأسفل',
    source: 'المصدر',
    projectRow: 'من مشروع',
    manualRow: 'صف يدوي',
    project: 'المشروع',
    selectProject: 'اختر مشروعاً',
    projectPreview: 'بيانات المشروع',
    students: 'الطلبة',
    supervisors: 'المشرفون',
    manualProjectTitle: 'عنوان المشروع',
    manualProjectTitlePlaceholder: 'تطبيق شركة حوالات مالية',
    manualStudents: 'أسماء الطلبة',
    manualStudentsPlaceholder: 'افصل الأسماء بفواصل',
    manualSupervisors: 'أسماء المشرفين',
    committee: 'أسماء لجنة المناقشة',
    committeePlaceholder: 'د. هنادي جاديا، د. إياد هلالي',
    startsAt: 'وقت البداية',
    endsAt: 'وقت النهاية',
    room: 'القاعة',
    roomPlaceholder: 'قاعة 1',
    create: 'إنشاء الجدول',
    creating: 'جارٍ الإنشاء...',
    created: 'تم إنشاء الجدول.',
    filterAcademicYear: 'تصفية السنة الدراسية',
    filterSemester: 'تصفية الفصل',
    filterDate: 'تصفية التاريخ',
    clearFilters: 'مسح الفلاتر',
    emptyTitle: 'لا توجد جداول مناقشة بعد',
    emptyDescription: 'أنشئ أول جدول عندما يصبح يوم المناقشات جاهزاً.',
    pdf: 'PDF',
    delete: 'حذف',
    confirmDelete: 'هل تريد حذف جدول المناقشة هذا؟',
    loadingProjects: 'جارٍ تحميل المشاريع...',
    noProjectSelected: 'اختر مشروعاً لعرض الطلبة والمشرفين.',
    noNames: 'لا توجد أسماء',
    itemCount: '{{count}} صفوف',
    scheduleMeta: '{{academicYear}} - {{semester}}',
    manualHelp: 'استخدم الصف اليدوي فقط للمشاريع غير الموجودة في المنصة.',
    projectHelp:
      'عند اختيار مشروع، يأخذ الخادم أسماء الطلبة والمشرفين من بيانات المشروع.',
    requiredProject: 'اختر مشروعاً لكل صف مرتبط بمشروع.',
    requiredManual:
      'الصف اليدوي يحتاج عنوان مشروع واسم طالب واحد ومشرف واحد على الأقل.',
    requiredCommon:
      'أكمل عنوان الجدول والسنة والفصل والتاريخ واللجنة وأوقات الصفوف.',
    invalidTime: 'يجب أن يكون وقت نهاية كل صف بعد وقت بدايته.',
    saveError: 'تعذر حفظ الجدول.',
    loadError: 'تعذر تحميل جداول المناقشة.',
    pdfError: 'تعذر تنزيل ملف PDF.',
    deleteError: 'تعذر حذف الجدول.',
  },
} as const;

type PageLabels = (typeof copy)[keyof typeof copy];

const inputClassName =
  'dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-100';
const selectClassName = [
  'h-11 w-full rounded-[10px] border border-slate-300 bg-white px-3 text-sm text-slate-900',
  'shadow-[inset_0_1px_2px_rgba(15,23,42,0.04)] transition-all duration-200',
  'hover:border-slate-400 focus:border-violet-500 focus:outline-none focus:ring-[3px] focus:ring-violet-500/20',
  'dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-100 dark:hover:border-white/[0.18]',
].join(' ');
const emptyProjects: Project[] = [];

function createRow(): ScheduleRowForm {
  const key =
    typeof crypto !== 'undefined' && 'randomUUID' in crypto
      ? crypto.randomUUID()
      : `row-${Date.now()}-${Math.random().toString(16).slice(2)}`;

  return {
    key,
    source: 'project',
    projectId: '',
    projectTitle: '',
    studentNames: '',
    supervisorNames: '',
    committeeNames: '',
    startsAt: '',
    endsAt: '',
    room: '',
  };
}

function getLocalDateInputValue(date = new Date()) {
  const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60_000);
  return localDate.toISOString().slice(0, 10);
}

function createInitialForm(): ScheduleFormState {
  return {
    title: '',
    academicYear: '',
    semester: '',
    discussionDate: getLocalDateInputValue(),
    department: '',
    location: '',
    chairName: '',
    rows: [createRow()],
  };
}

function splitNames(value: string) {
  return value
    .split(/[\n,،]+/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function toIsoDateOnly(value: string) {
  return `${value}T00:00:00.000Z`;
}

function toIsoDateTime(value: string) {
  return new Date(value).toISOString();
}

function replaceTemplate(
  template: string,
  values: Record<string, string | number>,
) {
  return Object.entries(values).reduce(
    (message, [key, value]) => message.replaceAll(`{{${key}}}`, String(value)),
    template,
  );
}

function formatDateOnly(value: string, locale: 'en' | 'ar') {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return '-';
  }

  return new Intl.DateTimeFormat(locale === 'ar' ? 'ar-JO' : 'en-US', {
    dateStyle: 'medium',
  }).format(date);
}

function formatTime(value: string, locale: 'en' | 'ar') {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return '-';
  }

  return new Intl.DateTimeFormat(locale === 'ar' ? 'ar-JO' : 'en-US', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

function namesOrEmpty(names: string[], emptyLabel: string) {
  return names.length ? names.join(', ') : emptyLabel;
}

function projectNames(
  project: Project | undefined,
  type: 'students' | 'supervisors',
  emptyLabel: string,
) {
  if (!project) {
    return emptyLabel;
  }

  const members =
    type === 'students'
      ? getProjectStudents(project)
      : getProjectSupervisors(project);

  return namesOrEmpty(
    members.map((member) => member.name),
    emptyLabel,
  );
}

function getProjectMemberNames(
  project: Project,
  type: 'students' | 'supervisors',
) {
  const members =
    type === 'students'
      ? getProjectStudents(project)
      : getProjectSupervisors(project);

  return members.map((member) => member.name.trim()).filter(Boolean);
}

function savePdfBlob(blob: Blob, scheduleId: string) {
  const url = URL.createObjectURL(
    blob.type ? blob : new Blob([blob], { type: 'application/pdf' }),
  );
  const link = document.createElement('a');
  link.href = url;
  link.download = `discussion-schedule-${scheduleId}.pdf`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function Field({
  label,
  children,
  help,
}: {
  label: string;
  children: ReactNode;
  help?: string;
}) {
  return (
    <label className='block space-y-2'>
      <span className='text-xs font-bold uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400'>
        {label}
      </span>
      {children}
      {help ? (
        <span className='block text-xs leading-5 text-slate-500 dark:text-slate-400'>
          {help}
        </span>
      ) : null}
    </label>
  );
}

function SelectField({
  children,
  className,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select className={cn(selectClassName, className)} {...props}>
      {children}
    </select>
  );
}

function ProjectSnapshot({
  project,
  labels,
}: {
  project: Project | undefined;
  labels: PageLabels;
}) {
  return (
    <div className='rounded-xl border border-slate-200/80 bg-slate-50/80 p-3 dark:border-white/10 dark:bg-white/[0.03]'>
      <p className='text-xs font-bold uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400'>
        {labels.projectPreview}
      </p>
      {project ? (
        <div className='mt-2 space-y-1 text-sm'>
          <p className='font-semibold text-slate-900 dark:text-slate-100'>
            {project.title}
          </p>
          <p className='text-slate-600 dark:text-slate-300'>
            <span className='font-semibold'>{labels.students}:</span>{' '}
            {projectNames(project, 'students', labels.noNames)}
          </p>
          <p className='text-slate-600 dark:text-slate-300'>
            <span className='font-semibold'>{labels.supervisors}:</span>{' '}
            {projectNames(project, 'supervisors', labels.noNames)}
          </p>
        </div>
      ) : (
        <p className='mt-2 text-sm text-slate-500 dark:text-slate-400'>
          {labels.noProjectSelected}
        </p>
      )}
    </div>
  );
}

function ScheduleRowsPreview({
  schedule,
  labels,
  locale,
}: {
  schedule: DiscussionSchedule;
  labels: PageLabels;
  locale: 'en' | 'ar';
}) {
  if (!schedule.items.length) {
    return null;
  }

  return (
    <div className='mt-3 space-y-2'>
      {schedule.items.slice(0, 3).map((item) => (
        <div
          key={item.id}
          className='rounded-xl border border-slate-200/70 bg-slate-50/70 px-3 py-2 text-xs dark:border-white/10 dark:bg-white/[0.03]'
        >
          <div className='flex flex-wrap items-center justify-between gap-2'>
            <span className='font-semibold text-slate-800 dark:text-slate-100'>
              {item.slotOrder}. {item.projectTitle || item.project?.title || '-'}
            </span>
            <span className='text-slate-500 dark:text-slate-400'>
              {formatTime(item.startsAt, locale)} - {formatTime(item.endsAt, locale)}
            </span>
          </div>
          <p className='mt-1 text-slate-500 dark:text-slate-400'>
            {labels.students}: {namesOrEmpty(item.studentNames, labels.noNames)}
          </p>
        </div>
      ))}
    </div>
  );
}

export function DiscussionSchedulesPage() {
  const user = useAuthStore((state) => state.user);
  const { locale, isRtl } = useI18n();
  const labels = copy[locale];
  const canManage = user?.role === 'SUPERVISOR' || user?.role === 'HEAD';
  const [form, setForm] = useState<ScheduleFormState>(createInitialForm);
  const [filters, setFilters] = useState({
    academicYear: '',
    semester: '',
    date: '',
  });
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  const [actionError, setActionError] = useState('');
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const scheduleQuery: DiscussionSchedulesQuery = useMemo(
    () => ({
      page: 1,
      limit: 30,
      academicYear: filters.academicYear.trim() || undefined,
      semester: filters.semester.trim() || undefined,
      date: filters.date || undefined,
    }),
    [filters],
  );
  const {
    schedulesQuery,
    createSchedule,
    deleteSchedule,
    downloadPdf,
  } = useDiscussionSchedules(scheduleQuery);

  const projectsQuery = useQuery({
    queryKey: ['projects', 'discussion-schedule-picker'],
    queryFn: () =>
      projectsService.getProjects({
        page: 1,
        limit: 100,
      }),
  });
  const projectOptions = projectsQuery.data?.data ?? emptyProjects;
  const projectById = useMemo(
    () => new Map(projectOptions.map((project) => [project.id, project])),
    [projectOptions],
  );

  const schedules = schedulesQuery.data?.data ?? [];

  function updateFormField<K extends keyof Omit<ScheduleFormState, 'rows'>>(
    field: K,
    value: ScheduleFormState[K],
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function updateRow(key: string, changes: Partial<ScheduleRowForm>) {
    setForm((current) => ({
      ...current,
      rows: current.rows.map((row) =>
        row.key === key ? { ...row, ...changes } : row,
      ),
    }));
  }

  function addRow() {
    setForm((current) => ({
      ...current,
      rows: [...current.rows, createRow()],
    }));
  }

  function removeRow(key: string) {
    setForm((current) => ({
      ...current,
      rows:
        current.rows.length > 1
          ? current.rows.filter((row) => row.key !== key)
          : current.rows,
    }));
  }

  function moveRow(index: number, direction: -1 | 1) {
    setForm((current) => {
      const nextIndex = index + direction;

      if (nextIndex < 0 || nextIndex >= current.rows.length) {
        return current;
      }

      const rows = [...current.rows];
      const [row] = rows.splice(index, 1);
      rows.splice(nextIndex, 0, row);

      return {
        ...current,
        rows,
      };
    });
  }

  function buildPayload(): CreateDiscussionSchedulePayload | null {
    const rows: DiscussionScheduleItemPayload[] = [];
    const hasMissingHeader =
      !form.title.trim() ||
      !form.academicYear.trim() ||
      !form.semester.trim() ||
      !form.discussionDate;

    if (hasMissingHeader) {
      setFormError(labels.requiredCommon);
      return null;
    }

    for (const [index, row] of form.rows.entries()) {
      const committeeNames = splitNames(row.committeeNames);
      const hasMissingCommon =
        !committeeNames.length || !row.startsAt || !row.endsAt;

      if (hasMissingCommon) {
        setFormError(labels.requiredCommon);
        return null;
      }

      if (new Date(row.endsAt).getTime() <= new Date(row.startsAt).getTime()) {
        setFormError(labels.invalidTime);
        return null;
      }

      const baseRow = {
        committeeNames,
        startsAt: toIsoDateTime(row.startsAt),
        endsAt: toIsoDateTime(row.endsAt),
        room: row.room.trim() || undefined,
        slotOrder: index + 1,
      };

      if (row.source === 'project') {
        const selectedProject = projectById.get(row.projectId);

        if (!selectedProject) {
          setFormError(labels.requiredProject);
          return null;
        }

        const studentNames = getProjectMemberNames(selectedProject, 'students');
        const supervisorNames = getProjectMemberNames(
          selectedProject,
          'supervisors',
        );

        rows.push({
          ...baseRow,
          projectId: row.projectId,
          projectTitle: selectedProject.title,
          studentNames,
          supervisorNames,
        });
        continue;
      }

      const studentNames = splitNames(row.studentNames);
      const supervisorNames = splitNames(row.supervisorNames);

      if (!row.projectTitle.trim() || !studentNames.length || !supervisorNames.length) {
        setFormError(labels.requiredManual);
        return null;
      }

      rows.push({
        ...baseRow,
        projectTitle: row.projectTitle.trim(),
        studentNames,
        supervisorNames,
      });
    }

    return {
      title: form.title.trim(),
      academicYear: form.academicYear.trim(),
      semester: form.semester.trim(),
      discussionDate: toIsoDateOnly(form.discussionDate),
      department: form.department.trim() || undefined,
      location: form.location.trim() || undefined,
      chairName: form.chairName.trim() || undefined,
      items: rows,
    };
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError('');
    setFormSuccess('');
    const payload = buildPayload();

    if (!payload) {
      return;
    }

    try {
      await createSchedule.mutateAsync(payload);
      setForm(createInitialForm());
      setFormSuccess(labels.created);
    } catch (error) {
      setFormError(getApiErrorMessage(error, labels.saveError));
    }
  }

  async function handleDownload(scheduleId: string) {
    setActionError('');
    setDownloadingId(scheduleId);

    try {
      const blob = await downloadPdf.mutateAsync(scheduleId);
      savePdfBlob(blob, scheduleId);
    } catch (error) {
      setActionError(getApiErrorMessage(error, labels.pdfError));
    } finally {
      setDownloadingId(null);
    }
  }

  async function handleDelete(scheduleId: string) {
    if (!window.confirm(labels.confirmDelete)) {
      return;
    }

    setActionError('');

    try {
      await deleteSchedule.mutateAsync(scheduleId);
    } catch (error) {
      setActionError(getApiErrorMessage(error, labels.deleteError));
    }
  }

  return (
    <section className='space-y-5'>
      <div className='flex flex-wrap items-center justify-between gap-3'>
        <div>
          <p className='text-[11px] font-bold uppercase tracking-[0.16em] text-[#7b73a7] dark:text-[#938bbb]'>
            {labels.newSchedule}
          </p>
          <h1 className='mt-2 text-2xl font-black tracking-tight text-slate-950 dark:text-slate-100'>
            {labels.title}
          </h1>
          <p className='mt-1 max-w-2xl text-sm text-slate-500 dark:text-slate-400'>
            {labels.subtitle}
          </p>
        </div>
        <div className='inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-50 px-3 py-1.5 text-xs font-bold text-violet-700 dark:border-violet-400/20 dark:bg-violet-500/10 dark:text-violet-200'>
          <CalendarDays className='h-4 w-4' />
          {labels.projectRow}
        </div>
      </div>

      {canManage ? (
        <form
          onSubmit={handleSubmit}
          className='space-y-5 rounded-2xl border border-slate-200/80 bg-white/85 p-4 shadow-[0_18px_45px_rgba(15,23,42,0.08)] backdrop-blur-sm dark:border-white/10 dark:bg-slate-950/45 md:p-5'
        >
          <div className='grid gap-4 md:grid-cols-2 xl:grid-cols-4'>
            <Field label={labels.titleLabel}>
              <Input
                value={form.title}
                onChange={(event) => updateFormField('title', event.target.value)}
                placeholder={labels.titlePlaceholder}
                className={inputClassName}
              />
            </Field>
            <Field label={labels.academicYear}>
              <Input
                value={form.academicYear}
                onChange={(event) =>
                  updateFormField('academicYear', event.target.value)
                }
                placeholder={labels.academicYearPlaceholder}
                className={inputClassName}
              />
            </Field>
            <Field label={labels.semester}>
              <Input
                value={form.semester}
                onChange={(event) =>
                  updateFormField('semester', event.target.value)
                }
                placeholder={labels.semesterPlaceholder}
                className={inputClassName}
              />
            </Field>
            <Field label={labels.discussionDate}>
              <Input
                type='date'
                value={form.discussionDate}
                onChange={(event) =>
                  updateFormField('discussionDate', event.target.value)
                }
                className={inputClassName}
              />
            </Field>
            <Field label={labels.department}>
              <Input
                value={form.department}
                onChange={(event) =>
                  updateFormField('department', event.target.value)
                }
                placeholder={labels.departmentPlaceholder}
                className={inputClassName}
              />
            </Field>
            <Field label={labels.location}>
              <Input
                value={form.location}
                onChange={(event) =>
                  updateFormField('location', event.target.value)
                }
                placeholder={labels.locationPlaceholder}
                className={inputClassName}
              />
            </Field>
            <Field label={labels.chairName}>
              <Input
                value={form.chairName}
                onChange={(event) =>
                  updateFormField('chairName', event.target.value)
                }
                placeholder={labels.chairNamePlaceholder}
                className={inputClassName}
              />
            </Field>
          </div>

          <div className='space-y-3'>
            <div className='flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 pt-4 dark:border-white/10'>
              <div>
                <h2 className='text-lg font-bold text-slate-900 dark:text-slate-100'>
                  {labels.rows}
                </h2>
                <p className='mt-1 text-sm text-slate-500 dark:text-slate-400'>
                  {labels.projectHelp}
                </p>
              </div>
              <Button type='button' variant='outline' size='sm' onClick={addRow}>
                <Plus className='h-4 w-4' />
                {labels.addRow}
              </Button>
            </div>

            {projectsQuery.isLoading ? (
              <LoadingSpinner label={labels.loadingProjects} />
            ) : null}

            <div className='space-y-3'>
              {form.rows.map((row, index) => {
                const selectedProject = projectById.get(row.projectId);

                return (
                  <div
                    key={row.key}
                    className='rounded-2xl border border-slate-200/80 bg-slate-50/70 p-4 dark:border-white/10 dark:bg-white/[0.025]'
                  >
                    <div className='mb-4 flex flex-wrap items-center justify-between gap-3'>
                      <div className='inline-flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-slate-100'>
                        <span className='inline-flex h-7 w-7 items-center justify-center rounded-full bg-violet-100 text-xs text-violet-700 dark:bg-violet-500/15 dark:text-violet-200'>
                          {index + 1}
                        </span>
                        {row.source === 'project'
                          ? labels.projectRow
                          : labels.manualRow}
                      </div>
                      <div className='flex items-center gap-2'>
                        <Button
                          type='button'
                          variant='ghost'
                          size='sm'
                          className='h-9 w-9 px-0'
                          title={labels.moveUp}
                          aria-label={labels.moveUp}
                          disabled={index === 0}
                          onClick={() => moveRow(index, -1)}
                        >
                          <ArrowUp className='h-4 w-4' />
                        </Button>
                        <Button
                          type='button'
                          variant='ghost'
                          size='sm'
                          className='h-9 w-9 px-0'
                          title={labels.moveDown}
                          aria-label={labels.moveDown}
                          disabled={index === form.rows.length - 1}
                          onClick={() => moveRow(index, 1)}
                        >
                          <ArrowDown className='h-4 w-4' />
                        </Button>
                        <Button
                          type='button'
                          variant='danger'
                          size='sm'
                          className='h-9 w-9 px-0'
                          title={labels.removeRow}
                          aria-label={labels.removeRow}
                          disabled={form.rows.length === 1}
                          onClick={() => removeRow(row.key)}
                        >
                          <Trash2 className='h-4 w-4' />
                        </Button>
                      </div>
                    </div>

                    <div className='grid gap-4 lg:grid-cols-3'>
                      <Field label={labels.source}>
                        <SelectField
                          value={row.source}
                          onChange={(event) => {
                            const source = event.target.value as RowSource;
                            updateRow(row.key, {
                              source,
                              projectId: source === 'manual' ? '' : row.projectId,
                            });
                          }}
                        >
                          <option value='project'>{labels.projectRow}</option>
                          <option value='manual'>{labels.manualRow}</option>
                        </SelectField>
                      </Field>

                      {row.source === 'project' ? (
                        <>
                          <Field label={labels.project} help={labels.projectHelp}>
                            <SelectField
                              value={row.projectId}
                              onChange={(event) =>
                                updateRow(row.key, {
                                  projectId: event.target.value,
                                })
                              }
                            >
                              <option value=''>{labels.selectProject}</option>
                              {projectOptions.map((project) => (
                                <option key={project.id} value={project.id}>
                                  {project.title}
                                </option>
                              ))}
                            </SelectField>
                          </Field>
                          <ProjectSnapshot
                            project={selectedProject}
                            labels={labels}
                          />
                        </>
                      ) : (
                        <>
                          <Field
                            label={labels.manualProjectTitle}
                            help={labels.manualHelp}
                          >
                            <Input
                              value={row.projectTitle}
                              onChange={(event) =>
                                updateRow(row.key, {
                                  projectTitle: event.target.value,
                                })
                              }
                              placeholder={labels.manualProjectTitlePlaceholder}
                              className={inputClassName}
                            />
                          </Field>
                          <Field label={labels.manualStudents}>
                            <Input
                              value={row.studentNames}
                              onChange={(event) =>
                                updateRow(row.key, {
                                  studentNames: event.target.value,
                                })
                              }
                              placeholder={labels.manualStudentsPlaceholder}
                              className={inputClassName}
                            />
                          </Field>
                          <Field label={labels.manualSupervisors}>
                            <Input
                              value={row.supervisorNames}
                              onChange={(event) =>
                                updateRow(row.key, {
                                  supervisorNames: event.target.value,
                                })
                              }
                              placeholder={labels.manualStudentsPlaceholder}
                              className={inputClassName}
                            />
                          </Field>
                        </>
                      )}

                      <Field label={labels.committee}>
                        <Input
                          value={row.committeeNames}
                          onChange={(event) =>
                            updateRow(row.key, {
                              committeeNames: event.target.value,
                            })
                          }
                          placeholder={labels.committeePlaceholder}
                          className={inputClassName}
                        />
                      </Field>
                      <Field label={labels.startsAt}>
                        <Input
                          type='datetime-local'
                          value={row.startsAt}
                          onChange={(event) =>
                            updateRow(row.key, {
                              startsAt: event.target.value,
                            })
                          }
                          className={inputClassName}
                        />
                      </Field>
                      <Field label={labels.endsAt}>
                        <Input
                          type='datetime-local'
                          value={row.endsAt}
                          onChange={(event) =>
                            updateRow(row.key, {
                              endsAt: event.target.value,
                            })
                          }
                          className={inputClassName}
                        />
                      </Field>
                      <Field label={labels.room}>
                        <Input
                          value={row.room}
                          onChange={(event) =>
                            updateRow(row.key, {
                              room: event.target.value,
                            })
                          }
                          placeholder={labels.roomPlaceholder}
                          className={inputClassName}
                        />
                      </Field>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {formError ? (
            <p className='rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm font-semibold text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-200'>
              {formError}
            </p>
          ) : null}
          {formSuccess ? (
            <p className='rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-200'>
              {formSuccess}
            </p>
          ) : null}

          <div className='flex justify-end'>
            <Button type='submit' disabled={createSchedule.isPending}>
              <FileText className='h-4 w-4' />
              {createSchedule.isPending ? labels.creating : labels.create}
            </Button>
          </div>
        </form>
      ) : null}

      <div className='space-y-4'>
        <div className='flex flex-wrap items-end justify-between gap-3'>
          <div>
            <h2 className='text-xl font-black tracking-tight text-slate-950 dark:text-slate-100'>
              {labels.listTitle}
            </h2>
            <p className='mt-1 text-sm text-slate-500 dark:text-slate-400'>
              {labels.subtitle}
            </p>
          </div>
          <div className='grid w-full gap-2 md:w-auto md:grid-cols-4'>
            <Input
              value={filters.academicYear}
              onChange={(event) =>
                setFilters((current) => ({
                  ...current,
                  academicYear: event.target.value,
                }))
              }
              placeholder={labels.filterAcademicYear}
              className={inputClassName}
            />
            <Input
              value={filters.semester}
              onChange={(event) =>
                setFilters((current) => ({
                  ...current,
                  semester: event.target.value,
                }))
              }
              placeholder={labels.filterSemester}
              className={inputClassName}
            />
            <Input
              type='date'
              value={filters.date}
              onChange={(event) =>
                setFilters((current) => ({
                  ...current,
                  date: event.target.value,
                }))
              }
              className={inputClassName}
              aria-label={labels.filterDate}
            />
            <Button
              type='button'
              variant='outline'
              onClick={() =>
                setFilters({
                  academicYear: '',
                  semester: '',
                  date: '',
                })
              }
            >
              {labels.clearFilters}
            </Button>
          </div>
        </div>

        {schedulesQuery.isLoading ? <LoadingSpinner /> : null}

        {schedulesQuery.error ? (
          <p className='rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm font-semibold text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-200'>
            {getApiErrorMessage(schedulesQuery.error, labels.loadError)}
          </p>
        ) : null}

        {actionError ? (
          <p className='rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm font-semibold text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-200'>
            {actionError}
          </p>
        ) : null}

        {!schedulesQuery.isLoading && !schedules.length ? (
          <EmptyState
            title={labels.emptyTitle}
            description={labels.emptyDescription}
          />
        ) : null}

        {schedules.length ? (
          <div className='grid gap-4 lg:grid-cols-2'>
            {schedules.map((schedule) => (
              <article
                key={schedule.id}
                className='rounded-2xl border border-slate-200/80 bg-white/85 p-4 shadow-[0_18px_45px_rgba(15,23,42,0.08)] backdrop-blur-sm dark:border-white/10 dark:bg-slate-950/45'
              >
                <div className='flex flex-wrap items-start justify-between gap-3'>
                  <div>
                    <h3 className='text-base font-bold text-slate-900 dark:text-slate-100'>
                      {schedule.title || '-'}
                    </h3>
                    <p className='mt-1 text-sm text-slate-500 dark:text-slate-400'>
                      {replaceTemplate(labels.scheduleMeta, {
                        academicYear: schedule.academicYear || '-',
                        semester: schedule.semester || '-',
                      })}
                    </p>
                  </div>
                  <div
                    className={cn(
                      'inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-600 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-300',
                      isRtl && 'flex-row-reverse',
                    )}
                  >
                    <CalendarDays className='h-4 w-4' />
                    {formatDateOnly(schedule.discussionDate, locale)}
                  </div>
                </div>

                <div className='mt-4 grid gap-2 text-sm text-slate-600 dark:text-slate-300 sm:grid-cols-2'>
                  <p>
                    <span className='font-semibold'>{labels.department}:</span>{' '}
                    {schedule.department || '-'}
                  </p>
                  <p>
                    <span className='font-semibold'>{labels.location}:</span>{' '}
                    {schedule.location || '-'}
                  </p>
                  <p>
                    <span className='font-semibold'>{labels.chairName}:</span>{' '}
                    {schedule.chairName || '-'}
                  </p>
                  <p>
                    {replaceTemplate(labels.itemCount, {
                      count: schedule.items.length,
                    })}
                  </p>
                </div>

                <ScheduleRowsPreview
                  schedule={schedule}
                  labels={labels}
                  locale={locale}
                />

                <div className='mt-4 flex flex-wrap justify-end gap-2'>
                  <Button
                    type='button'
                    variant='outline'
                    size='sm'
                    onClick={() => handleDownload(schedule.id)}
                    disabled={downloadingId === schedule.id}
                  >
                    <Download className='h-4 w-4' />
                    {labels.pdf}
                  </Button>
                  {canManage ? (
                    <Button
                      type='button'
                      variant='danger'
                      size='sm'
                      onClick={() => handleDelete(schedule.id)}
                      disabled={deleteSchedule.isPending}
                    >
                      <Trash2 className='h-4 w-4' />
                      {labels.delete}
                    </Button>
                  ) : null}
                </div>
              </article>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
