"use client";

import { motion } from "framer-motion";

const countries = [
  { id: "US", name: "United States", risk: "Low", color: "rgba(34, 197, 94, 0.4)" },
  { id: "CN", name: "China", risk: "Moderate", color: "rgba(234, 179, 8, 0.4)" },
  { id: "RU", name: "Russia", risk: "High", color: "rgba(239, 68, 68, 0.4)" },
  { id: "EU", name: "European Union", risk: "Low", color: "rgba(34, 197, 94, 0.4)" },
  { id: "IN", name: "India", risk: "Moderate", color: "rgba(234, 179, 8, 0.4)" },
  { id: "BR", name: "Brazil", risk: "Moderate", color: "rgba(234, 179, 8, 0.4)" },
  { id: "ME", name: "Middle East", risk: "High", color: "rgba(239, 68, 68, 0.4)" },
];

export function RiskMap() {
  return (
    <div className="relative w-full h-[300px] bg-zinc-900/30 rounded-lg overflow-hidden flex items-center justify-center border border-zinc-800">
      <div className="absolute top-4 left-4 z-10">
        <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">Live Geopolitical Risk Map</h4>
        <div className="flex gap-4">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]" />
            <span className="text-[10px] text-zinc-400 font-medium">High Risk</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.5)]" />
            <span className="text-[10px] text-zinc-400 font-medium">Moderate</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
            <span className="text-[10px] text-zinc-400 font-medium">Stable</span>
          </div>
        </div>
      </div>

      {/* Simplified World Map SVG */}
      <svg
        viewBox="0 0 800 400"
        className="w-full h-full opacity-60"
        style={{ filter: "drop-shadow(0 0 20px rgba(0,0,0,0.5))" }}
      >
        <path
          d="M150,100 L250,100 L250,200 L150,200 Z" // North America
          fill={countries[0].color}
          stroke="#3f3f46"
          strokeWidth="0.5"
        />
        <path
          d="M500,80 L650,80 L650,180 L500,180 Z" // Eurasia
          fill={countries[1].color}
          stroke="#3f3f46"
          strokeWidth="0.5"
        />
        <path
          d="M550,50 L750,50 L750,120 L550,120 Z" // Russia
          fill={countries[2].color}
          stroke="#3f3f46"
          strokeWidth="0.5"
        />
        <path
          d="M380,80 L480,80 L480,180 L380,180 Z" // Europe
          fill={countries[3].color}
          stroke="#3f3f46"
          strokeWidth="0.5"
        />
        <path
          d="M550,190 L620,190 L620,280 L550,280 Z" // India
          fill={countries[4].color}
          stroke="#3f3f46"
          strokeWidth="0.5"
        />
        <path
          d="M200,220 L280,220 L280,350 L200,350 Z" // South America
          fill={countries[5].color}
          stroke="#3f3f46"
          strokeWidth="0.5"
        />
        <path
          d="M420,190 L520,190 L520,280 L420,280 Z" // Africa/Middle East
          fill={countries[6].color}
          stroke="#3f3f46"
          strokeWidth="0.5"
        />
      </svg>

      <div className="absolute bottom-4 right-4 flex flex-col items-end">
        <span className="text-[10px] font-mono text-primary animate-pulse">SYSTEM STATUS: ANALYZING...</span>
        <span className="text-[8px] font-mono text-zinc-600 uppercase tracking-tighter mt-1">Satellite Feed 14.28.A</span>
      </div>
    </div>
  );
}
