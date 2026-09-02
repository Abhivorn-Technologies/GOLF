"use client";

import React, { useCallback, useState, useEffect } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { Filter, X } from 'lucide-react';
import PriceRangeSlider from "@/app/(storefront)/_components/PriceRangeSlider";

interface FilterItem {
  name: string;
  count: number;
}

interface DynamicSidebarFilterProps {
  filterData: {
    brands: FilterItem[];
    attributes: Record<string, FilterItem[]>;
  };
  allowedAttributes?: string[];
}

export default function DynamicSidebarFilter({ filterData, allowedAttributes }: DynamicSidebarFilterProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Prevent background scrolling when drawer is open
  useEffect(() => {
    if (isMobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileOpen]);

  const createQueryString = useCallback(
    (name: string, value: string, isSingleValue = false) => {
      const params = new URLSearchParams(searchParams.toString());
      if (isSingleValue) {
        if (value) {
          params.set(name, value);
        } else {
          params.delete(name);
        }
      } else {
        const currentValues = params.getAll(name);
        if (currentValues.includes(value)) {
          const newValues = currentValues.filter((v) => v !== value);
          params.delete(name);
          newValues.forEach((v) => params.append(name, v));
        } else {
          params.append(name, value);
        }
      }
      return params.toString();
    },
    [searchParams]
  );

  const handleToggle = (name: string, value: string, isSingleValue = false) => {
    const queryString = createQueryString(name, value, isSingleValue);
    router.push(pathname + (queryString ? `?${queryString}` : ''), { scroll: false });
  };

  const isSelected = (name: string, value: string) => {
    return searchParams.getAll(name).includes(value);
  };

  // Reorder attributes to match Figma priority (Gender -> Category -> Brand -> Dexterity -> Flex -> Price Range)
  // We'll extract specific ones first.
  const genderData = filterData.attributes['Gender'];
  const typeData = filterData.attributes['Type']; // "Category" conceptually is Type for clubs, but Clubs are the main category. 
  let remainingAttributes = Object.entries(filterData.attributes || {}).filter(([key]) => key !== 'Gender' && key !== 'Type');

  if (allowedAttributes && allowedAttributes.length > 0) {
    // Convert to lowercase for case-insensitive matching
    const lowerAllowed = allowedAttributes.map(a => a.toLowerCase());
    remainingAttributes = remainingAttributes.filter(([key]) => lowerAllowed.includes(key.toLowerCase()));
  }

  return (
    <>
      {/* Mobile Toggle Button */}
      <div className="lg:hidden w-full mb-2">
        <button 
          onClick={() => setIsMobileOpen(true)}
          className="w-full flex items-center justify-center gap-2 bg-black text-white py-3.5 rounded-xl font-bold uppercase tracking-wider text-sm hover:bg-gray-800 transition-colors"
        >
          <Filter className="w-4 h-4" /> Filters
        </button>
      </div>

      {/* Mobile Drawer Overlay */}
      {isMobileOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/60 z-[100] backdrop-blur-sm transition-opacity" 
          onClick={() => setIsMobileOpen(false)} 
        />
      )}

      {/* Sidebar Container */}
      <aside className={`
        fixed inset-y-0 left-0 z-[110] w-[85%] max-w-[340px] bg-white overflow-y-auto transition-transform duration-300 ease-in-out
        lg:relative lg:w-[256px] lg:z-0 lg:translate-x-0 lg:bg-[#fbf9f9] lg:border lg:border-[#c1c9bf] lg:rounded-[16px] lg:shrink-0 lg:flex lg:flex-col lg:gap-[24px] lg:p-[25px]
        ${isMobileOpen ? 'translate-x-0 shadow-2xl p-[24px] flex flex-col gap-6' : '-translate-x-full lg:shadow-none hidden lg:flex'}
      `}>
        
        {/* Mobile Header with Close Button */}
        <div className="lg:hidden flex items-center justify-between border-b border-gray-100 pb-4 mb-2">
          <h2 className="text-[20px] font-black uppercase tracking-widest text-black">Filters</h2>
          <button onClick={() => setIsMobileOpen(false)} className="p-2 text-gray-400 hover:text-black hover:bg-gray-50 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Desktop Header */}
        <div className="hidden lg:flex items-center justify-between">
          <h3 className="text-[20px] font-serif font-semibold text-[#1b1c1c]">Filters</h3>
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4.5 9H13.5M2.25 4.5H15.75M6.75 13.5H11.25" stroke="#1b1c1c" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>

      <hr className="border-[#c1c9bf]" />

      {/* Gender Filter */}
      {genderData?.length > 0 && (
        <>
          <div>
            <h4 className="text-[16px] font-serif font-semibold text-[#1b1c1c] mb-[16px] uppercase">Gender</h4>
            <div className="flex flex-col gap-[12px]">
              {genderData.map((item) => (
                <button type="button" key={item.name} className="flex items-center gap-[12px] cursor-pointer group w-full text-left" onClick={() => handleToggle('Gender', item.name)} suppressHydrationWarning>
                  <div className={`w-[20px] h-[20px] rounded-[4px] border flex items-center justify-center transition-colors ${isSelected('Gender', item.name) ? 'bg-[#006747] border-[#006747]' : 'border-[#717b71] group-hover:border-[#006747]'}`}>
                    {isSelected('Gender', item.name) && (
                      <svg width="10" height="8" viewBox="0 0 10 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </div>
                  <span className="text-[16px] text-[#1b1c1c] uppercase">{item.name} <span className="text-gray-400 font-normal">({item.count})</span></span>
                </button>
              ))}
            </div>
          </div>
          <hr className="border-[#c1c9bf]" />
        </>
      )}

      {/* Category / Type Filter */}
      {typeData?.length > 0 && (
        <>
          <div>
            <h4 className="text-[16px] font-serif font-semibold text-[#1b1c1c] mb-[16px] uppercase">Type</h4>
            <div className="flex flex-col gap-[12px]">
              {typeData.map((item) => (
                <button type="button" key={item.name} className="flex items-center gap-[12px] cursor-pointer group w-full text-left" onClick={() => handleToggle('Type', item.name)} suppressHydrationWarning>
                  <div className={`w-[20px] h-[20px] rounded-[4px] border flex items-center justify-center transition-colors ${isSelected('Type', item.name) ? 'bg-[#006747] border-[#006747]' : 'border-[#717b71] group-hover:border-[#006747]'}`}>
                    {isSelected('Type', item.name) && (
                      <svg width="10" height="8" viewBox="0 0 10 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </div>
                  <span className="text-[16px] text-[#1b1c1c] uppercase">{item.name} <span className="text-gray-400 font-normal">({item.count})</span></span>
                </button>
              ))}
            </div>
          </div>
          <hr className="border-[#c1c9bf]" />
        </>
      )}

      {/* Dynamic Brands Filter */}
      {filterData.brands?.length > 0 && (
        <>
          <div>
            <h4 className="text-[16px] font-serif font-semibold text-[#1b1c1c] mb-[16px] uppercase">Brand</h4>
            <div className="flex flex-col gap-[12px]">
              {filterData.brands.map((brand) => (
                <button type="button" key={brand.name} className="flex items-center gap-[12px] cursor-pointer group w-full text-left" onClick={() => handleToggle('brand', brand.name)} suppressHydrationWarning>
                  <div className={`w-[20px] h-[20px] rounded-[4px] border flex items-center justify-center transition-colors ${isSelected('brand', brand.name) ? 'bg-[#006747] border-[#006747]' : 'border-[#717b71] group-hover:border-[#006747]'}`}>
                    {isSelected('brand', brand.name) && (
                      <svg width="10" height="8" viewBox="0 0 10 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </div>
                  <span className="text-[16px] text-[#1b1c1c] uppercase">{brand.name} <span className="text-gray-400 font-normal">({brand.count})</span></span>
                </button>
              ))}
            </div>
          </div>
          <hr className="border-[#c1c9bf]" />
        </>
      )}

      {/* Dynamic Attributes Filter (Rest) */}
      {remainingAttributes.map(([attrKey, attrValues]) => (
        <React.Fragment key={attrKey}>
          <div>
            <h4 className="text-[16px] font-serif font-semibold text-[#1b1c1c] mb-[16px] uppercase">{attrKey}</h4>
            <div className="flex flex-col gap-[12px]">
              {attrValues.map((val) => (
                <button type="button" key={val.name} className="flex items-center gap-[12px] cursor-pointer group w-full text-left" onClick={() => handleToggle(attrKey, val.name)} suppressHydrationWarning>
                  <div className={`w-[20px] h-[20px] rounded-[4px] border flex items-center justify-center transition-colors ${isSelected(attrKey, val.name) ? 'bg-[#006747] border-[#006747]' : 'border-[#717b71] group-hover:border-[#006747]'}`}>
                    {isSelected(attrKey, val.name) && (
                      <svg width="10" height="8" viewBox="0 0 10 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </div>
                  <span className="text-[16px] text-[#1b1c1c] uppercase">{val.name} <span className="text-gray-400 font-normal">({val.count})</span></span>
                </button>
              ))}
            </div>
          </div>
          <hr className="border-[#c1c9bf]" />
        </React.Fragment>
      ))}

      {/* On Sale Filter */}
      <div>
        <button type="button" className="flex items-center gap-[12px] cursor-pointer group w-full text-left" onClick={() => handleToggle('sale', 'true', true)} suppressHydrationWarning>
          <div className={`w-[20px] h-[20px] rounded-[4px] border flex items-center justify-center transition-colors ${isSelected('sale', 'true') ? 'bg-[#006747] border-[#006747]' : 'border-[#717b71] group-hover:border-[#006747]'}`}>
            {isSelected('sale', 'true') && (
              <svg width="10" height="8" viewBox="0 0 10 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            )}
          </div>
          <span className="text-[16px] font-semibold text-[#1b1c1c] uppercase">On Sale Only</span>
        </button>
      </div>

      <hr className="border-[#c1c9bf]" />

      {/* Price Filter (Interactive Slider) */}
      <div className="mb-8">
        <h4 className="text-[14px] font-serif font-medium text-[#414942] tracking-[1.4px] mb-[16px] uppercase">PRICE RANGE</h4>
        <PriceRangeSlider 
          min={0}
          max={100000}
          initialMin={searchParams.get('minPrice') ? parseInt(searchParams.get('minPrice') as string) : 0}
          initialMax={searchParams.get('maxPrice') ? parseInt(searchParams.get('maxPrice') as string) : 100000}
          onChange={(min, max) => {
            const params = new URLSearchParams(searchParams.toString());
            if (min > 0) params.set('minPrice', min.toString());
            else params.delete('minPrice');
            
            if (max < 100000) params.set('maxPrice', max.toString());
            else params.delete('maxPrice');
            
            router.push(pathname + '?' + params.toString(), { scroll: false });
          }}
        />
      </div>

      {/* Mobile Apply Button */}
      <div className="lg:hidden sticky bottom-0 bg-white pt-4 pb-2 border-t border-gray-100 mt-auto z-10">
        <button 
          onClick={() => setIsMobileOpen(false)}
          className="w-full bg-black text-white py-3.5 rounded-xl font-bold uppercase tracking-wider text-sm hover:bg-gray-800 transition-colors shadow-lg"
        >
          View Results
        </button>
      </div>
      
    </aside>
    </>
  );
}
