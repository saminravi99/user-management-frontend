import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { UsersDataTable } from '@/components/users-data-table';
import { getAllUsers, getCurrentUser } from '@/lib/actions/user.actions';
import { UserRole } from '@/types';
import { Shield, UserCheck, Users } from 'lucide-react';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function AdminPage() {
  const user = await getCurrentUser();

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">Unable to load user data. Please refresh the page.</p>
      </div>
    );
  }

  const users = await getAllUsers();

  const totalUsers = users.length;
  const verifiedUsers = users.filter((u) => u.isVerified).length;
  const adminUsers = users.filter(
    (u) => u.role === UserRole.ADMIN || u.role === UserRole.SUPERADMIN,
  ).length;

  return (
    <div className="space-y-8 duration-500 animate-in fade-in">
      <div className="rounded-2xl bg-gradient-to-r from-purple-100 via-indigo-100 to-blue-100 p-6 shadow-lg">
        <h2 className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 bg-clip-text text-4xl font-extrabold tracking-tight text-transparent">
          User Management 👥
        </h2>
        <p className="mt-2 text-lg font-medium text-gray-700">Manage all users and their roles</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="group cursor-default overflow-hidden border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-white shadow-xl transition-all duration-300 hover:-translate-y-2 hover:border-blue-400 hover:shadow-2xl">
          <div className="absolute right-0 top-0 h-32 w-32 -translate-y-8 translate-x-8 rounded-full bg-blue-200/50 blur-2xl transition-all group-hover:bg-blue-300/70"></div>
          <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-base font-bold text-gray-700">Total Users</CardTitle>
            <div className="rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 p-3 shadow-lg transition-all group-hover:scale-110 group-hover:shadow-xl">
              <Users className="h-6 w-6 text-white" />
            </div>
          </CardHeader>
          <CardContent className="relative">
            <div className="text-5xl font-extrabold text-blue-600">{totalUsers}</div>
            <p className="mt-2 text-sm font-semibold text-gray-600">Registered in the system</p>
          </CardContent>
        </Card>

        <Card className="group cursor-default overflow-hidden border-2 border-green-200 bg-gradient-to-br from-green-50 to-white shadow-xl transition-all duration-300 hover:-translate-y-2 hover:border-green-400 hover:shadow-2xl">
          <div className="absolute right-0 top-0 h-32 w-32 -translate-y-8 translate-x-8 rounded-full bg-green-200/50 blur-2xl transition-all group-hover:bg-green-300/70"></div>
          <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-base font-bold text-gray-700">Verified Users</CardTitle>
            <div className="rounded-2xl bg-gradient-to-br from-green-500 to-green-600 p-3 shadow-lg transition-all group-hover:scale-110 group-hover:shadow-xl">
              <UserCheck className="h-6 w-6 text-white" />
            </div>
          </CardHeader>
          <CardContent className="relative">
            <div className="text-5xl font-extrabold text-green-600">{verifiedUsers}</div>
            <p className="mt-2 text-sm font-semibold text-gray-600">
              <span className="rounded-full bg-green-100 px-2 py-1 text-green-700">
                {((verifiedUsers / totalUsers) * 100).toFixed(0)}%
              </span>{' '}
              of total users
            </p>
          </CardContent>
        </Card>

        <Card className="group cursor-default overflow-hidden border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-white shadow-xl transition-all duration-300 hover:-translate-y-2 hover:border-purple-400 hover:shadow-2xl">
          <div className="absolute right-0 top-0 h-32 w-32 -translate-y-8 translate-x-8 rounded-full bg-purple-200/50 blur-2xl transition-all group-hover:bg-purple-300/70"></div>
          <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-base font-bold text-gray-700">Admin Users</CardTitle>
            <div className="rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 p-3 shadow-lg transition-all group-hover:scale-110 group-hover:shadow-xl">
              <Shield className="h-6 w-6 text-white" />
            </div>
          </CardHeader>
          <CardContent className="relative">
            <div className="text-5xl font-extrabold text-purple-600">{adminUsers}</div>
            <p className="mt-2 text-sm font-semibold text-gray-600">Admins and Superadmins</p>
          </CardContent>
        </Card>
      </div>

      <Card className="hover:shadow-3xl border-2 border-indigo-200 bg-gradient-to-br from-white to-indigo-50/30 shadow-2xl transition-all duration-300">
        <CardHeader className="border-b-2 border-indigo-100 bg-gradient-to-r from-indigo-50 to-purple-50">
          <CardTitle className="flex items-center gap-3 text-2xl font-bold text-gray-800">
            <div className="rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 p-2 shadow-lg">
              <Users className="h-6 w-6 text-white" />
            </div>
            All Users
          </CardTitle>
          <CardDescription className="text-base font-medium text-gray-600">
            View and manage user roles and accounts
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <UsersDataTable users={users} currentUser={user} />
        </CardContent>
      </Card>
    </div>
  );
}
