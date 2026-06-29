import React, { useState } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Mail, Lock, User, Briefcase, ArrowRight, ShieldAlert } from 'lucide-react';

export const Signup: React.FC = () => {
  const { register, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [companyName, setCompanyName] = useState('');
  
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
    if (!email || !password || !firstName || !companyName) {
      return setError('Please fill in all required fields.');
    }
    if (password.length < 6) {
      return setError('Password must be at least 6 characters.');
    }
    setError('');
    setLoading(true);

    try {
      await register({
        email,
        password,
        firstName,
        lastName,
        companyName,
      });
      const plan = searchParams.get('plan');
      if (plan) {
        navigate(`/dashboard/settings?plan=${plan}`);
      } else {
        navigate('/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
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
        className="w-full max-w-md glass-panel p-8 rounded-3xl relative z-10"
      >
        {/* Header Logo */}
        <div className="flex flex-col items-center mb-6">
          <Link to="/" className="flex items-center gap-2 mb-2">
            <div className="w-[22px] h-[22px] rounded-full border-2 border-white flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-white" />
            </div>
            <span className="font-bold text-lg tracking-tight text-white font-editorial">LedgerFlow</span>
          </Link>
          <h2 className="text-xl font-semibold text-white tracking-tight text-center">
            Create your account
          </h2>
          <p className="text-white/60 text-xs mt-1">
            Provision a multi-tenant billing engine sandbox
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-xs flex items-start gap-2.5">
            <ShieldAlert size={16} className="mt-0.5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {/* First Name input */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-white/80 tracking-wide uppercase">
                First Name *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40">
                  <User size={14} />
                </span>
                <input
                  type="text"
                  placeholder="Sarayu"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-white/2 border border-white/8 focus:border-brand-primary focus:bg-white/5 transition-all text-xs outline-none text-white placeholder-white/20"
                  required
                />
              </div>
            </div>

            {/* Last Name input */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-white/80 tracking-wide uppercase">
                Last Name
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40">
                  <User size={14} />
                </span>
                <input
                  type="text"
                  placeholder="Voona"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-white/2 border border-white/8 focus:border-brand-primary focus:bg-white/5 transition-all text-xs outline-none text-white placeholder-white/20"
                />
              </div>
            </div>
          </div>

          {/* Company Name input */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-white/80 tracking-wide uppercase">
              Company Name *
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40">
                <Briefcase size={14} />
              </span>
              <input
                type="text"
                placeholder="LedgerCorp Inc"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-white/2 border border-white/8 focus:border-brand-primary focus:bg-white/5 transition-all text-xs outline-none text-white placeholder-white/20"
                required
              />
            </div>
          </div>

          {/* Email input */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-white/80 tracking-wide uppercase">
              Work Email Address *
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40">
                <Mail size={14} />
              </span>
              <input
                type="email"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-white/2 border border-white/8 focus:border-brand-primary focus:bg-white/5 transition-all text-xs outline-none text-white placeholder-white/20"
                required
              />
            </div>
          </div>

          {/* Password input */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-white/80 tracking-wide uppercase">
              Choose Password *
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40">
                <Lock size={14} />
              </span>
              <input
                type="password"
                placeholder="Min 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-white/2 border border-white/8 focus:border-brand-primary focus:bg-white/5 transition-all text-xs outline-none text-white placeholder-white/20"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 mt-2 bg-gradient-to-r from-brand-primary to-brand-primary/80 hover:to-brand-primary rounded-xl text-white font-semibold text-xs flex items-center justify-center gap-2 hover:shadow-[0_0_20px_rgba(109,93,246,0.3)] transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Creating Account...' : 'Get Started'}
            {!loading && <ArrowRight size={14} />}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-white/50">
          Already have an account?{' '}
          <Link to="/login" className="text-brand-accent hover:underline font-medium">
            Sign in
          </Link>
        </p>
      </motion.div>
    </div>
  );
};
