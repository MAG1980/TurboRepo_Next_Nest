import { updateTokens } from '@/lib/serverActions/tokens/updateTokens';

export const refreshToken = async (oldRefreshToken: string) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/refresh`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        //Название свойства, содержащего refreshToken. должно совпадать с названием, которое ожидает RefreshTokenStrategy
        body: JSON.stringify({ refresh: oldRefreshToken }),
      }
    );

    if (!response.ok) {
      throw new Error('Failed to refresh token');
    }

    const { accessToken, refreshToken } = await response.json();
    await updateTokens({ accessToken, refreshToken });

    return accessToken;
  } catch (error) {
    console.error('Failed to refresh token', error);
    return null;
  }
};
