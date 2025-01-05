import { getSession, Session } from "@/lib/session";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

export const SignInButton = () => {
  const [session, setSession] = useState<Session | null>(null)

  const searchParams = useSearchParams()

  useEffect(() => {
    console.log({ searchParams:searchParams.get('updated') })
    if (searchParams.get('updated')==='true') {
      const updateSession = async () => {
        setSession(await getSession())
        console.log({ session })
      }

      updateSession()
    }
  }, [searchParams]);
  return (
    <div className="flex items-center gap-2 ml-auto">
      {!session || !session.user ? (
          <>
            <Link href="/auth/signin">Sign In</Link>
            <Link href="/auth/signup">Sign Up</Link>
          </>
        ) :
        (
          <>
            <p> {session.user.name} </p>
            <Link href="/api/auth/signout">Sign Out</Link>
          </>
        )}
    </div>
  );
};
