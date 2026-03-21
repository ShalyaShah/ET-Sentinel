import { SignalCardData, HealthCheckData, PortfolioAlert, Holding } from './types';

export const MOCK_SIGNALS: SignalCardData[] = [
  {
    id: '1',
    ticker: 'TATAMOTORS',
    companyName: 'Tata Motors Ltd.',
    headline: 'High Conviction Setup: Tata Motors',
    trigger: 'Promoter bought 2 lakh shares yesterday, coinciding with management upgrading their Q4 guidance.',
    timing: 'Stock just broke out of a 4-week consolidation box on 3x average volume.',
    historicalOdds: 'Historically, this specific technical setup on Tata Motors has a 72% win rate.',
    riskManagement: 'Suggested Stop Loss based on recent swing low: ₹940.',
    timestamp: '2 hours ago',
    type: 'bullish',
    currentPrice: 960,
    stopLossPrice: 940,
    targetPrice: 1020,
    winRate: 72
  },
  {
    id: '2',
    ticker: 'RELIANCE',
    companyName: 'Reliance Industries Ltd.',
    headline: 'Liquidity Anomaly Detected: Reliance',
    trigger: 'Major DII acquired 1.2% stake via block deal amidst flat earnings commentary.',
    timing: 'Approaching 200-Day EMA support after a 10% correction.',
    historicalOdds: 'Bounces from 200-Day EMA with DII buying have an 80% probability of a 6%+ move in 21 days.',
    riskManagement: 'Suggested Stop Loss below 200-Day EMA: ₹2,850.',
    timestamp: '5 hours ago',
    type: 'bullish',
    currentPrice: 2900,
    stopLossPrice: 2850,
    targetPrice: 3100,
    winRate: 80
  },
  {
    id: '3',
    ticker: 'WIPRO',
    companyName: 'Wipro Ltd.',
    headline: 'Negative Divergence: Wipro',
    trigger: 'Management sentiment delta is negative (Q3: "cautious" vs Q2: "optimistic"). Insider selling detected.',
    timing: 'RSI Bearish Divergence on the daily chart while hitting major resistance at ₹520.',
    historicalOdds: 'This setup historically leads to a 5-8% correction in 65% of occurrences.',
    riskManagement: 'Consider hedging or tightening stop loss if holding long.',
    timestamp: '1 day ago',
    type: 'bearish',
    currentPrice: 520,
    stopLossPrice: 535,
    targetPrice: 480,
    winRate: 65
  }
];

export const MOCK_HEALTH_CHECKS: Record<string, HealthCheckData> = {
  'SUZLON': {
    ticker: 'SUZLON',
    companyName: 'Suzlon Energy Ltd.',
    summary: 'Technicals are bullish (trading above 50 DMA), BUT insider pledging has increased by 10% this quarter, and institutional holding is dropping. High Risk.',
    technicalStatus: 'Bullish - Trading above 50 DMA, strong momentum.',
    fundamentalStatus: 'Weak - Debt concerns remain, negative sentiment delta in last concall.',
    liquidityStatus: 'Bearish - Insider pledging up 10%, DII holding dropping.',
    riskLevel: 'High',
    recommendation: 'Avoid or strict stop loss. Confluence is broken (Technicals positive, Fundamentals/Liquidity negative).',
    historicalBacktest: {
      patternName: '50 DMA Breakout with High Pledging',
      patternDescription: 'A technical breakout above the 50-day moving average, but contradicted by insiders heavily pledging their shares for loans.',
      occurrences: 14,
      successRate: 28,
      averageReturn: '-12.4%',
      timeframe: '3 Months'
    }
  },
  'HDFCBANK': {
    ticker: 'HDFCBANK',
    companyName: 'HDFC Bank Ltd.',
    summary: 'Strong fundamental base with improving management commentary on NIMs. Technicals showing early signs of reversal.',
    technicalStatus: 'Neutral - Consolidating near 52-week lows, forming a base.',
    fundamentalStatus: 'Bullish - Positive sentiment delta on margin expansion.',
    liquidityStatus: 'Neutral - Steady FII flows, no major block deals.',
    riskLevel: 'Low',
    recommendation: 'Accumulate. Good fundamental setup awaiting technical confirmation (breakout above ₹1,480).',
    historicalBacktest: {
      patternName: '52-Week Low Base + Positive Margin Delta',
      patternDescription: 'The stock has formed a strong support base near its yearly low, while management simultaneously reports improving profit margins.',
      occurrences: 8,
      successRate: 87,
      averageReturn: '+18.5%',
      timeframe: '6 Months'
    }
  }
};

export const MOCK_PORTFOLIO_ALERTS: PortfolioAlert[] = [
  {
    id: 'a1',
    ticker: 'HDFCBANK',
    message: 'Your mutual fund (SBI Bluechip) has quietly sold off 50% of its HDFC Bank holdings this month, but you are still holding it directly. Consider reviewing your exposure.',
    type: 'warning',
    timestamp: '1 day ago'
  },
  {
    id: 'a2',
    ticker: 'INFY',
    message: 'Infosys is approaching your target price of ₹1,700. Technicals suggest momentum is slowing.',
    type: 'info',
    timestamp: '2 days ago'
  }
];

export const MOCK_HOLDINGS: Holding[] = [
  { ticker: 'HDFCBANK', companyName: 'HDFC Bank', shares: 150, avgPrice: 1520, currentPrice: 1440 },
  { ticker: 'INFY', companyName: 'Infosys', shares: 50, avgPrice: 1400, currentPrice: 1680 },
  { ticker: 'ITC', companyName: 'ITC Ltd.', shares: 300, avgPrice: 380, currentPrice: 410 },
];
