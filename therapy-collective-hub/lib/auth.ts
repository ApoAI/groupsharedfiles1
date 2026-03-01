import { jwtVerify, SignJWT } from 'jose';

const getSecret = () => new TextEncoder().encode(process.env.SHARED_PASSWORD || 'default-secret-do-not-use-in-prod');

export async function signToken(payload: any) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('30d')
    .sign(getSecret());
}

export async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    return payload;
  } catch (err) {
    return null;
  }
}
