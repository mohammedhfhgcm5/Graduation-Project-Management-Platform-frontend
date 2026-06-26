import { Link } from 'react-router-dom';

import { AuthLayout } from '@/components/layout/AuthLayout';
import { RegisterForm } from '@/features/auth/RegisterForm';
import { useI18n } from '@/i18n';

export function RegisterPage() {
  const { t } = useI18n();

  return (
    <AuthLayout title={t('authRegisterTitle')} subtitle={t('authRegisterSubtitle')}>
      <RegisterForm />
      <p className='mt-4 text-center text-sm text-slate-500 dark:text-slate-400'>
        {t('authHaveAccount')}{' '}
        <Link className='font-semibold text-primary hover:underline' to='/login'>
          {t('authLoginLink')}
        </Link>
      </p>
    </AuthLayout>
  );
}
