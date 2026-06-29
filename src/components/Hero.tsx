import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Play } from 'lucide-react';
import { FloatingDashboard } from './FloatingDashboard';

export const Hero: React.FC = () => {
  // Heading text split for letter/word animations
  const line1Words = "Enterprise Billing".split(" ");
  const line2Words = "Built for Modern Businesses".split(" ");

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const wordVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1] as const,
      },
    },
  };

  return (
    <section
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        padding: '120px 20px 60px 20px',
        position: 'relative',
        maxWidth: '1200px',
        margin: '0 auto',
        width: '100%',
      }}
    >
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '40px', width: '100%', alignItems: 'center' }}>
        {/* Left Side: Editorial Typography & Copy */}
        <div style={{ gridColumn: 'span 12' }} className="lg:col-span-6 text-left">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              padding: '6px 14px',
              borderRadius: '9999px',
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              backdropFilter: 'blur(8px)',
              fontSize: '0.8rem',
              fontWeight: 500,
              color: 'var(--accent-color)',
              marginBottom: '28px',
              gap: '6px'
            }}
          >
            <span style={{ display: 'inline-block', width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--accent-color)', animation: 'pulse 1.5s infinite' }} />
            AI Powered Billing Platform
          </motion.div>

          {/* Heading */}
          <motion.h1
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            style={{
              fontSize: 'clamp(2.5rem, 5vw, 4.2rem)',
              lineHeight: 1.1,
              fontWeight: 800,
              letterSpacing: '-1.5px',
              color: '#ffffff',
              marginBottom: '24px',
            }}
          >
            {/* Line 1 */}
            <span style={{ display: 'block', overflow: 'hidden' }}>
              {line1Words.map((word, idx) => (
                <motion.span
                  key={idx}
                  variants={wordVariants}
                  style={{ display: 'inline-block', marginRight: '12px' }}
                >
                  {word}
                </motion.span>
              ))}
            </span>

            {/* Line 2 with animated shiny gradient */}
            <span style={{ display: 'block', overflow: 'hidden' }} className="font-editorial shiny-text">
              {line2Words.map((word, idx) => (
                <motion.span
                  key={idx}
                  variants={wordVariants}
                  style={{ display: 'inline-block', marginRight: '10px' }}
                >
                  {word}
                </motion.span>
              ))}
            </span>
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            style={{
              fontSize: 'clamp(1rem, 1.2vw, 1.15rem)',
              color: 'var(--muted-color)',
              lineHeight: 1.6,
              maxWidth: '520px',
              marginBottom: '36px',
            }}
          >
            Deploy role-based, multi-tenant billing models in seconds. Let LedgerFlow's real-time AI handle payment optimization, smart dunning, globally compliant taxes, and subscription management.
          </motion.p>

          {/* Call to Actions */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}
          >
            <a href="#trial" className="btn-liquid btn-primary-liquid">
              Start Free Trial
              <ArrowRight size={16} />
            </a>
            
            <a href="#playground" className="btn-liquid">
              <Play size={14} fill="#fff" />
              Book Live Demo
            </a>
          </motion.div>
        </div>

        {/* Right Side: Interactive Dashboard Visuals */}
        <div style={{ gridColumn: 'span 12', height: '580px', display: 'flex', alignItems: 'center', justifyContent: 'center' }} className="lg:col-span-6">
          <FloatingDashboard />
        </div>
      </div>

      {/* Responsive layout helper styles */}
      <style>{`
        @keyframes pulse {
          0% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.3); opacity: 0.5; }
          100% { transform: scale(1); opacity: 1; }
        }
        @media (min-width: 1024px) {
          .lg\\:col-span-6 { grid-column: span 6 !important; }
        }
      `}</style>
    </section>
  );
};
