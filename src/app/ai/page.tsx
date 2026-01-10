"use client";

import { useEffect, useState } from "react";
import { Shell } from "@/components/shell";
import { 
  BrainCircuit, 
  TrendingUp, 
  Users, 
  Globe, 
  Building2, 
  User,
  RefreshCcw,
  Zap,
  Activity,
  ShieldAlert,
  PieChart as PieChartIcon
} from "lucide-react";
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip,
  Legend
} from "recharts";
import { cn } from "@/lib/utils";

type InsightsData = {
  topics: { name: string, value: number }[];
  sentiment: {
    score: number;
    breakdown: { positive: number, neutral: number, negative: number };
  };
  entities: {
    countries: string[];
    companies: string[];
    leaders: string[];
  };
  timeline: { time: string, score: number }[];
};

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export default function AIPage() {
  const [data, setData] = useState<InsightsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/ai-insights");
      if (!res.ok) throw new Error("Failed to fetch insights");
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
        <div className="flex flex-col gap-6">
          <div className="h-8 w-64 bg-zinc-800 rounded animate-pulse" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(i => <div key={i} className="h-32 bg-zinc-900/50 rounded-lg border bb-border animate-pulse" />)}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="h-80 bg-zinc-900/50 rounded-lg border bb-border animate-pulse" />
            <div className="h-80 bg-zinc-900/50 rounded-lg border bb-border animate-pulse" />
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
          <h2 className="text-xl font-bold text-white mb-2">Analysis Failed</h2>
          <p className="text-zinc-500 mb-6">{error || "Something went wrong while processing news data."}</p>
          <button 
            onClick={fetchData}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:opacity-90 transition-opacity flex items-center gap-2"
          >
            <RefreshCcw className="h-4 w-4" />
            Retry Analysis
          </button>
        </div>
      </Shell>
    );
  }

  return (
    <Shell>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <BrainCircuit className="h-5 w-5 text-primary" />
              <h1 className="text-2xl font-bold text-white tracking-tight">Autonomous AI Insights</h1>
            </div>
            <p className="text-sm text-zinc-500">Real-time global pattern detection and sentiment mapping.</p>
          </div>
          <button 
            onClick={fetchData}
            className="flex items-center gap-2 px-4 py-2 rounded-md bg-zinc-900 border bb-border text-zinc-300 hover:text-white transition-colors"
          >
            <RefreshCcw className="h-4 w-4" />
            <span className="text-sm font-medium">Refresh Data</span>
          </button>
        </div>

        {/* Top Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bb-card p-6 rounded-lg border bb-border bg-zinc-900/20">
            <div className="flex items-center justify-between mb-4">
              <Activity className="h-4 w-4 text-primary" />
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Sentiment Score</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-white">{data.sentiment.score}</span>
              <span className={cn(
                "text-xs font-bold",
                data.sentiment.score > 50 ? "text-green-500" : "text-red-500"
              )}>
                {data.sentiment.score > 50 ? "BULLISH" : "BEARISH"}
              </span>
            </div>
          </div>

          <div className="bb-card p-6 rounded-lg border bb-border bg-zinc-900/20">
            <div className="flex items-center justify-between mb-4">
              <Zap className="h-4 w-4 text-yellow-500" />
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Primary Topic</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-bold text-white">
                {data.topics.reduce((prev, current) => (prev.value > current.value) ? prev : current).name}
              </span>
              <span className="text-xs text-zinc-500">Dominant</span>
            </div>
          </div>

          <div className="bb-card p-6 rounded-lg border bb-border bg-zinc-900/20">
            <div className="flex items-center justify-between mb-4">
              <Users className="h-4 w-4 text-blue-500" />
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Hot Entities</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-bold text-white">{data.entities.countries[0]}</span>
              <span className="text-xs text-zinc-500">Trending</span>
            </div>
          </div>

          <div className="bb-card p-6 rounded-lg border bb-border bg-zinc-900/20">
            <div className="flex items-center justify-between mb-4">
              <Globe className="h-4 w-4 text-green-500" />
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Market Status</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-bold text-white">ACTIVE</span>
              <span className="text-xs text-green-500">Normal</span>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Topic Detection */}
          <div className="bb-card p-6 rounded-lg border bb-border bg-zinc-900/10">
            <div className="flex items-center gap-2 mb-6">
              <PieChartIcon className="h-4 w-4 text-zinc-400" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Topic Detection</h3>
            </div>
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data.topics}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {data.topics.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '8px' }}
                    itemStyle={{ color: '#fff' }}
                  />
                  <Legend verticalAlign="bottom" height={36}/>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Sentiment Shift Timeline */}
          <div className="bb-card p-6 rounded-lg border bb-border bg-zinc-900/10">
            <div className="flex items-center gap-2 mb-6">
              <TrendingUp className="h-4 w-4 text-zinc-400" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Sentiment Shift (24H)</h3>
            </div>
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data.timeline}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                  <XAxis 
                    dataKey="time" 
                    stroke="#71717a" 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false} 
                  />
                  <YAxis 
                    stroke="#71717a" 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false}
                    domain={[0, 100]}
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '8px' }}
                    itemStyle={{ color: '#fff' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="score" 
                    stroke="#0088FE" 
                    strokeWidth={2} 
                    dot={{ fill: '#0088FE', r: 4 }}
                    activeDot={{ r: 6, strokeWidth: 0 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Entities Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <EntityCard 
            title="Countries & Regions" 
            entities={data.entities.countries} 
            icon={Globe} 
            color="text-blue-500" 
          />
          <EntityCard 
            title="Companies & Corps" 
            entities={data.entities.companies} 
            icon={Building2} 
            color="text-yellow-500" 
          />
          <EntityCard 
            title="Key Leaders" 
            entities={data.entities.leaders} 
            icon={User} 
            color="text-green-500" 
          />
        </div>

        {/* Sentiment Breakdown */}
        <div className="bb-card p-6 rounded-lg border bb-border bg-zinc-900/20">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-6">Detailed Sentiment Breakdown</h3>
          <div className="space-y-6">
            <SentimentBar label="Positive" value={data.sentiment.breakdown.positive} color="bg-green-500" />
            <SentimentBar label="Neutral" value={data.sentiment.breakdown.neutral} color="bg-zinc-500" />
            <SentimentBar label="Negative" value={data.sentiment.breakdown.negative} color="bg-red-500" />
          </div>
        </div>
      </div>
    </Shell>
  );
}

function EntityCard({ title, entities, icon: Icon, color }: any) {
  return (
    <div className="bb-card p-6 rounded-lg border bb-border bg-zinc-900/10">
      <div className="flex items-center gap-2 mb-4">
        <Icon className={cn("h-4 w-4", color)} />
        <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{title}</h3>
      </div>
      <div className="space-y-3">
        {entities.map((entity: string, i: number) => (
          <div key={i} className="flex items-center justify-between p-2.5 rounded bg-zinc-900/50 border border-zinc-800/50 hover:border-zinc-700 transition-colors group">
            <span className="text-sm font-medium text-zinc-200 group-hover:text-white transition-colors">{entity}</span>
            <div className="flex items-center gap-1.5">
              <div className="h-1.5 w-1.5 rounded-full bg-primary/50 animate-pulse" />
              <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-tighter">Tracked</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SentimentBar({ label, value, color }: { label: string, value: number, color: string }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs">
        <span className="font-bold text-zinc-400 uppercase tracking-wider">{label}</span>
        <span className="font-bold text-white">{value}%</span>
      </div>
      <div className="h-2 w-full bg-zinc-900 rounded-full overflow-hidden border border-zinc-800/50">
        <div 
          className={cn("h-full transition-all duration-1000 ease-out", color)} 
          style={{ width: `${value}%` }} 
        />
      </div>
    </div>
  );
}
