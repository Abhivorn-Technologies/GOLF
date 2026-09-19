"use client";

import React, { useState, useEffect } from 'react';
import { 
  Megaphone, 
  Send, 
  Users, 
  Mail, 
  History, 
  CheckCircle2, 
  AlertCircle, 
  Eye, 
  Tag, 
  X, 
  Info,
  Loader2,
  Sparkles
} from 'lucide-react';
import toast from 'react-hot-toast';

interface BroadcastLog {
  _id: string;
  subject: string;
  title: string;
  discountCode?: string;
  message: string;
  targetAudience: string;
  recipientCount: number;
  status: string;
  createdAt: string;
}

interface Stats {
  totalUsers: number;
  subscribedUsers: number;
  totalBroadcasts: number;
}

export default function AdminBroadcastPage() {
  const [stats, setStats] = useState<Stats>({ totalUsers: 0, subscribedUsers: 0, totalBroadcasts: 0 });
  const [broadcasts, setBroadcasts] = useState<BroadcastLog[]>([]);
  const [isSmtpConfigured, setIsSmtpConfigured] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  // Form State
  const [subject, setSubject] = useState('');
  const [title, setTitle] = useState('');
  const [discountCode, setDiscountCode] = useState('');
  const [message, setMessage] = useState('');
  const [targetAudience, setTargetAudience] = useState<'all' | 'subscribers_only'>('all');

  // Modals
  const [showPreview, setShowPreview] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const fetchBroadcastData = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/broadcast');
      const data = await res.json();

      if (data.success) {
        setStats(data.stats);
        setBroadcasts(data.broadcasts || []);
        setIsSmtpConfigured(Boolean(data.isSmtpConfigured));
      } else {
        toast.error(data.error || 'Failed to load broadcast stats');
      }
    } catch (err) {
      console.error(err);
      toast.error('Error connecting to server');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBroadcastData();
  }, []);

  const recipientCountEstimate = targetAudience === 'all' ? stats.totalUsers : stats.subscribedUsers;

  const handleSendBroadcast = async () => {
    if (!subject.trim()) {
      toast.error('Please enter an email subject');
      return;
    }
    if (!title.trim()) {
      toast.error('Please enter an offer title');
      return;
    }
    if (!message.trim()) {
      toast.error('Please enter offer message details');
      return;
    }

    try {
      setSending(true);
      setShowConfirmModal(false);

      const res = await fetch('/api/admin/broadcast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject,
          title,
          discountCode,
          message,
          targetAudience
        })
      });

      const data = await res.json();

      if (data.success) {
        toast.success(data.message || 'Offer broadcast sent successfully!');
        setSubject('');
        setTitle('');
        setDiscountCode('');
        setMessage('');
        fetchBroadcastData();
      } else {
        toast.error(data.error || 'Failed to send broadcast');
      }
    } catch (err) {
      console.error(err);
      toast.error('An unexpected error occurred while sending');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-gray-900 via-black to-gray-900 text-white p-8 rounded-2xl shadow-xl relative overflow-hidden">
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-300 text-xs font-semibold px-3 py-1 rounded-full border border-emerald-500/30">
            <Sparkles className="w-3.5 h-3.5" /> Bulk Marketing & Announcements
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Broadcast Offers to Users</h1>
          <p className="text-gray-300 text-sm max-w-2xl">
            Send instant promotional emails, discount codes, and offer updates to all registered customers at once.
          </p>
        </div>
        <div className="relative z-10 flex items-center gap-3">
          <div className={`px-4 py-2.5 rounded-xl border text-xs font-semibold flex items-center gap-2 ${
            isSmtpConfigured 
              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' 
              : 'bg-amber-500/10 text-amber-300 border-amber-500/30'
          }`}>
            <span className={`w-2 h-2 rounded-full ${isSmtpConfigured ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`}></span>
            {isSmtpConfigured ? 'SMTP Mailer Ready' : 'Dev Simulation Mode'}
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-5">
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center font-bold">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Total Registered Users</p>
            <p className="text-2xl font-bold text-gray-900 mt-0.5">{stats.totalUsers}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-5">
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center font-bold">
            <Mail className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Newsletter Subscribers</p>
            <p className="text-2xl font-bold text-gray-900 mt-0.5">{stats.subscribedUsers}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-5">
          <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center font-bold">
            <Megaphone className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Broadcasts Sent</p>
            <p className="text-2xl font-bold text-gray-900 mt-0.5">{stats.totalBroadcasts}</p>
          </div>
        </div>
      </div>

      {/* Main Broadcast Composer */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 md:p-8 border border-gray-100 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-gray-100 pb-5">
            <div>
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Send className="w-5 h-5 text-black" /> Compose Offer Announcement
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">Fill in offer details below to dispatch emails</p>
            </div>
            <button
              type="button"
              onClick={() => setShowPreview(true)}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
            >
              <Eye className="w-4 h-4" /> Preview Email
            </button>
          </div>

          <form onSubmit={(e) => { e.preventDefault(); setShowConfirmModal(true); }} className="space-y-5">
            {/* Target Audience */}
            <div>
              <label className="block text-xs font-semibold uppercase text-gray-600 tracking-wider mb-2">
                Target Audience
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setTargetAudience('all')}
                  className={`p-4 rounded-xl border text-left transition-all flex flex-col justify-between ${
                    targetAudience === 'all'
                      ? 'border-black bg-black/5 text-black font-semibold ring-2 ring-black/10'
                      : 'border-gray-200 hover:border-gray-300 text-gray-600'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">All Registered Users</span>
                    <Users className="w-4 h-4 text-gray-400" />
                  </div>
                  <span className="text-xs text-gray-500 mt-2">Reaches all registered user accounts ({stats.totalUsers} recipients)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setTargetAudience('subscribers_only')}
                  className={`p-4 rounded-xl border text-left transition-all flex flex-col justify-between ${
                    targetAudience === 'subscribers_only'
                      ? 'border-black bg-black/5 text-black font-semibold ring-2 ring-black/10'
                      : 'border-gray-200 hover:border-gray-300 text-gray-600'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Newsletter Subscribers Only</span>
                    <Mail className="w-4 h-4 text-gray-400" />
                  </div>
                  <span className="text-xs text-gray-500 mt-2">Reaches users opted into newsletter ({stats.subscribedUsers} recipients)</span>
                </button>
              </div>
            </div>

            {/* Email Subject */}
            <div>
              <label className="block text-xs font-semibold uppercase text-gray-600 tracking-wider mb-2">
                Email Subject Line *
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g., 🔥 Exclusive Weekend Sale: 20% Off All Golf Clubs!"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-black focus:ring-1 focus:ring-black outline-none text-sm transition-all"
                required
              />
            </div>

            {/* Offer Title & Promo Code */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-gray-600 tracking-wider mb-2">
                  Offer Headline / Title *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Autumn Golf Gear Flash Sale"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-black focus:ring-1 focus:ring-black outline-none text-sm transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-gray-600 tracking-wider mb-2">
                  Promo / Coupon Code (Optional)
                </label>
                <div className="relative">
                  <Tag className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    value={discountCode}
                    onChange={(e) => setDiscountCode(e.target.value.toUpperCase())}
                    placeholder="e.g., GOLF20"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-black focus:ring-1 focus:ring-black outline-none text-sm font-mono tracking-wider transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Message Body */}
            <div>
              <label className="block text-xs font-semibold uppercase text-gray-600 tracking-wider mb-2">
                Offer Details & Announcement Body *
              </label>
              <textarea
                rows={5}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Describe the offer, valid dates, discounts, and featured products..."
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-black focus:ring-1 focus:ring-black outline-none text-sm transition-all"
                required
              ></textarea>
            </div>

            {/* Actions */}
            <div className="pt-2 flex items-center justify-between border-t border-gray-100">
              <span className="text-xs text-gray-500 font-medium">
                Will send email to <strong className="text-black">{recipientCountEstimate}</strong> user(s)
              </span>

              <button
                type="submit"
                disabled={sending || recipientCountEstimate === 0}
                className="inline-flex items-center gap-2 bg-black text-white hover:bg-gray-800 disabled:bg-gray-300 px-6 py-3 rounded-xl text-sm font-semibold shadow-lg shadow-black/10 transition-all cursor-pointer disabled:cursor-not-allowed"
              >
                {sending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Dispatching Broadcast...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" /> Send Offer to {recipientCountEstimate} User(s)
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Sidebar Info & Instructions */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-4">
            <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2">
              <Info className="w-4 h-4 text-blue-600" /> How Broadcast Works
            </h3>
            <ul className="space-y-3 text-xs text-gray-600 leading-relaxed">
              <li className="flex gap-2">
                <span className="font-bold text-black">•</span>
                <span>Sends clean HTML formatted emails directly to registered customer email addresses.</span>
              </li>
              <li className="flex gap-2">
                <span className="font-bold text-black">•</span>
                <span>If a promo code is specified, it highlights a prominent discount box in the email.</span>
              </li>
              <li className="flex gap-2">
                <span className="font-bold text-black">•</span>
                <span>Configured to work in both live SMTP environments and local development mode.</span>
              </li>
            </ul>
          </div>

          <div className="bg-amber-50 rounded-2xl p-6 border border-amber-200/60 space-y-2 text-amber-900 text-xs">
            <p className="font-semibold flex items-center gap-1.5 text-amber-900">
              <AlertCircle className="w-4 h-4 text-amber-600" /> Email Sending Note
            </p>
            <p className="leading-relaxed text-amber-800/90">
              To send real emails to live external inboxes, set `SMTP_HOST`, `SMTP_USER`, and `SMTP_PASS` in your `.env.local` file.
            </p>
          </div>
        </div>
      </div>

      {/* Past Broadcast History */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8 space-y-5">
        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <History className="w-5 h-5 text-black" /> Past Broadcast Log ({broadcasts.length})
          </h2>
        </div>

        {loading ? (
          <div className="py-12 text-center text-gray-400 flex flex-col items-center justify-center gap-2">
            <Loader2 className="w-6 h-6 animate-spin text-black" />
            <span className="text-xs">Loading broadcast history...</span>
          </div>
        ) : broadcasts.length === 0 ? (
          <div className="py-12 text-center text-gray-400 space-y-2">
            <Megaphone className="w-10 h-10 mx-auto text-gray-300 stroke-[1.5]" />
            <p className="text-sm font-medium text-gray-500">No promotional broadcasts sent yet.</p>
            <p className="text-xs text-gray-400">Compose your first offer announcement above!</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-gray-600 border-collapse">
              <thead>
                <tr className="border-b border-gray-100 text-gray-400 uppercase tracking-wider text-[11px] bg-gray-50/50">
                  <th className="py-3 px-4 rounded-l-lg font-semibold">Subject & Headline</th>
                  <th className="py-3 px-4 font-semibold">Target Audience</th>
                  <th className="py-3 px-4 font-semibold">Recipients</th>
                  <th className="py-3 px-4 font-semibold">Promo Code</th>
                  <th className="py-3 px-4 font-semibold">Date Sent</th>
                  <th className="py-3 px-4 rounded-r-lg font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {broadcasts.map((b) => (
                  <tr key={b._id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-medium text-gray-900">
                      <div className="font-semibold text-black text-sm">{b.subject}</div>
                      <div className="text-xs text-gray-500 line-clamp-1">{b.title}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-gray-100 text-gray-700">
                        {b.targetAudience === 'subscribers_only' ? 'Newsletter Subscribers' : 'All Users'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-gray-900">{b.recipientCount} users</td>
                    <td className="py-3.5 px-4">
                      {b.discountCode ? (
                        <span className="px-2 py-0.5 font-mono text-xs font-bold text-emerald-700 bg-emerald-50 rounded border border-emerald-200">
                          {b.discountCode}
                        </span>
                      ) : (
                        <span className="text-gray-400 text-[11px]">—</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-gray-500">
                      {new Date(b.createdAt).toLocaleString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Sent
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="font-bold text-gray-900 text-lg flex items-center gap-2">
                <Send className="w-5 h-5 text-black" /> Confirm Broadcast Send
              </h3>
              <button onClick={() => setShowConfirmModal(false)} className="text-gray-400 hover:text-black">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-gray-600">
              <p>You are about to dispatch an offer email to:</p>
              <div className="bg-gray-50 p-4 rounded-xl space-y-1.5 border border-gray-200/80">
                <p><strong>Audience:</strong> {targetAudience === 'all' ? 'All Registered Users' : 'Newsletter Subscribers'}</p>
                <p><strong>Recipients:</strong> {recipientCountEstimate} User(s)</p>
                <p><strong>Subject:</strong> {subject}</p>
                {discountCode && <p><strong>Code:</strong> {discountCode}</p>}
              </div>
              <p className="text-gray-500 italic">This action will send emails out immediately.</p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold text-gray-700 hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSendBroadcast}
                className="px-5 py-2.5 rounded-xl bg-black text-white hover:bg-gray-800 text-xs font-semibold transition-colors flex items-center gap-2"
              >
                <Send className="w-3.5 h-3.5" /> Confirm & Send Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Email Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="bg-gray-900 text-white p-4 px-6 flex items-center justify-between">
              <span className="text-xs font-bold tracking-wider uppercase flex items-center gap-2">
                <Eye className="w-4 h-4 text-emerald-400" /> Email Template Preview
              </span>
              <button onClick={() => setShowPreview(false)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 bg-gray-100">
              <div className="bg-white rounded-xl overflow-hidden shadow-lg border border-gray-200">
                {/* Header */}
                <div className="bg-black text-white text-center py-6 px-4">
                  <h1 className="text-xl font-bold uppercase tracking-wider">GOLF STORE EXCLUSIVE OFFER</h1>
                </div>
                {/* Body */}
                <div className="p-6 text-gray-800 space-y-4">
                  <div className="text-lg font-bold text-black">{title || 'Your Offer Headline Here'}</div>
                  <div className="text-sm text-gray-600 whitespace-pre-line leading-relaxed">
                    {message || 'Offer announcement body details will appear here.'}
                  </div>

                  {discountCode && (
                    <div className="bg-emerald-50 border-2 border-dashed border-emerald-600 rounded-lg p-4 text-center my-4">
                      <div className="text-[11px] uppercase tracking-wider text-emerald-700 font-bold">Special Promo Code</div>
                      <div className="text-2xl font-extrabold text-emerald-800 font-mono tracking-widest">{discountCode.toUpperCase()}</div>
                    </div>
                  )}

                  <div className="text-center pt-4">
                    <span className="inline-block bg-black text-white px-6 py-3 rounded-lg text-sm font-semibold shadow">
                      Shop Special Offers Now
                    </span>
                  </div>
                </div>
                {/* Footer */}
                <div className="bg-gray-50 border-t border-gray-100 p-4 text-center text-xs text-gray-400">
                  <p>You received this email because you are a registered customer of Golf Store.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
