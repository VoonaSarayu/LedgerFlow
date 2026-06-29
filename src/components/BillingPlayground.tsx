import React, { useState } from 'react';
import { Info, Sparkles } from 'lucide-react';

type ModelType = 'flat' | 'usage' | 'seat' | 'hybrid';

export const BillingPlayground: React.FC = () => {
  const [model, setModel] = useState<ModelType>('hybrid');
  const [usage, setUsage] = useState(150000); // API transactions
  const [seats, setSeats] = useState(25);      // Active users

  // Calculate pricing values based on current model and parameters
  const getBillingDetails = () => {
    let base = 0;
    let usageRate = 0;
    let seatRate = 0;
    let aiDiscount = 0;

    switch (model) {
      case 'flat':
        base = 299;
        break;
      case 'usage':
        base = 49;
        usageRate = 0.0015; // $0.0015 per API call
        break;
      case 'seat':
        base = 99;
        seatRate = 12; // $12 per user
        break;
      case 'hybrid':
        base = 149;
        usageRate = 0.0008; // Discounted usage
        seatRate = 8;       // Discounted seat rate
        aiDiscount = 0.12;  // 12% AI auto-savings
        break;
    }

    const usageTotal = usage * usageRate;
    const seatsTotal = seats * seatRate;
    const subtotal = base + usageTotal + seatsTotal;
    const discountAmount = subtotal * aiDiscount;
    const total = subtotal - discountAmount;

    return {
      base,
      usageRate,
      usageTotal,
      seatRate,
      seatsTotal,
      discountAmount,
      total,
    };
  };

  const { base, usageRate, usageTotal, seatRate, seatsTotal, discountAmount, total } = getBillingDetails();

  return (
    <section
      id="solutions"
      style={{
        padding: '120px 20px',
        position: 'relative',
        maxWidth: '1200px',
        margin: '0 auto',
        width: '100%',
      }}
    >
      <div style={{ textAlign: 'center', marginBottom: '60px' }}>
        <span style={{ fontSize: '0.85rem', color: 'var(--accent-color)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '2px' }}>
          Interactive Sandbox
        </span>
        <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3.2rem)', fontWeight: 800, marginTop: '10px', letterSpacing: '-1px' }}>
          Simulate Your <span className="font-editorial shiny-text">Billing Model</span>
        </h2>
        <p style={{ color: 'var(--muted-color)', maxWidth: '580px', margin: '15px auto 0 auto', fontSize: '1rem' }}>
          Choose a model below, slide variables, and see how LedgerFlow processes and optimizes your invoice structure.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '40px', alignItems: 'stretch' }}>
        {/* Controls Column */}
        <div className="lg:col-span-6 glass-panel" style={{ gridColumn: 'span 12', padding: '30px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '30px', background: 'rgba(11, 18, 32, 0.4)' }}>
          {/* Models Selector */}
          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--muted-color)', fontWeight: 600, display: 'block', marginBottom: '15px' }}>SELECT PRICING LOGIC</span>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
              {(['flat', 'usage', 'seat', 'hybrid'] as ModelType[]).map((type) => (
                <button
                  key={type}
                  onClick={() => setModel(type)}
                  style={{
                    padding: '16px',
                    borderRadius: '12px',
                    border: '1px solid',
                    borderColor: model === type ? 'var(--primary-color)' : 'rgba(255, 255, 255, 0.05)',
                    background: model === type ? 'rgba(109, 93, 246, 0.1)' : 'rgba(255, 255, 255, 0.02)',
                    color: model === type ? '#fff' : 'var(--muted-color)',
                    cursor: 'pointer',
                    textAlign: 'left',
                    fontWeight: 600,
                    fontSize: '0.9rem',
                    transition: 'var(--transition-smooth)',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                >
                  {type === 'hybrid' && (
                    <span style={{
                      position: 'absolute',
                      top: '0',
                      right: '0',
                      background: 'linear-gradient(135deg, #6D5DF6, #22D3EE)',
                      color: '#fff',
                      fontSize: '0.65rem',
                      padding: '2px 8px',
                      borderRadius: '0 0 0 8px',
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '2px'
                    }}>
                      <Sparkles size={8} /> AI
                    </span>
                  )}
                  <span style={{ display: 'block', textTransform: 'capitalize', color: model === type ? '#fff' : '#d1d5db' }}>
                    {type === 'flat' ? 'Flat-Rate' : type === 'usage' ? 'Usage-Based' : type === 'seat' ? 'Seat-Based' : 'Hybrid Model'}
                  </span>
                  <span style={{ fontSize: '0.75rem', fontWeight: 400, color: 'var(--muted-color)', marginTop: '4px', display: 'block' }}>
                    {type === 'flat' ? 'Fixed fee, unlimited scale' : type === 'usage' ? 'Pay-per-transaction' : type === 'seat' ? 'Pay-per-active-member' : 'Optimized blending'}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Sliders variables */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
            {/* Usage Slider */}
            {model !== 'flat' && model !== 'seat' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 500, color: '#fff' }}>API Transactions (Monthly)</span>
                  <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--accent-color)', fontFamily: 'var(--font-code)' }}>
                    {usage.toLocaleString()}
                  </span>
                </div>
                <input
                  type="range"
                  min="10000"
                  max="1000000"
                  step="10000"
                  value={usage}
                  onChange={(e) => setUsage(Number(e.target.value))}
                  className="sandbox-slider"
                />
              </div>
            )}

            {/* Seat Slider */}
            {model !== 'flat' && model !== 'usage' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 500, color: '#fff' }}>Seats Provisioned</span>
                  <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--accent-color)', fontFamily: 'var(--font-code)' }}>
                    {seats} seats
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="200"
                  step="1"
                  value={seats}
                  onChange={(e) => setSeats(Number(e.target.value))}
                  className="sandbox-slider"
                />
              </div>
            )}
          </div>

          {/* Model Description Notes */}
          <div style={{ display: 'flex', gap: '10px', background: 'rgba(255, 255, 255, 0.02)', padding: '15px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.04)' }}>
            <Info size={18} color="var(--accent-color)" style={{ flexShrink: 0 }} />
            <p style={{ fontSize: '0.75rem', color: 'var(--muted-color)', lineHeight: 1.5 }}>
              {model === 'hybrid' && 'Hybrid combines low base rates with optimized consumption charges. AI automatically routes billing retries, reducing failed transaction leakage by 92%.'}
              {model === 'flat' && 'Flat rate provides stability for large enterprise workloads. Invoices are compiled at the end of each billing window with static base fee parameters.'}
              {model === 'usage' && 'Usage models track API meters dynamically. Role permissions dictate access structures, billing calculations compile in real-time down to milliseconds.'}
              {model === 'seat' && 'Seat models scale based on active developer credentials. Access states compile automatically to adjust billing weights at mid-month cycles.'}
            </p>
          </div>
        </div>

        {/* Reactive Invoice Column */}
        <div style={{ gridColumn: 'span 12' }} className="lg:col-span-6 flex items-center justify-center">
          <div style={{
            width: '100%',
            maxWidth: '460px',
            background: 'rgba(11, 18, 32, 0.8)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '24px',
            padding: '30px',
            boxShadow: '0 30px 60px rgba(0, 0, 0, 0.5)',
            position: 'relative',
            margin: '0 auto',
            transform: 'perspective(1000px) rotateY(-5deg)',
          }} className="playground-invoice">
            {/* Top Invoice Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px dashed rgba(255, 255, 255, 0.1)', paddingBottom: '20px', marginBottom: '20px' }}>
              <div>
                <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--muted-color)', fontWeight: 600 }}>BILLING ENGINE INV</span>
                <span style={{ fontSize: '0.9rem', fontWeight: 700, fontFamily: 'var(--font-code)', color: '#fff' }}>LF-2026-X892</span>
              </div>
              <div style={{ textTransform: 'uppercase', background: 'rgba(34, 211, 238, 0.1)', color: 'var(--accent-color)', padding: '4px 10px', borderRadius: '20px', fontSize: '0.7rem', fontWeight: 600 }}>
                Draft
              </div>
            </div>

            {/* Line Items */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', minHeight: '160px' }}>
              {/* Base */}
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                <span style={{ color: 'var(--muted-color)' }}>Base Subscription Charge</span>
                <span style={{ color: '#fff', fontWeight: 500, fontFamily: 'var(--font-code)' }}>${base.toFixed(2)}</span>
              </div>

              {/* Usage Variable Line */}
              {usageRate > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                  <div>
                    <span style={{ color: 'var(--muted-color)', display: 'block' }}>Usage Metering</span>
                    <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', fontFamily: 'var(--font-code)' }}>
                      {usage.toLocaleString()} calls × ${usageRate}
                    </span>
                  </div>
                  <span style={{ color: '#fff', fontWeight: 500, fontFamily: 'var(--font-code)', alignSelf: 'flex-end' }}>
                    ${usageTotal.toFixed(2)}
                  </span>
                </div>
              )}

              {/* Seat Variable Line */}
              {seatRate > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                  <div>
                    <span style={{ color: 'var(--muted-color)', display: 'block' }}>Developer Access Seats</span>
                    <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', fontFamily: 'var(--font-code)' }}>
                      {seats} seats × ${seatRate}/mo
                    </span>
                  </div>
                  <span style={{ color: '#fff', fontWeight: 500, fontFamily: 'var(--font-code)', alignSelf: 'flex-end' }}>
                    ${seatsTotal.toFixed(2)}
                  </span>
                </div>
              )}

              {/* Discount line (AI retry optimizations) */}
              {discountAmount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--accent-color)' }}>
                  <div>
                    <span style={{ fontWeight: 500, display: 'block' }}>AI Smart-Retry Savings</span>
                    <span style={{ fontSize: '0.75rem', color: 'rgba(34, 211, 238, 0.7)' }}>Auto-retries & intelligent routing</span>
                  </div>
                  <span style={{ fontWeight: 600, fontFamily: 'var(--font-code)' }}>
                    -${discountAmount.toFixed(2)}
                  </span>
                </div>
              )}
            </div>

            {/* Total invoice sum with floating calculation details */}
            <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '20px', marginTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ display: 'block', fontSize: '0.8rem', color: 'var(--muted-color)' }}>ESTIMATED TOTAL</span>
                <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.3)' }}>Calculated in real-time</span>
              </div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: '#fff', fontFamily: 'var(--font-code)', display: 'flex', alignItems: 'center' }}>
                ${total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            </div>

            {/* Glowing Corner Accents */}
            <div style={{
              position: 'absolute',
              bottom: '10px',
              right: '10px',
              width: '100px',
              height: '100px',
              background: 'radial-gradient(circle, rgba(34, 211, 238, 0.15) 0%, transparent 70%)',
              pointerEvents: 'none',
              filter: 'blur(10px)'
            }} />
          </div>
        </div>
      </div>
    </section>
  );
};
