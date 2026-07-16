import type { UserSummary } from '@/types';
import { getRoleLabel, useI18n } from '@/i18n';
import { cn } from '@/utils/cn';
import { getUserInitials } from '@/utils/projectMembers';

const toneClasses = {
  violet:
    'border-violet-200 bg-violet-50 text-violet-700 dark:border-violet-500/20 dark:bg-violet-500/10 dark:text-violet-200',
  emerald:
    'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-200',
} as const;

export function ProjectMemberSummary({
  members,
  emptyLabel,
  maxVisible = 2,
  tone = 'violet',
}: {
  members: UserSummary[];
  emptyLabel: string;
  maxVisible?: number;
  tone?: keyof typeof toneClasses;
}) {
  if (!members.length) {
    return <span className='text-sm text-slate-500 dark:text-slate-400'>{emptyLabel}</span>;
  }

  const visibleMembers = members.slice(0, maxVisible);
  const extraMembers = members.length - visibleMembers.length;

  return (
    <div className='space-y-2'>
      <div className='flex items-center'>
        <div className='flex -space-x-2 rtl:space-x-reverse'>
          {visibleMembers.map((member) => (
            <span
              key={member.id}
              className={cn(
                'inline-flex h-8 w-8 items-center justify-center rounded-full border text-[11px] font-bold shadow-sm',
                toneClasses[tone],
              )}
              title={member.name}
            >
              {getUserInitials(member.name)}
            </span>
          ))}
          {extraMembers > 0 ? (
            <span className='inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white text-[11px] font-bold text-slate-600 shadow-sm dark:border-white/10 dark:bg-white/[0.05] dark:text-slate-200'>
              +{extraMembers}
            </span>
          ) : null}
        </div>
      </div>
      <p className='text-sm font-medium text-slate-700 dark:text-slate-200'>
        {visibleMembers.map((member) => member.name).join(', ')}
        {extraMembers > 0 ? ` +${extraMembers}` : ''}
      </p>
    </div>
  );
}

export function ProjectMemberChips({
  members,
  emptyLabel,
  tone = 'violet',
}: {
  members: UserSummary[];
  emptyLabel: string;
  tone?: keyof typeof toneClasses;
}) {
  if (!members.length) {
    return <span className='text-sm text-slate-500 dark:text-slate-400'>{emptyLabel}</span>;
  }

  return (
    <div className='flex flex-wrap gap-2'>
      {members.map((member) => (
        <div
          key={member.id}
          className='inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 shadow-sm dark:border-white/10 dark:bg-white/[0.05]'
          title={member.email || member.name}
        >
          <span
            className={cn(
              'inline-flex h-7 w-7 items-center justify-center rounded-full border text-[11px] font-bold',
              toneClasses[tone],
            )}
          >
            {getUserInitials(member.name)}
          </span>
          <span className='text-xs font-semibold text-slate-700 dark:text-slate-200'>
            {member.name}
          </span>
        </div>
      ))}
    </div>
  );
}

export function ProjectMemberOption({
  member,
  selected,
  onClick,
  disabled = false,
  tone = 'violet',
}: {
  member: UserSummary;
  selected: boolean;
  onClick: () => void;
  disabled?: boolean;
  tone?: keyof typeof toneClasses;
}) {
  const { t } = useI18n();

  return (
    <button
      type='button'
      className={cn(
        'w-full rounded-2xl border p-4 text-start transition-all duration-200',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/50',
        selected
          ? 'border-violet-400/70 bg-violet-50 shadow-sm dark:border-violet-400/40 dark:bg-violet-500/10'
          : 'border-slate-200/80 bg-slate-50/80 hover:border-slate-300 hover:bg-white dark:border-white/10 dark:bg-white/[0.03] dark:hover:bg-white/[0.05]',
        disabled && !selected && 'cursor-not-allowed opacity-60',
      )}
      onClick={onClick}
      disabled={disabled}
    >
      <div className='flex items-start justify-between gap-3'>
        <div className='flex min-w-0 items-center gap-3'>
          <span
            className={cn(
              'inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border text-xs font-bold',
              toneClasses[tone],
            )}
          >
            {getUserInitials(member.name)}
          </span>

          <div className='min-w-0'>
            <p className='truncate text-sm font-semibold text-slate-900 dark:text-slate-100'>
              {member.name}
            </p>
            <p className='truncate text-xs text-slate-500 dark:text-slate-400'>
              {member.email}
            </p>
          </div>
        </div>

        <span
          className={cn(
            'mt-1 inline-flex h-3.5 w-3.5 rounded-full border transition-colors',
            selected
              ? 'border-violet-500 bg-violet-500 dark:border-violet-300 dark:bg-violet-300'
              : 'border-slate-300 bg-white dark:border-white/20 dark:bg-transparent',
          )}
        />
      </div>

      <p className='mt-3 text-xs text-slate-500 dark:text-slate-400'>
        {member.department?.trim() || getRoleLabel(member.role, t)}
      </p>
    </button>
  );
}
