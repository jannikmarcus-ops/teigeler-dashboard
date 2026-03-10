export interface MaklerRecord {
  name: string;
  // Die 4 Kern-KPIs (Jahresdaten)
  umsatz: number;
  verkaufte_objekte: number;
  neue_objekte: number;
  einwertungstermine: number;
  // Zusaetzliche Felder
  cr_jahr: number;
  aktuell_im_verkauf: number;
  // Jahresziel & Fortschritt
  umsatz_jahr: number;
  jahresziel: number;
  fortschritt: number;
  // Transaktionsvolumen (Gesamtvolumen aller Deals)
  transaktionsvolumen_jahr: number;
  // Team-Jahresziel (nur bei Jannik gefuellt)
  team_jahresziel: number;
  // Berechnete Felder
  score: number;
  rank: number;
}

export interface DashboardData {
  makler: MaklerRecord[];
  lastUpdate: string;
  isMockData?: boolean;
}
