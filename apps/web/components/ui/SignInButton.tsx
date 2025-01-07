import { deleteSession, getSession, Session } from '@/lib/session';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { redirect } from 'next/navigation';

export const SignInButton = () => {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    const updateSession = async () => {
      setSession(await getSession());
    };

    updateSession();
  }, []);

  const logOut = async () => {
    await deleteSession();
    setSession(null);
    redirect('/');
  };

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
          <button onClick={() => logOut()}>Sign Out</button>
          {/*<Link href={"/api/auth/signout"}>Sign Out</Link>*/}
        </>
      )}
    </div>
  );
};
