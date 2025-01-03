'use client';
import { Input } from '@/components/ui/input';
import { SubmitButton } from '@/components/ui/submitButton';
import Link from 'next/link';
import { useActionState } from 'react';
import { signIn } from '@/lib/serverActions';

export const SignInForm = () => {
  const [state, action] = useActionState(signIn, undefined);

  return (
    <form action={action} className="flex w-64 flex-col gap-2">
      {state?.message && (
        <p className="text-sm text-red-500">{state.message}</p>
      )}
      <div>
        <label htmlFor="email">Email</label>
        <Input
          id="email"
          name="email"
          placeholder="example@email.com"
          type="email"
        />
      </div>
      {state?.error?.email && (
        <p className="text-sm text-red-500">{state.error.email}</p>
      )}

      <div>
        <label htmlFor="password">Password</label>
        <Input id="passwerd" name="password" type="password" />
      </div>
      {state?.error?.password && (
        <p className="text-sm text-red-500">{state.error.password}</p>
      )}

      <Link className="text-sm underline" href="#">
        Forgot your password?
      </Link>

      <SubmitButton>Sign In</SubmitButton>

      <div className="flex justify-between text-sm">
        <p>Don't have an account?</p>
        <Link className="text-sm underline" href="/auth/signup">
          Sign Up
        </Link>
      </div>
    </form>
  );
};
