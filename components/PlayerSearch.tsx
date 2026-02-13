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

export const REGIONS = [
  { value: "na1", label: "NA" },
  { value: "euw1", label: "EUW" },
  { value: "eun1", label: "EUNE" },
  { value: "kr", label: "KR" },
  { value: "br1", label: "BR" },
  { value: "la1", label: "LAN" },
  { value: "la2", label: "LAS" },
  { value: "oc1", label: "OCE" },
  { value: "tr1", label: "TR" },
  { value: "ru", label: "RU" },
  { value: "jp1", label: "JP" },
  { value: "ph2", label: "PH" },
  { value: "sg2", label: "SG" },
  { value: "th2", label: "TH" },
  { value: "tw2", label: "TW" },
  { value: "vn2", label: "VN" },
] as const;

interface PlayerSearchProps {
  onSearch: (gameName: string, tagLine: string, region: string) => void;
  isLoading: boolean;
}

export function PlayerSearch({ onSearch, isLoading }: PlayerSearchProps) {
  const [riotId, setRiotId] = useState("");
  const [region, setRegion] = useState("na1");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const [gameName, tagLine] = riotId.split("#");
    if (gameName && tagLine) {
      onSearch(gameName.trim(), tagLine.trim(), region);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 max-w-lg mx-auto">
      <Select value={region} onValueChange={setRegion}>
        <SelectTrigger className="w-24">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {REGIONS.map((r) => (
            <SelectItem key={r.value} value={r.value}>
              {r.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Input
        placeholder="GameName#TagLine"
        value={riotId}
        onChange={(e) => setRiotId(e.target.value)}
        className="flex-1"
      />
      <Button type="submit" disabled={isLoading || !riotId.includes("#")}>
        {isLoading ? "Searching..." : "Search"}
      </Button>
    </form>
  );
}
