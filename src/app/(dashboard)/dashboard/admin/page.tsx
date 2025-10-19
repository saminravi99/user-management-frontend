import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { UsersDataTable } from '@/components/users-data-table';
import { getAllUsers, getCurrentUser } from '@/lib/actions/user.actions';
import { UserRole } from '@/types';
import { Shield, UserCheck, Users } from 'lucide-react';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function AdminPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/login');
  }

  // Check if user has admin or superadmin role
  if (user.role !== UserRole.ADMIN && user.role !== UserRole.SUPERADMIN) {
    redirect('/dashboard');
  }

  const users = await getAllUsers();

  // Calculate statistics
  const totalUsers = users.length;
  const verifiedUsers = users.filter((u) => u.isVerified).length;
  const adminUsers = users.filter(
    (u) => u.role === UserRole.ADMIN || u.role === UserRole.SUPERADMIN,
  ).length;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">User Management</h2>
        <p className="text-muted-foreground">Manage all users and their roles</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUsers}</div>
            <p className="text-xs text-muted-foreground">Registered in the system</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Verified Users</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{verifiedUsers}</div>
            <p className="text-xs text-muted-foreground">
              {((verifiedUsers / totalUsers) * 100).toFixed(0)}% of total users
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Admin Users</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{adminUsers}</div>
            <p className="text-xs text-muted-foreground">Admins and Superadmins</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Users</CardTitle>
          <CardDescription>View and manage user roles and accounts</CardDescription>
        </CardHeader>
        <CardContent>
          <UsersDataTable users={users} currentUser={user} />
        </CardContent>
      </Card>
    </div>
  );
}
