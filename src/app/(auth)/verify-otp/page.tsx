import { VerifyOtpForm } from '@/components/forms/verify-otp-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, ShieldCheck } from 'lucide-react';

type Props = {
  searchParams: { userId?: string; email?: string };
};

export default function VerifyOtpPage({ searchParams }: Props) {
  const userId = searchParams.userId;
  const email = searchParams.email;

  if (!userId || !email) {
    return (
      <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
        <div className="absolute left-1/4 top-1/4 h-96 w-96 animate-pulse rounded-full bg-blue-200/30 blur-3xl" />
        <div className="animation-delay-2000 absolute bottom-1/4 right-1/4 h-96 w-96 animate-pulse rounded-full bg-purple-200/30 blur-3xl" />

        <Card className="relative w-full max-w-md border-white/20 bg-white/80 shadow-2xl backdrop-blur-sm">
          <CardHeader className="space-y-4 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-red-500 to-orange-600 shadow-lg">
              <ShieldCheck className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-3xl font-bold tracking-tight text-transparent">
              Invalid Request
            </CardTitle>
            <CardDescription className="text-base">
              <p>
                Missing verification parameters. Please sign up again to receive a new verification
                code.
              </p>
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
      <div className="absolute left-1/4 top-1/4 h-96 w-96 animate-pulse rounded-full bg-blue-200/30 blur-3xl" />
      <div className="animation-delay-2000 absolute bottom-1/4 right-1/4 h-96 w-96 animate-pulse rounded-full bg-purple-200/30 blur-3xl" />

      <Card className="relative w-full max-w-md border-white/20 bg-white/80 shadow-2xl backdrop-blur-sm transition-all duration-300 hover:shadow-indigo-200/50">
        <CardHeader className="space-y-4 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg">
            <ShieldCheck className="h-8 w-8 text-white" />
          </div>
          <CardTitle className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-3xl font-bold tracking-tight text-transparent">
            Verify Your Email
          </CardTitle>
          <CardDescription className="space-y-2 text-base">
            <p className="flex items-center justify-center gap-2">
              <Mail className="h-4 w-4 text-indigo-500" />
              <span>We&apos;ve sent a 6-digit code to:</span>
            </p>
            <p className="text-lg font-semibold text-indigo-700">{email}</p>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <VerifyOtpForm userId={userId} email={email} />
        </CardContent>
      </Card>
    </div>
  );
}
