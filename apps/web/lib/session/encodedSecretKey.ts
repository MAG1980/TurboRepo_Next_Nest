const secretKey = process.env.SESSION_SECRET_KEY

if (!secretKey) {
  throw new Error('Missing SESSION_SECRET_KEY environment variable')
}
//Кодируем секретный ключ
export const encodedSecretKey = new TextEncoder().encode(secretKey)