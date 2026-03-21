import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Shield, Activity, Zap } from 'lucide-react';

interface OnboardingModalProps {
  onComplete: (riskProfile: string) => void;
}

export function OnboardingModal({ onComplete }: OnboardingModalProps) {
  const [timeLeft, setTimeLeft] = useState(10);

  useEffect(() => {
    if (timeLeft <= 0) {
      onComplete('Balanced'); // Default if time runs out
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft, onComplete]);

  const handleSelect = (profile: string) => {
    onComplete(profile);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 max-w-2xl w-full mx-4 shadow-2xl relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 h-1 bg-zinc-800 w-full">
          <motion.div 
            className="h-full bg-emerald-500"
            initial={{ width: '100%' }}
            animate={{ width: '0%' }}
            transition={{ duration: 10, ease: 'linear' }}
          />
        </div>

        <div className="text-center mb-8 mt-4">
          <h2 className="text-3xl font-bold text-white mb-2">Welcome to ET Sentinel</h2>
          <p className="text-zinc-400">Select your risk appetite to personalize your Confluence Feed.</p>
          <p className="text-xs text-zinc-500 mt-2">Auto-selecting Balanced in {timeLeft}s...</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button 
            onClick={() => handleSelect('Conservative')}
            className="bg-zinc-950 border border-zinc-800 hover:border-blue-500/50 hover:bg-blue-500/5 p-6 rounded-2xl text-left transition-all group"
          >
            <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-500/20 transition-colors">
              <Shield className="w-6 h-6 text-blue-500" />
            </div>
            <h3 className="text-lg font-bold text-white mb-1">Conservative</h3>
            <p className="text-sm text-zinc-500">Large Caps Only. Focus on Nifty 50 stocks with strong fundamentals.</p>
          </button>

          <button 
            onClick={() => handleSelect('Balanced')}
            className="bg-zinc-950 border border-zinc-800 hover:border-emerald-500/50 hover:bg-emerald-500/5 p-6 rounded-2xl text-left transition-all group relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 bg-emerald-500 text-white text-[10px] font-bold px-2 py-1 rounded-bl-lg">RECOMMENDED</div>
            <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-emerald-500/20 transition-colors">
              <Activity className="w-6 h-6 text-emerald-500" />
            </div>
            <h3 className="text-lg font-bold text-white mb-1">Balanced</h3>
            <p className="text-sm text-zinc-500">Mix of Large & Mid-caps. Balanced risk-reward ratio.</p>
          </button>

          <button 
            onClick={() => handleSelect('Aggressive')}
            className="bg-zinc-950 border border-zinc-800 hover:border-red-500/50 hover:bg-red-500/5 p-6 rounded-2xl text-left transition-all group"
          >
            <div className="w-12 h-12 bg-red-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-red-500/20 transition-colors">
              <Zap className="w-6 h-6 text-red-500" />
            </div>
            <h3 className="text-lg font-bold text-white mb-1">Aggressive</h3>
            <p className="text-sm text-zinc-500">Breakouts & Mid-caps. Higher volatility, higher potential returns.</p>
          </button>
        </div>
      </motion.div>
    </div>
  );
}
