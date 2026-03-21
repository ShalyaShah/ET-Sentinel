import React from 'react';
import { MOCK_SIGNALS } from '../data';
import { SignalCard } from './SignalCard';

export function Feed() {
  return (
    <div className="max-w-3xl mx-auto py-8 px-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white tracking-tight mb-2">Confluence Feed</h1>
        <p className="text-zinc-400">High-conviction setups where fundamentals, liquidity, and technicals align.</p>
      </div>
      
      <div className="space-y-6">
        {MOCK_SIGNALS.map((signal) => (
          <SignalCard key={signal.id} signal={signal} />
        ))}
      </div>
    </div>
  );
}
