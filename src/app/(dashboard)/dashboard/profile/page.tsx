import { EmailChangeForm } from '@/components/email-change-form';
import { PasswordForm } from '@/components/password-form';
import { ProfileForm } from '@/components/profile-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getCurrentUser } from '@/lib/actions/user.actions';
import { KeyRound, Mail, User } from 'lucide-react';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function ProfilePage() {
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
      <div className="rounded-2xl bg-gradient-to-r from-green-100 via-teal-100 to-emerald-100 p-6 shadow-lg">
        <h2 className="bg-gradient-to-r from-green-600 via-teal-600 to-emerald-600 bg-clip-text text-4xl font-extrabold tracking-tight text-transparent">
          Profile Settings ⚙️
        </h2>
        <p className="mt-2 text-lg font-medium text-gray-700">
          Manage your account settings and preferences
        </p>
      </div>

      <div className="grid gap-6">
        <Card className="group overflow-hidden border-2 border-blue-200 bg-gradient-to-br from-blue-50/50 to-white shadow-xl transition-all duration-300 hover:border-blue-400 hover:shadow-2xl">
          <div className="absolute right-0 top-0 h-32 w-32 -translate-y-8 translate-x-8 rounded-full bg-blue-200/50 blur-2xl transition-all group-hover:bg-blue-300/70"></div>
          <CardHeader className="relative border-b-2 border-blue-100 bg-gradient-to-r from-blue-50 to-indigo-50 pb-4">
            <CardTitle className="flex items-center gap-3 text-2xl font-bold text-gray-800">
              <div className="rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 p-2.5 shadow-lg">
                <User className="h-6 w-6 text-white" />
              </div>
              Personal Information
            </CardTitle>
            <CardDescription className="text-base font-medium text-gray-600">
              Update your name and contact number
            </CardDescription>
          </CardHeader>
          <CardContent className="relative pt-6">
            <ProfileForm user={user} />
          </CardContent>
        </Card>

        <Card className="group overflow-hidden border-2 border-purple-200 bg-gradient-to-br from-purple-50/50 to-white shadow-xl transition-all duration-300 hover:border-purple-400 hover:shadow-2xl">
          <div className="absolute right-0 top-0 h-32 w-32 -translate-y-8 translate-x-8 rounded-full bg-purple-200/50 blur-2xl transition-all group-hover:bg-purple-300/70"></div>
          <CardHeader className="relative border-b-2 border-purple-100 bg-gradient-to-r from-purple-50 to-pink-50 pb-4">
            <CardTitle className="flex items-center gap-3 text-2xl font-bold text-gray-800">
              <div className="rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 p-2.5 shadow-lg">
                <KeyRound className="h-6 w-6 text-white" />
              </div>
              Change Password
            </CardTitle>
            <CardDescription className="text-base font-medium text-gray-600">
              Update your password to keep your account secure
            </CardDescription>
          </CardHeader>
          <CardContent className="relative pt-6">
            <PasswordForm />
          </CardContent>
        </Card>

        <Card className="group overflow-hidden border-2 border-green-200 bg-gradient-to-br from-green-50/50 to-white shadow-xl transition-all duration-300 hover:border-green-400 hover:shadow-2xl">
          <div className="absolute right-0 top-0 h-32 w-32 -translate-y-8 translate-x-8 rounded-full bg-green-200/50 blur-2xl transition-all group-hover:bg-green-300/70"></div>
          <CardHeader className="relative border-b-2 border-green-100 bg-gradient-to-r from-green-50 to-emerald-50 pb-4">
            <CardTitle className="flex items-center gap-3 text-2xl font-bold text-gray-800">
              <div className="rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 p-2.5 shadow-lg">
                <Mail className="h-6 w-6 text-white" />
              </div>
              Email Address
            </CardTitle>
            <CardDescription className="text-base font-medium text-gray-600">
              Change your email address (requires verification)
            </CardDescription>
          </CardHeader>
          <CardContent className="relative pt-6">
            <EmailChangeForm currentEmail={user.email} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
