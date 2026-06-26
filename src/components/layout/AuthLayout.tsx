import { useI18n } from '@/i18n';

export function AuthLayout({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  const { locale, setLocale, t } = useI18n();

  return (
    <div className='flex min-h-screen items-center justify-center px-4 py-10'>
      <div className='relative w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-colors duration-300 dark:border-white/10 dark:bg-[#171320] dark:shadow-[0_24px_60px_rgba(0,0,0,0.35)]'>
        <button
          type='button'
          className={`absolute top-4 rounded-md border border-slate-200 px-3 py-1 text-sm font-medium text-slate-600 transition hover:bg-slate-50 dark:border-white/10 dark:text-slate-300 dark:hover:bg-white/5 ${
            locale === 'ar' ? 'left-4' : 'right-4'
          }`}
          onClick={() => setLocale(locale === 'en' ? 'ar' : 'en')}
        >
          {locale === 'en' ? t('languageArabic') : t('languageEnglish')}
        </button>

        <div className='mb-6 text-center'>
          <p className='text-xs font-semibold uppercase tracking-[0.2em] text-primary'>
            {t('appName')}
          </p>
          <h1 className='mt-2 text-2xl font-bold text-slate-900 dark:text-slate-100'>{title}</h1>
          <p className='mt-1 text-sm text-slate-500 dark:text-slate-400'>{subtitle}</p>
        </div>

        {children}
      </div>
    </div>
  );
}
