import React, { useState } from 'react';
import { SignalCardData } from '../types';
import { TrendingUp, TrendingDown, Activity, Clock, ShieldAlert, Zap, Calculator, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { PositionSizer } from './PositionSizer';

interface SignalCardProps {
  signal: SignalCardData;
}

export function SignalCard({ signal }: SignalCardProps) {
  const isBullish = signal.type === 'bullish';
  const isBearish = signal.type === 'bearish';
  const [showSizer, setShowSizer] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-sm hover:border-zinc-700 transition-colors"
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <span className="text-xs font-mono text-zinc-400 bg-zinc-800 px-2 py-1 rounded-md">
              {signal.ticker}
            </span>
            <span className="text-sm text-zinc-500">{signal.timestamp}</span>
          </div>
          <h3 className="text-xl font-bold text-white tracking-tight">{signal.headline}</h3>
        </div>
        <div className={`p-2 rounded-full ${isBullish ? 'bg-emerald-500/10 text-emerald-500' : isBearish ? 'bg-red-500/10 text-red-500' : 'bg-blue-500/10 text-blue-500'}`}>
          {isBullish ? <TrendingUp className="w-6 h-6" /> : isBearish ? <TrendingDown className="w-6 h-6" /> : <Activity className="w-6 h-6" />}
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-start space-x-3">
          <Zap className="w-5 h-5 text-amber-500 mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-semibold text-zinc-300 uppercase tracking-wider mb-1">The Trigger</p>
            <p className="text-zinc-400 text-sm leading-relaxed">{signal.trigger}</p>
          </div>
        </div>

        <div className="flex items-start space-x-3">
          <Clock className="w-5 h-5 text-blue-500 mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-semibold text-zinc-300 uppercase tracking-wider mb-1">The Timing</p>
            <p className="text-zinc-400 text-sm leading-relaxed">{signal.timing}</p>
          </div>
        </div>

        <div className="flex items-start space-x-3">
          <Activity className="w-5 h-5 text-purple-500 mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-semibold text-zinc-300 uppercase tracking-wider mb-1">Historical Odds</p>
            <p className="text-zinc-400 text-sm leading-relaxed">{signal.historicalOdds}</p>
          </div>
        </div>

        <div className="flex items-start space-x-3 bg-zinc-950 p-4 rounded-xl border border-zinc-800/50 mt-4">
          <ShieldAlert className="w-5 h-5 text-zinc-400 mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-semibold text-zinc-300 uppercase tracking-wider mb-1">Risk Management</p>
            <p className="text-zinc-400 text-sm">{signal.riskManagement}</p>
          </div>
        </div>

        {signal.currentPrice && signal.stopLossPrice && signal.targetPrice && signal.winRate && (
          <div className="mt-4">
            <button
              onClick={() => setShowSizer(!showSizer)}
              className="w-full flex items-center justify-center space-x-2 py-3 bg-zinc-800/30 hover:bg-zinc-800/60 text-zinc-300 rounded-xl border border-zinc-700/50 transition-colors"
            >
              <Calculator className="w-4 h-4 text-emerald-500" />
              <span className="text-sm font-medium">
                {showSizer ? 'Hide Position Sizer' : 'Calculate Position Size'}
              </span>
              {showSizer ? <ChevronUp className="w-4 h-4 text-zinc-500" /> : <ChevronDown className="w-4 h-4 text-zinc-500" />}
            </button>

            <AnimatePresence>
              {showSizer && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <PositionSizer 
                    currentPrice={signal.currentPrice}
                    stopLossPrice={signal.stopLossPrice}
                    targetPrice={signal.targetPrice}
                    winRate={signal.winRate}
                    type={signal.type}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </motion.div>
  );
}
