import React from 'react';
import { IntelligenceReport } from '../types';
import { AlertTriangle, TrendingUp, Shield, ChevronRight, Zap } from 'lucide-react';

interface Props {
  report: IntelligenceReport;
  onClick: (report: IntelligenceReport) => void;
}

export const NewsCard: React.FC<Props> = ({ report, onClick }) => {
  return (
    <div 
      onClick={() => onClick(report)}
      className="group flex flex-col md:flex-row items-stretch bg-[#0a0a0a] border border-[#222] hover:border-blue-500/50 hover:bg-[#0e0e0e] transition-all cursor-pointer overflow-hidden min-h-[120px]"
    >
      {/* Left Stripe Indicator */}
      <div className={`w-1 md:w-2 ${
        report.detected_risks.length > 0 ? 'bg-blue-500' : 'bg-slate-700'
      } group-hover:animate-pulse`}></div>

      {/* Main Content */}
      <div className="flex-1 p-5 flex flex-col justify-center">
        <div className="flex items-center gap-3 mb-2">
           <span className="text-[10px] font-mono text-blue-500 uppercase tracking-wider bg-blue-500/10 px-1.5 py-0.5">
             {report.domain}
           </span>
           <span className="text-[10px] font-mono text-slate-500 uppercase">
             {report.region} // {new Date(report.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} UTC
           </span>
        </div>
        
        <h3 className="text-xl font-header font-medium text-slate-200 group-hover:text-white mb-2 line-clamp-1">
          {report.headline}
        </h3>
        
        <p className="text-sm text-slate-500 line-clamp-1 font-sans">
          {report.summary}
        </p>
      </div>

      {/* Right Stats (Hidden on mobile for space) */}
      <div className="hidden md:flex flex-col justify-center w-64 border-l border-[#222] bg-[#0c0c0c] p-5">
         <div className="flex justify-between items-center mb-2">
            <span className="text-[10px] font-mono text-slate-600 uppercase">Confidence</span>
            <span className="text-xs font-bold text-blue-500 font-mono">{(report.confidence_score * 100).toFixed(0)}%</span>
         </div>
         <div className="w-full bg-[#1a1a1a] h-1 mb-4">
            <div className="h-full bg-slate-500 group-hover:bg-blue-500 transition-colors" style={{width: `${report.confidence_score * 100}%`}}></div>
         </div>
         
         <div className="flex justify-between items-center">
            <div className="flex -space-x-1">
              {report.scenarios.map((s, i) => (
                <div 
                  key={i} 
                  className={`w-2 h-2 rounded-full ring-2 ring-[#0c0c0c] ${
                    s.impact_level === 'high' || s.impact_level === 'critical' ? 'bg-red-500' : 'bg-slate-600'
                  }`}
                />
              ))}
            </div>
            <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-blue-500 transition-colors" />
         </div>
      </div>
    </div>
  );
};