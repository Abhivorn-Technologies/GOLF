"use client";

import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, MapPin } from 'lucide-react';
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
      if (res.ok) setAddresses(data.addresses);
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
        setAddresses(data.addresses);
        toast.success(editingId ? 'Address updated' : 'Address added');
        resetForm();
      } else {
        toast.error(data.error || 'Failed to save address');
      }
    } catch (error) {
      toast.error('Failed to save address');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this address?')) return;
    try {
      const res = await fetch(`/api/user/addresses?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (res.ok) {
        setAddresses(data.addresses);
        toast.success('Address deleted');
      }
    } catch (error) {
      toast.error('Failed to delete address');
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
      city: addr.city,
      state: addr.state,
      zip: addr.zip,
      country: addr.country,
      isDefaultShipping: addr.isDefaultShipping,
      isDefaultBilling: addr.isDefaultBilling
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

  if (loading) return <div className="p-8 text-center text-gray-500">Loading addresses...</div>;

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-black text-black uppercase tracking-tighter">
          Address Book
        </h2>
        {!isAdding && addresses.length < 5 && (
           <button 
             onClick={() => setIsAdding(true)}
             className="bg-black text-white rounded-xl py-3 px-6 font-bold text-xs uppercase tracking-widest hover:bg-gray-800 transition-colors flex items-center gap-2"
           >
             <Plus className="w-4 h-4" /> Add New
           </button>
        )}
      </div>

      {!isAdding ? (
        <div className="flex flex-col gap-6">
          {addresses.length === 0 ? (
             <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 p-16 text-center flex flex-col items-center">
               <MapPin className="w-16 h-16 text-gray-300 mb-6" strokeWidth={1.5} />
               <h3 className="text-xl font-black text-black mb-2 uppercase tracking-tighter">No Addresses Found</h3>
               <p className="font-medium text-gray-500 text-sm mb-8 max-w-md">
                 You haven't saved any addresses yet. Add one now to make checkout faster!
               </p>
               <button onClick={() => setIsAdding(true)} className="inline-block bg-black text-white px-8 py-3.5 rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-gray-800 transition-all shadow-md">
                 Add New Address
               </button>
             </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {addresses.map((addr) => (
                <div key={addr._id} className="bg-white rounded-2xl border border-gray-200 p-6 flex flex-col relative overflow-hidden group">
                  {(addr.isDefaultShipping || addr.isDefaultBilling) && (
                    <div className="absolute top-0 right-0 bg-black text-white text-[9px] font-bold uppercase tracking-widest px-3 py-1 rounded-bl-xl z-10">
                      {addr.isDefaultShipping && addr.isDefaultBilling ? 'Default Billing & Shipping' : 
                       addr.isDefaultShipping ? 'Default Shipping' : 'Default Billing'}
                    </div>
                  )}
                  
                  <div className="flex flex-col gap-1 text-sm text-gray-600 mt-4 flex-1">
                    <span className="font-bold text-black text-lg mb-2">{addr.name}</span>
                    <span>{addr.houseNumber ? `${addr.houseNumber}, ` : ''}{addr.street}</span>
                    <span>{addr.area ? `${addr.area}, ` : ''}{addr.city}, {addr.state} {addr.zip}</span>
                    <span>{addr.country}</span>
                    <span className="mt-3 font-semibold text-gray-800">T: {addr.phone}</span>
                  </div>

                  <div className="flex gap-3 mt-6 pt-6 border-t border-gray-100">
                    <button onClick={() => startEdit(addr)} className="flex-1 flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-700 hover:text-black bg-gray-50 hover:bg-gray-100 py-2.5 rounded-lg transition-colors">
                      <Edit2 className="w-3 h-3" /> Edit
                    </button>
                    <button onClick={() => handleDelete(addr._id)} className="flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 px-4 py-2.5 rounded-lg transition-colors">
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-2xl p-8">
          <h3 className="font-black text-xl text-black mb-6 uppercase tracking-tight">
            {editingId ? 'Edit Address' : 'Add New Address'}
          </h3>

          <form onSubmit={handleSave} className="flex flex-col gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Full Name *</label>
                <input required type="text" maxLength={50} value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-black" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Phone Number *</label>
                <input required type="tel" maxLength={20} value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-black" />
              </div>
              <div className="flex flex-col gap-2 md:col-span-2">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-500">House / Flat No.</label>
                <input type="text" maxLength={100} value={formData.houseNumber} onChange={e => setFormData({...formData, houseNumber: e.target.value})} className="border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-black" />
              </div>
              <div className="flex flex-col gap-2 md:col-span-2">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Street Address *</label>
                <input required type="text" maxLength={100} value={formData.street} onChange={e => setFormData({...formData, street: e.target.value})} className="border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-black" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Area / Locality</label>
                <input type="text" maxLength={100} value={formData.area} onChange={e => setFormData({...formData, area: e.target.value})} className="border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-black" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Landmark</label>
                <input type="text" maxLength={100} value={formData.landmark} onChange={e => setFormData({...formData, landmark: e.target.value})} className="border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-black" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-500">City *</label>
                <input required type="text" maxLength={50} value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} className="border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-black" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-500">State *</label>
                <input required type="text" maxLength={50} value={formData.state} onChange={e => setFormData({...formData, state: e.target.value})} className="border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-black" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Pincode *</label>
                <input required type="text" maxLength={20} value={formData.zip} onChange={e => setFormData({...formData, zip: e.target.value})} className="border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-black" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Country *</label>
                <input required type="text" maxLength={50} value={formData.country} onChange={e => setFormData({...formData, country: e.target.value})} className="border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-black" />
              </div>
            </div>

            <div className="flex flex-col gap-3 mt-4">
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={formData.isDefaultBilling} onChange={e => setFormData({...formData, isDefaultBilling: e.target.checked})} className="w-5 h-5 accent-black rounded border-gray-300" />
                <span className="text-sm font-bold text-gray-700">Set as default billing address</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={formData.isDefaultShipping} onChange={e => setFormData({...formData, isDefaultShipping: e.target.checked})} className="w-5 h-5 accent-black rounded border-gray-300" />
                <span className="text-sm font-bold text-gray-700">Set as default shipping address</span>
              </label>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 mt-6 pt-6 border-t border-gray-100">
              <button type="submit" className="flex-1 bg-black text-white rounded-xl py-3.5 px-6 font-bold text-xs uppercase tracking-widest hover:bg-gray-800 transition-colors">
                Save Address
              </button>
              <button type="button" onClick={resetForm} className="flex-1 bg-white border border-gray-200 text-black rounded-xl py-3.5 px-6 font-bold text-xs uppercase tracking-widest hover:bg-gray-50 transition-colors">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
