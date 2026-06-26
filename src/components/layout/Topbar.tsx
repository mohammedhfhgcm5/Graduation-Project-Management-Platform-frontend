import { Languages, LogOut, Moon, Sun } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { useTheme } from '@/context/ThemeContext';
import { NotificationBell } from '@/features/notifications/NotificationBell';
import { getRoleLabel, useI18n } from '@/i18n';
import { useAuthStore } from '@/store/zustand/authStore';
import { useNotificationStore } from '@/store/zustand/notificationStore';
import { cn } from '@/utils/cn';

function IconBtn({
  onClick,
  'aria-label': ariaLabel,
  children,
  className,
}: {
  onClick?: () => void;
  'aria-label'?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <button
      type='button'
      onClick={onClick}
      aria-label={ariaLabel}
      className={cn(
        'inline-flex h-9 w-9 items-center justify-center rounded-[9px]',
        'border border-[#e0ddd8] bg-transparent text-[#444450]',
        'dark:border-white/10 dark:text-slate-300',
        'transition-all duration-150',
        'hover:-translate-y-px hover:border-[#c0bdb8] hover:bg-[#f4f2ee] hover:text-[#111118]',
        'dark:hover:border-white/20 dark:hover:bg-white/5 dark:hover:text-white',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400/50',
        className,
      )}
    >
      {children}
    </button>
  );
}

function ActionBtn({
  onClick,
  'aria-label': ariaLabel,
  children,
  variant = 'default',
}: {
  onClick?: () => void;
  'aria-label'?: string;
  children: React.ReactNode;
  variant?: 'default' | 'danger';
}) {
  return (
    <button
      type='button'
      onClick={onClick}
      aria-label={ariaLabel}
      className={cn(
        'inline-flex h-9 items-center gap-1.5 rounded-[9px] px-3',
        'border text-[12.5px] font-bold tracking-[0.01em]',
        'transition-all duration-150',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400/50',
        variant === 'danger'
          ? [
              'border-red-200 bg-red-50 text-red-800',
              'hover:-translate-y-px hover:border-red-300 hover:bg-red-100 hover:text-red-900',
            ].join(' ')
          : [
              'border-[#e0ddd8] bg-transparent text-[#2a2a3a]',
              'hover:-translate-y-px hover:border-[#c0bdb8] hover:bg-[#f4f2ee] hover:text-[#111118]',
              'dark:border-white/10 dark:text-slate-300',
              'dark:hover:border-white/20 dark:hover:bg-white/5 dark:hover:text-white',
            ].join(' '),
      )}
    >
      {children}
    </button>
  );
}

export function Topbar() {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const clearNotifications = useNotificationStore(
    (state) => state.clearNotifications,
  );
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { locale, setLocale, t } = useI18n();

  const roleLabelText = user ? getRoleLabel(user.role, t) : null;

  return (
    <header
      className={cn(
        'sticky top-0 z-30 flex h-16 items-center justify-between',
        'border-b border-[#ebe7f5] bg-white/90 px-4 backdrop-blur md:px-6',
        'shadow-[0_10px_30px_rgba(17,12,35,0.06)]',
        'dark:border-white/10 dark:bg-[#120f1b]/90 dark:shadow-[0_10px_30px_rgba(0,0,0,0.35)]',
      )}
    >
      <div className='flex items-center gap-3.5'>
        <div className='flex h-10 w-10 items-center justify-center rounded-[12px] bg-gradient-to-br from-violet-600 to-indigo-600 text-sm font-extrabold text-white shadow-[0_12px_26px_rgba(79,70,229,0.28)]'>
          GP
        </div>

        <div>
          <p className='text-[10px] font-bold uppercase tracking-[0.12em] text-[#8e86bc]'>
            {t('appName')}
          </p>
          <p className='flex items-center gap-1.5 text-sm font-bold text-[#1b1631] dark:text-slate-100'>
            {user?.name ?? t('topbarGuest')}
            {roleLabelText ? (
              <span
                className={cn(
                  'inline-flex items-center gap-1 rounded-full px-2 py-[1px]',
                  'border border-violet-300 bg-violet-100 text-[11px] font-bold text-violet-800',
                )}
              >
                <span className='h-1.5 w-1.5 rounded-full bg-violet-500' />
                {roleLabelText}
              </span>
            ) : null}
          </p>
        </div>
      </div>

      <div className='flex items-center gap-1.5'>
        <ActionBtn
          onClick={() => setLocale(locale === 'en' ? 'ar' : 'en')}
          aria-label={t('languageLabel')}
        >
          <Languages className='h-3.5 w-3.5' />
          {locale === 'en' ? 'AR' : 'EN'}
        </ActionBtn>

        <IconBtn onClick={toggleTheme} aria-label={t('topbarToggleTheme')}>
          {theme === 'dark' ? (
            <Sun className='h-4 w-4' />
          ) : (
            <Moon className='h-4 w-4' />
          )}
        </IconBtn>

        <IconBtn
          onClick={() => navigate('/notifications')}
          aria-label={t('topbarNotifications')}
        >
          <NotificationBell />
        </IconBtn>

        <ActionBtn
          variant='danger'
          onClick={() => {
            logout();
            clearNotifications();
            navigate('/login', { replace: true });
          }}
        >
          <LogOut className='h-3.5 w-3.5' />
          {t('topbarLogout')}
        </ActionBtn>
      </div>
    </header>
  );
}
