/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Feed } from './components/Feed';
import { BSChecker } from './components/BSChecker';
import { Portfolio } from './components/Portfolio';

export default function App() {
  const [activeTab, setActiveTab] = useState('feed');

  return (
    <div className="flex h-screen bg-zinc-950 text-zinc-100 font-sans overflow-hidden">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="flex-1 overflow-y-auto bg-zinc-950">
        {activeTab === 'feed' && <Feed />}
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
