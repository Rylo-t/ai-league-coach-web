"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface PlayerSearchProps {
  onSearch: (gameName: string, tagLine: string) => void;
  isLoading: boolean;
}

export function PlayerSearch({ onSearch, isLoading }: PlayerSearchProps) {
  const [riotId, setRiotId] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const [gameName, tagLine] = riotId.split("#");
    if (gameName && tagLine) {
      onSearch(gameName.trim(), tagLine.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 max-w-md mx-auto">
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
