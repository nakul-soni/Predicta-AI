"use client";

import { Bell, User, Menu, ChevronDown } from "lucide-react";

export function Header() {
  return (
    <header className="flex h-16 items-center justify-between border-b bb-border px-8 bb-bg sticky top-0 z-10">
      <div className="flex items-center gap-4">
        <button className="lg:hidden text-zinc-400 hover:text-white">
          <Menu className="h-6 w-6" />
        </button>
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-widest text-zinc-500">Market Status:</span>
          <span className="flex items-center gap-1.5 text-xs font-medium text-green-500">
            <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
            OPEN
          </span>
          <span className="mx-2 h-3 w-px bg-zinc-800" />
          <span className="text-xs font-medium text-zinc-300">S&P 500: 5,123.42 (+0.45%)</span>
          <span className="text-xs font-medium text-zinc-300">NASDAQ: 16,274.94 (+0.12%)</span>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <button className="relative text-zinc-400 hover:text-white">
          <Bell className="h-5 w-5" />
          <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-primary" />
        </button>
        <div className="h-8 w-px bg-zinc-800" />
        <button className="flex items-center gap-2 rounded-md px-2 py-1 hover:bg-zinc-900 transition-colors">
          <div className="h-7 w-7 rounded-full bg-zinc-800 flex items-center justify-center">
            <User className="h-4 w-4 text-zinc-400" />
          </div>
          <span className="text-sm font-medium text-zinc-300">JD</span>
          <ChevronDown className="h-4 w-4 text-zinc-500" />
        </button>
      </div>
    </header>
  );
}
