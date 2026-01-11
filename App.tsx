import React, { useState, useEffect } from 'react';
import { fetchGlobalIntelligence, identifyLocation } from './services/geminiService';
import { UserPreferences, IntelligenceReport, ViewMode, LocationCoordinates } from './types';
import { AgentStatusPanel } from './components/AgentStatusPanel';
import { NewsCard } from './components/NewsCard';
import { ReportDetail } from './components/ReportDetail';
import { OnboardingModal } from './components/OnboardingModal';
import { AuthScreen } from './components/AuthScreen';
import { ScenarioSimulator } from './components/ScenarioSimulator';
import { 
  LayoutDashboard, Bell, RefreshCw, AlertCircle, Menu, 
  Radio, Activity, Cpu, Globe, Zap, Shield, BarChart3, Database, LogOut, Search, MapPin, ArrowRight, BrainCircuit 
} from 'lucide-react';

const App = () => {
  console.log('App: Rendering...');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [prefs, setPrefs] = useState<UserPreferences | null>(null);
  const [reports, setReports] = useState<IntelligenceReport[]>([]);
  const [selectedReport, setSelectedReport] = useState<IntelligenceReport | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.DASHBOARD);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>('ALL');

  // New State for Search & Location
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSearch, setActiveSearch] = useState(''); // The query currently being fetched
  const [userLocation, setUserLocation] = useState<LocationCoordinates | null>(null);
  const [locationName, setLocationName] = useState<string | null>(null);
  const [locationStatus, setLocationStatus] = useState<'idle' | 'locating' | 'found' | 'denied'>('idle');

  useEffect(() => {
    // Check session
    const session = localStorage.getItem('omniscience_session');
    if (session) {
      setIsAuthenticated(true);
    }

    // Check prefs
    const savedPrefs = localStorage.getItem('omniscience_prefs');
    if (savedPrefs) {
      setPrefs(JSON.parse(savedPrefs));
    }

    // Auto-detect location on mount if authenticated
    if (session) {
      detectLocation();
    }
  }, [isAuthenticated]);

  const detectLocation = () => {
    if (!navigator.geolocation) {
      setLocationStatus('denied');
      return;
    }

    setLocationStatus('locating');
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        setUserLocation({ lat, lng });
        
        // Resolve City Name via AI
        try {
          const name = await identifyLocation(lat, lng);
          setLocationName(name);
          setLocationStatus('found');
        } catch (e) {
          console.warn("Failed to resolve location name");
          setLocationName(`${lat.toFixed(2)}, ${lng.toFixed(2)}`);
          setLocationStatus('found');
        }
      },
      (err) => {
        console.warn("Geolocation denied or failed:", err);
        setLocationStatus('denied');
      }
    );
  };

  const handleLogin = (email: string) => {
    localStorage.setItem('omniscience_session', JSON.stringify({ email, timestamp: Date.now() }));
    setIsAuthenticated(true);
    detectLocation();
  };

  const handleLogout = () => {
    localStorage.removeItem('omniscience_session');
    setIsAuthenticated(false);
    setReports([]);
    setUserLocation(null);
    setLocationName(null);
  };

  const handleOnboardingComplete = (newPrefs: UserPreferences) => {
    setPrefs(newPrefs);
    localStorage.setItem('omniscience_prefs', JSON.stringify(newPrefs));
    refreshIntelligence(newPrefs);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim() && prefs) {
      setActiveSearch(searchQuery);
      refreshIntelligence(prefs, searchQuery);
    }
  };

  const refreshIntelligence = async (currentPrefs: UserPreferences, query: string = '', location: LocationCoordinates | null = userLocation) => {
    setIsLoading(true);
    setError(null);
    try {
      // If we have a query, activeSearch is set. If not, clear it to indicate feed mode.
      if (!query) setActiveSearch('');
      setViewMode(ViewMode.DASHBOARD); // Switch back to dashboard on new search
      
      const data = await fetchGlobalIntelligence(currentPrefs, query, location);
      if (data && data.length > 0) {
        setReports(data);
        setLastUpdated(new Date());
      } else {
        setError("NO SIGNAL DETECTED. TRY ADJUSTING SEARCH PARAMETERS.");
      }
    } catch (err) {
      setError("SYSTEM FAILURE: INTELLIGENCE GATHERING ABORTED.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReportClick = (report: IntelligenceReport) => {
    setSelectedReport(report);
    setViewMode(ViewMode.REPORT_DETAIL);
  };

  const handleBackToDashboard = () => {
    setSelectedReport(null);
    setViewMode(ViewMode.DASHBOARD);
  };

  const filteredReports = activeFilter === 'ALL' 
    ? reports 
    : reports.filter(r => r.domain.toUpperCase() === activeFilter);

  const CHANNELS = ['ALL', 'GEOPOLITICS', 'ECONOMICS', 'FINANCIAL', 'ENERGY', 'CLIMATE', 'HEALTH', 'TECH'];

  // Auth Flow
  if (!isAuthenticated) {
    return <AuthScreen onLogin={handleLogin} />;
  }

  // Onboarding Flow
  if (!prefs) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center p-4 font-mono">
        <OnboardingModal onComplete={handleOnboardingComplete} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-slate-300 flex flex-col overflow-hidden font-sans selection:bg-blue-500/30">
      
      {/* 1. TOP HEADER */}
      <header className="h-20 border-b border-[#262626] bg-[#0a0a0a] flex items-center justify-between px-6 shrink-0 z-30 gap-6">
        
        {/* Left: Logo & Live Status */}
        <div className="flex items-center gap-6 shrink-0">
           <div 
             className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
             onClick={() => setViewMode(ViewMode.DASHBOARD)}
           >
             <img src="/logo.png" alt="PREDICTA" className="h-12 w-auto object-contain" />
           </div>
           
           <div className="hidden md:flex items-center gap-4 text-[10px] font-mono text-slate-500 border-l border-[#262626] pl-6">
              <span className="flex items-center gap-1 text-red-500 animate-pulse">
                <Radio className="w-3 h-3" /> LIVE BROADCAST
              </span>
              
                {/* Location Indicator - Updated with Text Name */}
                <div 
                  className="flex items-center gap-1 cursor-pointer hover:bg-white/5 px-2 py-1 rounded transition-colors group"
                  onClick={() => {
                    if (locationStatus === 'denied') {
                      alert("Please enable location permissions in your browser settings to access real-time local news.");
                    }
                    detectLocation();
                  }}
                  title={locationStatus === 'denied' ? "Click to retry location permission" : "Click to refresh location"}
                >
                   <MapPin className={`w-3 h-3 ${locationStatus === 'found' ? 'text-blue-500' : locationStatus === 'denied' ? 'text-red-500' : 'text-slate-600'}`} />
                   <span className={locationStatus === 'found' ? 'text-blue-400 font-bold' : locationStatus === 'denied' ? 'text-red-400' : 'text-slate-600'}>
                      {locationStatus === 'locating' ? 'CALIBRATING...' : 
                       locationStatus === 'found' && locationName ? locationName.toUpperCase() : 
                       locationStatus === 'denied' ? 'LOCATION DENIED' :
                       'GLOBAL MODE'}
                   </span>
                   <RefreshCw className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity ml-1 text-blue-500" />
                </div>

           </div>
        </div>

        {/* Center: Search Bar (Hidden in Simulator) */}
        <div className={`flex-1 max-w-xl transition-opacity duration-300 ${viewMode === ViewMode.SCENARIO_SIMULATION ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
           <form onSubmit={handleSearchSubmit} className="relative group">
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search topics, regions, or specific events..."
                className="w-full bg-[#080808] border border-[#222] text-slate-200 text-xs pl-10 pr-4 py-2.5 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all font-mono rounded-sm"
              />
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-600 group-focus-within:text-blue-500 transition-colors" />
              {searchQuery && (
                <button type="submit" className="absolute right-2 top-2 p-0.5 bg-blue-500/10 hover:bg-blue-500/20 text-blue-500 rounded">
                   <ArrowRight className="w-3 h-3" />
                </button>
              )}
           </form>
        </div>

        {/* Right: User & Actions */}
        <div className="flex items-center gap-6 shrink-0">
           <div className="flex items-center gap-3 pl-6">
             
             {/* Simulator Button */}
             <button 
               onClick={() => setViewMode(ViewMode.SCENARIO_SIMULATION)}
               className={`flex items-center gap-2 px-3 py-1.5 border rounded-sm text-[10px] font-mono transition-all ${
                 viewMode === ViewMode.SCENARIO_SIMULATION 
                 ? 'bg-purple-500/10 border-purple-500 text-purple-400' 
                 : 'border-[#333] hover:border-purple-500 text-slate-400 hover:text-purple-400'
               }`}
             >
               <BrainCircuit className="w-3 h-3" />
               SIMULATOR
             </button>

             <button 
               onClick={() => refreshIntelligence(prefs, '', userLocation)}
               className={`flex items-center gap-2 px-3 py-1.5 border border-[#333] hover:border-blue-500 rounded-sm text-[10px] font-mono transition-all ${isLoading ? 'text-blue-500' : 'text-slate-400'}`}
             >
               <RefreshCw className={`w-3 h-3 ${isLoading ? 'animate-spin' : ''}`} />
               {isLoading ? 'SYNCING...' : 'SYNC'}
             </button>
             
             <div className="group relative">
               <button className="w-8 h-8 bg-[#1a1a1a] rounded-full flex items-center justify-center text-xs font-bold text-slate-400 border border-[#333] hover:border-blue-500 transition-colors">
                 {prefs.name.charAt(0)}
               </button>
               {/* Logout Dropdown */}
               <div className="absolute right-0 mt-2 w-32 bg-[#0a0a0a] border border-[#222] shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <button 
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-3 text-[10px] font-mono text-red-400 hover:bg-red-500/10 flex items-center gap-2"
                  >
                    <LogOut className="w-3 h-3" /> LOGOUT
                  </button>
               </div>
             </div>

           </div>
        </div>
      </header>

      {/* 2. SIGNAL CHANNEL BAR (Only in Dashboard) */}
      {viewMode === ViewMode.DASHBOARD && (
        <div className="h-10 border-b border-[#262626] bg-[#080808] flex items-center px-6 overflow-x-auto no-scrollbar gap-1 animate-in slide-in-from-top-2">
           <span className="text-[10px] font-mono text-slate-600 mr-4 uppercase whitespace-nowrap">Signal Channels:</span>
           {CHANNELS.map(channel => (
             <button
               key={channel}
               onClick={() => { setActiveFilter(channel); setActiveSearch(''); }}
               className={`px-4 h-full text-[10px] font-bold tracking-widest uppercase transition-all border-b-2 whitespace-nowrap ${
                 activeFilter === channel 
                 ? 'text-blue-500 border-blue-500 bg-blue-500/5' 
                 : 'text-slate-500 border-transparent hover:text-slate-300 hover:bg-[#111]'
               }`}
             >
               {channel === 'GEOPOLITICS' && <Globe className="w-3 h-3 inline mr-1 mb-0.5" />}
               {channel === 'FINANCIAL' && <Zap className="w-3 h-3 inline mr-1 mb-0.5" />}
               {channel}
             </button>
           ))}
        </div>
      )}

      <div className="flex flex-1 overflow-hidden relative">
        
        {/* LEFT SIDEBAR - AGENT NODES (Hidden on mobile) */}
        <div className="hidden lg:block w-16 border-r border-[#262626] bg-[#050505] py-4 flex flex-col items-center gap-4 z-20">
           <div className="text-[10px] font-mono text-slate-600 mb-2 rotate-180" style={{writingMode: 'vertical-rl'}}>NODES</div>
           <div className="w-8 h-8 rounded bg-[#111] border border-[#333] flex items-center justify-center text-slate-500 hover:border-blue-500 hover:text-blue-500 transition-colors cursor-pointer">
             <Database className="w-4 h-4" />
           </div>
           <div className={`w-8 h-8 rounded border flex items-center justify-center transition-colors cursor-pointer ${
             viewMode === ViewMode.SCENARIO_SIMULATION ? 'bg-purple-900/20 border-purple-500 text-purple-400' : 'bg-[#111] border-[#333] text-slate-500 hover:border-purple-500 hover:text-purple-400'
           }`} onClick={() => setViewMode(ViewMode.SCENARIO_SIMULATION)}>
             <BrainCircuit className="w-4 h-4" />
           </div>
           <div className="w-8 h-8 rounded bg-[#111] border border-[#333] flex items-center justify-center text-slate-500 hover:border-blue-500 hover:text-blue-500 transition-colors cursor-pointer">
             <Shield className="w-4 h-4" />
           </div>
           <div className="mt-auto w-1 h-24 bg-[#111] rounded-full relative overflow-hidden">
              <div className="absolute bottom-0 w-full bg-blue-500 animate-pulse" style={{ height: '60%' }}></div>
           </div>
        </div>

        {/* MAIN CONTENT AREA */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 relative">
          
          {/* Background Grid */}
          <div className="absolute inset-0 pointer-events-none" 
               style={{ 
                 backgroundImage: 'linear-gradient(#111 1px, transparent 1px), linear-gradient(90deg, #111 1px, transparent 1px)', 
                 backgroundSize: '40px 40px',
                 opacity: 0.5 
               }}>
          </div>

          <div className="relative z-10 max-w-7xl mx-auto h-full">
            {error && (
              <div className="mb-6 p-4 bg-red-900/20 border border-red-500/50 flex items-center gap-3 text-red-400 font-mono text-sm">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <p>{error}</p>
              </div>
            )}

            {viewMode === ViewMode.DASHBOARD && (
              <div className="space-y-6 animate-in fade-in duration-500">
                
                {/* Dashboard Header */}
                <div className="flex items-end justify-between border-b border-[#262626] pb-4 mb-8">
                  <div>
                    <h2 className="text-sm font-mono text-blue-500 mb-1 flex items-center gap-2">
                       :: {activeSearch ? `SEARCH PROTOCOL: "${activeSearch.toUpperCase()}"` : 'LIVE FEED INITIATED'}
                       {locationStatus === 'found' && !activeSearch && <span className="bg-blue-500/20 text-blue-400 px-1 rounded text-[10px]">{locationName ? locationName.toUpperCase() : 'LOCALIZED'}</span>}
                    </h2>
                    <h1 className="text-3xl font-header font-medium text-white">
                      {activeSearch ? 'TARGETED INTELLIGENCE' : 'ACTIVE INTELLIGENCE STREAMS'}
                    </h1>
                  </div>
                  <div className="hidden md:block text-right">
                    <div className="text-[10px] font-mono text-slate-500">ACTIVE REGIONS</div>
                    <div className="text-xl font-header text-slate-200">
                      {locationStatus === 'found' ? 'LOCAL + GLOBAL' : prefs.regions.length + ' MONITORING'}
                    </div>
                  </div>
                </div>

                {/* News Grid / List */}
                {reports.length === 0 && !isLoading ? (
                  <div className="h-64 border border-dashed border-[#333] rounded flex flex-col items-center justify-center text-slate-500">
                    <p className="font-mono text-sm mb-4">NO ACTIVE SIGNALS IN BUFFER</p>
                    <button 
                      onClick={() => refreshIntelligence(prefs, '', userLocation)}
                      className="px-6 py-2 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/50 text-blue-500 font-mono text-xs uppercase tracking-widest"
                    >
                      Initialize Scan
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-4">
                    {filteredReports.map((report, idx) => (
                      <NewsCard 
                        key={report.id || idx} 
                        report={report} 
                        onClick={handleReportClick} 
                      />
                    ))}
                    
                    {isLoading && reports.length > 0 && (
                       <div className="absolute inset-0 bg-black/80 z-20 flex flex-col items-center justify-center">
                          <div className="font-mono text-blue-500 animate-pulse text-lg">UPDATING NEURAL NETWORK...</div>
                       </div>
                    )}
                  </div>
                )}
                
                {isLoading && reports.length === 0 && (
                  <div className="grid grid-cols-1 gap-4">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="h-40 bg-[#0a0a0a] border border-[#222] animate-pulse"></div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {viewMode === ViewMode.REPORT_DETAIL && selectedReport && (
              <ReportDetail report={selectedReport} onBack={handleBackToDashboard} />
            )}

            {viewMode === ViewMode.SCENARIO_SIMULATION && (
               <ScenarioSimulator prefs={prefs} onBack={handleBackToDashboard} />
            )}
          </div>
        </main>
      </div>

      {/* 3. BOTTOM TICKER (Hidden in Simulator to focus attention) */}
      {viewMode !== ViewMode.SCENARIO_SIMULATION && (
        <div className="h-8 bg-red-900/10 border-t border-red-900/30 flex items-center overflow-hidden relative">
           <div className="absolute left-0 top-0 bottom-0 w-24 bg-[#050505] z-10 flex items-center justify-center border-r border-red-900/30">
              <span className="flex items-center gap-2 text-[10px] font-bold text-red-500 uppercase tracking-widest">
                <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span> Live
              </span>
           </div>
           <div className="whitespace-nowrap animate-ticker flex items-center gap-12 pl-24 text-[10px] font-mono text-red-400/80">
                {reports.map((r, i) => (
                  <span key={i} className="uppercase">
                    <span className="text-red-500 font-bold mr-2">{">>>"}</span>
                    {r.headline} <span className="text-slate-600 mx-2">|</span> {r.domain}
                  </span>
                ))}
                 <span className="uppercase">
                    <span className="text-red-500 font-bold mr-2">{">>>"}</span>
                    SYSTEM STABILITY: 98.4% <span className="text-slate-600 mx-2">|</span> NEURAL CONSENSUS REACHED
                  </span>
           </div>
        </div>
      )}

    </div>
  );
};
export default App;