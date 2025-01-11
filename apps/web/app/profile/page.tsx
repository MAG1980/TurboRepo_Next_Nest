import { getProfile } from '@/lib/serverActions';

const ProfilePage = async () => {
  const profile = await getProfile();
  return (
    <div>
      <h1 className="text-3xl">Profile</h1>
      <div>{profile?.message}</div>
    </div>
  );
};

export default ProfilePage;
