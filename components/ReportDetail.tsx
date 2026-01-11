import React from 'react';
import { IntelligenceReport } from '../types';
import { ArrowLeft, Target, AlertTriangle, Activity, Globe, Zap, BarChart3, TrendingUp, BrainCircuit, ExternalLink, Link2, Microscope } from 'lucide-react';
import { PredictionTimeline } from './PredictionTimeline';
import { RiskAnalysisPanel } from './RiskAnalysisPanel';
import { StrategicAdvisory } from './StrategicAdvisory';

interface Props {
  report: IntelligenceReport;
  onBack: () => void;
}

export const ReportDetail: React.FC<Props> = ({ report, onBack }) => {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 h-full flex flex-col pb-20">
      {/* Breadcrumb / Back */}
      <div className="flex items-center justify-between mb-8 border-b border-[#262626] pb-4">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-slate-500 hover:text-blue-500 transition-colors group font-mono text-xs uppercase tracking-widest"
        >
          <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" /> 
          Return to Feed
        </button>
        <div className="text-[10px] font-mono text-slate-600">
          ID: {report.id || 'N/A'} // {report.domain.toUpperCase()}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full">
        
        {/* MAIN LEFT/CENTER COLUMN */}
        <div className="lg:col-span-8 flex flex-col gap-10">
          
          {/* Top Section: Visual + Headline */}
          <div className="p-8 bg-[#0a0a0a] border border-[#222] relative overflow-hidden">
             {/* Background glow */}
             <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 blur-3xl rounded-full pointer-events-none"></div>

             <div className="absolute top-4 right-4 flex items-center gap-3">
               {report.is_deep_research && (
                   <div className="flex items-center gap-1.5 px-2 py-1 bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[10px] font-bold uppercase tracking-widest rounded-sm">
                       <Microscope className="w-3 h-3" /> Deep Research
                   </div>
               )}
               <div className="flex items-center gap-2">
                 <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                 <span className="text-[10px] font-bold text-blue-500 uppercase tracking-widest">Stable Analysis</span>
               </div>
             </div>

             <h2 className="text-blue-500 font-mono text-sm mb-2 uppercase">Forecast: {report.domain}</h2>
             <h1 className="text-4xl md:text-5xl font-header font-bold text-white mb-6 uppercase leading-none">
               {report.headline}
             </h1>
             
             <div className="text-slate-400 font-sans text-lg leading-relaxed max-w-3xl border-l-2 border-blue-500/50 pl-6 mb-6">
               {report.summary}
             </div>

             {/* Metadata Footer in Header */}
            <div className="flex flex-wrap gap-4 mt-8 pt-6 border-t border-[#222] font-mono text-[10px]">
               <div className="px-3 py-1 bg-[#111] text-slate-400 border border-[#333]">
                 REGION: <span className="text-white">{report.region.toUpperCase()}</span>
               </div>
               <div className="px-3 py-1 bg-[#111] text-slate-400 border border-[#333]">
                 TIMESTAMP: <span className="text-white">{new Date(report.timestamp).toLocaleTimeString()}</span>
               </div>
               <div className="px-3 py-1 bg-[#111] text-slate-400 border border-[#333]">
                 SOURCE: <span className="text-blue-500">MULTI-AGENT CONSENSUS</span>
               </div>
            </div>
          </div>

          {/* NEW SECTION: STRATEGIC ADVISORY (Highlighted as requested) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             <div className="col-span-2">
                <StrategicAdvisory advice={report.strategic_advisory || []} />
             </div>
          </div>

          {/* TIMELINE PREDICTION SECTION */}
          <div className="bg-[#0c0c0c] border border-[#262626] p-8 relative overflow-hidden">
             <div className="absolute top-0 right-0 p-4 opacity-20">
                <BrainCircuit className="w-24 h-24 text-slate-500" />
             </div>
             
             <div className="flex items-center gap-3 mb-8">
                <div className="px-3 py-1 bg-blue-500/10 border border-blue-500/20 text-blue-500 font-mono text-xs uppercase tracking-widest">
                   Agent 05 Output
                </div>
                <h3 className="text-lg font-header text-white uppercase tracking-wide">
                   Future Timeline Extrapolation
                </h3>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="col-span-1">
                   <p className="text-sm text-slate-400 leading-relaxed mb-4">
                      Agent 05 has extrapolated the following timeline of probable events. 
                      High confidence nodes are highlighted.
                   </p>
                </div>
                <div className="col-span-2">
                   <PredictionTimeline events={report.predicted_timeline || []} />
                </div>
             </div>
          </div>
        </div>

        {/* RIGHT SIDEBAR COLUMN */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          
          {/* CONFIDENCE GAUGE */}
          <div className="bg-[#0c0c0c] border border-[#262626] p-6">
             <div className="flex justify-between items-center mb-4">
                <h3 className="text-xs font-mono text-slate-500 uppercase flex items-center gap-2">
                  <Activity className="w-3 h-3" /> Confidence Gauge
                </h3>
                <span className="text-blue-500 font-bold font-mono">{(report.confidence_score * 100).toFixed(0)}% Accuracy</span>
             </div>
             <div className="h-2 bg-[#222] w-full rounded-sm overflow-hidden mb-2">
                <div 
                  className="h-full bg-blue-500 transition-all duration-1000" 
                  style={{ width: `${report.confidence_score * 100}%` }}
                ></div>
             </div>
          </div>

           {/* RISK ANALYSIS (Detailed) */}
           <RiskAnalysisPanel risks={report.risk_analysis || []} />

           {/* VERIFIED SOURCES - NEW SECTION */}
           {report.sources && report.sources.length > 0 && (
              <div className="bg-[#0c0c0c] border border-blue-900/30 p-6">
                 <h3 className="text-xs font-mono text-blue-400 uppercase flex items-center gap-2 mb-4">
                   <Link2 className="w-3 h-3" /> Verified Sources
                 </h3>
                 <div className="space-y-3">
                    {report.sources.map((source, idx) => (
                       <a 
                         key={idx} 
                         href={source.url} 
                         target="_blank" 
                         rel="noopener noreferrer"
                         className="block group"
                       >
                          <div className="flex items-start gap-3 p-3 bg-blue-900/5 hover:bg-blue-900/10 border border-transparent hover:border-blue-500/30 transition-all rounded">
                             <ExternalLink className="w-3 h-3 text-slate-500 group-hover:text-blue-500 mt-1 shrink-0" />
                             <div>
                               <p className="text-xs text-slate-300 group-hover:text-white line-clamp-2 leading-snug">
                                 {source.title || source.url}
                               </p>
                               <p className="text-[10px] text-slate-600 font-mono mt-1 truncate">
                                 {new URL(source.url).hostname}
                               </p>
                             </div>
                          </div>
                       </a>
                    ))}
                 </div>
              </div>
           )}

          {/* SCENARIOS LIST */}
          <div className="bg-[#0c0c0c] border border-[#262626] p-6 flex-1">
             <h3 className="text-xs font-mono text-slate-500 uppercase flex items-center gap-2 mb-6">
               <Zap className="w-3 h-3" /> Potential Outcomes
             </h3>
             
             <div className="space-y-6">
               {report.scenarios.map((scenario, idx) => (
                 <div key={idx} className="group cursor-default">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-bold text-slate-300 uppercase group-hover:text-white transition-colors">
                        {scenario.title}
                      </span>
                      <span className={`text-[10px] font-bold uppercase ${
                         scenario.impact_level === 'high' || scenario.impact_level === 'critical' ? 'text-red-500' :
                         scenario.impact_level === 'medium' ? 'text-yellow-500' : 'text-purple-500'
                      }`}>
                        {scenario.impact_level}
                      </span>
                    </div>
                    <div className="w-full bg-[#1a1a1a] h-1 mb-2">
                       <div className={`h-full ${
                          scenario.impact_level === 'high' || scenario.impact_level === 'critical' ? 'bg-red-900' :
                          scenario.impact_level === 'medium' ? 'bg-yellow-900' : 'bg-purple-900'
                       }`} style={{ width: `${scenario.probability}%` }}></div>
                    </div>
                    <p className="text-xs text-slate-500 leading-tight">
                      {scenario.description}
                    </p>
                 </div>
               ))}
             </div>
          </div>

          {/* WHY THIS MATTERS */}
          <div className="bg-[#0c0c0c] border border-[#262626] p-6">
             <h3 className="text-xs font-mono text-slate-500 uppercase flex items-center gap-2 mb-4">
               <Globe className="w-3 h-3" /> Impact Summary
             </h3>
             <p className="text-sm text-slate-300 italic leading-relaxed border-l-2 border-slate-700 pl-3">
               "{report.financial_impact.summary}"
             </p>
             <div className="mt-4 pt-4 border-t border-[#1a1a1a] flex gap-2 flex-wrap">
               {report.financial_impact.sectors_affected.map(sector => (
                 <span key={sector} className="px-2 py-1 bg-[#1a1a1a] text-slate-500 text-[10px] font-mono uppercase">
                   {sector}
                 </span>
               ))}
             </div>
          </div>

        </div>

      </div>
    </div>
  );
};
