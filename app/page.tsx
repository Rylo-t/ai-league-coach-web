"use client";

import { useState } from "react";
import { PlayerSearch, REGIONS } from "@/components/PlayerSearch";
import { PlayerCard } from "@/components/PlayerCard";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { api } from "@/lib/api";
import type { PlayerInfo, MatchRow } from "@/lib/types";

interface SearchResult {
  game_name: string;
  tag_line: string;
  region: string;
}

export default function Home() {
  const [player, setPlayer] = useState<PlayerInfo | null>(null);
  const [matches, setMatches] = useState<MatchRow[]>([]);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [region, setRegion] = useState("na1");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (gameName: string, tagLine: string, selectedRegion: string) => {
    setIsLoading(true);
    setError(null);
    setPlayer(null);
    setMatches([]);
    setSearchResults([]);
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

  const handleNameSearch = async (name: string) => {
    setIsLoading(true);
    setError(null);
    setPlayer(null);
    setMatches([]);
    setSearchResults([]);

    try {
      const data = await api.searchPlayers(name);
      if (data.results.length === 0) {
        setError(`No players found matching "${name}". Try searching with the full GameName#TagLine.`);
      } else {
        setSearchResults(data.results);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Search failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePickResult = (result: SearchResult) => {
    handleSearch(result.game_name, result.tag_line, result.region);
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-2 pt-8">
        <h1 className="text-3xl font-bold">AI League Coach</h1>
        <p className="text-muted-foreground">
          Search for a player to get AI-powered coaching
        </p>
      </div>

      <PlayerSearch onSearch={handleSearch} onNameSearch={handleNameSearch} isLoading={isLoading} />

      {error && (
        <p className="text-center text-destructive">{error}</p>
      )}

      {searchResults.length > 0 && (
        <div className="max-w-md mx-auto space-y-2">
          <p className="text-sm text-muted-foreground text-center">
            {searchResults.length} player{searchResults.length > 1 ? "s" : ""} found — click to view
          </p>
          {searchResults.map((r) => {
            const regionLabel = REGIONS.find((reg) => reg.value === r.region)?.label ?? r.region;
            return (
              <Card
                key={`${r.game_name}#${r.tag_line}-${r.region}`}
                className="cursor-pointer transition-colors hover:bg-accent/10"
                onClick={() => handlePickResult(r)}
              >
                <CardContent className="py-3 flex items-center justify-between">
                  <span className="font-medium">{r.game_name}#{r.tag_line}</span>
                  <Badge variant="outline">{regionLabel}</Badge>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {player && <PlayerCard player={player} matches={matches} region={region} />}
    </div>
  );
}
