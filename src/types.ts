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
