import React, { useState, useEffect, useRef } from 'react';
import { runScenarioSimulation } from '../services/geminiService';
import { UserPreferences, IntelligenceReport } from '../types';
import { BrainCircuit, ArrowLeft, AlertTriangle, Loader2, Sparkles, ChevronRight, CornerDownRight, Terminal, CheckCircle2, Microscope, Layers } from 'lucide-react';
import { ReportDetail } from './ReportDetail';

interface Props {
  prefs: UserPreferences;
  onBack: () => void;
}

const SAMPLE_SCENARIOS = [
  "Indefinite closure of the Panama Canal due to drought",
  "Major cyberattack on US Energy Grid",
  "Unexpected breakthrough in Nuclear Fusion",
  "Global ban on AI development by UN"
];

const STANDARD_LOGS = [
  "Initializing neural simulation environment...",
  "Agent 4 [RISK]: Identifying primary risk vectors...",
  "Agent 4 [RISK]: Modeling second-order supply chain cascades...",
  "Agent 5 [PREDICT]: Extrapolating temporal event horizons...",
  "Agent 5 [PREDICT]: Calculating probabilistic outcomes...",
  "Agent 7 [STRATEGY]: Formulating defensive protocols...",
  "Agent 9 [SAFETY]: Verifying output integrity...",
  "Synthesizing final intelligence artifact..."
];

const DEEP_RESEARCH_LOGS = [
  "Initializing DEEP RESEARCH protocol (Thinking Mode: ON)...",
  "Accessing historical archives for precedent analysis...",
  "Agent 4 [RISK]: Performing multi-variate impact analysis...",
  "Agent 4 [RISK]: Modeling 3rd-order butterfly effects...",
  "Agent 6 [KNOWLEDGE]: Cross-referencing commodity dependencies...",
  "Agent 5 [PREDICT]: Running Monte Carlo timeline simulations...",
  "Agent 7 [STRATEGY]: Developing comprehensive contingency playbooks...",
  "Synthesizing extended report with deep-dive analytics..."
];

export const ScenarioSimulator: React.FC<Props> = ({ prefs, onBack }) => {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [deepResearch, setDeepResearch] = useState(false);
  const [result, setResult] = useState<IntelligenceReport | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [logIndex, setLogIndex] = useState(0);

  // Timer ref to clear interval
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const startSimulation = async (scenarioText: string) => {
    if (!scenarioText.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);
    setLogIndex(0);
    setInput(scenarioText);

    // Select logs based on mode
    const logs = deepResearch ? DEEP_RESEARCH_LOGS : STANDARD_LOGS;

    // Start fake progress logs
    timerRef.current = window.setInterval(() => {
      setLogIndex(prev => {
        if (prev < logs.length - 1) return prev + 1;
        return prev;
      });
    }, deepResearch ? 2000 : 1500); // Slower logs for deep research

    try {
      const report = await runScenarioSimulation(prefs, scenarioText, deepResearch);
      
      if (report) {
        setResult(report);
      } else {
        setError("Simulation failed to converge. Please try again with a different prompt.");
      }
    } catch (err) {
      setError("System error during simulation.");
    } finally {
      setLoading(false);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  };

  const handleReset = () => {
    setResult(null);
    setInput('');
    setError(null);
  };

  if (result) {
    return (
      <div className="h-full flex flex-col">
        <div className="mb-4 flex items-center justify-between border-b border-[#222] pb-4">
           <button 
             onClick={handleReset} 
             className="text-xs font-mono text-blue-500 uppercase hover:text-white flex items-center gap-2 group"
           >
             <CornerDownRight className="w-3 h-3 group-hover:-translate-x-1 transition-transform" /> New Simulation
           </button>
           <span className="text-xs font-mono text-purple-500 flex items-center gap-2">
              <BrainCircuit className="w-4 h-4" /> SIMULATION MODE ACTIVE
           </span>
        </div>
        <ReportDetail report={result} onBack={onBack} />
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col animate-in fade-in zoom-in-95 duration-500">
      
      {/* HEADER WITH BACK BUTTON */}
      <div className="w-full flex justify-between items-center p-6 border-b border-[#222]">
         <button 
           onClick={onBack}
           className="text-xs font-mono text-slate-500 hover:text-white uppercase flex items-center gap-2 group transition-colors"
         >
           <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Exit Simulation
         </button>
         <div className="flex items-center gap-2 text-purple-500 opacity-50">
            <BrainCircuit className="w-4 h-4" />
            <span className="text-[10px] font-mono uppercase tracking-widest">Neural Sandbox</span>
         </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-4 lg:p-12">
        <div className="max-w-3xl w-full bg-[#0a0a0a] border border-[#262626] p-8 md:p-12 relative overflow-hidden shadow-2xl">
          {/* Decorative Background */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/5 blur-[80px] rounded-full pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/5 blur-[80px] rounded-full pointer-events-none"></div>

          <div className="relative z-10">
            <div className="flex flex-col items-center text-center mb-10">
              <div className={`w-16 h-16 bg-[#111] border rounded-full flex items-center justify-center mb-6 transition-colors duration-500 ${deepResearch ? 'border-amber-500/50 text-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.2)]' : 'border-[#333] text-purple-500'}`}>
                {deepResearch ? <Microscope className="w-8 h-8" /> : <BrainCircuit className="w-8 h-8" />}
              </div>
              <h1 className="text-3xl md:text-4xl font-header text-white font-medium tracking-wide mb-3">
                Scenario <span className={deepResearch ? 'text-amber-500' : 'text-purple-500'}>Simulator</span>
              </h1>
              <p className="text-slate-400 font-sans max-w-lg mx-auto">
                Engage Agent 04 and Agent 05 to model probabilistic outcomes of hypothetical global events.
              </p>
            </div>

            <div className="space-y-4">
              <div className="relative group">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Describe a hypothetical event (e.g., 'A new pandemic starts in...')"
                  className={`w-full h-32 bg-[#050505] border text-slate-200 p-4 text-sm font-mono focus:outline-none transition-all resize-none disabled:opacity-50 ${
                    deepResearch 
                    ? 'border-amber-900/30 focus:border-amber-500 focus:ring-1 focus:ring-amber-500/50' 
                    : 'border-[#333] focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50'
                  }`}
                  disabled={loading}
                />
                {!loading && (
                  <div className="absolute bottom-3 right-3">
                    <span className="text-[10px] text-slate-600 font-mono uppercase">
                      {input.length} chars
                    </span>
                  </div>
                )}
              </div>

              {/* DEEP RESEARCH TOGGLE */}
              <div className="flex items-center justify-between bg-[#0e0e0e] border border-[#222] p-3 rounded-sm">
                  <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-full ${deepResearch ? 'bg-amber-500/10 text-amber-500' : 'bg-[#1a1a1a] text-slate-500'}`}>
                          <Layers className="w-4 h-4" />
                      </div>
                      <div>
                          <div className={`text-xs font-bold uppercase tracking-wider ${deepResearch ? 'text-amber-500' : 'text-slate-400'}`}>
                              Deep Research Mode
                          </div>
                          <div className="text-[10px] text-slate-600">
                              Enables multi-step reasoning & historical analysis (Slower)
                          </div>
                      </div>
                  </div>
                  <button 
                    onClick={() => !loading && setDeepResearch(!deepResearch)}
                    disabled={loading}
                    className={`w-10 h-5 rounded-full relative transition-colors duration-300 ${deepResearch ? 'bg-amber-600' : 'bg-[#333]'}`}
                  >
                      <div className={`absolute top-1 left-1 w-3 h-3 bg-white rounded-full transition-transform duration-300 ${deepResearch ? 'translate-x-5' : 'translate-x-0'}`}></div>
                  </button>
              </div>

              {error && (
                <div className="p-3 bg-red-900/20 border border-red-500/30 flex items-center gap-3 text-red-400 font-mono text-xs">
                  <AlertTriangle className="w-4 h-4" /> {error}
                </div>
              )}

              {loading ? (
                <div className={`bg-[#050505] border p-4 font-mono text-xs space-y-2 h-40 overflow-hidden relative ${deepResearch ? 'border-amber-900/30' : 'border-purple-900/30'}`}>
                    <div className={`flex items-center gap-2 border-b pb-2 mb-2 ${deepResearch ? 'text-amber-400 border-amber-900/30' : 'text-purple-400 border-purple-900/30'}`}>
                      <Loader2 className="w-3 h-3 animate-spin" /> {deepResearch ? 'DEEP RESEARCH LOG' : 'SYSTEM LOG'}
                    </div>
                    {(deepResearch ? DEEP_RESEARCH_LOGS : STANDARD_LOGS).slice(0, logIndex + 1).map((log, i) => (
                      <div key={i} className="text-slate-400 animate-in fade-in slide-in-from-left-2 duration-300 flex items-center gap-2">
                        <span className={deepResearch ? "text-amber-500" : "text-purple-500"}>&gt;&gt;</span> {log}
                      </div>
                    ))}
                    <div className="absolute bottom-0 left-0 w-full h-12 bg-gradient-to-t from-[#050505] to-transparent"></div>
                </div>
              ) : (
                <button
                  onClick={() => startSimulation(input)}
                  disabled={!input.trim()}
                  className={`w-full border font-bold py-4 font-mono text-sm uppercase tracking-widest flex items-center justify-center gap-3 transition-all disabled:opacity-50 disabled:cursor-not-allowed group ${
                    deepResearch 
                    ? 'bg-amber-900/20 hover:bg-amber-900/30 border-amber-500/50 text-amber-400' 
                    : 'bg-purple-900/20 hover:bg-purple-900/30 border-purple-500/50 text-purple-400'
                  }`}
                >
                  {deepResearch ? <Microscope className="w-5 h-5" /> : <Sparkles className="w-5 h-5" />} 
                  {deepResearch ? 'Initiate Deep Analysis' : 'Initiate Simulation'}
                </button>
              )}
            </div>

            {!loading && (
              <div className="mt-10 pt-8 border-t border-[#222]">
                <p className="text-[10px] font-mono text-slate-600 uppercase mb-4 text-center">
                  /// Select a predefined scenario node
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {SAMPLE_SCENARIOS.map((scenario, idx) => (
                    <button
                      key={idx}
                      onClick={() => startSimulation(scenario)}
                      className={`text-left p-3 border border-[#222] bg-[#0c0c0c] transition-all group flex items-start gap-2 ${
                          deepResearch 
                          ? 'hover:border-amber-500/30 hover:bg-[#111]' 
                          : 'hover:border-purple-500/30 hover:bg-[#111]'
                      }`}
                    >
                      <ChevronRight className={`w-3 h-3 mt-1 shrink-0 group-hover:translate-x-1 transition-transform ${deepResearch ? 'text-amber-500' : 'text-purple-500'}`} />
                      <span className="text-xs text-slate-400 group-hover:text-slate-200 leading-snug">
                        {scenario}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};