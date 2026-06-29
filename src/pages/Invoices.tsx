import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText,
  Plus,
  Search,
  Filter,
  Trash2,
  DollarSign,
  AlertCircle,
  X,
  CreditCard
} from 'lucide-react';

interface Customer {
  id: string;
  name: string;
  email: string;
}

interface Invoice {
  id: string;
  invoiceNumber: string;
  amount: number;
  status: 'DRAFT' | 'SENT' | 'PAID' | 'OVERDUE' | 'VOID';
  dueDate: string;
  createdAt: string;
  customer: Customer;
}

export const Invoices: React.FC = () => {
  const { api, user } = useAuth();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters & Search
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  
  // Modals state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  // New Invoice Form
  const [newInvNumber, setNewInvNumber] = useState('');
  const [newInvAmount, setNewInvAmount] = useState('');
  const [newInvDueDate, setNewInvDueDate] = useState('');
  const [newInvCustomerId, setNewInvCustomerId] = useState('');
  const [newInvStatus, setNewInvStatus] = useState<'DRAFT' | 'SENT'>('DRAFT');
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Payment Form
  const [paymentProvider, setPaymentProvider] = useState('stripe');
  const [paymentStatus, setPaymentStatus] = useState<'SUCCESS' | 'FAILED'>('SUCCESS');
  const [paymentSubmitting, setPaymentSubmitting] = useState(false);

  const isViewer = user?.role.toUpperCase() === 'VIEWER';
  const isAdmin = user?.role.toUpperCase() === 'ADMIN';

  const fetchInvoices = async () => {
    try {
      const res = await api.get('/invoices', {
        params: {
          status: statusFilter || undefined,
          search: search || undefined
        }
      });
      setInvoices(res.data);
    } catch (error) {
      console.error('Error fetching invoices:', error);
    }
  };

  useEffect(() => {
    const initPage = async () => {
      setLoading(true);
      try {
        await Promise.all([
          fetchInvoices(),
          api.get('/customers').then(res => setCustomers(res.data))
        ]);
      } catch (error) {
        console.error('Error initializing page:', error);
      } finally {
        setLoading(false);
      }
    };
    initPage();
  }, [statusFilter, search]);

  const handleCreateInvoice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newInvNumber || !newInvAmount || !newInvDueDate || !newInvCustomerId) {
      return setFormError('Please fill in all fields.');
    }
    setFormError('');
    setSubmitting(true);

    try {
      await api.post('/invoices', {
        invoiceNumber: newInvNumber,
        amount: parseFloat(newInvAmount),
        dueDate: newInvDueDate,
        customerId: newInvCustomerId,
        status: newInvStatus,
      });

      // Reset
      setIsCreateModalOpen(false);
      setNewInvNumber('');
      setNewInvAmount('');
      setNewInvDueDate('');
      setNewInvCustomerId('');
      setNewInvStatus('DRAFT');
      
      // Refresh
      fetchInvoices();
    } catch (error: any) {
      setFormError(error.response?.data?.error || 'Failed to create invoice.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteInvoice = async (id: string) => {
    if (!confirm('Are you sure you want to delete this invoice?')) return;
    try {
      await api.delete(`/invoices/${id}`);
      fetchInvoices();
    } catch (error) {
      console.error('Failed to delete invoice:', error);
    }
  };

  const handleRecordPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInvoice) return;
    setPaymentSubmitting(true);
    try {
      await api.post('/payments', {
        amount: selectedInvoice.amount,
        status: paymentStatus,
        provider: paymentProvider,
        invoiceId: selectedInvoice.id,
      });
      setIsPaymentModalOpen(false);
      setSelectedInvoice(null);
      fetchInvoices();
    } catch (error) {
      console.error('Failed to record payment:', error);
    } finally {
      setPaymentSubmitting(false);
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'PAID':
        return 'bg-green-500/10 text-green-400 border-green-500/20';
      case 'SENT':
        return 'bg-brand-primary/10 text-brand-primary border-brand-primary/20';
      case 'OVERDUE':
        return 'bg-red-500/10 text-red-400 border-red-500/20';
      case 'VOID':
        return 'bg-white/5 text-white/40 border-white/10';
      default:
        return 'bg-white/5 text-white/70 border-white/10';
    }
  };

  return (
    <div className="space-y-6">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white font-editorial">
            Invoices Registry
          </h1>
          <p className="text-white/60 text-sm mt-1">
            Create drafts, dispatch invoices, and simulate payment gateways.
          </p>
        </div>

        <button
          onClick={() => {
            if (!isViewer) setIsCreateModalOpen(true);
          }}
          disabled={isViewer}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-brand-primary to-brand-primary/80 text-white text-xs font-bold uppercase tracking-wider rounded-xl hover:shadow-[0_0_15px_rgba(109,93,246,0.25)] transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
        >
          <Plus size={14} />
          Create Invoice
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center bg-white/2 border border-white/5 p-4 rounded-xl">
        <div className="sm:col-span-6 relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40">
            <Search size={16} />
          </span>
          <input
            type="text"
            placeholder="Search by invoice number (e.g. LF-2026)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white/2 border border-white/5 rounded-xl pl-10 pr-4 py-2.5 text-xs outline-none text-white focus:border-brand-primary/80 focus:bg-white/4 transition-all"
          />
        </div>

        <div className="sm:col-span-4 relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40">
            <Filter size={14} />
          </span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full bg-white/2 border border-white/5 rounded-xl pl-9 pr-4 py-2.5 text-xs outline-none text-white/80 focus:border-brand-primary/80 focus:bg-white/4 transition-all appearance-none"
          >
            <option value="" className="bg-[#050816]">All Statuses</option>
            <option value="DRAFT" className="bg-[#050816]">Draft</option>
            <option value="SENT" className="bg-[#050816]">Sent</option>
            <option value="PAID" className="bg-[#050816]">Paid</option>
            <option value="OVERDUE" className="bg-[#050816]">Overdue</option>
            <option value="VOID" className="bg-[#050816]">Void</option>
          </select>
        </div>
      </div>

      {/* Invoices Table */}
      <div className="glass-panel rounded-2xl border border-white/5 overflow-hidden">
        {loading ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 bg-white/1 text-[10px] text-white/40 font-bold uppercase tracking-wider">
                  <th className="py-4 px-6">Invoice Number</th>
                  <th className="py-4 px-6">Customer</th>
                  <th className="py-4 px-6">Amount</th>
                  <th className="py-4 px-6">Due Date</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-xs">
                {[1, 2, 3, 4, 5].map((i) => (
                  <tr key={i}>
                    <td className="py-4 px-6"><div className="h-4 w-20 skeleton" /></td>
                    <td className="py-4 px-6">
                      <div className="space-y-1.5">
                        <div className="h-4 w-28 skeleton" />
                        <div className="h-3 w-36 skeleton" />
                      </div>
                    </td>
                    <td className="py-4 px-6"><div className="h-4 w-16 skeleton" /></td>
                    <td className="py-4 px-6"><div className="h-4 w-20 skeleton" /></td>
                    <td className="py-4 px-6"><div className="h-5 w-12 rounded-full skeleton" /></td>
                    <td className="py-4 px-6 text-right"><div className="h-7 w-16 skeleton inline-block" /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : invoices.length === 0 ? (
          <div className="p-12 text-center text-white/40 text-xs">
            <FileText size={32} className="mx-auto mb-3 opacity-30" />
            No invoices registered. Use "Create Invoice" above to add records.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 bg-white/1 text-[10px] text-white/40 font-bold uppercase tracking-wider">
                  <th className="py-4 px-6">Invoice Number</th>
                  <th className="py-4 px-6">Customer</th>
                  <th className="py-4 px-6">Amount</th>
                  <th className="py-4 px-6">Due Date</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-xs">
                {invoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-white/1 transition-all">
                    <td className="py-4 px-6 font-semibold font-mono text-white">
                      {inv.invoiceNumber}
                    </td>
                    <td className="py-4 px-6">
                      <div>
                        <div className="font-medium text-white">{inv.customer?.name || 'Deleted Customer'}</div>
                        <div className="text-[10px] text-white/40 mt-0.5">{inv.customer?.email || ''}</div>
                      </div>
                    </td>
                    <td className="py-4 px-6 font-semibold text-white">
                      ${inv.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-4 px-6 text-white/60">
                      {new Date(inv.dueDate).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold border ${getStatusStyle(inv.status)}`}>
                        {inv.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {inv.status !== 'PAID' && inv.status !== 'VOID' && !isViewer && (
                          <button
                            onClick={() => {
                              setSelectedInvoice(inv);
                              setIsPaymentModalOpen(true);
                            }}
                            className="p-1.5 rounded-lg bg-white/2 hover:bg-brand-primary/10 hover:text-brand-primary text-white/50 border border-white/5 transition-colors cursor-pointer"
                            title="Log Payment Gateway"
                          >
                            <DollarSign size={14} />
                          </button>
                        )}
                        {isAdmin && (
                          <button
                            onClick={() => handleDeleteInvoice(inv.id)}
                            className="p-1.5 rounded-lg bg-white/2 hover:bg-red-500/10 hover:text-red-400 text-white/50 border border-white/5 transition-colors cursor-pointer"
                            title="Delete"
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal 1: Create Invoice */}
      <AnimatePresence>
        {isCreateModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-md glass-panel p-6 rounded-2xl border border-white/10 space-y-6 text-left relative"
            >
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-white font-editorial">New Invoice Request</h3>
                <button onClick={() => setIsCreateModalOpen(false)} className="text-white/40 hover:text-white cursor-pointer">
                  <X size={18} />
                </button>
              </div>

              {formError && (
                <div className="p-3 rounded-lg bg-red-500/15 border border-red-500/20 text-red-300 text-xs flex items-center gap-2">
                  <AlertCircle size={14} />
                  <span>{formError}</span>
                </div>
              )}

              <form onSubmit={handleCreateInvoice} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-white/60 uppercase">Customer Billing Target</label>
                  <select
                    value={newInvCustomerId}
                    onChange={(e) => setNewInvCustomerId(e.target.value)}
                    className="w-full px-3 py-2 bg-[#0b1220] border border-white/8 rounded-xl text-xs text-white outline-none focus:border-brand-primary"
                    required
                  >
                    <option value="" className="bg-[#050816]">Select Customer...</option>
                    {customers.map((c) => (
                      <option key={c.id} value={c.id} className="bg-[#050816]">{c.name} ({c.email})</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-white/60 uppercase">Invoice Number</label>
                    <input
                      type="text"
                      placeholder="LF-2026-001"
                      value={newInvNumber}
                      onChange={(e) => setNewInvNumber(e.target.value)}
                      className="w-full px-3 py-2 bg-[#0b1220] border border-white/8 rounded-xl text-xs text-white outline-none focus:border-brand-primary"
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-white/60 uppercase">Total Amount ($)</label>
                    <input
                      type="number"
                      placeholder="299.00"
                      step="0.01"
                      value={newInvAmount}
                      onChange={(e) => setNewInvAmount(e.target.value)}
                      className="w-full px-3 py-2 bg-[#0b1220] border border-white/8 rounded-xl text-xs text-white outline-none focus:border-brand-primary"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-white/60 uppercase">Due Date</label>
                    <input
                      type="date"
                      value={newInvDueDate}
                      onChange={(e) => setNewInvDueDate(e.target.value)}
                      className="w-full px-3 py-2 bg-[#0b1220] border border-white/8 rounded-xl text-xs text-white outline-none focus:border-brand-primary"
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-white/60 uppercase">Initial Status</label>
                    <select
                      value={newInvStatus}
                      onChange={(e) => setNewInvStatus(e.target.value as any)}
                      className="w-full px-3 py-2 bg-[#0b1220] border border-white/8 rounded-xl text-xs text-white outline-none focus:border-brand-primary"
                    >
                      <option value="DRAFT" className="bg-[#050816]">Draft</option>
                      <option value="SENT" className="bg-[#050816]">Sent</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3 bg-brand-primary rounded-xl text-white font-semibold text-xs flex justify-center items-center gap-1.5 hover:shadow-[0_0_15px_rgba(109,93,246,0.3)] transition-all cursor-pointer disabled:opacity-50"
                >
                  {submitting ? 'Creating...' : 'Register Invoice'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal 2: Log Payment Gateway Transaction */}
      <AnimatePresence>
        {isPaymentModalOpen && selectedInvoice && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-sm glass-panel p-6 rounded-2xl border border-white/10 space-y-6 text-left relative"
            >
              <div className="flex justify-between items-center">
                <h3 className="text-base font-semibold text-white">Record Billing Gateway Try</h3>
                <button
                  onClick={() => {
                    setIsPaymentModalOpen(false);
                    setSelectedInvoice(null);
                  }}
                  className="text-white/40 hover:text-white cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="p-4 rounded-xl bg-white/2 border border-white/5 space-y-1.5">
                <span className="text-[10px] text-white/40 font-bold uppercase tracking-wider block">Target Invoice</span>
                <div className="flex justify-between items-center text-xs font-semibold">
                  <span className="font-mono text-white">{selectedInvoice.invoiceNumber}</span>
                  <span className="text-white">${selectedInvoice.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                </div>
              </div>

              <form onSubmit={handleRecordPayment} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-white/60 uppercase">Gateway Provider</label>
                  <select
                    value={paymentProvider}
                    onChange={(e) => setPaymentProvider(e.target.value)}
                    className="w-full px-3 py-2.5 bg-[#0b1220] border border-white/8 rounded-xl text-xs text-white outline-none focus:border-brand-primary"
                  >
                    <option value="stripe" className="bg-[#050816]">Stripe API</option>
                    <option value="paypal" className="bg-[#050816]">PayPal gateway</option>
                    <option value="manual" className="bg-[#050816]">Manual Bank Transfer</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-white/60 uppercase">Transaction Status Result</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setPaymentStatus('SUCCESS')}
                      className={`py-2 px-3 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                        paymentStatus === 'SUCCESS'
                          ? 'border-green-500 bg-green-500/10 text-green-400'
                          : 'border-white/5 bg-[#0b1220] text-white/50'
                      }`}
                    >
                      SUCCESS
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentStatus('FAILED')}
                      className={`py-2 px-3 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                        paymentStatus === 'FAILED'
                          ? 'border-red-500 bg-red-500/10 text-red-400'
                          : 'border-white/5 bg-[#0b1220] text-white/50'
                      }`}
                    >
                      FAILED
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={paymentSubmitting}
                  className="w-full py-3 mt-2 bg-gradient-to-r from-brand-primary to-brand-primary/80 text-white font-semibold text-xs flex justify-center items-center gap-1.5 hover:shadow-[0_0_15px_rgba(109,93,246,0.3)] transition-all cursor-pointer disabled:opacity-50"
                >
                  <CreditCard size={14} />
                  {paymentSubmitting ? 'Recording...' : 'Submit Transaction'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
