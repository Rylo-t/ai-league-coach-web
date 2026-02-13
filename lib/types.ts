export interface PlayerInfo {
  puuid: string;
  gameName: string;
  tagLine: string;
  rank: string;
}

export interface MatchRow {
  id: string;
  riot_match_id: string;
  patch_version: string;
  game_mode: string;
  game_duration: number;
  played_at: string;
  champion_id: number;
  champion_name: string;
  role: string;
  kills: number;
  deaths: number;
  assists: number;
  cs_total: number;
  cs_per_min: number;
  vision_score: number;
  damage_dealt: number;
  gold_earned: number;
}

export interface MatchListResponse {
  matches: MatchRow[];
}

export interface PregameBrief {
  summary: string;
  matchupTips: string[];
  buildRecommendation: string;
  personalWarnings: string[];
  tone: "encouraging" | "direct" | "tough_love";
}

export interface PregameResponse {
  brief: PregameBrief | null;
  matchup: {
    champion: string;
    role: string;
    opponent: string | null;
    winRate: number | null;
  };
  build: {
    items: Array<{ name: string; description: string }>;
    runes: unknown;
  };
  playerProfile: {
    patternsCount: number;
    championStatsAvailable: boolean;
    gamesAnalyzed: number;
  };
  coachingAvailable: boolean;
  generatedAt: string;
}

export interface DeathDetail {
  deathNumber: number;
  minuteMark: string;
  killer: { championName: string; role: string };
  assistants: string[];
  category: string;
  wasUnderTower: boolean;
}

export interface CoachingResult {
  summary: string;
  keyInsights: string[];
  deathBreakdown: string;
  actionItems: string[];
  tone: "encouraging" | "direct" | "tough_love";
}

export interface ComparisonStat {
  actual: number;
  baseline: number;
  rating: string;
}

export interface AnalysisResponse {
  match: {
    matchId: string;
    champion: string;
    role: string;
    win: boolean;
    duration: number;
  };
  comparison: {
    cs: ComparisonStat;
    kda: { actual: string; kills: number; deaths: number; assists: number; rating: string };
    vision: ComparisonStat;
    damage: ComparisonStat;
    overall: string;
    baselineAvailable: boolean;
  };
  deaths: DeathDetail[];
  coaching: CoachingResult | null;
  patterns: Array<{
    patternType: string;
    description: string;
    confidence: number;
    timesDetected: number;
  }>;
  timeline: Record<string, unknown> | null;
  coachingAvailable: boolean;
  analyzedAt: string;
  cached: boolean;
}
