import { getSession } from '@/lib/session';
import { redirect } from 'next/navigation';
import { Role } from "@/lib/enums";

const Dashboard = async () => {
  const session = await getSession();
  console.log({refreshToken:session?.refreshToken})
  if (!session?.user) {
    redirect('/auth/signin');
  }

  if(session?.user?.role !== Role.ADMIN) {
    redirect('/auth/signin');
  }

  console.log({session})

  return <div>Dashboard</div>;
};

export default Dashboard;
