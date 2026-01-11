
export interface UserPreferences {
  name: string;
  interests: string[];
  regions: string[];
  riskTolerance: 'low' | 'medium' | 'high';
  onboarded: boolean;
}

export interface LocationCoordinates {
  lat: number;
  lng: number;
}

export interface Scenario {
  title: string;
  description: string;
  probability: number; // 0-100
  timeframe: string;
  impact_level: 'low' | 'medium' | 'high' | 'critical';
}

export interface PredictedEvent {
  timeframe: string;
  event_description: string;
  likelihood: number;
  type: 'political' | 'economic' | 'social' | 'technological';
}

export interface DetailedRisk {
  risk_name: string;
  category: 'Supply Chain' | 'Regulatory' | 'Market' | 'Physical' | 'Reputational';
  probability: number; // 0-100
  severity: number; // 0-100
  velocity: 'Slow' | 'Moderate' | 'High' | 'Instant'; // How fast it hits
  implication: string;
}

export interface StrategicAdvice {
  type: 'Defensive' | 'Offensive' | 'Watchlist';
  action: string;
  rationale: string;
}

export interface Source {
  title: string;
  url: string;
}

export interface IntelligenceReport {
  id: string;
  headline: string;
  summary: string;
  domain: 'Geopolitics' | 'Economics' | 'Technology' | 'Climate' | 'Social' | 'Health' | 'Simulation';
  region: string;
  // Replaced simple strings with detailed objects
  risk_analysis: DetailedRisk[];
  strategic_advisory: StrategicAdvice[];
  
  scenarios: Scenario[];
  predicted_timeline: PredictedEvent[];
  financial_impact: {
    sectors_affected: string[];
    sentiment: 'defensive' | 'neutral' | 'growth';
    summary: string;
  };
  sources: Source[]; // New field for real-world citations
  confidence_score: number;
  timestamp: string;
  // Keep backward compatibility for list view (optional, or map from risk_analysis)
  detected_risks: string[]; 
  is_deep_research?: boolean; // New flag for UI indication
}

export interface AgentStatus {
  id: number;
  name: string;
  role: string;
  status: 'idle' | 'working' | 'standby';
  currentTask?: string;
}

export enum ViewMode {
  DASHBOARD = 'DASHBOARD',
  REPORT_DETAIL = 'REPORT_DETAIL',
  SETTINGS = 'SETTINGS',
  SCENARIO_SIMULATION = 'SCENARIO_SIMULATION'
}
