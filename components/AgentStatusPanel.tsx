import React, { useEffect, useState } from 'react';
import { AgentStatus } from '../types';
import { Activity, ShieldCheck, Globe, BrainCircuit, LineChart, Cpu, Share2, Scale, Users, Zap } from 'lucide-react';

interface Props {
  isLoading: boolean;
}

const AGENTS: Omit<AgentStatus, 'status'>[] = [
  { id: 1, name: 'Global News Collection', role: 'Ingest' },
  { id: 2, name: 'Language & Norm', role: 'Process' },
  { id: 3, name: 'News Understanding', role: 'Analyze' },
  { id: 4, name: 'Risk & Scenario', role: 'Reason' },
  { id: 5, name: 'Event Prediction', role: 'Forecast' },
  { id: 6, name: 'Knowledge Graph', role: 'Memory' },
  { id: 7, name: 'Financial Strategy', role: 'Impact' },
  { id: 8, name: 'Personalization', role: 'Filter' },
  { id: 9, name: 'Ethics & Safety', role: 'Guard' },
];

const ICONS = [Globe, Share2, BrainCircuit, Activity, LineChart, Cpu, LineChart, Users, ShieldCheck];

export const AgentStatusPanel: React.FC<Props> = ({ isLoading }) => {
  const [agents, setAgents] = useState<AgentStatus[]>(
    AGENTS.map(a => ({ ...a, status: 'idle' }))
  );

  useEffect(() => {
    if (!isLoading) {
      setAgents(prev => prev.map(a => ({ ...a, status: 'idle', currentTask: 'Standing by' })));
      return;
    }

    let activeIndex = 0;
    const interval = setInterval(() => {
      setAgents(prev => prev.map((agent, idx) => {
        if (idx === activeIndex) return { ...agent, status: 'working', currentTask: 'Processing...' };
        if (idx < activeIndex) return { ...agent, status: 'standby', currentTask: 'Complete' };
        return { ...agent, status: 'idle', currentTask: 'Waiting' };
      }));
      
      activeIndex++;
      if (activeIndex >= AGENTS.length) activeIndex = 0;
    }, 600);

    return () => clearInterval(interval);
  }, [isLoading]);

  return (
    <div className="hidden md:flex flex-col w-64 h-full bg-slate-900/30 border-r border-slate-800/50 backdrop-blur-xl">
      <div className="p-6 border-b border-slate-800/50">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
          <Zap className="w-3 h-3" /> System Status
        </div>
        <div className="flex items-center justify-between bg-slate-950/50 p-3 rounded-lg border border-slate-800/50">
           <span className="text-sm font-semibold text-slate-200">
             {isLoading ? 'Processing' : 'Monitoring'}
           </span>
           <div className={`w-2 h-2 rounded-full ${isLoading ? 'bg-cyan-500 animate-pulse' : 'bg-emerald-500'}`}></div>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {agents.map((agent, idx) => {
          const Icon = ICONS[idx];
          const isActive = agent.status === 'working';
          const isDone = agent.status === 'standby';
          
          return (
            <div 
              key={agent.id}
              className={`relative flex items-center gap-3 p-3 rounded-lg transition-all duration-300 ${
                isActive 
                  ? 'bg-slate-800/80 shadow-lg shadow-cyan-900/10' 
                  : isDone 
                    ? 'bg-transparent opacity-70' 
                    : 'bg-transparent opacity-40'
              }`}
            >
              <div className={`flex items-center justify-center w-8 h-8 rounded-lg ${
                isActive ? 'bg-cyan-500/20 text-cyan-400' : isDone ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-800 text-slate-500'
              }`}>
                <Icon className="w-4 h-4" />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center mb-0.5">
                  <span className={`text-xs font-medium truncate ${isActive ? 'text-white' : 'text-slate-400'}`}>
                    {agent.name}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[10px] text-slate-600 uppercase font-bold">{agent.role}</span>
                  {isActive && <span className="text-[10px] text-cyan-500 animate-pulse">Running...</span>}
                  {isDone && <span className="text-[10px] text-emerald-500">Done</span>}
                </div>
              </div>
              
              {isActive && (
                <div className="absolute left-0 bottom-0 h-[2px] bg-cyan-500 animate-progress w-full rounded-b-lg opacity-50"></div>
              )}
            </div>
          );
        })}
      </div>
      
      <div className="p-4 border-t border-slate-800/50 text-center">
        <p className="text-[10px] text-slate-600">Omniscience Intelligence System v1.0</p>
      </div>
    </div>
  );
};