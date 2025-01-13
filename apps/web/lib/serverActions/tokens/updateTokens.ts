import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';
import { Session } from '@/lib/session/Session.type';
import { getEncodedSecretKey } from '@/lib/session/getEncodedSecretKey';
import { createSession } from '@/lib/session/createSession';

/**
 * Обновление accessToken и refreshToken в httpOnly cookie с названием session,
 * хранящей данные аутентифицированного пользователя.
 */

export const updateTokens = async ({
  accessToken,
  refreshToken,
}: {
  accessToken: string;
  refreshToken: string;
}) => {
  const cookieStore = await cookies();

  const session = cookieStore.get('session')?.value;

  if (!session) {
    return null;
  }

  //Валидация JWT-токена, хранящегося в cookies с помощью секретного ключа
  const { payload } = await jwtVerify<Session>(session, getEncodedSecretKey);

  if (!payload) {
    throw new Error('The session is undefined');
  }

  const newPayload: Session = {
    user: { ...payload.user },
    accessToken,
    refreshToken,
  };

  //охранение полезной нагрузки в httpOnly cookie с названием session
  await createSession(newPayload);
};
