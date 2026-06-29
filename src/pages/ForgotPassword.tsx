import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, ArrowLeft, Send, CheckCircle2 } from 'lucide-react';

export const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    // Simulate API request delay
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-[#050816] flex flex-col justify-center items-center px-6 py-12 relative overflow-hidden">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full bg-brand-primary/10 blur-[150px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md glass-panel p-8 md:p-10 rounded-3xl relative z-10"
      >
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center text-brand-primary mb-4">
            <Mail size={22} />
          </div>
          <h2 className="text-2xl font-semibold text-white tracking-tight text-center">
            Reset password
          </h2>
          <p className="text-white/60 text-xs mt-1.5 text-center max-w-xs leading-relaxed">
            Enter your email and we'll send you instructions to reset your password.
          </p>
        </div>

        {submitted ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center space-y-6"
          >
            <div className="flex justify-center text-green-400">
              <CheckCircle2 size={48} />
            </div>
            <div className="space-y-2">
              <p className="text-sm font-semibold text-white">Check your email</p>
              <p className="text-xs text-white/50 leading-relaxed max-w-xs mx-auto">
                We've sent a password reset link to <span className="text-white font-medium">{email}</span>. Please check your spam folder if it doesn't arrive within a few minutes.
              </p>
            </div>
            <Link
              to="/login"
              className="inline-flex items-center gap-2 text-xs font-semibold text-brand-accent hover:underline"
            >
              <ArrowLeft size={12} />
              Return to Sign In
            </Link>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
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

            <button
              type="submit"
              disabled={loading || !email}
              className="w-full py-3.5 bg-gradient-to-r from-brand-primary to-brand-primary/80 hover:to-brand-primary rounded-xl text-white font-semibold text-sm flex items-center justify-center gap-2 hover:shadow-[0_0_20px_rgba(109,93,246,0.3)] transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Sending Request...' : 'Send Reset Link'}
              {!loading && <Send size={14} />}
            </button>

            <div className="text-center">
              <Link
                to="/login"
                className="inline-flex items-center gap-2 text-xs font-semibold text-white/50 hover:text-white transition-colors"
              >
                <ArrowLeft size={12} />
                Back to Login
              </Link>
            </div>
          </form>
        )}
      </motion.div>
    </div>
  );
};
