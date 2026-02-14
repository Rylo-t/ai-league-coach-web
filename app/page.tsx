"use client";

import { useState } from "react";
import { PlayerSearch } from "@/components/PlayerSearch";
import { PlayerCard } from "@/components/PlayerCard";
import { api } from "@/lib/api";
import type { PlayerInfo, MatchRow } from "@/lib/types";

export default function Home() {
  const [player, setPlayer] = useState<PlayerInfo | null>(null);
  const [matches, setMatches] = useState<MatchRow[]>([]);
  const [region, setRegion] = useState("na1");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (gameName: string, tagLine: string, selectedRegion: string) => {
    setIsLoading(true);
    setError(null);
    setPlayer(null);
    setMatches([]);
    setRegion(selectedRegion);

    try {
      const playerInfo = await api.lookupPlayer(gameName, tagLine, selectedRegion);
      setPlayer(playerInfo);

      const matchData = await api.getMatches(gameName, tagLine, 5, selectedRegion);
      setMatches(matchData.matches);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to look up player");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-2 pt-8">
        <h1 className="text-3xl font-bold">AI League Coach</h1>
        <p className="text-muted-foreground">
          Search for a player to get AI-powered coaching
        </p>
      </div>

      <PlayerSearch onSearch={handleSearch} isLoading={isLoading} />

      {error && (
        <p className="text-center text-destructive">{error}</p>
      )}

      {player && <PlayerCard player={player} matches={matches} region={region} />}
    </div>
  );
}
