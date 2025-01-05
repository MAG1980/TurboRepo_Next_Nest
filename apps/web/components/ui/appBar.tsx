import Link from "next/link";
import { SignInButton } from "@/components/ui/SignInButton";

export const AppBar = () => {
  return (
    <div className="flex shadow p-2 gap-3 bg-gradient-to-br from-blue-400 to cyan-400 text-white">
      <Link href={'/'}>Home</Link>
      <Link href={'/dashboard'}>Dashboard</Link>
      <Link href={'/auth/signin'}>Sign In</Link>
      <Link href={'/auth/signup'}>Sign Up</Link>
      <SignInButton/>
    </div>
  );
};
