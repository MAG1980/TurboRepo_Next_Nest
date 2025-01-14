import { FC } from 'react';
import { SignInForm } from '@/app/auth/signin/signInForm';
import { BACKEND_URL } from '@/lib/constants';

const SignInPage: FC = () => {
  return (
    <div className="flex w-96 flex-col items-center justify-center rounded-lg bg-white p-8 shadow-lg">
      <h1 className="mb-4 text-center text-2xl font-bold">Sign In Page</h1>
      <SignInForm />
      <hr />
      <a
        className={'rounded border bg-sky-600 px-4 py-2 text-white'}
        href={`${BACKEND_URL}/auth/google/login`}
      >
        Sign In With Goggle
      </a>
      <div className="flex flex-col gap-2"></div>
    </div>
  );
};

export default SignInPage;
