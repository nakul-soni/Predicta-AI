import React from 'react';
import { DetailedRisk } from '../types';
import { AlertTriangle, Wind, AlertOctagon, Info } from 'lucide-react';

interface Props {
  risks: DetailedRisk[];
}

export const RiskAnalysisPanel: React.FC<Props> = ({ risks }) => {
  // Helper to translate numbers into simple English levels
  const getRiskLevel = (severity: number, probability: number) => {
    const score = (severity + probability) / 2;
    if (score >= 80) return { label: 'CRITICAL', color: 'text-red-500', bg: 'bg-red-500/10', border: 'border-red-500/50', icon: AlertOctagon };
    if (score >= 60) return { label: 'HIGH', color: 'text-orange-500', bg: 'bg-orange-500/10', border: 'border-orange-500/50', icon: AlertTriangle };
    if (score >= 40) return { label: 'MODERATE', color: 'text-yellow-500', bg: 'bg-yellow-500/10', border: 'border-yellow-500/50', icon: AlertTriangle };
    return { label: 'LOW', color: 'text-emerald-500', bg: 'bg-emerald-500/10', border: 'border-emerald-500/50', icon: Info };
  };

  return (
    <div className="bg-[#0c0c0c] border border-red-900/30 overflow-hidden">
      {/* User-Friendly Header */}
      <div className="bg-red-900/10 px-6 py-4 border-b border-red-900/30">
        <h3 className="text-sm font-header text-red-400 uppercase tracking-widest flex items-center gap-2">
          <AlertTriangle className="w-4 h-4" /> Threat Assessment
        </h3>
        <p className="text-[10px] text-slate-400 mt-1">
          Simplified breakdown of potential negative impacts.
        </p>
      </div>

      <div className="p-6 grid grid-cols-1 gap-4">
        {risks.map((risk, idx) => {
          const level = getRiskLevel(risk.severity, risk.probability);
          const Icon = level.icon;

          return (
            <div key={idx} className={`relative p-5 rounded-lg border ${level.border} ${level.bg} transition-all hover:bg-opacity-30`}>
              
              {/* Header Row: Category & Level */}
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 bg-black/40 px-2 py-0.5 rounded">
                    {risk.category}
                  </span>
                </div>
                <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full border ${level.border} ${level.color} bg-black/60`}>
                   <Icon className="w-3 h-3" />
                   <span className="text-[10px] font-bold uppercase tracking-widest">{level.label} PRIORITY</span>
                </div>
              </div>

              {/* Main Risk Name */}
              <h4 className="text-lg font-bold text-white mb-3 tracking-wide">
                {risk.risk_name}
              </h4>

              {/* The "What does this mean?" Section */}
              <div className="bg-black/40 p-3 rounded border-l-2 border-slate-600 mb-4">
                 <p className="text-xs text-slate-500 uppercase font-bold mb-1">Implication (What this means for you):</p>
                 <p className="text-sm text-slate-200 italic leading-relaxed">
                   "{risk.implication}"
                 </p>
              </div>

              {/* Simple Metrics Footer */}
              <div className="flex items-center gap-6 pt-2 border-t border-white/5">
                 <div className="flex flex-col">
                    <span className="text-[10px] text-slate-500 uppercase">Likelihood</span>
                    <span className="text-xs font-mono text-slate-300">{risk.probability > 75 ? 'Very Likely' : risk.probability > 50 ? 'Possible' : 'Unlikely'} ({risk.probability}%)</span>
                 </div>
                 <div className="flex flex-col">
                    <span className="text-[10px] text-slate-500 uppercase">Speed of Impact</span>
                    <span className={`text-xs font-mono font-bold ${
                      risk.velocity === 'Instant' || risk.velocity === 'High' ? 'text-red-400' : 'text-slate-300'
                    }`}>
                      {risk.velocity.toUpperCase()}
                    </span>
                 </div>
              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
};