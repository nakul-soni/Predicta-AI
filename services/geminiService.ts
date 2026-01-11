import { GoogleGenAI, Type } from "@google/genai";
import { IntelligenceReport, UserPreferences, LocationCoordinates } from "../types";

// Initialize Gemini Client Lazily
let genAI: GoogleGenAI | null = null;
const getAI = (): GoogleGenAI => {
    const key = import.meta.env.VITE_GEMINI_API_KEY;
    if (!key) throw new Error("VITE_GEMINI_API_KEY is missing");
    if (!genAI) {
        genAI = new GoogleGenAI({ apiKey: key });
    }
    return genAI;
};

// Model for all operations - gemini-3-flash-preview for speed and reasoning
const MODEL_NAME = 'gemini-3-flash-preview';

const REPORT_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    id: { type: Type.STRING },
    headline: { type: Type.STRING },
    summary: { type: Type.STRING },
    domain: { type: Type.STRING, enum: ['Geopolitics', 'Economics', 'Technology', 'Climate', 'Social', 'Health', 'Simulation'] },
    region: { type: Type.STRING },
    detected_risks: { type: Type.ARRAY, items: { type: Type.STRING } },
    
    sources: {
      type: Type.ARRAY,
      description: "List of real-world URLs used to verify this report (if applicable)",
      items: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          url: { type: Type.STRING }
        }
      }
    },

    risk_analysis: {
      type: Type.ARRAY,
      description: "Deep dive risk analysis from Agent 4",
      items: {
        type: Type.OBJECT,
        properties: {
            risk_name: { type: Type.STRING },
            category: { type: Type.STRING, enum: ['Supply Chain', 'Regulatory', 'Market', 'Physical', 'Reputational'] },
            probability: { type: Type.NUMBER, description: "0-100" },
            severity: { type: Type.NUMBER, description: "0-100" },
            velocity: { type: Type.STRING, enum: ['Slow', 'Moderate', 'High', 'Instant'] },
            implication: { type: Type.STRING, description: "One sentence on the specific consequence." }
        }
      }
    },

    strategic_advisory: {
      type: Type.ARRAY,
      description: "Tactical advice from Agent 7",
      items: {
        type: Type.OBJECT,
        properties: {
            type: { type: Type.STRING, enum: ['Defensive', 'Offensive', 'Watchlist'] },
            action: { type: Type.STRING, description: "The specific action to take" },
            rationale: { type: Type.STRING, description: "Why this action is recommended" }
        }
      }
    },

    scenarios: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          description: { type: Type.STRING },
          probability: { type: Type.NUMBER },
          timeframe: { type: Type.STRING },
          impact_level: { type: Type.STRING, enum: ['low', 'medium', 'high', 'critical'] },
        },
      },
    },
    predicted_timeline: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          timeframe: { type: Type.STRING },
          event_description: { type: Type.STRING },
          likelihood: { type: Type.NUMBER },
          type: { type: Type.STRING, enum: ['political', 'economic', 'social', 'technological'] },
        },
      },
    },
    financial_impact: {
      type: Type.OBJECT,
      properties: {
        sectors_affected: { type: Type.ARRAY, items: { type: Type.STRING } },
        sentiment: { type: Type.STRING, enum: ['defensive', 'neutral', 'growth'] },
        summary: { type: Type.STRING },
      },
    },
    confidence_score: { type: Type.NUMBER },
    timestamp: { type: Type.STRING },
  },
  required: ['id', 'headline', 'summary', 'domain', 'region', 'detected_risks', 'risk_analysis', 'strategic_advisory', 'scenarios', 'predicted_timeline', 'financial_impact', 'confidence_score', 'timestamp'],
};

/**
 * Identifies the city and country from coordinates using Nominatim (OSM) - free and saves Gemini quota.
 */
export const identifyLocation = async (lat: number, lng: number): Promise<string> => {
  try {
    const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=10&addressdetails=1`, {
      headers: { 'Accept-Language': 'en' }
    });
    const data = await response.json();
    if (data.address) {
      const city = data.address.city || data.address.town || data.address.village || data.address.suburb || "Unknown City";
      const country = data.address.country || "";
      return country ? `${city}, ${country}` : city;
    }
    return `${lat.toFixed(2)}, ${lng.toFixed(2)}`;
  } catch (error) {
    console.error("Location Identification Error:", error);
    return `${lat.toFixed(2)}, ${lng.toFixed(2)}`;
  }
};

/**
 * Simulates a hypothetical scenario using Gemini with thinking/reasoning.
 */
export const runScenarioSimulation = async (
  prefs: UserPreferences,
  scenarioInput: string,
  isDeepResearch: boolean = false
): Promise<IntelligenceReport | null> => {
  if (!import.meta.env.VITE_GEMINI_API_KEY) return null;

  let promptModifiers = "";

  if (isDeepResearch) {
    promptModifiers = `
      **DEEP RESEARCH PROTOCOL ACTIVATED**
      1. Conduct an EXHAUSTIVE analysis. 
      2. Provide a longer, highly detailed 'summary' that compares this event to historical precedents.
      3. In 'risk_analysis', identify at least 6-8 distinct complex risks, focusing on second-order and third-order effects.
      4. In 'financial_impact', analyze specific commodities (Gold, Oil, Semiconductors) and currency impacts.
      5. Do not summarize briefly; elaborate on the "Why" and "How".
    `;
  } else {
    promptModifiers = "Provide a concise but comprehensive overview. Focus on clarity and immediate impacts.";
  }

  const systemPrompt = `
    You are AGENT 4 (RISK & SCENARIO ENGINE) and AGENT 5 (PREDICTION CORE).
    
    ### TASK
    Run a full HYPOTHETICAL SIMULATION based on this user prompt: "${scenarioInput}".
    ${promptModifiers}
    
    Assume this event JUST started or is imminent. 
    Analyze the ripple effects across the globe, specifically for:
    - Supply Chains
    - Financial Markets
    - Geopolitical Stability
    
    ### RULES
    1. This is a SIMULATION. Mark domain as 'Simulation'.
    2. Be realistic but imaginative. Trace 2nd and 3rd order consequences.
    3. Calculate probabilities based on historical precedents.
    4. Provide specific actionable advice for an investor or strategist.
    5. Use clear, professional, but accessible language. Avoid overly academic jargon.
    
    Output strictly in JSON format matching the schema.
  `;

  try {
      const ai = getAI();
      const response = await ai.models.generateContent({
        model: MODEL_NAME,
        contents: `Simulate scenario: ${scenarioInput}`,
        config: {
          systemInstruction: systemPrompt,
          responseMimeType: "application/json",
          responseSchema: REPORT_SCHEMA,
          thinkingConfig: { thinkingBudget: 2048 }
        }
      });

    const text = response.text;
    if (text) {
        const data = JSON.parse(text) as IntelligenceReport;
        data.is_deep_research = isDeepResearch;
        return data;
    }
    return null;
  } catch (error) {
    console.error("Simulation Error:", error);
    return null;
  }
};

/**
 * Fetches real-time intelligence using Gemini with Google Search grounding.
 */
export const fetchGlobalIntelligence = async (
  prefs: UserPreferences, 
  searchQuery?: string,
  location?: LocationCoordinates | null
): Promise<IntelligenceReport[]> => {
  if (!import.meta.env.VITE_GEMINI_API_KEY) {
    console.error("API Key is missing");
    return [];
  }

  let taskInstruction = "";
  
  if (searchQuery) {
    taskInstruction = `
      PRIORITY OVERRIDE: User is explicitly searching for: "${searchQuery}".
      IGNORE general user interests.
      FIND real-time news, risks, and future scenarios specifically related to "${searchQuery}".
    `;
  } else if (location) {
    taskInstruction = `
      USER LOCATION DETECTED: Latitude ${location.lat}, Longitude ${location.lng}.
      
      CRITICAL TASK: 
      1. Generate a mixed intelligence feed:
         - 50% of reports MUST be specific to the region at these coordinates.
         - 50% of reports should cover global high-impact events matching user interests: ${prefs.interests.join(', ')}.
    `;
  } else {
    taskInstruction = `
      User Interests: ${prefs.interests.join(', ')}.
      User Priority Regions: ${prefs.regions.join(', ')}.
      
      TASK: Search the web for REAL-TIME news that matches these interests. Find actual breaking news from the last 24-48 hours.
    `;
  }

  const systemPrompt = `
    You are PREDICTA-CORE, an autonomous multi-agent intelligence system.
    
    ### MISSION
    Use the Google Search tool to identify REAL, VERIFIED events happening NOW. 
    
    ### CONTEXT & TASK
    ${taskInstruction}
    
    ### AGENT ROLES:
    1. Agent 1 (Search): Use Google Search to find current events.
    2. Agent 4 (Risk): Analyze news for second-order consequences.
    3. Agent 5 (Prediction): Extrapolate a timeline.
    4. Agent 7 (Strategy): Generate TACTICAL ADVICE. 
    
    Output MUST be a JSON array of IntelligenceReport objects.
  `;

  try {
    const ai = getAI();
    const result = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: "Execute Global Intelligence Scan.",
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: REPORT_SCHEMA
        },
          // tools: [{ googleSearch: {} }]  // Disabled - requires paid plan
      }
    });

    const text = result.text;
    if (text) {
        return JSON.parse(text) as IntelligenceReport[];
    }
    return [];

  } catch (error: any) {
    console.error("Gemini Generation Error:", error);
    
    if (error?.message?.includes('429') || error?.status === 'RESOURCE_EXHAUSTED' || error?.status === 429) {
      return [{
        id: 'error-quota',
        headline: 'NEURAL LINK SATURATED: QUOTA LIMIT REACHED',
        summary: 'Your Gemini API key has exceeded its free allowance or billing limit for Grounding with Google Search. Real-time intelligence gathering is temporarily suspended.',
        domain: 'Simulation',
        region: 'Global Network',
        detected_risks: ['Data Stream Interrupted'],
        sources: [{ title: 'Gemini Quota Info', url: 'https://aistudio.google.com/app/plan' }],
        risk_analysis: [{
          risk_name: 'Intelligence Blackout',
          category: 'Regulatory',
          probability: 100,
          severity: 90,
          velocity: 'Instant',
          implication: 'Real-time decision making is compromised.'
        }],
        strategic_advisory: [{
          type: 'Defensive',
          action: 'UPGRADE API PLAN',
          rationale: 'Required for high-fidelity real-time streams.'
        }],
        scenarios: [],
        predicted_timeline: [],
        financial_impact: {
          sectors_affected: ['Technology'],
          sentiment: 'defensive',
          summary: 'Market data is static.'
        },
        confidence_score: 0,
        timestamp: new Date().toISOString()
      }];
    }
    return []; 
  }
};
