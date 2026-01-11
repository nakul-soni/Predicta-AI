import React from 'react';
import { StrategicAdvice } from '../types';
import { Crosshair, Shield, TrendingUp, Eye } from 'lucide-react';

interface Props {
  advice: StrategicAdvice[];
}

export const StrategicAdvisory: React.FC<Props> = ({ advice }) => {
  return (
    <div className="bg-[#050505] border border-cyan-900/30 flex flex-col h-full">
      <div className="bg-cyan-900/10 px-6 py-3 border-b border-cyan-900/30 flex justify-between items-center">
        <h3 className="text-sm font-header text-cyan-400 uppercase tracking-widest flex items-center gap-2">
          <Crosshair className="w-4 h-4" /> Agent 07 :: Tactical Command
        </h3>
        <span className="text-[10px] font-mono text-cyan-500 animate-pulse">:: ACTIVE ADVISORY</span>
      </div>

      <div className="p-6 space-y-4">
        {advice.map((item, idx) => {
          let icon = <Shield className="w-4 h-4 text-emerald-500" />;
          let borderColor = 'border-emerald-500/20';
          let textColor = 'text-emerald-400';
          let bgHover = 'hover:bg-emerald-900/10';

          if (item.type === 'Offensive') {
            icon = <TrendingUp className="w-4 h-4 text-cyan-500" />;
            borderColor = 'border-cyan-500/20';
            textColor = 'text-cyan-400';
            bgHover = 'hover:bg-cyan-900/10';
          } else if (item.type === 'Watchlist') {
            icon = <Eye className="w-4 h-4 text-yellow-500" />;
            borderColor = 'border-yellow-500/20';
            textColor = 'text-yellow-400';
            bgHover = 'hover:bg-yellow-900/10';
          }

          return (
            <div key={idx} className={`border ${borderColor} bg-[#0a0a0a] p-4 transition-all ${bgHover} group`}>
              <div className="flex items-start gap-3">
                <div className="mt-1 opacity-80 group-hover:opacity-100 transition-opacity">
                  {icon}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-[10px] font-bold uppercase tracking-widest border border-current px-1.5 py-0.5 rounded-sm ${textColor}`}>
                      {item.type} Protocol
                    </span>
                  </div>
                  <h4 className="text-sm font-medium text-slate-200 mb-1 font-mono">
                    {item.action}
                  </h4>
                  <p className="text-xs text-slate-500 leading-relaxed border-l-2 border-[#222] pl-2 mt-2">
                    Rationale: {item.rationale}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};