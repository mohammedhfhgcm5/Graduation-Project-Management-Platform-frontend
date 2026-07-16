import { useMemo, useState, type FormEvent } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  Mail,
  Search,
  ShieldCheck,
  UserPlus,
  UserRoundCheck,
  Users,
} from 'lucide-react';

import { authService, type RegisterPayload } from '@/api/auth.service';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardIcon,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableWrapper,
} from '@/components/ui/table';
import { getRoleLabel, useI18n } from '@/i18n';
import { getApiErrorMessage } from '@/lib/errors';
import type { User, UserRole } from '@/types';
import { formatDate } from '@/utils/formatDate';

const initialValues: RegisterPayload = {
  name: '',
  email: '',
  password: '',
  role: 'STUDENT',
  department: '',
};

type RoleFilter = UserRole | 'ALL';

const darkSelectClass =
  'h-11 w-full rounded-[10px] border border-white/10 bg-white/[0.04] px-4 text-sm text-slate-100 shadow-[inset_0_1px_3px_rgba(0,0,0,0.25)] transition-all duration-200 hover:border-white/[0.18] hover:bg-white/[0.06] focus:border-violet-500 focus:bg-violet-500/[0.04] focus:outline-none focus:ring-[3px] focus:ring-violet-500/20';

function getBadgeVariant(role: UserRole) {
  switch (role) {
    case 'HEAD':
      return 'warning' as const;
    case 'SUPERVISOR':
      return 'success' as const;
    case 'STUDENT':
    default:
      return 'default' as const;
  }
}

function matchUser(user: User, searchTerm: string) {
  const normalizedSearch = searchTerm.trim().toLowerCase();

  if (!normalizedSearch) {
    return true;
  }

  return [user.name, user.email, user.department ?? '']
    .join(' ')
    .toLowerCase()
    .includes(normalizedSearch);
}

export function UserManagementSection() {
  const queryClient = useQueryClient();
  const { t } = useI18n();
  const [values, setValues] = useState<RegisterPayload>(initialValues);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<RoleFilter>('ALL');
  const [formError, setFormError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const usersQuery = useQuery({
    queryKey: ['users'],
    queryFn: () => authService.getUsers(),
  });

  const createUser = useMutation({
    mutationFn: authService.createUser,
    onSuccess: async () => {
      setValues(initialValues);
      setFormError('');
      setSuccessMessage(t('usersCreateSuccess'));
      await queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    onError: (error) => {
      setSuccessMessage('');
      setFormError(getApiErrorMessage(error, t('errorCreateUser')));
    },
  });

  const users = useMemo(() => usersQuery.data ?? [], [usersQuery.data]);

  const filteredUsers = useMemo(() => {
    return [...users]
      .filter((user) => roleFilter === 'ALL' || user.role === roleFilter)
      .filter((user) => matchUser(user, search))
      .sort((left, right) => {
        const leftTime = left.createdAt ? new Date(left.createdAt).getTime() : 0;
        const rightTime = right.createdAt ? new Date(right.createdAt).getTime() : 0;
        return rightTime - leftTime;
      });
  }, [roleFilter, search, users]);

  const roleCounts = useMemo(
    () => ({
      STUDENT: users.filter((user) => user.role === 'STUDENT').length,
      SUPERVISOR: users.filter((user) => user.role === 'SUPERVISOR').length,
      HEAD: users.filter((user) => user.role === 'HEAD').length,
    }),
    [users],
  );

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError('');
    setSuccessMessage('');

    createUser.mutate({
      ...values,
      name: values.name.trim(),
      email: values.email.trim(),
      password: values.password,
      department: values.department?.trim() || undefined,
    });
  };

  return (
    <section id='user-management' className='space-y-5 scroll-mt-24'>
      <div>
        <p className='text-[11px] font-bold uppercase tracking-[0.16em] text-[#7b73a7] dark:text-[#938bbb]'>
          {t('usersTitle')}
        </p>
        <h2 className='mt-2 text-2xl font-black tracking-tight text-slate-950 dark:text-slate-100'>
          {t('usersTitle')}
        </h2>
        <p className='mt-2 max-w-3xl text-sm text-slate-600 dark:text-slate-400'>
          {t('usersSubtitle')}
        </p>
      </div>

      <div className='grid gap-4 xl:grid-cols-[420px,minmax(0,1fr)]'>
        <Card glow='emerald' className='border-white/[0.08] bg-[#1a1825]'>
          <CardHeader className='mb-5'>
            <CardIcon className='border-emerald-300/20 bg-gradient-to-br from-emerald-500 to-teal-500 text-white'>
              <UserPlus className='h-5 w-5' />
            </CardIcon>
            <CardTitle>{t('usersCreateTitle')}</CardTitle>
            <p className='text-sm leading-6 text-[#a9a4cb]'>
              {t('usersCreateSubtitle')}
            </p>
          </CardHeader>

          <CardContent>
            <form className='space-y-4' onSubmit={handleSubmit}>
              <div className='space-y-1.5'>
                <label className='text-sm font-medium text-slate-200' htmlFor='head-user-name'>
                  {t('authFullName')}
                </label>
                <Input
                  id='head-user-name'
                  surface='dark'
                  value={values.name}
                  onChange={(event) =>
                    setValues((current) => ({ ...current, name: event.target.value }))
                  }
                  required
                />
              </div>

              <div className='space-y-1.5'>
                <label className='text-sm font-medium text-slate-200' htmlFor='head-user-email'>
                  {t('authEmail')}
                </label>
                <Input
                  id='head-user-email'
                  type='email'
                  surface='dark'
                  leftIcon={<Mail className='h-4 w-4' />}
                  value={values.email}
                  onChange={(event) =>
                    setValues((current) => ({ ...current, email: event.target.value }))
                  }
                  required
                />
              </div>

              <div className='space-y-1.5'>
                <label className='text-sm font-medium text-slate-200' htmlFor='head-user-password'>
                  {t('authPassword')}
                </label>
                <Input
                  id='head-user-password'
                  type='password'
                  surface='dark'
                  value={values.password}
                  onChange={(event) =>
                    setValues((current) => ({
                      ...current,
                      password: event.target.value,
                    }))
                  }
                  required
                />
              </div>

              <div className='grid gap-4 md:grid-cols-2 xl:grid-cols-1'>
                <div className='space-y-1.5'>
                  <label className='text-sm font-medium text-slate-200' htmlFor='head-user-role'>
                    {t('authRole')}
                  </label>
                  <select
                    id='head-user-role'
                    className={darkSelectClass}
                    value={values.role}
                    onChange={(event) =>
                      setValues((current) => ({
                        ...current,
                        role: event.target.value as UserRole,
                      }))
                    }
                  >
                    <option value='STUDENT'>{getRoleLabel('STUDENT', t)}</option>
                    <option value='SUPERVISOR'>{getRoleLabel('SUPERVISOR', t)}</option>
                    <option value='HEAD'>{getRoleLabel('HEAD', t)}</option>
                  </select>
                </div>

                <div className='space-y-1.5'>
                  <label className='text-sm font-medium text-slate-200' htmlFor='head-user-department'>
                    {t('authDepartment')}
                  </label>
                  <Input
                    id='head-user-department'
                    surface='dark'
                    value={values.department}
                    placeholder={t('authDepartmentPlaceholder')}
                    onChange={(event) =>
                      setValues((current) => ({
                        ...current,
                        department: event.target.value,
                      }))
                    }
                  />
                </div>
              </div>

              {formError ? <p className='text-sm text-red-400'>{formError}</p> : null}
              {successMessage ? (
                <p className='text-sm text-emerald-400'>{successMessage}</p>
              ) : null}

              <Button type='submit' className='w-full' disabled={createUser.isPending}>
                {createUser.isPending ? t('authRegisterLoading') : t('usersCreateButton')}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className='space-y-4'>
          <div className='grid gap-4 md:grid-cols-2 xl:grid-cols-4'>
            <Card glow='violet' className='border-white/[0.08] bg-[#1a1825]'>
              <CardContent className='space-y-2'>
                <div className='flex items-center justify-between'>
                  <p className='text-xs font-bold uppercase tracking-[0.12em] text-[#8d87b5]'>
                    {t('usersTotalLabel')}
                  </p>
                  <Users className='h-4 w-4 text-violet-300' />
                </div>
                <p className='text-3xl font-black text-white'>{users.length}</p>
              </CardContent>
            </Card>

            <Card glow='sky' className='border-white/[0.08] bg-[#1a1825]'>
              <CardContent className='space-y-2'>
                <div className='flex items-center justify-between'>
                  <p className='text-xs font-bold uppercase tracking-[0.12em] text-[#8d87b5]'>
                    {getRoleLabel('STUDENT', t)}
                  </p>
                  <Users className='h-4 w-4 text-sky-300' />
                </div>
                <p className='text-3xl font-black text-white'>{roleCounts.STUDENT}</p>
              </CardContent>
            </Card>

            <Card glow='emerald' className='border-white/[0.08] bg-[#1a1825]'>
              <CardContent className='space-y-2'>
                <div className='flex items-center justify-between'>
                  <p className='text-xs font-bold uppercase tracking-[0.12em] text-[#8d87b5]'>
                    {getRoleLabel('SUPERVISOR', t)}
                  </p>
                  <UserRoundCheck className='h-4 w-4 text-emerald-300' />
                </div>
                <p className='text-3xl font-black text-white'>{roleCounts.SUPERVISOR}</p>
              </CardContent>
            </Card>

            <Card glow='amber' className='border-white/[0.08] bg-[#1a1825]'>
              <CardContent className='space-y-2'>
                <div className='flex items-center justify-between'>
                  <p className='text-xs font-bold uppercase tracking-[0.12em] text-[#8d87b5]'>
                    {getRoleLabel('HEAD', t)}
                  </p>
                  <ShieldCheck className='h-4 w-4 text-amber-300' />
                </div>
                <p className='text-3xl font-black text-white'>{roleCounts.HEAD}</p>
              </CardContent>
            </Card>
          </div>

          <Card glow='violet' className='border-white/[0.08] bg-[#1a1825]'>
            <CardHeader className='mb-5'>
              <CardIcon className='border-violet-400/20 bg-gradient-to-br from-violet-600 to-indigo-600 text-white'>
                <Users className='h-5 w-5' />
              </CardIcon>
              <CardTitle>{t('usersDirectoryTitle')}</CardTitle>
              <p className='text-sm leading-6 text-[#a9a4cb]'>
                {t('usersDirectorySubtitle')}
              </p>
            </CardHeader>

            <CardContent className='space-y-4'>
              <div className='grid gap-3 md:grid-cols-[minmax(0,1fr),220px,180px]'>
                <Input
                  surface='dark'
                  value={search}
                  leftIcon={<Search className='h-4 w-4' />}
                  placeholder={t('usersSearchPlaceholder')}
                  onChange={(event) => setSearch(event.target.value)}
                />

                <select
                  className={darkSelectClass}
                  value={roleFilter}
                  onChange={(event) =>
                    setRoleFilter(event.target.value as RoleFilter)
                  }
                >
                  <option value='ALL'>{t('usersAllRoles')}</option>
                  <option value='STUDENT'>{getRoleLabel('STUDENT', t)}</option>
                  <option value='SUPERVISOR'>{getRoleLabel('SUPERVISOR', t)}</option>
                  <option value='HEAD'>{getRoleLabel('HEAD', t)}</option>
                </select>

                <div className='flex items-center rounded-[10px] border border-white/10 bg-white/[0.04] px-4 text-sm font-semibold text-[#d9d4f3]'>
                  {t('usersFilteredLabel')}: {filteredUsers.length}
                </div>
              </div>

              {usersQuery.isLoading ? <LoadingSpinner /> : null}

              {usersQuery.error ? (
                <p className='text-sm text-red-400'>
                  {getApiErrorMessage(usersQuery.error, t('errorLoadUsers'))}
                </p>
              ) : null}

              {!usersQuery.isLoading && !filteredUsers.length ? (
                <p className='text-sm text-[#a9a4cb]'>{t('usersEmpty')}</p>
              ) : null}

              {filteredUsers.length ? (
                <TableWrapper>
                  <div className='overflow-x-auto'>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>{t('usersTableName')}</TableHead>
                          <TableHead>{t('usersTableEmail')}</TableHead>
                          <TableHead>{t('usersTableRole')}</TableHead>
                          <TableHead>{t('usersTableDepartment')}</TableHead>
                          <TableHead>{t('usersTableCreatedAt')}</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredUsers.map((user) => (
                          <TableRow key={user.id}>
                            <TableCell className='min-w-[180px] font-semibold text-slate-100'>
                              {user.name}
                            </TableCell>
                            <TableCell className='min-w-[220px]'>{user.email}</TableCell>
                            <TableCell>
                              <Badge variant={getBadgeVariant(user.role)}>
                                {getRoleLabel(user.role, t)}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {user.department?.trim() || t('usersUnknownDepartment')}
                            </TableCell>
                            <TableCell>
                              {user.createdAt ? formatDate(user.createdAt) : '-'}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </TableWrapper>
              ) : null}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
