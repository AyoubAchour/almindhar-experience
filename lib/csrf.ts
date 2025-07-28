import { randomBytes } from 'crypto';
import { cookies } from 'next/headers';

const CSRF_TOKEN_NAME = 'csrf-token';
const CSRF_HEADER_NAME = 'x-csrf-token';

export async function generateCSRFToken(): Promise<string> {
  const token = randomBytes(32).toString('hex');
  const cookieStore = await cookies();
  
  cookieStore.set(CSRF_TOKEN_NAME, token, {
    httpOnly: true,
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24, // 24 hours
  });
  
  return token;
}

export async function validateCSRFToken(headerToken: string | null): Promise<boolean> {
  if (!headerToken) {
    return false;
  }
  
  const cookieStore = await cookies();
  const cookieToken = cookieStore.get(CSRF_TOKEN_NAME)?.value;
  
  if (!cookieToken) {
    return false;
  }
  
  // Constant-time comparison to prevent timing attacks
  return timingSafeEqual(headerToken, cookieToken);
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) {
    return false;
  }
  
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  
  return result === 0;
}

export function getCSRFToken(request: Request): string | null {
  return request.headers.get(CSRF_HEADER_NAME);
}