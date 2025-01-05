'use server'
export const getEncodedSecretKey = async () => {

  const secretKey = process.env.SESSION_SECRET_KEY

  if (!secretKey) {
    throw new Error('Missing SESSION_SECRET_KEY environment variable')
  }
//Кодируем секретный ключ
  return new TextEncoder().encode(secretKey)
}