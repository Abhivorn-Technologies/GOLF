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
  const [newsletter, setNewsletter] = useState(false);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch('/api/user/profile');
        if (res.ok) {
          const data = await res.json();
          setProfile(data.user);
          setNewName(data.user.name);
          setNewsletter(data.user.newsletterSubscribed || false);
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
        body: JSON.stringify({ name: newName, newsletterSubscribed: newsletter })
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

  const handleToggleNewsletter = async () => {
    const newValue = !newsletter;
    setNewsletter(newValue);
    try {
      const res = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newsletterSubscribed: newValue })
      });
      if (res.ok) {
        const data = await res.json();
        setProfile(data.user);
      }
    } catch (e) {
      console.error("Failed to update newsletter preference");
      setNewsletter(!newValue); // Revert on failure
    }
  };

  if (loading) return <div className="p-12 text-gray-400">Loading Profile...</div>;

  return (
    <div className="flex-1 w-full max-w-4xl relative">
      
      {/* Account Information Section */}
      <section className="mb-16">
        <h1 className="text-3xl md:text-4xl font-black text-black uppercase tracking-tighter mb-8 flex items-center gap-3">
          Account Details
          <span className="bg-black text-white text-[10px] px-3 py-1 rounded-full uppercase tracking-widest font-bold align-middle inline-flex mt-1">
            {profile?.role === 'admin' ? 'Administrator' : 'Customer'}
          </span>
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 font-['Hanken_Grotesk']">
          
          {/* Profile Card */}
          <div className="flex flex-col bg-white border-2 border-black overflow-hidden">
            <div className="bg-black text-white p-4 sm:p-6 flex justify-between items-center">
               <h3 className="text-xs font-black uppercase tracking-widest">
                Personal Info
               </h3>
               {!isEditingProfile && (
                 <button onClick={() => setIsEditingProfile(true)} className="text-white hover:text-gray-300 font-bold text-xs uppercase tracking-widest transition-colors">
                   Edit
                 </button>
               )}
            </div>
            
            <div className="p-5 sm:p-8 flex flex-col gap-8 h-full">
              {isEditingProfile ? (
                <div className="flex flex-col gap-5 h-full">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Full Name</label>
                    <input 
                      type="text" 
                      value={newName} 
                      onChange={(e) => setNewName(e.target.value)} 
                      className="w-full px-0 py-2 bg-transparent border-0 border-b-2 border-gray-200 focus:ring-0 focus:border-black outline-none font-bold text-black text-lg transition-colors placeholder:text-gray-300"
                      placeholder="Your Name"
                    />
                  </div>
                  
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-black uppercase tracking-widest">Email Address</label>
                    <input 
                      type="text" 
                      value={profile?.email} 
                      disabled
                      className="w-full px-0 py-2 bg-transparent border-0 border-b-2 border-gray-200 text-gray-500 font-medium text-lg cursor-not-allowed"
                    />
                    <span className="text-[10px] text-gray-500 font-medium">* Email address cannot be changed</span>
                  </div>

                  <div className="flex gap-3 mt-auto pt-4">
                    <button onClick={() => setIsEditingProfile(false)} className="flex-1 bg-white border-2 border-black text-black px-4 py-4 font-bold text-xs tracking-widest uppercase hover:bg-gray-100 transition-colors">Cancel</button>
                    <button onClick={handleSaveProfile} className="flex-1 bg-black text-white px-4 py-4 font-bold text-xs tracking-widest uppercase hover:bg-gray-900 transition-colors">Save</button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col h-full justify-between gap-8">
                  <div className="flex flex-col gap-6">
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] font-bold text-black uppercase tracking-widest">Full Name</span>
                      <span className="font-black text-black text-2xl tracking-tight leading-none">
                        {profile?.name || session?.user?.name || 'Loading...'}
                      </span>
                    </div>
                    
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] font-bold text-black uppercase tracking-widest">Email Address</span>
                      <span className="font-bold text-gray-800 text-base">
                        {profile?.email || session?.user?.email || 'Loading...'}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Account Status Card */}
          <div className="flex flex-col gap-6 sm:gap-8">
            <div className="bg-white border-2 border-black p-5 sm:p-8 flex flex-col gap-6">
              <h3 className="text-xs font-black text-black uppercase tracking-widest border-b-2 border-black pb-4">
                Account Status
              </h3>
              
              <div className="flex items-center justify-between">
                <span className="font-bold text-black text-sm uppercase tracking-widest">Member Since</span>
                <span className="font-bold text-white bg-black px-4 py-2 text-xs tracking-widest uppercase">
                  {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString(undefined, { month: 'long', year: 'numeric' }) : 'Recently'}
                </span>
              </div>
            </div>

            {/* Newsletter Card */}
            <div className="bg-white border-2 border-black p-5 sm:p-8 flex flex-col gap-6 h-full justify-between">
              <h3 className="text-xs font-black text-black uppercase tracking-widest border-b-2 border-black pb-4">
                Preferences
              </h3>
              
              <div className="flex items-start justify-between gap-4 mt-2">
                <div className="flex flex-col gap-1">
                  <span className="font-bold text-black text-sm uppercase tracking-widest">Newsletter</span>
                  <span className="font-semibold text-gray-600 text-xs leading-relaxed max-w-[200px]">
                    Receive updates on new arrivals, exclusive discounts, and golf tips.
                  </span>
                </div>
                
                {/* Custom Toggle Switch */}
                <button 
                  onClick={handleToggleNewsletter}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center justify-center rounded-full focus:outline-none transition-colors duration-300 ${newsletter ? 'bg-black' : 'bg-gray-200'}`}
                >
                  <span className="sr-only">Toggle newsletter</span>
                  <span aria-hidden="true" className={`pointer-events-none absolute left-0.5 h-5 w-5 rounded-full bg-white shadow ring-0 transition-transform duration-300 ease-in-out ${newsletter ? 'translate-x-5' : 'translate-x-0'}`} />
                </button>
              </div>
            </div>
          </div>
          
        </div>
      </section>

    </div>
  );
}
