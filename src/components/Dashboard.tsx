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
      <div className="min-h-screen bg-tp-paper flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-tp-forest border-t-transparent rounded-full animate-spin mx-auto mb-6" />
          <p className="text-2xl text-tp-stone">Dashboard wird geladen...</p>
        </div>
      </div>
    );
  }

  if (!data?.makler) {
    return (
      <div className="min-h-screen bg-tp-paper flex items-center justify-center px-6">
        <div className="text-center">
          <p className="text-2xl sm:text-3xl text-tp-forest font-semibold mb-4">Keine Daten verfuegbar</p>
          <p className="text-lg sm:text-xl text-tp-stone">
            Pruefe die Notion API Konfiguration unter /api/setup
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-tp-paper px-4 sm:px-6 lg:px-8 py-4 sm:py-6 flex flex-col gap-4 sm:gap-5">
      {/* Header */}
      <header className="flex items-center justify-between gap-4">
        <img
          src="/logo.png"
          alt="Teigeler & Partner Immobilien"
          className="h-8 sm:h-10 lg:h-11 w-auto"
        />
        <Clock />
      </header>

      {/* Team KPIs */}
      <section>
        <TeamSummary makler={data.makler} />
      </section>

      {/* Main Grid: Leaderboard + Year Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5">
        <div className="flex flex-col gap-4 sm:gap-5">
          <Leaderboard makler={data.makler} />
          <AktuellImVerkauf makler={data.makler} />
        </div>
        <div className="flex flex-col gap-4 sm:gap-5">
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
