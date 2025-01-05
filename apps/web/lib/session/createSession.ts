'use server'
import { cookies } from "next/headers";
import { SignJWT } from "jose";
import { encodedSecretKey } from "@/lib/session/encodedSecretKey";
import type { Session } from "@/lib/session/Session.type";


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