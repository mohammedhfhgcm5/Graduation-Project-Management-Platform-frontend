import { ArrowLeft, ArrowRight, CalendarDays, UserRoundCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

import {
  Card,
  CardContent,
  CardHeader,
  CardIcon,
  CardTitle,
} from '@/components/ui/card';
import { useI18n } from '@/i18n';

export function SupervisorDashboard() {
  const { isRtl, t } = useI18n();
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  return (
    <div className='space-y-5'>
      <div>
        <p className='text-[11px] font-bold uppercase tracking-[0.16em] text-[#7b73a7] dark:text-[#938bbb]'>
          {t('navDashboard')}
        </p>
        <h1 className='mt-2 text-2xl font-black tracking-tight text-slate-950 dark:text-slate-100'>
          {t('dashboardSupervisorTitle')}
        </h1>
      </div>

      <div className='grid gap-4 xl:grid-cols-2'>
        <Card glow='violet' className='border-white/[0.08] bg-[#1a1825]'>
          <CardHeader className='mb-5'>
            <CardIcon className='border-violet-400/20 bg-gradient-to-br from-violet-600 to-indigo-600 text-white'>
              <UserRoundCheck className='h-5 w-5' />
            </CardIcon>
            <CardTitle>{t('dashboardSupervisorPrimaryTitle')}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className='text-sm leading-6 text-[#b0aacd]'>
              {t('dashboardSupervisorPrimaryDescription')}
            </p>
            <Link
              className='inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-500/10 px-3 py-1.5 text-sm font-semibold text-[#efe9ff] transition hover:border-violet-300/30 hover:bg-violet-500/15'
              to='/projects'
            >
              {t('navProjects')}
              <ArrowIcon className='h-4 w-4' />
            </Link>
          </CardContent>
        </Card>

        <Card glow='sky' className='border-white/[0.08] bg-[#1a1825]'>
          <CardHeader className='mb-5'>
            <CardIcon className='border-sky-400/20 bg-gradient-to-br from-sky-500 to-indigo-600 text-white'>
              <CalendarDays className='h-5 w-5' />
            </CardIcon>
            <CardTitle>{t('dashboardSupervisorSecondaryTitle')}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className='text-sm leading-6 text-[#b0aacd]'>
              {t('dashboardSupervisorSecondaryDescription')}
            </p>
            <Link
              className='inline-flex items-center gap-2 rounded-full border border-sky-400/20 bg-sky-500/10 px-3 py-1.5 text-sm font-semibold text-[#e8f3ff] transition hover:border-sky-300/30 hover:bg-sky-500/15'
              to='/projects'
            >
              {t('projectMeetings')}
              <ArrowIcon className='h-4 w-4' />
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
