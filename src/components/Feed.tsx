import React, { useState, useEffect, useRef } from 'react';
import { MOCK_SIGNALS } from '../data';
import { SignalCard } from './SignalCard';
import { generateFeed, generateDailyBriefing } from '../services/geminiService';
import { SignalCardData } from '../types';
import { Loader2, AlertTriangle, Play, Square, Volume2 } from 'lucide-react';

interface FeedProps {
  riskProfile: string;
}

export function Feed({ riskProfile }: FeedProps) {
  const [signals, setSignals] = useState<SignalCardData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGeneratingAudio, setIsGeneratingAudio] = useState(false);
  const [activeSignalId, setActiveSignalId] = useState<string | null>(null);
  
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    synthRef.current = window.speechSynthesis;
    return () => {
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, []);

  const playBriefing = async () => {
    if (isPlaying) {
      synthRef.current?.cancel();
      setIsPlaying(false);
      setActiveSignalId(null);
      return;
    }

    if (!signals.length) return;

    setIsGeneratingAudio(true);
    try {
      const segments = await generateDailyBriefing(signals);
      
      if (!synthRef.current) return;
      
      // Try to find a good voice
      const voices = synthRef.current.getVoices();
      const preferredVoice = voices.find(v => v.lang.includes('en-IN') || v.lang.includes('en-GB')) || voices[0];
      
      setIsPlaying(true);
      setIsGeneratingAudio(false);

      segments.forEach((segment, index) => {
        const utterance = new SpeechSynthesisUtterance(segment.text);
        if (preferredVoice) {
          utterance.voice = preferredVoice;
        }
        utterance.rate = 1.1; // Slightly faster for a punchy feel
        utterance.pitch = 1.0;

        utterance.onstart = () => {
          if (segment.signalId && segment.signalId !== 'intro' && segment.signalId !== 'outro') {
            setActiveSignalId(segment.signalId);
          } else if (segment.signalId === 'intro') {
            setActiveSignalId(null);
          }
        };

        if (index === segments.length - 1) {
          utterance.onend = () => {
            setIsPlaying(false);
            setActiveSignalId(null);
          };
          utterance.onerror = () => {
            setIsPlaying(false);
            setActiveSignalId(null);
          };
        }

        synthRef.current?.speak(utterance);
      });
      
    } catch (err) {
      console.error("Failed to generate briefing:", err);
      setIsGeneratingAudio(false);
    }
  };

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
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight mb-2">Confluence Feed</h1>
          <p className="text-zinc-400">High-conviction setups where fundamentals, liquidity, and technicals align.</p>
          <div className="mt-4 inline-block bg-zinc-900 border border-zinc-800 px-3 py-1 rounded-full text-xs font-medium text-zinc-300">
            Risk Profile: <span className="text-emerald-400">{riskProfile}</span>
          </div>
        </div>
        
        {!isLoading && signals.length > 0 && (
          <button
            onClick={playBriefing}
            disabled={isGeneratingAudio}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-medium transition-all ${
              isPlaying 
                ? 'bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500/20' 
                : 'bg-emerald-500 text-zinc-950 hover:bg-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.3)]'
            }`}
          >
            {isGeneratingAudio ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : isPlaying ? (
              <Square className="w-4 h-4 fill-current" />
            ) : (
              <Volume2 className="w-4 h-4" />
            )}
            <span>{isGeneratingAudio ? 'Generating...' : isPlaying ? 'Stop Briefing' : 'Daily Briefing'}</span>
          </button>
        )}
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
            <div 
              key={signal.id} 
              className={`transition-all duration-500 ${
                activeSignalId === signal.id 
                  ? 'ring-2 ring-emerald-500 ring-offset-4 ring-offset-zinc-950 rounded-2xl scale-[1.02]' 
                  : activeSignalId 
                    ? 'opacity-40 scale-[0.98]' 
                    : ''
              }`}
            >
              <SignalCard signal={signal} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
