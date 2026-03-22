import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { TestTube, Plus, X, Play, BarChart2, TrendingUp, TrendingDown, Percent, Activity, Database, ArrowRight } from 'lucide-react';
import { useChatContext } from '../context/ChatContext';

type Category = 'Technical' | 'Fundamental' | 'Shareholding';

interface MetricOption {
  id: string;
  label: string;
  category: Category;
  type: 'number' | 'percentage';
}

const METRICS: MetricOption[] = [
  { id: 'rsi_14', label: 'RSI (14)', category: 'Technical', type: 'number' },
  { id: 'macd', label: 'MACD Crossover', category: 'Technical', type: 'number' },
  { id: 'sma_200', label: 'Price vs 200 SMA', category: 'Technical', type: 'percentage' },
  { id: 'q_profit_growth', label: 'Quarterly Profit Growth', category: 'Fundamental', type: 'percentage' },
  { id: 'pe_ratio', label: 'P/E Ratio', category: 'Fundamental', type: 'number' },
  { id: 'debt_equity', label: 'Debt to Equity', category: 'Fundamental', type: 'number' },
  { id: 'promoter_buying', label: 'Promoter Buying', category: 'Shareholding', type: 'percentage' },
  { id: 'fii_flow', label: 'FII Accumulation', category: 'Shareholding', type: 'percentage' },
];

interface Rule {
  id: string;
  metricId: string;
  operator: '>' | '<' | '==';
  value: string;
}

interface BacktestResult {
  winRate: number;
  alphaScore: number;
  totalReturn: number;
  maxDrawdown: number;
  tradesExecuted: number;
  avgHoldingPeriod: string;
}

export function QuantTerminal() {
  const { setContextString } = useChatContext();
  const [rules, setRules] = useState<Rule[]>([
    { id: '1', metricId: 'rsi_14', operator: '<', value: '30' },
    { id: '2', metricId: 'promoter_buying', operator: '>', value: '1' },
    { id: '3', metricId: 'q_profit_growth', operator: '>', value: '15' }
  ]);
  const [universe, setUniverse] = useState('NIFTY_500');
  const [isCrunching, setIsCrunching] = useState(false);
  const [result, setResult] = useState<BacktestResult | null>(null);

  useEffect(() => {
    setContextString('User is viewing the Quant Terminal, a no-code visual builder to create custom backtests combining fundamental and technical variables.');
  }, [setContextString]);

  const addRule = () => {
    const newRule: Rule = {
      id: Math.random().toString(36).substring(2, 9),
      metricId: METRICS[0].id,
      operator: '>',
      value: ''
    };
    setRules([...rules, newRule]);
    setResult(null);
  };

  const removeRule = (id: string) => {
    setRules(rules.filter(r => r.id !== id));
    setResult(null);
  };

  const updateRule = (id: string, field: keyof Rule, value: string) => {
    setRules(rules.map(r => r.id === id ? { ...r, [field]: value } : r));
    setResult(null);
  };

  const runBacktest = () => {
    if (rules.length === 0) return;
    
    setIsCrunching(true);
    setResult(null);

    // Simulate Python backend crunching historical data
    setTimeout(() => {
      setIsCrunching(false);
      setResult({
        winRate: 68.4,
        alphaScore: 8.2,
        totalReturn: 142.5,
        maxDrawdown: -14.2,
        tradesExecuted: 124,
        avgHoldingPeriod: '18 Days'
      });
    }, 2500);
  };

  const getMetricCategory = (metricId: string) => {
    return METRICS.find(m => m.id === metricId)?.category || 'Technical';
  };

  const getCategoryColor = (category: Category) => {
    switch (category) {
      case 'Technical': return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
      case 'Fundamental': return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20';
      case 'Shareholding': return 'text-purple-400 bg-purple-400/10 border-purple-400/20';
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <div className="p-2 bg-indigo-500/20 rounded-lg">
              <TestTube className="w-6 h-6 text-indigo-500" />
            </div>
            <h1 className="text-3xl font-bold text-white tracking-tight">Quant Terminal</h1>
          </div>
          <p className="text-zinc-400 max-w-2xl">
            No-code visual backtest builder. Combine fundamental and technical variables to discover your own predictive alpha.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Builder Panel */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-white flex items-center">
                <Database className="w-5 h-5 mr-2 text-zinc-400" />
                Strategy Builder
              </h2>
              <select 
                value={universe}
                onChange={(e) => { setUniverse(e.target.value); setResult(null); }}
                className="bg-zinc-950 border border-zinc-800 text-white text-sm rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="NIFTY_50">Nifty 50</option>
                <option value="NIFTY_500">Nifty 500</option>
                <option value="MIDCAP_150">Midcap 150</option>
                <option value="SMALLCAP_250">Smallcap 250</option>
              </select>
            </div>

            <div className="space-y-4">
              <AnimatePresence>
                {rules.map((rule, index) => {
                  const category = getMetricCategory(rule.metricId);
                  return (
                    <motion.div
                      key={rule.id}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="flex items-center space-x-3"
                    >
                      {index > 0 && (
                        <div className="w-12 text-center text-xs font-bold text-zinc-500 uppercase tracking-wider">
                          AND
                        </div>
                      )}
                      {index === 0 && <div className="w-12 text-center text-xs font-bold text-indigo-500 uppercase tracking-wider">IF</div>}
                      
                      <div className="flex-1 flex flex-col sm:flex-row items-center gap-3 bg-zinc-950 border border-zinc-800 rounded-xl p-2 relative group">
                        <div className={`hidden sm:flex px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider border ${getCategoryColor(category)}`}>
                          {category}
                        </div>
                        
                        <select
                          value={rule.metricId}
                          onChange={(e) => updateRule(rule.id, 'metricId', e.target.value)}
                          className="flex-1 bg-transparent text-white text-sm focus:outline-none"
                        >
                          {METRICS.map(m => (
                            <option key={m.id} value={m.id} className="bg-zinc-900">{m.label}</option>
                          ))}
                        </select>

                        <select
                          value={rule.operator}
                          onChange={(e) => updateRule(rule.id, 'operator', e.target.value)}
                          className="w-16 bg-zinc-900 border border-zinc-700 text-white text-sm rounded-lg px-2 py-1.5 focus:outline-none"
                        >
                          <option value=">">&gt;</option>
                          <option value="<">&lt;</option>
                          <option value="==">=</option>
                        </select>

                        <input
                          type="number"
                          value={rule.value}
                          onChange={(e) => updateRule(rule.id, 'value', e.target.value)}
                          placeholder="Value"
                          className="w-24 bg-zinc-900 border border-zinc-700 text-white text-sm rounded-lg px-3 py-1.5 focus:outline-none focus:border-indigo-500"
                        />

                        <button
                          onClick={() => removeRule(rule.id)}
                          className="p-1.5 text-zinc-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100 absolute -right-10"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>

              <button
                onClick={addRule}
                className="ml-15 flex items-center space-x-2 text-sm text-indigo-400 hover:text-indigo-300 transition-colors py-2"
              >
                <Plus className="w-4 h-4" />
                <span>Add Condition</span>
              </button>
            </div>

            <div className="mt-8 pt-6 border-t border-zinc-800 flex justify-end">
              <button
                onClick={runBacktest}
                disabled={isCrunching || rules.length === 0}
                className="bg-indigo-500 hover:bg-indigo-600 disabled:bg-indigo-500/50 text-white px-8 py-3 rounded-xl font-bold transition-colors flex items-center shadow-[0_0_20px_rgba(99,102,241,0.3)]"
              >
                {isCrunching ? (
                  <>
                    <Activity className="w-5 h-5 mr-2 animate-spin" />
                    Crunching Data...
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5 mr-2" />
                    Run Backtest
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-1">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 h-full flex flex-col">
            <h2 className="text-lg font-bold text-white flex items-center mb-6">
              <BarChart2 className="w-5 h-5 mr-2 text-zinc-400" />
              Backtest Results
            </h2>

            {!result && !isCrunching && (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-6">
                <TestTube className="w-12 h-12 text-zinc-700 mb-4" />
                <p className="text-zinc-400 text-sm">
                  Configure your strategy parameters and run the backtest to see historical performance across the {universe.replace('_', ' ')} universe.
                </p>
              </div>
            )}

            {isCrunching && (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-6">
                <div className="relative w-16 h-16 mb-6">
                  <div className="absolute inset-0 border-4 border-indigo-500/20 rounded-full"></div>
                  <div className="absolute inset-0 border-4 border-indigo-500 rounded-full border-t-transparent animate-spin"></div>
                  <Activity className="absolute inset-0 m-auto w-6 h-6 text-indigo-500 animate-pulse" />
                </div>
                <p className="text-white font-medium mb-1">Analyzing Historical Data</p>
                <p className="text-zinc-500 text-sm">Processing 10+ years of market data...</p>
              </div>
            )}

            {result && !isCrunching && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex-1 flex flex-col space-y-6"
              >
                {/* Alpha Score Hero */}
                <div className="bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 rounded-xl p-6 text-center relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-3 opacity-10">
                    <TrendingUp className="w-24 h-24" />
                  </div>
                  <p className="text-sm text-indigo-300 font-bold uppercase tracking-wider mb-2 relative z-10">Predictive Alpha Score</p>
                  <div className="flex items-baseline justify-center space-x-1 relative z-10">
                    <span className="text-5xl font-black text-white">{result.alphaScore}</span>
                    <span className="text-xl text-indigo-400">/10</span>
                  </div>
                  <p className="text-xs text-zinc-400 mt-3 relative z-10">High probability of outperforming the benchmark.</p>
                </div>

                {/* Key Metrics Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Percent className="w-4 h-4 text-emerald-500" />
                      <p className="text-xs text-zinc-500 uppercase tracking-wider font-bold">Win Rate</p>
                    </div>
                    <p className="text-2xl font-bold text-white">{result.winRate}%</p>
                  </div>
                  
                  <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <TrendingUp className="w-4 h-4 text-emerald-500" />
                      <p className="text-xs text-zinc-500 uppercase tracking-wider font-bold">Total Return</p>
                    </div>
                    <p className="text-2xl font-bold text-emerald-400">+{result.totalReturn}%</p>
                  </div>

                  <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <TrendingDown className="w-4 h-4 text-red-500" />
                      <p className="text-xs text-zinc-500 uppercase tracking-wider font-bold">Max Drawdown</p>
                    </div>
                    <p className="text-2xl font-bold text-red-400">{result.maxDrawdown}%</p>
                  </div>

                  <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Activity className="w-4 h-4 text-blue-500" />
                      <p className="text-xs text-zinc-500 uppercase tracking-wider font-bold">Trades</p>
                    </div>
                    <p className="text-2xl font-bold text-white">{result.tradesExecuted}</p>
                  </div>
                </div>

                <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 flex justify-between items-center">
                  <span className="text-sm text-zinc-400">Avg. Holding Period</span>
                  <span className="font-bold text-white">{result.avgHoldingPeriod}</span>
                </div>

                <button className="w-full bg-zinc-800 hover:bg-zinc-700 text-white py-3 rounded-xl font-medium transition-colors flex items-center justify-center">
                  Save Strategy <ArrowRight className="w-4 h-4 ml-2" />
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
