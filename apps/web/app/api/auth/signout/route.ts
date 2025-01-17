import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { deleteSession } from '@/lib/session';
import { authFetch } from '@/lib/serverActions/authFetch';

export async function GET(req: NextRequest) {
  //Используется authFetch(),
  // т.к. для доступа к данному маршруту API требуется наличие jWT-токенов (@UseGuards(JwtAuthGuard).
  const response = await authFetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/signout`,
    {
      method: 'POST',
    }
  );

  if (response.ok) {
    deleteSession();
  }

  //Очистка кеш домашней страницы
  revalidatePath('/');
  const url = new URL('/', req.nextUrl);
  return NextResponse.redirect(url);
}
