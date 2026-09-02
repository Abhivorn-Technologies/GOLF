"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { UploadCloud, Loader2 } from 'lucide-react';
import dynamic from 'next/dynamic';
import { Rnd } from 'react-rnd';

const WysiwygEditor = dynamic(() => import('./WysiwygEditor'), { 
  ssr: false,
  loading: () => <div className="h-[150px] bg-gray-100 rounded-xl animate-pulse flex items-center justify-center text-gray-400">Loading editor...</div>
});

export default function BannerForm({ initialData }: { initialData?: any }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Tabs State
  const [activeTab, setActiveTab] = useState<'content' | 'buttons' | 'design'>('content');
  
  // State for live preview
  const [title, setTitle] = useState(initialData?.title || '');
  const [subtitle, setSubtitle] = useState(initialData?.subtitle || '');
  const [titleColor, setTitleColor] = useState(initialData?.titleColor || '#ffffff');
  const [subtitleColor, setSubtitleColor] = useState(initialData?.subtitleColor || '#e4e4e7');
  const [overlayOpacity, setOverlayOpacity] = useState(initialData?.overlayOpacity ?? 40);
  
  // Button 1
  const [buttonText, setButtonText] = useState(initialData?.buttonText || 'Shop Now');
  const [linkUrl, setLinkUrl] = useState(initialData?.linkUrl || '');
  const [buttonColor, setButtonColor] = useState(initialData?.buttonColor || '#16a34a');
  const [buttonTextColor, setButtonTextColor] = useState(initialData?.buttonTextColor || '#ffffff');
  
  // Button 2
  const [button2Text, setButton2Text] = useState(initialData?.button2Text || '');
  const [button2Url, setButton2Url] = useState(initialData?.button2Url || '');
  const [button2Color, setButton2Color] = useState(initialData?.button2Color || '#ffffff');
  const [button2TextColor, setButton2TextColor] = useState(initialData?.button2TextColor || '#000000');
  
  // Button Size
  const [buttonSize, setButtonSize] = useState<'sm' | 'md' | 'lg' | 'xl'>(initialData?.buttonSize || 'md');
  
  // Positions
  const [titlePosition, setTitlePosition] = useState(initialData?.titlePosition || { x: 10, y: 20 });
  const [subtitlePosition, setSubtitlePosition] = useState(initialData?.subtitlePosition || { x: 10, y: 40 });
  const [buttonPosition, setButtonPosition] = useState(initialData?.buttonPosition || { x: 10, y: 60 });
  
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(initialData?.imageUrl || null);
  
  const [mobileImageFile, setMobileImageFile] = useState<File | null>(null);
  const [mobileImagePreview, setMobileImagePreview] = useState<string | null>(initialData?.mobileImageUrl || null);
  
  const [isMounted, setIsMounted] = useState(false);

  const containerRef = React.useRef<HTMLDivElement>(null);
  const [containerSize, setContainerSize] = React.useState({ width: 0, height: 0 });

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  React.useEffect(() => {
    if (!containerRef.current) return;
    setContainerSize({
      width: containerRef.current.offsetWidth,
      height: containerRef.current.offsetHeight
    });

    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        setContainerSize({
          width: entry.contentRect.width,
          height: entry.contentRect.height
        });
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleMobileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setMobileImageFile(file);
      setMobileImagePreview(URL.createObjectURL(file));
    }
  };
  
  const handleDragStop = (e: any, d: any, setter: any) => {
    // Save percentage coordinates based on the 1920x600 virtual grid
    const pctX = (d.x / 1920) * 100;
    const pctY = (d.y / 600) * 100;
    setter({ x: pctX, y: pctY });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    const formData = new FormData(e.currentTarget);
    
    try {
      let imageUrl = initialData?.imageUrl || '';
      let mobileImageUrl = initialData?.mobileImageUrl || '';

      if (imageFile) {
        const imageFormData = new FormData();
        imageFormData.append('file', imageFile);
        const uploadRes = await fetch('/api/admin/upload', { method: 'POST', body: imageFormData });
        if (!uploadRes.ok) throw new Error('Desktop image upload failed');
        const uploadData = await uploadRes.json();
        imageUrl = uploadData.url;
      }

      if (mobileImageFile) {
        const mobileImageFormData = new FormData();
        mobileImageFormData.append('file', mobileImageFile);
        const uploadRes = await fetch('/api/admin/upload', { method: 'POST', body: mobileImageFormData });
        if (!uploadRes.ok) throw new Error('Mobile image upload failed');
        const uploadData = await uploadRes.json();
        mobileImageUrl = uploadData.url;
      }

      if (!imageUrl) throw new Error('Desktop banner image is required');

      const bannerData = {
        title: title,
        subtitle: subtitle,
        titleColor: titleColor,
        subtitleColor: subtitleColor,
        overlayOpacity: Number(overlayOpacity),
        buttonText: buttonText,
        linkUrl: linkUrl,
        buttonColor: buttonColor,
        buttonTextColor: buttonTextColor,
        button2Text: button2Text,
        button2Url: button2Url,
        button2Color: button2Color,
        button2TextColor: button2TextColor,
        buttonSize: buttonSize,
        titlePosition: titlePosition,
        subtitlePosition: subtitlePosition,
        buttonPosition: buttonPosition,
        imageUrl: imageUrl,
        mobileImageUrl: mobileImageUrl,
        isActive: formData.get('isActive') === 'on',
        displayOrder: Number(formData.get('displayOrder')) || 0,
      };

      const url = initialData ? `/api/admin/banners/${initialData._id}` : '/api/admin/banners';
      const method = initialData ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bannerData),
      });

      if (!res.ok) throw new Error('Failed to save banner');

      router.push('/admin/banners');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'An error occurred');
      setLoading(false);
    }
  };

  if (!isMounted) {
    return (
      <div className="bg-white rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.04)] border border-gray-100 p-12 flex justify-center items-center h-[500px]">
        <Loader2 className="w-8 h-8 animate-spin text-gray-300" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="relative max-w-7xl mx-auto" suppressHydrationWarning>
      
      {/* Settings / Actions Bar */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-4">
          <button type="button" onClick={() => router.back()} className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-black hover:bg-gray-50 rounded-lg transition-colors">
            Cancel
          </button>
          <div className="flex gap-2 p-1 bg-gray-100 rounded-lg">
            <button type="button" onClick={() => setActiveTab('content')} className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${activeTab === 'content' ? 'bg-white shadow-sm text-black' : 'text-gray-500 hover:text-gray-900'}`}>Content</button>
            <button type="button" onClick={() => setActiveTab('buttons')} className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${activeTab === 'buttons' ? 'bg-white shadow-sm text-black' : 'text-gray-500 hover:text-gray-900'}`}>Buttons</button>
            <button type="button" onClick={() => setActiveTab('design')} className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${activeTab === 'design' ? 'bg-white shadow-sm text-black' : 'text-gray-500 hover:text-gray-900'}`}>Settings</button>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          {error && <span className="text-red-500 text-sm font-medium">{error}</span>}
          <button 
            type="submit" disabled={loading}
            className="px-6 py-2 rounded-lg font-bold text-white bg-black hover:bg-gray-800 disabled:opacity-70 transition-colors flex items-center gap-2"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            {initialData ? 'Save Changes' : 'Create Banner'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        
        {/* Forms (Left Column) */}
        <div className="xl:col-span-4 order-2 xl:order-1 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            
            {/* CONTENT TAB */}
            <div className={activeTab === 'content' ? 'block' : 'hidden'}>
              <h3 className="font-bold text-sm uppercase tracking-wider text-gray-500 mb-6 pb-2 border-b">Banner Content</h3>
              
              <div className="space-y-8">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Banner Title</label>
                  <WysiwygEditor value={title} onChange={setTitle} placeholder="Enter banner title..." />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Subtitle (Optional)</label>
                  <WysiwygEditor value={subtitle} onChange={setSubtitle} placeholder="Enter subtitle..." />
                </div>
              </div>
            </div>

            {/* BUTTONS TAB */}
            <div className={activeTab === 'buttons' ? 'block' : 'hidden'}>
              <div className="flex items-center justify-between mb-6 pb-2 border-b">
                <h3 className="font-bold text-sm uppercase tracking-wider text-gray-500">Buttons</h3>
                <div className="flex items-center gap-2">
                  <label className="text-xs font-medium text-gray-600">Size:</label>
                  <select 
                    value={buttonSize}
                    onChange={(e) => setButtonSize(e.target.value as any)}
                    className="text-xs px-2 py-1 rounded-md border outline-none cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors"
                  >
                    <option value="sm">Small</option>
                    <option value="md">Medium</option>
                    <option value="lg">Large</option>
                    <option value="xl">Extra Large</option>
                  </select>
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="p-4 bg-gray-50 rounded-xl space-y-4 border border-gray-100">
                  <h4 className="font-semibold text-sm">Primary Button</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Text</label>
                      <input type="text" value={buttonText} onChange={(e) => setButtonText(e.target.value)} className="w-full px-3 py-2 rounded-lg border focus:border-black outline-none text-sm" placeholder="Shop Now" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Link URL</label>
                      <input type="text" name="linkUrl" value={linkUrl} onChange={(e) => setLinkUrl(e.target.value)} className="w-full px-3 py-2 rounded-lg border focus:border-black outline-none text-sm" placeholder="/clubs" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Bg Color</label>
                      <input type="color" value={buttonColor} onChange={(e) => setButtonColor(e.target.value)} className="w-full h-8 rounded border p-0 cursor-pointer" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Text Color</label>
                      <input type="color" value={buttonTextColor} onChange={(e) => setButtonTextColor(e.target.value)} className="w-full h-8 rounded border p-0 cursor-pointer" />
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 rounded-xl space-y-4 border border-gray-100">
                  <h4 className="font-semibold text-sm">Secondary Button (Optional)</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Text</label>
                      <input type="text" value={button2Text} onChange={(e) => setButton2Text(e.target.value)} className="w-full px-3 py-2 rounded-lg border focus:border-black outline-none text-sm" placeholder="Learn More" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Link URL</label>
                      <input type="text" value={button2Url} onChange={(e) => setButton2Url(e.target.value)} className="w-full px-3 py-2 rounded-lg border focus:border-black outline-none text-sm" placeholder="/about" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Bg Color</label>
                      <input type="color" value={button2Color} onChange={(e) => setButton2Color(e.target.value)} className="w-full h-8 rounded border p-0 cursor-pointer" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Text Color</label>
                      <input type="color" value={button2TextColor} onChange={(e) => setButton2TextColor(e.target.value)} className="w-full h-8 rounded border p-0 cursor-pointer" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* SETTINGS TAB */}
            <div className={activeTab === 'design' ? 'block' : 'hidden'}>
              <h3 className="font-bold text-sm uppercase tracking-wider text-gray-500 mb-6 pb-2 border-b">Design & Settings</h3>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Desktop Image (1920x600 recommended)</label>
                  <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <UploadCloud className="w-6 h-6 text-gray-400 mb-2" />
                      <p className="text-xs text-gray-500 font-medium">Click to upload Desktop Image</p>
                    </div>
                    <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                  </label>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Mobile Image (Optional) (800x1000 recommended)</label>
                  <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <UploadCloud className="w-6 h-6 text-gray-400 mb-2" />
                      <p className="text-xs text-gray-500 font-medium">Click to upload Mobile Image</p>
                    </div>
                    <input type="file" className="hidden" accept="image/*" onChange={handleMobileImageChange} />
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Overlay Opacity: {overlayOpacity}%</label>
                  <input 
                    type="range" min="0" max="100" 
                    value={overlayOpacity} onChange={(e) => setOverlayOpacity(Number(e.target.value))}
                    className="w-full accent-black"
                  />
                  <p className="text-xs text-gray-500 mt-1">Adjust darkness to make text readable.</p>
                </div>

                <div className="bg-gray-50 p-4 rounded-xl space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Display Order</label>
                    <input name="displayOrder" type="number" defaultValue={initialData?.displayOrder || 0} className="w-full px-3 py-2 rounded-lg border focus:border-black outline-none" />
                  </div>
                  <div className="flex items-center gap-3">
                    <input type="checkbox" name="isActive" id="isActive" defaultChecked={initialData?.isActive !== false} className="w-5 h-5 rounded text-black" />
                    <label htmlFor="isActive" className="text-sm font-bold text-gray-900 cursor-pointer">Banner is Active</label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Live Preview Section (Right Column) */}
        <div className="xl:col-span-8 order-1 xl:order-2 sticky top-4 z-40 bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden transition-shadow">
          <div className="bg-gray-50 border-b border-gray-200 px-4 py-3 flex items-center justify-between">
            <h3 className="font-bold text-sm uppercase tracking-wider text-gray-500 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              Live Canvas Preview (Drag to Move)
            </h3>
          </div>
          
          <div className="w-full aspect-[16/5] relative overflow-hidden bg-gray-100" ref={containerRef}>
            {imagePreview ? (
              <div 
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${imagePreview})` }}
              ></div>
            ) : (
              <div className="absolute inset-0 bg-zinc-200 flex flex-col items-center justify-center text-gray-400 gap-2">
                <UploadCloud className="w-12 h-12 opacity-50" />
                <span className="text-sm font-medium">No Image Uploaded</span>
              </div>
            )}
            
            <div className="absolute inset-0" style={{ backgroundColor: `rgba(0,0,0,${overlayOpacity / 100})` }}></div>
            
            {/* VIRTUAL 1920x600 CANVAS SCALED TO FIT */}
            <div 
              className="absolute origin-top-left z-20"
              style={{ 
                width: '1920px', 
                height: '600px', 
                transform: containerSize.width ? `scale(${containerSize.width / 1920})` : 'scale(1)',
              }}
            >
              {title && (
                <Rnd
                  bounds="parent"
                  position={{ x: titlePosition?.x ?? 192, y: titlePosition?.y ?? 120 }}
                  size={{ width: 'auto', height: 'auto' }}
                  onDragStop={(e, d) => setTitlePosition({ x: d.x, y: d.y })}
                  enableResizing={false}
                  className="hover:ring-2 hover:ring-blue-500 cursor-move"
                  style={{ zIndex: 10 }}
                >
                  <div className="wysiwyg-content p-2">
                    <div 
                      className="w-full leading-none font-bold [&_p]:m-0 drop-shadow-md [&_span]:!leading-none"
                      style={{ color: titleColor, padding: 0, overflow: 'visible' }}
                      dangerouslySetInnerHTML={{ __html: title }}
                    />
                  </div>
                </Rnd>
              )}
              
              {subtitle && (
                <Rnd
                  bounds="parent"
                  position={{ x: subtitlePosition?.x ?? 192, y: subtitlePosition?.y ?? 240 }}
                  size={{ width: 'auto', height: 'auto' }}
                  onDragStop={(e, d) => setSubtitlePosition({ x: d.x, y: d.y })}
                  enableResizing={false}
                  className="hover:ring-2 hover:ring-blue-500 cursor-move"
                  style={{ zIndex: 10 }}
                >
                  <div className="wysiwyg-content p-2">
                    <div 
                      className="w-full leading-tight font-medium [&_p]:m-0 drop-shadow [&_span]:!leading-tight"
                      style={{ color: subtitleColor, padding: 0, overflow: 'visible' }}
                      dangerouslySetInnerHTML={{ __html: subtitle }}
                    />
                  </div>
                </Rnd>
              )}
              
              {(buttonText || button2Text) && (
                <Rnd
                  bounds="parent"
                  position={{ x: buttonPosition?.x ?? 192, y: buttonPosition?.y ?? 360 }}
                  size={{ width: 'auto', height: 'auto' }}
                  onDragStop={(e, d) => setButtonPosition({ x: d.x, y: d.y })}
                  enableResizing={false}
                  className="hover:ring-2 hover:ring-blue-500 cursor-move"
                  style={{ zIndex: 50 }}
                >
                  <div className="flex gap-4 p-2">
                    {buttonText && (
                      <button 
                        type="button" 
                        className={`inline-block font-bold rounded-2xl uppercase tracking-widest shadow-lg ${
                          buttonSize === 'sm' ? 'py-3 px-6 text-base' :
                          buttonSize === 'lg' ? 'py-5 px-10 text-xl' :
                          buttonSize === 'xl' ? 'py-6 px-12 text-2xl' :
                          'py-4 px-8 text-lg'
                        }`}
                        style={{ backgroundColor: buttonColor, color: buttonTextColor }}
                      >
                        {buttonText}
                      </button>
                    )}
                    {button2Text && (
                      <button 
                        type="button" 
                        className={`inline-block font-bold rounded-2xl uppercase tracking-widest shadow-lg ${
                          buttonSize === 'sm' ? 'py-3 px-6 text-base' :
                          buttonSize === 'lg' ? 'py-5 px-10 text-xl' :
                          buttonSize === 'xl' ? 'py-6 px-12 text-2xl' :
                          'py-4 px-8 text-lg'
                        }`}
                        style={{ backgroundColor: button2Color, color: button2TextColor }}
                      >
                        {button2Text}
                      </button>
                    )}
                  </div>
                </Rnd>
              )}
            </div>
          </div>
        </div>

      </div>
    </form>
  );
}
