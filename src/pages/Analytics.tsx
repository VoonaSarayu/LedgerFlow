import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { TrendingUp, PieChart, Sparkles, History, AlertCircle } from 'lucide-react';

interface AnalyticsData {
  revenue: {
    paid: number;
    pending: number;
    overdue: number;
    successRate: number;
  };
  subscription: {
    planName: string;
    price: number;
    interval: string;
    status: string;
    startDate: string;
  } | null;
  trend: Array<{ month: string; value: number }>;
  logs: Array<{
    id: string;
    action: string;
    details: string | null;
    createdAt: string;
    user: string;
  }>;
}

export const Analytics: React.FC = () => {
  const { api } = useAuth();
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalytics = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/analytics');
      setData(res.data);
    } catch (err: any) {
      console.error('Error loading analytics statistics:', err);
      setError('Could not connect to the API. Make sure the server is running.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [api]);

  // Calculations for graph rendering
  const trendData = data?.trend || [
    { month: 'Jan', value: 8500 },
    { month: 'Feb', value: 12000 },
    { month: 'Mar', value: 16500 },
    { month: 'Apr', value: 21000 },
    { month: 'May', value: 24500 },
    { month: 'Jun', value: 32000 },
  ];
  
  const maxVal = Math.max(...trendData.map((d) => d.value)) || 1;

  // Invoice status percentages
  const paidVal = data?.revenue.paid || 0;
  const pendingVal = data?.revenue.pending || 0;
  const overdueVal = data?.revenue.overdue || 0;
  const totalVal = paidVal + pendingVal + overdueVal || 1;

  const paidPercent = Math.round((paidVal / totalVal) * 100);
  const pendingPercent = Math.round((pendingVal / totalVal) * 100);
  const overduePercent = Math.round((overdueVal / totalVal) * 100);

  return (
    <div className="space-y-8">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white font-editorial">
            Performance Analytics
          </h1>
          <p className="text-white/60 text-sm mt-1">
            Real-time reporting on subscription MRR, recovery pipelines, and invoice collection.
          </p>
        </div>
      </div>

      {error && (
        <div className="glass-panel p-4 rounded-xl border border-red-500/20 bg-red-500/5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-red-400 text-sm">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
          <button
            onClick={fetchAnalytics}
            className="px-4 py-1.5 rounded-lg bg-red-500/20 text-red-200 border border-red-500/30 text-xs font-semibold hover:bg-red-500/30 transition-all cursor-pointer"
          >
            Retry
          </button>
        </div>
      )}

      {/* Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* MRR Growth Chart (SVG based) */}
        <div className="lg:col-span-8 glass-panel p-6 rounded-2xl border border-white/5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-white text-sm flex items-center gap-2">
              <TrendingUp size={16} className="text-brand-accent" />
              MRR Growth Trend
            </h3>
            <span className="text-[10px] text-white/40 uppercase font-bold tracking-wider">H1 2026</span>
          </div>

          {/* Bar Chart Container */}
          <div className="h-64 flex items-end gap-3 sm:gap-6 pt-6 border-b border-white/5 border-l border-white/5 pl-4 pb-2">
            {loading ? (
              <div className="w-full h-full flex items-end gap-3 sm:gap-6 pb-2">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                    <div style={{ height: `${20 + i * 10}%` }} className="w-full sm:w-10 skeleton" />
                    <div className="h-3 w-8 skeleton" />
                  </div>
                ))}
              </div>
            ) : (
              trendData.map((d) => {
                const heightPercent = `${(d.value / maxVal) * 80}%`;
                return (
                  <div key={d.month} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                    <div className="relative w-full flex justify-center">
                      {/* Tooltip */}
                      <div className="absolute bottom-full mb-1 opacity-0 group-hover:opacity-100 transition-opacity bg-brand-primary text-white text-[9px] px-2 py-0.5 rounded font-mono shadow-lg pointer-events-none z-10">
                        ${d.value.toLocaleString()}
                      </div>
                      {/* Bar */}
                      <div
                        style={{ height: heightPercent }}
                        className="w-full sm:w-10 rounded-t-lg bg-gradient-to-t from-brand-primary to-brand-accent group-hover:from-brand-accent group-hover:to-brand-primary transition-all duration-300 shadow-[0_0_15px_rgba(109,93,246,0.15)]"
                      />
                    </div>
                    <span className="text-[10px] text-white/55 font-semibold font-mono">{d.month}</span>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Invoice Status Distribution (Circular/Grid indicators) */}
        <div className="lg:col-span-4 glass-panel p-6 rounded-2xl border border-white/5 space-y-6 flex flex-col justify-between">
          <div className="space-y-1">
            <h3 className="font-semibold text-white text-sm flex items-center gap-2">
              <PieChart size={16} className="text-brand-primary" />
              Collection Distribution
            </h3>
            <p className="text-[11px] text-white/40 leading-relaxed">
              Comparison of settled invoices vs outstanding cash flow.
            </p>
          </div>

          <div className="space-y-4">
            {/* Paid */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-white/60 font-medium">Settled (Paid)</span>
                {loading ? <div className="h-4 w-8 skeleton" /> : <span className="text-green-400 font-bold">{paidPercent}%</span>}
              </div>
              <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                {loading ? <div className="h-full w-full skeleton" /> : <div style={{ width: `${paidPercent}%` }} className="h-full bg-green-400 rounded-full" />}
              </div>
            </div>

            {/* Pending */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-white/60 font-medium">Outstanding (Sent)</span>
                {loading ? <div className="h-4 w-8 skeleton" /> : <span className="text-brand-primary font-bold">{pendingPercent}%</span>}
              </div>
              <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                {loading ? <div className="h-full w-full skeleton" /> : <div style={{ width: `${pendingPercent}%` }} className="h-full bg-brand-primary rounded-full" />}
              </div>
            </div>

            {/* Overdue */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-white/60 font-medium">Failed / Overdue</span>
                {loading ? <div className="h-4 w-8 skeleton" /> : <span className="text-red-400 font-bold">{overduePercent}%</span>}
              </div>
              <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                {loading ? <div className="h-full w-full skeleton" /> : <div style={{ width: `${overduePercent}%` }} className="h-full bg-red-400 rounded-full" />}
              </div>
            </div>
          </div>

          <div className="p-3 bg-white/2 rounded-xl border border-white/5 text-[10px] text-white/40 text-center leading-relaxed">
            Total Pipeline Volume evaluated: **{loading ? 'Evaluating...' : `$${totalVal.toLocaleString()}`}**
          </div>
        </div>
      </div>

      {/* AI Smart-Retry Analytics section */}
      <div className="glass-panel p-6 rounded-2xl border border-brand-accent/20 bg-brand-accent/2 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-brand-accent/5 rounded-full blur-[80px] pointer-events-none" />

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          <div className="md:col-span-8 space-y-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-brand-accent/10 border border-brand-accent/20 text-brand-accent">
              <Sparkles size={10} /> AI Agent Active
            </span>
            <h3 className="text-2xl font-bold tracking-tight text-white font-editorial">
              Billing Smart-Retry Diagnostics
            </h3>
            <p className="text-xs text-white/60 leading-relaxed max-w-xl">
              LedgerFlow's auto-retries route payment logs dynamically during credit card timeouts. 
              Our routing engine evaluates database triggers to minimize revenue leakages.
            </p>
          </div>

          <div className="md:col-span-4 grid grid-cols-2 gap-4">
            <div className="bg-white/3 border border-white/5 p-4 rounded-xl text-center">
              <span className="text-[9px] text-white/40 font-bold uppercase tracking-wider block">Recovered</span>
              <span className="text-lg font-bold text-white block mt-1 font-editorial">$4,820</span>
              <span className="text-[9px] text-brand-accent block mt-0.5">+12.4% recovery</span>
            </div>
            <div className="bg-white/3 border border-white/5 p-4 rounded-xl text-center">
              <span className="text-[9px] text-white/40 font-bold uppercase tracking-wider block">Gateway Saves</span>
              {loading ? (
                <div className="h-6 w-12 mx-auto skeleton mt-1" />
              ) : (
                <span className="text-lg font-bold text-white block mt-1 font-editorial">{data?.revenue.successRate ?? 92}%</span>
              )}
              <span className="text-[9px] text-green-400 block mt-0.5">Success rate</span>
            </div>
          </div>
        </div>
      </div>

      {/* Activity Logs (Audit Log System) */}
      <div className="glass-panel p-6 rounded-2xl border border-white/5 space-y-6">
        <div className="flex items-center gap-2 border-b border-white/5 pb-4">
          <History size={16} className="text-brand-accent" />
          <h3 className="font-semibold text-white text-base">Audit Trail logs</h3>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex justify-between items-center py-2.5 border-b border-white/5">
                <div className="space-y-1.5 flex-1">
                  <div className="h-3.5 w-32 skeleton" />
                  <div className="h-3 w-48 skeleton" />
                </div>
                <div className="h-3 w-20 skeleton" />
              </div>
            ))}
          </div>
        ) : !data?.logs || data.logs.length === 0 ? (
          <div className="py-8 text-center text-white/40 text-xs">
            No activity log entries found. Perform operations (like log-ins, invoice edits) to populate.
          </div>
        ) : (
          <div className="space-y-1 divide-y divide-white/5">
            {data.logs.map((log) => (
              <div key={log.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-brand-primary/10 text-brand-primary text-[9px] font-bold border border-brand-primary/15 uppercase font-mono">
                      {log.action.replace('_', ' ')}
                    </span>
                    <span className="text-white/40 text-[10px]">by {log.user}</span>
                  </div>
                  <p className="text-white/80 font-medium text-xs leading-relaxed">
                    {log.details || 'No details registered.'}
                  </p>
                </div>
                <span className="text-[10px] text-white/30 whitespace-nowrap">
                  {new Date(log.createdAt).toLocaleString(undefined, {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
