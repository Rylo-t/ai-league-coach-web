import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { PlayerInfo, MatchRow } from "@/lib/types";

interface PlayerCardProps {
  player: PlayerInfo;
  matches: MatchRow[];
  region?: string;
}

export function PlayerCard({ player, matches, region }: PlayerCardProps) {
  const playerParam = `${player.gameName}-${player.tagLine}`;

  const champCounts = new Map<string, number>();
  for (const m of matches) {
    const name = m.champion_name || `Champion_${m.champion_id}`;
    champCounts.set(name, (champCounts.get(name) ?? 0) + 1);
  }
  const topChampions = Array.from(champCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  return (
    <Card className="max-w-md mx-auto mt-6">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{player.gameName}#{player.tagLine}</span>
          <Badge variant="secondary">{player.rank}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="text-muted-foreground">Matches loaded</div>
          <div>{matches.length}</div>
          {topChampions.length > 0 && (
            <>
              <div className="text-muted-foreground">Top champions</div>
              <div>
                {topChampions.map(([name, count]) => (
                  <span key={name} className="mr-2">
                    {name} ({count})
                  </span>
                ))}
              </div>
            </>
          )}
        </div>

        <div className="flex gap-2">
          <Button asChild className="flex-1">
            <Link href={`/pregame?player=${encodeURIComponent(playerParam)}${region ? `&region=${region}` : ""}`}>
              Pre-Game Brief
            </Link>
          </Button>
          <Button asChild variant="secondary" className="flex-1">
            <Link href={`/matches?player=${encodeURIComponent(playerParam)}${region ? `&region=${region}` : ""}`}>
              Match History
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
