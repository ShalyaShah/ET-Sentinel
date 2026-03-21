import { GoogleGenAI, Type } from '@google/genai';
import { HealthCheckData, PortfolioAlert, SignalCardData, BriefingSegment, SectorFlow } from '../types';

// Initialize the Gemini API client
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY as string });

export async function generateSectorFlows(): Promise<SectorFlow[]> {
  const currentDate = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  const schema = {
    type: Type.ARRAY,
    items: {
      type: Type.OBJECT,
      properties: {
        sector: { type: Type.STRING, description: "Sector name (e.g., Infrastructure, Energy, IT, Banking, Auto, Pharma, FMCG, Metals)" },
        flowScore: { type: Type.NUMBER, description: "Flow score from -100 (heavy selling) to 100 (heavy buying)" },
        reason: { type: Type.STRING, description: "Short reason for the flow (e.g., 'Block deals in IRB Infra', 'FII selling')" }
      },
      required: ["sector", "flowScore", "reason"]
    }
  };

  const prompt = `You are a market analyst tracking DII/FII capital deployment in the Indian stock market.
  Today's date is ${currentDate}.
  Generate a realistic, real-time sector flow analysis for 8 major sectors (Infrastructure, Energy, IT, Banking, Auto, Pharma, FMCG, Metals).
  Assign a flow score from -100 to 100 for each sector, where positive means capital inflow (glowing green) and negative means outflow (red).
  Provide a short, punchy reason for each score.
  Format the output exactly according to the provided JSON schema.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      responseMimeType: 'application/json',
      responseSchema: schema,
      temperature: 0.4,
    }
  });

  if (!response.text) {
    throw new Error("Failed to generate sector flows");
  }

  return JSON.parse(response.text) as SectorFlow[];
}

export async function generateDailyBriefing(signals: SignalCardData[]): Promise<BriefingSegment[]> {
  const currentDate = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  const schema = {
    type: Type.ARRAY,
    items: {
      type: Type.OBJECT,
      properties: {
        signalId: { type: Type.STRING, description: "The ID of the signal this text refers to. Use 'intro' for the introduction and 'outro' for the conclusion." },
        text: { type: Type.STRING, description: "The spoken text for this segment" }
      },
      required: ["signalId", "text"]
    }
  };

  const prompt = `You are the host of a fast-paced, 30-second daily market briefing for Indian retail investors.
  Today's date is ${currentDate}.
  Here are the top 3 market movements/signals for today:
  ${signals.map(s => `ID: ${s.id} | ${s.ticker} (${s.companyName}): ${s.headline}. ${s.trigger}`).join('\n')}
  
  Write a highly punchy, engaging 30-second script summarizing these 3 setups. 
  Make it sound like a professional financial news anchor. 
  Break the script down into segments. Start with an 'intro', then one segment for each signal ID, and optionally an 'outro'.
  Do not include any formatting like bolding or asterisks, just the plain text to be read aloud.
  Keep it under 100 words total.
  Format the output exactly according to the provided JSON schema.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      responseMimeType: 'application/json',
      responseSchema: schema,
      temperature: 0.5,
    }
  });

  if (!response.text) {
    throw new Error("Failed to generate daily briefing");
  }

  return JSON.parse(response.text) as BriefingSegment[];
}

export async function generateFeed(riskProfile: string): Promise<SignalCardData[]> {
  const currentDate = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  const schema = {
    type: Type.ARRAY,
    items: {
      type: Type.OBJECT,
      properties: {
        id: { type: Type.STRING },
        ticker: { type: Type.STRING },
        companyName: { type: Type.STRING },
        headline: { type: Type.STRING },
        trigger: { type: Type.STRING },
        timing: { type: Type.STRING },
        historicalOdds: { type: Type.STRING },
        riskManagement: { type: Type.STRING },
        timestamp: { type: Type.STRING },
        type: { type: Type.STRING, description: "Must be 'bullish', 'bearish', or 'neutral'" }
      },
      required: ["id", "ticker", "companyName", "headline", "trigger", "timing", "historicalOdds", "riskManagement", "timestamp", "type"]
    }
  };

  const prompt = `You are ET Sentinel, an AI Confluence Engine for Indian retail investors.
  Today's date is ${currentDate}.
  Generate 3 realistic, high-conviction trading setups (signals) based on recent market context.
  The user's risk profile is: ${riskProfile}.
  If the user selects "Conservative", filter out high-beta small-cap signals and ONLY show Confluence setups for Nifty 50 stocks.
  If "Balanced", include a mix.
  If "Aggressive", focus on breakouts and mid-caps.
  Format the output exactly according to the provided JSON schema.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      responseMimeType: 'application/json',
      responseSchema: schema,
      temperature: 0.4,
    }
  });

  if (!response.text) {
    throw new Error("Failed to generate feed");
  }

  return JSON.parse(response.text) as SignalCardData[];
}

export async function analyzeStock(ticker: string): Promise<HealthCheckData> {
  const currentDate = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
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
      },
      chartData: {
        type: Type.ARRAY,
        description: "Generate 90 days of realistic daily price data for a 3-month sparkline. Exactly one day should have fundamentalTrigger: true, and exactly one day should have technicalTrigger: true. These two days should ideally be close to each other to show confluence.",
        items: {
          type: Type.OBJECT,
          properties: {
            date: { type: Type.STRING, description: "Format: MMM DD (e.g., Jan 15)" },
            price: { type: Type.NUMBER },
            fundamentalTrigger: { type: Type.BOOLEAN, description: "Set to true for exactly one day representing a fundamental event (e.g., earnings call)" },
            technicalTrigger: { type: Type.BOOLEAN, description: "Set to true for exactly one day representing a technical event (e.g., breakout)" }
          },
          required: ["date", "price"]
        }
      }
    },
    required: ["ticker", "companyName", "summary", "technicalStatus", "fundamentalStatus", "liquidityStatus", "riskLevel", "recommendation", "historicalBacktest", "chartData"]
  };

  const prompt = `You are ET Sentinel, an AI Confluence Engine for Indian retail investors.
  Today's date is ${currentDate}.
  Analyze the Indian stock ticker '${ticker}'.
  Provide a realistic, highly plausible analysis of its current technicals, fundamentals, and liquidity based on recent market context.
  Also generate 90 days of realistic daily price data for a 3-month sparkline. Include exactly one 'fundamentalTrigger' and exactly one 'technicalTrigger' on specific dates to illustrate confluence.
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

export async function generateSectorAlerts(sector: string): Promise<PortfolioAlert[]> {
  const currentDate = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  const schema = {
    type: Type.ARRAY,
    items: {
      type: Type.OBJECT,
      properties: {
        id: { type: Type.STRING },
        ticker: { type: Type.STRING },
        message: { type: Type.STRING, description: "A confluence signal or alert for a stock in this sector." },
        type: { type: Type.STRING, description: "Must be 'warning', 'info', or 'action'" },
        timestamp: { type: Type.STRING, description: "e.g., 'Just now'" }
      },
      required: ["id", "ticker", "message", "type", "timestamp"]
    }
  };

  const prompt = `You are the "Opportunity Radar" for an Indian retail investor. 
  Today's date is ${currentDate}.
  The user has clicked on the ${sector} sector which is seeing heavy institutional flow.
  Generate 2-3 highly specific confluence signals or alerts for stocks specifically within the ${sector} sector (e.g., if Infrastructure, maybe IRB Infra or L&T).
  Highlight the technical and fundamental reasons for the setup.
  Format the output exactly according to the provided JSON schema.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      responseMimeType: 'application/json',
      responseSchema: schema,
      temperature: 0.4,
    }
  });

  if (!response.text) {
    throw new Error("Failed to generate sector alerts");
  }

  return JSON.parse(response.text) as PortfolioAlert[];
}

export async function generatePortfolioAlerts(holdings: string[]): Promise<PortfolioAlert[]> {
  const currentDate = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  const schema = {
    type: Type.ARRAY,
    items: {
      type: Type.OBJECT,
      properties: {
        id: { type: Type.STRING },
        ticker: { type: Type.STRING },
        message: { type: Type.STRING, description: "A personalized alert message based on the portfolio context." },
        type: { type: Type.STRING, description: "Must be 'warning', 'info', or 'action'" },
        timestamp: { type: Type.STRING, description: "e.g., 'Just now'" }
      },
      required: ["id", "ticker", "message", "type", "timestamp"]
    }
  };

  const prompt = `You are the "Opportunity Radar" for an Indian retail investor. 
  Today's date is ${currentDate}.
  The user holds the following tickers in their portfolio: ${holdings.join(', ')}.
  Generate 1-3 highly personalized, realistic alerts based on recent market context (e.g., FII/DII flows, sector rotation, technical breakdowns, or fundamental news) that affect these specific holdings or their sectors.
  For example, if they hold PGINVIT, you might warn about FIIs reducing exposure in the infrastructure sector.
  Format the output exactly according to the provided JSON schema.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      responseMimeType: 'application/json',
      responseSchema: schema,
      temperature: 0.4,
    }
  });

  if (!response.text) {
    throw new Error("Failed to generate portfolio alerts");
  }

  return JSON.parse(response.text) as PortfolioAlert[];
}
