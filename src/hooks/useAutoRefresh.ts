'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { DashboardData } from '@/lib/types';

const REFRESH_INTERVAL = 60_000; // 60 Sekunden

export function useAutoRefresh() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [secondsUntilRefresh, setSecondsUntilRefresh] = useState(60);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const lastFetchTime = useRef<number>(Date.now());

  const fetchData = useCallback(async () => {
    try {
      const kpiRes = await fetch('/api/kpis');

      if (kpiRes.ok) {
        const kpiJson = await kpiRes.json();
        setData(kpiJson);
        setError(null);
        setLastUpdate(new Date()); // Nur bei Erfolg aktualisieren
      } else {
        setError('Daten konnten nicht geladen werden');
      }
    } catch (err) {
      console.error('Fetch error:', err);
      setError('Verbindung zum Server fehlgeschlagen');
    } finally {
      setIsLoading(false);
      lastFetchTime.current = Date.now();
    }
  }, []);

  // Initial fetch + refresh interval
  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, REFRESH_INTERVAL);
    return () => clearInterval(interval);
  }, [fetchData]);

  // Countdown synchronisiert mit dem tatsaechlichen Fetch-Zyklus
  useEffect(() => {
    const countdown = setInterval(() => {
      const elapsed = Date.now() - lastFetchTime.current;
      const remaining = Math.max(0, Math.ceil((REFRESH_INTERVAL - elapsed) / 1000));
      setSecondsUntilRefresh(remaining || 60);
    }, 1000);
    return () => clearInterval(countdown);
  }, []);

  return { data, lastUpdate, secondsUntilRefresh, isLoading, error };
}
