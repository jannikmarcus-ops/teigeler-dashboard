import { NextRequest, NextResponse } from 'next/server';
import { generateToken, AUTH_COOKIE_NAME } from '@/lib/auth';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Öffentliche Routen ohne Auth
  if (
    pathname === '/login' ||
    pathname.startsWith('/api/auth')
  ) {
    return NextResponse.next();
  }

  // Kein Passwort konfiguriert → kein Schutz (Entwicklung)
  const password = process.env.DASHBOARD_PASSWORD;
  if (!password) {
    return NextResponse.next();
  }

  // Auth-Cookie prüfen
  const authCookie = request.cookies.get(AUTH_COOKIE_NAME)?.value;
  const expectedToken = await generateToken(password);

  if (authCookie !== expectedToken) {
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Alle Routen schützen außer:
     * - _next/static (statische Dateien)
     * - _next/image (Bild-Optimierung)
     * - favicon.ico
     * - Öffentliche Assets (Logo etc.)
     */
    '/((?!_next/static|_next/image|favicon.ico|logo-white.png|logo.png).*)',
  ],
};
