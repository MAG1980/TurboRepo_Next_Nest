import { FC } from 'react';
import Link from 'next/link';
import { SignupForm } from "@/app/auth/signup/signupForm";

const SignUpPage: FC = () => {
  return (
    <div className="flex w-96 flex-col items-center justify-center rounded-lg bg-white p-8 shadow-lg">
      <h1 className="mb-4 text-center text-2xl font-bold">Sign Up Page</h1>
      <SignupForm/>
      <div className="flex justify-between text-sm">
        <p>Already have an account? </p>
        <Link className="underline" href={'/auth/signin'}>
          Sign In
        </Link>
      </div>
    </div>
  );
};

export default SignUpPage;
