"use client";

import React, { useEffect, useState } from 'react';
import { Tag, Plus, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import ClientPagination from '@/components/admin/ClientPagination';

const defaultForm = {
  code: '', discountType: 'percentage', discountValue: '', maxUses: '',
  minOrderAmount: '', expiresAt: '', description: ''
};

export default function CouponsPage() {
  const [coupons, setCoupons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ ...defaultForm });
  const [creating, setCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchCoupons = async (p = page) => {
    try {
      setLoading(true);
      const res = await fetch(`/api/admin/coupons?page=${p}&limit=10`);
      const data = await res.json();
      if (res.ok) {
        setCoupons(data.coupons || []);
        setTotalPages(Math.ceil((data.totalCount || 0) / 10));
      }
    } catch { /* ignore */ }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchCoupons(page); }, [page]);

  const createCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submitting form with state:', form);
    if (!form.code.trim() || form.discountValue === '' || form.discountValue === null || form.discountValue === undefined) { 
      toast.error('Code and discount value are required'); 
      return; 
    }
    setCreating(true);
    try {
      const res = await fetch('/api/admin/coupons', {
        method: editingId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          id: editingId,
          discountValue: parseFloat(form.discountValue),
          maxUses: form.maxUses ? parseInt(form.maxUses) : null,
          minOrderAmount: form.minOrderAmount ? parseFloat(form.minOrderAmount) : 0,
          expiresAt: form.expiresAt ? new Date(form.expiresAt).toISOString() : null
        })
      });
      const data = await res.json();
      if (res.ok) { 
        toast.success(editingId ? 'Coupon updated!' : 'Coupon created!'); 
        setForm({ ...defaultForm }); 
        setEditingId(null);
        fetchCoupons(); 
      }
      else toast.error(data.error || 'Failed to save coupon');
    } finally { setCreating(false); }
  };

  const handleEdit = (coupon: any) => {
    setEditingId(coupon._id);
    setForm({
      code: coupon.code,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue.toString(),
      maxUses: coupon.maxUses ? coupon.maxUses.toString() : '',
      minOrderAmount: coupon.minOrderAmount ? coupon.minOrderAmount.toString() : '',
      expiresAt: coupon.expiresAt ? new Date(coupon.expiresAt).toISOString().split('T')[0] : '',
      description: coupon.description || ''
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const [deactivatingId, setDeactivatingId] = useState<string | null>(null);

  const confirmDeactivate = async () => {
    if (!deactivatingId) return;
    await fetch('/api/admin/coupons', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: deactivatingId }) });
    toast.success('Coupon deactivated');
    setDeactivatingId(null);
    fetchCoupons();
  };

  const f = (key: string, val: string) => setForm(prev => ({ ...prev, [key]: val }));

  return (
    <div className="w-full space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight flex items-center gap-3">
          <Tag className="w-7 h-7" /> Coupons & Promo Codes
        </h1>
        <p className="text-gray-500 mt-1">Create discount coupons for your customers.</p>
      </div>

      {/* Create Form */}
      <div className="bg-white rounded-2xl p-8 shadow-[0_2px_10px_rgba(0,0,0,0.04)] border border-gray-100">
        <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
          <Plus className="w-5 h-5" /> {editingId ? 'Edit Coupon' : 'Create Coupon'}
        </h2>
        <form onSubmit={createCoupon} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Code *</label>
            <input value={form.code} onChange={e => f('code', e.target.value.toUpperCase())} placeholder="SUMMER20" className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-black uppercase font-mono font-bold" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Discount Type *</label>
            <select value={form.discountType} onChange={e => f('discountType', e.target.value)} className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-black">
              <option value="percentage">Percentage (%)</option>
              <option value="fixed">Fixed Amount (₹)</option>
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Value * {form.discountType === 'percentage' ? '(%)' : '(₹)'}</label>
            <input type="number" value={form.discountValue} onChange={e => f('discountValue', e.target.value)} placeholder={form.discountType === 'percentage' ? 'e.g. 20' : 'e.g. 500'} className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-black" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Max Uses (blank = unlimited)</label>
            <input type="number" value={form.maxUses} onChange={e => f('maxUses', e.target.value)} placeholder="100" className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-black" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Min Order Amount (₹)</label>
            <input type="number" value={form.minOrderAmount} onChange={e => f('minOrderAmount', e.target.value)} placeholder="0" className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-black" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Expires At</label>
            <input type="date" value={form.expiresAt} onChange={e => f('expiresAt', e.target.value)} className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-black" />
          </div>
          <div className="flex flex-col gap-1.5 md:col-span-2 lg:col-span-2">
            <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Description (shown to customer)</label>
            <input value={form.description} onChange={e => f('description', e.target.value)} placeholder="Get 20% off your order!" className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-black" />
          </div>
          <div className="flex items-end gap-2">
            {editingId && (
              <button 
                type="button" 
                onClick={() => { setEditingId(null); setForm({ ...defaultForm }); }}
                className="w-1/3 bg-gray-100 text-gray-700 font-bold rounded-xl py-2.5 text-sm uppercase tracking-widest hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
            )}
            <button type="submit" disabled={creating} className={`${editingId ? 'w-2/3' : 'w-full'} bg-black text-white font-bold rounded-xl py-2.5 text-sm uppercase tracking-widest hover:bg-gray-800 transition-colors disabled:opacity-50`}>
              {creating ? 'Saving...' : editingId ? 'Update Coupon' : 'Create Coupon'}
            </button>
          </div>
        </form>
      </div>

      {/* Coupons Table */}
      <div className="bg-white rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.04)] border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-50">
          <h2 className="text-lg font-bold">All Coupons</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-50 text-xs uppercase tracking-wider text-gray-400 bg-white font-semibold">
                <th className="py-4 px-6">Code</th>
                <th className="py-4 px-6">Type</th>
                <th className="py-4 px-6">Value</th>
                <th className="py-4 px-6">Used / Max</th>
                <th className="py-4 px-6">Min Order</th>
                <th className="py-4 px-6">Expires</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6"></th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={8} className="py-12 text-center text-gray-400">Loading...</td></tr>
              ) : coupons.length === 0 ? (
                <tr><td colSpan={8} className="py-12 text-center text-gray-400">No coupons yet. Create one above.</td></tr>
              ) : coupons.map(c => (
                <tr key={c._id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                  <td className="py-4 px-6 font-mono font-bold text-black">{c.code}</td>
                  <td className="py-4 px-6 capitalize text-gray-600">{c.discountType}</td>
                  <td className="py-4 px-6 font-bold">{c.discountType === 'percentage' ? `${c.discountValue}%` : `₹${c.discountValue}`}</td>
                  <td className="py-4 px-6 text-gray-600">{c.usedCount} / {c.maxUses ?? '∞'}</td>
                  <td className="py-4 px-6 text-gray-600">{c.minOrderAmount > 0 ? `₹${c.minOrderAmount}` : 'None'}</td>
                  <td className="py-4 px-6 text-gray-600">{c.expiresAt ? new Date(c.expiresAt).toLocaleDateString('en-IN') : 'Never'}</td>
                  <td className="py-4 px-6">
                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${c.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      {c.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    {c.isActive && (
                      <div className="flex items-center gap-3">
                        <button onClick={() => handleEdit(c)} className="text-blue-500 hover:text-blue-700 transition-colors font-medium text-xs">
                          Edit
                        </button>
                        <button onClick={() => setDeactivatingId(c._id)} className="text-red-400 hover:text-red-600 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <ClientPagination 
          currentPage={page} 
          totalPages={totalPages} 
          onPageChange={(p) => setPage(p)} 
        />
      </div>

      {deactivatingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl flex flex-col gap-4 border border-gray-100 animate-in fade-in zoom-in-95 duration-150">
            <div>
              <h3 className="font-bold text-gray-900 text-base">Deactivate Coupon</h3>
              <p className="text-xs text-gray-500 mt-1 font-medium">Are you sure you want to deactivate this coupon? Customers will no longer be able to use it.</p>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setDeactivatingId(null)}
                className="flex-1 py-2.5 px-4 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeactivate}
                className="flex-1 py-2.5 px-4 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors"
              >
                Deactivate
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}