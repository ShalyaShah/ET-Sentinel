import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Radio, Building2, AlertTriangle, Skull, TrendingDown, TrendingUp, MessageCircle, Activity } from 'lucide-react';
import { useChatContext } from '../context/ChatContext';

interface DivergenceData {
  id: string;
  ticker: string;
  companyName: string;
  retailSentiment: number; // 0-100
  smartMoneyFlow: number; // 0-100
  retailTrend: 'Surging' | 'Fading' | 'Stable';
  smartMoneyAction: 'Heavy Distribution' | 'Mild Distribution' | 'Accumulation' | 'Neutral';
  alertLevel: 'Critical Trap' | 'High Risk' | 'Smart Accumulation' | 'Neutral';
  description: string;
  socialMentions: string;
  blockDealVolume: string;
}

const MOCK_DATA: DivergenceData[] = [
  {
    id: '1',
    ticker: 'IREDA',
    companyName: 'Indian Renewable Energy Dev',
    retailSentiment: 96,
    smartMoneyFlow: 12,
    retailTrend: 'Surging',
    smartMoneyAction: 'Heavy Distribution',
    alertLevel: 'Critical Trap',
    description: 'Extreme retail FOMO detected across Twitter and Telegram. Meanwhile, DIIs and Promoters are aggressively offloading via block deals. High probability of retail becoming exit liquidity.',
    socialMentions: '+450% in 48h',
    blockDealVolume: '₹450Cr Sell'
  },
  {
    id: '2',
    ticker: 'SUZLON',
    companyName: 'Suzlon Energy',
    retailSentiment: 88,
    smartMoneyFlow: 25,
    retailTrend: 'Surging',
    smartMoneyAction: 'Mild Distribution',
    alertLevel: 'High Risk',
    description: 'YouTube finfluencers are pushing aggressive targets, driving retail volume. Institutional flow shows consistent, quiet distribution at these levels.',
    socialMentions: '+210% in 24h',
    blockDealVolume: '₹120Cr Sell'
  },
  {
    id: '3',
    ticker: 'HDFCBANK',
    companyName: 'HDFC Bank',
    retailSentiment: 22,
    smartMoneyFlow: 85,
    retailTrend: 'Fading',
    smartMoneyAction: 'Accumulation',
    alertLevel: 'Smart Accumulation',
    description: 'Retail sentiment is extremely bearish following recent earnings miss. However, FIIs are quietly accumulating massive quantities at key support levels.',
    socialMentions: '-40% in 7d',
    blockDealVolume: '₹1,200Cr Buy'
  },
  {
    id: '4',
    ticker: 'ZOMATO',
    companyName: 'Zomato Ltd',
    retailSentiment: 65,
    smartMoneyFlow: 60,
    retailTrend: 'Stable',
    smartMoneyAction: 'Neutral',
    alertLevel: 'Neutral',
    description: 'Retail and institutional flows are relatively aligned. No major divergence detected.',
    socialMentions: 'Stable',
    blockDealVolume: 'Balanced'
  }
];

export function RetailTrapRadar() {
  const { setContextString } = useChatContext();

  useEffect(() => {
    setContextString('User is viewing the Retail Trap Radar, analyzing the divergence between retail social media FOMO and institutional Smart Money action.');
  }, [setContextString]);

  const getAlertStyles = (level: string) => {
    switch (level) {
      case 'Critical Trap': return 'bg-red-500/10 text-red-500 border-red-500/20';
      case 'High Risk': return 'bg-orange-500/10 text-orange-500 border-orange-500/20';
      case 'Smart Accumulation': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
      default: return 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20';
    }
  };

  const getAlertIcon = (level: string) => {
    switch (level) {
      case 'Critical Trap': return <Skull className="w-4 h-4 mr-1.5" />;
      case 'High Risk': return <AlertTriangle className="w-4 h-4 mr-1.5" />;
      case 'Smart Accumulation': return <TrendingUp className="w-4 h-4 mr-1.5" />;
      default: return <Activity className="w-4 h-4 mr-1.5" />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <div className="p-2 bg-purple-500/20 rounded-lg">
              <Radio className="w-6 h-6 text-purple-500" />
            </div>
            <h1 className="text-3xl font-bold text-white tracking-tight">Retail Trap Radar</h1>
          </div>
          <p className="text-zinc-400 max-w-2xl">
            Measures the divergence between "Retail Noise" (Twitter, YouTube, Telegram) and "Smart Money Action" (NSE block deals). Don't become exit liquidity.
          </p>
        </div>
        <div className="flex items-center space-x-4 bg-zinc-900/50 p-4 rounded-xl border border-zinc-800">
          <div className="text-center px-4 border-r border-zinc-800">
            <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Traps Detected</p>
            <p className="text-2xl font-bold text-red-500">2</p>
          </div>
          <div className="text-center px-4">
            <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Social Scrapes</p>
            <p className="text-2xl font-bold text-purple-500">142k</p>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {MOCK_DATA.map((data, index) => (
          <motion.div
            key={data.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`bg-zinc-900 border rounded-2xl overflow-hidden transition-all ${
              data.alertLevel === 'Critical Trap' ? 'border-red-500/30 shadow-[0_0_15px_rgba(239,68,68,0.1)]' : 
              data.alertLevel === 'Smart Accumulation' ? 'border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.1)]' : 
              'border-zinc-800'
            }`}
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-white tracking-tight">{data.ticker}</h3>
                  <p className="text-sm text-zinc-400">{data.companyName}</p>
                </div>
                <div className={`px-3 py-1.5 rounded-lg border font-bold text-xs tracking-wide uppercase flex items-center ${getAlertStyles(data.alertLevel)}`}>
                  {getAlertIcon(data.alertLevel)}
                  {data.alertLevel}
                </div>
              </div>

              {/* Divergence Bars */}
              <div className="space-y-5 mb-6">
                {/* Retail Noise */}
                <div>
                  <div className="flex justify-between items-end mb-2">
                    <div className="flex items-center space-x-2">
                      <MessageCircle className="w-4 h-4 text-purple-400" />
                      <span className="text-sm font-medium text-zinc-300">Retail Noise (FOMO)</span>
                    </div>
                    <span className="text-xs text-zinc-500">{data.socialMentions}</span>
                  </div>
                  <div className="w-full bg-zinc-950 rounded-full h-3 border border-zinc-800">
                    <div 
                      className={`h-full rounded-full ${data.retailSentiment > 75 ? 'bg-red-500' : data.retailSentiment > 50 ? 'bg-orange-500' : 'bg-blue-500'}`} 
                      style={{ width: `${data.retailSentiment}%` }}
                    />
                  </div>
                  <div className="flex justify-between mt-1">
                    <span className="text-[10px] text-zinc-500 uppercase">Quiet</span>
                    <span className="text-[10px] text-zinc-500 uppercase">Extreme Hype</span>
                  </div>
                </div>

                {/* Smart Money */}
                <div>
                  <div className="flex justify-between items-end mb-2">
                    <div className="flex items-center space-x-2">
                      <Building2 className="w-4 h-4 text-blue-400" />
                      <span className="text-sm font-medium text-zinc-300">Smart Money Action</span>
                    </div>
                    <span className="text-xs text-zinc-500">{data.blockDealVolume}</span>
                  </div>
                  <div className="w-full bg-zinc-950 rounded-full h-3 border border-zinc-800">
                    <div 
                      className={`h-full rounded-full ${data.smartMoneyFlow > 70 ? 'bg-emerald-500' : data.smartMoneyFlow < 30 ? 'bg-red-500' : 'bg-blue-500'}`} 
                      style={{ width: `${data.smartMoneyFlow}%` }}
                    />
                  </div>
                  <div className="flex justify-between mt-1">
                    <span className="text-[10px] text-zinc-500 uppercase">Distribution (Selling)</span>
                    <span className="text-[10px] text-zinc-500 uppercase">Accumulation (Buying)</span>
                  </div>
                </div>
              </div>

              {/* Analysis Box */}
              <div className={`p-4 rounded-xl border ${
                data.alertLevel === 'Critical Trap' ? 'bg-red-500/5 border-red-500/10' : 
                data.alertLevel === 'Smart Accumulation' ? 'bg-emerald-500/5 border-emerald-500/10' : 
                'bg-zinc-950/50 border-zinc-800/50'
              }`}>
                <p className="text-sm text-zinc-300 leading-relaxed">
                  {data.description}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
