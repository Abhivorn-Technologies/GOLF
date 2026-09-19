"use client";

import React, { useState } from 'react';
import { Trash2, AlertTriangle, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function DeleteBannerButton({ id }: { id: string }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/admin/banners/${id}`, {
        method: 'DELETE',
      });
      
      if (!res.ok) throw new Error('Failed to delete');
      
      toast.success('Banner deleted successfully');
      setShowConfirm(false);
      router.refresh();
    } catch (error) {
      toast.error('Failed to delete banner');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <button 
        onClick={() => setShowConfirm(true)}
        disabled={isDeleting}
        className="px-4 py-2 text-red-600 bg-red-50 hover:bg-red-100 disabled:opacity-50 rounded-lg font-medium transition-colors flex items-center gap-2 text-sm"
      >
        <Trash2 className="w-4 h-4" />
        {isDeleting ? 'Deleting...' : 'Delete'}
      </button>

      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl flex flex-col gap-4 border border-gray-100 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <button 
                onClick={() => setShowConfirm(false)}
                className="text-gray-400 hover:text-black p-1 rounded-full hover:bg-gray-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <h3 className="font-bold text-gray-900 text-base">Delete Banner</h3>
              <p className="text-xs text-gray-500 mt-1 font-medium">Are you sure you want to delete this banner? This action cannot be undone.</p>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setShowConfirm(false)}
                disabled={isDeleting}
                className="flex-1 py-2.5 px-4 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex-1 py-2.5 px-4 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors disabled:opacity-50"
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
