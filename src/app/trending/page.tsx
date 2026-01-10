"use client";

import { Shell } from "@/components/shell";
import { TrendingUp } from "lucide-react";

export default function TrendingPage() {
  return (
    <Shell>
      <div className="flex flex-col items-center justify-center h-[60vh] text-center">
        <div className="h-16 w-16 rounded-full bg-zinc-900 flex items-center justify-center mb-4">
          <TrendingUp className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">Trending Assets</h1>
        <p className="text-zinc-500 max-w-md">
          Discover what's moving in the markets with Predicta's proprietary momentum and volume anomaly detection.
        </p>
        <div className="mt-8 bb-card w-full max-w-4xl rounded-lg overflow-hidden">
          <div className="divide-y bb-border">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                   <div className="h-8 w-8 bg-zinc-800 rounded-full animate-pulse" />
                   <div className="h-4 w-24 bg-zinc-800 rounded animate-pulse" />
                </div>
                <div className="h-4 w-16 bg-zinc-900 rounded animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </Shell>
  );
}
