import React, { useState } from 'react';
import { BookOpen, Code2, Calculator, Check, Copy, Terminal, FileText, ChevronRight } from 'lucide-react';

export const Resources: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'docs' | 'api' | 'roi'>('docs');
  const [selectedLanguage, setSelectedLanguage] = useState<'node' | 'curl' | 'python'>('node');
  const [copied, setCopied] = useState(false);

  // ROI Calculator states
  const [monthlyInvoices, setMonthlyInvoices] = useState(120);
  const [leakageRate, setLeakageRate] = useState(2.5); // % billing leakage

  const codeSnippets = {
    node: `// Initialize LedgerFlow Client
import { LedgerFlow } from '@ledgerflow/sdk';
const lf = new LedgerFlow({ apiKey: 'lf_live_...' });

// Record a usage event for a customer
await lf.events.create({
  customerId: 'cust_9a2b8c',
  eventName: 'api_request',
  timestamp: new Date(),
  properties: {
    endpoints: '/v1/models',
    tokenCount: 4096
  }
});`,
    curl: `curl -X POST https://api.ledgerflow.io/v1/events \\
  -H "Authorization: Bearer lf_live_..." \\
  -H "Content-Type: application/json" \\
  -d '{
    "customerId": "cust_9a2b8c",
    "eventName": "api_request",
    "properties": {
      "endpoints": "/v1/models",
      "tokenCount": 4096
    }
  }'`,
    python: `# Initialize Python Client
from ledgerflow import LedgerFlow
lf = LedgerFlow(api_key='lf_live_...')

# Track seat allocation change
lf.events.create(
    customer_id='cust_9a2b8c',
    event_name='seat_allocated',
    properties={
        'new_seats': 12,
        'role': 'BillingManager'
    }
)`
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(codeSnippets[selectedLanguage]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // ROI calculations
  const avgProcessTimeSec = 300; // 5 mins per manual invoice entry
  const hourlyDevCost = 45; // USD/hour
  const timeSavedHrs = Math.round((monthlyInvoices * avgProcessTimeSec) / 3600);
  const costSaved = Math.round(timeSavedHrs * hourlyDevCost);
  const leakageSaved = Math.round((monthlyInvoices * 125 * leakageRate) / 100); // Assuming $125 avg invoice value
  const totalSavings = costSaved + leakageSaved;

  return (
    <section id="resources" className="relative w-full max-w-7xl mx-auto px-6 lg:px-8 py-24 border-t border-white/5">
      {/* Background neon elements */}
      <div className="absolute top-1/2 left-1/3 -translate-y-1/2 w-[350px] h-[350px] rounded-full bg-brand-accent/5 blur-[120px] pointer-events-none select-none" />

      {/* Header section */}
      <div className="flex flex-col items-center text-center mb-16">
        <span className="text-brand-accent text-xs font-semibold tracking-wider uppercase bg-brand-accent/10 px-3 py-1 rounded-full mb-3">
          Knowledge & Sandbox
        </span>
        <h2 className="text-3xl md:text-5xl font-medium tracking-tight text-white mb-4">
          Developer Resources & Tools
        </h2>
        <p className="text-brand-muted text-sm md:text-base max-w-2xl font-light">
          Everything you need to integrate LedgerFlow, scale your billing pipelines, and measure your cost efficiency.
        </p>
      </div>

      {/* Interactive Tabs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Sidebar Controls */}
        <div className="lg:col-span-4 flex flex-col gap-3">
          <button
            onClick={() => setActiveTab('docs')}
            className={`w-full text-left p-4 rounded-xl flex items-center gap-3 transition-all duration-300 ${
              activeTab === 'docs'
                ? 'bg-brand-primary/10 border border-brand-primary/30 text-white shadow-[0_0_15px_rgba(109,93,246,0.15)]'
                : 'bg-white/3 border border-white/5 text-brand-muted hover:bg-white/5 hover:text-white'
            }`}
          >
            <div className="p-2 rounded-lg bg-white/5">
              <BookOpen size={18} className={activeTab === 'docs' ? 'text-brand-accent' : ''} />
            </div>
            <div>
              <div className="font-semibold text-sm">Documentation & Guides</div>
              <div className="text-xs text-brand-muted mt-0.5">Learn architecture best practices</div>
            </div>
          </button>

          <button
            onClick={() => setActiveTab('api')}
            className={`w-full text-left p-4 rounded-xl flex items-center gap-3 transition-all duration-300 ${
              activeTab === 'api'
                ? 'bg-brand-primary/10 border border-brand-primary/30 text-white shadow-[0_0_15px_rgba(109,93,246,0.15)]'
                : 'bg-white/3 border border-white/5 text-brand-muted hover:bg-white/5 hover:text-white'
            }`}
          >
            <div className="p-2 rounded-lg bg-white/5">
              <Code2 size={18} className={activeTab === 'api' ? 'text-brand-accent' : ''} />
            </div>
            <div>
              <div className="font-semibold text-sm">API Integration Sandbox</div>
              <div className="text-xs text-brand-muted mt-0.5">Explore multi-language templates</div>
            </div>
          </button>

          <button
            onClick={() => setActiveTab('roi')}
            className={`w-full text-left p-4 rounded-xl flex items-center gap-3 transition-all duration-300 ${
              activeTab === 'roi'
                ? 'bg-brand-primary/10 border border-brand-primary/30 text-white shadow-[0_0_15px_rgba(109,93,246,0.15)]'
                : 'bg-white/3 border border-white/5 text-brand-muted hover:bg-white/5 hover:text-white'
            }`}
          >
            <div className="p-2 rounded-lg bg-white/5">
              <Calculator size={18} className={activeTab === 'roi' ? 'text-brand-accent' : ''} />
            </div>
            <div>
              <div className="font-semibold text-sm">Billing ROI Calculator</div>
              <div className="text-xs text-brand-muted mt-0.5">Calculate time & leakage savings</div>
            </div>
          </button>
        </div>

        {/* Tab Panel Display */}
        <div className="lg:col-span-8 glass-panel p-6 md:p-8 rounded-2xl border border-white/8 min-h-[400px] flex flex-col justify-between shadow-2xl relative overflow-hidden">
          {activeTab === 'docs' && (
            <div className="flex flex-col gap-6 animate-in fade-in duration-300">
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">SaaS Billing Guides & Architectures</h3>
                <p className="text-brand-muted text-sm font-light">
                  Read our curated publications written by billing engineers on designing subscription schemas and handling edge cases.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-5 rounded-xl border border-white/5 bg-white/2 hover:bg-white/4 hover:border-brand-primary/30 transition-all duration-300 group cursor-pointer">
                  <span className="text-xs text-brand-accent font-mono">GUIDE #01</span>
                  <h4 className="text-white font-medium mt-1 mb-2 group-hover:text-brand-primary transition-colors flex items-center gap-1">
                    Design Multi-Tenant Seat Limits
                    <ChevronRight size={14} className="transform group-hover:translate-x-1 transition-transform" />
                  </h4>
                  <p className="text-brand-muted text-xs leading-relaxed font-light">
                    How to model user seat allocations in relational databases using Prisma and check role-based permissions at runtime efficiently.
                  </p>
                </div>

                <div className="p-5 rounded-xl border border-white/5 bg-white/2 hover:bg-white/4 hover:border-brand-primary/30 transition-all duration-300 group cursor-pointer">
                  <span className="text-xs text-brand-accent font-mono">GUIDE #02</span>
                  <h4 className="text-white font-medium mt-1 mb-2 group-hover:text-brand-primary transition-colors flex items-center gap-1">
                    Usage Metering At Scale
                    <ChevronRight size={14} className="transform group-hover:translate-x-1 transition-transform" />
                  </h4>
                  <p className="text-brand-muted text-xs leading-relaxed font-light">
                    Best practices for logging API usage events in real-time, preventing race conditions, and aggregating usage hourly for invoices.
                  </p>
                </div>

                <div className="p-5 rounded-xl border border-white/5 bg-white/2 hover:bg-white/4 hover:border-brand-primary/30 transition-all duration-300 group cursor-pointer">
                  <span className="text-xs text-brand-accent font-mono">WHITE PAPER</span>
                  <h4 className="text-white font-medium mt-1 mb-2 group-hover:text-brand-primary transition-colors flex items-center gap-1">
                    Handling Global Billing Compliances
                    <ChevronRight size={14} className="transform group-hover:translate-x-1 transition-transform" />
                  </h4>
                  <p className="text-brand-muted text-xs leading-relaxed font-light">
                    Learn about EU VAT, USA Sales Tax regulations, and using Stripe Tax integrations within custom Express middleware routers.
                  </p>
                </div>

                <div className="p-5 rounded-xl border border-white/5 bg-white/2 hover:bg-white/4 hover:border-brand-primary/30 transition-all duration-300 group cursor-pointer">
                  <span className="text-xs text-brand-accent font-mono">DEV BLOG</span>
                  <h4 className="text-white font-medium mt-1 mb-2 group-hover:text-brand-primary transition-colors flex items-center gap-1">
                    Migrating Postgres to SQLite in Dev
                    <ChevronRight size={14} className="transform group-hover:translate-x-1 transition-transform" />
                  </h4>
                  <p className="text-brand-muted text-xs leading-relaxed font-light">
                    How using SQLite for development boosts execution speed, sandbox agility, and allows fully mockable offline application verification.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'api' && (
            <div className="flex flex-col gap-6 animate-in fade-in duration-300 flex-grow">
              <div className="flex justify-between items-center flex-wrap gap-4">
                <div>
                  <h3 className="text-xl font-semibold text-white">SDK Quick Integration</h3>
                  <p className="text-brand-muted text-xs font-light mt-0.5">
                    Start tracking events and managing plans with less than 10 lines of code.
                  </p>
                </div>
                {/* Language Toggles */}
                <div className="flex items-center gap-1 bg-white/3 border border-white/5 rounded-lg p-0.5">
                  {(['node', 'curl', 'python'] as const).map((lang) => (
                    <button
                      key={lang}
                      onClick={() => setSelectedLanguage(lang)}
                      className={`px-3 py-1 rounded-md text-xs font-semibold transition-all duration-200 capitalize ${
                        selectedLanguage === lang
                          ? 'bg-brand-primary text-white shadow-md'
                          : 'text-brand-muted hover:text-white'
                      }`}
                    >
                      {lang === 'node' ? 'Node.js' : lang}
                    </button>
                  ))}
                </div>
              </div>

              {/* Code window */}
              <div className="relative rounded-xl border border-white/8 bg-black/45 font-mono text-xs overflow-hidden flex-grow flex flex-col mt-2">
                <div className="flex items-center justify-between px-4 py-2.5 bg-white/3 border-b border-white/5">
                  <div className="flex items-center gap-1.5">
                    <Terminal size={14} className="text-brand-accent" />
                    <span className="text-[11px] text-brand-muted">ledgerflow_quickstart.{selectedLanguage === 'python' ? 'py' : selectedLanguage === 'node' ? 'js' : 'sh'}</span>
                  </div>
                  <button
                    onClick={handleCopy}
                    className="p-1 text-brand-muted hover:text-white hover:bg-white/5 rounded transition-colors flex items-center gap-1 text-[11px]"
                  >
                    {copied ? <Check size={12} className="text-green-400" /> : <Copy size={12} />}
                    {copied ? 'Copied!' : 'Copy Code'}
                  </button>
                </div>
                <pre className="p-4 overflow-x-auto text-white/90 leading-relaxed max-h-[250px]">
                  <code>{codeSnippets[selectedLanguage]}</code>
                </pre>
              </div>
            </div>
          )}

          {activeTab === 'roi' && (
            <div className="flex flex-col gap-6 animate-in fade-in duration-300">
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">Billing Leakage & Efficiency Estimator</h3>
                <p className="text-brand-muted text-sm font-light">
                  See how much dev hours and revenue you save annually by replacing manual ledger calculations with LedgerFlow pipelines.
                </p>
              </div>

              {/* Inputs */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white/2 border border-white/5 rounded-xl p-5">
                <div className="flex flex-col gap-2">
                  <label className="text-xs text-white font-medium flex justify-between">
                    <span>Monthly Custom Invoices Processed:</span>
                    <span className="text-brand-accent font-bold font-mono">{monthlyInvoices}</span>
                  </label>
                  <input
                    type="range"
                    min="10"
                    max="1000"
                    step="10"
                    value={monthlyInvoices}
                    onChange={(e) => setMonthlyInvoices(Number(e.target.value))}
                    className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-brand-primary"
                  />
                  <span className="text-[10px] text-brand-muted">Adjust scale to estimate volume size.</span>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-xs text-white font-medium flex justify-between">
                    <span>Assumed Revenue Leakage (failed cards, underbilling):</span>
                    <span className="text-brand-accent font-bold font-mono">{leakageRate}%</span>
                  </label>
                  <input
                    type="range"
                    min="0.5"
                    max="8.0"
                    step="0.5"
                    value={leakageRate}
                    onChange={(e) => setLeakageRate(Number(e.target.value))}
                    className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-brand-primary"
                  />
                  <span className="text-[10px] text-brand-muted">Percentage of lost revenue saved by auto-reminders.</span>
                </div>
              </div>

              {/* Outputs */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl border border-white/5 bg-white/2 flex flex-col justify-center">
                  <span className="text-[10px] text-brand-muted uppercase font-semibold">Dev Time Restored</span>
                  <div className="text-2xl font-bold text-white mt-1 font-mono">{timeSavedHrs} <span className="text-xs text-brand-muted">Hrs / yr</span></div>
                  <p className="text-[10px] text-brand-muted mt-1 leading-tight">No manual database queries or log auditing.</p>
                </div>

                <div className="p-4 rounded-xl border border-white/5 bg-white/2 flex flex-col justify-center">
                  <span className="text-[10px] text-brand-muted uppercase font-semibold">Recovery Cash Flow</span>
                  <div className="text-2xl font-bold text-green-400 mt-1 font-mono">${leakageSaved} <span className="text-xs text-brand-muted">/ yr</span></div>
                  <p className="text-[10px] text-brand-muted mt-1 leading-tight">AI smart retries auto-recover invoices.</p>
                </div>

                <div className="p-4 rounded-xl border border-white/5 bg-brand-primary/10 border-brand-primary/20 flex flex-col justify-center shadow-[0_0_15px_rgba(109,93,246,0.1)]">
                  <span className="text-[10px] text-brand-accent uppercase font-bold">Total Annual Savings</span>
                  <div className="text-3xl font-extrabold text-white mt-1 font-mono">${totalSavings}</div>
                  <p className="text-[10px] text-brand-muted mt-1 leading-tight font-light">Estimated ROI based on industry benchmarks.</p>
                </div>
              </div>
            </div>
          )}

          {/* Footer info link */}
          <div className="flex justify-between items-center mt-6 pt-4 border-t border-white/5 text-xs text-brand-muted">
            <span className="flex items-center gap-1.5">
              <FileText size={14} className="text-brand-accent" /> Need enterprise SLAs?
            </span>
            <a href="#contact" className="text-white hover:text-brand-primary font-semibold flex items-center gap-0.5 transition-colors">
              Request customization <ChevronRight size={12} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
