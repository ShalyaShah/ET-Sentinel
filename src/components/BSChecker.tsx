import React, { useState, useEffect } from 'react';
import { Search, AlertTriangle, CheckCircle, Info, Activity, History, Loader2 } from 'lucide-react';
import { HealthCheckData } from '../types';
import { analyzeStock } from '../services/geminiService';
import { motion } from 'motion/react';

export function BSChecker() {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<HealthCheckData | null>(null);
  const [searched, setSearched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loadingStep, setLoadingStep] = useState(0);

  const loadingMessages = [
    'Connecting to NSE/BSE feeds...',
    'Running NLP Delta Engine on transcripts...',
    'Analyzing Smart Money flows...',
    'Running Technical Backtests...',
    'Synthesizing Confluence...'
  ];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isLoading) {
      interval = setInterval(() => {
        setLoadingStep((prev) => (prev + 1) % loadingMessages.length);
      }, 1500);
    } else {
      setLoadingStep(0);
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    setError(null);
    setSearched(true);
    setResult(null);

    try {
      const data = await analyzeStock(query.toUpperCase().trim());
      setResult(data);
    } catch (err) {
      console.error(err);
      setError("Failed to analyze stock. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-12 px-6">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-white tracking-tight mb-4">Gut-Feel Validator</h1>
        <p className="text-zinc-400 text-lg max-w-xl mx-auto">
          Don't buy blindly. Enter a ticker to instantly check if the fundamentals, liquidity, and technicals actually align.
        </p>
      </div>

      <form onSubmit={handleSearch} className="relative max-w-2xl mx-auto mb-12">
        <div className="relative flex items-center">
          <Search className="absolute left-4 w-6 h-6 text-zinc-500" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g., SUZLON, HDFCBANK"
            className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl py-4 pl-14 pr-6 text-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all shadow-sm"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="absolute right-2 bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-500/50 text-white px-6 py-2 rounded-xl font-medium transition-colors flex items-center"
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Analyze'}
          </button>
        </div>
      </form>

      {searched && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto"
        >
          {isLoading ? (
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-12 text-center">
              <div className="relative w-16 h-16 mx-auto mb-6">
                <div className="absolute inset-0 border-4 border-zinc-800 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-emerald-500 rounded-full border-t-transparent animate-spin"></div>
                <Activity className="absolute inset-0 m-auto w-6 h-6 text-emerald-500 animate-pulse" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Analyzing {query.toUpperCase()}</h3>
              <p className="text-emerald-400 font-mono text-sm animate-pulse">{loadingMessages[loadingStep]}</p>
            </div>
          ) : error ? (
            <div className="bg-zinc-900 border border-red-500/20 rounded-2xl p-12 text-center">
              <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Analysis Failed</h3>
              <p className="text-zinc-400">{error}</p>
            </div>
          ) : result ? (
            <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-white tracking-tight">{result.companyName}</h2>
                  <p className="text-zinc-500 font-mono mt-1">{result.ticker}</p>
                </div>
                <div className={`px-4 py-2 rounded-full font-bold text-sm tracking-wide uppercase ${
                  result.riskLevel === 'High' ? 'bg-red-500/10 text-red-500 border border-red-500/20' :
                  result.riskLevel === 'Medium' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' :
                  'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                }`}>
                  {result.riskLevel} Risk
                </div>
              </div>

              <div className="bg-zinc-950 p-6 rounded-2xl border border-zinc-800/50 mb-8">
                <p className="text-lg text-zinc-300 leading-relaxed font-medium">"{result.summary}"</p>
              </div>

              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className={`p-2 rounded-xl shrink-0 ${result.technicalStatus.includes('Bullish') ? 'bg-emerald-500/10 text-emerald-500' : result.technicalStatus.includes('Bearish') ? 'bg-red-500/10 text-red-500' : 'bg-blue-500/10 text-blue-500'}`}>
                    <Activity className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-1">Technical Engine</h4>
                    <p className="text-zinc-200">{result.technicalStatus}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className={`p-2 rounded-xl shrink-0 ${result.fundamentalStatus.includes('Bullish') ? 'bg-emerald-500/10 text-emerald-500' : result.fundamentalStatus.includes('Weak') ? 'bg-red-500/10 text-red-500' : 'bg-blue-500/10 text-blue-500'}`}>
                    <Info className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-1">NLP Delta Engine</h4>
                    <p className="text-zinc-200">{result.fundamentalStatus}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className={`p-2 rounded-xl shrink-0 ${result.liquidityStatus.includes('Bullish') ? 'bg-emerald-500/10 text-emerald-500' : result.liquidityStatus.includes('Bearish') ? 'bg-red-500/10 text-red-500' : 'bg-blue-500/10 text-blue-500'}`}>
                    <AlertTriangle className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-1">Smart Money Tracker</h4>
                    <p className="text-zinc-200">{result.liquidityStatus}</p>
                  </div>
                </div>
              </div>

              {result.historicalBacktest && (
                <div className="mt-8 pt-6 border-t border-zinc-800">
                  <div className="flex items-center space-x-2 mb-4">
                    <History className="w-5 h-5 text-purple-500" />
                    <h4 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">Historical Backtest</h4>
                  </div>
                  <div className="bg-zinc-950 rounded-xl p-5 border border-zinc-800/50">
                    <div className="mb-4">
                      <p className="text-zinc-300 font-medium">Pattern: <span className="text-white">{result.historicalBacktest.patternName}</span></p>
                      <p className="text-sm text-zinc-500 mt-1 italic">{result.historicalBacktest.patternDescription}</p>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Occurrences</p>
                        <p className="text-xl font-mono text-white">{result.historicalBacktest.occurrences}</p>
                      </div>
                      <div>
                        <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Success Rate</p>
                        <p className={`text-xl font-mono ${result.historicalBacktest.successRate >= 50 ? 'text-emerald-500' : 'text-red-500'}`}>
                          {result.historicalBacktest.successRate}%
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Avg Return</p>
                        <p className={`text-xl font-mono ${result.historicalBacktest.averageReturn.startsWith('+') ? 'text-emerald-500' : 'text-red-500'}`}>
                          {result.historicalBacktest.averageReturn}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Timeframe</p>
                        <p className="text-xl font-mono text-white">{result.historicalBacktest.timeframe}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-8 pt-6 border-t border-zinc-800">
                <h4 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-2">Verdict</h4>
                <p className="text-white font-medium text-lg">{result.recommendation}</p>
              </div>
            </div>
          ) : (
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-12 text-center">
              <Search className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">No data found</h3>
              <p className="text-zinc-400">We couldn't generate an analysis for "{query}". Please check the ticker symbol.</p>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}
