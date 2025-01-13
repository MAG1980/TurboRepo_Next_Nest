'use server';
import { authFetch } from '@/lib/serverActions/authFetch';

export const getProfile = async () => {
  /*const session = await getSession();

  const response = await fetch(
     `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/protected`,
     {
       headers: {
         Authorization: `Bearer ${session?.accessToken}`,
       },
     }
   );*/

  //Получение данных от endpoint API, защищённого JwtAuthGuard.
  const response = await authFetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/protected`
  );

  return response?.json();
};
