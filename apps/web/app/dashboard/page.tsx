import { getSession } from '@/lib/session';
import { redirect } from 'next/navigation';

const Dashboard = async () => {
  const session = await getSession();
  if (!session?.user) {
    redirect('/auth/signin');
  }
  return <div>Dashboard</div>;
};

export default Dashboard;
