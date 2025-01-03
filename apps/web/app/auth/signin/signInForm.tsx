import { Input } from '@/components/ui/input';
import { SubmitButton } from '@/components/ui/submitButton';
import Link from 'next/link';

export const SignInForm = () => {
  return (
    <form className="flex w-64 flex-col gap-2">
      <div>
        <label htmlFor="email">Email</label>
        <Input
          id="email"
          name="email"
          placeholder="example@email.com"
          type="email"
        />
      </div>

      <div>
        <label htmlFor="password">Password</label>
        <Input id="passwerd" name="password" type="password" />
      </div>

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
