import React, { useState } from 'react';
import { Calculator, Target, ShieldAlert, TrendingUp } from 'lucide-react';

interface PositionSizerProps {
  currentPrice: number;
  stopLossPrice: number;
  targetPrice: number;
  winRate: number;
  type: 'bullish' | 'bearish' | 'neutral';
}

export function PositionSizer({ currentPrice, stopLossPrice, targetPrice, winRate, type }: PositionSizerProps) {
  const [capital, setCapital] = useState<number>(100000); // Default 1 Lakh INR

  // Risk is 2% of total capital
  const riskAmount = capital * 0.02;

  // Risk per share
  const riskPerShare = Math.abs(currentPrice - stopLossPrice);

  // Number of shares to buy
  const shares = riskPerShare > 0 ? Math.floor(riskAmount / riskPerShare) : 0;

  // Total position size
  const positionSize = shares * currentPrice;

  // Potential profit
  const profitPerShare = Math.abs(targetPrice - currentPrice);
  const potentialProfit = shares * profitPerShare;

  // Expected Value (EV) = (Win Rate * Potential Profit) - (Loss Rate * Risk Amount)
  const expectedValue = ((winRate / 100) * potentialProfit) - (((100 - winRate) / 100) * riskAmount);

  const formatINR = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(value);
  };

  if (type === 'neutral' || !currentPrice || !stopLossPrice || !targetPrice) {
    return null;
  }

  return (
    <div className="mt-6 bg-zinc-950 rounded-xl border border-zinc-800 p-5">
      <div className="flex items-center space-x-2 mb-4">
        <Calculator className="w-5 h-5 text-emerald-500" />
        <h4 className="text-sm font-bold text-white uppercase tracking-wider">Smart Position Sizer</h4>
      </div>

      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <label className="text-sm text-zinc-400">Total Trading Capital</label>
          <span className="text-sm font-mono font-bold text-emerald-400">{formatINR(capital)}</span>
        </div>
        <input
          type="range"
          min="10000"
          max="1000000"
          step="10000"
          value={capital}
          onChange={(e) => setCapital(Number(e.target.value))}
          className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
        />
        <div className="flex justify-between text-xs text-zinc-500 mt-2">
          <span>₹10K</span>
          <span>₹10L</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-zinc-900 p-3 rounded-lg border border-zinc-800/50">
          <div className="text-xs text-zinc-500 mb-1">Max Risk (2%)</div>
          <div className="text-lg font-mono font-bold text-red-400">-{formatINR(riskAmount)}</div>
        </div>
        <div className="bg-zinc-900 p-3 rounded-lg border border-zinc-800/50">
          <div className="text-xs text-zinc-500 mb-1">Potential Profit</div>
          <div className="text-lg font-mono font-bold text-emerald-400">+{formatINR(potentialProfit)}</div>
        </div>
      </div>

      <div className="bg-zinc-900 rounded-lg p-4 border border-zinc-800">
        <div className="flex justify-between items-center mb-3">
          <span className="text-sm text-zinc-400">Recommended Size</span>
          <span className="text-lg font-bold text-white">{shares} Shares</span>
        </div>
        
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-zinc-500 flex items-center"><TrendingUp className="w-3 h-3 mr-1"/> Entry Price</span>
            <span className="font-mono text-zinc-300">₹{currentPrice}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-zinc-500 flex items-center"><Target className="w-3 h-3 mr-1"/> Target Price</span>
            <span className="font-mono text-emerald-400">₹{targetPrice}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-zinc-500 flex items-center"><ShieldAlert className="w-3 h-3 mr-1"/> Stop Loss</span>
            <span className="font-mono text-red-400">₹{stopLossPrice}</span>
          </div>
          <div className="flex justify-between pt-2 border-t border-zinc-800 mt-2">
            <span className="text-zinc-400 font-medium">Position Value</span>
            <span className="font-mono text-white">{formatINR(positionSize)}</span>
          </div>
          <div className="flex justify-between pt-1">
            <span className="text-zinc-400 font-medium">Expected Value (EV)</span>
            <span className={`font-mono ${expectedValue >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
              {expectedValue >= 0 ? '+' : ''}{formatINR(expectedValue)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
