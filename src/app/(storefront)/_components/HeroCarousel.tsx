"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface Banner {
  _id: string;
  title: string;
  subtitle?: string;
  eyebrow?: string;
  imageUrl: string;
  mobileImageUrl?: string;
  linkUrl?: string;
  buttonText?: string;
  buttonColor?: string;
  buttonTextColor?: string;
  button2Text?: string;
  button2Url?: string;
  button2Color?: string;
  button2TextColor?: string;
  alignment?: 'left' | 'center' | 'right';
  titleColor?: string;
  subtitleColor?: string;
  eyebrowColor?: string;
  overlayOpacity?: number;
  titlePosition?: { x: number; y: number };
  subtitlePosition?: { x: number; y: number };
  eyebrowPosition?: { x: number; y: number };
  buttonPosition?: { x: number; y: number };
  buttonSize?: 'sm' | 'md' | 'lg' | 'xl';
}

function sanitizeBannerUrl(url?: string | null, fallback = '/products') {
  if (!url || typeof url !== 'string') return fallback;
  const trimmed = url.trim();
  if (!trimmed || trimmed === '#' || trimmed.toLowerCase() === 'shop now' || trimmed.toLowerCase() === 'null') {
    return fallback;
  }
  if (trimmed.startsWith('/') || trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed;
  }
  return `/${trimmed}`;
}

export default function HeroCarousel({ banners }: { banners: Banner[] }) {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [containerSize, setContainerSize] = React.useState({ width: 0, height: 0 });

  React.useEffect(() => {
    if (!containerRef.current) return;
    
    // Initial size
    setContainerSize({
      width: containerRef.current.offsetWidth,
      height: containerRef.current.offsetHeight
    });

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setContainerSize({
          width: entry.contentRect.width,
          height: entry.contentRect.height
        });
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  React.useEffect(() => {
    if (banners.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((current) => (current + 1) % banners.length);
    }, 5000); // Change every 5 seconds
    return () => clearInterval(interval);
  }, [banners.length]);

  if (!banners || banners.length === 0) {
    return (
      <section className="w-full bg-zinc-900 text-white py-32 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-green-900/20 mix-blend-multiply"></div>
        <div className="relative z-10 max-w-4xl mx-auto px-8">
          <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-6">Elevate Your Game</h1>
          <p className="text-xl md:text-2xl text-zinc-300 font-medium mb-10 max-w-2xl mx-auto">Discover the latest gear from top brands to take your performance to the next level.</p>
          <Link href="/products" className="inline-block bg-green-600 hover:bg-green-500 text-white font-bold py-4 px-12 rounded-xl transition-colors uppercase tracking-widest shadow-lg hover:shadow-xl transform hover:-translate-y-1">
            Shop Now
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="relative w-full bg-gray-100 overflow-hidden flex items-center justify-center">
      <div 
        className="w-full relative overflow-hidden" 
        ref={containerRef}
      >
        {/* INVISIBLE SPACER: This forces the container to perfectly match the height of the banner image on ALL devices without any empty gray gaps */}
        {banners.length > 0 && (
          <>
            <img 
              src={banners[0].mobileImageUrl || banners[0].imageUrl} 
              className="w-full h-auto block md:hidden invisible pointer-events-none" 
              alt="spacer" 
            />
            <img 
              src={banners[0].imageUrl} 
              className="w-full h-auto hidden md:block invisible pointer-events-none" 
              alt="spacer" 
            />
          </>
        )}

        {banners.map((banner, index) => {
          const getPos = (pos: {x: number, y: number} | undefined, dx: number, dy: number) => {
            if (!pos) return { x: dx, y: dy };
            if (pos.x === 10 && (pos.y === 20 || pos.y === 40 || pos.y === 60)) return { x: dx, y: dy };
            return pos;
          };
          const titlePos = getPos(banner.titlePosition, 192, 120);
          const subtitlePos = getPos(banner.subtitlePosition, 192, 240);
          const buttonPos = getPos(banner.buttonPosition, 192, 360);


          const targetUrl = sanitizeBannerUrl(banner.linkUrl, '/products');
          const isFullBannerClickable = !banner.buttonText && !banner.button2Text;
          const SlideWrapper = isFullBannerClickable ? Link : 'div';
          const wrapperProps = isFullBannerClickable 
            ? { href: targetUrl, className: "absolute inset-0 block cursor-pointer" } 
            : { className: "absolute inset-0" };

          return (
            <div 
              key={banner._id.toString()}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
              }`}
            >
              <SlideWrapper {...(wrapperProps as any)}>
                {/* Desktop Image */}
                <div 
                  className={`absolute inset-0 w-full h-full bg-cover bg-center ${banner.mobileImageUrl ? 'hidden md:block' : 'block'}`}
                  style={{ backgroundImage: `url(${banner.imageUrl})` }}
                ></div>
                
                {/* Mobile Image (if provided) */}
                {banner.mobileImageUrl && (
                  <div 
                    className="absolute inset-0 w-full h-full bg-cover bg-center block md:hidden"
                    style={{ backgroundImage: `url(${banner.mobileImageUrl})` }}
                  ></div>
                )}
                
                {banner.overlayOpacity && banner.overlayOpacity > 0 ? (
                  <div 
                    className="absolute inset-0"
                    style={{ backgroundColor: `rgba(0,0,0,${banner.overlayOpacity / 100})` }}
                  ></div>
                ) : null}
              </SlideWrapper>
              
              {/* MOBILE LAYOUT: Flex centered stacking */}
              <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-6 md:hidden z-20">
                
                {banner.eyebrow && (
                  <div 
                    className={`w-full max-w-[100vw] overflow-hidden transition-all duration-700 delay-200 transform ${
                      index === currentIndex ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                    }`}
                  >
                    <div className="wysiwyg-content w-full force-mobile-reset">
                      <div 
                        className="w-full font-medium [&_p]:m-0 drop-shadow mb-4 text-lg leading-tight uppercase tracking-wider break-words whitespace-normal"
                        style={{ color: banner.eyebrowColor || '#ffffff', padding: 0 }}
                        dangerouslySetInnerHTML={{ __html: banner.eyebrow }}
                      />
                    </div>
                  </div>
                )}

                {banner.title && (
                  <div 
                    className={`w-full max-w-[100vw] overflow-hidden transition-all duration-700 delay-300 transform ${
                      index === currentIndex ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                    }`}
                  >
                    <div className="wysiwyg-content w-full force-mobile-reset">
                      <div 
                        className="w-full font-bold [&_p]:m-0 drop-shadow-md mb-6 text-4xl leading-none break-words whitespace-normal"
                        style={{ color: banner.titleColor || '#ffffff', padding: 0 }}
                        dangerouslySetInnerHTML={{ __html: banner.title }}
                      />
                    </div>
                  </div>
                )}
                
                {banner.subtitle && (
                  <div 
                    className={`w-full max-w-[100vw] overflow-hidden transition-all duration-700 delay-500 transform ${
                      index === currentIndex ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                    }`}
                  >
                    <div className="wysiwyg-content w-full force-mobile-reset">
                      <div 
                        className="w-full font-medium [&_p]:m-0 drop-shadow mb-10 text-xl leading-tight break-words whitespace-normal"
                        style={{ color: banner.subtitleColor || '#e4e4e7', padding: 0 }}
                        dangerouslySetInnerHTML={{ __html: banner.subtitle }}
                      />
                    </div>
                  </div>
                )}
                
                <div 
                  className={`flex gap-4 flex-wrap justify-center w-full max-w-[100vw] transition-all duration-700 delay-700 transform ${
                    index === currentIndex ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                  }`}
                >
                  {banner.buttonText && (
                    <Link 
                      href={sanitizeBannerUrl(banner.linkUrl, '/products')}
                      className="inline-block font-bold py-3.5 px-6 rounded-2xl uppercase tracking-widest shadow-lg transition-transform hover:-translate-y-1 text-sm"
                      style={{ backgroundColor: banner.buttonColor || '#16a34a', color: banner.buttonTextColor || '#ffffff' }}
                    >
                      {banner.buttonText}
                    </Link>
                  )}
                  {banner.button2Text && (
                    <Link 
                      href={sanitizeBannerUrl(banner.button2Url, '/sale')}
                      className="inline-block font-bold py-3.5 px-6 rounded-2xl uppercase tracking-widest shadow-lg transition-transform hover:-translate-y-1 text-sm"
                      style={{ backgroundColor: banner.button2Color || '#ffffff', color: banner.button2TextColor || '#000000' }}
                    >
                      {banner.button2Text}
                    </Link>
                  )}
                </div>
              </div>

                                          {/* DESKTOP LAYOUT: Virtual 1280x400 Drag and Drop Positioning */}
              <div 
                className="hidden md:block absolute origin-top-left z-20 text-[48px]"
                style={{ 
                  width: '1280px', 
                  height: '400px', 
                  transform: containerSize.width ? `scale(${containerSize.width / 1280})` : 'scale(1)',
                }}
              >
                
                {banner.eyebrow && (
                  <div 
                    className={`absolute transition-all duration-700 delay-200`}
                    style={{ 
                      transform: `translate(${banner.eyebrowPosition?.x ?? 192}px, ${(banner.eyebrowPosition?.y ?? 20) + (index === currentIndex ? 0 : 16)}px)`,
                      opacity: index === currentIndex ? 1 : 0
                    }}
                  >
                    <div className="wysiwyg-content p-2">
                      <div 
                        className="w-full font-medium [&_p]:m-0 drop-shadow leading-tight [&_span]:!leading-tight uppercase tracking-wider text-lg"
                        style={{ color: banner.eyebrowColor || '#ffffff', padding: 0, overflow: 'visible' }}
                        dangerouslySetInnerHTML={{ __html: banner.eyebrow }}
                      />
                    </div>
                  </div>
                )}
                {banner.title && (
                  <div 
                    className={`absolute transition-all duration-700 delay-300`}
                    style={{ 
                      transform: `translate(${banner.titlePosition?.x ?? 192}px, ${(banner.titlePosition?.y ?? 40) + (index === currentIndex ? 0 : 16)}px)`,
                      opacity: index === currentIndex ? 1 : 0
                    }}
                  >
                    <div className="wysiwyg-content p-2">
                      <div 
                        className="w-full font-bold [&_p]:m-0 drop-shadow-md leading-none [&_span]:!leading-none"
                        style={{ color: banner.titleColor || '#ffffff', padding: 0, overflow: 'visible' }}
                        dangerouslySetInnerHTML={{ __html: banner.title }}
                      />
                    </div>
                  </div>
                )}
                
                {banner.subtitle && (
                  <div 
                    className={`absolute transition-all duration-700 delay-500`}
                    style={{ 
                      transform: `translate(${banner.subtitlePosition?.x ?? 192}px, ${(banner.subtitlePosition?.y ?? 140) + (index === currentIndex ? 0 : 16)}px)`,
                      opacity: index === currentIndex ? 1 : 0
                    }}
                  >
                    <div className="wysiwyg-content p-2">
                      <div 
                        className="w-full font-medium [&_p]:m-0 drop-shadow leading-tight [&_span]:!leading-tight"
                        style={{ color: banner.subtitleColor || '#e4e4e7', padding: 0, overflow: 'visible' }}
                        dangerouslySetInnerHTML={{ __html: banner.subtitle }}
                      />
                    </div>
                  </div>
                )}
                
                <div 
                  className={`absolute flex gap-4 p-2 transition-all duration-700 delay-700`}
                  style={{ 
                    transform: `translate(${banner.buttonPosition?.x ?? 192}px, ${(banner.buttonPosition?.y ?? 240) + (index === currentIndex ? 0 : 16)}px)`,
                    opacity: index === currentIndex ? 1 : 0
                  }}
                >
                  {banner.buttonText && (
                    <Link 
                      href={sanitizeBannerUrl(banner.linkUrl, '/products')}
                      className={`inline-block font-bold rounded-2xl uppercase tracking-widest shadow-lg transition-transform hover:-translate-y-1 ${
                        banner.buttonSize === 'sm' ? 'py-3 px-6 text-base' :
                        banner.buttonSize === 'lg' ? 'py-5 px-10 text-xl' :
                        banner.buttonSize === 'xl' ? 'py-6 px-12 text-2xl' :
                        'py-4 px-8 text-lg'
                      }`}
                      style={{ backgroundColor: banner.buttonColor || '#16a34a', color: banner.buttonTextColor || '#ffffff' }}
                    >
                      {banner.buttonText}
                    </Link>
                  )}
                  {banner.button2Text && (
                    <Link 
                      href={sanitizeBannerUrl(banner.button2Url, '/sale')}
                      className={`inline-block font-bold rounded-2xl uppercase tracking-widest shadow-lg transition-transform hover:-translate-y-1 ${
                        banner.buttonSize === 'sm' ? 'py-3 px-6 text-base' :
                        banner.buttonSize === 'lg' ? 'py-5 px-10 text-xl' :
                        banner.buttonSize === 'xl' ? 'py-6 px-12 text-2xl' :
                        'py-4 px-8 text-lg'
                      }`}
                      style={{ backgroundColor: banner.button2Color || '#ffffff', color: banner.button2TextColor || '#000000' }}
                    >
                      {banner.button2Text}
                    </Link>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {/* Navigation Dots */}
        {banners.length > 1 && (
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex gap-3">
            {banners.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex ? 'bg-white scale-125' : 'bg-white/50 hover:bg-white/80'
                }`}
                aria-label={`Go to slide ${index + 1}`}
                suppressHydrationWarning
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
