import React from 'react';
import { useToast } from '../context/ToastContext';
import { motion, AnimatePresence } from 'motion/react';
import { AlertTriangle, Info, CheckCircle, XCircle, X } from 'lucide-react';

export function ToastContainer() {
  const { toasts, removeToast } = useToast();

  return (
    <div className="fixed top-6 right-6 z-[100] flex flex-col space-y-4 max-w-sm w-full pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, x: 50, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 50, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className={`pointer-events-auto flex items-start p-4 rounded-2xl shadow-2xl border backdrop-blur-md ${
              toast.type === 'warning' ? 'bg-amber-500/10 border-amber-500/20 text-amber-500' :
              toast.type === 'error' ? 'bg-red-500/10 border-red-500/20 text-red-500' :
              toast.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' :
              'bg-blue-500/10 border-blue-500/20 text-blue-500'
            }`}
          >
            <div className="shrink-0 mr-3 mt-0.5">
              {toast.type === 'warning' && <AlertTriangle className="w-5 h-5" />}
              {toast.type === 'error' && <XCircle className="w-5 h-5" />}
              {toast.type === 'success' && <CheckCircle className="w-5 h-5" />}
              {toast.type === 'info' && <Info className="w-5 h-5" />}
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-bold mb-1">{toast.title}</h4>
              <p className="text-sm opacity-90 leading-snug">{toast.message}</p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="shrink-0 ml-4 p-1 opacity-50 hover:opacity-100 transition-opacity"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
