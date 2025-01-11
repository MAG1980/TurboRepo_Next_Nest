'use server';
import { getSession } from '@/lib/session';

export const getProfile = async () => {
  const session = await getSession();

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/protected`,
    {
      headers: {
        Authorization: `Bearer ${session?.accessToken}`,
      },
    }
  );

  return response.json();
};
