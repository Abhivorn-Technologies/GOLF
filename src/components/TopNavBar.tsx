"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Search, ShoppingCart, User, Heart, Menu, X, ChevronDown, ChevronRight } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useSession } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';

export default function TopNavBar({ megaMenuData = {}, utilityBar }: { megaMenuData?: Record<string, any>, utilityBar?: any }) {
  const { cartCount } = useCart();
  const { data: session, status } = useSession();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const [expandedMobileCategory, setExpandedMobileCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeAnnouncement, setActiveAnnouncement] = useState(0);
  const [isFading, setIsFading] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  React.useEffect(() => {
    setHoveredCategory(null);
    setIsMobileMenuOpen(false);
  }, [pathname]);

  React.useEffect(() => {
    if (!utilityBar?.announcements || utilityBar.announcements.length <= 1) return;

    const interval = setInterval(() => {
      setIsFading(true);
      setTimeout(() => {
        setActiveAnnouncement(prev => (prev + 1) % utilityBar.announcements.length);
        setIsFading(false);
      }, 500); // 500ms fade out duration
    }, 4000); // 4s total interval
    return () => clearInterval(interval);
  }, [JSON.stringify(utilityBar?.announcements)]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsMobileMenuOpen(false);
    }
  };

  const navLinks = ['Home', 'About', 'Clubs', 'Shoes', 'Apparel', 'Bags', 'Balls', 'Accessories'];
  const productCategories = ['Clubs', 'Shoes', 'Apparel', 'Bags', 'Balls', 'Accessories'];

  return (
    <header className="w-full bg-white border-b border-gray-200 sticky top-0 z-50 group" onMouseLeave={() => setHoveredCategory(null)}>
      {/* Utility Bar */}
      <div className="bg-zinc-950 py-2.5 px-8 flex justify-center items-center hidden md:flex overflow-hidden relative">
        {/* Glow effect behind the text */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent blur-md pointer-events-none"></div>
        
        <div 
          className={`transition-all duration-500 ease-in-out ${isFading ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'} uppercase tracking-[0.25em] text-[10px] md:text-xs font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-300 via-white to-gray-300 relative z-10`}
          style={{ textShadow: '0 0 20px rgba(255,255,255,0.1)' }}
        >
          {utilityBar?.announcements?.length > 0 
            ? utilityBar.announcements[activeAnnouncement]
            : "Welcome to LORVEN GOLF! Enjoy fast shipping on all orders."}
        </div>
      </div>

      {/* Main Navigation Row 1: Logo, Search, Actions */}
      <div className="px-4 md:px-8 py-2 md:py-1 flex items-center justify-between gap-4 md:gap-8 max-w-7xl mx-auto">
        
        {/* Mobile Menu Toggle */}
        <button 
          className="md:hidden text-zinc-700 hover:text-green-600"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        <Link href="/" onClick={() => setHoveredCategory(null)} className="flex-1 flex items-center justify-center md:justify-start relative md:flex-shrink-0 md:flex-none ml-3 md:ml-8">
          <img src="/images/golf.png" alt="LORVEN GOLF Logo" className="h-16 md:h-20 w-auto object-contain scale-[1.2] md:scale-[1.5]" />
        </Link>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="flex-grow max-w-2xl hidden md:flex items-center relative mx-8" suppressHydrationWarning>
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for clubs, shoes, apparel..." 
            className="w-full py-3 px-6 pr-12 rounded-full border border-gray-200 bg-gray-50/50 hover:bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all shadow-sm"
            suppressHydrationWarning
          />
          <button type="submit" className="absolute right-4 text-gray-400 hover:text-black transition-colors" suppressHydrationWarning>
            <Search className="w-5 h-5" />
          </button>
        </form>

        {/* Trailing Actions */}
        <div className="flex items-center space-x-4 md:space-x-6 flex-shrink-0">
          
          {status === 'loading' ? (
            <div className="w-6 h-6 animate-pulse bg-gray-200 rounded-full"></div>
          ) : session ? (
            <Link href="/account" onClick={() => setHoveredCategory(null)} className="hidden sm:flex items-center space-x-2 text-zinc-700 hover:text-green-600 transition-colors">
              <User className="w-6 h-6" />
              <span className="hidden lg:block font-medium text-sm">
                {session.user?.name || 'Account'}
              </span>
            </Link>
          ) : (
            <Link href="/login" onClick={() => setHoveredCategory(null)} className="hidden sm:flex items-center space-x-2 text-zinc-700 hover:text-green-600 transition-colors">
              <User className="w-6 h-6" />
              <span className="hidden lg:block font-medium text-sm">Account</span>
            </Link>
          )}

          <Link href={session ? "/account/wishlist" : "/login"} onClick={() => setHoveredCategory(null)} className="hidden sm:flex items-center space-x-2 text-zinc-700 hover:text-green-600 transition-colors">
            <Heart className="w-6 h-6" />
          </Link>

          <Link href="/cart" onClick={() => setHoveredCategory(null)} className="flex items-center space-x-2 text-zinc-700 hover:text-green-600 transition-colors relative">
            <ShoppingCart className="w-6 h-6" />
            <span className="absolute -top-1 -right-2 bg-green-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
              {cartCount}
            </span>
          </Link>
        </div>
      </div>

      {/* Bottom Row: Navigation Links */}
      <nav className="bg-white px-8 hidden md:block relative border-t border-gray-100">
        <div className="max-w-7xl mx-auto flex items-center justify-center space-x-2 lg:space-x-4 py-2">
          {navLinks.map((item) => {
            const itemPath = item === 'Home' ? '/' : (item === 'About' ? '/about' : `/category/${item.toLowerCase()}`);
            const isActive = pathname === itemPath || (item !== 'Home' && item !== 'About' && pathname.startsWith(itemPath));

            return (
            <div 
              key={item} 
              onMouseEnter={() => setHoveredCategory(productCategories.includes(item) ? item : null)}
              className="relative"
            >
              <Link 
                href={itemPath}
                onClick={() => setHoveredCategory(null)}
                className={`text-xs font-bold tracking-widest uppercase transition-all duration-200 flex items-center px-4 py-2 rounded-full ${
                  isActive 
                    ? 'bg-zinc-900 text-white font-black shadow-xs' 
                    : hoveredCategory === item
                    ? 'bg-zinc-100 text-zinc-900'
                    : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50'
                }`}
              >
                {item}
              </Link>
            </div>
            );
          })}
        </div>

        {/* Mega Menu Dropdown */}
        {hoveredCategory && productCategories.includes(hoveredCategory) && (
          <div 
            className="absolute left-0 w-full bg-white shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] border-t border-gray-100 z-50 overflow-hidden"
            onMouseEnter={() => setHoveredCategory(hoveredCategory)}
            onMouseLeave={() => setHoveredCategory(null)}
          >
            <div className="max-w-7xl mx-auto px-8 py-10 flex gap-12">
              
              {/* Category Link */}
              <div className="w-1/4 pr-8 border-r border-gray-100">
                <h3 className="text-2xl font-black text-black uppercase mb-4">{hoveredCategory}</h3>
                <p className="text-gray-500 text-sm mb-6">Discover our wide selection of premium {hoveredCategory.toLowerCase()} from top brands.</p>
                <Link 
                  href={`/category/${hoveredCategory.toLowerCase()}`}
                  className="inline-flex items-center text-sm font-bold uppercase tracking-wider text-green-600 hover:text-green-700 group"
                  onClick={() => setHoveredCategory(null)}
                >
                  Shop All {hoveredCategory}
                  <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>

              {/* Dynamic Filter Columns */}
              <div className="w-3/4 grid grid-cols-3 gap-8">
                
                {/* Brands Column */}
                {megaMenuData[hoveredCategory]?.brands?.length > 0 && (
                  <div>
                    <h4 className="text-sm font-bold text-black uppercase tracking-widest mb-4">Top Brands</h4>
                    <ul className="space-y-3">
                      {megaMenuData[hoveredCategory]?.brands.slice(0, 8).map((brand: any) => (
                        <li key={brand.name}>
                          <Link 
                            href={`/category/${hoveredCategory.toLowerCase()}?brand=${encodeURIComponent(brand.name)}`}
                            className="text-gray-600 hover:text-green-600 text-sm transition-colors block"
                            onClick={() => setHoveredCategory(null)}
                          >
                            {brand.name}
                          </Link>
                        </li>
                      ))}
                      {megaMenuData[hoveredCategory]?.brands.length > 8 && (
                        <li>
                          <Link 
                            href={`/category/${hoveredCategory.toLowerCase()}`}
                            className="text-black hover:text-green-600 font-medium text-sm inline-flex items-center transition-colors"
                            onClick={() => setHoveredCategory(null)}
                          >
                            View All Brands <ChevronRight className="w-3 h-3 ml-1" />
                          </Link>
                        </li>
                      )}
                    </ul>
                  </div>
                )}

                {/* Dynamic Attributes Columns */}
                {Object.entries(megaMenuData[hoveredCategory]?.attributes || {}).slice(0, 2).map(([attrKey, attrValues]: any) => (
                  <div key={attrKey}>
                    <h4 className="text-sm font-bold text-black uppercase tracking-widest mb-4">{attrKey}</h4>
                    <ul className="space-y-3">
                      {attrValues.slice(0, 8).map((val: any) => (
                        <li key={val.name}>
                          <Link 
                            href={`/category/${hoveredCategory.toLowerCase()}?${attrKey.toLowerCase()}=${encodeURIComponent(val.name)}`}
                            className="text-gray-600 hover:text-green-600 text-sm transition-colors block"
                            onClick={() => setHoveredCategory(null)}
                          >
                            {val.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
                
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Mobile Navigation Drawer Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="md:hidden fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm transition-opacity"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Navigation Drawer */}
      <div className={`md:hidden fixed top-0 left-0 h-full w-[85%] max-w-[350px] bg-white z-[110] shadow-2xl transition-transform duration-300 ease-in-out flex flex-col ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <img src="/images/golf.png" alt="GolfPro" className="h-8 object-contain scale-[1.5] translate-x-4" />
          <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-gray-500 hover:bg-gray-100 rounded-full">
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-2">
          {/* Mobile Search */}
          <form onSubmit={handleSearch} className="flex items-center relative mb-4">
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search..." 
              className="w-full py-3 px-6 pr-12 rounded-full border border-gray-300 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
            />
            <button type="submit" className="absolute right-4 text-gray-400 hover:text-green-600">
              <Search className="w-5 h-5" />
            </button>
          </form>

          {navLinks.map((item) => {
            const itemPath = item === 'Home' ? '/' : (item === 'About' ? '/about' : `/category/${item.toLowerCase()}`);
            const isCategory = productCategories.includes(item);
            const hasSubMenu = isCategory && megaMenuData[item] && (megaMenuData[item].brands?.length > 0 || Object.keys(megaMenuData[item].attributes || {}).length > 0);

            return (
              <div key={item} className="border-b border-gray-50 last:border-0 pb-2">
                {!hasSubMenu ? (
                  <Link 
                    href={itemPath}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-sm font-bold text-zinc-800 hover:text-green-600 tracking-wide uppercase p-3 block"
                  >
                    {item}
                  </Link>
                ) : (
                  <>
                    <div className="flex items-center justify-between">
                      <Link 
                        href={itemPath}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="text-sm font-bold text-zinc-800 hover:text-green-600 tracking-wide uppercase p-3 flex-1"
                      >
                        {item}
                      </Link>
                      <button 
                        onClick={() => setExpandedMobileCategory(expandedMobileCategory === item ? null : item)}
                        className="p-3 text-zinc-500 hover:text-green-600 focus:outline-none"
                        aria-label={`Toggle ${item} dropdown`}
                      >
                        <ChevronDown className={`w-4 h-4 transition-transform ${expandedMobileCategory === item ? 'rotate-180' : ''}`} />
                      </button>
                    </div>
                    
                    {expandedMobileCategory === item && megaMenuData[item] && (
                      <div className="pl-6 pb-2 pr-3 flex flex-col gap-3">
                        <Link 
                          href={`/category/${item.toLowerCase()}`}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="text-sm font-bold text-green-600 mb-2 block"
                        >
                          Shop All {item} →
                        </Link>
                        
                        {megaMenuData[item].brands?.length > 0 && (
                          <div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Brands</p>
                            <div className="flex flex-col gap-2">
                              {megaMenuData[item].brands.slice(0, 5).map((brand: any) => (
                                <Link 
                                  key={brand.name}
                                  href={`/category/${item.toLowerCase()}?brand=${encodeURIComponent(brand.name)}`}
                                  onClick={() => setIsMobileMenuOpen(false)}
                                  className="text-sm text-gray-600 hover:text-green-600"
                                >
                                  {brand.name}
                                </Link>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </>
                )}
              </div>
            );
          })}
          
          <div className="pt-4 mt-2 border-t border-gray-100 mb-8 flex flex-col gap-2">
            <Link 
              href="/cart" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center justify-between text-zinc-800 hover:text-green-600 font-bold uppercase text-sm p-3 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center space-x-3">
                <ShoppingCart className="w-5 h-5" />
                <span>My Cart</span>
              </div>
              {cartCount > 0 && (
                <span className="bg-green-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                  {cartCount}
                </span>
              )}
            </Link>

            <Link 
              href={session ? '/account' : '/login'} 
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center space-x-3 text-zinc-800 hover:text-green-600 font-bold uppercase text-sm p-3 bg-gray-50 rounded-lg"
            >
              <User className="w-5 h-5" />
              <span>{session ? 'My Account' : 'Sign In / Register'}</span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
