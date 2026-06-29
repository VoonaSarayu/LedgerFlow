import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { CreditCard, Trash2, ShieldCheck } from 'lucide-react';

interface Customer {
  name: string;
  email: string;
}

interface Invoice {
  invoiceNumber: string;
  customer: Customer;
}

interface Payment {
  id: string;
  amount: number;
  status: 'SUCCESS' | 'FAILED' | 'PENDING';
  provider: string;
  transactionId: string | null;
  createdAt: string;
  invoice: Invoice | null;
}

export const Payments: React.FC = () => {
  const { api, user } = useAuth();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  const isAdmin = user?.role.toUpperCase() === 'ADMIN';

  const fetchPayments = async () => {
    try {
      const res = await api.get('/payments');
      setPayments(res.data);
    } catch (error) {
      console.error('Error fetching payments:', error);
    }
  };

  useEffect(() => {
    const initPage = async () => {
      setLoading(true);
      await fetchPayments();
      setLoading(false);
    };
    initPage();
  }, [api]);

  const handleDeletePayment = async (id: string) => {
    if (!confirm('Are you sure you want to delete this payment record? This will not affect the related invoice.')) return;
    try {
      await api.delete(`/payments/${id}`);
      fetchPayments();
    } catch (error) {
      console.error('Failed to delete payment record:', error);
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'SUCCESS':
        return 'bg-green-500/10 text-green-400 border-green-500/20';
      case 'FAILED':
        return 'bg-red-500/10 text-red-400 border-red-500/20';
      default:
        return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
    }
  };

  const totalVolume = payments
    .filter((p) => p.status === 'SUCCESS')
    .reduce((sum, p) => sum + p.amount, 0);

  const failureRate = payments.length
    ? (payments.filter((p) => p.status === 'FAILED').length / payments.length) * 100
    : 0;

  return (
    <div className="space-y-6">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white font-editorial">
            Transaction History
          </h1>
          <p className="text-white/60 text-sm mt-1">
            Audit gateway requests, retry logs, and payment records.
          </p>
        </div>
      </div>

      {/* Overview stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-panel p-6 rounded-2xl border border-white/5 space-y-1">
          <span className="text-xs font-semibold text-white/50">Total Settled Volume</span>
          <h3 className="text-2xl font-bold text-white tracking-tight font-editorial">
            {loading ? (
              <div className="h-8 w-24 skeleton mt-1" />
            ) : (
              `$${totalVolume.toLocaleString(undefined, { minimumFractionDigits: 2 })}`
            )}
          </h3>
          <span className="text-[10px] text-white/30 block">Live gateway transactions</span>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-white/5 space-y-1">
          <span className="text-xs font-semibold text-white/50">Processed Transactions</span>
          <h3 className="text-2xl font-bold text-white tracking-tight font-editorial">
            {loading ? (
              <div className="h-8 w-24 skeleton mt-1" />
            ) : (
              `${payments.length} requests`
            )}
          </h3>
          <span className="text-[10px] text-white/30 block">Successful: {payments.filter(p => p.status === 'SUCCESS').length}</span>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-white/5 space-y-1">
          <span className="text-xs font-semibold text-white/50">Retry Leakage Rate</span>
          <h3 className="text-2xl font-bold text-white tracking-tight font-editorial">
            {loading ? (
              <div className="h-8 w-16 skeleton mt-1" />
            ) : (
              `${failureRate.toFixed(1)}%`
            )}
          </h3>
          <span className="text-[10px] text-brand-accent block flex items-center gap-1 font-semibold">
            <ShieldCheck size={10} /> Smart-retry optimized
          </span>
        </div>
      </div>

      {/* Transaction List */}
      <div className="glass-panel rounded-2xl border border-white/5 overflow-hidden">
        {loading ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 bg-white/1 text-[10px] text-white/40 font-bold uppercase tracking-wider">
                  <th className="py-4 px-6">Transaction Date</th>
                  <th className="py-4 px-6">Invoice</th>
                  <th className="py-4 px-6">Customer</th>
                  <th className="py-4 px-6">Amount</th>
                  <th className="py-4 px-6">Provider</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-xs">
                {[1, 2, 3, 4, 5].map((i) => (
                  <tr key={i}>
                    <td className="py-4 px-6">
                      <div className="space-y-1.5">
                        <div className="h-4 w-20 skeleton" />
                        <div className="h-3 w-28 skeleton" />
                      </div>
                    </td>
                    <td className="py-4 px-6"><div className="h-4 w-16 skeleton" /></td>
                    <td className="py-4 px-6">
                      <div className="space-y-1.5">
                        <div className="h-4 w-28 skeleton" />
                        <div className="h-3 w-36 skeleton" />
                      </div>
                    </td>
                    <td className="py-4 px-6"><div className="h-4 w-16 skeleton" /></td>
                    <td className="py-4 px-6"><div className="h-3.5 w-10 skeleton" /></td>
                    <td className="py-4 px-6"><div className="h-5 w-14 rounded-full skeleton" /></td>
                    <td className="py-4 px-6 text-right"><div className="h-7 w-12 skeleton inline-block" /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : payments.length === 0 ? (
          <div className="p-12 text-center text-white/40 text-xs">
            <CreditCard size={32} className="mx-auto mb-3 opacity-30" />
            No transaction records found. Pay an invoice to see entries here.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 bg-white/1 text-[10px] text-white/40 font-bold uppercase tracking-wider">
                  <th className="py-4 px-6">Transaction Date</th>
                  <th className="py-4 px-6">Invoice</th>
                  <th className="py-4 px-6">Customer</th>
                  <th className="py-4 px-6">Amount</th>
                  <th className="py-4 px-6">Provider</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-xs">
                {payments.map((p) => (
                  <tr key={p.id} className="hover:bg-white/1 transition-all">
                    <td className="py-4 px-6 text-white/60">
                      {new Date(p.createdAt).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                      <span className="text-[10px] text-white/30 block font-mono mt-0.5">
                        {p.transactionId || `TX-${p.id.slice(0, 8).toUpperCase()}`}
                      </span>
                    </td>
                    <td className="py-4 px-6 font-semibold font-mono text-white">
                      {p.invoice ? p.invoice.invoiceNumber : 'N/A'}
                    </td>
                    <td className="py-4 px-6">
                      {p.invoice ? (
                        <div>
                          <div className="font-medium text-white">{p.invoice.customer?.name || 'Simulated Customer'}</div>
                          <div className="text-[10px] text-white/40 mt-0.5">{p.invoice.customer?.email || ''}</div>
                        </div>
                      ) : (
                        <span className="text-white/40">N/A</span>
                      )}
                    </td>
                    <td className="py-4 px-6 font-semibold text-white">
                      ${p.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-4 px-6 uppercase text-[10px] font-bold text-white/60 tracking-wider">
                      {p.provider}
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold border ${getStatusStyle(p.status)}`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      {isAdmin ? (
                        <button
                          onClick={() => handleDeletePayment(p.id)}
                          className="p-1.5 rounded-lg bg-white/2 hover:bg-red-500/10 hover:text-red-400 text-white/50 border border-white/5 transition-colors cursor-pointer"
                          title="Delete Record"
                        >
                          <Trash2 size={14} />
                        </button>
                      ) : (
                        <span className="text-white/20">-</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
