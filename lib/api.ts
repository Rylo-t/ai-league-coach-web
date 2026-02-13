import type {
  PlayerInfo,
  MatchListResponse,
  PregameResponse,
  AnalysisResponse,
} from "./types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

class ApiClient {
  private async fetch<T>(path: string, options?: RequestInit): Promise<T> {
    const res = await fetch(`${API_URL}${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
    });

    if (!res.ok) {
      const body = await res.json().catch(() => ({ error: "Unknown error" }));
      throw new Error(body.error || `API error: ${res.status}`);
    }

    return res.json();
  }

  async lookupPlayer(gameName: string, tagLine: string): Promise<PlayerInfo> {
    return this.fetch<PlayerInfo>(
      `/api/player/${encodeURIComponent(gameName)}/${encodeURIComponent(tagLine)}`
    );
  }

  async getMatches(gameName: string, tagLine: string, limit = 20): Promise<MatchListResponse> {
    return this.fetch<MatchListResponse>(
      `/api/player/${encodeURIComponent(gameName)}/${encodeURIComponent(tagLine)}/matches?limit=${limit}`
    );
  }

  async getPregameBrief(params: {
    gameName: string;
    tagLine: string;
    champion: string;
    role: string;
    opponent?: string;
  }): Promise<PregameResponse> {
    const query = new URLSearchParams({
      gameName: params.gameName,
      tagLine: params.tagLine,
      champion: params.champion,
      role: params.role,
    });
    if (params.opponent) query.set("opponent", params.opponent);
    return this.fetch<PregameResponse>(`/api/pregame?${query}`);
  }

  async analyzeMatch(matchId: string, gameName: string, tagLine: string): Promise<AnalysisResponse> {
    return this.fetch<AnalysisResponse>(
      `/api/analysis/match/${encodeURIComponent(matchId)}?gameName=${encodeURIComponent(gameName)}&tagLine=${encodeURIComponent(tagLine)}`,
      { method: "POST" }
    );
  }
}

export const api = new ApiClient();
