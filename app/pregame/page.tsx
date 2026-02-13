"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { PregameForm } from "@/components/PregameForm";
import { PregameResults } from "@/components/PregameResults";
import { api } from "@/lib/api";
import type { PregameResponse } from "@/lib/types";

function PregameContent() {
  const searchParams = useSearchParams();
  const playerParam = searchParams.get("player") ?? "";
  const regionParam = searchParams.get("region") ?? "na1";
  const defaultPlayer = playerParam.replace("-", "#");

  const [result, setResult] = useState<PregameResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (params: {
    gameName: string;
    tagLine: string;
    champion: string;
    role: string;
    opponent?: string;
    region?: string;
  }) => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = await api.getPregameBrief(params);
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate brief");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Pre-Game Brief</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <PregameForm defaultPlayer={defaultPlayer} defaultRegion={regionParam} onSubmit={handleSubmit} isLoading={isLoading} />
        <div>
          {error && <p className="text-destructive">{error}</p>}
          {result && <PregameResults data={result} />}
        </div>
      </div>
    </div>
  );
}

export default function PregamePage() {
  return (
    <Suspense>
      <PregameContent />
    </Suspense>
  );
}
