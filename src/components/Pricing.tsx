import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Check, Sparkles } from 'lucide-react';

export const Pricing: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('yearly');

  const tiers = [
    {
      name: 'Startup',
      price: billingCycle === 'monthly' ? 29 : 23,
      desc: 'Deploy initial subscription structures and validate early user role models.',
      features: [
        'Up to 15,000 monthly events',
        '5 active team seats',
        'Basic role entitlements',
        'Standard Stripe & PayPal sync',
        'Community Discord support',
      ],
      popular: false,
      cta: 'Start Free Trial',
    },
    {
      name: 'Growth',
      price: billingCycle === 'monthly' ? 99 : 79,
      desc: 'Our flagship tier. For growing startups and platforms scaling user transactions.',
      features: [
        'Up to 150,000 monthly events',
        '25 active team seats',
        'Advanced role-mapping trees',
        'AI Smart-Retry auto-recovery',
        'Full OAuth Identity sync',
        'Next-day developer support',
      ],
      popular: true,
      cta: 'Scale Platform',
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      desc: 'Unlimited volumes, high availability SLAs, and custom identity mappings.',
      features: [
        'Unlimited volume & scale',
        'Custom workspace seats',
        'Dedicated server regions',
        '99.99% execution SLAs',
        'SOC2 audit reporting suite',
        'Dedicated TAM support team',
      ],
      popular: false,
      cta: 'Contact Sales',
    },
  ];

  return (
    <section
      id="pricing"
      style={{
        padding: '120px 20px',
        position: 'relative',
        maxWidth: '1200px',
        margin: '0 auto',
        width: '100%',
      }}
    >
      {/* Background radial soft light blur */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '500px',
        height: '500px',
        background: 'radial-gradient(circle, rgba(109, 93, 246, 0.05) 0%, transparent 70%)',
        zIndex: -1,
        pointerEvents: 'none'
      }} />

      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '60px' }}>
        <span style={{ fontSize: '0.85rem', color: 'var(--accent-color)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '2px' }}>
          Flexible Pricing
        </span>
        <h3 style={{ fontSize: 'clamp(2rem, 4vw, 3.2rem)', fontWeight: 800, marginTop: '10px', letterSpacing: '-1px' }}>
          Scale as You <span className="font-editorial shiny-text">Acquire Customers</span>
        </h3>
        <p style={{ color: 'var(--muted-color)', maxWidth: '580px', margin: '15px auto 0 auto', fontSize: '1rem' }}>
          Start free, deploy roles immediately, and upgrade only when your API call volume starts growing.
        </p>

        {/* Toggle Slider */}
        <div style={{ display: 'inline-flex', alignItems: 'center', background: 'rgba(255, 255, 255, 0.03)', padding: '6px', borderRadius: '9999px', border: '1px solid rgba(255, 255, 255, 0.06)', marginTop: '36px' }}>
          <button
            onClick={() => setBillingCycle('monthly')}
            style={{
              padding: '8px 20px',
              borderRadius: '9999px',
              border: 'none',
              background: billingCycle === 'monthly' ? 'var(--primary-color)' : 'transparent',
              color: billingCycle === 'monthly' ? '#fff' : 'var(--muted-color)',
              fontWeight: 600,
              fontSize: '0.85rem',
              cursor: 'pointer',
              transition: 'var(--transition-smooth)'
            }}
          >
            Monthly
          </button>
          <button
            onClick={() => setBillingCycle('yearly')}
            style={{
              padding: '8px 20px',
              borderRadius: '9999px',
              border: 'none',
              background: billingCycle === 'yearly' ? 'var(--primary-color)' : 'transparent',
              color: billingCycle === 'yearly' ? '#fff' : 'var(--muted-color)',
              fontWeight: 600,
              fontSize: '0.85rem',
              cursor: 'pointer',
              transition: 'var(--transition-smooth)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            Yearly
            <span style={{ fontSize: '0.65rem', background: 'rgba(34, 211, 238, 0.2)', color: 'var(--accent-color)', padding: '2px 6px', borderRadius: '8px' }}>
              Save 20%
            </span>
          </button>
        </div>
      </div>

      {/* Cards container */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '30px', alignItems: 'stretch' }}>
        {tiers.map((tier) => (
          <div
            key={tier.name}
            style={{
              gridColumn: 'span 12',
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              padding: '40px 30px',
              background: tier.popular ? 'rgba(11, 18, 32, 0.75)' : 'rgba(11, 18, 32, 0.45)',
              border: '1px solid',
              borderColor: tier.popular ? 'var(--primary-color)' : 'rgba(255, 255, 255, 0.08)',
              borderRadius: '24px',
              boxShadow: tier.popular ? '0 25px 50px rgba(109, 93, 246, 0.15)' : '0 15px 35px rgba(0,0,0,0.3)',
              transform: tier.popular ? 'scale(1.03)' : 'none',
              zIndex: tier.popular ? 2 : 1,
              transition: 'var(--transition-smooth)'
            }}
            className={`pricing-card lg:col-span-4 ${tier.popular ? 'popular' : ''}`}
          >
            {/* Pop Glow tag */}
            {tier.popular && (
              <span style={{
                position: 'absolute',
                top: '-15px',
                left: '50%',
                transform: 'translateX(-50%)',
                background: 'linear-gradient(135deg, #6D5DF6, #22D3EE)',
                color: '#fff',
                padding: '6px 16px',
                borderRadius: '9999px',
                fontSize: '0.75rem',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                boxShadow: '0 5px 15px rgba(109,93,246,0.3)'
              }}>
                <Sparkles size={12} /> RECOMMENDED
              </span>
            )}

            <div>
              {/* Tier Name */}
              <h4 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#fff', marginBottom: '8px' }}>{tier.name}</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--muted-color)', minHeight: '48px', marginBottom: '24px' }}>{tier.desc}</p>

              {/* Price */}
              <div style={{ display: 'flex', alignItems: 'baseline', color: '#fff', marginBottom: '30px' }}>
                <span style={{ fontSize: '2.5rem', fontWeight: 800 }}>
                  {typeof tier.price === 'number' ? `$${tier.price}` : tier.price}
                </span>
                {typeof tier.price === 'number' && (
                  <span style={{ fontSize: '0.9rem', color: 'var(--muted-color)', marginLeft: '6px' }}>/month</span>
                )}
              </div>

              {/* Feature List */}
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '14px', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '24px', marginBottom: '36px' }}>
                {tier.features.map((feat) => (
                  <li key={feat} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '0.85rem', color: '#e2e8f0' }}>
                    <Check size={16} color="var(--accent-color)" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* CTA Button */}
            <Link
              to={isAuthenticated ? `/dashboard/settings?plan=${tier.name}` : `/signup?plan=${tier.name}`}
              className={`btn-liquid ${tier.popular ? 'btn-primary-liquid' : ''}`}
              style={{ width: '100%', justifyContent: 'center', display: 'inline-flex' }}
            >
              {tier.cta}
            </Link>
          </div>
        ))}
      </div>

      {/* Grid positioning for responsive */}
      <style>{`
        @media (min-width: 1024px) {
          .lg\\:col-span-4 { grid-column: span 4 !important; }
        }
      `}</style>
    </section>
  );
};
