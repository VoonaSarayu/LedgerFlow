import React, { useState, useEffect } from 'react';
import { Mail, MessageSquare, Send, CheckCircle2, ShieldCheck, HelpCircle, ChevronDown, Activity, Globe } from 'lucide-react';

export const Contact: React.FC = () => {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'success'>('idle');

  // FAQ Accordion state
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Health stats states
  const [latency, setLatency] = useState(24);
  const [activeUsers, setActiveUsers] = useState(482);

  useEffect(() => {
    // Dynamic system simulation
    const interval = setInterval(() => {
      setLatency(prev => Math.max(15, Math.min(45, prev + Math.floor(Math.random() * 7) - 3)));
      setActiveUsers(prev => prev + Math.floor(Math.random() * 5) - 2);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    setStatus('sending');
    setTimeout(() => {
      setStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setStatus('idle'), 4000);
    }, 1800);
  };

  const faqs = [
    {
      q: 'How does the billing integration affect performance?',
      a: 'LedgerFlow operates asynchronously with sub-50ms event metering. Our global API gateways and memory-caching layers ensure database queries do not block critical transaction pathways.'
    },
    {
      q: 'Can we configure custom roles for billing management?',
      a: 'Yes, LedgerFlow contains full role-entitlement tables (Admin, Billing Manager, Viewer). You can update permission mapping via our Admin dashboard or assign permissions directly in the database.'
    },
    {
      q: 'Does it support multi-currency and global taxation?',
      a: 'We support 135+ global currencies and automatically calculate localized sales taxes, VAT, and GST by syncing real-time tax registries at the time of invoice creation.'
    }
  ];

  return (
    <section id="contact" className="relative w-full max-w-7xl mx-auto px-6 lg:px-8 py-24 border-t border-white/5">
      {/* Background glowing gradients */}
      <div className="absolute bottom-0 right-10 w-[400px] h-[400px] rounded-full bg-brand-primary/5 blur-[130px] pointer-events-none select-none" />

      {/* Header section */}
      <div className="flex flex-col items-center text-center mb-16">
        <span className="text-brand-accent text-xs font-semibold tracking-wider uppercase bg-brand-accent/10 px-3 py-1 rounded-full mb-3">
          Get in Touch
        </span>
        <h2 className="text-3xl md:text-5xl font-medium tracking-tight text-white mb-4">
          Connect with Our Engineers
        </h2>
        <p className="text-brand-muted text-sm md:text-base max-w-2xl font-light">
          Have an architecture question or need help modeling custom user models? Reach out directly.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Interactive Form */}
        <div className="lg:col-span-7 glass-panel p-6 md:p-8 rounded-2xl border border-white/8 relative">
          {status === 'success' ? (
            <div className="flex flex-col items-center justify-center text-center py-12 animate-in fade-in duration-300">
              <div className="w-16 h-16 rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center mb-6">
                <CheckCircle2 size={32} className="text-green-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Message Sent Successfully!</h3>
              <p className="text-brand-muted text-sm max-w-md">
                Thanks for reaching out. One of our lead billing engineers will review your inquiry and follow up within 4 hours.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <h3 className="text-xl font-semibold text-white mb-2 flex items-center gap-2">
                <MessageSquare size={20} className="text-brand-accent" /> Drop us a Line
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-brand-muted font-medium">Your Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter your name"
                    className="w-full bg-white/3 border border-white/5 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-brand-primary focus:shadow-[0_0_15px_rgba(109,93,246,0.15)] transition-all duration-300"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-brand-muted font-medium">Work Email</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="name@company.com"
                    className="w-full bg-white/3 border border-white/5 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-brand-primary focus:shadow-[0_0_15px_rgba(109,93,246,0.15)] transition-all duration-300"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-brand-muted font-medium">Subject</label>
                <input
                  type="text"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="e.g., Enterprise SLA custom integration query"
                  className="w-full bg-white/3 border border-white/5 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-brand-primary focus:shadow-[0_0_15px_rgba(109,93,246,0.15)] transition-all duration-300"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-brand-muted font-medium">Message</label>
                <textarea
                  required
                  rows={5}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="How can our engineers help you?"
                  className="w-full bg-white/3 border border-white/5 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-brand-primary focus:shadow-[0_0_15px_rgba(109,93,246,0.15)] resize-none transition-all duration-300"
                />
              </div>

              <button
                type="submit"
                disabled={status === 'sending'}
                className="w-full mt-2 py-4 bg-brand-primary hover:bg-brand-primary/95 text-white font-semibold text-sm rounded-xl flex items-center justify-center gap-2 hover:scale-[1.01] hover:shadow-[0_0_20px_rgba(109,93,246,0.25)] transition-all duration-300 disabled:opacity-50 cursor-pointer"
              >
                {status === 'sending' ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>Sending Transmission...</span>
                  </>
                ) : (
                  <>
                    <Send size={16} />
                    <span>Send Message</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>

        {/* Right Column: FAQ & Engineers Dashboard */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          {/* Engineering Uptime status dashboard */}
          <div className="glass-panel p-5 rounded-2xl border border-white/8">
            <h4 className="text-xs text-brand-muted uppercase font-bold tracking-wider mb-4 flex items-center gap-2">
              <Activity size={14} className="text-brand-accent animate-pulse" /> Engineering Operations Status
            </h4>

            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="bg-white/2 border border-white/5 rounded-xl p-3">
                <span className="text-[10px] text-brand-muted block">API Gateway</span>
                <span className="text-xs text-green-400 font-semibold mt-1 inline-flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-ping" /> Online
                </span>
              </div>
              <div className="bg-white/2 border border-white/5 rounded-xl p-3">
                <span className="text-[10px] text-brand-muted block">API Latency</span>
                <span className="text-xs font-mono font-bold text-white mt-1 block">{latency}ms</span>
              </div>
              <div className="bg-white/2 border border-white/5 rounded-xl p-3">
                <span className="text-[10px] text-brand-muted block">Active Sockets</span>
                <span className="text-xs font-mono font-bold text-brand-accent mt-1 block">{activeUsers}</span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs text-brand-muted">
              <span className="flex items-center gap-1"><ShieldCheck size={14} className="text-brand-accent" /> SOC2 Type II Certified</span>
              <span className="flex items-center gap-1"><Globe size={14} className="text-brand-accent" /> 99.98% SLA Uptime</span>
            </div>
          </div>

          {/* FAQ Accordions */}
          <div className="glass-panel p-5 rounded-2xl border border-white/8 flex flex-col gap-3">
            <h4 className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
              <HelpCircle size={16} className="text-brand-accent" /> Integration FAQ
            </h4>

            {faqs.map((faq, i) => (
              <div key={i} className="border-b border-white/5 pb-2 last:border-0 last:pb-0">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full text-left flex items-center justify-between py-2 text-white hover:text-brand-primary text-xs font-semibold transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    size={14}
                    className={`transform transition-transform duration-300 ${openFaq === i ? 'rotate-180 text-brand-primary' : 'text-brand-muted'}`}
                  />
                </button>
                {openFaq === i && (
                  <p className="text-brand-muted text-[11px] leading-relaxed pt-1 pb-2 font-light animate-in slide-in-from-top-2 duration-200">
                    {faq.a}
                  </p>
                )}
              </div>
            ))}
          </div>

          {/* Quick Contact info */}
          <div className="flex items-center justify-between px-2 text-xs text-brand-muted">
            <a href="mailto:support@ledgerflow.io" className="hover:text-white transition-colors flex items-center gap-1.5">
              <Mail size={14} /> support@ledgerflow.io
            </a>
            <span>San Francisco, CA</span>
          </div>
        </div>
      </div>
    </section>
  );
};
