import { NextRequest, NextResponse } from 'next/server';

// Login und Freigabe prüft das Teigeler & Partner Portal (Traefik forwardAuth, Freigabe „dashboard“).
// Traefik setzt danach das Proxy-Geheimnis X-Tp-Proxy. Ohne dieses Geheimnis gibt es nichts zu sehen,
// auch nicht für jemanden, der die Adresse kennt oder im Docker-Netz direkt anfragt.
// Ist DASHBOARD_PROXY_GEHEIMNIS nicht gesetzt (lokale Entwicklung), ist das Dashboard offen.
export function middleware(request: NextRequest) {
  const geheimnis = process.env.DASHBOARD_PROXY_GEHEIMNIS;
  if (!geheimnis) {
    return NextResponse.next();
  }
  if (request.headers.get('x-tp-proxy') !== geheimnis) {
    return new NextResponse('Bitte über team.teigelerundpartner.de anmelden.', { status: 403 });
  }
  return NextResponse.next();
}

export const config = {
  // Alles außer den statischen Build-Dateien. Die Pfade sind relativ zum basePath /dashboard.
  matcher: ['/', '/((?!_next/static|_next/image).*)'],
};
