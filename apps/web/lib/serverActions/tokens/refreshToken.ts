'use server';
/**
 * Получение из API и установка в session-cookie новых токенов с помощью oldRefreshToken, хранящегося в cookie
 * Возвращает accessToken
 * @param oldRefreshToken string
 */
export const refreshToken = async (
  oldRefreshToken: string
): Promise<string | null> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/refresh`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        //Название свойства, содержащего refreshToken, должно совпадать с названием, которое ожидает RefreshTokenStrategy
        body: JSON.stringify({ refresh: oldRefreshToken }),
      }
    );

    if (!response.ok) {
      throw new Error('Failed to refresh token');
    }

    const { accessToken, refreshToken } = await response.json();
    //Установка новых токенов в session-cookie
    const updatedResponse = await fetch(
      `http://localhost:3000/api/auth/update`,
      {
        method: 'POST',
        body: JSON.stringify({ accessToken, refreshToken }),
      }
    );

    if (!updatedResponse.ok) {
      throw new Error('Failed to update user JWT-tokens');
    }

    return accessToken;
  } catch (error) {
    console.error('Failed to refresh token', error);
    return null;
  }
};
