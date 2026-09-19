"use client";

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { User, Mail, ShieldCheck, Bell, Edit3, Check, X, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AccountInformation() {
  const { data: session, update } = useSession();
  const router = useRouter();

  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [newName, setNewName] = useState("");
  const [newsletter, setNewsletter] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch('/api/user/profile');
        if (res.ok) {
          const data = await res.json();
          setProfile(data.user);
          setNewName(data.user.name || "");
          setNewsletter(data.user.newsletterSubscribed || false);
        }
      } catch (err) {
        console.error("Failed to load profile", err);
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, []);

  const handleSaveProfile = async () => {
    if (!newName.trim()) return;
    setSaving(true);
    try {
      const res = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newName.trim(), newsletterSubscribed: newsletter })
      });
      if (res.ok) {
        const data = await res.json();
        setProfile(data.user);
        setIsEditingProfile(false);
        toast.success("Profile updated successfully");
      } else {
        toast.error("Failed to update profile.");
      }
    } catch (e) {
      toast.error("Error saving profile");
    } finally {
      setSaving(false);
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
      setNewsletter(!newValue);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
        <div className="w-8 h-8 border-4 border-zinc-200 border-t-zinc-900 rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-zinc-500 text-sm font-medium">Loading your profile information...</p>
      </div>
    );
  }

  const memberSince = profile?.createdAt 
    ? new Date(profile.createdAt).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })
    : 'Member';

  return (
    <div className="w-full font-sans space-y-6">
      
      {/* Top Welcome Header Banner */}
      <div className="bg-gradient-to-r from-zinc-900 via-zinc-800 to-zinc-900 text-white rounded-2xl p-6 md:p-8 shadow-sm relative overflow-hidden">
        <div className="absolute right-0 top-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                <Sparkles className="w-3.5 h-3.5" />
                {profile?.role === 'admin' ? 'Administrator' : 'Valued Customer'}
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
              {profile?.name || session?.user?.name || 'My Account'}
            </h1>
            <p className="text-zinc-400 text-sm mt-1">
              Member since {memberSince}
            </p>
          </div>

          <button 
            onClick={() => setIsEditingProfile(!isEditingProfile)}
            className="self-start md:self-auto bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/20 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2"
          >
            <Edit3 className="w-4 h-4" />
            {isEditingProfile ? 'Cancel Editing' : 'Edit Profile'}
          </button>
        </div>
      </div>

      {/* Main Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Personal Details Card */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 mb-5 border-b border-gray-100">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-zinc-100 rounded-xl text-zinc-900">
                  <User className="w-4 h-4" />
                </div>
                <h2 className="font-bold text-zinc-900 text-base">Personal Details</h2>
              </div>
            </div>

            {isEditingProfile ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1.5">Full Name</label>
                  <input 
                    type="text" 
                    value={newName} 
                    onChange={(e) => setNewName(e.target.value)} 
                    className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-sm font-semibold text-zinc-900 focus:bg-white focus:border-zinc-900 outline-none transition-all"
                    placeholder="Enter your name"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1.5">Email Address</label>
                  <input 
                    type="text" 
                    value={profile?.email || ''} 
                    disabled 
                    className="w-full px-4 py-3 bg-zinc-100 border border-zinc-200 rounded-xl text-sm font-medium text-zinc-400 cursor-not-allowed"
                  />
                  <span className="text-[11px] text-zinc-400 mt-1 block">Email address cannot be changed</span>
                </div>

                <div className="flex items-center gap-3 pt-4">
                  <button 
                    onClick={handleSaveProfile}
                    disabled={saving}
                    className="flex-1 bg-zinc-900 hover:bg-black text-white px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2"
                  >
                    <Check className="w-4 h-4" />
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button 
                    onClick={() => setIsEditingProfile(false)}
                    className="px-4 py-3 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-5">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400 block mb-1">Full Name</span>
                  <span className="font-bold text-zinc-900 text-lg block">{profile?.name || 'Not specified'}</span>
                </div>

                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400 block mb-1">Email Address</span>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-zinc-400" />
                    <span className="font-medium text-zinc-800 text-sm">{profile?.email}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Account Security & Preferences Card */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col justify-between space-y-6">
          
          <div>
            <div className="flex items-center gap-2.5 pb-4 mb-5 border-b border-gray-100">
              <div className="p-2 bg-emerald-50 rounded-xl text-emerald-600">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <h2 className="font-bold text-zinc-900 text-base">Account Security</h2>
            </div>

            <div className="flex items-center justify-between p-3.5 bg-zinc-50 rounded-xl border border-zinc-100">
              <div className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></div>
                <span className="text-sm font-semibold text-zinc-800">Account Status</span>
              </div>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full uppercase tracking-wider">
                Active & Verified
              </span>
            </div>
          </div>

          {/* Newsletter Preferences */}
          <div className="pt-4 border-t border-gray-100">
            <div className="flex items-start justify-between gap-4">
              <div className="flex gap-3">
                <div className="p-2 bg-zinc-100 rounded-xl text-zinc-700 shrink-0">
                  <Bell className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-semibold text-zinc-900 text-sm">Newsletter & Updates</h3>
                  <p className="text-xs text-zinc-500 mt-0.5 leading-relaxed">
                    Get special offers, new product alerts, and golf equipment guides.
                  </p>
                </div>
              </div>

              {/* Custom Toggle Switch */}
              <button 
                onClick={handleToggleNewsletter}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-colors duration-300 ${newsletter ? 'bg-emerald-600' : 'bg-zinc-200'}`}
                aria-label="Toggle newsletter"
              >
                <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-300 ease-in-out ${newsletter ? 'translate-x-5' : 'translate-x-0.5'}`} />
              </button>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
