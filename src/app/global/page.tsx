"use client";

import { useState, useEffect } from "react";
import { Shell } from "@/components/shell";
import { 
  Newspaper, 
  Search, 
  Filter, 
  AlertTriangle, 
  ShieldCheck, 
  ShieldAlert,
  TrendingUp,
  TrendingDown,
  Minus,
  Globe,
  Clock,
  ExternalLink,
  ChevronDown
} from "lucide-react";

interface NewsItem {
  headline: string;
  summary: string;
  sentiment: "positive" | "neutral" | "negative";
  riskLevel: "low" | "medium" | "high";
  confidenceScore: number;
  region: string;
  topic: string;
  source: string;
  timestamp: string;
  url: string;
  urlToImage?: string;
}

export default function GlobalFeedPage() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filters
  const [regionFilter, setRegionFilter] = useState("All");
  const [topicFilter, setTopicFilter] = useState("All");
  const [riskFilter, setRiskFilter] = useState("All");

  const fetchNews = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/global-feed");
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch news");
      }
      const data = await response.json();
      setNews(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const filteredNews = news.filter((item) => {
    const regionMatch = regionFilter === "All" || item.region === regionFilter;
    const topicMatch = topicFilter === "All" || item.topic === topicFilter;
    const riskMatch = riskFilter === "All" || item.riskLevel.toLowerCase() === riskFilter.toLowerCase();
    return regionMatch && topicMatch && riskMatch;
  });

  const regions = ["All", ...Array.from(new Set(news.map((n) => n.region)))];
  const topics = ["All", ...Array.from(new Set(news.map((n) => n.topic)))];
  const risks = ["All", "Low", "Medium", "High"];

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case "positive": return <TrendingUp className="h-4 w-4 text-green-500" />;
      case "negative": return <TrendingDown className="h-4 w-4 text-red-500" />;
      default: return <Minus className="h-4 w-4 text-zinc-500" />;
    }
  };

  const getRiskColor = (level: string) => {
    switch (level.toLowerCase()) {
      case "high": return "bg-red-500/10 text-red-500 border-red-500/20";
      case "medium": return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
      default: return "bg-green-500/10 text-green-500 border-green-500/20";
    }
  };

  return (
    <Shell>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <Globe className="h-6 w-6 text-primary" />
              Live Global Intelligence Feed
            </h1>
            <p className="text-zinc-500 text-sm mt-1">Real-time enriched geopolitical and financial signals.</p>
          </div>
          <button 
            onClick={fetchNews}
            disabled={loading}
            className="bb-button flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 disabled:opacity-50"
          >
            <Clock className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            {loading ? 'Analyzing...' : 'Refresh Feed'}
          </button>
        </div>

        {/* Filters Bar */}
        <div className="bb-card p-4 rounded-lg flex flex-wrap gap-4 items-center border border-zinc-800 bg-zinc-900/30">
          <div className="flex items-center gap-2 text-zinc-400">
            <Filter className="h-4 w-4" />
            <span className="text-xs font-bold uppercase tracking-wider">Filters:</span>
          </div>
          
          <select 
            value={regionFilter} 
            onChange={(e) => setRegionFilter(e.target.value)}
            className="bg-zinc-900 border border-zinc-700 text-zinc-300 text-xs rounded px-3 py-1.5 focus:outline-none focus:border-primary"
          >
            {regions.map(r => <option key={r} value={r}>{r}</option>)}
          </select>

          <select 
            value={topicFilter} 
            onChange={(e) => setTopicFilter(e.target.value)}
            className="bg-zinc-900 border border-zinc-700 text-zinc-300 text-xs rounded px-3 py-1.5 focus:outline-none focus:border-primary"
          >
            {topics.map(t => <option key={t} value={t}>{t}</option>)}
          </select>

          <select 
            value={riskFilter} 
            onChange={(e) => setRiskFilter(e.target.value)}
            className="bg-zinc-900 border border-zinc-700 text-zinc-300 text-xs rounded px-3 py-1.5 focus:outline-none focus:border-primary"
          >
            {risks.map(r => <option key={r} value={r}>{r} Risk</option>)}
          </select>

          <div className="ml-auto text-[10px] text-zinc-500 font-medium">
            Showing {filteredNews.length} signals
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bb-card p-6 rounded-lg animate-pulse border border-zinc-800">
                <div className="flex justify-between mb-4">
                  <div className="h-4 w-1/4 bg-zinc-800 rounded" />
                  <div className="h-4 w-16 bg-zinc-800 rounded" />
                </div>
                <div className="h-6 w-3/4 bg-zinc-800 rounded mb-4" />
                <div className="h-4 w-full bg-zinc-800 rounded mb-2" />
                <div className="h-4 w-2/3 bg-zinc-800 rounded" />
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bb-card p-8 rounded-lg border border-red-500/20 bg-red-500/5 text-center">
            <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-white font-bold text-lg mb-2">Intelligence Stream Offline</h3>
            <p className="text-zinc-400 text-sm mb-6">{error}</p>
            <button onClick={fetchNews} className="bb-button px-6 py-2 bg-red-500/20 text-red-500 border border-red-500/30 hover:bg-red-500/30">
              Retry Connection
            </button>
          </div>
        )}

        {/* News Feed */}
        {!loading && !error && (
          <div className="flex flex-col gap-4">
            {filteredNews.map((item, index) => (
              <div key={index} className="bb-card p-6 rounded-lg border border-zinc-800 hover:border-zinc-700 transition-all group">
                <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="text-[10px] font-bold text-primary uppercase tracking-tighter bg-primary/10 px-2 py-0.5 rounded">
                      {item.topic}
                    </span>
                    <span className="text-[10px] font-bold text-zinc-500 uppercase flex items-center gap-1">
                      <Globe className="h-3 w-3" />
                      {item.region}
                    </span>
                    <span className="text-[10px] font-medium text-zinc-600">
                      {new Date(item.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-bold text-zinc-500 uppercase">Sentiment</span>
                      {getSentimentIcon(item.sentiment)}
                    </div>
                    <div className={`px-2 py-0.5 rounded border text-[10px] font-bold uppercase ${getRiskColor(item.riskLevel)}`}>
                      {item.riskLevel} Risk
                    </div>
                  </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-6">
                  {item.urlToImage && (
                    <div className="w-full lg:w-48 h-32 flex-shrink-0 overflow-hidden rounded border border-zinc-800 bg-zinc-900">
                      <img src={item.urlToImage} alt="" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                    </div>
                  )}
                  <div className="flex-1">
                    <h2 className="text-lg font-bold text-white mb-3 group-hover:text-primary transition-colors">
                      {item.headline}
                    </h2>
                    <div className="bg-zinc-900/50 p-3 rounded border border-zinc-800 mb-4">
                      <p className="text-sm text-zinc-400 leading-relaxed italic">
                        <span className="text-primary font-bold mr-2">AI ANALYST:</span>
                        {item.summary}
                      </p>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <span className="text-xs font-medium text-zinc-500">Source: <span className="text-zinc-300 font-bold">{item.source}</span></span>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold text-zinc-600 uppercase">AI Confidence</span>
                          <div className="w-24 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                            <div className="h-full bg-primary" style={{ width: `${item.confidenceScore * 100}%` }} />
                          </div>
                          <span className="text-[10px] font-bold text-primary">{Math.round(item.confidenceScore * 100)}%</span>
                        </div>
                      </div>
                      <a 
                        href={item.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-xs font-bold text-zinc-400 hover:text-white flex items-center gap-1 uppercase tracking-wider"
                      >
                        Source Report <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {filteredNews.length === 0 && (
              <div className="p-20 text-center text-zinc-500">
                <Newspaper className="h-12 w-12 mx-auto mb-4 opacity-20" />
                <p>No intelligence signals match your current filters.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </Shell>
  );
}
