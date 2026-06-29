import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useSearchParams } from 'react-router-dom';
import { Settings as SettingsIcon, Shield, CreditCard, Key, AlertCircle, Save, Check, RefreshCw, X } from 'lucide-react';

interface Subscription {
  id: string;
  planName: string;
  price: number;
  interval: string;
  status: string;
  startDate: string;
}

export const Settings: React.FC = () => {
  const { api, user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [subs, setSubs] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);

  // Form Fields
  const [companyName, setCompanyName] = useState(user?.company.name || '');
  const [companyDomain, setCompanyDomain] = useState('ledgercorp.io');
  const [webhookUrl, setWebhookUrl] = useState('https://api.ledgercorp.io/webhooks/billing');

  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  // Upgrade Plan states
  const [isUpgradeOpen, setIsUpgradeOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<'Startup' | 'Growth' | 'Enterprise'>('Startup');
  const [selectedInterval, setSelectedInterval] = useState<'MONTHLY' | 'YEARLY'>('MONTHLY');
  const [upgrading, setUpgrading] = useState(false);
  const [upgradeError, setUpgradeError] = useState('');

  // Simulator states
  const [simulating, setSimulating] = useState(false);
  const [simResult, setSimResult] = useState<{ invoiceNum: string; amount: number; status: string } | null>(null);

  const isAdmin = user?.role.toUpperCase() === 'ADMIN';
  const isViewer = user?.role.toUpperCase() === 'VIEWER';

  const fetchSubscriptions = async () => {
    try {
      const res = await api.get('/subscriptions');
      setSubs(res.data);
    } catch (error) {
      console.error('Error fetching subscriptions:', error);
    }
  };

  useEffect(() => {
    const initPage = async () => {
      setLoading(true);
      await fetchSubscriptions();
      setLoading(false);
    };
    initPage();
  }, [api]);

  useEffect(() => {
    const planParam = searchParams.get('plan');
    if (planParam && ['Startup', 'Growth', 'Enterprise'].includes(planParam)) {
      setSelectedPlan(planParam as any);
      setIsUpgradeOpen(true);
      
      const newParams = new URLSearchParams(searchParams);
      newParams.delete('plan');
      setSearchParams(newParams, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin) return;
    setSaving(true);
    setSuccess(false);

    // Simulate saving settings
    setTimeout(() => {
      setSaving(false);
      setSuccess(true);
    }, 1000);
  };

  const handleUpgradePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpgradeError('');
    setUpgrading(true);
    try {
      await api.put('/subscriptions/upgrade', {
        planName: selectedPlan,
        interval: selectedInterval,
      });
      setIsUpgradeOpen(false);
      await fetchSubscriptions();
    } catch (err: any) {
      setUpgradeError(err.response?.data?.error || 'Failed to upgrade plan.');
    } finally {
      setUpgrading(false);
    }
  };

  const handleSimulateCycle = async () => {
    setSimulating(true);
    setSimResult(null);
    try {
      const res = await api.post('/subscriptions/simulate-billing-cycle');
      const { invoice, payment } = res.data;
      setSimResult({
        invoiceNum: invoice.invoiceNumber,
        amount: invoice.amount,
        status: payment.status,
      });
      await fetchSubscriptions();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to simulate billing cycle.');
    } finally {
      setSimulating(false);
    }
  };

  const activeSub = subs.find(s => s.status === 'ACTIVE' || s.status === 'TRIALING') || subs[0];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Title Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight text-white font-editorial">
          Workspace Settings
        </h1>
        <p className="text-white/60 text-sm">
          Configure subscription structures, metadata parameters, API endpoints, and credential keys.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Left Side: General Forms */}
        <div className="md:col-span-8 space-y-6">
          {/* Billing Cycle Simulator */}
          <div className="glass-panel p-6 rounded-2xl border border-brand-accent/20 bg-brand-accent/2 space-y-4">
            <h3 className="font-semibold text-white text-sm flex items-center gap-2 border-b border-white/5 pb-3">
              <RefreshCw size={16} className="text-brand-accent animate-pulse" />
              SaaS Billing Engine Simulator
            </h3>
            <p className="text-xs text-white/60 leading-relaxed">
              Trigger a mock billing cycle run. This processes API metrics, creates a new Invoice, and attempts a transaction charge through our test gateway. Payments fail with a 15% rate to populate smart-retry charts.
            </p>

            {simResult && (
              <div className={`p-4 rounded-xl border text-xs space-y-1 flex flex-col ${
                simResult.status === 'SUCCESS'
                  ? 'border-green-500/20 bg-green-500/5 text-green-300'
                  : 'border-red-500/20 bg-red-500/5 text-red-300'
              }`}>
                <div className="flex justify-between font-semibold items-center">
                  <span>Cycle Execution Log: {simResult.status}</span>
                  <button onClick={() => setSimResult(null)} className="text-white/40 hover:text-white cursor-pointer"><X size={14} /></button>
                </div>
                <p className="text-[11px] text-white/50">
                  Generated Invoice **{simResult.invoiceNum}** of amount **${simResult.amount.toFixed(2)}**. Payment gateway log recorded.
                </p>
              </div>
            )}

            <button
              onClick={handleSimulateCycle}
              disabled={simulating || isViewer}
              className="w-full py-3 bg-brand-accent hover:bg-brand-accent/90 text-[#050816] rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {simulating ? (
                <>Simulating Execution...</>
              ) : (
                <>Run Automated Cycle Run</>
              )}
            </button>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-white/5 space-y-6">
            <h3 className="font-semibold text-white text-sm flex items-center gap-2 border-b border-white/5 pb-3">
              <SettingsIcon size={16} className="text-brand-primary" />
              Company Details
            </h3>

            <form onSubmit={handleSaveSettings} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-white/60 uppercase">Company Name</label>
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    disabled={!isAdmin}
                    className="w-full px-3 py-2 bg-white/2 border border-white/8 rounded-xl text-xs text-white outline-none focus:border-brand-primary disabled:opacity-50"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-white/60 uppercase">Web Domain</label>
                  <input
                    type="text"
                    value={companyDomain}
                    onChange={(e) => setCompanyDomain(e.target.value)}
                    disabled={!isAdmin}
                    className="w-full px-3 py-2 bg-white/2 border border-white/8 rounded-xl text-xs text-white outline-none focus:border-brand-primary disabled:opacity-50"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-white/60 uppercase">Webhook Event Endpoint</label>
                <input
                  type="url"
                  value={webhookUrl}
                  onChange={(e) => setWebhookUrl(e.target.value)}
                  disabled={!isAdmin}
                  className="w-full px-3 py-2 bg-white/2 border border-white/8 rounded-xl text-xs text-white outline-none focus:border-brand-primary disabled:opacity-50 font-mono"
                />
              </div>

              {isAdmin && (
                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-4 py-2 bg-brand-primary hover:bg-brand-primary/90 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    {saving ? (
                      'Saving...'
                    ) : success ? (
                      <>
                        Saved! <Check size={12} />
                      </>
                    ) : (
                      <>
                        Save Changes <Save size={12} />
                      </>
                    )}
                  </button>
                </div>
              )}
            </form>
          </div>

          {/* API Keys Panel */}
          <div className="glass-panel p-6 rounded-2xl border border-white/5 space-y-6">
            <h3 className="font-semibold text-white text-sm flex items-center gap-2 border-b border-white/5 pb-3">
              <Key size={16} className="text-brand-accent" />
              API Credentials
            </h3>

            <div className="space-y-4">
              <div className="p-3 bg-white/2 rounded-xl border border-white/5 space-y-2">
                <div className="flex justify-between items-center text-[10px] font-bold text-white/40 uppercase">
                  <span>SANDBOX PUBLIC KEY</span>
                  <span className="text-brand-accent font-semibold">Active</span>
                </div>
                <div className="font-mono text-xs text-white/80 select-all overflow-x-auto whitespace-nowrap">
                  pk_test_ledgerflow_8d8b671aef4255ce18a221f7bb9c
                </div>
              </div>

              <div className="p-3 bg-white/2 rounded-xl border border-white/5 space-y-2">
                <div className="flex justify-between items-center text-[10px] font-bold text-white/40 uppercase">
                  <span>SECRET KEY</span>
                  <span className="text-red-400 font-semibold">Protected</span>
                </div>
                <div className="font-mono text-xs text-white/80 select-all overflow-x-auto whitespace-nowrap">
                  sk_test_ledgerflow••••••••••••••••••••••••••••••••
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Plan details and Role card */}
        <div className="md:col-span-4 space-y-6">
          {/* Subscription plan */}
          <div className="glass-panel p-6 rounded-2xl border border-white/5 space-y-4">
            <h3 className="font-semibold text-white text-sm flex items-center gap-2">
              <CreditCard size={16} className="text-brand-primary" />
              Plan Subscription
            </h3>

            {loading ? (
              <div className="py-6 flex justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-brand-primary" />
              </div>
            ) : activeSub ? (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-brand-primary/10 border border-brand-primary/20 text-center space-y-1">
                  <span className="text-[10px] font-bold uppercase text-brand-primary tracking-wider">Active plan</span>
                  <h4 className="text-lg font-bold text-white font-editorial">{activeSub.planName}</h4>
                  <span className="text-xs text-white/60 font-mono">${activeSub.price}/{activeSub.interval}</span>
                </div>

                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between text-white/50">
                    <span>Billing Status</span>
                    <span className="font-semibold text-brand-accent uppercase tracking-wide">{activeSub.status}</span>
                  </div>
                  <div className="flex justify-between text-white/50">
                    <span>Provision Date</span>
                    <span className="font-semibold text-white/80">
                      {new Date(activeSub.startDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {!isViewer && (
                  <button
                    onClick={() => setIsUpgradeOpen(true)}
                    className="w-full py-2 bg-white/2 hover:bg-white/5 border border-white/8 rounded-xl text-xs font-semibold text-white transition-all cursor-pointer"
                  >
                    Upgrade Tier
                  </button>
                )}
              </div>
            ) : (
              <p className="text-xs text-white/40 text-center py-4">No active subscription plan found.</p>
            )}
          </div>

          {/* User profile Summary card */}
          <div className="glass-panel p-6 rounded-2xl border border-white/5 space-y-4">
            <h3 className="font-semibold text-white text-sm flex items-center gap-2">
              <Shield size={16} className="text-green-400" />
              Logged User Profile
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-[9px] font-bold text-white/40 uppercase tracking-wider block">NAME</span>
                <span className="font-semibold text-white">{user?.firstName} {user?.lastName}</span>
              </div>
              <div>
                <span className="text-[9px] font-bold text-white/40 uppercase tracking-wider block">EMAIL</span>
                <span className="font-semibold text-white/80 font-mono">{user?.email}</span>
              </div>
              <div>
                <span className="text-[9px] font-bold text-white/40 uppercase tracking-wider block">WORKSPACE ROLE</span>
                <span className="inline-flex px-2 py-0.5 mt-1 rounded-full text-[9px] font-bold bg-green-500/20 text-green-300 border border-green-500/20 uppercase tracking-wider">
                  {user?.role}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Upgrade Plan Modal */}
      {isUpgradeOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-sm glass-panel p-6 rounded-2xl border border-white/10 space-y-6 text-left relative">
            <div className="flex justify-between items-center">
              <h3 className="text-base font-semibold text-white">Upgrade Subscription Tier</h3>
              <button onClick={() => setIsUpgradeOpen(false)} className="text-white/40 hover:text-white cursor-pointer">
                <X size={18} />
              </button>
            </div>

            {upgradeError && (
              <div className="p-3 rounded-lg bg-red-500/15 border border-red-500/20 text-red-300 text-xs flex items-center gap-2">
                <AlertCircle size={14} />
                <span>{upgradeError}</span>
              </div>
            )}

            <form onSubmit={handleUpgradePlan} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-white/60 uppercase">Select plan</label>
                <select
                  value={selectedPlan}
                  onChange={(e) => setSelectedPlan(e.target.value as any)}
                  className="w-full px-3 py-2 bg-[#0b1220] border border-white/8 rounded-xl text-xs text-white outline-none focus:border-brand-primary"
                >
                  <option value="Startup" className="bg-[#050816]">Startup ($29/mo)</option>
                  <option value="Growth" className="bg-[#050816]">Growth ($99/mo)</option>
                  <option value="Enterprise" className="bg-[#050816]">Enterprise ($999/mo)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-white/60 uppercase">Billing Cycle</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setSelectedInterval('MONTHLY')}
                    className={`py-2 px-3 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                      selectedInterval === 'MONTHLY'
                        ? 'border-brand-primary bg-brand-primary/10 text-white'
                        : 'border-white/5 bg-[#0b1220] text-white/50'
                    }`}
                  >
                    Monthly Rate
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedInterval('YEARLY')}
                    className={`py-2 px-3 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                      selectedInterval === 'YEARLY'
                        ? 'border-brand-primary bg-brand-primary/10 text-white'
                        : 'border-white/5 bg-[#0b1220] text-white/50'
                    }`}
                  >
                    Yearly (20% Off)
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={upgrading}
                className="w-full py-3 bg-brand-primary rounded-xl text-white font-semibold text-xs flex justify-center items-center gap-1.5 hover:shadow-[0_0_15px_rgba(109,93,246,0.3)] transition-all cursor-pointer disabled:opacity-50"
              >
                {upgrading ? 'Upgrading...' : 'Provision Subscription'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
