import React, { useState, useEffect } from 'react';
import { motion, useSpring } from 'framer-motion';
import { TrendingUp, Sparkles, Users } from 'lucide-react';

export const FloatingDashboard: React.FC = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { clientWidth, clientHeight } = document.documentElement;
      const x = (e.clientX - clientWidth / 2) / (clientWidth / 2);
      const y = (e.clientY - clientHeight / 2) / (clientHeight / 2);
      setMousePosition({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const springConfig = { damping: 30, stiffness: 100 };
  const rotateX = useSpring(mousePosition.y * -12, springConfig);
  const rotateY = useSpring(mousePosition.x * 12, springConfig);

  useEffect(() => {
    rotateX.set(mousePosition.y * -12);
    rotateY.set(mousePosition.x * 12);
  }, [mousePosition, rotateX, rotateY]);

  const recentTransactions = [
    { id: 'TX-9821', customer: 'Acme Corp', amount: '+$14,200', status: 'Succeeded', time: '2m ago' },
    { id: 'TX-9820', customer: 'Vercel Inc', amount: '+$8,450', status: 'Processing', time: '12m ago' },
    { id: 'TX-9819', customer: 'Linear App', amount: '+$29,100', status: 'Succeeded', time: '1h ago' },
  ];

  return (
    <motion.div
      style={{
        perspective: 1000,
        transformStyle: 'preserve-3d',
      }}
      className="relative w-full h-[540px] flex items-center justify-center"
    >
      <motion.div
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
        }}
        className="relative w-full max-w-[500px] h-full"
      >
        {/* Card 1: Revenue Analytics & Monthly Revenue Chart */}
        <motion.div
          animate={{ y: [0, -12, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          style={{ transform: 'translateZ(40px)' }}
          className="absolute top-[20px] left-[10px] w-[310px] glass-card p-5 rounded-2xl border border-white/6 shadow-2xl hover:border-brand-accent/30 transition-all duration-300"
        >
          <div className="flex justify-between items-center mb-3">
            <div>
              <span className="text-[10px] text-brand-muted font-bold tracking-wider uppercase">REVENUE ANALYTICS</span>
              <h4 className="text-xl font-bold text-white mt-0.5">$189,450<span className="text-xs font-normal text-brand-accent ml-1.5">MRR</span></h4>
            </div>
            <div className="bg-brand-accent/15 text-brand-accent px-2 py-0.5 rounded-full text-[10px] font-semibold flex items-center gap-0.5">
              <TrendingUp size={10} />
              +18.4%
            </div>
          </div>

          {/* Monthly Revenue Chart */}
          <div className="w-full h-[90px] mt-2">
            <svg viewBox="0 0 300 100" className="w-full h-full overflow-visible">
              <defs>
                <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#22D3EE" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#22D3EE" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              <line x1="0" y1="20" x2="300" y2="20" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
              <line x1="0" y1="50" x2="300" y2="50" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
              <line x1="0" y1="80" x2="300" y2="80" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
              <motion.path
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.5, ease: 'easeOut' }}
                d="M 0 85 C 40 75, 60 45, 100 50 C 140 55, 180 25, 220 30 C 260 35, 280 15, 300 10 L 300 100 L 0 100 Z"
                fill="url(#revenueGrad)"
              />
              <motion.path
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.5, ease: 'easeOut' }}
                d="M 0 85 C 40 75, 60 45, 100 50 C 140 55, 180 25, 220 30 C 260 35, 280 15, 300 10"
                fill="none"
                stroke="#22D3EE"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <circle cx="220" cy="30" r="3" fill="#22D3EE" />
              <circle cx="220" cy="30" r="6" fill="#22D3EE" className="opacity-40 animate-ping" />
            </svg>
          </div>
        </motion.div>

        {/* Card 2: Active Subscriptions Donut Chart */}
        <motion.div
          animate={{ y: [-8, 6, -8] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          style={{ transform: 'translateZ(30px)' }}
          className="absolute top-[30px] right-[10px] w-[210px] glass-card p-4 rounded-2xl border border-white/6 shadow-2xl hover:border-brand-primary/30 transition-all duration-300"
        >
          <span className="text-[10px] text-brand-muted font-bold tracking-wider uppercase block mb-2">SUBSCRIPTIONS</span>
          <div className="flex items-center gap-4">
            <div className="w-[60px] h-[60px] relative">
              <svg viewBox="0 0 36 36" className="w-full h-full rotate-[-90deg]">
                <circle cx="18" cy="18" r="15.915" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="3.5" />
                <circle cx="18" cy="18" r="15.915" fill="none" stroke="#6D5DF6" strokeWidth="3.5" strokeDasharray="55 100" strokeDashoffset="0" />
                <circle cx="18" cy="18" r="15.915" fill="none" stroke="#22D3EE" strokeWidth="3.5" strokeDasharray="30 100" strokeDashoffset="-55" />
                <circle cx="18" cy="18" r="15.915" fill="none" stroke="#ffffff" strokeWidth="3.5" strokeDasharray="15 100" strokeDashoffset="-85" />
              </svg>
            </div>
            <div className="flex flex-col gap-1 text-[10px]">
              <div className="flex items-center gap-1.5 text-white/95 font-medium">
                <span className="w-2 h-2 rounded-full bg-brand-primary" />
                Enterprise (55%)
              </div>
              <div className="flex items-center gap-1.5 text-white/95 font-medium">
                <span className="w-2 h-2 rounded-full bg-brand-accent" />
                Growth (30%)
              </div>
              <div className="flex items-center gap-1.5 text-white/95 font-medium">
                <span className="w-2 h-2 rounded-full bg-white" />
                Startup (15%)
              </div>
            </div>
          </div>
        </motion.div>

        {/* Card 3: Recent Transactions & Invoices */}
        <motion.div
          animate={{ y: [6, -8, 6] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
          style={{ transform: 'translateZ(50px)' }}
          className="absolute top-[170px] right-[20px] w-[310px] glass-card p-5 rounded-2xl border border-white/6 shadow-2xl hover:border-white/20 transition-all duration-300"
        >
          <span className="text-[10px] text-brand-muted font-bold tracking-wider uppercase block mb-3">RECENT TRANSACTIONS</span>
          <div className="flex flex-col gap-3">
            {recentTransactions.map((tx, idx) => (
              <div key={idx} className="flex justify-between items-center pb-2.5 last:pb-0 last:border-0 border-b border-white/5">
                <div>
                  <div className="text-[11px] font-mono text-white/90 font-medium">{tx.id}</div>
                  <div className="text-[10px] text-brand-muted">{tx.customer}</div>
                </div>
                <div className="text-right">
                  <div className="text-[11px] font-bold text-white">{tx.amount}</div>
                  <div className={`text-[9px] font-medium ${tx.status === 'Succeeded' ? 'text-brand-accent' : 'text-amber-500'}`}>
                    {tx.status}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Card 4: Payments / Analytics Cards - Customers & MRR */}
        <motion.div
          animate={{ y: [-5, 8, -5] }}
          transition={{ duration: 7.5, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
          style={{ transform: 'translateZ(60px)' }}
          className="absolute bottom-[40px] left-[15px] w-[220px] glass-card p-4 rounded-2xl border border-white/6 shadow-2xl hover:border-brand-accent/30 transition-all duration-300"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-brand-accent/10 text-brand-accent rounded-xl">
              <Users size={16} />
            </div>
            <div>
              <span className="text-[9px] text-brand-muted font-medium uppercase block">Total Customers</span>
              <h5 className="text-lg font-extrabold text-white leading-tight">12,450</h5>
            </div>
          </div>
          <div className="mt-2.5 flex items-center justify-between text-[10px] text-brand-accent font-semibold bg-brand-accent/5 px-2.5 py-1 rounded-lg">
            <span>Active API Tokens</span>
            <span>89.2%</span>
          </div>
        </motion.div>

        {/* Card 5: KPI Card - AI Savings */}
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 6.5, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          style={{ transform: 'translateZ(70px)' }}
          className="absolute bottom-[60px] right-[40px] w-[190px] glass-card p-4 rounded-2xl border border-white/6 shadow-2xl hover:border-brand-primary/30 transition-all duration-300"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-brand-primary/10 text-brand-primary rounded-xl">
              <Sparkles size={16} />
            </div>
            <div>
              <span className="text-[9px] text-brand-muted font-medium uppercase block">AI Recovers</span>
              <h5 className="text-lg font-extrabold text-white leading-tight">+$4,120</h5>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};
