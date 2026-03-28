import React, { useState } from 'react';
import { 
  User, 
  Bell, 
  Shield, 
  Link as LinkIcon, 
  Smartphone, 
  CreditCard, 
  LogOut,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  Settings as SettingsIcon,
  Moon,
  Sun
} from 'lucide-react';
import { motion } from 'motion/react';
import { useToast } from '../context/ToastContext';

const BROKERS = [
  { id: 'zerodha', name: 'Zerodha Kite', connected: true, lastSync: '2 mins ago' },
  { id: 'upstox', name: 'Upstox Pro', connected: false, lastSync: null },
  { id: 'groww', name: 'Groww', connected: true, lastSync: '1 hour ago' },
  { id: 'angelone', name: 'Angel One', connected: false, lastSync: null },
];

const ALERT_PREFERENCES = [
  { id: 'smart_money', title: 'Smart Money Alerts', description: 'Get notified when institutions buy/sell heavily.', enabled: true },
  { id: 'retail_trap', title: 'Retail Trap Alerts', description: 'Warnings when retail FOMO diverges from smart money.', enabled: true },
  { id: 'threat_radar', title: 'Threat Radar', description: 'Red flags in auditor remarks and regulatory filings.', enabled: true },
  { id: 'yield_div', title: 'Yield & Dividend', description: 'Alerts for high-yield assets testing technical support.', enabled: false },
  { id: 'auto_draft', title: 'Auto-Draft Orders', description: 'Automatically draft orders for high-conviction setups.', enabled: true },
];

export function Settings() {
  const { addToast } = useToast();
  const [brokers, setBrokers] = useState(BROKERS);
  const [alerts, setAlerts] = useState(ALERT_PREFERENCES);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  const toggleBroker = (id: string) => {
    setBrokers(brokers.map(b => {
      if (b.id === id) {
        const newConnected = !b.connected;
        if (newConnected) {
          addToast({ title: 'Broker Connected', message: `Successfully connected to ${b.name}`, type: 'success' });
        } else {
          addToast({ title: 'Broker Disconnected', message: `Disconnected from ${b.name}`, type: 'info' });
        }
        return { ...b, connected: newConnected, lastSync: newConnected ? 'Just now' : null };
      }
      return b;
    }));
  };

  const toggleAlert = (id: string) => {
    setAlerts(alerts.map(a => {
      if (a.id === id) {
        return { ...a, enabled: !a.enabled };
      }
      return a;
    }));
  };

  return (
    <div className="max-w-5xl mx-auto py-8 px-6 pb-24">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
          <SettingsIcon className="w-8 h-8 text-emerald-500" />
          Settings & Preferences
        </h1>
        <p className="text-zinc-400 mt-2">Manage your account, broker integrations, and alert configurations.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Navigation/Profile Summary */}
        <div className="lg:col-span-1 space-y-6">
          {/* Profile Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30">
                <User className="w-8 h-8 text-emerald-400" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white">Alex Investor</h2>
                <p className="text-zinc-400 text-sm">alex@example.com</p>
              </div>
            </div>
            
            <div className="bg-zinc-950 rounded-lg p-4 border border-zinc-800 mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-zinc-400">Plan</span>
                <span className="text-xs font-bold px-2 py-1 bg-emerald-500/20 text-emerald-400 rounded uppercase tracking-wider">Pro Tier</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-zinc-400">Renewal</span>
                <span className="text-sm text-white">Oct 24, 2026</span>
              </div>
            </div>

            <button className="w-full py-2.5 px-4 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2">
              <CreditCard className="w-4 h-4" />
              Manage Billing
            </button>
          </motion.div>

          {/* Quick Links */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-zinc-900/50 border border-zinc-800 rounded-xl overflow-hidden"
          >
            <div className="p-4 border-b border-zinc-800">
              <h3 className="text-sm font-semibold text-zinc-300 uppercase tracking-wider">Security & Data</h3>
            </div>
            <div className="divide-y divide-zinc-800">
              <button className="w-full flex items-center justify-between p-4 hover:bg-zinc-800/50 transition-colors text-left">
                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-zinc-400" />
                  <span className="text-zinc-200">Password & Security</span>
                </div>
                <ChevronRight className="w-4 h-4 text-zinc-500" />
              </button>
              <button className="w-full flex items-center justify-between p-4 hover:bg-zinc-800/50 transition-colors text-left">
                <div className="flex items-center gap-3">
                  <Smartphone className="w-5 h-5 text-zinc-400" />
                  <span className="text-zinc-200">Two-Factor Auth (2FA)</span>
                </div>
                <ChevronRight className="w-4 h-4 text-zinc-500" />
              </button>
              <button className="w-full flex items-center justify-between p-4 hover:bg-zinc-800/50 transition-colors text-left text-red-400">
                <div className="flex items-center gap-3">
                  <LogOut className="w-5 h-5" />
                  <span>Sign Out</span>
                </div>
              </button>
            </div>
          </motion.div>
        </div>

        {/* Right Column: Main Settings */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Broker Integrations */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <LinkIcon className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white">Broker Integrations</h2>
                <p className="text-sm text-zinc-400">Connect your Demat accounts for zero-latency execution.</p>
              </div>
            </div>

            <div className="space-y-4">
              {brokers.map((broker) => (
                <div key={broker.id} className="flex items-center justify-between p-4 bg-zinc-950 border border-zinc-800 rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded bg-zinc-800 flex items-center justify-center font-bold text-zinc-300">
                      {broker.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-white font-medium">{broker.name}</h3>
                      {broker.connected ? (
                        <p className="text-xs text-emerald-400 flex items-center gap-1 mt-1">
                          <CheckCircle2 className="w-3 h-3" /> Connected • Sync: {broker.lastSync}
                        </p>
                      ) : (
                        <p className="text-xs text-zinc-500 mt-1">Not connected</p>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => toggleBroker(broker.id)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      broker.connected 
                        ? 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700' 
                        : 'bg-emerald-500 text-white hover:bg-emerald-600'
                    }`}
                  >
                    {broker.connected ? 'Disconnect' : 'Connect'}
                  </button>
                </div>
              ))}
            </div>
            <div className="mt-4 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
              <p className="text-sm text-blue-200/70">
                ET Sentinel uses secure, read-only API keys for portfolio syncing. Trade execution requires explicit one-click confirmation via your broker's OAuth flow.
              </p>
            </div>
          </motion.div>

          {/* Alert Preferences */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-amber-500/20 rounded-lg">
                <Bell className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white">Alert Preferences</h2>
                <p className="text-sm text-zinc-400">Customize which signals trigger push notifications.</p>
              </div>
            </div>

            <div className="space-y-1">
              {alerts.map((alert) => (
                <div key={alert.id} className="flex items-center justify-between p-4 hover:bg-zinc-800/30 rounded-lg transition-colors">
                  <div className="pr-8">
                    <h3 className="text-zinc-200 font-medium">{alert.title}</h3>
                    <p className="text-sm text-zinc-500 mt-1">{alert.description}</p>
                  </div>
                  <button
                    onClick={() => toggleAlert(alert.id)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                      alert.enabled ? 'bg-emerald-500' : 'bg-zinc-700'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        alert.enabled ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Appearance */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-purple-500/20 rounded-lg">
                <Moon className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white">Appearance</h2>
                <p className="text-sm text-zinc-400">Customize the look and feel of ET Sentinel.</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button 
                onClick={() => setTheme('dark')}
                className={`flex-1 flex flex-col items-center justify-center p-6 rounded-xl border-2 transition-all ${
                  theme === 'dark' ? 'border-emerald-500 bg-emerald-500/10' : 'border-zinc-800 bg-zinc-950 hover:border-zinc-700'
                }`}
              >
                <Moon className={`w-8 h-8 mb-3 ${theme === 'dark' ? 'text-emerald-400' : 'text-zinc-500'}`} />
                <span className={`font-medium ${theme === 'dark' ? 'text-emerald-400' : 'text-zinc-400'}`}>Dark Mode</span>
              </button>
              <button 
                onClick={() => {
                  setTheme('light');
                  addToast({ title: 'Theme', message: 'Light mode is currently disabled in beta.', type: 'info' });
                  setTimeout(() => setTheme('dark'), 1000);
                }}
                className={`flex-1 flex flex-col items-center justify-center p-6 rounded-xl border-2 transition-all ${
                  theme === 'light' ? 'border-emerald-500 bg-emerald-500/10' : 'border-zinc-800 bg-zinc-950 hover:border-zinc-700'
                }`}
              >
                <Sun className={`w-8 h-8 mb-3 ${theme === 'light' ? 'text-emerald-400' : 'text-zinc-500'}`} />
                <span className={`font-medium ${theme === 'light' ? 'text-emerald-400' : 'text-zinc-400'}`}>Light Mode</span>
              </button>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
}
