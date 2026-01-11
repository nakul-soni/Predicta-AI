import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPEN_API_KEY || process.env.OPENAI_API_KEY,
});

const FINNHUB_API_KEY = process.env.FINNHUB_API_KEY;
const NEWS_API_KEY = process.env.NEWS_API_KEY;

async function getMarketSnapshot() {
  const symbols = ["SPY", "QQQ", "VIX", "GLD", "USO"];
  try {
    const data = await Promise.all(
      symbols.map(async (s) => {
        const res = await fetch(`https://finnhub.io/api/v1/quote?symbol=${s}&token=${FINNHUB_API_KEY}`);
        if (!res.ok) return null;
        const json = await res.json();
        return { symbol: s, price: json.c, change: json.dp };
      })
    );
    return data.filter(d => d !== null);
  } catch (e) {
    return [];
  }
}

async function getNews() {
  const queries = ["geopolitics", "inflation", "climate change", "cyber security", "political stability", "global trade"];
  try {
    const results = await Promise.all(
      queries.map(async (q) => {
        const res = await fetch(
          `https://newsapi.org/v2/everything?q=${encodeURIComponent(q)}&language=en&pageSize=10&sortBy=publishedAt&apiKey=${NEWS_API_KEY}`
        );
        if (!res.ok) return [];
        const data = await res.json();
        return (data.articles || []).map((a: any) => ({
          title: a.title,
          description: a.description,
          url: a.url,
          source: a.source?.name,
          category: q
        }));
      })
    );
    return results.flat();
  } catch (e) {
    return [];
  }
}

function getMockRiskData(newsArticles: any[], marketData: any[]) {
  const newsCount = newsArticles.length;
  const marketCount = marketData.length;
  
  // Use news headlines to make the mock data feel "real"
  const topHeadlines = newsArticles.slice(0, 5).map(a => a.title);
  
  return {
    "categories": [
      { "name": "Geopolitical", "probability": 72, "impact": 88, "explanation": `Recent reports on "${topHeadlines[0] || 'Global Tensions'}" indicate heightened cross-border friction.` },
      { "name": "Economic", "probability": 48, "impact": 76, "explanation": `Market data shows ${marketData.find(m => m.symbol === 'VIX')?.price || 'volatile'} VIX levels, suggesting investor uncertainty.` },
      { "name": "Climate", "probability": 85, "impact": 92, "explanation": `Extreme weather events mentioned in ${newsArticles.filter(a => a.category === 'climate change').length} recent reports drive climate risk.` },
      { "name": "Political", "probability": 58, "impact": 64, "explanation": "Institutional stability is under pressure from shifting voter sentiments globally." }
    ],
    "scenarios": {
      "best_case": { "title": "Stabilized Growth", "description": "De-escalation of regional conflicts and stabilizing energy prices lead to a 3% global growth rebound.", "risk_level": "Low" },
      "worst_case": { "title": "Systemic Cascade", "description": "Simultaneous supply chain shocks and cyber warfare lead to a multi-quarter global recession.", "risk_level": "Extreme" },
      "most_likely": { "title": "Volatile Equilibrium", "description": "Markets remain sensitive to data prints; slow growth persists with localized disruptions.", "risk_level": "Moderate" }
    },
    "matrix": [
      { "event": "Trade Disruption", "probability": 45, "impact": 75, "category": "Economic" },
      { "event": "Resource Scarcity", "probability": 30, "impact": 90, "category": "Climate" },
      { "event": "Cyber Breach", "probability": 80, "impact": 85, "category": "Geopolitical" },
      { "event": "Policy Pivot", "probability": 55, "impact": 60, "category": "Political" }
    ],
    "correlations": [
      { "source": "Energy Crisis", "target": "Inflation", "strength": 0.95, "description": "Energy costs drive systemic price increases." },
      { "source": "Geopolitics", "target": "Market VIX", "strength": 0.88, "description": "Uncertainty spikes volatility index." }
    ],
    "sources": newsArticles.slice(0, 5),
    "is_simulated": true
  };
}

export async function GET() {
  const [marketData, newsArticles] = await Promise.all([
    getMarketSnapshot(),
    getNews()
  ]);

  const newsText = newsArticles
    .map((a: any) => `${a.title}: ${a.description}`)
    .slice(0, 25)
    .join('\n\n');

  const marketText = marketData
    .map(m => `${m.symbol}: Price ${m.price}, Change ${m.change}%`)
    .join(', ');

  try {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error("Missing OpenAI API Key");
    }

    const prompt = `
      As a Global Risk Analyst, analyze the current world state based on these real-time data inputs:

      MARKET INDICATORS:
      ${marketText || "Limited market data available."}

      RECENT GLOBAL NEWS:
      ${newsText || "No recent news data available."}

      TASK:
      1. Assess Risk Categories: "Geopolitical", "Economic", "Climate", "Political" with probability (0-100) and impact (0-100) scores.
      2. Construct 3 Scenarios: "best_case", "worst_case", "most_likely" based on current trends.
      3. Risk Matrix: List 8-10 specific risk events based on the news provided.
      4. Correlation Network: Define 4-5 causal links between events.
      5. AI Explanations: Provide a 2-sentence explanation for EACH main risk category, referencing specific news or market data points.
      6. Sources: Include a list of the 5 most relevant news titles and URLs used in the analysis.

      Return ONLY a JSON object with this exact structure:
      {
        "categories": [{"name": string, "probability": number, "impact": number, "explanation": string}],
        "scenarios": {
          "best_case": {"title": string, "description": string, "risk_level": "Low"|"Moderate"|"High"|"Extreme"},
          ...
        },
        "matrix": [{"event": string, "probability": number, "impact": number, "category": string}],
        "correlations": [{"source": string, "target": string, "strength": number, "description": string}],
        "sources": [{"title": string, "url": string}]
      }
    `;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "system", content: "You are an expert geopolitical and economic risk analyst." }, { role: "user", content: prompt }],
      response_format: { type: "json_object" },
    });

    const riskData = JSON.parse(completion.choices[0].message.content || '{}');
    return NextResponse.json({ ...riskData, is_simulated: false });
  } catch (error: any) {
    console.warn('Analysis using simulation engine:', error.message);
    return NextResponse.json(getMockRiskData(newsArticles, marketData));
  }
}
