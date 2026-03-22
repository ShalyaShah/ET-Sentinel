import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Zap, ShieldCheck, TrendingUp, TrendingDown, ExternalLink, CheckCircle2, XCircle, Clock, ArrowRight } from 'lucide-react';
import { useChatContext } from '../context/ChatContext';
import { useToast } from '../context/ToastContext';

interface DraftOrder {
  id: string;
  ticker: string;
  type: 'BUY' | 'SELL';
  quantity: number;
  entryPrice: number;
  targetPrice: number;
  stopLoss: number;
  reason: string;
  status: 'DRAFT' | 'EXECUTING' | 'EXECUTED' | 'REJECTED';
  timestamp: string;
}

const MOCK_ORDERS: DraftOrder[] = [
  {
    id: 'ord_1',
    ticker: 'RELIANCE',
    type: 'BUY',
    quantity: 50,
    entryPrice: 2950.00,
    targetPrice: 3120.00,
    stopLoss: 2880.00,
    reason: 'Confluence: Smart Money Accumulation + Technical Breakout on Daily timeframe.',
    status: 'DRAFT',
    timestamp: 'Just now'
  },
  {
    id: 'ord_2',
    ticker: 'TCS',
    type: 'SELL',
    quantity: 25,
    entryPrice: 4100.00,
    targetPrice: 3900.00,
    stopLoss: 4180.00,
    reason: 'Retail Trap Detected: High social FOMO diverging from heavy DII distribution.',
    status: 'DRAFT',
    timestamp: '5 mins ago'
  },
  {
    id: 'ord_3',
    ticker: 'HDFCBANK',
    type: 'BUY',
    quantity: 100,
    entryPrice: 1420.50,
    targetPrice: 1550.00,
    stopLoss: 1380.00,
    reason: 'Yield Engine: Dividend capture opportunity + Support level bounce.',
    status: 'DRAFT',
    timestamp: '12 mins ago'
  }
];

export function ExecutionHub() {
  const { setContextString } = useChatContext();
  const { addToast } = useToast();
  const [orders, setOrders] = useState<DraftOrder[]>(MOCK_ORDERS);
  const [brokerConnected, setBrokerConnected] = useState(true);

  useEffect(() => {
    setContextString('User is viewing the Execution Hub, reviewing AI-generated draft orders pre-filled with Target, Stop-Loss, and Position Size, ready for one-click execution via broker API.');
  }, [setContextString]);

  const executeOrder = (id: string) => {
    // Set to executing
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status: 'EXECUTING' } : o));
    
    // Simulate API delay
    setTimeout(() => {
      setOrders(prev => prev.map(o => o.id === id ? { ...o, status: 'EXECUTED' } : o));
      addToast({
        title: 'Order Executed',
        message: 'Order successfully executed via Kite Connect API',
        type: 'success'
      });
    }, 1500);
  };

  const cancelOrder = (id: string) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status: 'REJECTED' } : o));
    addToast({
      title: 'Order Dismissed',
      message: 'Draft order cancelled',
      type: 'info'
    });
  };

  const activeOrders = orders.filter(o => o.status === 'DRAFT' || o.status === 'EXECUTING');
  const pastOrders = orders.filter(o => o.status === 'EXECUTED' || o.status === 'REJECTED');

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* Header & Broker Status */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <div className="p-2 bg-yellow-500/20 rounded-lg">
              <Zap className="w-6 h-6 text-yellow-500" />
            </div>
            <h1 className="text-3xl font-bold text-white tracking-tight">Execution Hub</h1>
          </div>
          <p className="text-zinc-400 max-w-2xl">
            Zero-latency broker integration. Review high-conviction AI signals and execute pre-filled draft orders with one click.
          </p>
        </div>
        
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 flex items-center space-x-4">
          <div className="flex items-center space-x-3 pr-4 border-r border-zinc-800">
            <div className={`w-3 h-3 rounded-full ${brokerConnected ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`} />
            <div>
              <p className="text-xs text-zinc-500 uppercase tracking-wider font-bold">Broker Status</p>
              <p className="text-sm font-medium text-white">Zerodha Kite (Active)</p>
            </div>
          </div>
          <button 
            onClick={() => setBrokerConnected(!brokerConnected)}
            className="text-xs font-medium text-zinc-400 hover:text-white transition-colors flex items-center"
          >
            <ExternalLink className="w-3 h-3 mr-1" />
            Manage
          </button>
        </div>
      </div>

      {/* Draft Orders */}
      <div>
        <h2 className="text-lg font-bold text-white mb-4 flex items-center">
          <Clock className="w-5 h-5 mr-2 text-zinc-400" />
          Pending Draft Orders
        </h2>
        
        {activeOrders.length === 0 ? (
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-12 text-center">
            <ShieldCheck className="w-12 h-12 text-emerald-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">All caught up</h3>
            <p className="text-zinc-400">No pending draft orders. The Confluence Engine is scanning for the next setup.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            <AnimatePresence>
              {activeOrders.map((order) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 relative overflow-hidden"
                >
                  {/* Left Accent Line */}
                  <div className={`absolute left-0 top-0 bottom-0 w-1 ${order.type === 'BUY' ? 'bg-emerald-500' : 'bg-red-500'}`} />
                  
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    {/* Order Details */}
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <span className={`px-2 py-1 rounded text-xs font-bold tracking-wider ${
                          order.type === 'BUY' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'
                        }`}>
                          {order.type}
                        </span>
                        <h3 className="text-xl font-bold text-white">{order.ticker}</h3>
                        <span className="text-xs text-zinc-500 flex items-center">
                          <Clock className="w-3 h-3 mr-1" /> {order.timestamp}
                        </span>
                      </div>
                      <p className="text-sm text-zinc-400 mb-4">{order.reason}</p>
                      
                      {/* Parameters Grid */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        <div className="bg-zinc-950 rounded-lg p-3 border border-zinc-800/50">
                          <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Qty (Size)</p>
                          <p className="text-lg font-mono text-white">{order.quantity}</p>
                        </div>
                        <div className="bg-zinc-950 rounded-lg p-3 border border-zinc-800/50">
                          <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Entry</p>
                          <p className="text-lg font-mono text-white">₹{order.entryPrice.toFixed(2)}</p>
                        </div>
                        <div className="bg-emerald-500/5 rounded-lg p-3 border border-emerald-500/10">
                          <p className="text-xs text-emerald-500/70 uppercase tracking-wider mb-1">Target</p>
                          <p className="text-lg font-mono text-emerald-400">₹{order.targetPrice.toFixed(2)}</p>
                        </div>
                        <div className="bg-red-500/5 rounded-lg p-3 border border-red-500/10">
                          <p className="text-xs text-red-500/70 uppercase tracking-wider mb-1">Stop-Loss</p>
                          <p className="text-lg font-mono text-red-400">₹{order.stopLoss.toFixed(2)}</p>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex lg:flex-col gap-3 shrink-0">
                      <button
                        onClick={() => executeOrder(order.id)}
                        disabled={order.status === 'EXECUTING' || !brokerConnected}
                        className="flex-1 lg:flex-none bg-yellow-500 hover:bg-yellow-600 disabled:bg-yellow-500/50 text-zinc-950 px-8 py-3 rounded-xl font-bold transition-colors flex items-center justify-center"
                      >
                        {order.status === 'EXECUTING' ? (
                          <span className="flex items-center">
                            <Zap className="w-5 h-5 mr-2 animate-pulse" />
                            Pushing...
                          </span>
                        ) : (
                          <span className="flex items-center">
                            Confirm Trade <ArrowRight className="w-5 h-5 ml-2" />
                          </span>
                        )}
                      </button>
                      <button
                        onClick={() => cancelOrder(order.id)}
                        disabled={order.status === 'EXECUTING'}
                        className="flex-1 lg:flex-none bg-zinc-800 hover:bg-zinc-700 disabled:bg-zinc-800/50 text-white px-8 py-3 rounded-xl font-medium transition-colors"
                      >
                        Dismiss
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Execution History */}
      {pastOrders.length > 0 && (
        <div className="pt-8 border-t border-zinc-800">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center">
            <CheckCircle2 className="w-5 h-5 mr-2 text-zinc-400" />
            Recent Executions
          </h2>
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
            <table className="w-full text-left text-sm">
              <thead className="bg-zinc-950 border-b border-zinc-800 text-zinc-400">
                <tr>
                  <th className="px-6 py-4 font-medium">Ticker</th>
                  <th className="px-6 py-4 font-medium">Action</th>
                  <th className="px-6 py-4 font-medium">Size</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {pastOrders.map(order => (
                  <tr key={order.id} className="text-zinc-300">
                    <td className="px-6 py-4 font-bold text-white">{order.ticker}</td>
                    <td className="px-6 py-4">
                      <span className={order.type === 'BUY' ? 'text-emerald-400' : 'text-red-400'}>
                        {order.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-mono">{order.quantity}</td>
                    <td className="px-6 py-4">
                      {order.status === 'EXECUTED' ? (
                        <span className="flex items-center text-emerald-500">
                          <CheckCircle2 className="w-4 h-4 mr-1.5" /> Executed
                        </span>
                      ) : (
                        <span className="flex items-center text-zinc-500">
                          <XCircle className="w-4 h-4 mr-1.5" /> Dismissed
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
