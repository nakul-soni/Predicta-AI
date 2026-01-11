import React from 'react';
import { PredictedEvent } from '../types';
import { CalendarClock, ArrowRight } from 'lucide-react';

interface Props {
  events: PredictedEvent[];
}

export const PredictionTimeline: React.FC<Props> = ({ events }) => {
  // Helper to translate % to words
  const getLikelihoodLabel = (val: number) => {
    if (val >= 90) return "Almost Certain";
    if (val >= 75) return "Highly Likely";
    if (val >= 50) return "Possible";
    if (val >= 25) return "Unlikely";
    return "Rare";
  };

  return (
    <div className="relative py-2 space-y-0">
      {events.map((event, idx) => {
        const isHighProb = event.likelihood > 75;
        
        return (
          <div key={idx} className="flex group">
            
            {/* Left Column: Time */}
            <div className="w-24 md:w-32 shrink-0 flex flex-col items-end pr-4 py-2 border-r border-[#333] relative">
               <span className="text-xs font-bold text-white text-right leading-tight mb-1">
                 {event.timeframe}
               </span>
               <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">
                 {event.type}
               </span>
               
               {/* Dot on the line */}
               <div className={`absolute right-[-5px] top-3.5 w-2.5 h-2.5 rounded-full border-2 bg-[#0c0c0c] z-10 transition-colors ${
                 isHighProb ? 'border-blue-500 bg-blue-500' : 'border-slate-600 bg-[#0c0c0c]'
               }`}></div>
            </div>

            {/* Right Column: Content */}
            <div className="flex-1 pl-6 pb-8 group-last:pb-0">
               <div className={`p-4 rounded-lg border transition-all ${
                 isHighProb 
                 ? 'bg-blue-500/5 border-blue-500/30' 
                 : 'bg-[#111] border-[#222] hover:border-slate-600'
               }`}>
                  <h4 className="text-sm font-medium text-slate-200 mb-2 leading-snug">
                    {event.event_description}
                  </h4>
                  
                  <div className="flex items-center gap-2">
                     <span className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded-sm tracking-widest ${
                        isHighProb ? 'bg-blue-500 text-black' : 'bg-slate-800 text-slate-400'
                     }`}>
                        {getLikelihoodLabel(event.likelihood)}
                     </span>
                     <span className="text-[10px] font-mono text-slate-600">
                        {event.likelihood}% confidence
                     </span>
                  </div>
               </div>
            </div>

          </div>
        );
      })}
    </div>
  );
};