import React from 'react';
import Image from 'next/image';
import { Plus, Trash2, Edit2, MoveUp, MoveDown } from 'lucide-react';
import dbConnect from '@/lib/mongodb';
import Banner from '@/models/Banner';
import Link from 'next/link';
import DeleteBannerButton from './_components/DeleteBannerButton';

function resolveImg(src: string) {
  if (!src) return '/images/golf.png';
  if (src.startsWith('data:') || src.startsWith('http') || src.startsWith('/')) return src;
  return `/images/${src}`;
}

async function getBanners() {
  try {
    await dbConnect();
    const banners = await Banner.find({}).sort({ displayOrder: 1, createdAt: -1 }).lean();
    return banners as any[];
  } catch (error) {
    console.error("Failed to fetch banners", error);
    return [];
  }
}

const stripHtml = (html: string) => {
  if (!html) return '';
  return html.replace(/<[^>]*>?/gm, '').trim();
};

export default async function BannersPage() {
  const banners = await getBanners();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Homepage Banners</h1>
          <p className="text-gray-500 mt-1">Manage the hero banners displayed on the homepage.</p>
        </div>
        <Link 
          href="/admin/banners/new"
          className="bg-black hover:bg-gray-800 text-white px-5 py-2.5 rounded-xl font-medium transition-colors flex items-center gap-2 shadow-sm"
        >
          <Plus className="w-5 h-5" />
          Add Banner
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {banners.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-gray-100 shadow-sm">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <img src="/images/golf.png" alt="Icon" className="w-8 h-8 opacity-50 grayscale" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">No Banners Found</h3>
            <p className="text-gray-500 mb-6">You haven't created any homepage banners yet.</p>
            <Link href="/admin/banners/new" className="bg-black hover:bg-gray-800 text-white px-6 py-3 rounded-xl font-medium transition-colors shadow-sm inline-flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Create First Banner
            </Link>
          </div>
        ) : (
          banners.map((banner, index) => {
            const plainTitle = banner.title ? stripHtml(banner.title) : '';
            const plainSubtitle = banner.subtitle ? stripHtml(banner.subtitle) : '';
            
            return (
            <div key={banner._id.toString()} className="bg-white rounded-2xl border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.04)] overflow-hidden flex flex-col md:flex-row group hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-all">
              
              {/* Image Preview */}
              <div className="w-full md:w-1/3 lg:w-1/4 h-48 md:h-auto relative bg-gray-100 border-r border-gray-100">
                <img 
                  src={resolveImg(banner.imageUrl || '')} 
                  alt={plainTitle || 'Hero Banner'} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                  <span className="text-white text-xs font-bold uppercase tracking-wider bg-black/50 px-2 py-1 rounded backdrop-blur-sm">
                    {banner.isActive ? 'Active' : 'Hidden'}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 p-6 md:p-8 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h2 className="text-xl font-bold text-gray-900 mb-1 line-clamp-1">{plainTitle || 'Untitled Banner'}</h2>
                      {plainSubtitle && <p className="text-gray-500 line-clamp-2">{plainSubtitle}</p>}
                    </div>
                    
                    {/* Order Controls */}
                    <div className="flex bg-gray-50 rounded-lg border border-gray-200 overflow-hidden shadow-sm">
                      <button disabled={index === 0} className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 disabled:opacity-30 disabled:hover:bg-transparent transition-colors">
                        <MoveUp className="w-4 h-4" />
                      </button>
                      <div className="w-px bg-gray-200"></div>
                      <button disabled={index === banners.length - 1} className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 disabled:opacity-30 disabled:hover:bg-transparent transition-colors">
                        <MoveDown className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  {banner.linkUrl && (
                    <div className="bg-blue-50 text-blue-700 text-sm py-1.5 px-3 rounded-lg inline-block border border-blue-100">
                      <strong>Link:</strong> {banner.linkUrl}
                    </div>
                  )}
                </div>

                <div className="mt-6 flex justify-between items-center pt-6 border-t border-gray-100">
                  <div className="text-sm text-gray-400">
                    Order: {banner.displayOrder || index + 1}
                  </div>
                  <div className="flex gap-2">
                    <Link 
                      href={`/admin/banners/${banner._id.toString()}`}
                      className="px-4 py-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg font-medium transition-colors flex items-center gap-2 text-sm"
                    >
                      <Edit2 className="w-4 h-4" />
                      Edit
                    </Link>
                    <DeleteBannerButton id={banner._id.toString()} />
                  </div>
                </div>
              </div>

            </div>
            );
          })
        )}
      </div>
    </div>
  );
}
