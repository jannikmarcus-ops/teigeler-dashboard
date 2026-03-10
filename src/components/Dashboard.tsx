'use client';

import { useAutoRefresh } from '@/hooks/useAutoRefresh';
import Clock from './Clock';
import TeamSummary from './TeamSummary';
import Leaderboard from './Leaderboard';
import YearProgress from './YearProgress';
import AktuellImVerkauf from './AktuellImVerkauf';
import TeamZiel from './TeamZiel';
import StatusBar from './StatusBar';

export default function Dashboard() {
  const { data, lastUpdate, secondsUntilRefresh, isLoading, error } =
    useAutoRefresh();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-dashboard-bg flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-dashboard-accent border-t-transparent rounded-full animate-spin mx-auto mb-6" />
          <p className="text-2xl text-dashboard-muted">Dashboard wird geladen...</p>
        </div>
      </div>
    );
  }

  if (!data?.makler) {
    return (
      <div className="min-h-screen bg-dashboard-bg flex items-center justify-center">
        <div className="text-center">
          <p className="text-3xl text-dashboard-text mb-4">Keine Daten verfuegbar</p>
          <p className="text-xl text-dashboard-muted">
            Pruefe die Notion API Konfiguration unter /api/setup
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-dashboard-bg px-8 py-6 flex flex-col overflow-hidden">
      {/* Header */}
      <header className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-6">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo.png"
            alt="Teigeler & Partner Immobilien"
            className="h-11 w-auto brightness-0 invert"
          />
        </div>
        <Clock />
      </header>

      {/* Team KPIs */}
      <section className="mb-5">
        <TeamSummary makler={data.makler} />
      </section>

      {/* Main Grid: Leaderboard + Year Progress */}
      <div className="grid grid-cols-2 gap-5 flex-1 min-h-0">
        <div className="flex flex-col gap-5">
          <Leaderboard makler={data.makler} />
          <AktuellImVerkauf makler={data.makler} />
        </div>
        <div className="flex flex-col gap-5">
          <TeamZiel makler={data.makler} />
          <YearProgress makler={data.makler} />
        </div>
      </div>

      {/* Status Bar */}
      <StatusBar
        lastUpdate={lastUpdate}
        secondsUntilRefresh={secondsUntilRefresh}
        error={error}
        isMockData={data.isMockData}
      />
    </div>
  );
}
