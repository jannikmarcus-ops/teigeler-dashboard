'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        router.push('/');
        router.refresh();
      } else {
        setError('Falsches Passwort');
        setPassword('');
      }
    } catch {
      setError('Verbindung fehlgeschlagen');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dashboard-bg flex items-center justify-center px-4">
      <div className="bg-dashboard-card border border-dashboard-border rounded-2xl p-10 w-full max-w-sm">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <img
            src="/logo-white.png"
            alt="Teigeler & Partner"
            className="h-12 object-contain"
          />
        </div>

        {/* Titel */}
        <h1 className="text-lg font-semibold text-dashboard-text text-center mb-1">
          Team Dashboard
        </h1>
        <p className="text-sm text-dashboard-muted text-center mb-8">
          Zugang nur für Mitarbeiter
        </p>

        {/* Formular */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            placeholder="Passwort eingeben"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 bg-dashboard-bg border border-dashboard-border rounded-lg text-dashboard-text placeholder-dashboard-muted focus:outline-none focus:border-dashboard-accent transition-colors"
            autoFocus
          />

          {error && (
            <p className="text-red-400 text-sm text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={isLoading || !password}
            className="w-full py-3 bg-dashboard-accent text-white font-semibold rounded-lg hover:bg-dashboard-accent/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? 'Wird geprüft…' : 'Anmelden'}
          </button>
        </form>
      </div>
    </div>
  );
}
