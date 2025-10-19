import { DashboardNav } from '@/components/dashboard-nav';
import { UserMenu } from '@/components/user-menu';
import { getCurrentUser } from '@/lib/actions/user.actions';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/login');
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="fixed left-10 top-20 h-72 w-72 animate-pulse rounded-full bg-blue-200/20 blur-3xl"></div>
      <div className="animation-delay-2000 fixed bottom-20 right-10 h-72 w-72 animate-pulse rounded-full bg-purple-200/20 blur-3xl"></div>
      <div className="animation-delay-4000 fixed left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 animate-pulse rounded-full bg-indigo-200/20 blur-3xl"></div>

      <header className="sticky top-0 z-50 border-b-2 border-indigo-200 bg-white/80 shadow-lg backdrop-blur-md">
        <div className="container mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
          <div className="flex items-center gap-8">
            <h1 className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-2xl font-extrabold text-transparent">
              User Management
            </h1>
            <DashboardNav user={user} />
          </div>
          <UserMenu user={user} />
        </div>
      </header>
      <main className="container relative z-10 mx-auto max-w-7xl px-6 py-10">{children}</main>
    </div>
  );
}
