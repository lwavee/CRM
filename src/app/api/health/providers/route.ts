import { NextResponse } from 'next/server';

export async function GET() {
  const openaiConfigured = Boolean(process.env.OPENAI_API_KEY);
  const googleSearchConfigured = Boolean(process.env.GOOGLE_SEARCH_API_KEY && process.env.GOOGLE_SEARCH_CX);
  const googleMapsConfigured = Boolean(process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || process.env.GOOGLE_SEARCH_API_KEY);
  const hunterConfigured = Boolean(process.env.HUNTER_API_KEY);
  const apolloConfigured = Boolean(process.env.APOLLO_API_KEY);

  return NextResponse.json({
    success: true,
    timestamp: new Date().toISOString(),
    providers: {
      openai: {
        configured: openaiConfigured,
        healthy: openaiConfigured,
        provider: 'OpenAI GPT-4o',
      },
      googleSearch: {
        configured: googleSearchConfigured,
        healthy: googleSearchConfigured,
        provider: 'Google Custom Search API',
      },
      googleMaps: {
        configured: googleMapsConfigured,
        healthy: googleMapsConfigured,
        provider: 'Google Places API',
      },
      hunter: {
        configured: hunterConfigured,
        healthy: hunterConfigured,
        provider: 'Hunter.io API',
      },
      apollo: {
        configured: apolloConfigured,
        healthy: apolloConfigured,
        provider: 'Apollo.io API',
      },
    },
  });
}
