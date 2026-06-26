import { useState, type FormEvent } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

import { authService, type RegisterPayload } from '@/api/auth.service';
import { useTheme } from '@/context/ThemeContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { getRoleLabel, useI18n } from '@/i18n';
import { getApiErrorMessage } from '@/lib/errors';
import { useAuthStore } from '@/store/zustand/authStore';
import { roleRedirect } from '@/utils/roleRedirect';

const initialValues: RegisterPayload = {
  name: '',
  email: '',
  password: '',
  role: 'STUDENT',
  department: '',
};

export function RegisterForm() {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const { t } = useI18n();
  const { theme } = useTheme();
  const [values, setValues] = useState<RegisterPayload>(initialValues);
  const [error, setError] = useState('');

  const mutation = useMutation({
    mutationFn: authService.register,
    onSuccess: (data) => {
      login(data.user, data.accessToken);
      navigate(roleRedirect(data.user.role), { replace: true });
    },
    onError: (mutationError) => {
      setError(getApiErrorMessage(mutationError, t('authRegisterError')));
    },
  });

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    mutation.mutate({
      ...values,
      department: values.department?.trim() || undefined,
    });
  };

  return (
    <form className='space-y-4' onSubmit={handleSubmit}>
      <div className='space-y-1'>
        <label className='text-sm font-medium text-slate-700 dark:text-slate-200' htmlFor='register-name'>
          {t('authFullName')}
        </label>
        <Input
          id='register-name'
          surface={theme === 'dark' ? 'dark' : 'light'}
          value={values.name}
          onChange={(event) =>
            setValues((current) => ({ ...current, name: event.target.value }))
          }
          required
        />
      </div>

      <div className='space-y-1'>
        <label className='text-sm font-medium text-slate-700 dark:text-slate-200' htmlFor='register-email'>
          {t('authEmail')}
        </label>
        <Input
          id='register-email'
          type='email'
          surface={theme === 'dark' ? 'dark' : 'light'}
          value={values.email}
          onChange={(event) =>
            setValues((current) => ({ ...current, email: event.target.value }))
          }
          required
        />
      </div>

      <div className='space-y-1'>
        <label
          className='text-sm font-medium text-slate-700 dark:text-slate-200'
          htmlFor='register-password'
        >
          {t('authPassword')}
        </label>
        <Input
          id='register-password'
          type='password'
          surface={theme === 'dark' ? 'dark' : 'light'}
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

      <div className='space-y-1'>
        <label className='text-sm font-medium text-slate-700 dark:text-slate-200' htmlFor='register-role'>
          {t('authRole')}
        </label>
        <select
          id='register-role'
          className='h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-100'
          value={values.role}
          onChange={(event) =>
            setValues((current) => ({
              ...current,
              role: event.target.value as RegisterPayload['role'],
            }))
          }
        >
          <option value='STUDENT'>{getRoleLabel('STUDENT', t)}</option>
          <option value='SUPERVISOR'>{getRoleLabel('SUPERVISOR', t)}</option>
          <option value='HEAD'>{getRoleLabel('HEAD', t)}</option>
        </select>
      </div>

      <div className='space-y-1'>
        <label
          className='text-sm font-medium text-slate-700 dark:text-slate-200'
          htmlFor='register-department'
        >
          {t('authDepartment')}
        </label>
        <Input
          id='register-department'
          surface={theme === 'dark' ? 'dark' : 'light'}
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

      {error ? <p className='text-sm text-red-600'>{error}</p> : null}

      <Button type='submit' className='w-full' disabled={mutation.isPending}>
        {mutation.isPending ? t('authRegisterLoading') : t('authRegisterButton')}
      </Button>
    </form>
  );
}
