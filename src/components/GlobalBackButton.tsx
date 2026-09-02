"use client";

import React from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';

export default function GlobalBackButton() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Don't show on the homepage
  if (pathname === '/') return null;

  const pathSegments = pathname.split('/').filter(Boolean);
  const brandQuery = searchParams.get('brand');
  const categoryQuery = searchParams.get('category');

  return (
    <div className="w-full bg-[#f4f4f5]">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-4">
        <nav className="flex text-[10px] md:text-xs font-bold uppercase tracking-widest text-gray-400 overflow-x-auto whitespace-nowrap hide-scrollbar" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-2">
            <li className="inline-flex items-center">
              <Link href="/" className="hover:text-black transition-colors flex items-center">
                <Home className="w-3 h-3 md:w-3.5 md:h-3.5 mr-1.5 mb-0.5" />
                Home
              </Link>
            </li>
            
            {(() => {
              const visualSegments = pathSegments.map((segment, index) => ({
                segment,
                href: `/${pathSegments.slice(0, index + 1).join('/')}`,
                title: segment.replace(/-/g, ' ')
              })).filter(item => item.segment !== 'category' && item.segment !== 'product');

              return visualSegments.map((item, index) => {
                const isLast = index === visualSegments.length - 1 && !brandQuery && !categoryQuery;
                return (
                  <li key={item.segment}>
                    <div className="flex items-center">
                      <ChevronRight className="w-3 h-3 mx-1" />
                      {isLast ? (
                        <span className="text-black">{item.title}</span>
                      ) : (
                        <Link href={item.href} className="hover:text-black transition-colors">
                          {item.title}
                        </Link>
                      )}
                    </div>
                  </li>
                );
              });
            })()}

            {/* Handle dynamic query params on the products page */}
            {pathname === '/products' && (brandQuery || categoryQuery) && (
              <li>
                <div className="flex items-center">
                  <ChevronRight className="w-3 h-3 mx-1" />
                  <span className="text-black">{brandQuery || categoryQuery}</span>
                </div>
              </li>
            )}
          </ol>
        </nav>
      </div>
    </div>
  );
}
