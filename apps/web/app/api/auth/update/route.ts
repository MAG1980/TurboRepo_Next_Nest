import { NextRequest } from 'next/server';
import { updateTokens } from '@/lib/serverActions/tokens';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { accessToken, refreshToken } = body;
  if (!accessToken || !refreshToken) {
    return new Response('Provide accessToken and refreshToken', {
      status: 401,
    });
  }

  await updateTokens({ accessToken, refreshToken });

  return new Response('Tokens updated', { status: 200 });
}
