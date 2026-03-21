import React from 'react';
import { MOCK_PORTFOLIO_ALERTS, MOCK_HOLDINGS } from '../data';
import { AlertCircle, Info, TrendingUp, TrendingDown, RefreshCw } from 'lucide-react';
import { motion } from 'motion/react';

export function Portfolio() {
  return (
    <div className="max-w-4xl mx-auto py-8 px-6">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight mb-2">Opportunity Radar</h1>
          <p className="text-zinc-400">Portfolio-aware alerts based on your synced Demat account.</p>
        </div>
        <button className="flex items-center space-x-2 text-sm text-zinc-400 hover:text-white transition-colors bg-zinc-900 px-4 py-2 rounded-lg border border-zinc-800">
          <RefreshCw className="w-4 h-4" />
          <span>Sync Broker</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-xl font-bold text-white tracking-tight border-b border-zinc-800 pb-4">Active Alerts</h2>
          {MOCK_PORTFOLIO_ALERTS.map((alert, index) => (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`p-6 rounded-2xl border ${
                alert.type === 'warning' ? 'bg-amber-500/5 border-amber-500/20' : 'bg-blue-500/5 border-blue-500/20'
              }`}
            >
              <div className="flex items-start space-x-4">
                <div className={`p-2 rounded-full shrink-0 ${
                  alert.type === 'warning' ? 'bg-amber-500/20 text-amber-500' : 'bg-blue-500/20 text-blue-500'
                }`}>
                  {alert.type === 'warning' ? <AlertCircle className="w-6 h-6" /> : <Info className="w-6 h-6" />}
                </div>
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-xs font-mono font-bold px-2 py-1 rounded bg-zinc-900 text-zinc-300 border border-zinc-800">
                      {alert.ticker}
                    </span>
                    <span className="text-xs text-zinc-500">{alert.timestamp}</span>
                  </div>
                  <p className="text-zinc-300 leading-relaxed">{alert.message}</p>
                </div>
              </div>
            </motion.div>
          ))}
          {MOCK_PORTFOLIO_ALERTS.length === 0 && (
            <div className="text-center p-8 bg-zinc-900 border border-zinc-800 rounded-2xl">
              <p className="text-zinc-400">No active alerts for your portfolio.</p>
            </div>
          )}
        </div>

        <div>
          <h2 className="text-xl font-bold text-white tracking-tight border-b border-zinc-800 pb-4 mb-6">Current Holdings</h2>
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
            <div className="divide-y divide-zinc-800">
              {MOCK_HOLDINGS.map((holding) => {
                const pnl = ((holding.currentPrice - holding.avgPrice) / holding.avgPrice) * 100;
                const isPositive = pnl >= 0;

                return (
                  <div key={holding.ticker} className="p-4 hover:bg-zinc-800/50 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-bold text-white">{holding.ticker}</h3>
                        <p className="text-xs text-zinc-500">{holding.shares} shares</p>
                      </div>
                      <div className="text-right">
                        <p className="font-mono text-white">₹{holding.currentPrice}</p>
                        <p className={`text-xs font-medium flex items-center justify-end space-x-1 ${isPositive ? 'text-emerald-500' : 'text-red-500'}`}>
                          {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                          <span>{Math.abs(pnl).toFixed(2)}%</span>
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
