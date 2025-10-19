import { VerifyOtpForm } from '@/components/forms/verify-otp-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail } from 'lucide-react';
import { redirect } from 'next/navigation';

type Props = {
  searchParams: { userId?: string; email?: string };
};

export default function VerifyOtpPage({ searchParams }: Props) {
  const userId = searchParams.userId;
  const email = searchParams.email;

  // Server-side redirect if missing params
  if (!userId || !email) {
    redirect('/signup');
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <Mail className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight">Verify your email</CardTitle>
          <CardDescription>
            We&apos;ve sent a 6-digit code to
            <br />
            <span className="font-medium text-foreground">{email}</span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <VerifyOtpForm userId={userId} email={email} />
        </CardContent>
      </Card>
    </div>
  );
}
