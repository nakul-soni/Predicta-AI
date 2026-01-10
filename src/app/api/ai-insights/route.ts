import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function GET() {
  try {
    const newsRes = await fetch(
      `https://newsapi.org/v2/top-headlines?language=en&pageSize=20&apiKey=${process.env.NEWS_API_KEY}`
    );
    
    let newsText = "";
    if (newsRes.ok) {
      const newsData = await newsRes.json();
      if (newsData.articles && newsData.articles.length > 0) {
        newsText = newsData.articles
          .map((a: any) => `${a.title}: ${a.description}`)
          .join('\n\n');
      }
    }

    if (!newsText) {
      console.warn("No news found or NewsAPI failed, using full mock data");
      return NextResponse.json(getMockInsights());
    }

    const prompt = `
      Analyze the following news headlines and descriptions from today:
      
      ${newsText}
      
      Based on this data, provide:
      1. Topic Detection: Percentage distribution among "Conflict", "Economy", "Politics", and "Climate".
      2. Sentiment Analysis: Overall sentiment score (0 to 100, where 0 is very negative and 100 is very positive) and a breakdown of "Positive", "Neutral", "Negative" in percentages.
      3. Key Entity Extraction: List top 3 countries, top 3 companies, and top 3 leaders mentioned or relevant.
      4. Timeline Sentiment Shift: Generate 5 data points (time, sentiment_score) that simulate a sentiment shift over the last 24 hours based on these current events.
      
      Return the response in strict JSON format like this:
      {
        "topics": [
          { "name": "Conflict", "value": number },
          { "name": "Economy", "value": number },
          { "name": "Politics", "value": number },
          { "name": "Climate", "value": number }
        ],
        "sentiment": {
          "score": number,
          "breakdown": { "positive": number, "neutral": number, "negative": number }
        },
        "entities": {
          "countries": [string, string, string],
          "companies": [string, string, string],
          "leaders": [string, string, string]
        },
        "timeline": [
          { "time": "00:00", "score": number },
          { "time": "06:00", "score": number },
          { "time": "12:00", "score": number },
          { "time": "18:00", "score": number },
          { "time": "24:00", "score": number }
        ]
      }
    `;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
    }).catch(err => {
      console.warn('OpenAI failed, using mock fallback:', err.message);
      return {
        choices: [{
          message: {
            content: JSON.stringify({
              topics: [
                { name: "Conflict", value: 25 },
                { name: "Economy", value: 35 },
                { name: "Politics", value: 30 },
                { name: "Climate", value: 10 }
              ],
              sentiment: {
                score: 62,
                breakdown: { positive: 45, neutral: 35, negative: 20 }
              },
              entities: {
                countries: ["United States", "China", "Ukraine"],
                companies: ["NVIDIA", "Apple", "Tesla"],
                leaders: ["Joe Biden", "Xi Jinping", "Elon Musk"]
              },
              timeline: [
                { time: "00:00", score: 58 },
                { time: "06:00", score: 62 },
                { time: "12:00", score: 55 },
                { time: "18:00", score: 68 },
                { time: "24:00", score: 65 }
              ]
            })
          }
        }]
      } as any;
    });

    const insights = JSON.parse(completion.choices[0].message.content || '{}');

    return NextResponse.json(insights);
  } catch (error: any) {
    console.error('AI Insights Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

function getMockInsights() {
  return {
    topics: [
      { name: "Conflict", value: 25 },
      { name: "Economy", value: 35 },
      { name: "Politics", value: 30 },
      { name: "Climate", value: 10 }
    ],
    sentiment: {
      score: 62,
      breakdown: { positive: 45, neutral: 35, negative: 20 }
    },
    entities: {
      countries: ["United States", "China", "Ukraine"],
      companies: ["NVIDIA", "Apple", "Tesla"],
      leaders: ["Joe Biden", "Xi Jinping", "Elon Musk"]
    },
    timeline: [
      { time: "00:00", score: 58 },
      { time: "06:00", score: 62 },
      { time: "12:00", score: 55 },
      { time: "18:00", score: 68 },
      { time: "24:00", score: 65 }
    ]
  };
}
