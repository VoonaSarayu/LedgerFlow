import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  DollarSign,
  FileText,
  CreditCard,
  ArrowUpRight,
  ShieldCheck,
  AlertCircle,
  Clock
} from 'lucide-react';

interface Stats {
  totalCount: number;
  paidCount: number;
  sentCount: number;
  overdueCount: number;
  draftCount: number;
  revenue: {
    paid: number;
    pending: number;
    overdue: number;
    draft: number;
  };
}

export const Dashboard: React.FC = () => {
  const { api, user } = useAuth();
  const [stats, setStats] = useState<Stats | null>(null);
  const [mrr, setMrr] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [statsRes, subRes] = await Promise.all([
        api.get('/invoices/stats'),
        api.get('/subscriptions'),
      ]);

      setStats(statsRes.data);
      
      // Calculate MRR from active subscriptions
      const activeSubs = subRes.data.filter((sub: any) => sub.status === 'ACTIVE' || sub.status === 'TRIALING');
      const calculatedMrr = activeSubs.reduce((sum: number, sub: any) => {
        if (sub.interval === 'YEARLY') {
          return sum + (sub.price / 12);
        }
        return sum + sub.price;
      }, 0);
      setMrr(calculatedMrr);
    } catch (err: any) {
      console.error('Error fetching dashboard data:', err);
      setError('Could not connect to the API. Make sure the server is running.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [api]);

  const cards = [
    {
      title: 'Estimated MRR',
      value: loading ? '' : `$${mrr.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      subtext: loading ? '' : `ARR: $${(mrr * 12).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      icon: TrendingUp,
      color: 'text-brand-accent',
      bg: 'bg-brand-accent/5 border-brand-accent/15',
    },
    {
      title: 'Total Revenue Collected',
      value: loading ? '' : `$${(stats?.revenue.paid || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
      subtext: loading ? '' : `${stats?.paidCount || 0} invoices settled`,
      icon: DollarSign,
      color: 'text-green-400',
      bg: 'bg-green-500/5 border-green-500/15',
    },
    {
      title: 'Outstanding Receivables',
      value: loading ? '' : `$${(stats?.revenue.pending || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
      subtext: loading ? '' : `${stats?.sentCount || 0} sent, waiting payment`,
      icon: Clock,
      color: 'text-brand-primary',
      bg: 'bg-brand-primary/5 border-brand-primary/15',
    },
    {
      title: 'Failed / Overdue Leakage',
      value: loading ? '' : `$${(stats?.revenue.overdue || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
      subtext: loading ? '' : `${stats?.overdueCount || 0} overdue invoices`,
      icon: AlertCircle,
      color: 'text-red-400',
      bg: 'bg-red-500/5 border-red-500/15',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white font-editorial">
            Welcome back, {user?.firstName || 'Developer'}
          </h1>
          <p className="text-white/60 text-sm mt-1">
            Here is a summary of your company's billing operations and revenue streams.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-white/40">Tenant ID: {user?.company.id.slice(0, 8)}...</span>
        </div>
      </div>

      {/* Error State Banner */}
      {error && (
        <div className="glass-panel p-4 rounded-xl border border-red-500/20 bg-red-500/5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-red-400 text-sm">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
          <button
            onClick={fetchDashboardData}
            className="px-4 py-1.5 rounded-lg bg-red-500/20 text-red-200 border border-red-500/30 text-xs font-semibold hover:bg-red-500/30 transition-all cursor-pointer"
          >
            Retry
          </button>
        </div>
      )}

      {/* Analytics KPI grid (loaded or skeleton) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className={`glass-panel p-6 rounded-2xl border ${card.bg} flex flex-col justify-between`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-white/50">{card.title}</span>
                <span className={`p-1.5 rounded-lg bg-white/2 ${card.color}`}>
                  <Icon size={16} />
                </span>
              </div>
              <div className="mt-4 space-y-2">
                {loading ? (
                  <>
                    <div className="h-7 w-32 skeleton" />
                    <div className="h-4 w-24 skeleton" />
                  </>
                ) : (
                  <>
                    <h3 className="text-2xl font-bold text-white tracking-tight font-editorial">
                      {card.value}
                    </h3>
                    <p className="text-xs text-white/40 font-medium">
                      {card.subtext}
                    </p>
                  </>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Bottom section: Recent invoices & quick actions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 glass-panel p-6 rounded-2xl border border-white/5 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-white text-base">Invoicing Pipeline</h3>
            {loading ? (
              <div className="h-4 w-28 skeleton" />
            ) : (
              <span className="text-xs text-white/40">Total Drafts: {stats?.draftCount || 0}</span>
            )}
          </div>

          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-white/2 p-4 rounded-xl border border-white/5 space-y-3">
                  <div className="h-3 w-12 mx-auto skeleton" />
                  <div className="h-6 w-8 mx-auto skeleton" />
                  <div className="h-3 w-16 mx-auto skeleton" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-white/2 p-4 rounded-xl border border-white/5 text-center">
                <span className="text-[10px] text-white/40 font-bold uppercase tracking-wider block">Drafts</span>
                <span className="text-xl font-bold text-white block mt-1 font-editorial">{stats?.draftCount || 0}</span>
                <span className="text-[10px] text-white/30 block mt-0.5">${(stats?.revenue.draft || 0).toLocaleString()}</span>
              </div>
              <div className="bg-white/2 p-4 rounded-xl border border-white/5 text-center">
                <span className="text-[10px] text-white/40 font-bold uppercase tracking-wider block">Sent</span>
                <span className="text-xl font-bold text-white block mt-1 font-editorial">{stats?.sentCount || 0}</span>
                <span className="text-[10px] text-white/30 block mt-0.5">${(stats?.revenue.pending || 0).toLocaleString()}</span>
              </div>
              <div className="bg-white/2 p-4 rounded-xl border border-white/5 text-center">
                <span className="text-[10px] text-white/40 font-bold uppercase tracking-wider block">Paid</span>
                <span className="text-xl font-bold text-white block mt-1 font-editorial">{stats?.paidCount || 0}</span>
                <span className="text-[10px] text-white/30 block mt-0.5">${(stats?.revenue.paid || 0).toLocaleString()}</span>
              </div>
              <div className="bg-white/2 p-4 rounded-xl border border-white/5 text-center">
                <span className="text-[10px] text-white/40 font-bold uppercase tracking-wider block">Overdue</span>
                <span className="text-xl font-bold text-white block mt-1 font-editorial">{stats?.overdueCount || 0}</span>
                <span className="text-[10px] text-white/30 block mt-0.5">${(stats?.revenue.overdue || 0).toLocaleString()}</span>
              </div>
            </div>
          )}

          <div className="border-t border-white/5 pt-6 flex justify-between items-center text-xs text-white/50">
            <span>Billing cycle automatically aggregates usage counts at 00:00 UTC</span>
            <span className="flex items-center gap-1 text-brand-accent">
              <ShieldCheck size={12} />
              AI auto-savings active
            </span>
          </div>
        </div>

        <div className="lg:col-span-4 glass-panel p-6 rounded-2xl border border-white/5 space-y-6 flex flex-col justify-between">
          <div className="space-y-2">
            <h3 className="font-semibold text-white text-base">Quick Action Sandbox</h3>
            <p className="text-xs text-white/50 leading-relaxed">
              Create test invoices, customers, and log payment retry states to verify routing logic.
            </p>
          </div>

          <div className="space-y-3">
            <a
              href="/dashboard/invoices"
              className="flex items-center justify-between p-3.5 rounded-xl bg-brand-primary/10 border border-brand-primary/20 text-white hover:bg-brand-primary/20 transition-all text-xs font-semibold"
            >
              <span className="flex items-center gap-2">
                <FileText size={14} className="text-brand-primary" />
                Go to Invoices Register
              </span>
              <ArrowUpRight size={14} />
            </a>

            <a
              href="/dashboard/customers"
              className="flex items-center justify-between p-3.5 rounded-xl bg-white/2 border border-white/5 text-white/80 hover:bg-white/4 transition-all text-xs font-semibold"
            >
              <span className="flex items-center gap-2">
                <CreditCard size={14} className="text-brand-accent" />
                Manage Customers & Plans
              </span>
              <ArrowUpRight size={14} />
            </a>
          </div>

          <div className="p-3.5 rounded-xl bg-white/1 border border-dashed border-white/10 text-[11px] text-white/40 leading-relaxed">
            Note: Write permissions (e.g. creating records) are restricted to **ADMIN** and **BILLING_MANAGER** roles.
          </div>
        </div>
      </div>
    </div>
  );
};
