/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Feed } from './components/Feed';
import { BSChecker } from './components/BSChecker';
import { Portfolio } from './components/Portfolio';
import { OnboardingModal } from './components/OnboardingModal';

export default function App() {
  const [activeTab, setActiveTab] = useState('feed');
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [riskProfile, setRiskProfile] = useState<string | null>(null);

  useEffect(() => {
    const savedProfile = localStorage.getItem('riskProfile');
    if (savedProfile) {
      setRiskProfile(savedProfile);
      setShowOnboarding(false);
    }
  }, []);

  const handleOnboardingComplete = (profile: string) => {
    setRiskProfile(profile);
    localStorage.setItem('riskProfile', profile);
    setShowOnboarding(false);
  };

  return (
    <div className="flex h-screen bg-zinc-950 text-zinc-100 font-sans overflow-hidden">
      {showOnboarding && <OnboardingModal onComplete={handleOnboardingComplete} />}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="flex-1 overflow-y-auto bg-zinc-950">
        {activeTab === 'feed' && <Feed riskProfile={riskProfile || 'Balanced'} />}
        {activeTab === 'bschecker' && <BSChecker />}
        {activeTab === 'portfolio' && <Portfolio />}
        {activeTab === 'settings' && (
          <div className="max-w-3xl mx-auto py-12 px-6 text-center">
            <h1 className="text-3xl font-bold text-white tracking-tight mb-4">Settings</h1>
            <p className="text-zinc-400">Configure your broker integrations and alert preferences here.</p>
          </div>
        )}
      </main>
    </div>
  );
}
