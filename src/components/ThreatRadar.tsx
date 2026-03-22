import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ShieldAlert, AlertOctagon, FileText, TrendingDown, UserX, EyeOff, AlertTriangle, Search } from 'lucide-react';
import { useChatContext } from '../context/ChatContext';

interface ThreatAlert {
  id: string;
  ticker: string;
  companyName: string;
  date: string;
  shinyNews: string;
  redFlags: string[];
  riskLevel: 'Critical' | 'High' | 'Elevated';
  action: string;
  flagTypes: ('Auditor' | 'Management' | 'Debt' | 'Pledging' | 'Regulatory')[];
}

const MOCK_THREATS: ThreatAlert[] = [
  {
    id: '1',
    ticker: 'BRIGHTCOM',
    companyName: 'Brightcom Group',
    date: '2 Hours Ago',
    shinyNews: 'Announced massive acquisition of a European digital ad firm to expand global footprint.',
    redFlags: [
      'Sudden resignation of statutory auditor citing "lack of information" on related-party transactions.',
      'Opaque related-party transactions flagged in fine-print footnotes.'
    ],
    riskLevel: 'Critical',
    action: 'High-Risk Threat Alert - Avoid',
    flagTypes: ['Auditor', 'Regulatory']
  },
  {
    id: '2',
    ticker: 'VAKRANGEE',
    companyName: 'Vakrangee Ltd',
    date: '5 Hours Ago',
    shinyNews: 'Reported 200% YoY profit growth in Q3 and announced a new rural expansion strategy.',
    redFlags: [
      'Unexplained spike in insider promoter pledging (from 10% to 45% in one quarter).',
      'Delayed debt repayments to primary lenders buried in cash flow statements.'
    ],
    riskLevel: 'Critical',
    action: 'High-Risk Threat Alert - Liquidate',
    flagTypes: ['Pledging', 'Debt']
  },
  {
    id: '3',
    ticker: 'PAYTM',
    companyName: 'One97 Communications',
    date: '1 Day Ago',
    shinyNews: 'Launched new AI-powered lending product with major PR campaign.',
    redFlags: [
      'Regulatory filings reveal severe RBI warnings regarding KYC compliance.',
      'Opaque fund transfers between parent entity and banking arm.'
    ],
    riskLevel: 'High',
    action: 'Threat Alert - Monitor Closely',
    flagTypes: ['Regulatory', 'Management']
  },
  {
    id: '4',
    ticker: 'ZEEENT',
    companyName: 'Zee Entertainment',
    date: '2 Days Ago',
    shinyNews: 'Announced blockbuster content slate and potential merger synergies.',
    redFlags: [
      'Abrupt CFO resignation without a clear succession plan.',
      'Auditor remarks highlighting discrepancies in inventory valuation.'
    ],
    riskLevel: 'High',
    action: 'Threat Alert - Reduce Exposure',
    flagTypes: ['Management', 'Auditor']
  }
];

export function ThreatRadar() {
  const { setContextString } = useChatContext();
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    setContextString('User is viewing the Threat Radar (Red Flag Scanner), looking at hidden risks in regulatory filings like auditor resignations, promoter pledging, and related-party transactions.');
  }, [setContextString]);

  const filteredThreats = MOCK_THREATS.filter(threat => 
    threat.ticker.toLowerCase().includes(searchTerm.toLowerCase()) || 
    threat.companyName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'Critical': return 'text-red-500 bg-red-500/10 border-red-500/20';
      case 'High': return 'text-orange-500 bg-orange-500/10 border-orange-500/20';
      case 'Elevated': return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
      default: return 'text-zinc-500 bg-zinc-500/10 border-zinc-500/20';
    }
  };

  const getFlagIcon = (type: string) => {
    switch (type) {
      case 'Auditor': return <FileText className="w-4 h-4" />;
      case 'Management': return <UserX className="w-4 h-4" />;
      case 'Debt': return <TrendingDown className="w-4 h-4" />;
      case 'Pledging': return <EyeOff className="w-4 h-4" />;
      case 'Regulatory': return <AlertTriangle className="w-4 h-4" />;
      default: return <ShieldAlert className="w-4 h-4" />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <div className="p-2 bg-red-500/20 rounded-lg">
              <ShieldAlert className="w-6 h-6 text-red-500" />
            </div>
            <h1 className="text-3xl font-bold text-white tracking-tight">Threat Radar</h1>
          </div>
          <p className="text-zinc-400 max-w-2xl">
            NLP engine scanning fine-print regulatory filings for auditor remarks, sudden resignations, opaque related-party transactions, and insider pledging.
          </p>
        </div>
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input
            type="text"
            placeholder="Search ticker..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-2 pl-10 pr-4 text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
          <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Filings Scanned (24h)</p>
          <p className="text-2xl font-bold text-white">1,248</p>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
          <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Critical Threats</p>
          <p className="text-2xl font-bold text-red-500">12</p>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
          <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Auditor Resignations</p>
          <p className="text-2xl font-bold text-orange-500">3</p>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
          <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Pledging Spikes</p>
          <p className="text-2xl font-bold text-amber-500">7</p>
        </div>
      </div>

      {/* Threat List */}
      <div className="space-y-6">
        {filteredThreats.map((threat, index) => (
          <motion.div
            key={threat.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden"
          >
            {/* Threat Header */}
            <div className="p-6 border-b border-zinc-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-full bg-zinc-950 border border-zinc-800 flex items-center justify-center shrink-0">
                  <AlertOctagon className={`w-6 h-6 ${threat.riskLevel === 'Critical' ? 'text-red-500' : 'text-orange-500'}`} />
                </div>
                <div>
                  <div className="flex items-center space-x-3">
                    <h3 className="text-xl font-bold text-white">{threat.ticker}</h3>
                    <span className="text-sm text-zinc-400">{threat.companyName}</span>
                  </div>
                  <div className="flex items-center space-x-3 mt-1">
                    <span className="text-xs text-zinc-500">{threat.date}</span>
                    <div className="flex items-center space-x-1">
                      {threat.flagTypes.map(type => (
                        <span key={type} className="flex items-center space-x-1 px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 text-[10px] uppercase tracking-wider font-medium">
                          {getFlagIcon(type)}
                          <span>{type}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div className={`px-4 py-2 rounded-xl border font-bold text-sm tracking-wide uppercase flex items-center space-x-2 ${getRiskColor(threat.riskLevel)}`}>
                <ShieldAlert className="w-4 h-4" />
                <span>{threat.action}</span>
              </div>
            </div>

            {/* Threat Content */}
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* The Distraction */}
              <div className="bg-zinc-950/50 rounded-xl p-5 border border-zinc-800/50 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
                <p className="text-xs text-blue-400 uppercase tracking-wider font-bold mb-2">The Distraction (Shiny News)</p>
                <p className="text-zinc-300 text-sm leading-relaxed">{threat.shinyNews}</p>
              </div>

              {/* The Reality */}
              <div className="bg-red-500/5 rounded-xl p-5 border border-red-500/10 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-red-500"></div>
                <p className="text-xs text-red-400 uppercase tracking-wider font-bold mb-2 flex items-center">
                  <AlertTriangle className="w-3 h-3 mr-1" />
                  The Reality (Hidden Red Flags)
                </p>
                <ul className="space-y-3">
                  {threat.redFlags.map((flag, i) => (
                    <li key={i} className="text-zinc-300 text-sm leading-relaxed flex items-start">
                      <span className="text-red-500 mr-2 mt-0.5">•</span>
                      {flag}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        ))}

        {filteredThreats.length === 0 && (
          <div className="text-center py-12">
            <ShieldAlert className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">No threats found</h3>
            <p className="text-zinc-400">No active threats match your search criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
}
