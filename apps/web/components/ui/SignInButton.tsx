import { getSession } from '@/lib/session';
import Link from 'next/link';

export const SignInButton = async () => {
  const session = await getSession();

  return (
    <div className="ml-auto flex items-center gap-2">
      {!session || !session.user ? (
        <>
          <Link href="/auth/signin">Sign In</Link>
          <Link href="/auth/signup">Sign Up</Link>
        </>
      ) : (
        <>
          <p> {session.user.name} </p>
          <Link href={'/api/auth/signout'}>Sign Out</Link>
        </>
      )}
    </div>
  );
};
