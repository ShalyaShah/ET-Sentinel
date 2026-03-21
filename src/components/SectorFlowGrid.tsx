import React, { useState, useEffect } from 'react';
import { generateSectorFlows } from '../services/geminiService';
import { SectorFlow } from '../types';
import { Loader2, TrendingUp, TrendingDown } from 'lucide-react';

interface SectorFlowGridProps {
  onSectorSelect: (sector: string | null) => void;
  selectedSector: string | null;
}

export function SectorFlowGrid({ onSectorSelect, selectedSector }: SectorFlowGridProps) {
  const [flows, setFlows] = useState<SectorFlow[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchFlows() {
      try {
        const data = await generateSectorFlows();
        setFlows(data);
      } catch (error) {
        console.error("Failed to fetch sector flows:", error);
        // Fallback data if API fails
        setFlows([
          { sector: 'Infrastructure', flowScore: 85, reason: 'Massive block deals, Govt capex push' },
          { sector: 'Energy', flowScore: 60, reason: 'Renewable capacity addition' },
          { sector: 'IT', flowScore: -40, reason: 'Weak global guidance' },
          { sector: 'Banking', flowScore: 20, reason: 'Credit growth steady' },
          { sector: 'Auto', flowScore: -15, reason: 'Rural demand sluggish' },
          { sector: 'Pharma', flowScore: 45, reason: 'US FDA approvals' },
          { sector: 'FMCG', flowScore: -60, reason: 'Margin pressure, inflation' },
          { sector: 'Metals', flowScore: 10, reason: 'China stimulus hopes' },
        ]);
      } finally {
        setIsLoading(false);
      }
    }
    fetchFlows();
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 bg-zinc-900/50 rounded-2xl border border-zinc-800 mb-8">
        <Loader2 className="w-8 h-8 text-emerald-500 animate-spin mb-4" />
        <p className="text-zinc-400">Analyzing real-time institutional flows...</p>
      </div>
    );
  }

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-white tracking-tight">Institutional Capital Flow</h2>
        {selectedSector && (
          <button 
            onClick={() => onSectorSelect(null)}
            className="text-xs text-zinc-400 hover:text-white transition-colors"
          >
            Clear Filter
          </button>
        )}
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {flows.map((flow) => {
          const isPositive = flow.flowScore >= 0;
          const intensity = Math.abs(flow.flowScore) / 100;
          
          // Calculate background color based on intensity
          // Using rgba to blend with the dark theme
          const bgStyle = isPositive 
            ? { backgroundColor: `rgba(16, 185, 129, ${0.1 + intensity * 0.3})` }
            : { backgroundColor: `rgba(239, 68, 68, ${0.1 + intensity * 0.3})` };
            
          const borderStyle = isPositive
            ? { borderColor: `rgba(16, 185, 129, ${0.3 + intensity * 0.5})` }
            : { borderColor: `rgba(239, 68, 68, ${0.3 + intensity * 0.5})` };

          const isSelected = selectedSector === flow.sector;

          return (
            <button
              key={flow.sector}
              onClick={() => onSectorSelect(isSelected ? null : flow.sector)}
              style={{ ...bgStyle, ...borderStyle }}
              className={`p-4 rounded-xl border text-left transition-all duration-300 relative overflow-hidden group ${
                isSelected ? 'ring-2 ring-white ring-offset-2 ring-offset-zinc-950 scale-105 z-10' : 'hover:scale-105'
              } ${selectedSector && !isSelected ? 'opacity-40' : 'opacity-100'}`}
            >
              <div className="flex justify-between items-start mb-2">
                <span className="font-bold text-white text-sm">{flow.sector}</span>
                {isPositive ? (
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-red-400" />
                )}
              </div>
              <p className="text-xs text-zinc-300 line-clamp-2">{flow.reason}</p>
              
              {/* Score indicator */}
              <div className="absolute bottom-0 left-0 h-1 bg-white/20 w-full">
                <div 
                  className={`h-full ${isPositive ? 'bg-emerald-400' : 'bg-red-400'}`} 
                  style={{ width: `${Math.abs(flow.flowScore)}%` }}
                />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
