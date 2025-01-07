import Link from 'next/link';
import { SignInButton } from '@/components/ui/SignInButton';

export const AppBar = () => {
  return (
    <div className="to cyan-400 flex gap-3 bg-gradient-to-br from-blue-400 p-2 text-white shadow">
      <Link href={'/'}>Home</Link>
      <Link href={'/dashboard'}>Dashboard</Link>
      <Link href={'/profile'}>Profile</Link>
      <SignInButton />
    </div>
  );
};
