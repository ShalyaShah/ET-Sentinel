import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Users, AlertTriangle, PieChart, TrendingUp, Shield, Plus, ArrowRight, Lightbulb } from 'lucide-react';
import { useChatContext } from '../context/ChatContext';
import { ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell, Tooltip as RechartsTooltip, Legend } from 'recharts';

interface Account {
  id: string;
  name: string;
  owner: string;
  totalValue: number;
  holdings: { ticker: string; sector: string; value: number; allocation: number }[];
}

const MOCK_ACCOUNTS: Account[] = [
  {
    id: 'acc1',
    name: 'Primary Demat (Zerodha)',
    owner: 'Self',
    totalValue: 1250000,
    holdings: [
      { ticker: 'HDFCBANK', sector: 'Financials', value: 450000, allocation: 36 },
      { ticker: 'RELIANCE', sector: 'Energy', value: 300000, allocation: 24 },
      { ticker: 'TCS', sector: 'IT', value: 250000, allocation: 20 },
      { ticker: 'ITC', sector: 'FMCG', value: 250000, allocation: 20 },
    ]
  },
  {
    id: 'acc2',
    name: 'Mother\'s Demat (Upstox)',
    owner: 'Mother',
    totalValue: 850000,
    holdings: [
      { ticker: 'ICICIBANK', sector: 'Financials', value: 350000, allocation: 41.1 },
      { ticker: 'SBIN', sector: 'Financials', value: 200000, allocation: 23.5 },
      { ticker: 'INFY', sector: 'IT', value: 150000, allocation: 17.6 },
      { ticker: 'LART', sector: 'Capital Goods', value: 150000, allocation: 17.6 },
    ]
  }
];

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

export function FamilyPod() {
  const { setContextString } = useChatContext();
  const [accounts] = useState<Account[]>(MOCK_ACCOUNTS);

  useEffect(() => {
    setContextString('User is viewing the Family Pod dashboard, analyzing aggregate exposure across multiple Demat accounts and looking at tax/dividend optimization suggestions.');
  }, [setContextString]);

  const totalFamilyValue = accounts.reduce((acc, account) => acc + account.totalValue, 0);

  // Calculate aggregate sector exposure
  const sectorExposure = accounts.reduce((acc, account) => {
    account.holdings.forEach(holding => {
      if (!acc[holding.sector]) {
        acc[holding.sector] = 0;
      }
      acc[holding.sector] += holding.value;
    });
    return acc;
  }, {} as Record<string, number>);

  const sectorData = Object.keys(sectorExposure).map(sector => ({
    name: sector,
    value: sectorExposure[sector],
    percentage: (sectorExposure[sector] / totalFamilyValue) * 100
  })).sort((a, b) => b.value - a.value);

  const overLeveragedSectors = sectorData.filter(s => s.percentage > 35);

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <Users className="w-6 h-6 text-blue-500" />
            </div>
            <h1 className="text-3xl font-bold text-white tracking-tight">Family Pod</h1>
          </div>
          <p className="text-zinc-400 max-w-2xl">
            Aggregate exposure analysis and smart optimization across linked family Demat accounts.
          </p>
        </div>
        <div className="flex items-center space-x-4 bg-zinc-900/50 p-4 rounded-xl border border-zinc-800">
          <div className="text-center px-4 border-r border-zinc-800">
            <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Total Value</p>
            <p className="text-2xl font-bold text-white">₹{(totalFamilyValue / 100000).toFixed(2)}L</p>
          </div>
          <div className="text-center px-4">
            <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Linked Accounts</p>
            <p className="text-2xl font-bold text-blue-500">{accounts.length}</p>
          </div>
          <button className="ml-2 p-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors">
            <Plus className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>

      {/* Warnings & Suggestions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Risk Warnings */}
        <div className="bg-red-500/5 border border-red-500/20 rounded-2xl p-6">
          <div className="flex items-center space-x-2 mb-4">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            <h3 className="text-lg font-bold text-red-500">Aggregate Risk Warnings</h3>
          </div>
          {overLeveragedSectors.length > 0 ? (
            <div className="space-y-4">
              {overLeveragedSectors.map(sector => (
                <div key={sector.name} className="bg-zinc-950/50 p-4 rounded-xl border border-red-500/10">
                  <p className="text-sm text-white font-medium mb-1">
                    Over-leveraged in <span className="text-red-400">{sector.name}</span>
                  </p>
                  <p className="text-xs text-zinc-400">
                    Combined family exposure is <span className="text-red-400 font-bold">{sector.percentage.toFixed(1)}%</span>. 
                    Both "Primary Demat" and "Mother's Demat" have heavy allocations here. Consider diversifying new capital.
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-emerald-500/10 p-4 rounded-xl border border-emerald-500/20 flex items-center space-x-3">
              <Shield className="w-5 h-5 text-emerald-500" />
              <p className="text-sm text-emerald-500 font-medium">Sector exposure is well-balanced across the family pod.</p>
            </div>
          )}
        </div>

        {/* Smart Suggestions */}
        <div className="bg-blue-500/5 border border-blue-500/20 rounded-2xl p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Lightbulb className="w-5 h-5 text-blue-500" />
            <h3 className="text-lg font-bold text-blue-500">Smart Optimization</h3>
          </div>
          <div className="space-y-4">
            <div className="bg-zinc-950/50 p-4 rounded-xl border border-blue-500/10">
              <p className="text-sm text-white font-medium mb-1">Dividend Reinvestment Strategy</p>
              <p className="text-xs text-zinc-400 mb-3">
                Mother's account is in a lower tax bracket. Route new high-yield dividend purchases (like POWERGRID or InvITs) to her account to minimize tax drag.
              </p>
              <button className="text-xs font-medium text-blue-400 hover:text-blue-300 flex items-center">
                View Tax Impact <ArrowRight className="w-3 h-3 ml-1" />
              </button>
            </div>
            <div className="bg-zinc-950/50 p-4 rounded-xl border border-blue-500/10">
              <p className="text-sm text-white font-medium mb-1">Capital Gains Harvesting</p>
              <p className="text-xs text-zinc-400">
                Primary account has ₹85,000 in unrealized LTCG. You can harvest up to ₹1,00,000 tax-free this financial year before March 31st.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Aggregate Portfolio View */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
          <h3 className="text-lg font-bold text-white mb-6 flex items-center">
            <PieChart className="w-5 h-5 mr-2 text-zinc-400" />
            Combined Sector Allocation
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsPieChart>
                <Pie
                  data={sectorData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {sectorData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip 
                  formatter={(value: number) => `₹${(value / 100000).toFixed(2)}L`}
                  contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '0.5rem', color: '#f4f4f5' }}
                />
              </RechartsPieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-3 mt-4">
            {sectorData.map((sector, index) => (
              <div key={sector.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                  <span className="text-zinc-300">{sector.name}</span>
                </div>
                <span className="font-medium text-white">{sector.percentage.toFixed(1)}%</span>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2 bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
          <h3 className="text-lg font-bold text-white mb-6 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-zinc-400" />
            Linked Accounts Breakdown
          </h3>
          <div className="space-y-6">
            {accounts.map(account => (
              <div key={account.id} className="bg-zinc-950/50 rounded-xl p-5 border border-zinc-800/50">
                <div className="flex justify-between items-center mb-4 pb-4 border-b border-zinc-800/50">
                  <div>
                    <h4 className="text-white font-bold">{account.name}</h4>
                    <p className="text-xs text-zinc-500">Owner: {account.owner}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-white">₹{(account.totalValue / 100000).toFixed(2)}L</p>
                    <p className="text-xs text-zinc-500">{(account.totalValue / totalFamilyValue * 100).toFixed(1)}% of Pod</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {account.holdings.slice(0, 4).map(holding => (
                    <div key={holding.ticker} className="bg-zinc-900 p-3 rounded-lg border border-zinc-800">
                      <p className="text-sm font-bold text-white mb-1">{holding.ticker}</p>
                      <p className="text-xs text-zinc-400 mb-1">{holding.sector}</p>
                      <p className="text-xs font-medium text-emerald-400">₹{(holding.value / 1000).toFixed(0)}k</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
