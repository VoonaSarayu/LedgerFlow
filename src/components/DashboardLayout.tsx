import React, { useState } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  FileText,
  CreditCard,
  Users,
  BarChart3,
  Settings,
  Shield,
  LogOut,
  Menu,
  X,
  UserCheck
} from 'lucide-react';

export const DashboardLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navItems = [
    { label: 'Overview', path: '/dashboard', icon: LayoutDashboard, roles: ['ADMIN', 'BILLING_MANAGER', 'VIEWER'] },
    { label: 'Invoices', path: '/dashboard/invoices', icon: FileText, roles: ['ADMIN', 'BILLING_MANAGER', 'VIEWER'] },
    { label: 'Payments', path: '/dashboard/payments', icon: CreditCard, roles: ['ADMIN', 'BILLING_MANAGER', 'VIEWER'] },
    { label: 'Customers', path: '/dashboard/customers', icon: Users, roles: ['ADMIN', 'BILLING_MANAGER', 'VIEWER'] },
    { label: 'Analytics', path: '/dashboard/analytics', icon: BarChart3, roles: ['ADMIN', 'BILLING_MANAGER', 'VIEWER'] },
    { label: 'Settings', path: '/dashboard/settings', icon: Settings, roles: ['ADMIN', 'BILLING_MANAGER'] },
    { label: 'Role Selection', path: '/dashboard/role-selection', icon: UserCheck, roles: ['ADMIN'] },
  ];

  const filteredNavItems = navItems.filter(item =>
    user && item.roles.includes(user.role.toUpperCase())
  );

  return (
    <div className="min-h-screen bg-[#050816] text-white flex">
      {/* 1. Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-white/2 border-r border-white/5 backdrop-blur-md p-6 flex-shrink-0">
        {/* Brand Header */}
        <Link to="/" className="flex items-center gap-2.5 text-white mb-8 group">
          <div className="w-[20px] h-[20px] rounded-full border-2 border-white flex items-center justify-center transition-transform duration-300 group-hover:rotate-180">
            <div className="w-1.5 h-1.5 rounded-full bg-white" />
          </div>
          <span className="font-semibold text-base tracking-tight">LedgerFlow</span>
        </Link>

        {/* Nav Links */}
        <nav className="flex-1 flex flex-col gap-1.5">
          {filteredNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-brand-primary text-white shadow-[0_0_15px_rgba(109,93,246,0.25)]'
                    : 'text-white/60 hover:text-white hover:bg-white/4'
                }`}
              >
                <Icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* User Footer Panel */}
        <div className="border-t border-white/5 pt-4 mt-auto flex flex-col gap-3">
          <div className="flex items-center gap-3 px-2">
            <div className="w-8 h-8 rounded-full bg-brand-primary/20 border border-brand-primary/30 flex items-center justify-center text-brand-primary font-bold text-xs">
              {user?.firstName ? user.firstName[0].toUpperCase() : 'U'}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-white truncate">
                {user?.firstName ? `${user.firstName} ${user.lastName || ''}` : 'Ledger User'}
              </p>
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-brand-accent uppercase tracking-wider">
                <Shield size={10} />
                {user?.role}
              </span>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-500/5 transition-colors w-full text-left"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* 2. Mobile Nav Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-[#050816]/90 border-b border-white/5 backdrop-blur-md px-6 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5 text-white">
          <div className="w-[18px] h-[18px] rounded-full border-2 border-white flex items-center justify-center">
            <div className="w-1.5 h-1.5 rounded-full bg-white" />
          </div>
          <span className="font-semibold text-sm tracking-tight font-editorial">LedgerFlow</span>
        </Link>

        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="text-white/80 hover:text-white"
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-30 bg-[#050816] pt-20 px-6 pb-6 flex flex-col justify-between">
          <nav className="flex flex-col gap-2">
            {filteredNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-brand-primary text-white shadow-[0_0_15px_rgba(109,93,246,0.25)]'
                      : 'text-white/60 hover:text-white hover:bg-white/4'
                  }`}
                >
                  <Icon size={18} />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="border-t border-white/5 pt-4 flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-brand-primary/20 border border-brand-primary/30 flex items-center justify-center text-brand-primary font-bold text-xs">
                {user?.firstName ? user.firstName[0].toUpperCase() : 'U'}
              </div>
              <div>
                <p className="text-xs font-semibold text-white">
                  {user?.firstName ? `${user.firstName} ${user.lastName || ''}` : 'User'}
                </p>
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-brand-accent uppercase tracking-wider">
                  <Shield size={10} />
                  {user?.role}
                </span>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-500/5 transition-colors w-full text-left"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </div>
      )}

      {/* 3. Main Content Panel */}
      <main className="flex-1 min-w-0 flex flex-col pt-20 md:pt-0">
        <header className="hidden md:flex h-16 border-b border-white/5 bg-white/1 backdrop-blur-sm px-8 items-center justify-between">
          <h2 className="text-sm font-semibold text-white/50">
            Tenant Space: <span className="text-white font-bold">{user?.company.name}</span>
          </h2>
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-brand-primary/10 border border-brand-primary/20 text-brand-primary">
              Role: {user?.role}
            </span>
          </div>
        </header>

        <div className="flex-grow p-6 md:p-8 overflow-y-auto">
          {/* Active View renders here */}
          <Outlet />
        </div>
      </main>
    </div>
  );
};
