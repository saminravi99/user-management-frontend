'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { updateProfileAction } from '@/lib/actions/user.actions';
import { User } from '@/types';
import { Loader2 } from 'lucide-react';
import { useTransition } from 'react';

interface ProfileFormProps {
  user: User;
}

export function ProfileForm({ user }: ProfileFormProps) {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  async function handleSubmit(formData: FormData) {
    startTransition(async () => {
      const result = await updateProfileAction(formData);

      if (result.success) {
        toast({
          title: 'Success',
          description: result.message || 'Profile updated successfully!',
        });
      } else {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: result.message || 'Failed to update profile',
        });
      }
    });
  }

  return (
    <form action={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name" className="text-sm font-bold text-gray-700">
          Full Name
        </Label>
        <Input id="name" name="name" type="text" defaultValue={user.name} disabled={isPending} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="contactNumber" className="text-sm font-bold text-gray-700">
          Contact Number
        </Label>
        <Input
          id="contactNumber"
          name="contactNumber"
          type="tel"
          defaultValue={user.contactNumber}
          placeholder="+1234567890"
          disabled={isPending}
        />
      </div>

      <Button
        type="submit"
        disabled={isPending}
        className="h-12 w-full cursor-pointer bg-gradient-to-r from-blue-500 via-indigo-600 to-purple-600 text-base font-bold shadow-lg shadow-indigo-500/50 transition-all duration-200 hover:scale-[1.02] hover:shadow-xl hover:shadow-indigo-500/60 sm:w-auto sm:px-8"
      >
        {isPending ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Updating...
          </>
        ) : (
          'Update Profile →'
        )}
      </Button>
    </form>
  );
}
