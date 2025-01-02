'use client';
import { useActionState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { SubmitButton } from '@/components/ui/submitButton';
import { signUp } from '@/lib/serverActions';

export const SignupForm = () => {
  const [state, action] = useActionState(signUp, undefined);
  return (
    <form action={action} className="flex flex-col gap-2">
      {state?.message && (
        <p className="text-sm text-red-500">{state.message}</p>
      )}
      <div>
        <Label htmlFor="name">Name</Label>
        <Input id="name" type="text" name="name" placeholder="username" />
      </div>
      {state?.error?.name && (
        <p className="text-sm text-red-500">{state.error.name}</p>
      )}

      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          name="email"
          placeholder="username@email.com"
        />
      </div>
      {state?.error?.email && (
        <p className="text-sm text-red-500">{state.error.email}</p>
      )}

      <div>
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          name="password"
          placeholder="Password"
        />
      </div>
      {state?.error?.password && (
        <div className="text-sm text-red-500">
          <p>Password must:</p>
          <ul>
            {state.error.password.map((message) => (
              <li key={message}>{message}</li>
            ))}
          </ul>
        </div>
      )}

      <SubmitButton>Sgn Up</SubmitButton>
    </form>
  );
};
