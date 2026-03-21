import React, { useState, useEffect } from 'react';
import { MOCK_SIGNALS } from '../data';
import { SignalCard } from './SignalCard';
import { generateFeed } from '../services/geminiService';
import { SignalCardData } from '../types';
import { Loader2, AlertTriangle } from 'lucide-react';

interface FeedProps {
  riskProfile: string;
}

export function Feed({ riskProfile }: FeedProps) {
  const [signals, setSignals] = useState<SignalCardData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchFeed() {
      setIsLoading(true);
      setError(null);
      try {
        const data = await generateFeed(riskProfile);
        setSignals(data);
      } catch (err) {
        console.error("Failed to generate feed:", err);
        setError("Failed to load your personalized feed. Showing default signals instead.");
        setSignals(MOCK_SIGNALS);
      } finally {
        setIsLoading(false);
      }
    }

    fetchFeed();
  }, [riskProfile]);

  return (
    <div className="max-w-3xl mx-auto py-8 px-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white tracking-tight mb-2">Confluence Feed</h1>
        <p className="text-zinc-400">High-conviction setups where fundamentals, liquidity, and technicals align.</p>
        <div className="mt-4 inline-block bg-zinc-900 border border-zinc-800 px-3 py-1 rounded-full text-xs font-medium text-zinc-300">
          Risk Profile: <span className="text-emerald-400">{riskProfile}</span>
        </div>
      </div>
      
      {error && (
        <div className="mb-6 bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-start space-x-3">
          <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-emerald-500 animate-spin mb-4" />
          <p className="text-zinc-400">Generating personalized signals based on your risk profile...</p>
        </div>
      ) : (
        <div className="space-y-6">
          {signals.map((signal) => (
            <SignalCard key={signal.id} signal={signal} />
          ))}
        </div>
      )}
    </div>
  );
}
