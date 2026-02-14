"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { MatchList } from "@/components/MatchList";
import { MatchDetail } from "@/components/MatchDetail";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/lib/api";
import type { MatchRow, AnalysisResponse } from "@/lib/types";

function MatchesContent() {
  const searchParams = useSearchParams();
  const playerParam = searchParams.get("player") ?? "";
  const region = searchParams.get("region") ?? undefined;
  const [gameName, tagLine] = playerParam.split("-");

  const [matches, setMatches] = useState<MatchRow[]>([]);
  const [selectedMatchId, setSelectedMatchId] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<AnalysisResponse | null>(null);
  const [isLoadingMatches, setIsLoadingMatches] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!gameName || !tagLine) return;
    setIsLoadingMatches(true);
    api.getMatches(gameName, tagLine, 10, region)
      .then((data) => setMatches(data.matches))
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load matches"))
      .finally(() => setIsLoadingMatches(false));
  }, [gameName, tagLine, region]);

  const handleSelectMatch = (riotMatchId: string) => {
    setSelectedMatchId(riotMatchId);
    setAnalysis(null);
  };

  const handleAnalyze = async () => {
    if (!selectedMatchId || !gameName || !tagLine) return;
    setIsAnalyzing(true);
    setError(null);
    try {
      const data = await api.analyzeMatch(selectedMatchId, gameName, tagLine, region);
      setAnalysis(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Analysis failed");
    } finally {
      setIsAnalyzing(false);
    }
  };

  if (!gameName || !tagLine) {
    return <p className="text-muted-foreground">No player specified. Search from the homepage first.</p>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Match History — {gameName}#{tagLine}</h1>
      {error && <p className="text-destructive">{error}</p>}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          {isLoadingMatches ? (
            <div className="space-y-2">
              {Array.from({ length: 5 }).map((_, i) => (<Skeleton key={i} className="h-14 w-full" />))}
            </div>
          ) : (
            <MatchList matches={matches} selectedMatchId={selectedMatchId} onSelect={handleSelectMatch} />
          )}
        </div>
        <div>
          {selectedMatchId && !analysis && (
            <div className="text-center py-8">
              <Button onClick={handleAnalyze} disabled={isAnalyzing} size="lg">
                {isAnalyzing ? "Analyzing..." : "Analyze Match"}
              </Button>
            </div>
          )}
          {analysis && <MatchDetail analysis={analysis} />}
        </div>
      </div>
    </div>
  );
}

export default function MatchesPage() {
  return (
    <Suspense>
      <MatchesContent />
    </Suspense>
  );
}
