import React, { useRef } from 'react';
import { Shield, Sparkles, Globe, Zap } from 'lucide-react';

interface BentoCardProps {
  icon: React.ReactNode;
  tag: string;
  title: string;
  description: string;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

const BentoCard: React.FC<BentoCardProps> = ({ icon, tag, title, description, className = '', style = {}, children }) => {
  const cardRef = useRef<HTMLDivElement | null>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.setProperty('--mouse-x', `${x}px`);
    card.style.setProperty('--mouse-y', `${y}px`);
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      className={`glass-card bento-item glow-card-container ${className}`}
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'relative',
        overflow: 'hidden',
        ...style
      }}
    >
      {/* Dynamic Cursor Light Spotlight */}
      <div className="glow-card-spotlight" />

      {/* Card Content Wrapper */}
      <div style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
        <div>
          {/* Header Icon + Tag */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div style={{
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              padding: '10px',
              borderRadius: '12px',
              color: 'var(--accent-color)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {icon}
            </div>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--muted-color)', textTransform: 'uppercase', letterSpacing: '1px' }}>
              {tag}
            </span>
          </div>

          {/* Title & Desc */}
          <h4 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#fff', marginBottom: '8px' }}>{title}</h4>
          <p style={{ fontSize: '0.85rem', color: 'var(--muted-color)', lineHeight: 1.5 }}>{description}</p>
        </div>

        {/* Visual elements slot */}
        {children && (
          <div style={{ marginTop: '20px', flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {children}
          </div>
        )}
      </div>
    </div>
  );
};

export const BentoFeatures: React.FC = () => {
  return (
    <section
      id="platform"
      style={{
        padding: '120px 20px',
        position: 'relative',
        maxWidth: '1200px',
        margin: '0 auto',
        width: '100%',
      }}
    >
      {/* Title */}
      <div style={{ textAlign: 'center', marginBottom: '60px' }}>
        <span style={{ fontSize: '0.85rem', color: 'var(--accent-color)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '2px' }}>
          Engine Architecture
        </span>
        <h3 style={{ fontSize: 'clamp(2rem, 4vw, 3.2rem)', fontWeight: 800, marginTop: '10px', letterSpacing: '-1px' }}>
          Built For <span className="font-editorial shiny-text">Hyper-growth Startups</span>
        </h3>
        <p style={{ color: 'var(--muted-color)', maxWidth: '580px', margin: '15px auto 0 auto', fontSize: '1rem' }}>
          Every component of LedgerFlow is engineered for modern subscription scaling, developer simplicity, and optimal conversion.
        </p>
      </div>

      {/* Bento Grid */}
      <div className="bento-container">
        {/* Card 1: Role-Based controls */}
        <BentoCard
          icon={<Shield size={20} />}
          tag="Entitlements"
          title="Role-Based Subscription Gateways"
          description="Provision custom permissions automatically. Control subscription weights based on developer workspaces, reader profiles, or active admin sessions, integrated directly with SSO providers."
          className="large"
        >
          {/* Custom Visual: Role Grid */}
          <div style={{ display: 'flex', gap: '10px', width: '100%', maxWidth: '400px', height: '80px', marginTop: '10px' }}>
            {['BillingAdmin', 'LeadEngineer', 'FinancialReader'].map((role, idx) => (
              <div
                key={role}
                style={{
                  flex: 1,
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                  borderRadius: '10px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  padding: '12px',
                  position: 'relative'
                }}
              >
                <div style={{ fontSize: '0.65rem', color: 'var(--muted-color)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Role</div>
                <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#fff', marginTop: '2px', fontFamily: 'var(--font-code)' }}>{role}</div>
                <span style={{
                  position: 'absolute',
                  top: '8px',
                  right: '8px',
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  backgroundColor: idx === 0 ? 'var(--primary-color)' : idx === 1 ? 'var(--accent-color)' : '#10b981'
                }} />
              </div>
            ))}
          </div>
        </BentoCard>

        {/* Card 2: AI Dunning */}
        <BentoCard
          icon={<Sparkles size={20} />}
          tag="Recovery"
          title="Smart-Retry Engine"
          description="Eliminate involuntary churn. LedgerFlow's machine learning retries failed credit card charges dynamically, choosing optimal hours to recover up to 92% of leakages."
        >
          {/* Animated visual of success check */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px' }}>
            <div style={{
              background: 'rgba(34, 211, 238, 0.1)',
              border: '1px solid rgba(34, 211, 238, 0.2)',
              borderRadius: '50%',
              padding: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Zap size={24} color="var(--accent-color)" />
            </div>
            <span style={{ fontSize: '0.75rem', color: '#fff', fontWeight: 600, marginTop: '5px' }}>92.4% Auto Recovery Rate</span>
          </div>
        </BentoCard>

        {/* Card 3: Dynamic meters */}
        <BentoCard
          icon={<Zap size={20} />}
          tag="Performance"
          title="Real-Time Event Streams"
          description="Process transaction logs instantly. Meter billions of API transactions at sub-second latency with real-time billing compiler pipelines."
          className="tall"
        >
          {/* Visual: Bar Chart Vertical Stack */}
          <div style={{ display: 'flex', gap: '15px', alignItems: 'flex-end', height: '180px', width: '100%', maxWidth: '140px', justifyContent: 'center' }}>
            {[40, 70, 50, 90, 60, 100].map((h, idx) => (
              <div
                key={idx}
                style={{
                  flex: 1,
                  background: idx === 5 ? 'var(--accent-color)' : idx === 3 ? 'var(--primary-color)' : 'rgba(255,255,255,0.05)',
                  height: `${h}%`,
                  borderRadius: '4px',
                  boxShadow: idx === 5 ? '0 0 15px rgba(34,211,238,0.4)' : idx === 3 ? '0 0 15px rgba(109,93,246,0.4)' : 'none',
                  transition: 'height 0.5s ease'
                }}
              />
            ))}
          </div>
        </BentoCard>

        {/* Card 4: Global compliance */}
        <BentoCard
          icon={<Globe size={20} />}
          tag="Compliance"
          title="Global Taxes & Localization"
          description="Stay tax compliant anywhere. LedgerFlow automatically calculates, compiles, and files VAT, GST, and local sales taxes across 150+ countries with local entity structures built directly into the core ledger."
          className="large"
        >
          {/* SVG World Map / Grid matrix */}
          <div style={{ width: '100%', maxWidth: '380px', height: '100px', opacity: 0.7, position: 'relative' }}>
            <svg viewBox="0 0 400 100" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
              {/* World nodes */}
              <circle cx="60" cy="40" r="3" fill="#fff" />
              <circle cx="120" cy="50" r="4" fill="var(--accent-color)" />
              <circle cx="210" cy="30" r="3.5" fill="var(--primary-color)" />
              <circle cx="280" cy="65" r="5" fill="var(--accent-color)" />
              <circle cx="340" cy="45" r="3" fill="#fff" />
              
              {/* Connected pathways */}
              <path d="M 60 40 Q 90 20 120 50 T 210 30 T 280 65 T 340 45" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1" strokeDasharray="4 4" />
              <path d="M 120 50 Q 165 60 210 30" fill="none" stroke="var(--primary-color)" strokeWidth="1.5" opacity="0.4" />
              <path d="M 210 30 Q 245 40 280 65" fill="none" stroke="var(--accent-color)" strokeWidth="1.5" opacity="0.4" />

              {/* Pulsing highlights */}
              <circle cx="120" cy="50" r="8" fill="var(--accent-color)" opacity="0.3" />
              <circle cx="280" cy="65" r="10" fill="var(--accent-color)" opacity="0.25" />
            </svg>
          </div>
        </BentoCard>
      </div>
    </section>
  );
};
