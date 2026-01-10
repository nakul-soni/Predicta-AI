"use client";

import { useEffect, useState } from "react";
import { Shell } from "@/components/shell";
import {
  LineChart,
  TrendingUp,
  TrendingDown,
  RefreshCcw,
  Brain,
  Target,
  Zap,
  ExternalLink,
  ChevronDown,
  Fuel,
  DollarSign,
  Activity,
  Landmark,
  BarChart3,
  Sparkles,
  Copy,
  Check,
  Calendar,
  FileText,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  ComposedChart,
  Line,
} from "recharts";
import { cn } from "@/lib/utils";

type Variable = "oil" | "inflation" | "volatility" | "gold" | "interest_rates" | "sp500";

type PredictionData = {
  variable: string;
  name: string;
  unit: string;
  current: {
    price: number;
    change: number;
    changePercent: number;
    high: number;
    low: number;
  };
  historical: { date: string; value: number; high: number; low: number }[];
  forecast: { date: string; predicted: number; upper: number; lower: number; confidence: number }[];
  analysis: {
    probability_up: number;
    probability_down: number;
    primary_driver: string;
    explanation: string;
    key_factors: string[];
    confidence: string;
    sentiment: string;
    target_30d: number;
    target_90d: number;
  };
  sources: { title: string; url: string }[];
  is_simulated: boolean;
};

const VARIABLES: { id: Variable; name: string; icon: any; color: string }[] = [
  { id: "oil", name: "Oil Price", icon: Fuel, color: "#f97316" },
  { id: "gold", name: "Gold", icon: DollarSign, color: "#eab308" },
  { id: "volatility", name: "VIX (Volatility)", icon: Activity, color: "#ef4444" },
  { id: "sp500", name: "S&P 500", icon: BarChart3, color: "#3b82f6" },
  { id: "interest_rates", name: "Interest Rates", icon: Landmark, color: "#8b5cf6" },
  { id: "inflation", name: "Inflation", icon: TrendingUp, color: "#22c55e" },
];

export default function PredictionsPage() {
  const [selectedVariable, setSelectedVariable] = useState<Variable>("oil");
  const [data, setData] = useState<PredictionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const [copied, setCopied] = useState(false);

  const fetchPrediction = async (variable: Variable) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/predictions?variable=${variable}`);
      if (!res.ok) throw new Error("Failed to fetch prediction");
      const result = await res.json();
      setData(result);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const copyReport = () => {
    if (!data) return;
    const report = `
PREDICTION REPORT: ${data.name}
Generated: ${new Date().toLocaleDateString()}
Current Price: ${data.current.price} ${data.unit}
30-Day Target: ${data.analysis.target_30d} ${data.unit}
Probability Up: ${data.analysis.probability_up}%
Sentiment: ${data.analysis.sentiment}

AI ANALYSIS:
Primary Driver: ${data.analysis.primary_driver}
Rationale: ${data.analysis.explanation}

KEY FACTORS:
${data.analysis.key_factors.map(f => `- ${f}`).join('\n')}

FORECAST SUMMARY (Next 7 Days):
${data.forecast.slice(0, 7).map(f => `${f.date}: ${f.predicted} (Confidence: ${f.confidence}%)`).join('\n')}
    `;
    navigator.clipboard.writeText(report);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => {
    fetchPrediction(selectedVariable);
  }, [selectedVariable]);

  const selectedConfig = VARIABLES.find((v) => v.id === selectedVariable)!;

  const combinedChartData = data
    ? [
        ...data.historical.slice(-30).map((h) => ({
          date: h.date,
          actual: h.value,
          predicted: null,
          upper: null,
          lower: null,
        })),
        ...data.forecast.map((f) => ({
          date: f.date,
          actual: null,
          predicted: f.predicted,
          upper: f.upper,
          lower: f.lower,
        })),
      ]
    : [];

  if (loading) {
    return (
      <Shell>
        <div className="flex flex-col gap-6 animate-pulse">
          <div className="h-8 w-64 bg-zinc-800 rounded" />
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-3 h-[500px] bg-zinc-900 rounded-lg border bb-border" />
            <div className="h-[500px] bg-zinc-900 rounded-lg border bb-border" />
          </div>
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
              <Brain className="h-5 w-5 text-primary" />
              <h1 className="text-2xl font-bold text-white tracking-tight">Prediction Engine</h1>
              {data?.is_simulated ? (
                <div className="ml-3 px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20 flex items-center gap-1.5">
                  <div className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
                  <span className="text-[10px] font-bold text-amber-500 uppercase tracking-wider">Simulation</span>
                </div>
              ) : (
                <div className="ml-3 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-1.5">
                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider">AI-Powered</span>
                </div>
              )}
            </div>
            <p className="text-sm text-zinc-500">
              AI-driven time-series forecasting powered by real-time market data and news sentiment.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-3 px-4 py-2.5 rounded-lg bg-zinc-900 border bb-border hover:border-zinc-700 transition-colors min-w-[200px]"
              >
                <selectedConfig.icon className="h-4 w-4" style={{ color: selectedConfig.color }} />
                <span className="text-sm font-medium text-white flex-1 text-left">{selectedConfig.name}</span>
                <ChevronDown className={cn("h-4 w-4 text-zinc-500 transition-transform", dropdownOpen && "rotate-180")} />
              </button>
              {dropdownOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-zinc-900 border bb-border rounded-lg shadow-xl z-50 overflow-hidden">
                  {VARIABLES.map((v) => (
                    <button
                      key={v.id}
                      onClick={() => {
                        setSelectedVariable(v.id);
                        setDropdownOpen(false);
                      }}
                      className={cn(
                        "flex items-center gap-3 w-full px-4 py-3 hover:bg-zinc-800 transition-colors",
                        selectedVariable === v.id && "bg-zinc-800"
                      )}
                    >
                      <v.icon className="h-4 w-4" style={{ color: v.color }} />
                      <span className="text-sm text-white">{v.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button
              onClick={() => fetchPrediction(selectedVariable)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-zinc-900 border bb-border text-zinc-300 hover:text-white transition-colors"
            >
              <RefreshCcw className="h-4 w-4" />
            </button>
          </div>
        </div>

        {data && (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bb-card p-4 rounded-lg border bb-border bg-zinc-900/20">
                <p className="text-[10px] text-zinc-500 uppercase font-bold mb-1">Current Price</p>
                <p className="text-2xl font-bold text-white">
                  {data.current.price?.toFixed(2) || "N/A"}
                </p>
                <p className={cn("text-xs font-medium mt-1", data.current.changePercent > 0 ? "text-green-500" : "text-red-500")}>
                  {data.current.changePercent > 0 ? "+" : ""}
                  {data.current.changePercent?.toFixed(2)}%
                </p>
              </div>
              <div className="bb-card p-4 rounded-lg border bb-border bg-zinc-900/20">
                <p className="text-[10px] text-zinc-500 uppercase font-bold mb-1">30-Day Target</p>
                <p className="text-2xl font-bold text-white">{data.analysis.target_30d || "N/A"}</p>
                <p className="text-xs text-zinc-500 mt-1">{data.unit}</p>
              </div>
              <div className="bb-card p-4 rounded-lg border bb-border bg-zinc-900/20">
                <p className="text-[10px] text-zinc-500 uppercase font-bold mb-1">Probability Up</p>
                <p className="text-2xl font-bold text-green-500">{data.analysis.probability_up}%</p>
                <div className="h-1.5 w-full bg-zinc-800 rounded-full mt-2 overflow-hidden">
                  <div className="h-full bg-green-500" style={{ width: `${data.analysis.probability_up}%` }} />
                </div>
              </div>
              <div className="bb-card p-4 rounded-lg border bb-border bg-zinc-900/20">
                <p className="text-[10px] text-zinc-500 uppercase font-bold mb-1">AI Sentiment</p>
                <p className={cn(
                  "text-2xl font-bold",
                  data.analysis.sentiment === "Bullish" ? "text-green-500" : data.analysis.sentiment === "Bearish" ? "text-red-500" : "text-yellow-500"
                )}>
                  {data.analysis.sentiment}
                </p>
                <p className="text-xs text-zinc-500 mt-1">{data.analysis.confidence} Confidence</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bb-card p-6 rounded-lg border bb-border bg-zinc-900/10">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <LineChart className="h-4 w-4 text-zinc-400" />
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider">Time-Series Forecast</h3>
                  </div>
                  <div className="flex items-center gap-4 text-[10px]">
                    <div className="flex items-center gap-1.5">
                      <div className="h-2 w-4 rounded" style={{ backgroundColor: selectedConfig.color }} />
                      <span className="text-zinc-500">Historical</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="h-2 w-4 rounded bg-primary" />
                      <span className="text-zinc-500">Forecast</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="h-2 w-4 rounded bg-primary/20" />
                      <span className="text-zinc-500">Confidence Band</span>
                    </div>
                  </div>
                </div>
                <div className="h-[400px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={combinedChartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="confidenceBand" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.05} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                      <XAxis
                        dataKey="date"
                        stroke="#71717a"
                        fontSize={10}
                        tickFormatter={(v) => v.slice(5)}
                        interval="preserveStartEnd"
                      />
                      <YAxis stroke="#71717a" fontSize={10} domain={["auto", "auto"]} />
                      <Tooltip
                        contentStyle={{ backgroundColor: "#18181b", border: "1px solid #27272a", borderRadius: "8px" }}
                        labelStyle={{ color: "#fff" }}
                      />
                      <Area
                        type="monotone"
                        dataKey="upper"
                        stroke="transparent"
                        fill="url(#confidenceBand)"
                        fillOpacity={1}
                      />
                      <Area
                        type="monotone"
                        dataKey="lower"
                        stroke="transparent"
                        fill="#18181b"
                        fillOpacity={1}
                      />
                      <Line
                        type="monotone"
                        dataKey="actual"
                        stroke={selectedConfig.color}
                        strokeWidth={2}
                        dot={false}
                        connectNulls={false}
                      />
                      <Line
                        type="monotone"
                        dataKey="predicted"
                        stroke="#3b82f6"
                        strokeWidth={2}
                        strokeDasharray="5 5"
                        dot={false}
                        connectNulls={false}
                      />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bb-card p-6 rounded-lg border bb-border bg-zinc-900/10">
                  <div className="flex items-center gap-2 mb-4">
                    <Sparkles className="h-4 w-4 text-primary" />
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider">AI Analysis</h3>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <p className="text-[10px] text-zinc-500 uppercase font-bold mb-1">Primary Driver</p>
                      <p className="text-sm text-zinc-300 leading-relaxed">{data.analysis.primary_driver}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-zinc-500 uppercase font-bold mb-1">Explanation</p>
                      <p className="text-xs text-zinc-400 leading-relaxed">{data.analysis.explanation}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-zinc-500 uppercase font-bold mb-2">Key Factors</p>
                      <div className="space-y-2">
                        {data.analysis.key_factors?.map((factor, i) => (
                          <div key={i} className="flex items-start gap-2">
                            <div className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                            <span className="text-xs text-zinc-400">{factor}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {data.sources && data.sources.length > 0 && (
                  <div className="bb-card p-6 rounded-lg border bb-border bg-zinc-900/10">
                    <div className="flex items-center gap-2 mb-4">
                      <Target className="h-4 w-4 text-zinc-400" />
                      <h3 className="text-sm font-bold text-white uppercase tracking-wider">Data Sources</h3>
                    </div>
                    <div className="space-y-2">
                      {data.sources.slice(0, 4).map((source, i) => (
                        <a
                          key={i}
                          href={source.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-start justify-between gap-2 group p-2 rounded hover:bg-white/5 transition-colors"
                        >
                          <span className="text-xs text-zinc-400 group-hover:text-zinc-200 line-clamp-2">{source.title}</span>
                          <ExternalLink className="h-3 w-3 text-zinc-600 group-hover:text-primary shrink-0 mt-0.5" />
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="bb-card p-6 rounded-lg border bb-border bg-zinc-900/10">
              <div className="flex items-center gap-2 mb-4">
                <Zap className="h-4 w-4 text-primary" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Forecast Confidence Over Time</h3>
              </div>
              <div className="h-[150px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data.forecast} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="confidenceGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#22c55e" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#22c55e" stopOpacity={0.05} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                    <XAxis dataKey="date" stroke="#71717a" fontSize={10} tickFormatter={(v) => v.slice(5)} />
                    <YAxis stroke="#71717a" fontSize={10} domain={[50, 100]} unit="%" />
                    <Tooltip
                      contentStyle={{ backgroundColor: "#18181b", border: "1px solid #27272a", borderRadius: "8px" }}
                    />
                    <Area
                      type="monotone"
                      dataKey="confidence"
                      stroke="#22c55e"
                      fill="url(#confidenceGradient)"
                      strokeWidth={2}
                    />
                    <ReferenceLine y={70} stroke="#eab308" strokeDasharray="3 3" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <p className="text-[10px] text-zinc-500 mt-2 text-center">
                Yellow line indicates minimum recommended confidence threshold (70%)
              </p>
            </div>

            {/* NEW: Prediction Output / Report Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bb-card p-6 rounded-lg border bb-border bg-zinc-900/10 flex flex-col">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-zinc-400" />
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider">Detailed Forecast Report</h3>
                  </div>
                  <button
                    onClick={copyReport}
                    className="flex items-center gap-2 px-3 py-1.5 rounded bg-zinc-800 border border-zinc-700 text-[10px] font-bold text-zinc-300 hover:text-white transition-all active:scale-95"
                  >
                    {copied ? <Check className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3" />}
                    {copied ? "COPIED" : "COPY OUTPUT"}
                  </button>
                </div>
                <div className="flex-1 space-y-4 p-5 rounded-md bg-zinc-950/50 border border-zinc-800 font-mono text-xs text-zinc-400 leading-relaxed overflow-y-auto max-h-[350px]">
                  <div className="flex justify-between border-b border-zinc-800 pb-2 mb-2">
                    <span className="text-zinc-500">ASSET:</span>
                    <span className="text-white font-bold">{data.name}</span>
                  </div>
                  <div className="flex justify-between border-b border-zinc-800 pb-2 mb-2">
                    <span className="text-zinc-500">PREDICTION_WINDOW:</span>
                    <span className="text-white font-bold">30 DAYS</span>
                  </div>
                  <div className="flex justify-between border-b border-zinc-800 pb-2 mb-2">
                    <span className="text-zinc-500">CONFIDENCE_SCORE:</span>
                    <span className={cn("font-bold", data.analysis.confidence === "High" ? "text-green-500" : data.analysis.confidence === "Medium" ? "text-yellow-500" : "text-red-500")}>
                      {data.analysis.confidence.toUpperCase()}
                    </span>
                  </div>
                  <div className="mt-4">
                    <span className="text-zinc-500 block mb-1 font-bold tracking-widest">[PRIMARY_DRIVERS]</span>
                    <p className="text-zinc-300">{data.analysis.primary_driver}</p>
                  </div>
                  <div className="mt-4">
                    <span className="text-zinc-500 block mb-1 font-bold tracking-widest">[ANALYSIS_SUMMARY]</span>
                    <p className="text-zinc-300">{data.analysis.explanation}</p>
                  </div>
                  <div className="mt-4">
                    <span className="text-zinc-500 block mb-1 font-bold tracking-widest">[CRITICAL_FACTORS]</span>
                    <ul className="space-y-1">
                      {data.analysis.key_factors.map((f, i) => (
                        <li key={i} className="flex gap-2">
                          <span className="text-primary">&gt;</span>
                          <span className="text-zinc-300">{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bb-card p-6 rounded-lg border bb-border bg-zinc-900/10">
                <div className="flex items-center gap-2 mb-6">
                  <Calendar className="h-4 w-4 text-zinc-400" />
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">Daily Prediction Log</h3>
                </div>
                <div className="overflow-hidden rounded-md border border-zinc-800">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-zinc-900/50 border-b border-zinc-800">
                      <tr>
                        <th className="px-4 py-3 font-bold text-zinc-500 uppercase">Date</th>
                        <th className="px-4 py-3 font-bold text-zinc-500 uppercase">Predicted</th>
                        <th className="px-4 py-3 font-bold text-zinc-500 uppercase">Range (L/H)</th>
                        <th className="px-4 py-3 font-bold text-zinc-500 uppercase text-right">Confidence</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800">
                      {data.forecast.slice(0, 10).map((f, i) => (
                        <tr key={i} className="hover:bg-white/5 transition-colors">
                          <td className="px-4 py-3 text-zinc-300 font-medium">{f.date}</td>
                          <td className="px-4 py-3 text-white font-bold">{f.predicted.toFixed(2)}</td>
                          <td className="px-4 py-3 text-zinc-500">{f.lower.toFixed(2)} - {f.upper.toFixed(2)}</td>
                          <td className="px-4 py-3 text-right">
                            <span className={cn(
                              "px-1.5 py-0.5 rounded-[4px] font-bold text-[10px]",
                              f.confidence > 85 ? "bg-green-500/10 text-green-500" : f.confidence > 75 ? "bg-yellow-500/10 text-yellow-500" : "bg-red-500/10 text-red-500"
                            )}>
                              {f.confidence.toFixed(0)}%
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="bg-zinc-900/20 p-3 text-center border-t border-zinc-800">
                    <p className="text-[10px] text-zinc-500 italic">Only showing first 10 days of forecast. View full data in the export report.</p>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </Shell>
  );
}
