'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { signupAction } from '@/lib/actions/auth.actions';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';

export function SignupForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  async function handleSubmit(formData: FormData) {
    startTransition(async () => {
      const result = await signupAction(formData);

      if (result.success) {
        toast({
          title: 'Success',
          description: result.message || 'Account created! Please verify your email.',
        });

        if (result.userId && result.email) {
          const params = new URLSearchParams({
            userId: result.userId,
            email: result.email,
          });
          router.push(`/verify-otp?${params.toString()}`);
        } else {
          router.push('/verify-otp');
        }
      } else {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: result.message || 'Signup failed',
        });
      }
    });
  }

  return (
    <form action={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Full Name</Label>
        <Input
          id="name"
          name="name"
          type="text"
          placeholder="John Doe"
          required
          disabled={isPending}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="john@example.com"
          required
          disabled={isPending}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          placeholder="••••••••"
          required
          minLength={6}
          disabled={isPending}
        />
        <p className="text-xs text-gray-500">At least 6 characters</p>
      </div>
      <div className="space-y-2">
        <Label htmlFor="contactNumber" className="text-sm font-bold text-gray-700">
          Contact Number
        </Label>
        <Input
          id="contactNumber"
          name="contactNumber"
          type="tel"
          placeholder="+1234567890"
          required
          disabled={isPending}
        />
      </div>
      <Button
        type="submit"
        className="h-12 w-full cursor-pointer bg-gradient-to-r from-blue-500 via-indigo-600 to-purple-600 text-base font-bold shadow-lg shadow-indigo-500/50 transition-all duration-200 hover:scale-[1.02] hover:shadow-xl hover:shadow-indigo-500/60"
        disabled={isPending}
      >
        {isPending ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Creating account...
          </>
        ) : (
          'Create Account →'
        )}
      </Button>
    </form>
  );
}
