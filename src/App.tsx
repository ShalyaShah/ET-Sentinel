/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Feed } from './components/Feed';
import { BSChecker } from './components/BSChecker';
import { Portfolio } from './components/Portfolio';
import { YieldDashboard } from './components/YieldDashboard';
import { FamilyPod } from './components/FamilyPod';
import { ThreatRadar } from './components/ThreatRadar';
import { OnboardingModal } from './components/OnboardingModal';
import { ChatProvider, useChatContext } from './context/ChatContext';
import { ToastProvider } from './context/ToastContext';
import { ChatSidebar } from './components/ChatSidebar';
import { ToastContainer } from './components/ToastContainer';
import { AlertSimulator } from './components/AlertSimulator';
import { MessageSquare } from 'lucide-react';

function AppContent() {
  const [activeTab, setActiveTab] = useState('feed');
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [riskProfile, setRiskProfile] = useState<string | null>(null);
  const { setContextString, setIsChatOpen } = useChatContext();

  useEffect(() => {
    const savedProfile = localStorage.getItem('riskProfile');
    if (savedProfile) {
      setRiskProfile(savedProfile);
      setShowOnboarding(false);
    }
  }, []);

  useEffect(() => {
    if (activeTab === 'feed') setContextString('User is viewing the Market Feed tab, looking at AI-generated trading signals.');
    else if (activeTab === 'portfolio') setContextString('User is viewing their Portfolio tab, looking at their current holdings and alerts.');
    else if (activeTab === 'yield') setContextString('User is viewing the Yield & Dividend Dashboard (Confluence Engine).');
    else if (activeTab === 'familypod') setContextString('User is viewing the Family Pod dashboard, analyzing aggregate exposure across multiple Demat accounts.');
    else if (activeTab === 'threatradar') setContextString('User is viewing the Threat Radar, scanning regulatory filings for hidden red flags.');
    else if (activeTab === 'settings') setContextString('User is viewing the Settings tab.');
    // BSChecker sets its own context when a stock is searched
  }, [activeTab, setContextString]);

  const handleOnboardingComplete = (profile: string) => {
    setRiskProfile(profile);
    localStorage.setItem('riskProfile', profile);
    setShowOnboarding(false);
  };

  return (
    <div className="flex h-screen bg-zinc-950 text-zinc-100 font-sans overflow-hidden">
      <ToastContainer />
      <AlertSimulator />
      {showOnboarding && <OnboardingModal onComplete={handleOnboardingComplete} />}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="flex-1 overflow-y-auto bg-zinc-950 relative">
        {activeTab === 'feed' && <Feed riskProfile={riskProfile || 'Balanced'} />}
        {activeTab === 'bschecker' && <BSChecker />}
        {activeTab === 'portfolio' && <Portfolio />}
        {activeTab === 'yield' && <YieldDashboard />}
        {activeTab === 'familypod' && <FamilyPod />}
        {activeTab === 'threatradar' && <ThreatRadar />}
        {activeTab === 'settings' && (
          <div className="max-w-3xl mx-auto py-12 px-6 text-center">
            <h1 className="text-3xl font-bold text-white tracking-tight mb-4">Settings</h1>
            <p className="text-zinc-400">Configure your broker integrations and alert preferences here.</p>
          </div>
        )}

        {/* Floating Chat Button */}
        <button
          onClick={() => setIsChatOpen(true)}
          className="fixed bottom-6 right-6 p-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full shadow-lg hover:shadow-emerald-500/20 transition-all z-30 flex items-center justify-center"
        >
          <MessageSquare className="w-6 h-6" />
        </button>
      </main>

      <ChatSidebar />
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <ChatProvider>
        <AppContent />
      </ChatProvider>
    </ToastProvider>
  );
}
