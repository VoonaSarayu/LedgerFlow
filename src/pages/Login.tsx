import React, { useState } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowRight, ShieldAlert } from 'lucide-react';

export const Login: React.FC = () => {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Redirect if already authenticated
  React.useEffect(() => {
    if (isAuthenticated) {
      const plan = searchParams.get('plan');
      if (plan) {
        navigate(`/dashboard/settings?plan=${plan}`);
      } else {
        navigate('/dashboard');
      }
    }
  }, [isAuthenticated, navigate, searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      return setError('Please fill in all fields.');
    }
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      const plan = searchParams.get('plan');
      if (plan) {
        navigate(`/dashboard/settings?plan=${plan}`);
      } else {
        navigate('/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'Incorrect credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050816] flex flex-col justify-center items-center px-6 py-12 relative overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full bg-brand-primary/10 blur-[150px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md glass-panel p-8 md:p-10 rounded-3xl relative z-10"
      >
        {/* Header Logo */}
        <div className="flex flex-col items-center mb-8">
          <Link to="/" className="flex items-center gap-2 mb-3">
            <div className="w-[24px] h-[24px] rounded-full border-2 border-white flex items-center justify-center">
              <div className="w-2.5 h-2.5 rounded-full bg-white" />
            </div>
            <span className="font-bold text-xl tracking-tight text-white">LedgerFlow</span>
          </Link>
          <h2 className="text-2xl font-semibold text-white tracking-tight text-center">
            Sign in to platform
          </h2>
          <p className="text-white/60 text-xs mt-1">
            Access your secure billing analytics sandbox
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-xs flex items-start gap-2.5">
            <ShieldAlert size={16} className="mt-0.5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email input */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-white/80 tracking-wide">
              Work Email Address
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40">
                <Mail size={16} />
              </span>
              <input
                type="email"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/2 border border-white/8 focus:border-brand-primary focus:bg-white/5 transition-all text-sm outline-none text-white placeholder-white/20"
                required
              />
            </div>
          </div>

          {/* Password input */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-white/80 tracking-wide">
                Account Password
              </label>
              <Link
                to="/forgot-password"
                className="text-[11px] text-brand-accent hover:underline transition-all"
              >
                Forgot?
              </Link>
            </div>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40">
                <Lock size={16} />
              </span>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/2 border border-white/8 focus:border-brand-primary focus:bg-white/5 transition-all text-sm outline-none text-white placeholder-white/20"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 mt-2 bg-gradient-to-r from-brand-primary to-brand-primary/80 hover:to-brand-primary rounded-xl text-white font-semibold text-sm flex items-center justify-center gap-2 hover:shadow-[0_0_20px_rgba(109,93,246,0.3)] transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Authenticating...' : 'Sign In'}
            {!loading && <ArrowRight size={14} />}
          </button>
        </form>

        <p className="mt-8 text-center text-xs text-white/50">
          Don't have an account?{' '}
          <Link to="/signup" className="text-brand-accent hover:underline font-medium">
            Sign up for free
          </Link>
        </p>
      </motion.div>
    </div>
  );
};
