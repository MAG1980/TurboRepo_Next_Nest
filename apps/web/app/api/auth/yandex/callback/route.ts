import { NextRequest } from 'next/server';
import { createSession } from '@/lib/session';
import { redirect } from 'next/navigation';

export async function GET(req: NextRequest) {
  //Извлекаем searchParams, содержащие данные из request
  const { searchParams } = new URL(req.url);

  const accessToken = searchParams.get('accessToken');
  const refreshToken = searchParams.get('refreshToken');
  const userId = searchParams.get('userId');
  const name = searchParams.get('name');

  if (!accessToken || !refreshToken || !userId || !name) {
    throw new Error('Google OAuth failed!');
  }

  //Добавление данных пользователя в httpOnly cookie с названием session в виде в JWT-токена.
  await createSession({
    user: {
      id: userId,
      name,
    },
    accessToken,
    refreshToken,
  });

  //Перенаправление на главную страницу сайта
  redirect('/');
}
