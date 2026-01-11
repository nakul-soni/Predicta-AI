import { NextRequest, NextResponse } from "next/server";

const FINNHUB_API_KEY = process.env.FINNHUB_API_KEY;
const BASE_URL = "https://finnhub.io/api/v1";

const STOCKS = ["AAPL", "MSFT", "TSLA", "NVDA", "AMZN", "META", "BRK.B", "V", "JPM", "UNH"];
const INDICES = ["SPY", "QQQ", "DIA", "IWM", "VTI"];
const FOREX = ["FX:EURUSD", "FX:GBPUSD", "FX:USDJPY", "FX:USDCHF", "FX:AUDUSD"];
const COMMODITIES = ["OANDA:XAU_USD", "OANDA:XAG_USD", "OANDA:BCO_USD", "OANDA:WTICO_USD", "OANDA:NGAS_USD"];

async function getQuote(symbol: string) {
  const res = await fetch(`${BASE_URL}/quote?symbol=${symbol}&token=${FINNHUB_API_KEY}`, {
    next: { revalidate: 60 } // Cache for 60 seconds
  });
  if (!res.ok) return null;
  return res.json();
}

async function getCandles(symbol: string, resolution: string = "D") {
  const to = Math.floor(Date.now() / 1000);
  const from = to - 30 * 24 * 60 * 60; // Last 30 days
  const res = await fetch(`${BASE_URL}/stock/candle?symbol=${symbol}&resolution=${resolution}&from=${from}&to=${to}&token=${FINNHUB_API_KEY}`, {
    next: { revalidate: 3600 } // Cache for 1 hour
  });
  if (!res.ok) return null;
  return res.json();
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type");
  const symbol = searchParams.get("symbol");

  try {
    if (type === "summary") {
      const symbols = [...STOCKS, ...INDICES, ...FOREX, ...COMMODITIES];
      const data = await Promise.all(
        symbols.map(async (s) => {
          const quote = await getQuote(s);
          return { symbol: s, ...quote };
        })
      );
      
      return NextResponse.json({
        stocks: data.filter(d => STOCKS.includes(d.symbol)),
        indices: data.filter(d => INDICES.includes(d.symbol)),
        forex: data.filter(d => FOREX.includes(d.symbol)),
        commodities: data.filter(d => COMMODITIES.includes(d.symbol))
      });
    }

    if (type === "detail" && symbol) {
      const quote = await getQuote(symbol);
      const candles = await getCandles(symbol);
      
      // Also get basic financial info if available
      const profileRes = await fetch(`${BASE_URL}/stock/profile2?symbol=${symbol}&token=${FINNHUB_API_KEY}`);
      const profile = profileRes.ok ? await profileRes.json() : {};

      return NextResponse.json({
        quote,
        candles,
        profile
      });
    }

    return NextResponse.json({ error: "Invalid request parameters" }, { status: 400 });
  } catch (error) {
    console.error("Market API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
