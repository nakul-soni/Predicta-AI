"use client";

import { Shell } from "@/components/shell";
import { Briefcase } from "lucide-react";

export default function PortfolioPage() {
  return (
    <Shell>
      <div className="flex flex-col items-center justify-center h-[60vh] text-center">
        <div className="h-16 w-16 rounded-full bg-zinc-900 flex items-center justify-center mb-4">
          <Briefcase className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">My Portfolio</h1>
        <p className="text-zinc-500 max-w-md">
          Track your assets, analyze performance, and receive AI-driven rebalancing recommendations.
        </p>
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-4xl">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bb-card p-6 rounded-lg flex flex-col gap-2">
              <div className="h-4 w-1/3 bg-zinc-800 rounded animate-pulse" />
              <div className="h-8 w-1/2 bg-zinc-900 rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </Shell>
  );
}
