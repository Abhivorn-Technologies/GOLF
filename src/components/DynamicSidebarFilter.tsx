"use client";

import React, { useCallback } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import PriceRangeSlider from './PriceRangeSlider';

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
    <aside className="w-[256px] shrink-0 bg-[#fbf9f9] border border-[#c1c9bf] rounded-[16px] p-[25px] flex flex-col gap-[24px]">
      
      {/* Header */}
      <div className="flex items-center justify-between">
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
                <button type="button" key={item.name} className="flex items-center gap-[12px] cursor-pointer group w-full text-left" onClick={() => handleToggle('Gender', item.name)}>
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
            <h4 className="text-[16px] font-serif font-semibold text-[#1b1c1c] mb-[16px] uppercase">Category</h4>
            <div className="flex flex-col gap-[12px]">
              {typeData.map((item) => (
                <button type="button" key={item.name} className="flex items-center gap-[12px] cursor-pointer group w-full text-left" onClick={() => handleToggle('Type', item.name)}>
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
                <button type="button" key={brand.name} className="flex items-center gap-[12px] cursor-pointer group w-full text-left" onClick={() => handleToggle('brand', brand.name)}>
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
                <button type="button" key={val.name} className="flex items-center gap-[12px] cursor-pointer group w-full text-left" onClick={() => handleToggle(attrKey, val.name)}>
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
        <button type="button" className="flex items-center gap-[12px] cursor-pointer group w-full text-left" onClick={() => handleToggle('sale', 'true', true)}>
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
      <div>
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
      
    </aside>
  );
}
