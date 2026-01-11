"use client";

import { Shell } from "@/components/shell";
import { Settings as SettingsIcon } from "lucide-react";

export default function SettingsPage() {
  return (
    <Shell>
      <div className="flex flex-col items-center justify-center h-[60vh] text-center">
        <div className="h-16 w-16 rounded-full bg-zinc-900 flex items-center justify-center mb-4">
          <SettingsIcon className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">Platform Settings</h1>
        <p className="text-zinc-500 max-w-md">
          Configure your Predicta terminal, API connections, and autonomous agent parameters.
        </p>
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-4xl">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bb-card p-4 rounded-lg flex items-center gap-4">
              <div className="h-10 w-10 bg-zinc-800 rounded animate-pulse" />
              <div className="space-y-2 flex-1">
                <div className="h-3 w-1/2 bg-zinc-800 rounded animate-pulse" />
                <div className="h-2 w-3/4 bg-zinc-900 rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </Shell>
  );
}
