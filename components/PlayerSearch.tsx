"use client";

import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { api } from "@/lib/api";

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

interface Suggestion {
  game_name: string;
  tag_line: string;
  region: string;
}

export function PlayerSearch({ onSearch, isLoading }: PlayerSearchProps) {
  const [riotId, setRiotId] = useState("");
  const [region, setRegion] = useState("na1");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleInputChange = (value: string) => {
    setRiotId(value);

    if (debounceRef.current) clearTimeout(debounceRef.current);

    const trimmed = value.trim();
    // Only search if no # yet and at least 2 chars
    if (trimmed.length >= 2 && !trimmed.includes("#")) {
      debounceRef.current = setTimeout(async () => {
        try {
          const data = await api.searchPlayers(trimmed);
          setSuggestions(data.results);
          setShowSuggestions(data.results.length > 0);
        } catch {
          setSuggestions([]);
          setShowSuggestions(false);
        }
      }, 300);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSelectSuggestion = (s: Suggestion) => {
    setRiotId(`${s.game_name}#${s.tag_line}`);
    const regionValue = s.region;
    if (REGIONS.some((r) => r.value === regionValue)) {
      setRegion(regionValue);
    }
    setShowSuggestions(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSuggestions(false);
    const trimmed = riotId.trim();
    if (!trimmed) return;
    const separatorIdx = trimmed.indexOf("#") !== -1 ? trimmed.indexOf("#") : trimmed.lastIndexOf(" ");
    if (separatorIdx === -1) return; // require gameName#tagLine
    const gameName = trimmed.slice(0, separatorIdx).trim();
    const tagLine = trimmed.slice(separatorIdx + 1).trim();
    if (gameName && tagLine) {
      onSearch(gameName, tagLine, region);
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
      <div className="relative flex-1" ref={wrapperRef}>
        <Input
          placeholder="GameName#TagLine"
          value={riotId}
          onChange={(e) => handleInputChange(e.target.value)}
          onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
          autoComplete="off"
        />
        {showSuggestions && (
          <div className="absolute z-50 w-full mt-1 bg-popover border border-border rounded-md shadow-lg overflow-hidden">
            {suggestions.map((s) => {
              const regionLabel = REGIONS.find((r) => r.value === s.region)?.label ?? s.region;
              return (
                <button
                  key={`${s.game_name}#${s.tag_line}-${s.region}`}
                  type="button"
                  className="w-full px-3 py-2 text-left text-sm hover:bg-accent/20 flex justify-between items-center"
                  onClick={() => handleSelectSuggestion(s)}
                >
                  <span>{s.game_name}#{s.tag_line}</span>
                  <span className="text-xs text-muted-foreground">{regionLabel}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>
      <Button type="submit" disabled={isLoading || !riotId.includes("#")}>
        {isLoading ? "Searching..." : "Search"}
      </Button>
    </form>
  );
}
