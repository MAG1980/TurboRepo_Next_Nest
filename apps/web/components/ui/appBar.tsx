'use client'
import Link from "next/link";
import { SignInButton } from "@/components/ui/SignInButton";
import { usePathname } from "next/navigation";

export const AppBar = () => {
  const pathName = usePathname()
  return (
    <div className="flex shadow p-2 gap-3 bg-gradient-to-br from-blue-400 to cyan-400 text-white">
      <Link href={'/'}>Home</Link>
      <Link href={'/dashboard'}>Dashboard</Link>
      <Link href={'/auth/signin'}>Sign In</Link>
      <Link href={'/auth/signup'}>Sign Up</Link>
      {pathName!=='/auth/signin' && <SignInButton/>}
    </div>
  );
};
