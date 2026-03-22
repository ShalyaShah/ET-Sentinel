import React, { useEffect, useRef } from 'react';
import { useToast } from '../context/ToastContext';

const ALERTS = [
  {
    title: '🚨 Smart Money Alert',
    message: 'Promoter pledge revoked for SUZLON, matching a 4-week volume breakout.',
    type: 'warning' as const,
  },
  {
    title: '📈 Volume Spike',
    message: 'HDFCBANK seeing 3x average volume in the last 15 minutes. Institutional buying detected.',
    type: 'info' as const,
  },
  {
    title: '⚠️ Risk Warning',
    message: 'High volatility expected in IT sector due to upcoming macro data release.',
    type: 'error' as const,
  },
  {
    title: '✅ Setup Confirmed',
    message: 'TATASTEEL has successfully broken out of its 6-month consolidation phase.',
    type: 'success' as const,
  }
];

export function AlertSimulator() {
  const { addToast } = useToast();
  const hasTriggeredInitial = useRef(false);

  useEffect(() => {
    // Initial alert after 5 seconds
    let initialTimer: NodeJS.Timeout;
    if (!hasTriggeredInitial.current) {
      initialTimer = setTimeout(() => {
        addToast(ALERTS[0]);
        hasTriggeredInitial.current = true;
      }, 5000);
    }

    // Subsequent alerts every 20-40 seconds
    const interval = setInterval(() => {
      const randomAlert = ALERTS[Math.floor(Math.random() * ALERTS.length)];
      addToast(randomAlert);
    }, Math.random() * 20000 + 20000);

    return () => {
      if (initialTimer) clearTimeout(initialTimer);
      clearInterval(interval);
    };
  }, [addToast]);

  return null;
}
