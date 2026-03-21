export interface BriefingSegment {
  signalId: string;
  text: string;
}

export interface SignalCardData {
  id: string;
  ticker: string;
  companyName: string;
  headline: string;
  trigger: string;
  timing: string;
  historicalOdds: string;
  riskManagement: string;
  timestamp: string;
  type: 'bullish' | 'bearish' | 'neutral';
}

export interface HealthCheckData {
  ticker: string;
  companyName: string;
  summary: string;
  technicalStatus: string;
  fundamentalStatus: string;
  liquidityStatus: string;
  riskLevel: 'Low' | 'Medium' | 'High';
  recommendation: string;
  historicalBacktest?: {
    patternName: string;
    patternDescription: string;
    occurrences: number;
    successRate: number;
    averageReturn: string;
    timeframe: string;
  };
  chartData?: {
    date: string;
    price: number;
    fundamentalTrigger?: boolean;
    technicalTrigger?: boolean;
  }[];
}

export interface PortfolioAlert {
  id: string;
  ticker: string;
  message: string;
  type: 'warning' | 'info' | 'action';
  timestamp: string;
}

export interface Holding {
  ticker: string;
  companyName: string;
  shares: number;
  avgPrice: number;
  currentPrice: number;
}
