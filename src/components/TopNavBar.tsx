"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Search, ShoppingCart, User, Heart, Menu, X, ChevronDown, ChevronRight } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useSession } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';

export default function TopNavBar({ megaMenuData = {} }: { megaMenuData?: Record<string, any> }) {
  const { cartCount } = useCart();
  const { data: session, status } = useSession();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const [expandedMobileCategory, setExpandedMobileCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();
  const pathname = usePathname();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsMobileMenuOpen(false);
    }
  };

  const navLinks = ['Home', 'Clubs', 'Shoes', 'Apparel', 'Bags', 'Balls', 'Accessories'];

  return (
    <header className="w-full bg-white border-b border-gray-200 sticky top-0 z-50 group" onMouseLeave={() => setHoveredCategory(null)}>
      {/* Utility Bar */}
      <div className="bg-zinc-900 text-white text-xs py-2 px-8 flex justify-between items-center hidden md:flex">
        <div className="flex space-x-6">
          <Link href="/about" className="hover:text-gray-300">About Golf Discount</Link>
          <Link href="/blog" className="hover:text-gray-300">Blog</Link>
          <Link href="/reviews" className="hover:text-gray-300">Reviews</Link>
        </div>
        <div className="flex space-x-6">
          <Link href="/shipping" className="hover:text-gray-300">Fast Shipping</Link>
          <Link href="/guarantee" className="hover:text-gray-300">100 Day Satisfaction Guarantee</Link>
        </div>
      </div>

      {/* Main Navigation Row 1: Logo, Search, Actions */}
      <div className="px-4 md:px-8 py-4 flex items-center justify-between gap-4 md:gap-8 max-w-7xl mx-auto">
        
        {/* Mobile Menu Toggle */}
        <button 
          className="md:hidden text-zinc-700 hover:text-green-600"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        <Link href="/" className="flex-shrink-0 flex items-center relative">
          <img src="/images/golf.png" alt="GolfPro Logo" className="h-10 md:h-12 w-auto object-contain scale-[1.5] md:scale-[2.0] translate-x-8 md:translate-x-12 origin-left" />
        </Link>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="flex-grow max-w-2xl hidden md:flex items-center relative mx-8">
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for clubs, shoes, apparel..." 
            className="w-full py-3 px-6 pr-12 rounded-full border border-gray-200 bg-gray-50/50 hover:bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all shadow-sm"
          />
          <button type="submit" className="absolute right-4 text-gray-400 hover:text-black transition-colors">
            <Search className="w-5 h-5" />
          </button>
        </form>

        {/* Trailing Actions */}
        <div className="flex items-center space-x-4 md:space-x-6 flex-shrink-0">
          
          {status === 'loading' ? (
            <div className="w-6 h-6 animate-pulse bg-gray-200 rounded-full"></div>
          ) : session ? (
            <Link href="/account" className="hidden sm:flex items-center space-x-2 text-zinc-700 hover:text-green-600 transition-colors">
              <User className="w-6 h-6" />
              <span className="hidden lg:block font-medium text-sm">
                {session.user?.name || 'Account'}
              </span>
            </Link>
          ) : (
            <Link href="/login" className="hidden sm:flex items-center space-x-2 text-zinc-700 hover:text-green-600 transition-colors">
              <User className="w-6 h-6" />
              <span className="hidden lg:block font-medium text-sm">Account</span>
            </Link>
          )}

          <Link href="/account/wishlist" className="hidden sm:flex items-center space-x-2 text-zinc-700 hover:text-green-600 transition-colors">
            <Heart className="w-6 h-6" />
          </Link>

          <Link href="/cart" className="flex items-center space-x-2 text-zinc-700 hover:text-green-600 transition-colors relative">
            <ShoppingCart className="w-6 h-6" />
            <span className="absolute -top-1 -right-2 bg-green-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
              {cartCount}
            </span>
          </Link>
        </div>
      </div>

      {/* Bottom Row: Navigation Links */}
      <nav className="bg-white px-8 hidden md:block relative">
        <div className="max-w-7xl mx-auto flex items-center justify-center space-x-8 lg:space-x-12">
          {navLinks.map((item) => {
            const itemPath = item === 'Home' ? '/' : `/category/${item.toLowerCase()}`;
            const isActive = pathname === itemPath || (item !== 'Home' && pathname.startsWith(itemPath));

            return (
            <div 
              key={item} 
              onMouseEnter={() => setHoveredCategory(item)}
              className="py-4"
            >
              <Link 
                href={itemPath}
                className={`text-sm font-semibold tracking-wide uppercase transition-colors flex items-center gap-1 relative
                  ${hoveredCategory === item || isActive ? 'text-black' : 'text-zinc-500 hover:text-black'}`}
              >
                {item}
                {isActive && (
                  <span className="absolute -bottom-[22px] left-0 w-full h-[2px] bg-black rounded-t-full"></span>
                )}
              </Link>
            </div>
            );
          })}
        </div>

        {/* Mega Menu Dropdown */}
        {hoveredCategory && hoveredCategory !== 'Home' && (
          <div 
            className="absolute left-0 w-full bg-white shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] border-t border-gray-100 z-50 overflow-hidden"
            onMouseEnter={() => setHoveredCategory(hoveredCategory)}
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

      {/* Mobile Navigation Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white border-b border-gray-200 shadow-lg py-4 px-4 flex flex-col gap-2 max-h-[80vh] overflow-y-auto">
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

          {navLinks.map((item) => (
            <div key={item} className="border-b border-gray-50 last:border-0 pb-2">
              {item === 'Home' ? (
                <Link 
                  href="/"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-sm font-bold text-zinc-800 hover:text-green-600 tracking-wide uppercase p-3 block"
                >
                  Home
                </Link>
              ) : (
                <>
                  <button 
                    onClick={() => setExpandedMobileCategory(expandedMobileCategory === item ? null : item)}
                    className="w-full flex items-center justify-between text-sm font-bold text-zinc-800 hover:text-green-600 tracking-wide uppercase p-3"
                  >
                    {item}
                    <ChevronDown className={`w-4 h-4 transition-transform ${expandedMobileCategory === item ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {expandedMobileCategory === item && megaMenuData[item] && (
                    <div className="pl-6 pb-2 pr-3 flex flex-col gap-3">
                      <Link 
                        href={`/category/${item.toLowerCase()}`}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="text-sm font-bold text-green-600 mb-2"
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
                                className="text-sm text-gray-600"
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
          ))}
          
          <div className="pt-4 mt-2 border-t border-gray-100">
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
      )}
    </header>
  );
}
