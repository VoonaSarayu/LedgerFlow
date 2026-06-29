import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Navbar } from './components/Navbar';
import { ShinyText } from './components/ShinyText';
import { FloatingDashboard } from './components/FloatingDashboard';
import { LogosMarquee } from './components/LogosMarquee';
import { BillingPlayground } from './components/BillingPlayground';
import { AIConsole } from './components/AIConsole';
import { BentoFeatures } from './components/BentoFeatures';
import { Pricing } from './components/Pricing';
import { Resources } from './components/Resources';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';


// App extensions
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { DashboardLayout } from './components/DashboardLayout';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { ForgotPassword } from './pages/ForgotPassword';
import { RoleSelection } from './pages/RoleSelection';
import { Dashboard } from './pages/Dashboard';
import { Invoices } from './pages/Invoices';
import { Payments } from './pages/Payments';
import { Customers } from './pages/Customers';
import { Analytics } from './pages/Analytics';
import { Settings } from './pages/Settings';

function LandingPage() {
  return (
    <div className="w-full bg-[#050816] text-white/80 font-sans selection:bg-brand-primary/30 selection:text-white">
      
      {/* 1. FULL-SCREEN HERO SECTION (h-screen) */}
      <header className="relative w-full min-h-screen lg:h-screen flex flex-col justify-between overflow-hidden bg-[#050816]">
        
        {/* Full-screen looping video background */}
        <div className="absolute inset-0 w-full h-full pointer-events-none select-none z-0">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover opacity-35"
          >
            <source
              src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260328_105406_16f4600d-7a92-4292-b96e-b19156c7830a.mp4"
              type="video/mp4"
            />
          </video>
          {/* Subtle color masks & radial glows over the video */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#050816]/70 via-[#050816]/40 to-[#050816]" />
          <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] rounded-full bg-brand-primary/10 blur-[130px] mix-blend-screen" />
          <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[400px] h-[400px] rounded-full bg-brand-accent/8 blur-[140px] mix-blend-screen" />
        </div>

        {/* Navigation Bar */}
        <Navbar />

        {/* Hero Content Grid (relative z-10) */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-8 flex-grow flex flex-col justify-center gap-8 lg:gap-14 pt-32 pb-12">
          
          {/* Top Columns Section (Below Nav, above center Hero) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-12 items-start border-b border-white/5 pb-5">
            <p className="text-white/80 text-sm md:text-base max-w-xl font-normal leading-relaxed">
              Manage subscriptions, invoices, recurring payments, customer billing and business analytics through one intelligent AI-powered billing platform.
            </p>
            <p className="text-white/80 text-sm md:text-base lg:text-right font-medium tracking-wide">
              Trusted by 500+ Businesses Worldwide
            </p>
          </div>

          {/* Center Hero Section */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center flex-grow">
            
            {/* Hero Left Column */}
            <div className="lg:col-span-6 flex flex-col items-start text-left">
              {/* Badge above heading */}
              <span className="text-white/80 text-xs md:text-sm font-semibold tracking-wider uppercase mb-3">
                AI Powered Billing Platform
              </span>
              
              {/* Heading */}
              <h1 className="text-5xl md:text-7xl xl:text-[84px] font-medium tracking-tighter text-white leading-[0.85] mb-6">
                Enterprise <br />
                <ShinyText text="Billing Platform." />
              </h1>
              
              {/* Action CTAs */}
              <div className="flex flex-wrap gap-4 items-center">
                <a
                  href="/signup"
                  className="px-8 py-3.5 bg-gradient-to-r from-brand-primary to-brand-primary/80 text-white font-semibold text-sm rounded-full shadow-[0_0_20px_rgba(109,93,246,0.25)] hover:shadow-[0_0_30px_rgba(109,93,246,0.55)] hover:scale-[1.03] transition-all duration-300 active:scale-95"
                >
                  Start Free Trial
                </a>
                
                <a
                  href="/login"
                  className="group px-8 py-3.5 bg-white/3 backdrop-blur-sm border border-white/10 text-white font-semibold text-sm rounded-full flex items-center gap-2 hover:bg-white/8 hover:border-white/20 transition-all duration-300"
                >
                  Book Live Demo
                  <ArrowRight size={14} className="transform transition-transform duration-300 group-hover:translate-x-1" />
                </a>
              </div>
            </div>

            {/* Hero Right Column: 3D Floating Dashboard */}
            <div className="lg:col-span-6 w-full flex items-center justify-center">
              <FloatingDashboard />
            </div>

          </div>

        </div>

      </header>

      {/* 2. SOCIAL PROOF LOGO MARQUEE */}
      <LogosMarquee />

      {/* 3. INTERACTIVE BILLING PLAYGROUND */}
      <BillingPlayground />

      {/* 4. AI CODING CONSOLE */}
      <AIConsole />

      {/* 5. BENTO FEATURES GRID */}
      <BentoFeatures />

      {/* 6. SUBSCRIPTION PRICING */}
      <Pricing />

      {/* 7. DEVELOPER RESOURCES */}
      <Resources />

      {/* 8. CONTACT ENGINEERING */}
      <Contact />

      {/* 9. EDITORIAL FOOTER */}
      <Footer />

    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="invoices" element={<Invoices />} />
            <Route path="payments" element={<Payments />} />
            <Route path="customers" element={<Customers />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="settings" element={<Settings />} />
            <Route
              path="role-selection"
              element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <RoleSelection />
                </ProtectedRoute>
              }
            />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
