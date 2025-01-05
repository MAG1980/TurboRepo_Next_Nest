"use server"
import { jwtVerify, SignJWT } from "jose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export type Session = {
  user: {
    id: string,
    name: string,
  },
  // accessToken: string,
  // refreshToken: string
}

//Кодируем секретный ключ
const secretKey = process.env.SESSION_SECRET_KEY
const encodedSecretKey = new TextEncoder().encode(secretKey)

/**
 * Сохранение полезной нагрузки в httpOnly cookie с названием session
 * @param payload
 */
export const createSession = async (payload: Session) => {
  //Время окончания срока действия сессии - 7 суток.
  const expiredAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)

  //Создаём подписанный кодированным ключом JWT-токен с данными полезной нагрузки
  const signedString = await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(encodedSecretKey)

  const cookieStore = await cookies()
  //Устанавливаем JWT-токен, хранящий полезную нагрузку, в cookie с названием session
  cookieStore.set('session', signedString, {
    //Делает cookies доступной только на сервере (недоступной в браузере).
    httpOnly: true,
    //Гарантирует, что файл cookie отправляется только по HTTPS-соединениям для дополнительной безопасности.
    secure: true,
    //Определяет точную дату истечения срока действия файла cookie.
    expires: expiredAt,
    //Браузер не отправляет файл cookie при межсайтовых запросах, например при запросах на загрузку изображений или фреймов
    //Защита от CSRF-атак.
    sameSite: 'lax',
    //Указывает путь, который должен существовать в запрашиваемом URL-адресе, чтобы браузер отправил заголовок Cookie.
    path: '/'
  })
}

/**
 * Извлечение полезной нагрузки из httpOnly cookie с названием session
 */
export const getSession = async (): Promise<Session | null> => {
  const cookieStore = await cookies()

  //Извлекаем JWT-токен, хранящий полезную нагрузку, из cookie с названием session
  const signedString = cookieStore.get('session')?.value

  if (!signedString) {
    return null
  }

  try {
    const { payload } = await jwtVerify(signedString, encodedSecretKey, {
      algorithms: ['HS256']
    })

    return payload as Session
  } catch (error) {
    console.error("Failed to verify the session: ", error)
    redirect('/auth/signin')
  }
}