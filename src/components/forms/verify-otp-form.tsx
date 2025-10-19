'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { resendOtpAction, verifyOtpAction } from '@/lib/actions/auth.actions';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';

type VerifyOtpFormProps = {
  userId: string;
  email: string;
};

export function VerifyOtpForm({ userId, email }: VerifyOtpFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [isResending, setIsResending] = useState(false);

  async function handleSubmit(formData: FormData) {
    const otp = formData.get('otp') as string;

    startTransition(async () => {
      const result = await verifyOtpAction(userId, email, otp);

      if (result.success) {
        toast({
          title: 'Success',
          description: result.message || 'Email verified successfully!',
        });
        router.push('/dashboard');
        router.refresh();
      } else {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: result.message || 'Invalid OTP',
        });
      }
    });
  }

  async function handleResendOtp() {
    setIsResending(true);
    const result = await resendOtpAction(userId, email);

    if (result.success) {
      toast({
        title: 'Success',
        description: result.message || 'OTP resent successfully!',
      });
    } else {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: result.message || 'Failed to resend OTP',
      });
    }
    setIsResending(false);
  }

  return (
    <div className="space-y-4">
      <form action={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="otp">Verification Code</Label>
          <Input
            id="otp"
            name="otp"
            type="text"
            placeholder="000000"
            maxLength={6}
            required
            disabled={isPending}
            className="text-center text-2xl tracking-[0.5em]"
          />
          <p className="text-center text-xs text-gray-500">
            Enter the 6-digit code sent to your email
          </p>
        </div>

        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Verifying...
            </>
          ) : (
            'Verify Email'
          )}
        </Button>
      </form>

      <div className="text-center">
        <p className="text-sm text-gray-600">
          Didn&apos;t receive the code?{' '}
          <button
            type="button"
            onClick={handleResendOtp}
            disabled={isResending}
            className="font-medium text-primary hover:underline disabled:opacity-50"
          >
            {isResending ? 'Resending...' : 'Resend Code'}
          </button>
        </p>
      </div>
    </div>
  );
}
