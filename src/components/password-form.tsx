'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { updatePasswordAction } from '@/lib/actions/user.actions';
import { Loader2 } from 'lucide-react';
import { useTransition } from 'react';

export function PasswordForm() {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  async function handleSubmit(formData: FormData) {
    startTransition(async () => {
      const result = await updatePasswordAction(formData);

      if (result.success) {
        toast({
          title: 'Success',
          description: result.message || 'Password updated successfully!',
        });

        const form = document.querySelector('form') as HTMLFormElement;
        form?.reset();
      } else {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: result.message || 'Failed to update password',
        });
      }
    });
  }

  return (
    <form action={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="currentPassword">Current Password</Label>
        <Input
          id="currentPassword"
          name="currentPassword"
          type="password"
          required
          disabled={isPending}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="newPassword">New Password</Label>
        <Input
          id="newPassword"
          name="newPassword"
          type="password"
          required
          minLength={6}
          disabled={isPending}
        />
        <p className="text-xs text-muted-foreground">At least 6 characters</p>
      </div>

      <Button type="submit" disabled={isPending}>
        {isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Updating...
          </>
        ) : (
          'Change Password'
        )}
      </Button>
    </form>
  );
}
