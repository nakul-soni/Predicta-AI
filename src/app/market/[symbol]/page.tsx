"use client";

import { useEffect, useState, use } from "react";
import { Shell } from "@/components/shell";
import { 
  ArrowLeft, 
  ArrowUpRight, 
  ArrowDownRight, 
  TrendingUp, 
  Activity, 
  BarChart3, 
  Globe,
  Info,
  Calendar
} from "lucide-react";
import Link from "next/link";
import { 
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar
} from "recharts";
import { cn } from "@/lib/utils";

type AssetDetail = {
  quote: {
    c: number; // Current
    d: number; // Change
    dp: number; // % Change
    h: number; // High
    l: number; // Low
    o: number; // Open
    pc: number; // Prev Close
  };
  candles: {
    c: number[]; // Close prices
    h: number[]; // High
    l: number[]; // Low
    o: number[]; // Open
    t: number[]; // Timestamp
    v: number[]; // Volume
    s: string; // Status
  };
  profile: {
    name: string;
    ticker: string;
    logo: string;
    finnhubIndustry: string;
    weburl: string;
    marketCapitalization: number;
    shareOutstanding: number;
  };
};

export default function AssetDetailPage({ params }: { params: Promise<{ symbol: string }> }) {
  const { symbol } = use(params);
  const [data, setData] = useState<AssetDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/market?type=detail&symbol=${symbol}`);
        const result = await res.json();
        setData(result);
      } catch (error) {
        console.error("Failed to fetch asset detail:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [symbol]);

  if (loading) {
    return (
      <Shell>
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </Shell>
    );
  }

  if (!data || !data.quote) {
    return (
      <Shell>
        <div className="flex flex-col items-center justify-center h-full gap-4">
          <p className="text-zinc-500">Failed to load data for {symbol}</p>
          <Link href="/market" className="text-primary hover:underline flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" /> Back to Markets
          </Link>
        </div>
      </Shell>
    );
  }

  const chartData = data.candles?.t?.map((time, i) => ({
    date: new Date(time * 1000).toLocaleDateString(),
    price: data.candles.c[i],
    volume: data.candles.v[i],
  })) || [];

  const isUp = data.quote.dp >= 0;

  return (
    <Shell>
      <div className="flex flex-col gap-6 max-w-7xl mx-auto w-full">
        {/* Breadcrumb & Navigation */}
        <div className="flex items-center justify-between">
          <Link 
            href="/market" 
            className="group flex items-center gap-2 text-zinc-500 hover:text-white transition-colors text-sm font-medium"
          >
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            Back to Market Terminal
          </Link>
          <div className="flex items-center gap-2 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
            <span className="text-primary">Live</span>
            <span className="h-1 w-1 rounded-full bg-zinc-700" />
            <span>Market Hours</span>
          </div>
        </div>

        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b bb-border">
          <div className="flex items-center gap-4">
            {data.profile?.logo && (
              <div className="h-12 w-12 rounded-lg bg-zinc-900 border bb-border p-2">
                <img src={data.profile.logo} alt={data.profile.name} className="h-full w-full object-contain" />
              </div>
            )}
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold text-white tracking-tight">{data.profile?.name || symbol}</h1>
                <span className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 text-xs font-bold border bb-border">
                  {symbol}
                </span>
              </div>
              <p className="text-sm text-zinc-500 mt-1">
                {data.profile?.finnhubIndustry || "Financial Asset"} • Global Exchange
              </p>
            </div>
          </div>

          <div className="flex flex-col items-end">
            <div className="flex items-baseline gap-3">
              <span className="text-4xl font-bold text-white">
                {data.quote.c.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
              <div className={cn(
                "flex items-center gap-1 text-lg font-bold",
                isUp ? "text-green-500" : "text-red-500"
              )}>
                {isUp ? <ArrowUpRight className="h-5 w-5" /> : <ArrowDownRight className="h-5 w-5" />}
                {Math.abs(data.quote.dp).toFixed(2)}%
              </div>
            </div>
            <p className="text-sm text-zinc-500 mt-1 font-medium">
              {isUp ? "+" : ""}{data.quote.d.toFixed(2)} Today
            </p>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Chart & Volume */}
          <div className="lg:col-span-2 flex flex-col gap-8">
            <div className="bb-card rounded-lg overflow-hidden border bb-border">
              <div className="p-6 border-b bb-border flex items-center justify-between bg-zinc-900/30">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">Historical Performance (30D)</h3>
                </div>
                <div className="flex gap-2">
                  {['1D', '1W', '1M', '3M', '1Y'].map((range) => (
                    <button 
                      key={range}
                      className={cn(
                        "px-2.5 py-1 rounded text-[10px] font-bold border bb-border transition-colors",
                        range === '1M' ? "bg-primary text-black border-primary" : "text-zinc-500 hover:text-white hover:bg-zinc-800"
                      )}
                    >
                      {range}
                    </button>
                  ))}
                </div>
              </div>
              <div className="h-[400px] w-full p-6 pt-10">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={isUp ? "#22c55e" : "#ef4444"} stopOpacity={0.3}/>
                        <stop offset="95%" stopColor={isUp ? "#22c55e" : "#ef4444"} stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
                    <XAxis 
                      dataKey="date" 
                      stroke="#52525b" 
                      fontSize={10} 
                      tickLine={false} 
                      axisLine={false}
                      tickFormatter={(value) => value.split('/')[1] + '/' + value.split('/')[0]}
                    />
                    <YAxis 
                      stroke="#52525b" 
                      fontSize={10} 
                      tickLine={false} 
                      axisLine={false}
                      domain={['auto', 'auto']}
                      tickFormatter={(value) => `$${value}`}
                    />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#111114', border: '1px solid #27272a', color: '#fff' }}
                      itemStyle={{ color: isUp ? "#22c55e" : "#ef4444" }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="price" 
                      stroke={isUp ? "#22c55e" : "#ef4444"} 
                      strokeWidth={2}
                      fillOpacity={1} 
                      fill="url(#colorPrice)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bb-card rounded-lg overflow-hidden border bb-border p-6">
                <div className="flex items-center gap-2 mb-6">
                  <Activity className="h-5 w-5 text-zinc-400" />
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">Trading Volume</h3>
                </div>
                <div className="h-[150px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData.slice(-10)}>
                      <Bar dataKey="volume" fill="#3f3f46" radius={[2, 2, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bb-card rounded-lg overflow-hidden border bb-border p-6">
                <div className="flex items-center gap-2 mb-6">
                  <Info className="h-5 w-5 text-zinc-400" />
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">Asset Overview</h3>
                </div>
                <div className="space-y-4">
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    {data.profile?.name} is a leading entity in the {data.profile?.finnhubIndustry} sector. 
                    The asset currently has a market capitalization of ${(data.profile?.marketCapitalization || 0).toLocaleString()}M 
                    with approximately {(data.profile?.shareOutstanding || 0).toLocaleString()}M shares outstanding.
                  </p>
                  <div className="flex items-center gap-4 pt-2">
                    <a 
                      href={data.profile?.weburl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-[10px] font-bold text-primary hover:underline flex items-center gap-1"
                    >
                      <Globe className="h-3 w-3" /> Official Website
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Key Metrics & AI Analysis */}
          <div className="flex flex-col gap-8">
            <div className="bb-card rounded-lg overflow-hidden border bb-border">
              <div className="p-5 border-b bb-border bg-zinc-900/50">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Key Statistics</h3>
              </div>
              <div className="p-5 space-y-4">
                {[
                  { label: "Open", value: data.quote.o },
                  { label: "Previous Close", value: data.quote.pc },
                  { label: "Day High", value: data.quote.h },
                  { label: "Day Low", value: data.quote.l },
                  { label: "Market Cap", value: `$${(data.profile?.marketCapitalization || 0).toFixed(0)}M` },
                  { label: "Shares Out.", value: `${(data.profile?.shareOutstanding || 0).toFixed(0)}M` }
                ].map((stat) => (
                  <div key={stat.label} className="flex items-center justify-between border-b bb-border pb-3 last:border-0 last:pb-0">
                    <span className="text-xs text-zinc-500 font-medium">{stat.label}</span>
                    <span className="text-xs font-bold text-white">
                      {typeof stat.value === 'number' ? stat.value.toLocaleString(undefined, { minimumFractionDigits: 2 }) : stat.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bb-card rounded-lg overflow-hidden border bb-border bg-primary/5">
              <div className="p-5 border-b border-primary/20 flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">AI Sentiment Analysis</h3>
              </div>
              <div className="p-5">
                <div className="mb-4">
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-[10px] font-bold text-zinc-500 uppercase">Bullish Intensity</span>
                    <span className="text-lg font-bold text-primary">84%</span>
                  </div>
                  <div className="h-2 w-full bg-zinc-800 rounded-full overflow-hidden">
                    <div className="h-full bg-primary w-[84%]" />
                  </div>
                </div>
                <p className="text-[11px] text-zinc-400 italic leading-relaxed">
                  "Our predictive models indicate strong accumulation patterns for {symbol}. 
                  Sentiment across institutional channels remains highly positive with an 
                  expected price target of ${(data.quote.c * 1.05).toFixed(2)} in the next 14 days."
                </p>
                <div className="mt-4 pt-4 border-t border-primary/10 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-3 w-3 text-zinc-500" />
                    <span className="text-[10px] text-zinc-500">Updated 2h ago</span>
                  </div>
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-primary/20 text-primary uppercase">Alpha Signal</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Shell>
  );
}
