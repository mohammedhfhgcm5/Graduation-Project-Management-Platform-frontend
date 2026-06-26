import { Outlet } from 'react-router-dom';

// import { RoleNavigationPanel } from '@/components/layout/RoleNavigationPanel';
import { Topbar } from '@/components/layout/Topbar';

export function AppLayout() {
  return (
    <div className='min-h-screen bg-[#f5f1eb] transition-colors duration-300 dark:bg-[#0b0913]'>
      <Topbar />
      <main className='mx-auto flex w-full max-w-7xl flex-col gap-6 p-4 md:p-6'>
        {/* <RoleNavigationPanel /> */}
        <Outlet />
      </main>
    </div>
  );
}
