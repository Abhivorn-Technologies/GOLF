"use client";

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function AccountInformation() {
  const { data: session, update } = useSession();
  const router = useRouter();

  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [newName, setNewName] = useState("");

  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [addressForm, setAddressForm] = useState({
    street: '', city: '', state: '', zip: '', country: 'India'
  });

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch('/api/user/profile');
        if (res.ok) {
          const data = await res.json();
          setProfile(data.user);
          setNewName(data.user.name);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, []);

  const handleSaveProfile = async () => {
    try {
      const res = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newName })
      });
      if (res.ok) {
        const data = await res.json();
        setProfile(data.user);
        setIsEditingProfile(false);
        // Inform NextAuth session to refresh (requires JWT logic, but visually it helps)
        update({ name: newName });
        router.refresh();
      } else {
        alert("Could not save. Is the local DB blocked by a firewall?");
      }
    } catch (e) {
      alert("Error saving profile");
    }
  };

  const handleAddAddress = async () => {
    try {
      const res = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newAddress: addressForm })
      });
      if (res.ok) {
        const data = await res.json();
        setProfile(data.user);
        setIsAddingAddress(false);
      } else {
        alert("Could not add address. Is the local DB blocked by a firewall?");
      }
    } catch (e) {
      alert("Error saving address");
    }
  };

  if (loading) return <div className="p-12 text-gray-400">Loading Profile...</div>;

  return (
    <div className="flex-1 w-full max-w-4xl relative">
      
      {/* Account Information Section */}
      <section className="mb-16">
        <h1 className="text-3xl font-black text-black uppercase tracking-tighter mb-8">
          Account Information
        </h1>

        <div className="grid grid-cols-1 gap-6">
          {/* Contact Information */}
          <div className="flex flex-col bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 p-8">
            <h3 className="text-sm font-bold text-gray-900 mb-6 uppercase tracking-wider">
              Contact Information
            </h3>
            
            {isEditingProfile ? (
              <div className="flex-1 mb-6 flex flex-col gap-3">
                <input 
                  type="text" 
                  value={newName} 
                  onChange={(e) => setNewName(e.target.value)} 
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black outline-none font-semibold text-black"
                />
                <p className="font-medium text-gray-500 text-sm">
                  {profile?.email} (Cannot edit email)
                </p>
                <div className="flex gap-2 mt-2">
                  <button onClick={handleSaveProfile} className="bg-black text-white px-4 py-2 rounded-lg font-bold text-xs uppercase hover:bg-gray-800">Save</button>
                  <button onClick={() => setIsEditingProfile(false)} className="bg-gray-100 text-black px-4 py-2 rounded-lg font-bold text-xs uppercase hover:bg-gray-200">Cancel</button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex-1 mb-8">
                  <p className="font-semibold text-black text-lg mb-1">
                    {profile?.name || session?.user?.name || 'Loading...'}
                  </p>
                  <p className="font-medium text-gray-500 text-sm">
                    {profile?.email || session?.user?.email || 'Loading...'}
                  </p>
                </div>
                <button onClick={() => setIsEditingProfile(true)} className="self-start bg-black text-white rounded-lg px-6 py-2.5 font-bold text-xs tracking-widest uppercase hover:bg-gray-800 transition-colors w-full sm:w-auto text-center">
                  Edit Profile
                </button>
              </>
            )}
          </div>
        </div>
      </section>

      <hr className="border-gray-200 mb-12" />

      {/* Address Book Section */}
      <section>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <h2 className="text-3xl font-black text-black uppercase tracking-tighter">
            Address Book
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Default Addresses */}
          <div className="flex flex-col bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 p-8 md:col-span-2">
            <h3 className="text-sm font-bold text-gray-900 mb-6 uppercase tracking-wider">
              Saved Addresses
            </h3>
            <div className="flex-1 mb-8 flex flex-col gap-4">
              {profile?.addresses && profile.addresses.length > 0 ? (
                profile.addresses.map((addr: any, i: number) => (
                  <div key={i} className="p-4 border border-gray-200 rounded-lg">
                    <p className="font-semibold">{addr.street}</p>
                    <p className="text-gray-500 text-sm">{addr.city}, {addr.state} {addr.zip}</p>
                    <p className="text-gray-500 text-sm">{addr.country}</p>
                  </div>
                ))
              ) : (
                <p className="font-medium text-gray-500 text-sm italic">
                  You have not set any addresses.
                </p>
              )}
            </div>
            <button onClick={() => setIsAddingAddress(true)} className="self-start bg-black text-white rounded-lg px-6 py-2.5 font-bold text-xs tracking-widest uppercase hover:bg-gray-800 transition-colors w-full sm:w-auto text-center">
              Add New Address
            </button>
          </div>
        </div>
      </section>

      {/* Add Address Modal Overlay */}
      {isAddingAddress && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
            <h2 className="text-2xl font-black uppercase tracking-tight mb-6">Add Address</h2>
            
            <div className="flex flex-col gap-4 mb-6">
              <input type="text" placeholder="Street Address" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black outline-none" value={addressForm.street} onChange={e => setAddressForm({...addressForm, street: e.target.value})} />
              <div className="flex gap-4">
                <input type="text" placeholder="City" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black outline-none" value={addressForm.city} onChange={e => setAddressForm({...addressForm, city: e.target.value})} />
                <input type="text" placeholder="State" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black outline-none" value={addressForm.state} onChange={e => setAddressForm({...addressForm, state: e.target.value})} />
              </div>
              <div className="flex gap-4">
                <input type="text" placeholder="PIN / ZIP Code" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black outline-none" value={addressForm.zip} onChange={e => setAddressForm({...addressForm, zip: e.target.value})} />
                <input type="text" placeholder="Country" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black outline-none" value={addressForm.country} onChange={e => setAddressForm({...addressForm, country: e.target.value})} />
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={handleAddAddress} className="flex-1 bg-black text-white px-4 py-3 rounded-xl font-bold text-sm uppercase tracking-widest hover:bg-gray-800 transition-colors">Save Address</button>
              <button onClick={() => setIsAddingAddress(false)} className="flex-1 bg-gray-100 text-black px-4 py-3 rounded-xl font-bold text-sm uppercase tracking-widest hover:bg-gray-200 transition-colors">Cancel</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
