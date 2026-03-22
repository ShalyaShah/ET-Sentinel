import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'motion/react';
import { TrendingUp, Calendar, ArrowDownCircle, Target, Zap, Info, ShieldCheck, BarChart3 } from 'lucide-react';
import { useChatContext } from '../context/ChatContext';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine } from 'recharts';

interface YieldAsset {
  id: string;
  ticker: string;
  name: string;
  type: 'Stock' | 'InvIT' | 'REIT';
  currentPrice: number;
  dividendYield: number;
  expectedExDate: string;
  daysToExDate: number;
  technicalStatus: string;
  supportLevel: number;
  confluenceScore: number;
  optimalEntryZone: string;
  description: string;
}

const YIELD_ASSETS: YieldAsset[] = [
  {
    id: '1',
    ticker: 'POWERGRID',
    name: 'Power Grid Corporation',
    type: 'Stock',
    currentPrice: 275.40,
    dividendYield: 4.8,
    expectedExDate: '2026-05-15',
    daysToExDate: 54,
    technicalStatus: 'Testing 200-DMA Support',
    supportLevel: 272.50,
    confluenceScore: 92,
    optimalEntryZone: '270 - 275',
    description: 'Historical data shows consistent dividend declarations in May. Currently testing major long-term support, offering a high-probability bounce setup combined with upcoming yield.'
  },
  {
    id: '2',
    ticker: 'SHREMINVIT',
    name: 'Shrem InvIT',
    type: 'InvIT',
    currentPrice: 112.80,
    dividendYield: 8.5,
    expectedExDate: '2026-04-10',
    daysToExDate: 19,
    technicalStatus: 'Oversold RSI (28)',
    supportLevel: 110.00,
    confluenceScore: 88,
    optimalEntryZone: '110 - 113',
    description: 'High-yield infrastructure trust approaching its quarterly distribution. Technicals indicate an oversold condition at a historical demand zone.'
  },
  {
    id: '3',
    ticker: 'COALINDIA',
    name: 'Coal India Ltd',
    type: 'Stock',
    currentPrice: 430.20,
    dividendYield: 5.9,
    expectedExDate: '2026-06-05',
    daysToExDate: 75,
    technicalStatus: 'Consolidating at 50-DMA',
    supportLevel: 425.00,
    confluenceScore: 76,
    optimalEntryZone: '420 - 430',
    description: 'Strong cash generator with a history of hefty final dividends. Price is compressing near the 50-day moving average, suggesting an impending breakout.'
  },
  {
    id: '4',
    ticker: 'IRBINVIT',
    name: 'IRB InvIT Fund',
    type: 'InvIT',
    currentPrice: 71.50,
    dividendYield: 9.2,
    expectedExDate: '2026-04-25',
    daysToExDate: 34,
    technicalStatus: 'Double Bottom Formation',
    supportLevel: 69.80,
    confluenceScore: 85,
    optimalEntryZone: '70 - 72',
    description: 'Forming a classic double bottom reversal pattern just weeks ahead of its expected payout. Excellent risk-reward ratio for yield seekers.'
  }
];

export function YieldDashboard() {
  const { setContextString } = useChatContext();
  const [selectedAsset, setSelectedAsset] = useState<YieldAsset | null>(null);

  useEffect(() => {
    setContextString('User is viewing the Yield & Dividend Dashboard (Confluence Engine), looking at high-yield assets testing technical support levels.');
  }, [setContextString]);

  // Generate mock historical data for the selected asset
  const chartData = useMemo(() => {
    if (!selectedAsset) return [];
    const data = [];
    let currentPrice = selectedAsset.currentPrice * 1.15; // Start 15% higher 30 days ago
    const volatility = selectedAsset.currentPrice * 0.02;

    for (let i = 30; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      // Trend downwards towards current price
      if (i > 0) {
        currentPrice = currentPrice - (currentPrice - selectedAsset.currentPrice) / i + (Math.random() - 0.5) * volatility;
      } else {
        currentPrice = selectedAsset.currentPrice;
      }

      data.push({
        date: date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }),
        price: Number(currentPrice.toFixed(2)),
      });
    }
    return data;
  }, [selectedAsset]);

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <div className="p-2 bg-emerald-500/20 rounded-lg">
              <Zap className="w-6 h-6 text-emerald-500" />
            </div>
            <h1 className="text-3xl font-bold text-white tracking-tight">Confluence Engine</h1>
          </div>
          <p className="text-zinc-400 max-w-2xl">
            Systematically compound returns by capturing both capital appreciation from technical support bounces and upcoming dividend yields.
          </p>
        </div>
        <div className="flex items-center space-x-4 bg-zinc-900/50 p-4 rounded-xl border border-zinc-800">
          <div className="text-center px-4 border-r border-zinc-800">
            <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Active Setups</p>
            <p className="text-2xl font-bold text-emerald-500">{YIELD_ASSETS.length}</p>
          </div>
          <div className="text-center px-4">
            <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Avg Yield</p>
            <p className="text-2xl font-bold text-blue-500">
              {(YIELD_ASSETS.reduce((acc, curr) => acc + curr.dividendYield, 0) / YIELD_ASSETS.length).toFixed(1)}%
            </p>
          </div>
        </div>
      </div>

      {/* Asset Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {YIELD_ASSETS.map((asset, index) => (
          <motion.div
            key={asset.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 hover:border-emerald-500/30 transition-all cursor-pointer group relative overflow-hidden"
            onClick={() => setSelectedAsset(asset)}
          >
            {/* Confluence Score Badge */}
            <div className="absolute top-0 right-0 bg-emerald-500/10 border-b border-l border-emerald-500/20 px-4 py-2 rounded-bl-2xl flex items-center space-x-2">
              <Target className="w-4 h-4 text-emerald-500" />
              <span className="text-sm font-bold text-emerald-500">{asset.confluenceScore}/100</span>
            </div>

            <div className="flex justify-between items-start mb-6">
              <div>
                <div className="flex items-center space-x-3 mb-1">
                  <h3 className="text-xl font-bold text-white">{asset.ticker}</h3>
                  <span className="px-2 py-0.5 text-xs font-medium bg-zinc-800 text-zinc-300 rounded-md">
                    {asset.type}
                  </span>
                </div>
                <p className="text-sm text-zinc-400">{asset.name}</p>
              </div>
              <div className="text-right mt-1 mr-16">
                <p className="text-2xl font-bold text-white">₹{asset.currentPrice.toFixed(2)}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-zinc-950/50 p-4 rounded-xl border border-zinc-800/50">
                <div className="flex items-center space-x-2 text-zinc-400 mb-2">
                  <TrendingUp className="w-4 h-4 text-blue-500" />
                  <span className="text-xs uppercase tracking-wider font-semibold">Dividend Yield</span>
                </div>
                <p className="text-xl font-bold text-blue-400">{asset.dividendYield}%</p>
              </div>
              <div className="bg-zinc-950/50 p-4 rounded-xl border border-zinc-800/50">
                <div className="flex items-center space-x-2 text-zinc-400 mb-2">
                  <Calendar className="w-4 h-4 text-amber-500" />
                  <span className="text-xs uppercase tracking-wider font-semibold">Expected Ex-Date</span>
                </div>
                <p className="text-sm font-bold text-white">{new Date(asset.expectedExDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                <p className="text-xs text-amber-500 mt-1">In {asset.daysToExDate} days</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-zinc-400">Technical Status</span>
                  <span className="text-sm font-medium text-emerald-400">{asset.technicalStatus}</span>
                </div>
                <div className="w-full bg-zinc-800 rounded-full h-1.5">
                  <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: `${asset.confluenceScore}%` }}></div>
                </div>
              </div>

              <div className="flex items-start space-x-3 bg-emerald-500/5 p-4 rounded-xl border border-emerald-500/10">
                <ShieldCheck className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-white mb-1">Optimal Entry: ₹{asset.optimalEntryZone}</p>
                  <p className="text-xs text-zinc-400 leading-relaxed">{asset.description}</p>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Detail Modal (Simplified for now) */}
      {selectedAsset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 max-w-2xl w-full shadow-2xl"
          >
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-bold text-white mb-1">{selectedAsset.ticker} Analysis</h2>
                <p className="text-zinc-400">Confluence Engine Detailed View</p>
              </div>
              <button
                onClick={() => setSelectedAsset(null)}
                className="text-zinc-500 hover:text-white transition-colors"
              >
                Close
              </button>
            </div>
            
            <div className="aspect-video bg-zinc-950 rounded-xl border border-zinc-800 flex items-center justify-center mb-6 relative overflow-hidden p-4">
               <ResponsiveContainer width="100%" height="100%">
                 <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                   <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                   <XAxis 
                     dataKey="date" 
                     stroke="#52525b" 
                     fontSize={12} 
                     tickLine={false}
                     axisLine={false}
                     minTickGap={30}
                   />
                   <YAxis 
                     stroke="#52525b" 
                     fontSize={12} 
                     tickLine={false}
                     axisLine={false}
                     domain={['auto', 'auto']}
                     tickFormatter={(value) => `₹${value}`}
                   />
                   <Tooltip 
                     contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '0.5rem', color: '#f4f4f5' }}
                     itemStyle={{ color: '#10b981' }}
                     formatter={(value: number) => [`₹${value.toFixed(2)}`, 'Price']}
                   />
                   <ReferenceLine 
                     y={selectedAsset.supportLevel} 
                     stroke="#10b981" 
                     strokeDasharray="3 3" 
                     label={{ position: 'insideBottomRight', value: 'Support', fill: '#10b981', fontSize: 12 }} 
                   />
                   <Line 
                     type="monotone" 
                     dataKey="price" 
                     stroke="#3b82f6" 
                     strokeWidth={2} 
                     dot={false} 
                     activeDot={{ r: 6, fill: '#3b82f6', stroke: '#18181b', strokeWidth: 2 }} 
                   />
                 </LineChart>
               </ResponsiveContainer>
            </div>

            <div className="flex justify-end space-x-4">
              <button className="px-4 py-2 rounded-lg font-medium text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors">
                Set Alert
              </button>
              <button className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-medium transition-colors">
                Execute Trade
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
