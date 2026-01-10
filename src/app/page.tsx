"use client";

import { Shell } from "@/components/shell";
import { RiskMap } from "@/components/risk-map";
import { 
  TrendingUp, 
  TrendingDown, 
  ArrowUpRight, 
  ArrowDownRight,
  Newspaper,
  Zap,
  Activity,
  BarChart2,
  ShieldAlert,
  Globe,
  BrainCircuit,
  AlertTriangle
} from "lucide-react";
import { 
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from "recharts";

const data = [
  { name: "09:00", value: 4200 },
  { name: "10:00", value: 4250 },
  { name: "11:00", value: 4230 },
  { name: "12:00", value: 4280 },
  { name: "13:00", value: 4320 },
  { name: "14:00", value: 4310 },
  { name: "15:00", value: 4350 },
  { name: "16:00", value: 4342 },
];

const marketStats = [
  { name: "S&P 500", value: "5,123.42", change: "+0.45%", isUp: true },
  { name: "NASDAQ", value: "16,274.94", change: "+0.12%", isUp: true },
  { name: "DJIA", value: "39,127.14", change: "-0.21%", isUp: false },
  { name: "VIX INDEX", value: "14.28", change: "+2.14%", isUp: true },
];

const topAlerts = [
  { 
    id: 1, 
    title: "Supply Chain Disruption", 
    description: "AI detects potential port congestion in Singapore. ETA for impact: 48h.", 
    impact: "High",
    type: "Logistics"
  },
  { 
    id: 2, 
    title: "Semiconductor Rally", 
    description: "Predictive models signal 5% upside for sub-sector players following TSMC report.", 
    impact: "Moderate",
    type: "Market"
  },
  { 
    id: 3, 
    title: "Currency Volatility", 
    description: "Unusual JPY/USD fluctuations detected ahead of BOJ announcement.", 
    impact: "High",
    type: "Forex"
  }
];

export default function Dashboard() {
  return (
    <Shell>
      <div className="flex flex-col gap-8">
        {/* Header Stats Row */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
          {/* Global Risk Score Card */}
          <div className="bb-card p-5 rounded-lg border-l-4 border-yellow-500">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Global Risk Score</p>
              <ShieldAlert className="h-4 w-4 text-yellow-500" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <p className="text-3xl font-bold text-white">64</p>
              <span className="text-xs text-zinc-500 font-medium">/ 100</span>
            </div>
            <div className="mt-2 h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
              <div className="h-full bg-yellow-500 w-[64%]" />
            </div>
            <p className="mt-2 text-[10px] text-yellow-500 font-bold uppercase tracking-tighter">Moderate Risk Level Detected</p>
          </div>

          {marketStats.slice(0, 3).map((stat) => (
            <div key={stat.name} className="bb-card p-5 rounded-lg">
              <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider">{stat.name}</p>
              <div className="mt-2 flex items-baseline justify-between">
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <span className={`flex items-center text-xs font-bold ${stat.isUp ? 'bb-text-green' : 'bb-text-red'}`}>
                  {stat.isUp ? <ArrowUpRight className="mr-0.5 h-3 w-3" /> : <ArrowDownRight className="mr-0.5 h-3 w-3" />}
                  {stat.change}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Main Grid: Map & Volatility vs Alerts */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 flex flex-col gap-8">
            {/* Map Section */}
            <div className="bb-card rounded-lg overflow-hidden">
              <div className="border-b bb-border p-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Globe className="h-5 w-5 text-primary" />
                  <h3 className="text-sm font-bold text-white">Geopolitical Risk Exposure</h3>
                </div>
                <button className="text-[10px] font-bold text-zinc-500 hover:text-white transition-colors uppercase">View Heatmap</button>
              </div>
              <div className="p-4">
                <RiskMap />
              </div>
            </div>

            {/* Volatility & Chart Section */}
            <div className="bb-card rounded-lg overflow-hidden">
              <div className="border-b bb-border p-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Activity className="h-5 w-5 bb-text-orange" />
                  <h3 className="text-sm font-bold text-white">Market Volatility Indicator (VIX)</h3>
                </div>
                <div className="flex gap-2">
                  <div className="px-2 py-0.5 rounded bg-zinc-800 text-white text-[10px] font-bold">LIVE</div>
                </div>
              </div>
              <div className="h-[250px] w-full p-4">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data}>
                    <defs>
                      <linearGradient id="colorVix" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
                    <XAxis dataKey="name" hide />
                    <YAxis hide domain={['dataMin - 10', 'dataMax + 10']} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#111114', border: '1px solid #27272a', color: '#fff' }}
                      itemStyle={{ color: '#f59e0b' }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="value" 
                      stroke="#f59e0b" 
                      strokeWidth={2}
                      fillOpacity={1} 
                      fill="url(#colorVix)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Right Sidebar: AI Alerts & Summary */}
          <div className="flex flex-col gap-8">
            {/* AI Summary of the Day */}
            <div className="bb-card rounded-lg overflow-hidden bg-zinc-900/50 border-primary/20">
              <div className="border-b bb-border p-4 flex items-center gap-2">
                <BrainCircuit className="h-5 w-5 text-primary" />
                <h3 className="text-sm font-bold text-white">AI Summary of the Day</h3>
              </div>
              <div className="p-4">
                <div className="relative">
                  <p className="text-xs text-zinc-300 leading-relaxed italic">
                    "Global markets are exhibiting a consolidation phase following the Fed's recent hawkish stance. Our models indicate a 68% probability of increased volatility in the energy sector over the next 72 hours. Geopolitical tensions in Eastern Europe remain a primary risk driver, though offset by strong tech earnings. Watch for the 10Y Treasury yield breaking 4.3% as a key bearish signal."
                  </p>
                  <div className="mt-4 flex items-center justify-between border-t border-zinc-800 pt-3">
                    <span className="text-[10px] text-zinc-500 font-medium">Generated at 08:30 EST</span>
                    <button className="text-[10px] font-bold text-primary hover:underline">Re-generate</button>
                  </div>
                </div>
              </div>
            </div>

            {/* Top AI Alerts */}
            <div className="bb-card rounded-lg overflow-hidden">
              <div className="border-b bb-border p-4 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-500" />
                <h3 className="text-sm font-bold text-white">Priority AI Alerts</h3>
              </div>
              <div className="divide-y bb-border">
                {topAlerts.map((alert) => (
                  <div key={alert.id} className="p-4 hover:bg-zinc-900/50 transition-colors cursor-pointer group">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-tighter">{alert.type}</span>
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                        alert.impact === 'High' ? 'bg-red-500/10 text-red-500' : 'bg-yellow-500/10 text-yellow-500'
                      }`}>
                        {alert.impact} IMPACT
                      </span>
                    </div>
                    <h4 className="text-xs font-bold text-white mb-1">{alert.title}</h4>
                    <p className="text-[10px] text-zinc-400 leading-tight">{alert.description}</p>
                  </div>
                ))}
              </div>
              <button className="w-full py-3 text-[10px] font-bold text-zinc-500 hover:text-white hover:bg-zinc-900 transition-colors border-t bb-border uppercase tracking-widest">
                View All Intelligence
              </button>
            </div>
          </div>
        </div>
      </div>
    </Shell>
  );
}
