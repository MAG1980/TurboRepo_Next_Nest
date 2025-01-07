import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/session';

export async function middleware(req: NextRequest) {
  const session = await getSession();

  if (!session?.user) {
    return NextResponse.redirect(new URL('/auth/signin', req.nextUrl));
  }

  NextResponse.next();
}

export const config = {
  //Массив маршрутов, для которых будет применяться authMiddleware.
  //Вместо строк можно передавать регулярные выражения.
  matcher: ['/profile'],
};
