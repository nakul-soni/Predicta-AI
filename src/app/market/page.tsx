"use client";

import { useEffect, useState } from "react";
import { Shell } from "@/components/shell";
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  Search, 
  RefreshCcw,
  BarChart2,
  TrendingUp,
  Activity,
  DollarSign
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

type MarketData = {
  symbol: string;
  c: number; // Current price
  d: number; // Change
  dp: number; // Percent change
  h: number; // High
  l: number; // Low
  o: number; // Open
  pc: number; // Previous close
};

type MarketSummary = {
  stocks: MarketData[];
  indices: MarketData[];
  forex: MarketData[];
  commodities: MarketData[];
};

const tabs = [
  { id: "stocks", label: "Stocks", icon: BarChart2 },
  { id: "indices", label: "Indices", icon: Activity },
  { id: "forex", label: "Forex", icon: DollarSign },
  { id: "commodities", label: "Commodities", icon: TrendingUp },
];

export default function MarketPage() {
  const [activeTab, setActiveTab] = useState("stocks");
  const [data, setData] = useState<MarketSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/market?type=summary");
      const result = await res.json();
      setData(result);
    } catch (error) {
      console.error("Failed to fetch market data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 60000); // Refresh every minute
    return () => clearInterval(interval);
  }, []);

  const getFilteredData = () => {
    if (!data) return [];
    const currentData = data[activeTab as keyof MarketSummary] || [];
    if (!searchQuery) return currentData;
    return currentData.filter(item => 
      item.symbol.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const filteredData = getFilteredData();

  return (
    <Shell>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Market & Asset Data</h1>
            <p className="text-sm text-zinc-500">Real-time market intelligence and performance metrics.</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-zinc-500" />
              <input
                type="text"
                placeholder="Search symbol..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-64 rounded-md bg-zinc-900 border bb-border py-2 pl-9 pr-4 text-sm text-zinc-300 focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <button 
              onClick={fetchData}
              disabled={loading}
              className="p-2 rounded-md bg-zinc-900 border bb-border text-zinc-400 hover:text-white transition-colors disabled:opacity-50"
            >
              <RefreshCcw className={cn("h-4 w-4", loading && "animate-spin")} />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 border-b bb-border">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors border-b-2 -mb-[2px]",
                activeTab === tab.id
                  ? "border-primary text-primary bg-primary/5"
                  : "border-transparent text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/50"
              )}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Market Grid / Table */}
        <div className="bb-card rounded-lg overflow-hidden border bb-border">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-zinc-900/50 border-b bb-border">
                  <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase tracking-wider">Symbol</th>
                  <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase tracking-wider text-right">Price</th>
                  <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase tracking-wider text-right">Change</th>
                  <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase tracking-wider text-right">% Change</th>
                  <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase tracking-wider text-right">High</th>
                  <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase tracking-wider text-right">Low</th>
                  <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y bb-border">
                {loading && !data ? (
                  Array.from({ length: 8 }).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td colSpan={7} className="px-6 py-4">
                        <div className="h-4 bg-zinc-800 rounded w-full" />
                      </td>
                    </tr>
                  ))
                ) : filteredData.length > 0 ? (
                  filteredData.map((asset) => (
                    <tr 
                      key={asset.symbol} 
                      className="hover:bg-zinc-900/30 transition-colors cursor-pointer group"
                      onClick={() => window.location.href = `/market/${asset.symbol}`}
                    >
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-white group-hover:text-primary transition-colors">{asset.symbol}</span>
                          <span className="text-[10px] text-zinc-500 uppercase">{activeTab.slice(0, -1)}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="text-sm font-medium text-white">
                          {asset.c?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })}
                        </span>
                      </td>
                      <td className={`px-6 py-4 text-right text-sm font-medium ${asset.d >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {asset.d >= 0 ? '+' : ''}{asset.d?.toFixed(2)}
                      </td>
                      <td className={`px-6 py-4 text-right text-sm font-bold ${asset.dp >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        <div className="flex items-center justify-end gap-1">
                          {asset.dp >= 0 ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                          {Math.abs(asset.dp || 0).toFixed(2)}%
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right text-sm text-zinc-400">
                        {asset.h?.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 text-right text-sm text-zinc-400">
                        {asset.l?.toFixed(2)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5">
                          <div className={cn("h-1.5 w-1.5 rounded-full", asset.dp >= 0 ? 'bg-green-500' : 'bg-red-500')} />
                          <span className="text-[10px] font-bold text-zinc-500 uppercase">
                            {asset.dp >= 0 ? 'Strong' : 'Weak'}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-zinc-500 text-sm">
                      No assets found matching your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Market Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bb-card p-5 rounded-lg border bb-border">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="h-4 w-4 text-green-500" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Top Gainers</h3>
            </div>
            <div className="space-y-3">
              {[...STOCKS, ...INDICES, ...FOREX, ...COMMODITIES]
                .map(s => {
                  const allData = data ? [...data.stocks, ...data.indices, ...data.forex, ...data.commodities] : [];
                  return allData.find(d => d.symbol === s);
                })
                .filter(Boolean)
                .sort((a, b) => (b?.dp || 0) - (a?.dp || 0))
                .slice(0, 3)
                .map((asset, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">{asset?.symbol}</span>
                    <span className="text-xs font-bold text-green-500">+{asset?.dp?.toFixed(2)}%</span>
                  </div>
                ))}
            </div>
          </div>
          
          <div className="bb-card p-5 rounded-lg border bb-border">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="h-4 w-4 text-red-500 rotate-180" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Top Losers</h3>
            </div>
            <div className="space-y-3">
              {[...STOCKS, ...INDICES, ...FOREX, ...COMMODITIES]
                .map(s => {
                  const allData = data ? [...data.stocks, ...data.indices, ...data.forex, ...data.commodities] : [];
                  return allData.find(d => d.symbol === s);
                })
                .filter(Boolean)
                .sort((a, b) => (a?.dp || 0) - (b?.dp || 0))
                .slice(0, 3)
                .map((asset, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">{asset?.symbol}</span>
                    <span className="text-xs font-bold text-red-500">{asset?.dp?.toFixed(2)}%</span>
                  </div>
                ))}
            </div>
          </div>

          <div className="bb-card p-5 rounded-lg border bb-border">
            <div className="flex items-center gap-2 mb-4">
              <Activity className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Market Sentiment</h3>
            </div>
            <div className="flex flex-col justify-center h-full pb-4">
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-2xl font-bold text-white">BULLISH</span>
                <span className="text-xs text-zinc-500">72% confidence</span>
              </div>
              <div className="h-2 w-full bg-zinc-800 rounded-full overflow-hidden">
                <div className="h-full bg-primary w-[72%]" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Shell>
  );
}

const STOCKS = ["AAPL", "MSFT", "TSLA", "NVDA", "AMZN", "META", "BRK.B", "V", "JPM", "UNH"];
const INDICES = ["SPY", "QQQ", "DIA", "IWM", "VTI"];
const FOREX = ["FX:EURUSD", "FX:GBPUSD", "FX:USDJPY", "FX:USDCHF", "FX:AUDUSD"];
const COMMODITIES = ["OANDA:XAU_USD", "OANDA:XAG_USD", "OANDA:BCO_USD", "OANDA:WTICO_USD", "OANDA:NGAS_USD"];
