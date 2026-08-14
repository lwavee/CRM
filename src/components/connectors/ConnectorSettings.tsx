'use client';

import React, { useEffect, useState } from 'react';
import { Zap, RefreshCw, CheckCircle2, Shield, Settings, Sliders } from 'lucide-react';

export const ConnectorSettings: React.FC = () => {
  const [connectors, setConnectors] = useState<any[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncMsg, setSyncMsg] = useState<string | null>(null);

  useEffect(() => {
    fetchConnectors();
  }, []);

  async function fetchConnectors() {
    try {
      const res = await fetch('/api/connectors');
      const data = await res.json();
      if (data.success) setConnectors(data.connectors);
    } catch (err) {
      console.error(err);
    }
  }

  const handleToggle = async (id: string, currentStatus: boolean) => {
    try {
      const res = await fetch('/api/connectors', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, isEnabled: !currentStatus }),
      });
      const data = await res.json();
      if (data.success) setConnectors(data.connectors);
    } catch (err) {
      console.error(err);
    }
  };

  const handleTriggerSync = async () => {
    setIsSyncing(true);
    setSyncMsg(null);
    try {
      const res = await fetch('/api/connectors', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setSyncMsg(data.message);
        fetchConnectors();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="p-8 space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <Zap className="w-6 h-6 text-yellow-400" /> Modular Lead Connectors & Data Feeds
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Independently enable or disable ingestion sources. All connectors respect robots.txt & terms of service.
          </p>
        </div>

        <button
          onClick={handleTriggerSync}
          disabled={isSyncing}
          className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-glow flex items-center space-x-2 transition disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
          <span>{isSyncing ? 'Running Discovery...' : 'Trigger Sync Now'}</span>
        </button>
      </div>

      {syncMsg && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{syncMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4">
        {connectors.map((c) => (
          <div key={c.id} className="glass-panel p-5 rounded-2xl border border-slate-800 flex items-center justify-between">
            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700/80 flex items-center justify-center text-blue-400 font-bold">
                {c.type.slice(0, 2)}
              </div>
              <div>
                <h4 className="font-bold text-slate-100 text-sm">{c.name}</h4>
                <p className="text-xs text-slate-400 mt-0.5 font-mono">Type: {c.type} • Sync Frequency: Every 24 hours</p>
                <div className="text-[11px] text-slate-500 mt-1">
                  Compliant feed • Target Regions: USA, Canada, UK, Australia, UAE
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <span
                className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                  c.isEnabled
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    : 'bg-slate-800 text-slate-500'
                }`}
              >
                {c.isEnabled ? 'ENABLED' : 'DISABLED'}
              </span>

              <button
                onClick={() => handleToggle(c.id, c.isEnabled)}
                className={`w-12 h-6 rounded-full p-1 transition ${c.isEnabled ? 'bg-blue-600' : 'bg-slate-800'}`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white transition transform ${c.isEnabled ? 'translate-x-6' : 'translate-x-0'}`}
                />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
