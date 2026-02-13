"use client";

import type { PregameResponse } from "@/lib/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface PregameResultsProps {
  data: PregameResponse;
}

const toneBadgeClass: Record<string, string> = {
  encouraging: "bg-emerald-600 hover:bg-emerald-600 text-white",
  direct: "bg-amber-600 hover:bg-amber-600 text-white",
  tough_love: "bg-red-600 hover:bg-red-600 text-white",
};

export function PregameResults({ data }: PregameResultsProps) {
  const { brief, matchup, playerProfile } = data;

  return (
    <div className="space-y-4">
      {/* Coaching Brief */}
      {brief && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Coaching Brief</CardTitle>
              <Badge className={toneBadgeClass[brief.tone] ?? ""}>
                {brief.tone.replace("_", " ")}
              </Badge>
            </div>
            <CardDescription>{brief.summary}</CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Matchup Tips */}
            {brief.matchupTips.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold mb-2">Matchup Tips</h3>
                <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
                  {brief.matchupTips.map((tip, i) => (
                    <li key={i}>{tip}</li>
                  ))}
                </ol>
              </div>
            )}

            <Separator />

            {/* Build Recommendation */}
            {brief.buildRecommendation && (
              <div>
                <h3 className="text-sm font-semibold mb-2">Build Recommendation</h3>
                <p className="text-sm text-muted-foreground">{brief.buildRecommendation}</p>
              </div>
            )}

            {/* Personal Warnings */}
            {brief.personalWarnings.length > 0 && (
              <>
                <Separator />
                <div className="rounded-md border border-amber-500/50 bg-amber-500/10 p-3">
                  <h3 className="text-sm font-semibold text-orange-400 mb-2">
                    Personal Warnings
                  </h3>
                  <ul className="list-disc list-inside space-y-1 text-sm text-amber-300">
                    {brief.personalWarnings.map((warning, i) => (
                      <li key={i}>{warning}</li>
                    ))}
                  </ul>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      )}

      {/* Secondary Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Match Info</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
            {matchup.winRate !== null && (
              <>
                <dt className="text-muted-foreground">Matchup Win Rate</dt>
                <dd className="font-medium">{(matchup.winRate * 100).toFixed(1)}%</dd>
              </>
            )}
            <dt className="text-muted-foreground">Player Patterns</dt>
            <dd className="font-medium">{playerProfile.patternsCount}</dd>
            <dt className="text-muted-foreground">Games Analyzed</dt>
            <dd className="font-medium">{playerProfile.gamesAnalyzed}</dd>
          </dl>
        </CardContent>
      </Card>
    </div>
  );
}
