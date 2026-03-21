import React, { useState, useEffect } from 'react';
import { MOCK_PORTFOLIO_ALERTS, MOCK_HOLDINGS } from '../data';
import { AlertCircle, Info, TrendingUp, TrendingDown, RefreshCw, Plus, Loader2, X } from 'lucide-react';
import { motion } from 'motion/react';
import { generatePortfolioAlerts } from '../services/geminiService';
import { PortfolioAlert, Holding } from '../types';

const INITIAL_HOLDINGS: Holding[] = [
  { ticker: 'IOCL', companyName: 'Indian Oil Corporation', shares: 500, avgPrice: 130, currentPrice: 165 },
  { ticker: 'PGINVIT', companyName: 'PowerGrid InvIT', shares: 1000, avgPrice: 100, currentPrice: 95 },
  { ticker: 'NIFTYBEES', companyName: 'Nippon India ETF Nifty 50 BeES', shares: 200, avgPrice: 210, currentPrice: 245 },
];

export function Portfolio() {
  const [holdings, setHoldings] = useState<Holding[]>(INITIAL_HOLDINGS);
  const [alerts, setAlerts] = useState<PortfolioAlert[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [newTicker, setNewTicker] = useState('');
  const [newShares, setNewShares] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [isAddingDetails, setIsAddingDetails] = useState(false);

  const fetchAlerts = async () => {
    if (holdings.length === 0) return;
    setIsGenerating(true);
    try {
      const tickers = holdings.map(h => h.ticker);
      const generatedAlerts = await generatePortfolioAlerts(tickers);
      setAlerts(generatedAlerts);
    } catch (error) {
      console.error("Failed to fetch alerts:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, []);

  const handleTickerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTicker.trim()) return;
    
    const ticker = newTicker.toUpperCase().trim();
    if (holdings.some(h => h.ticker === ticker)) {
      setNewTicker('');
      return;
    }
    setIsAddingDetails(true);
  };

  const handleAddHolding = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newShares || !newPrice) return;

    const newHolding: Holding = {
      ticker: newTicker.toUpperCase().trim(),
      companyName: newTicker.toUpperCase().trim(), // Placeholder
      shares: Number(newShares),
      avgPrice: Number(newPrice),
      currentPrice: Number(newPrice) * (1 + (Math.random() * 0.1 - 0.05)) // Add a little random variance for current price
    };

    setHoldings([...holdings, newHolding]);
    setNewTicker('');
    setNewShares('');
    setNewPrice('');
    setIsAddingDetails(false);
  };

  const removeHolding = (tickerToRemove: string) => {
    setHoldings(holdings.filter(h => h.ticker !== tickerToRemove));
  };
  return (
    <div className="max-w-4xl mx-auto py-8 px-6">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight mb-2">Opportunity Radar</h1>
          <p className="text-zinc-400">Portfolio-aware alerts based on your synced Demat account.</p>
        </div>
        <button 
          onClick={fetchAlerts}
          disabled={isGenerating}
          className="flex items-center space-x-2 text-sm text-zinc-400 hover:text-white transition-colors bg-zinc-900 px-4 py-2 rounded-lg border border-zinc-800 disabled:opacity-50"
        >
          {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
          <span>{isGenerating ? 'Scanning...' : 'Sync Broker'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-xl font-bold text-white tracking-tight border-b border-zinc-800 pb-4">Active Alerts</h2>
          
          {isGenerating ? (
            <div className="p-12 text-center bg-zinc-900 border border-zinc-800 rounded-2xl">
              <Loader2 className="w-8 h-8 text-emerald-500 animate-spin mx-auto mb-4" />
              <p className="text-zinc-400">Opportunity Radar is scanning your portfolio...</p>
            </div>
          ) : alerts.length > 0 ? (
            alerts.map((alert, index) => (
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
            ))
          ) : (
            <div className="text-center p-8 bg-zinc-900 border border-zinc-800 rounded-2xl">
              <p className="text-zinc-400">No active alerts for your portfolio.</p>
            </div>
          )}
        </div>

        <div>
          <div className="flex items-center justify-between border-b border-zinc-800 pb-4 mb-6">
            <h2 className="text-xl font-bold text-white tracking-tight">Current Holdings</h2>
          </div>

          {!isAddingDetails ? (
            <form onSubmit={handleTickerSubmit} className="mb-4 flex space-x-2">
              <input
                type="text"
                value={newTicker}
                onChange={(e) => setNewTicker(e.target.value)}
                placeholder="Add ticker (e.g. TCS)"
                className="flex-1 bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
              <button
                type="submit"
                disabled={!newTicker.trim()}
                className="bg-zinc-800 hover:bg-zinc-700 disabled:opacity-50 text-white px-3 py-2 rounded-lg transition-colors flex items-center justify-center"
              >
                <Plus className="w-4 h-4" />
              </button>
            </form>
          ) : (
            <form onSubmit={handleAddHolding} className="mb-4 space-y-3 bg-zinc-900/50 p-3 rounded-xl border border-zinc-800">
              <div className="flex justify-between items-center">
                <span className="text-sm font-bold text-white">{newTicker.toUpperCase()}</span>
                <button type="button" onClick={() => { setIsAddingDetails(false); setNewTicker(''); }} className="text-zinc-500 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="flex space-x-2">
                <input
                  type="number"
                  required
                  min="1"
                  value={newShares}
                  onChange={(e) => setNewShares(e.target.value)}
                  placeholder="Shares"
                  className="w-1/2 bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
                <input
                  type="number"
                  required
                  min="0.01"
                  step="0.01"
                  value={newPrice}
                  onChange={(e) => setNewPrice(e.target.value)}
                  placeholder="Buy Price (₹)"
                  className="w-1/2 bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-emerald-500 hover:bg-emerald-600 text-white px-3 py-2 rounded-lg transition-colors text-sm font-medium"
              >
                Add to Portfolio
              </button>
            </form>
          )}

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
            <div className="divide-y divide-zinc-800">
              {holdings.map((holding) => {
                const pnl = ((holding.currentPrice - holding.avgPrice) / holding.avgPrice) * 100;
                const isPositive = pnl >= 0;

                return (
                  <div key={holding.ticker} className="p-4 hover:bg-zinc-800/50 transition-colors group">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className="flex items-center space-x-2">
                          <h3 className="font-bold text-white">{holding.ticker}</h3>
                          <button 
                            onClick={() => removeHolding(holding.ticker)}
                            className="opacity-0 group-hover:opacity-100 text-zinc-500 hover:text-red-400 transition-all"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                        <p className="text-xs text-zinc-500">{holding.shares} shares</p>
                      </div>
                      <div className="text-right">
                        <p className="font-mono text-white">₹{holding.currentPrice.toFixed(2)}</p>
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
