import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { MatchRow } from "@/lib/types";

interface MatchListProps {
  matches: MatchRow[];
  selectedMatchId: string | null;
  onSelect: (riotMatchId: string) => void;
}

export function MatchList({ matches, selectedMatchId, onSelect }: MatchListProps) {
  if (matches.length === 0) {
    return <p className="text-muted-foreground">No matches found.</p>;
  }

  return (
    <div className="space-y-2">
      {matches.map((match) => {
        const isSelected = match.riot_match_id === selectedMatchId;
        const durationMin = Math.floor(match.game_duration / 60);
        const date = new Date(match.played_at).toLocaleDateString();
        const kda = `${match.kills}/${match.deaths}/${match.assists}`;

        return (
          <Card
            key={match.riot_match_id}
            className={`cursor-pointer transition-colors hover:bg-accent/10 ${isSelected ? "border-primary" : ""}`}
            onClick={() => onSelect(match.riot_match_id)}
          >
            <CardContent className="py-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="font-medium">{match.champion_name || `Champion_${match.champion_id}`}</span>
                <Badge variant="outline" className="text-xs">{match.role}</Badge>
              </div>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <span>{kda}</span>
                <span>{durationMin}m</span>
                <span>{date}</span>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
