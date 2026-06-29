import React, { useState } from 'react';
import { ArrowRight, Activity, Mail } from 'lucide-react';

export const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    setEmail('');
    setTimeout(() => setSubscribed(false), 3000);
  };

  const footerLinks = {
    Platform: ['Features', 'API Reference', 'SDKs', 'Security', 'Status'],
    Solutions: ['SaaS Billing', 'Usage Models', 'Enterprise Accounts', 'Global Taxes'],
    Resources: ['Documentation', 'Guides', 'Billing Blog', 'Customer Stories', 'Pricing Sandbox'],
    Company: ['About Us', 'Careers', 'Brand Kit', 'Newsroom', 'Contact'],
  };

  return (
    <footer
      id="company"
      style={{
        borderTop: '1px solid rgba(255, 255, 255, 0.05)',
        background: 'rgba(5, 8, 22, 0.4)',
        backdropFilter: 'blur(20px)',
        position: 'relative',
        zIndex: 10,
        padding: '100px 20px 40px 20px',
        width: '100%'
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* Top Section: Editorial Callout + Form */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '40px', paddingBottom: '80px', borderBottom: '1px solid rgba(255,255,255,0.05)', marginBottom: '60px' }}>
          {/* Big Editorial Quote */}
          <div style={{ gridColumn: 'span 12' }} className="lg:col-span-7">
            <h2 className="font-editorial" style={{ fontSize: 'clamp(2.2rem, 5vw, 3.8rem)', fontWeight: 400, fontStyle: 'italic', lineHeight: 1.1, color: '#fff' }}>
              Future-proof your billing infrastructure. <br/>
              <span className="shiny-text" style={{ fontWeight: 700 }}>Build with LedgerFlow.</span>
            </h2>
          </div>

          {/* Form */}
          <div style={{ gridColumn: 'span 12', display: 'flex', flexDirection: 'column', justifyContent: 'center' }} className="lg:col-span-5">
            <p style={{ fontSize: '0.85rem', color: 'var(--muted-color)', marginBottom: '16px' }}>
              Subscribe to the LedgerFlow Journal for architecture design tips, billing templates, and engineering updates.
            </p>
            <form onSubmit={handleSubscribe} style={{ position: 'relative', display: 'flex', width: '100%' }}>
              <div style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--muted-color)', display: 'flex', alignItems: 'center' }}>
                <Mail size={16} />
              </div>
              <input
                type="email"
                placeholder="Enter your work email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  width: '100%',
                  padding: '16px 140px 16px 48px',
                  borderRadius: '9999px',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  background: 'rgba(255, 255, 255, 0.03)',
                  color: '#fff',
                  fontSize: '0.9rem',
                  outline: 'none',
                  transition: 'var(--transition-smooth)'
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = 'var(--primary-color)';
                  e.currentTarget.style.boxShadow = '0 0 15px rgba(109, 93, 246, 0.2)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              />
              <button
                type="submit"
                style={{
                  position: 'absolute',
                  right: '6px',
                  top: '6px',
                  bottom: '6px',
                  background: 'var(--primary-color)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '9999px',
                  padding: '0 20px',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  transition: 'var(--transition-smooth)'
                }}
              >
                {subscribed ? 'Subscribed' : 'Subscribe'}
                <ArrowRight size={12} />
              </button>
            </form>
          </div>
        </div>

        {/* Links Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '40px', paddingBottom: '60px' }}>
          
          {/* Brand Info */}
          <div style={{ gridColumn: 'span 12' }} className="lg:col-span-4">
            <a href="#" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none', color: '#fff', marginBottom: '20px' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #6D5DF6, #22D3EE)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 15px rgba(109, 93, 246, 0.4)'
              }}>
                <Activity size={18} color="#fff" />
              </div>
              <span style={{ fontWeight: 700, fontSize: '1.25rem', letterSpacing: '-0.5px' }}>
                Ledger<span style={{ color: 'var(--accent-color)' }}>Flow</span>
              </span>
            </a>
            <p style={{ fontSize: '0.8rem', color: 'var(--muted-color)', lineHeight: 1.6, maxWidth: '280px' }}>
              Role-Based SaaS Billing & Subscription Management Platform designed for hyper-growth entities.
            </p>
          </div>

          {/* Links Columns */}
          <div style={{ gridColumn: 'span 12' }} className="lg:col-span-8">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }} className="sm:grid-cols-2 lg:grid-cols-4">
              {Object.entries(footerLinks).map(([title, links]) => (
                <div key={title} style={{ gridColumn: 'span 1' }}>
                  <h5 style={{ color: '#fff', fontSize: '0.85rem', fontWeight: 600, marginBottom: '18px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{title}</h5>
                  <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {links.map((link) => (
                      <li key={link}>
                        <a
                          href={`#${link.toLowerCase().replace(/\s+/g, '-')}`}
                          style={{ color: 'var(--muted-color)', fontSize: '0.8rem', textDecoration: 'none', transition: 'var(--transition-smooth)' }}
                          onMouseEnter={(e) => (e.currentTarget.style.color = '#fff')}
                          onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--muted-color)')}
                        >
                          {link}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom copyright / policy row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '30px' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--muted-color)' }}>
            © {new Date().getFullYear()} LedgerFlow Inc. All rights reserved.
          </span>
          <div style={{ display: 'flex', gap: '20px', fontSize: '0.75rem' }}>
            {['Privacy Policy', 'Terms of Service', 'Security Trust', 'CCPA'].map((policy) => (
              <a key={policy} href={`#${policy.toLowerCase().replace(/\s+/g, '-')}`} style={{ color: 'var(--muted-color)', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={(e) => (e.currentTarget.style.color = '#fff')} onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--muted-color)')}>
                {policy}
              </a>
            ))}
          </div>
        </div>

      </div>

      <style>{`
        @media (min-width: 1024px) {
          .lg\\:col-span-7 { grid-column: span 7 !important; }
          .lg\\:col-span-5 { grid-column: span 5 !important; }
          .lg\\:col-span-4 { grid-column: span 4 !important; }
          .lg\\:col-span-8 { grid-column: span 8 !important; }
          .lg\\:grid-cols-4 { grid-template-columns: repeat(4, 1fr) !important; }
        }
        @media (max-width: 640px) {
          .sm\\:grid-cols-2 { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>
    </footer>
  );
};
