import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const FINNHUB_API_KEY = process.env.FINNHUB_API_KEY;
const NEWS_API_KEY = process.env.NEWS_API_KEY;

type Variable = 'oil' | 'inflation' | 'volatility' | 'gold' | 'interest_rates' | 'sp500';

const VARIABLE_CONFIG: Record<Variable, { symbol: string; name: string; unit: string; newsQuery: string }> = {
  oil: { symbol: 'USO', name: 'Oil Price (WTI)', unit: '$/barrel', newsQuery: 'oil price OPEC energy' },
  inflation: { symbol: 'TIP', name: 'Inflation (CPI Proxy)', unit: '%', newsQuery: 'inflation CPI federal reserve' },
  volatility: { symbol: 'VIX', name: 'Market Volatility (VIX)', unit: 'index', newsQuery: 'market volatility stock fear' },
  gold: { symbol: 'GLD', name: 'Gold Price', unit: '$/oz', newsQuery: 'gold price safe haven' },
  interest_rates: { symbol: 'TLT', name: 'Interest Rates (Bond Proxy)', unit: '%', newsQuery: 'federal reserve interest rates bonds' },
  sp500: { symbol: 'SPY', name: 'S&P 500 Index', unit: 'points', newsQuery: 'stock market S&P 500 economy' },
};

async function getHistoricalData(symbol: string) {
  try {
    const to = Math.floor(Date.now() / 1000);
    const from = to - 90 * 24 * 60 * 60;
    const res = await fetch(
      `https://finnhub.io/api/v1/stock/candle?symbol=${symbol}&resolution=D&from=${from}&to=${to}&token=${FINNHUB_API_KEY}`
    );
    if (!res.ok) return null;
    const data = await res.json();
    if (data.s !== 'ok') return null;
    return {
      timestamps: data.t,
      closes: data.c,
      highs: data.h,
      lows: data.l,
    };
  } catch {
    return null;
  }
}

async function getCurrentQuote(symbol: string) {
  try {
    const res = await fetch(`https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${FINNHUB_API_KEY}`);
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

async function getRelevantNews(query: string) {
  try {
    const res = await fetch(
      `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&language=en&pageSize=10&sortBy=publishedAt&apiKey=${NEWS_API_KEY}`
    );
    if (!res.ok) return [];
    const data = await res.json();
    return (data.articles || []).map((a: any) => ({
      title: a.title,
      description: a.description,
      url: a.url,
      source: a.source?.name,
      publishedAt: a.publishedAt,
    }));
  } catch {
    return [];
  }
}

function generateMockForecast(historicalData: any, days: number = 30) {
  const lastPrice = historicalData?.closes?.[historicalData.closes.length - 1] || 100;
  const volatility = 0.02;
  const forecast = [];
  const now = Date.now();
  
  let price = lastPrice;
  for (let i = 1; i <= days; i++) {
    const change = (Math.random() - 0.48) * volatility * price;
    price = price + change;
    const confidence = Math.max(0.6, 0.95 - (i * 0.01));
    const spread = price * (1 - confidence) * 0.5;
    forecast.push({
      date: new Date(now + i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      predicted: parseFloat(price.toFixed(2)),
      upper: parseFloat((price + spread).toFixed(2)),
      lower: parseFloat((price - spread).toFixed(2)),
      confidence: parseFloat((confidence * 100).toFixed(1)),
    });
  }
  return forecast;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const variable = (searchParams.get('variable') || 'oil') as Variable;
  const config = VARIABLE_CONFIG[variable] || VARIABLE_CONFIG.oil;

  const [historicalData, currentQuote, news] = await Promise.all([
    getHistoricalData(config.symbol),
    getCurrentQuote(config.symbol),
    getRelevantNews(config.newsQuery),
  ]);

  const historical = historicalData
    ? historicalData.timestamps.map((t: number, i: number) => ({
        date: new Date(t * 1000).toISOString().split('T')[0],
        value: historicalData.closes[i],
        high: historicalData.highs[i],
        low: historicalData.lows[i],
      }))
    : [];

  const forecast = generateMockForecast(historicalData);

  const newsText = news
    .slice(0, 8)
    .map((n: any) => `${n.title}: ${n.description}`)
    .join('\n\n');

  const recentTrend = historical.length > 5
    ? ((historical[historical.length - 1].value - historical[historical.length - 5].value) / historical[historical.length - 5].value * 100).toFixed(2)
    : '0';

  try {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('Missing OpenAI API Key');
    }

    const prompt = `
      As a quantitative analyst, provide a prediction analysis for ${config.name}.

      CURRENT DATA:
      - Current Price: ${currentQuote?.c || 'N/A'}
      - Daily Change: ${currentQuote?.dp?.toFixed(2) || 'N/A'}%
      - 5-Day Trend: ${recentTrend}%
      - 52-Week High: ${currentQuote?.h || 'N/A'}
      - 52-Week Low: ${currentQuote?.l || 'N/A'}

      RECENT NEWS CONTEXT:
      ${newsText || 'No recent news available.'}

      TASK:
      1. Provide a probability percentage (0-100) for the price/value going UP in the next 30 days.
      2. Identify the primary driver (1 sentence) based on the news.
      3. Provide a detailed AI explanation (3-4 sentences) of your prediction rationale.
      4. List 3 key factors influencing this prediction.
      5. Provide a confidence level for your prediction (Low/Medium/High).

      Return ONLY a JSON object:
      {
        "probability_up": number,
        "probability_down": number,
        "primary_driver": string,
        "explanation": string,
        "key_factors": [string, string, string],
        "confidence": "Low" | "Medium" | "High",
        "sentiment": "Bullish" | "Bearish" | "Neutral",
        "target_30d": number,
        "target_90d": number
      }
    `;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: 'You are an expert quantitative analyst specializing in market predictions.' },
        { role: 'user', content: prompt },
      ],
      response_format: { type: 'json_object' },
    });

    const aiAnalysis = JSON.parse(completion.choices[0].message.content || '{}');

    return NextResponse.json({
      variable,
      name: config.name,
      unit: config.unit,
      current: {
        price: currentQuote?.c,
        change: currentQuote?.d,
        changePercent: currentQuote?.dp,
        high: currentQuote?.h,
        low: currentQuote?.l,
      },
      historical,
      forecast,
      analysis: aiAnalysis,
      sources: news.slice(0, 5),
      is_simulated: false,
    });
  } catch (error: any) {
    console.warn('Using simulation mode:', error.message);
    
    const mockAnalysis = {
      probability_up: 58,
      probability_down: 42,
      primary_driver: `Recent market dynamics and ${news.length} news articles suggest moderate uncertainty in ${config.name}.`,
      explanation: `Based on historical patterns and current market conditions, ${config.name} shows a slight bullish tendency. The recent ${recentTrend}% movement over 5 days indicates underlying momentum. However, global macroeconomic factors continue to introduce volatility into the forecast.`,
      key_factors: [
        'Federal Reserve monetary policy stance',
        'Global supply chain dynamics',
        'Geopolitical tensions affecting commodity flows',
      ],
      confidence: 'Medium',
      sentiment: parseFloat(recentTrend) > 0 ? 'Bullish' : parseFloat(recentTrend) < 0 ? 'Bearish' : 'Neutral',
      target_30d: currentQuote?.c ? (currentQuote.c * 1.03).toFixed(2) : null,
      target_90d: currentQuote?.c ? (currentQuote.c * 1.08).toFixed(2) : null,
    };

    return NextResponse.json({
      variable,
      name: config.name,
      unit: config.unit,
      current: {
        price: currentQuote?.c,
        change: currentQuote?.d,
        changePercent: currentQuote?.dp,
        high: currentQuote?.h,
        low: currentQuote?.l,
      },
      historical,
      forecast,
      analysis: mockAnalysis,
      sources: news.slice(0, 5),
      is_simulated: true,
    });
  }
}
