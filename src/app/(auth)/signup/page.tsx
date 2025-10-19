import { SignupForm } from '@/components/forms/signup-form';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { UserPlus } from 'lucide-react';
import Link from 'next/link';

export default function SignupPage() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
      <div className="absolute left-1/4 top-1/4 h-96 w-96 animate-pulse rounded-full bg-purple-300/40 blur-3xl" />
      <div className="animation-delay-2000 absolute bottom-1/4 right-1/4 h-96 w-96 animate-pulse rounded-full bg-blue-300/40 blur-3xl" />
      <div className="animation-delay-4000 absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 animate-pulse rounded-full bg-indigo-300/30 blur-3xl" />

      <Card className="relative w-full max-w-md border-2 border-purple-200 bg-white shadow-2xl transition-all duration-300 hover:shadow-purple-200/50">
        <CardHeader className="space-y-4 pb-6 text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 via-indigo-600 to-blue-600 shadow-xl shadow-purple-500/50">
            <UserPlus className="h-10 w-10 text-white" />
          </div>
          <CardTitle className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 bg-clip-text text-4xl font-extrabold tracking-tight text-transparent">
            Create Account ✨
          </CardTitle>
          <CardDescription className="text-base font-medium text-gray-600">
            Enter your details to get started
          </CardDescription>
        </CardHeader>
        <CardContent className="px-8">
          <SignupForm />
        </CardContent>
        <CardFooter className="flex flex-col space-y-4 border-t-2 border-gray-100 px-8 pt-6">
          <p className="text-center text-sm font-medium text-gray-600">
            Already have an account?{' '}
            <Link
              href="/login"
              className="font-bold text-purple-600 transition-colors duration-200 hover:text-indigo-600 hover:underline"
            >
              Log in →
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
