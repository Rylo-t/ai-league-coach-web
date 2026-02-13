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

  async lookupPlayer(gameName: string, tagLine: string, region?: string): Promise<PlayerInfo> {
    const query = region ? `?region=${region}` : "";
    return this.fetch<PlayerInfo>(
      `/api/player/${encodeURIComponent(gameName)}/${encodeURIComponent(tagLine)}${query}`
    );
  }

  async getMatches(gameName: string, tagLine: string, limit = 20, region?: string): Promise<MatchListResponse> {
    const params = new URLSearchParams({ limit: String(limit) });
    if (region) params.set("region", region);
    return this.fetch<MatchListResponse>(
      `/api/player/${encodeURIComponent(gameName)}/${encodeURIComponent(tagLine)}/matches?${params}`
    );
  }

  async getPregameBrief(params: {
    gameName: string;
    tagLine: string;
    champion: string;
    role: string;
    opponent?: string;
    region?: string;
  }): Promise<PregameResponse> {
    const query = new URLSearchParams({
      gameName: params.gameName,
      tagLine: params.tagLine,
      champion: params.champion,
      role: params.role,
    });
    if (params.opponent) query.set("opponent", params.opponent);
    if (params.region) query.set("region", params.region);
    return this.fetch<PregameResponse>(`/api/pregame?${query}`);
  }

  async analyzeMatch(matchId: string, gameName: string, tagLine: string, region?: string): Promise<AnalysisResponse> {
    const params = new URLSearchParams({ gameName, tagLine });
    if (region) params.set("region", region);
    return this.fetch<AnalysisResponse>(
      `/api/analysis/match/${encodeURIComponent(matchId)}?${params}`,
      { method: "POST" }
    );
  }
}

export const api = new ApiClient();
