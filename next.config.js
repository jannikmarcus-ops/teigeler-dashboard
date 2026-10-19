/** @type {import('next').NextConfig} */
// Läuft seit 20.10.2026 auf dem VPS unter team.teigelerundpartner.de/dashboard hinter dem Login des
// Teigeler & Partner Portals. standalone: schlankes Image für den Container.
const nextConfig = {
  basePath: '/dashboard',
  output: 'standalone',
};

module.exports = nextConfig;
