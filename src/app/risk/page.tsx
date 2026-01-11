"use client";

import { useEffect, useState } from "react";
import { Shell } from "@/components/shell";
import { 
  ShieldAlert, 
  RefreshCcw, 
  AlertTriangle, 
  Globe, 
  TrendingDown, 
  CloudRain, 
  Users,
  Info,
  ChevronRight,
  Target,
  Zap,
  Network,
  ExternalLink,
  BookOpen
} from "lucide-react";
import { 
  ScatterChart, 
  Scatter, 
  XAxis, 
  YAxis, 
  ZAxis,
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell,
  LabelList
} from "recharts";
import { cn } from "@/lib/utils";

type RiskCategory = {
  name: string;
  probability: number;
  impact: number;
  explanation: string;
};

type Scenario = {
  title: string;
  description: string;
  risk_level: string;
};

type RiskEvent = {
  event: string;
  probability: number;
  impact: number;
  category: string;
};

type Correlation = {
  source: string;
  target: string;
  strength: number;
  description: string;
};

type RiskData = {
  categories: RiskCategory[];
  scenarios: {
    best_case: Scenario;
    worst_case: Scenario;
    most_likely: Scenario;
  };
  matrix: RiskEvent[];
  correlations: Correlation[];
  sources?: { title: string; url: string }[];
  is_simulated?: boolean;
};

const CATEGORY_ICONS: Record<string, any> = {
  Geopolitical: Globe,
  Economic: TrendingDown,
  Climate: CloudRain,
  Political: Users
};

const CATEGORY_COLORS: Record<string, string> = {
  Geopolitical: "#3b82f6", // blue
  Economic: "#eab308",     // yellow
  Climate: "#22c55e",      // green
  Political: "#a855f7"      // purple
};

export default function RiskPage() {
  const [data, setData] = useState<RiskData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedScenario, setSelectedScenario] = useState<keyof RiskData["scenarios"]>("most_likely");

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/risk-analysis");
      if (!res.ok) throw new Error("Failed to fetch risk analysis");
      const result = await res.json();
      setData(result);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <Shell>
        <div className="flex flex-col gap-6 animate-pulse">
          <div className="h-8 w-64 bg-zinc-800 rounded" />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(i => <div key={i} className="h-40 bg-zinc-900 rounded-lg border bb-border" />)}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 h-96 bg-zinc-900 rounded-lg border bb-border" />
            <div className="h-96 bg-zinc-900 rounded-lg border bb-border" />
          </div>
        </div>
      </Shell>
    );
  }

  if (error || !data) {
    return (
      <Shell>
        <div className="flex flex-col items-center justify-center h-[60vh] text-center">
          <ShieldAlert className="h-12 w-12 text-red-500 mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">Analysis Interrupted</h2>
          <p className="text-zinc-500 mb-6">{error || "Unable to generate risk assessment."}</p>
          <button 
            onClick={fetchData}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:opacity-90 flex items-center gap-2"
          >
            <RefreshCcw className="h-4 w-4" />
            Restart Simulation
          </button>
        </div>
      </Shell>
    );
  }

  return (
    <Shell>
      <div className="flex flex-col gap-6 pb-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <ShieldAlert className="h-5 w-5 text-red-500" />
              <h1 className="text-2xl font-bold text-white tracking-tight">Risk & Scenario Analysis</h1>
              {data?.is_simulated ? (
                <div className="ml-3 px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20 flex items-center gap-1.5">
                  <div className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
                  <span className="text-[10px] font-bold text-amber-500 uppercase tracking-wider">Simulation Mode</span>
                </div>
              ) : (
                <div className="ml-3 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-1.5">
                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider">Live Analysis</span>
                </div>
              )}
            </div>
            <p className="text-sm text-zinc-500">
              {data?.is_simulated 
                ? "Showing simulated risk patterns based on real-world news counts and market indicators."
                : "Predictive modeling powered by live NewsAPI and Finnhub data feeds."
              }
            </p>
          </div>
          <button 
            onClick={fetchData}
            className="flex items-center gap-2 px-4 py-2 rounded-md bg-zinc-900 border bb-border text-zinc-300 hover:text-white transition-colors"
          >
            <RefreshCcw className="h-4 w-4" />
            <span className="text-sm font-medium">Re-simulate</span>
          </button>
        </div>

        {/* Risk Probability Scores */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {data.categories.map((cat) => {
            const Icon = CATEGORY_ICONS[cat.name] || AlertTriangle;
            return (
              <div key={cat.name} className="bb-card p-5 rounded-lg border bb-border bg-zinc-900/20 group hover:border-zinc-700 transition-all">
                <div className="flex items-center justify-between mb-4">
                  <div className={cn("p-2 rounded-md bg-zinc-900", cat.name === "Geopolitical" ? "text-blue-500" : cat.name === "Economic" ? "text-yellow-500" : cat.name === "Climate" ? "text-green-500" : "text-purple-500")}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{cat.name}</span>
                </div>
                <div className="space-y-3">
                  <div className="flex items-baseline justify-between">
                    <span className="text-2xl font-bold text-white">{cat.probability}%</span>
                    <span className="text-[10px] text-zinc-500 font-bold uppercase">Probability</span>
                  </div>
                  <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                    <div 
                      className={cn("h-full transition-all duration-1000", cat.name === "Geopolitical" ? "bg-blue-500" : cat.name === "Economic" ? "bg-yellow-500" : cat.name === "Climate" ? "bg-green-500" : "bg-purple-500")}
                      style={{ width: `${cat.probability}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Impact vs Probability Matrix */}
          <div className="lg:col-span-2 bb-card p-6 rounded-lg border bb-border bg-zinc-900/10">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4 text-zinc-400" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Impact vs Probability Matrix</h3>
              </div>
              <div className="flex gap-2">
                {Object.keys(CATEGORY_COLORS).map(cat => (
                  <div key={cat} className="flex items-center gap-1.5">
                    <div className="h-2 w-2 rounded-full" style={{ backgroundColor: CATEGORY_COLORS[cat] }} />
                    <span className="text-[10px] text-zinc-500 uppercase">{cat}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                  <XAxis 
                    type="number" 
                    dataKey="probability" 
                    name="Probability" 
                    unit="%" 
                    stroke="#71717a" 
                    fontSize={12}
                    domain={[0, 100]}
                  />
                  <YAxis 
                    type="number" 
                    dataKey="impact" 
                    name="Impact" 
                    unit="%" 
                    stroke="#71717a" 
                    fontSize={12}
                    domain={[0, 100]}
                  />
                  <ZAxis type="number" range={[100, 100]} />
                  <Tooltip 
                    cursor={{ strokeDasharray: '3 3' }}
                    contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '8px' }}
                    itemStyle={{ color: '#fff' }}
                  />
                  <Scatter name="Risk Events" data={data.matrix}>
                    {data.matrix.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={CATEGORY_COLORS[entry.category] || "#fff"} />
                    ))}
                    <LabelList dataKey="event" position="top" style={{ fill: '#71717a', fontSize: '10px' }} />
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* AI Explanations */}
          <div className="space-y-6">
            <div className="bb-card p-6 rounded-lg border bb-border bg-zinc-900/10">
              <div className="flex items-center gap-2 mb-4">
                <Zap className="h-4 w-4 text-primary" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">AI Strategy Insights</h3>
              </div>
              <div className="space-y-4">
                {data.categories.map((cat) => (
                  <div key={cat.name} className="border-l-2 pl-4 py-1" style={{ borderLeftColor: CATEGORY_COLORS[cat.name] }}>
                    <h4 className="text-xs font-bold text-white mb-1 uppercase">{cat.name} Risk</h4>
                    <p className="text-xs text-zinc-400 leading-relaxed">{cat.explanation}</p>
                  </div>
                ))}
              </div>
            </div>

            {data.sources && data.sources.length > 0 && (
              <div className="bb-card p-6 rounded-lg border bb-border bg-zinc-900/10">
                <div className="flex items-center gap-2 mb-4">
                  <BookOpen className="h-4 w-4 text-zinc-400" />
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">Data Grounding</h3>
                </div>
                <div className="space-y-3">
                  <p className="text-[10px] text-zinc-500 uppercase font-bold mb-2">Primary Analysis Sources:</p>
                  {data.sources.map((source, i) => (
                    <a 
                      key={i} 
                      href={source.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-start justify-between gap-3 group/link p-2 rounded hover:bg-white/5 transition-colors border border-transparent hover:border-zinc-800"
                    >
                      <span className="text-xs text-zinc-400 group-hover/link:text-zinc-200 line-clamp-2 leading-tight">
                        {source.title}
                      </span>
                      <ExternalLink className="h-3 w-3 text-zinc-600 group-hover/link:text-primary mt-0.5 shrink-0" />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Scenario Selector */}
          <div className="bb-card p-6 rounded-lg border bb-border bg-zinc-900/10">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Info className="h-4 w-4 text-zinc-400" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Scenario Analysis</h3>
              </div>
              <div className="flex p-1 bg-zinc-900 rounded-md border border-zinc-800">
                {(["best_case", "most_likely", "worst_case"] as const).map((s) => (
                  <button
                    key={s}
                    onClick={() => setSelectedScenario(s)}
                    className={cn(
                      "px-3 py-1 text-[10px] font-bold uppercase rounded transition-all",
                      selectedScenario === s 
                        ? "bg-zinc-800 text-white shadow-sm" 
                        : "text-zinc-500 hover:text-zinc-300"
                    )}
                  >
                    {s.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>
            <div className="p-6 rounded-lg bg-zinc-900/50 border border-dashed border-zinc-800">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-xl font-bold text-white">{data.scenarios[selectedScenario].title}</h4>
                <div className={cn(
                  "px-2 py-0.5 rounded text-[10px] font-bold uppercase",
                  data.scenarios[selectedScenario].risk_level === "Low" ? "bg-green-500/10 text-green-500" :
                  data.scenarios[selectedScenario].risk_level === "Moderate" ? "bg-yellow-500/10 text-yellow-500" :
                  "bg-red-500/10 text-red-500"
                )}>
                  {data.scenarios[selectedScenario].risk_level} Risk
                </div>
              </div>
              <p className="text-zinc-400 leading-relaxed text-sm">
                {data.scenarios[selectedScenario].description}
              </p>
              <div className="mt-6 flex items-center gap-2 text-primary hover:gap-3 transition-all cursor-pointer">
                <span className="text-xs font-bold uppercase">View Mitigation Roadmap</span>
                <ChevronRight className="h-4 w-4" />
              </div>
            </div>
          </div>

          {/* Event Correlation Visualization */}
          <div className="bb-card p-6 rounded-lg border bb-border bg-zinc-900/10">
            <div className="flex items-center gap-2 mb-6">
              <Network className="h-4 w-4 text-zinc-400" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Event Correlation Cascade</h3>
            </div>
            <div className="space-y-4">
              {data.correlations.map((cor, i) => (
                <div key={i} className="flex items-center gap-4 group">
                  <div className="flex-1 p-3 rounded bg-zinc-900/50 border border-zinc-800/50 group-hover:border-zinc-700 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white">{cor.source}</span>
                        <ChevronRight className="h-3 w-3 text-zinc-600" />
                        <span className="text-xs font-bold text-primary">{cor.target}</span>
                      </div>
                      <span className="text-[10px] font-bold text-zinc-500">{(cor.strength * 100).toFixed(0)}% STRENGTH</span>
                    </div>
                    <p className="text-[11px] text-zinc-500 italic leading-tight">
                      {cor.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Shell>
  );
}
