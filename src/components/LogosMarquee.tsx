import React from 'react';

export const LogosMarquee: React.FC = () => {
  // Inline SVGs for elegant editorial client logos
  const logos = [
    {
      name: 'Vercel',
      svg: (
        <svg viewBox="0 0 116 26" width="90" height="20" fill="currentColor">
          <path d="M13.75 2L27.5 24H0L13.75 2Z" />
          <text x="35" y="19" fontFamily="var(--font-primary)" fontWeight="800" fontSize="14" letterSpacing="-0.5px">VERCEL</text>
        </svg>
      )
    },
    {
      name: 'Linear',
      svg: (
        <svg viewBox="0 0 100 26" width="90" height="20" fill="currentColor">
          <circle cx="10" cy="13" r="8" stroke="currentColor" strokeWidth="2.5" fill="none" />
          <path d="M10 5 L10 13 L15 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <text x="25" y="19" fontFamily="var(--font-primary)" fontWeight="700" fontSize="14" letterSpacing="-0.5px">Linear</text>
        </svg>
      )
    },
    {
      name: 'Stripe',
      svg: (
        <svg viewBox="0 0 100 26" width="90" height="20" fill="currentColor">
          <text x="5" y="20" fontFamily="var(--font-primary)" fontWeight="900" fontSize="22" letterSpacing="-1.5px">stripe</text>
        </svg>
      )
    },
    {
      name: 'Framer',
      svg: (
        <svg viewBox="0 0 100 26" width="90" height="20" fill="currentColor">
          <path d="M0 0 H14 V7 L7 14 H21 V21 L14 28 V21 H0 L7 14 H0 Z" transform="scale(0.7) translate(5, 4)" />
          <text x="28" y="19" fontFamily="var(--font-primary)" fontWeight="700" fontSize="14" letterSpacing="-0.5px">Framer</text>
        </svg>
      )
    },
    {
      name: 'Apple',
      svg: (
        <svg viewBox="0 0 100 26" width="90" height="20" fill="currentColor">
          <text x="5" y="19" fontFamily="var(--font-secondary)" fontStyle="italic" fontWeight="600" fontSize="18" letterSpacing="-0.5px">Apple Pay</text>
        </svg>
      )
    },
    {
      name: 'Arc',
      svg: (
        <svg viewBox="0 0 100 26" width="80" height="20" fill="currentColor">
          <text x="10" y="19" fontFamily="var(--font-primary)" fontWeight="800" fontSize="18" letterSpacing="1px">ARC</text>
        </svg>
      )
    }
  ];

  return (
    <div
      style={{
        padding: '60px 0',
        width: '100%',
        position: 'relative',
        zIndex: 10,
        maxWidth: '1200px',
        margin: '0 auto'
      }}
    >
      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <span style={{ fontSize: '0.75rem', color: 'var(--muted-color)', fontWeight: 500, letterSpacing: '1.5px', textTransform: 'uppercase' }}>
          Trusted by Hyper-growth Infrastructure Teams
        </span>
      </div>

      {/* Marquee Wrapper */}
      <div className="marquee-container" style={{ background: 'rgba(255,255,255,0.01)', borderTop: '1px solid rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.03)', padding: '20px 0' }}>
        <div className="marquee-content" style={{ color: 'rgba(255,255,255,0.45)' }}>
          {logos.map((logo, idx) => (
            <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {logo.svg}
            </div>
          ))}
          {/* Duplicate logos to ensure seamless loop */}
          {logos.map((logo, idx) => (
            <div key={`dup-${idx}`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {logo.svg}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
