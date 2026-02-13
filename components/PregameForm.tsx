"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface PregameFormProps {
  defaultPlayer: string;
  onSubmit: (params: {
    gameName: string;
    tagLine: string;
    champion: string;
    role: string;
    opponent?: string;
  }) => void;
  isLoading: boolean;
}

const ROLES = ["TOP", "JUNGLE", "MID", "ADC", "SUPPORT"] as const;

export function PregameForm({ defaultPlayer, onSubmit, isLoading }: PregameFormProps) {
  const [player, setPlayer] = useState(defaultPlayer);
  const [champion, setChampion] = useState("");
  const [role, setRole] = useState("");
  const [opponent, setOpponent] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const [gameName, tagLine] = player.split("#");
    if (!gameName || !tagLine || !champion || !role) return;

    onSubmit({
      gameName: gameName.trim(),
      tagLine: tagLine.trim(),
      champion: champion.trim(),
      role,
      opponent: opponent.trim() || undefined,
    });
  };

  const isValid = player.includes("#") && champion.trim() !== "" && role !== "";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Player (GameName#TagLine)</label>
        <Input
          placeholder="GameName#TagLine"
          value={player}
          onChange={(e) => setPlayer(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Champion</label>
        <Input
          placeholder="e.g. Jinx"
          value={champion}
          onChange={(e) => setChampion(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Role</label>
        <Select value={role} onValueChange={setRole}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select role" />
          </SelectTrigger>
          <SelectContent>
            {ROLES.map((r) => (
              <SelectItem key={r} value={r}>
                {r}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Opponent Champion (optional)</label>
        <Input
          placeholder="e.g. Caitlyn"
          value={opponent}
          onChange={(e) => setOpponent(e.target.value)}
        />
      </div>

      <Button type="submit" disabled={isLoading || !isValid} className="w-full">
        {isLoading ? "Generating Brief..." : "Generate Pre-Game Brief"}
      </Button>
    </form>
  );
}
