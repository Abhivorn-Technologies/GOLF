"use client";

import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, MapPin, Check, X, Building, Phone, User } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AccountAddress() {
  const [addresses, setAddresses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    houseNumber: '',
    street: '',
    area: '',
    landmark: '',
    city: '',
    state: '',
    zip: '',
    country: 'India',
    isDefaultShipping: false,
    isDefaultBilling: false
  });

  const fetchAddresses = async () => {
    try {
      const res = await fetch('/api/user/addresses');
      const data = await res.json();
      if (res.ok) setAddresses(data.addresses || []);
    } catch (error) {
      console.error('Failed to fetch addresses', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const method = editingId ? 'PUT' : 'POST';
      const body = editingId ? { ...formData, _id: editingId } : formData;

      const res = await fetch('/api/user/addresses', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      const data = await res.json();
      
      if (res.ok) {
        setAddresses(data.addresses || []);
        toast.success(editingId ? 'Address updated' : 'Address added');
        resetForm();
      } else {
        toast.error(data.error || 'Failed to save address');
      }
    } catch (error) {
      toast.error('Failed to save address');
    }
  };

  const [deletingId, setDeletingId] = useState<string | null>(null);

  const confirmDeleteAddress = async () => {
    if (!deletingId) return;
    try {
      const res = await fetch(`/api/user/addresses?id=${deletingId}`, { method: 'DELETE' });
      const data = await res.json();
      if (res.ok) {
        setAddresses(data.addresses || []);
        toast.success('Address deleted');
      }
    } catch (error) {
      toast.error('Failed to delete address');
    } finally {
      setDeletingId(null);
    }
  };

  const startEdit = (addr: any) => {
    setEditingId(addr._id);
    setFormData({
      name: addr.name || '',
      phone: addr.phone || '',
      houseNumber: addr.houseNumber || '',
      street: addr.street || '',
      area: addr.area || '',
      landmark: addr.landmark || '',
      city: addr.city || '',
      state: addr.state || '',
      zip: addr.zip || '',
      country: addr.country || 'India',
      isDefaultShipping: !!addr.isDefaultShipping,
      isDefaultBilling: !!addr.isDefaultBilling
    });
    setIsAdding(true);
  };

  const resetForm = () => {
    setFormData({
      name: '', phone: '', houseNumber: '', street: '', area: '', landmark: '', city: '', state: '', zip: '', country: 'India', isDefaultShipping: false, isDefaultBilling: false
    });
    setEditingId(null);
    setIsAdding(false);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
        <div className="w-8 h-8 border-4 border-zinc-200 border-t-zinc-900 rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-zinc-500 text-sm font-medium">Loading saved addresses...</p>
      </div>
    );
  }

  return (
    <div className="w-full font-sans space-y-6">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">Address Book</h1>
          <p className="text-zinc-500 text-sm mt-0.5">Manage your shipping and billing locations</p>
        </div>

        {!isAdding && addresses.length < 5 && (
          <button 
            onClick={() => setIsAdding(true)}
            className="bg-zinc-900 hover:bg-black text-white px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-2 shadow-xs shrink-0"
          >
            <Plus className="w-4 h-4" /> Add New Address
          </button>
        )}
      </div>

      {!isAdding ? (
        <div className="space-y-6">
          {addresses.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col items-center">
              <div className="w-16 h-16 bg-zinc-50 rounded-full flex items-center justify-center mb-4">
                <MapPin className="w-8 h-8 text-zinc-400" strokeWidth={1.5} />
              </div>
              <h3 className="text-lg font-bold text-zinc-900 mb-1">No Saved Addresses</h3>
              <p className="text-zinc-500 text-sm mb-6 max-w-sm">
                Add your delivery address to speed up your checkout process.
              </p>
              <button onClick={() => setIsAdding(true)} className="bg-zinc-900 hover:bg-black text-white px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors">
                Add Address
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {addresses.map((addr) => (
                <div key={addr._id} className="bg-white rounded-2xl border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] p-6 flex flex-col justify-between relative transition-all hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)]">
                  <div>
                    {/* Default Badges */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {addr.isDefaultShipping && (
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                          Default Shipping
                        </span>
                      )}
                      {addr.isDefaultBilling && (
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                          Default Billing
                        </span>
                      )}
                    </div>

                    <div className="space-y-2">
                      <h3 className="font-bold text-zinc-900 text-base">{addr.name}</h3>
                      <p className="text-sm text-zinc-600 leading-relaxed">
                        {addr.houseNumber ? `${addr.houseNumber}, ` : ''}{addr.street}<br/>
                        {addr.area ? `${addr.area}, ` : ''}{addr.city}, {addr.state} {addr.zip}<br/>
                        {addr.country}
                      </p>
                      <div className="flex items-center gap-2 pt-2 text-xs font-semibold text-zinc-500">
                        <Phone className="w-3.5 h-3.5 text-zinc-400" />
                        <span>{addr.phone}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-5 mt-5 border-t border-gray-100">
                    <button 
                      onClick={() => startEdit(addr)} 
                      className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-zinc-700 hover:text-black bg-zinc-50 hover:bg-zinc-100 border border-gray-200 transition-colors"
                    >
                      <Edit2 className="w-3.5 h-3.5" /> Edit
                    </button>
                    <button 
                      onClick={() => setDeletingId(addr._id)} 
                      className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        /* Address Form Card */
        <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] p-6 md:p-8">
          <div className="flex justify-between items-center pb-5 mb-6 border-b border-gray-100">
            <h2 className="font-bold text-zinc-900 text-lg">
              {editingId ? 'Edit Address' : 'Add New Address'}
            </h2>
            <button onClick={resetForm} className="text-zinc-400 hover:text-zinc-900 transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSave} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-1.5">Full Name *</label>
                <input required type="text" maxLength={50} value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-sm font-medium text-zinc-900 focus:bg-white focus:border-zinc-900 outline-none transition-all" placeholder="Receiving full name" />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-1.5">Phone Number *</label>
                <input required type="tel" maxLength={20} value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-sm font-medium text-zinc-900 focus:bg-white focus:border-zinc-900 outline-none transition-all" placeholder="10-digit phone number" />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-1.5">House / Flat / Building No.</label>
                <input type="text" maxLength={100} value={formData.houseNumber} onChange={e => setFormData({...formData, houseNumber: e.target.value})} className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-sm font-medium text-zinc-900 focus:bg-white focus:border-zinc-900 outline-none transition-all" placeholder="Flat No. / House Name" />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-1.5">Street Address *</label>
                <input required type="text" maxLength={100} value={formData.street} onChange={e => setFormData({...formData, street: e.target.value})} className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-sm font-medium text-zinc-900 focus:bg-white focus:border-zinc-900 outline-none transition-all" placeholder="Street, Sector, or Block" />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-1.5">City *</label>
                <input required type="text" maxLength={50} value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-sm font-medium text-zinc-900 focus:bg-white focus:border-zinc-900 outline-none transition-all" placeholder="City" />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-1.5">State *</label>
                <input required type="text" maxLength={50} value={formData.state} onChange={e => setFormData({...formData, state: e.target.value})} className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-sm font-medium text-zinc-900 focus:bg-white focus:border-zinc-900 outline-none transition-all" placeholder="State" />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-1.5">Pincode *</label>
                <input required type="text" maxLength={20} value={formData.zip} onChange={e => setFormData({...formData, zip: e.target.value})} className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-sm font-medium text-zinc-900 focus:bg-white focus:border-zinc-900 outline-none transition-all" placeholder="Pincode / ZIP" />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-1.5">Country *</label>
                <input required type="text" maxLength={50} value={formData.country} onChange={e => setFormData({...formData, country: e.target.value})} className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-sm font-medium text-zinc-900 focus:bg-white focus:border-zinc-900 outline-none transition-all" placeholder="Country" />
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={formData.isDefaultShipping} onChange={e => setFormData({...formData, isDefaultShipping: e.target.checked})} className="w-4 h-4 rounded text-zinc-900 accent-zinc-900" />
                <span className="text-sm font-medium text-zinc-700">Set as default shipping address</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={formData.isDefaultBilling} onChange={e => setFormData({...formData, isDefaultBilling: e.target.checked})} className="w-4 h-4 rounded text-zinc-900 accent-zinc-900" />
                <span className="text-sm font-medium text-zinc-700">Set as default billing address</span>
              </label>
            </div>

            <div className="flex gap-4 pt-4 border-t border-gray-100">
              <button type="submit" className="bg-zinc-900 hover:bg-black text-white px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors">
                Save Address
              </button>
              <button type="button" onClick={resetForm} className="bg-zinc-100 hover:bg-zinc-200 text-zinc-700 px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {deletingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl flex flex-col gap-4 border border-gray-100 animate-in fade-in zoom-in-95 duration-150">
            <div>
              <h3 className="font-bold text-zinc-900 text-base">Delete Address</h3>
              <p className="text-xs text-zinc-500 mt-1 font-medium">Are you sure you want to delete this address? This action cannot be undone.</p>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setDeletingId(null)}
                className="flex-1 py-2.5 px-4 bg-zinc-100 text-zinc-700 hover:bg-zinc-200 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteAddress}
                className="flex-1 py-2.5 px-4 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
