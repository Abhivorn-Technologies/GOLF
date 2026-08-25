"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface Banner {
  _id: string;
  title: string;
  subtitle?: string;
  imageUrl: string;
  linkUrl?: string;
}

export default function HeroCarousel({ banners }: { banners: Banner[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
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
          <button className="bg-green-600 hover:bg-green-500 text-white font-bold py-4 px-12 rounded-xl transition-colors uppercase tracking-widest shadow-lg hover:shadow-xl transform hover:-translate-y-1">
            Shop Now
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full h-[500px] md:h-[600px] relative overflow-hidden flex items-center justify-center text-center">
      {banners.map((banner, index) => (
        <div 
          key={banner._id.toString()}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
          }`}
        >
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${banner.imageUrl})` }}
          ></div>
          <div className="absolute inset-0 bg-black/40"></div>
          
          <div className="relative z-20 max-w-4xl mx-auto px-8 mt-32 md:mt-48 flex flex-col items-center justify-center h-full">
            {banner.title && (
              <h1 
                className={`text-5xl md:text-7xl font-black text-white uppercase tracking-tighter mb-6 transition-all duration-700 delay-300 transform ${
                  index === currentIndex ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                }`}
              >
                {banner.title}
              </h1>
            )}
            
            {banner.subtitle && (
              <p 
                className={`text-xl md:text-2xl text-zinc-200 font-medium mb-10 max-w-2xl mx-auto transition-all duration-700 delay-500 transform ${
                  index === currentIndex ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                }`}
              >
                {banner.subtitle}
              </p>
            )}
            
            {banner.linkUrl && (
              <Link 
                href={banner.linkUrl} 
                className={`inline-block bg-green-600 hover:bg-green-500 text-white font-bold py-4 px-12 rounded-xl transition-all duration-700 delay-700 uppercase tracking-widest shadow-lg hover:shadow-xl transform hover:-translate-y-1 ${
                  index === currentIndex ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                }`}
              >
                Shop Now
              </Link>
            )}
          </div>
        </div>
      ))}

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
            />
          ))}
        </div>
      )}
    </section>
  );
}
