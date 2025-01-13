'use server';
import { getSession } from '@/lib/session';
import { refreshToken } from '@/lib/serverActions/tokens';

//Позволяет добавлять дополнительные заголовки к запросу
export interface FetchOptions extends RequestInit {
  headers?: Record<string, string>;
}

/**
 * Выполняет запрос к API с помощью accessToken, полученного из HTTPOnly cookie-session.
 * Если пользователь не аутентифицирован, обновляет accessToken с помощью refreshToken и повторяет запрос к API.
 */
export const authFetch = async (
  url: string | URL,
  options: FetchOptions = {}
) => {
  const session = await getSession();
  const accessTokenFromSession = session?.accessToken;
  const refreshTokenFromSession = session?.refreshToken;

  options.headers = {
    ...options.headers,
    Authorization: `Bearer ${accessTokenFromSession}`,
  };

  let response = await fetch(url, options);

  //Проверяем наличие аутентификации пользователя
  if (response.status === 401) {
    //Проверяем наличие refreshToken в сессии
    if (!refreshTokenFromSession) {
      throw new Error('RefreshToken is missing');
    }

    //Получение от Backend нового accessToken с помощью refreshToken, хранящегося в сессии
    const newAccessToken = await refreshToken(refreshTokenFromSession);

    if (newAccessToken) {
      /*      options.headers = {
              ...options.headers,
              'Authorization': `Bearer ${ newAccessToken }`
            }*/

      //Чтобы добавить свойство Authorization в заголовки запроса, пришлось создать интерфейс FetchOptions
      options.headers.Authorization = `Bearer ${newAccessToken}`;

      //Повторяем запрос с новым accessToken
      response = await fetch(url, options);
    }

    return response;
  }
};
