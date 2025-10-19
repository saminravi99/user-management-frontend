'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { loginAction } from '@/lib/actions/auth.actions';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';

export function LoginForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  async function handleSubmit(formData: FormData) {
    startTransition(async () => {
      const result = await loginAction(formData);

      if (result.success) {
        toast({
          title: 'Success',
          description: result.message || 'Logged in successfully!',
        });
        router.push('/dashboard');
        router.refresh();
      } else {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: result.message || 'Login failed',
        });
      }
    });
  }

  return (
    <form action={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="email" className="text-sm font-bold text-gray-700">
          Email Address
        </Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="your@email.com"
          required
          disabled={isPending}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password" className="text-sm font-bold text-gray-700">
          Password
        </Label>
        <Input
          id="password"
          name="password"
          type="password"
          placeholder="Enter your password"
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
            Signing in...
          </>
        ) : (
          'Sign In →'
        )}
      </Button>
    </form>
  );
}
