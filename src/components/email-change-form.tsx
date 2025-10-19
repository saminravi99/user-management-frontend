'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { requestEmailChangeAction, verifyEmailChangeAction } from '@/lib/actions/user.actions';
import { Loader2, Mail } from 'lucide-react';
import { useState, useTransition } from 'react';

interface EmailChangeFormProps {
  currentEmail: string;
}

export function EmailChangeForm({ currentEmail }: EmailChangeFormProps) {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [step, setStep] = useState<'request' | 'verify'>('request');
  const [newEmail, setNewEmail] = useState('');

  async function handleRequest(formData: FormData) {
    const email = formData.get('newEmail') as string;

    startTransition(async () => {
      const result = await requestEmailChangeAction(formData);

      if (result.success) {
        toast({
          title: 'Success',
          description: result.message || 'Verification code sent to your new email!',
        });
        setNewEmail(email);
        setStep('verify');
      } else {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: result.message || 'Failed to request email change',
        });
      }
    });
  }

  async function handleVerify(formData: FormData) {
    const otp = formData.get('otp') as string;

    startTransition(async () => {
      const result = await verifyEmailChangeAction(newEmail, otp);

      if (result.success) {
        toast({
          title: 'Success',
          description: result.message || 'Email changed successfully!',
        });
        setStep('request');
        setNewEmail('');

        // Reload page to show updated email
        window.location.reload();
      } else {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: result.message || 'Failed to verify email change',
        });
      }
    });
  }

  if (step === 'verify') {
    return (
      <div className="space-y-4">
        <div className="rounded-lg bg-blue-50 p-4">
          <div className="flex items-start gap-3">
            <Mail className="mt-0.5 h-5 w-5 text-blue-500" />
            <div>
              <p className="text-sm font-medium text-blue-900">Verification code sent</p>
              <p className="mt-1 text-sm text-blue-700">
                We&apos;ve sent a 6-digit code to <span className="font-medium">{newEmail}</span>
              </p>
            </div>
          </div>
        </div>

        <form action={handleVerify} className="space-y-4">
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
              className="text-center text-lg tracking-widest"
            />
          </div>

          <div className="flex gap-2">
            <Button type="submit" disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                'Verify Email'
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setStep('request')}
              disabled={isPending}
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <form action={handleRequest} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="currentEmailDisplay">Current Email</Label>
        <Input
          id="currentEmailDisplay"
          type="email"
          value={currentEmail}
          disabled
          className="bg-gray-50"
        />
      </div>

      <Separator />

      <div className="space-y-2">
        <Label htmlFor="newEmail">New Email</Label>
        <Input
          id="newEmail"
          name="newEmail"
          type="email"
          placeholder="newemail@example.com"
          required
          disabled={isPending}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Confirm Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          placeholder="Enter your current password"
          required
          disabled={isPending}
        />
        <p className="text-xs text-muted-foreground">Enter your password to confirm this change</p>
      </div>

      <Button type="submit" disabled={isPending}>
        {isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Sending code...
          </>
        ) : (
          'Request Email Change'
        )}
      </Button>
    </form>
  );
}
