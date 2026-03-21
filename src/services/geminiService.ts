import { GoogleGenAI, Type } from '@google/genai';
import { HealthCheckData } from '../types';

// Initialize the Gemini API client
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY as string });

export async function analyzeStock(ticker: string): Promise<HealthCheckData> {
  const schema = {
    type: Type.OBJECT,
    properties: {
      ticker: { type: Type.STRING, description: "The stock ticker symbol (e.g., RELIANCE, TCS)" },
      companyName: { type: Type.STRING, description: "Full company name" },
      summary: { type: Type.STRING, description: "A 2-3 sentence summary of the confluence of technicals, fundamentals, and liquidity." },
      technicalStatus: { type: Type.STRING, description: "Technical analysis status (e.g., 'Bullish - Trading above 50 DMA')" },
      fundamentalStatus: { type: Type.STRING, description: "Fundamental analysis status (e.g., 'Neutral - Margin expansion but high debt')" },
      liquidityStatus: { type: Type.STRING, description: "Liquidity/Smart Money status (e.g., 'Bearish - FII selling')" },
      riskLevel: { type: Type.STRING, description: "Must be exactly 'Low', 'Medium', or 'High'" },
      recommendation: { type: Type.STRING, description: "Final verdict and recommendation" },
      historicalBacktest: {
        type: Type.OBJECT,
        properties: {
          patternName: { type: Type.STRING },
          patternDescription: { type: Type.STRING, description: "A brief, plain-English description of what the technical pattern signifies." },
          occurrences: { type: Type.NUMBER },
          successRate: { type: Type.NUMBER },
          averageReturn: { type: Type.STRING },
          timeframe: { type: Type.STRING }
        },
        required: ["patternName", "patternDescription", "occurrences", "successRate", "averageReturn", "timeframe"]
      }
    },
    required: ["ticker", "companyName", "summary", "technicalStatus", "fundamentalStatus", "liquidityStatus", "riskLevel", "recommendation", "historicalBacktest"]
  };

  const prompt = `You are ET Sentinel, an AI Confluence Engine for Indian retail investors.
  Analyze the Indian stock ticker '${ticker}'.
  Provide a realistic, highly plausible analysis of its current technicals, fundamentals, and liquidity based on recent market context.
  Format the output exactly according to the provided JSON schema.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      responseMimeType: 'application/json',
      responseSchema: schema,
      temperature: 0.2,
    }
  });

  if (!response.text) {
    throw new Error("Failed to generate analysis");
  }

  return JSON.parse(response.text) as HealthCheckData;
}
