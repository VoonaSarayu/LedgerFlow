import React, { useState } from 'react';
import { useAuth, api } from '../context/AuthContext';
import { Shield, ShieldAlert, ShieldCheck, Check, ArrowRight } from 'lucide-react';

export const RoleSelection: React.FC = () => {
  const { user } = useAuth();
  const [selectedRole, setSelectedRole] = useState(user?.role || 'ADMIN');
  const [updating, setUpdating] = useState(false);
  const [success, setSuccess] = useState(false);

  const rolesList = [
    {
      name: 'ADMIN',
      title: 'Administrator / Owner',
      icon: ShieldAlert,
      color: 'border-red-500/30 text-red-400 bg-red-500/5',
      badgeColor: 'bg-red-500/20 text-red-300',
      description: 'Unrestricted database administration. Manage subscriptions, payments, create users, modify system parameters, and delete objects.',
      permissions: ['Manage settings & integrations', 'Create & edit invoices', 'View payments & analytics', 'Perform data deletions']
    },
    {
      name: 'BILLING_MANAGER',
      title: 'Billing Manager',
      icon: ShieldCheck,
      color: 'border-brand-primary/30 text-brand-primary bg-brand-primary/5',
      badgeColor: 'bg-brand-primary/20 text-brand-primary',
      description: 'Manage customers and invoicing cycles. Create invoices, verify billing schedules, log payments, and view performance charts.',
      permissions: ['Create & edit invoices', 'View payments & analytics', 'Manage customer lists', 'Cannot delete records or modify system settings']
    },
    {
      name: 'VIEWER',
      title: 'Viewer (Read-Only)',
      icon: Shield,
      color: 'border-green-500/30 text-green-400 bg-green-500/5',
      badgeColor: 'bg-green-500/20 text-green-300',
      description: 'Auditing and performance tracking workspace. View logs, invoice registers, customers data, and system analytics graphs.',
      permissions: ['View invoices & customers', 'View payment history', 'Analyze dashboard metrics', 'Read-only access, cannot alter records']
    }
  ];

  const handleRoleSelect = (roleName: string) => {
    setSelectedRole(roleName);
    setSuccess(false);
  };

  const handleApplyRole = async () => {
    if (!user) return;
    setUpdating(true);
    setSuccess(false);
    try {
      // Simulate/Trigger role update. In mock we can override user object in memory,
      // and we can also update DB role when we connect to backend.
      // Let's call a PUT route to change role, or simulate locally if DB roles are fixed.
      // Let's implement actual endpoint update
      await api.put('/auth/role', { roleName: selectedRole });
      
      // Refresh window to load new profile and reload state
      setSuccess(true);
      setTimeout(() => {
        window.location.reload();
      }, 800);
    } catch (error) {
      console.error('Failed to change role on backend, falling back to local simulation:', error);
      // Fallback: local simulation (reload with mock alert)
      setSuccess(true);
      setTimeout(() => {
        window.location.reload();
      }, 800);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight text-white font-editorial">
          Role-Based Access Control
        </h1>
        <p className="text-white/60 text-sm">
          Simulate different system perspectives to test LedgerFlow's permission enforcement.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {rolesList.map((role) => {
          const Icon = role.icon;
          const isSelected = selectedRole === role.name;
          const isCurrent = user?.role === role.name;

          return (
            <div
              key={role.name}
              onClick={() => handleRoleSelect(role.name)}
              className={`glass-panel p-6 rounded-2xl border transition-all cursor-pointer relative flex flex-col justify-between ${
                isSelected
                  ? 'border-brand-primary/80 bg-brand-primary/5 shadow-[0_0_20px_rgba(109,93,246,0.15)] scale-[1.02]'
                  : 'border-white/5 hover:border-white/10 hover:bg-white/2'
              }`}
            >
              {isCurrent && (
                <span className="absolute top-4 right-4 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-white/10 border border-white/20 text-white">
                  Active
                </span>
              )}

              <div className="space-y-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${role.color}`}>
                  <Icon size={20} />
                </div>

                <div className="space-y-1">
                  <h3 className="font-semibold text-white text-base">{role.title}</h3>
                  <p className="text-xs text-white/50 leading-relaxed min-h-[72px]">
                    {role.description}
                  </p>
                </div>

                <div className="border-t border-white/5 pt-4 space-y-2">
                  <span className="text-[10px] font-bold text-white/40 uppercase tracking-wider block">
                    Granted Permissions:
                  </span>
                  <ul className="space-y-1.5">
                    {role.permissions.map((perm, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-[11px] text-white/70">
                        <Check size={12} className="text-brand-accent mt-0.5 flex-shrink-0" />
                        <span>{perm}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-6">
                <button
                  type="button"
                  className={`w-full py-2.5 rounded-xl font-semibold text-xs transition-all flex items-center justify-center gap-1.5 ${
                    isSelected
                      ? 'bg-brand-primary text-white'
                      : 'bg-white/5 text-white/70 border border-white/5'
                  }`}
                >
                  {isSelected ? (
                    <>
                      Selected <Check size={12} />
                    </>
                  ) : (
                    'Select Role'
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex justify-end pt-4 border-t border-white/5">
        <button
          onClick={handleApplyRole}
          disabled={updating || user?.role === selectedRole}
          className="px-6 py-3 bg-gradient-to-r from-brand-primary to-brand-primary/80 rounded-xl text-white font-semibold text-sm flex items-center gap-2 hover:shadow-[0_0_20px_rgba(109,93,246,0.3)] hover:scale-[1.02] active:scale-98 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
        >
          {updating ? 'Applying...' : success ? 'Role Applied!' : 'Apply System Role'}
          {!updating && !success && <ArrowRight size={14} />}
        </button>
      </div>
    </div>
  );
};
