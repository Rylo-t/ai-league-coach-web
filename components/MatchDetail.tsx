import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import type { AnalysisResponse } from "@/lib/types";

const ratingColors: Record<string, string> = {
  strong: "text-emerald-400",
  average: "text-amber-400",
  below_average: "text-orange-400",
  poor: "text-red-400",
};

const toneColors: Record<string, string> = {
  encouraging: "bg-emerald-500/20 text-emerald-400",
  direct: "bg-amber-500/20 text-amber-400",
  tough_love: "bg-red-500/20 text-red-400",
};

export function MatchDetail({ analysis }: { analysis: AnalysisResponse }) {
  const { match, comparison, deaths, coaching, patterns } = analysis;

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>{match.champion} — {match.role}</span>
            <Badge className={match.win ? "bg-emerald-500/20 text-emerald-400" : "bg-red-500/20 text-red-400"}>
              {match.win ? "Victory" : "Defeat"}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-4 text-sm">
            <div>
              <div className="text-muted-foreground">CS</div>
              <div className={ratingColors[comparison.cs.rating] ?? ""}>
                {comparison.cs.actual} <span className="text-muted-foreground">/ {comparison.cs.baseline}</span>
              </div>
            </div>
            <div>
              <div className="text-muted-foreground">KDA</div>
              <div className={ratingColors[comparison.kda.rating] ?? ""}>{comparison.kda.actual}</div>
            </div>
            <div>
              <div className="text-muted-foreground">Vision</div>
              <div className={ratingColors[comparison.vision.rating] ?? ""}>
                {comparison.vision.actual} <span className="text-muted-foreground">/ {comparison.vision.baseline}</span>
              </div>
            </div>
            <div>
              <div className="text-muted-foreground">Damage</div>
              <div className={ratingColors[comparison.damage.rating] ?? ""}>{comparison.damage.actual.toLocaleString()}</div>
            </div>
          </div>
          <div className="mt-2">
            <Badge variant="outline" className={ratingColors[comparison.overall] ?? ""}>Overall: {comparison.overall}</Badge>
          </div>
        </CardContent>
      </Card>

      {deaths.length > 0 && (
        <Card>
          <CardHeader><CardTitle className="text-base">Deaths ({deaths.length})</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              {deaths.map((d) => (
                <div key={d.deathNumber} className="flex justify-between">
                  <span>#{d.deathNumber} at {d.minuteMark} — killed by {d.killer.championName}{d.assistants.length > 0 && ` (+${d.assistants.length})`}</span>
                  <Badge variant="outline" className="text-xs">{d.category}{d.wasUnderTower ? " (tower)" : ""}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {coaching && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between text-base">
              Coaching
              <Badge className={toneColors[coaching.tone] ?? ""}>{coaching.tone}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>{coaching.summary}</p>
            <Separator />
            <div>
              <h4 className="font-semibold mb-2 text-sm">Key Insights</h4>
              <ul className="list-disc list-inside space-y-1 text-sm">
                {coaching.keyInsights.map((insight, i) => (<li key={i}>{insight}</li>))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2 text-sm text-primary">Action Items</h4>
              <ul className="space-y-1 text-sm">
                {coaching.actionItems.map((item, i) => (<li key={i} className="text-primary/80">{"\u2192"} {item}</li>))}
              </ul>
            </div>
          </CardContent>
        </Card>
      )}

      {patterns.length > 0 && (
        <Card>
          <CardHeader><CardTitle className="text-base">Patterns Detected</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              {patterns.map((p, i) => (
                <div key={i} className="flex items-center justify-between">
                  <span>{p.description}</span>
                  <Badge className="bg-purple-500/20 text-purple-400">{(p.confidence * 100).toFixed(0)}% ({p.timesDetected}x)</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
