'use client';
import Link from 'next/link';
import { SignInButton } from '@/components/ui/SignInButton';
import { usePathname } from 'next/navigation';

export const AppBar = () => {
  const pathName = usePathname();
  return (
    <div className="to cyan-400 flex gap-3 bg-gradient-to-br from-blue-400 p-2 text-white shadow">
      <Link href={'/'}>Home</Link>
      <Link href={'/dashboard'}>Dashboard</Link>
      {pathName !== '/auth/signin' && <SignInButton />}
    </div>
  );
};
