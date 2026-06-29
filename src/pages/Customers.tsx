import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Plus, Search, Trash2, Edit3, X, AlertCircle } from 'lucide-react';

interface Customer {
  id: string;
  name: string;
  email: string;
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: string;
  _count?: {
    invoices: number;
  };
}

export const Customers: React.FC = () => {
  const { api, user } = useAuth();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Modals state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);

  // Form Fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'ACTIVE' | 'INACTIVE'>('ACTIVE');
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const isViewer = user?.role.toUpperCase() === 'VIEWER';
  const isAdmin = user?.role.toUpperCase() === 'ADMIN';

  const fetchCustomers = async () => {
    try {
      const res = await api.get('/customers', {
        params: { search: search || undefined }
      });
      setCustomers(res.data);
    } catch (error) {
      console.error('Error fetching customers:', error);
    }
  };

  useEffect(() => {
    const initPage = async () => {
      setLoading(true);
      await fetchCustomers();
      setLoading(false);
    };
    initPage();
  }, [search]);

  const handleOpenCreate = () => {
    setEditingCustomer(null);
    setName('');
    setEmail('');
    setStatus('ACTIVE');
    setFormError('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (customer: Customer) => {
    setEditingCustomer(customer);
    setName(customer.name);
    setEmail(customer.email);
    setStatus(customer.status);
    setFormError('');
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) {
      return setFormError('Name and Email are required.');
    }
    setFormError('');
    setSubmitting(true);

    try {
      if (editingCustomer) {
        // Edit Customer
        await api.put(`/customers/${editingCustomer.id}`, {
          name,
          email,
          status,
        });
      } else {
        // Create Customer
        await api.post('/customers', {
          name,
          email,
          status,
        });
      }

      setIsModalOpen(false);
      fetchCustomers();
    } catch (error: any) {
      setFormError(error.response?.data?.error || 'Failed to submit customer data.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this customer? This will also delete all related invoices.')) return;
    try {
      await api.delete(`/customers/${id}`);
      fetchCustomers();
    } catch (error) {
      console.error('Failed to delete customer:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white font-editorial">
            Customer Directory
          </h1>
          <p className="text-white/60 text-sm mt-1">
            Manage corporate client accounts, billing settings, and directories.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          disabled={isViewer}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-brand-primary to-brand-primary/80 text-white text-xs font-bold uppercase tracking-wider rounded-xl hover:shadow-[0_0_15px_rgba(109,93,246,0.25)] transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
        >
          <Plus size={14} />
          Add Customer
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex items-center bg-white/2 border border-white/5 p-4 rounded-xl">
        <div className="relative flex-1">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40">
            <Search size={16} />
          </span>
          <input
            type="text"
            placeholder="Search by client name or email address..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white/2 border border-white/5 rounded-xl pl-10 pr-4 py-2.5 text-xs outline-none text-white focus:border-brand-primary/80 focus:bg-white/4 transition-all"
          />
        </div>
      </div>

      {/* Customers List */}
      <div className="glass-panel rounded-2xl border border-white/5 overflow-hidden">
        {loading ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 bg-white/1 text-[10px] text-white/40 font-bold uppercase tracking-wider">
                  <th className="py-4 px-6">Name</th>
                  <th className="py-4 px-6">Email</th>
                  <th className="py-4 px-6">Invoices Generated</th>
                  <th className="py-4 px-6">Joined Date</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-xs">
                {[1, 2, 3, 4, 5].map((i) => (
                  <tr key={i}>
                    <td className="py-4 px-6"><div className="h-4 w-28 skeleton" /></td>
                    <td className="py-4 px-6"><div className="h-4 w-40 skeleton font-mono" /></td>
                    <td className="py-4 px-6"><div className="h-4 w-16 skeleton" /></td>
                    <td className="py-4 px-6"><div className="h-4 w-20 skeleton" /></td>
                    <td className="py-4 px-6"><div className="h-5 w-12 rounded-full skeleton" /></td>
                    <td className="py-4 px-6 text-right"><div className="h-7 w-16 skeleton inline-block" /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : customers.length === 0 ? (
          <div className="p-12 text-center text-white/40 text-xs">
            <Users size={32} className="mx-auto mb-3 opacity-30" />
            No customers registered. Use "Add Customer" to create records.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 bg-white/1 text-[10px] text-white/40 font-bold uppercase tracking-wider">
                  <th className="py-4 px-6">Name</th>
                  <th className="py-4 px-6">Email</th>
                  <th className="py-4 px-6">Invoices Generated</th>
                  <th className="py-4 px-6">Joined Date</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-xs">
                {customers.map((c) => (
                  <tr key={c.id} className="hover:bg-white/1 transition-all">
                    <td className="py-4 px-6 font-semibold text-white">
                      {c.name}
                    </td>
                    <td className="py-4 px-6 font-mono text-white/70">
                      {c.email}
                    </td>
                    <td className="py-4 px-6 text-white/60">
                      {c._count?.invoices ?? 0} invoices
                    </td>
                    <td className="py-4 px-6 text-white/60">
                      {new Date(c.createdAt).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                        c.status === 'ACTIVE'
                          ? 'bg-green-500/10 text-green-400 border-green-500/20'
                          : 'bg-white/5 text-white/40 border-white/10'
                      }`}>
                        {c.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {!isViewer && (
                          <button
                            onClick={() => handleOpenEdit(c)}
                            className="p-1.5 rounded-lg bg-white/2 hover:bg-brand-primary/10 hover:text-brand-primary text-white/50 border border-white/5 transition-colors cursor-pointer"
                            title="Edit"
                          >
                            <Edit3 size={14} />
                          </button>
                        )}
                        {isAdmin && (
                          <button
                            onClick={() => handleDelete(c.id)}
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

      {/* Modal: Create/Edit Customer */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-sm glass-panel p-6 rounded-2xl border border-white/10 space-y-6 text-left relative"
            >
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-white font-editorial">
                  {editingCustomer ? 'Update Client Details' : 'Add New Customer'}
                </h3>
                <button onClick={() => setIsModalOpen(false)} className="text-white/40 hover:text-white cursor-pointer">
                  <X size={18} />
                </button>
              </div>

              {formError && (
                <div className="p-3 rounded-lg bg-red-500/15 border border-red-500/20 text-red-300 text-xs flex items-center gap-2">
                  <AlertCircle size={14} />
                  <span>{formError}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-white/60 uppercase">Client Full Name</label>
                  <input
                    type="text"
                    placeholder="E.g. Acme Corp"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 bg-[#0b1220] border border-white/8 rounded-xl text-xs text-white outline-none focus:border-brand-primary"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-white/60 uppercase">Email Address</label>
                  <input
                    type="email"
                    placeholder="billing@acme.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 bg-[#0b1220] border border-white/8 rounded-xl text-xs text-white outline-none focus:border-brand-primary"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-white/60 uppercase">Customer status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full px-3 py-2 bg-[#0b1220] border border-white/8 rounded-xl text-xs text-white outline-none focus:border-brand-primary"
                  >
                    <option value="ACTIVE" className="bg-[#050816]">Active</option>
                    <option value="INACTIVE" className="bg-[#050816]">Inactive (Suspended)</option>
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3 bg-brand-primary rounded-xl text-white font-semibold text-xs flex justify-center items-center gap-1.5 hover:shadow-[0_0_15px_rgba(109,93,246,0.3)] transition-all cursor-pointer disabled:opacity-50"
                >
                  {submitting ? 'Saving...' : editingCustomer ? 'Update Client' : 'Register Customer'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
