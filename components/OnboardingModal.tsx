import React, { useState } from 'react';
import { UserPreferences } from '../types';
import { Shield, Globe, Zap, CheckCircle2, ArrowRight, Lock } from 'lucide-react';

interface Props {
  onComplete: (prefs: UserPreferences) => void;
}

export const OnboardingModal: React.FC<Props> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [prefs, setPrefs] = useState<Partial<UserPreferences>>({
    interests: [],
    regions: [],
    riskTolerance: 'medium'
  });

  const toggleSelection = (key: 'interests' | 'regions', value: string) => {
    setPrefs(prev => {
      const current = prev[key] || [];
      if (current.includes(value)) {
        return { ...prev, [key]: current.filter(i => i !== value) };
      }
      return { ...prev, [key]: [...current, value] };
    });
  };

  const INTEREST_OPTIONS = ['Geopolitics', 'Finance', 'Technology', 'Climate Change', 'Energy', 'Healthcare', 'Cybersecurity', 'Supply Chain'];
  const REGION_OPTIONS = ['North America', 'Europe', 'Asia-Pacific', 'Middle East', 'Latin America', 'Africa', 'Global'];

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
    else {
      onComplete({
        name: 'Agent', // Default
        interests: prefs.interests || [],
        regions: prefs.regions || [],
        riskTolerance: prefs.riskTolerance as 'low' | 'medium' | 'high',
        onboarded: true
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90">
      <div className="relative w-full max-w-2xl bg-[#0a0a0a] border border-[#222] shadow-[0_0_50px_rgba(0,0,0,0.8)] flex flex-col font-sans">
        
        {/* Header */}
        <div className="p-8 border-b border-[#222] flex items-center justify-between">
           <div>
             <h2 className="text-xl font-header font-bold text-white tracking-widest uppercase flex items-center gap-2">
               <div className="w-3 h-3 bg-blue-500"></div> System Initialization
             </h2>
             <p className="text-slate-500 font-mono text-xs mt-1">ESTABLISHING NEURAL LINK...</p>
           </div>
           <Lock className="w-5 h-5 text-slate-600" />
        </div>

        {/* Body */}
        <div className="p-8 min-h-[400px]">
          {step === 1 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
               <h3 className="font-mono text-blue-500 text-sm mb-4 uppercase">/// Select Target Sectors</h3>
               
               <div className="grid grid-cols-2 gap-3">
                 {INTEREST_OPTIONS.map(opt => (
                   <button
                     key={opt}
                     onClick={() => toggleSelection('interests', opt)}
                     className={`p-3 border text-xs font-mono text-left uppercase transition-all ${
                       prefs.interests?.includes(opt)
                       ? 'bg-blue-500/10 border-blue-500 text-blue-500'
                       : 'bg-[#111] border-[#333] text-slate-500 hover:border-slate-500'
                     }`}
                   >
                     [{prefs.interests?.includes(opt) ? 'X' : ' '}] {opt}
                   </button>
                 ))}
               </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
               <h3 className="font-mono text-blue-500 text-sm mb-4 uppercase">/// Select Surveillance Zones</h3>
               <div className="grid grid-cols-2 gap-3">
                 {REGION_OPTIONS.map(opt => (
                   <button
                     key={opt}
                     onClick={() => toggleSelection('regions', opt)}
                     className={`p-3 border text-xs font-mono text-left uppercase transition-all ${
                       prefs.regions?.includes(opt)
                       ? 'bg-blue-500/10 border-blue-500 text-blue-500'
                       : 'bg-[#111] border-[#333] text-slate-500 hover:border-slate-500'
                     }`}
                   >
                     [{prefs.regions?.includes(opt) ? 'X' : ' '}] {opt}
                   </button>
                 ))}
               </div>
            </div>
          )}

          {step === 3 && (
             <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
               <h3 className="font-mono text-blue-500 text-sm mb-4 uppercase">/// Calibrate Risk Sensitivity</h3>
               
               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {(['low', 'medium', 'high'] as const).map(level => (
                    <button
                      key={level}
                      onClick={() => setPrefs(p => ({ ...p, riskTolerance: level }))}
                      className={`p-6 border flex flex-col items-center gap-4 transition-all ${
                         prefs.riskTolerance === level
                         ? 'bg-[#111] border-blue-500'
                         : 'bg-transparent border-[#333] hover:border-slate-500'
                      }`}
                    >
                      <div className={`w-2 h-2 rounded-full ${
                        level === 'low' ? 'bg-emerald-500' : level === 'medium' ? 'bg-yellow-500' : 'bg-red-500'
                      }`} />
                      <span className="capitalize font-bold text-white font-header tracking-widest">{level}</span>
                    </button>
                  ))}
               </div>
             </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-8 border-t border-[#222] flex justify-between items-center bg-[#080808]">
           <div className="flex gap-1">
              {[1, 2, 3].map(i => (
                <div key={i} className={`w-8 h-1 ${i <= step ? 'bg-blue-500' : 'bg-[#333]'}`}></div>
              ))}
           </div>
           <button 
             onClick={handleNext}
             className="flex items-center gap-2 px-6 py-3 bg-white text-black font-bold font-mono text-xs uppercase hover:bg-blue-500 hover:text-black transition-colors"
           >
             {step === 3 ? 'ACTIVATE' : 'PROCEED'} <ArrowRight className="w-4 h-4" />
           </button>
        </div>
      </div>
    </div>
  );
};