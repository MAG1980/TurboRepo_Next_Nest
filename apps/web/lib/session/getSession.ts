'use server'
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { redirect } from "next/navigation";
import { Session, getEncodedSecretKey } from "@/lib/session";

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
    const { payload } = await jwtVerify(signedString, await getEncodedSecretKey(), {
      algorithms: ['HS256']
    })

    return payload as Session
  } catch (error) {
    console.error("Failed to verify the session: ", error)
    redirect('/auth/signin')
  }
}