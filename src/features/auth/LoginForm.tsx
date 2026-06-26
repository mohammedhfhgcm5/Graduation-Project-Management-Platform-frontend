import { useState, type FormEvent } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

import { authService, type LoginPayload } from '@/api/auth.service';
import { useTheme } from '@/context/ThemeContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useI18n } from '@/i18n';
import { getApiErrorMessage } from '@/lib/errors';
import { useAuthStore } from '@/store/zustand/authStore';
import { roleRedirect } from '@/utils/roleRedirect';

export function LoginForm() {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const { t } = useI18n();
  const { theme } = useTheme();
  const [values, setValues] = useState<LoginPayload>({ email: '', password: '' });
  const [error, setError] = useState('');

  const mutation = useMutation({
    mutationFn: authService.login,
    onSuccess: (data) => {
      login(data.user, data.accessToken);
      navigate(roleRedirect(data.user.role), { replace: true });
    },
    onError: (mutationError) => {
      setError(getApiErrorMessage(mutationError, t('authInvalidCredentials')));
    },
  });

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    mutation.mutate(values);
  };

  return (
    <form className='space-y-4' onSubmit={handleSubmit}>
      <div className='space-y-1'>
        <label className='text-sm font-medium text-slate-700 dark:text-slate-200' htmlFor='login-email'>
          {t('authEmail')}
        </label>
        <Input
          id='login-email'
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
          htmlFor='login-password'
        >
          {t('authPassword')}
        </label>
        <Input
          id='login-password'
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

      {error ? <p className='text-sm text-red-600'>{error}</p> : null}

      <Button type='submit' className='w-full' disabled={mutation.isPending}>
        {mutation.isPending ? t('authLoginLoading') : t('authLoginButton')}
      </Button>
    </form>
  );
}
