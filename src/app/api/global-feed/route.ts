import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const newsApiKey = process.env.NEWS_API_KEY;
const openaiApiKey = process.env.OPENAI_API_KEY;

const openai = new OpenAI({
  apiKey: openaiApiKey,
});

export async function GET() {
  if (!newsApiKey) {
    return NextResponse.json({ error: 'News API key not configured' }, { status: 500 });
  }

  try {
    // 1. Fetch news from NewsAPI
    const newsResponse = await fetch(
      `https://newsapi.org/v2/everything?q=geopolitics OR economics OR finance OR "market news"&pageSize=10&sortBy=publishedAt&language=en&apiKey=${newsApiKey}`
    );

    const newsData = await newsResponse.json();

    if (newsData.status !== 'ok') {
      return NextResponse.json({ error: 'Failed to fetch news', details: newsData }, { status: 500 });
    }

    const articles = newsData.articles;

    // 2. Enrich with OpenAI
    // We'll process them in parallel for speed, but limit to 5 for OpenAI costs/limits if needed.
    // For this task, we'll do the first 8 articles.
    const enrichedArticles = await Promise.all(
      articles.slice(0, 8).map(async (article: any) => {
        try {
          const prompt = `Analyze the following news article and provide a JSON response with:
1. "summary": A concise AI-generated summary (2 sentences).
2. "sentiment": One of "positive", "neutral", "negative".
3. "riskLevel": One of "low", "medium", "high".
4. "confidenceScore": A number between 0 and 1 representing your confidence in this analysis.
5. "region": The primary geographic region affected (e.g., "Global", "North America", "Europe", "Asia-Pacific", "Middle East", "Africa", "South America").
6. "topic": The primary topic (e.g., "Finance", "Energy", "Tech", "Geopolitics", "Healthcare").

Article Title: ${article.title}
Article Description: ${article.description}
Article Content: ${article.content}

Response MUST be strictly valid JSON.`;

          const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
              { role: "system", content: "You are a financial and geopolitical risk analyst." },
              { role: "user", content: prompt }
            ],
            response_format: { type: "json_object" },
          });

          const enrichment = JSON.parse(completion.choices[0].message.content || '{}');

          return {
            headline: article.title,
            summary: enrichment.summary || article.description,
            sentiment: enrichment.sentiment || 'neutral',
            riskLevel: enrichment.riskLevel || 'low',
            confidenceScore: enrichment.confidenceScore || 0.5,
            region: enrichment.region || 'Global',
            topic: enrichment.topic || 'General',
            source: article.source.name,
            timestamp: article.publishedAt,
            url: article.url,
            urlToImage: article.urlToImage
          };
        } catch (error) {
          console.error('Error enriching article:', error);
          // Fallback if OpenAI fails
          return {
            headline: article.title,
            summary: article.description,
            sentiment: 'neutral',
            riskLevel: 'low',
            confidenceScore: 0.3,
            region: 'Global',
            topic: 'General',
            source: article.source.name,
            timestamp: article.publishedAt,
            url: article.url,
            urlToImage: article.urlToImage
          };
        }
      })
    );

    return NextResponse.json(enrichedArticles);
  } catch (error: any) {
    return NextResponse.json({ error: 'Internal server error', details: error.message }, { status: 500 });
  }
}
