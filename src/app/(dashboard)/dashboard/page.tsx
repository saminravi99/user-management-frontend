import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getCurrentUser } from '@/lib/actions/user.actions';
import { UserRole } from '@/types';
import { Calendar, CheckCircle, Mail, Phone, Shield, XCircle } from 'lucide-react';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">Unable to load user data. Please refresh the page.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 duration-500 animate-in fade-in">
      <div className="rounded-2xl bg-gradient-to-r from-blue-100 via-indigo-100 to-purple-100 p-6 shadow-lg">
        <h2 className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-4xl font-extrabold tracking-tight text-transparent">
          Welcome back, {user.name}! 👋
        </h2>
        <p className="mt-2 text-lg font-medium text-gray-700">
          Here&apos;s an overview of your account
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="group cursor-default overflow-hidden border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-white shadow-xl transition-all duration-300 hover:-translate-y-2 hover:border-blue-400 hover:shadow-2xl">
          <div className="absolute right-0 top-0 h-32 w-32 -translate-y-8 translate-x-8 rounded-full bg-blue-200/50 blur-2xl transition-all group-hover:bg-blue-300/70"></div>
          <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-base font-bold text-gray-700">Role</CardTitle>
            <div className="rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 p-3 shadow-lg transition-all group-hover:scale-110 group-hover:shadow-xl">
              <Shield className="h-6 w-6 text-white" />
            </div>
          </CardHeader>
          <CardContent className="relative">
            <div className="text-4xl font-extrabold capitalize text-blue-600">{user.role}</div>
            <p className="mt-2 text-sm font-semibold text-gray-600">
              {user.role === UserRole.SUPERADMIN && '🔐 Full system access'}
              {user.role === UserRole.ADMIN && '⚡ User management access'}
              {user.role === UserRole.USER && '✨ Standard user access'}
            </p>
          </CardContent>
        </Card>

        <Card
          className={`group cursor-default overflow-hidden border-2 shadow-xl transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl ${
            user.isVerified
              ? 'border-green-200 bg-gradient-to-br from-green-50 to-white hover:border-green-400'
              : 'border-red-200 bg-gradient-to-br from-red-50 to-white hover:border-red-400'
          }`}
        >
          <div
            className={`absolute right-0 top-0 h-32 w-32 -translate-y-8 translate-x-8 rounded-full blur-2xl transition-all ${
              user.isVerified
                ? 'bg-green-200/50 group-hover:bg-green-300/70'
                : 'bg-red-200/50 group-hover:bg-red-300/70'
            }`}
          ></div>
          <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-base font-bold text-gray-700">Email Status</CardTitle>
            <div
              className={`rounded-2xl p-3 shadow-lg transition-all group-hover:scale-110 group-hover:shadow-xl ${
                user.isVerified
                  ? 'bg-gradient-to-br from-green-500 to-green-600'
                  : 'bg-gradient-to-br from-red-500 to-red-600'
              }`}
            >
              {user.isVerified ? (
                <CheckCircle className="h-6 w-6 text-white" />
              ) : (
                <XCircle className="h-6 w-6 text-white" />
              )}
            </div>
          </CardHeader>
          <CardContent className="relative">
            <div
              className={`text-4xl font-extrabold ${user.isVerified ? 'text-green-600' : 'text-red-600'}`}
            >
              {user.isVerified ? 'Verified ✓' : 'Not Verified'}
            </div>
            <p className="mt-2 truncate text-sm font-semibold text-gray-600">{user.email}</p>
          </CardContent>
        </Card>

        <Card className="group cursor-default overflow-hidden border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-white shadow-xl transition-all duration-300 hover:-translate-y-2 hover:border-purple-400 hover:shadow-2xl">
          <div className="absolute right-0 top-0 h-32 w-32 -translate-y-8 translate-x-8 rounded-full bg-purple-200/50 blur-2xl transition-all group-hover:bg-purple-300/70"></div>
          <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-base font-bold text-gray-700">Member Since</CardTitle>
            <div className="rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 p-3 shadow-lg transition-all group-hover:scale-110 group-hover:shadow-xl">
              <Calendar className="h-6 w-6 text-white" />
            </div>
          </CardHeader>
          <CardContent className="relative">
            <div className="text-4xl font-extrabold text-purple-600">
              {new Date(user.createdAt).toLocaleDateString('en-US', {
                month: 'short',
                year: 'numeric',
              })}
            </div>
            <p className="mt-2 text-sm font-semibold text-gray-600">
              {new Date(user.createdAt).toLocaleDateString()}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="hover:shadow-3xl border-2 border-indigo-200 bg-gradient-to-br from-white to-indigo-50/30 shadow-2xl transition-all duration-300">
        <CardHeader className="border-b-2 border-indigo-100 bg-gradient-to-r from-indigo-50 to-blue-50">
          <CardTitle className="flex items-center gap-3 text-2xl font-bold text-gray-800">
            <div className="rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 p-2 shadow-lg">
              <Mail className="h-6 w-6 text-white" />
            </div>
            Account Information
          </CardTitle>
          <CardDescription className="text-base font-medium text-gray-600">
            Your personal details
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 pt-6">
          <div className="flex items-center justify-between rounded-lg border-2 border-blue-100 bg-gradient-to-r from-blue-50/50 to-white p-4 shadow-sm transition-all duration-200 hover:scale-[1.02] hover:border-blue-300 hover:shadow-md">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-blue-100 p-2">
                <Mail className="h-5 w-5 text-blue-600" />
              </div>
              <span className="text-base font-bold text-gray-800">Email</span>
            </div>
            <span className="text-base font-semibold text-gray-600">{user.email}</span>
          </div>

          <div className="flex items-center justify-between rounded-lg border-2 border-green-100 bg-gradient-to-r from-green-50/50 to-white p-4 shadow-sm transition-all duration-200 hover:scale-[1.02] hover:border-green-300 hover:shadow-md">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-green-100 p-2">
                <Phone className="h-5 w-5 text-green-600" />
              </div>
              <span className="text-base font-bold text-gray-800">Phone</span>
            </div>
            <span className="text-base font-semibold text-gray-600">
              {user.contactNumber || 'Not provided'}
            </span>
          </div>

          <div className="flex items-center justify-between rounded-lg border-2 border-purple-100 bg-gradient-to-r from-purple-50/50 to-white p-4 shadow-sm transition-all duration-200 hover:scale-[1.02] hover:border-purple-300 hover:shadow-md">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-purple-100 p-2">
                <Shield className="h-5 w-5 text-purple-600" />
              </div>
              <span className="text-base font-bold text-gray-800">Account Type</span>
            </div>
            <Badge
              variant={
                user.role === UserRole.SUPERADMIN
                  ? 'destructive'
                  : user.role === UserRole.ADMIN
                    ? 'default'
                    : 'secondary'
              }
              className="cursor-default px-4 py-1.5 text-sm font-bold shadow-sm"
            >
              {user.role}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
