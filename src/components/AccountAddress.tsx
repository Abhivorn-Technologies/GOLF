"use client";

import React, { useState } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';

export default function AccountAddress() {
  const [isAddingAddress, setIsAddingAddress] = useState(false);

  const defaultBilling = {
    firstName: 'John',
    lastName: 'Doe',
    company: '',
    street: '123 Golf Course Road',
    city: 'Pebble Beach',
    state: 'CA',
    zip: '93953',
    country: 'United States',
    phone: '(555) 123-4567'
  };

  const defaultShipping = {
    firstName: 'John',
    lastName: 'Doe',
    company: '',
    street: '123 Golf Course Road',
    city: 'Pebble Beach',
    state: 'CA',
    zip: '93953',
    country: 'United States',
    phone: '(555) 123-4567'
  };

  return (
    <div className="w-full">
      <h2 className="font-['EB_Garamond'] font-bold text-[32px] text-[#1b1c1c] leading-tight mb-8">
        Address Book
      </h2>

      {!isAddingAddress ? (
        <div className="flex flex-col gap-[48px]">
          {/* Current Addresses */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-[24px]">
            
            {/* Default Billing */}
            <div className="bg-[#f8f9fa] border border-[#cfc4c5] rounded-[11px] p-[24px] flex flex-col h-full">
              <div className="mb-[16px]">
                <h3 className="font-['EB_Garamond'] font-bold text-[20px] text-[#1b1c1c] mb-[4px]">Default Billing Address</h3>
                <div className="w-full h-px bg-[#cfc4c5] mt-[8px]"></div>
              </div>
              
              <div className="flex flex-col font-['Hanken_Grotesk'] text-[#4c4546] text-[16px] leading-[24px] flex-grow">
                <span className="font-medium text-[#1b1c1c]">{defaultBilling.firstName} {defaultBilling.lastName}</span>
                {defaultBilling.company && <span>{defaultBilling.company}</span>}
                <span>{defaultBilling.street}</span>
                <span>{defaultBilling.city}, {defaultBilling.state} {defaultBilling.zip}</span>
                <span>{defaultBilling.country}</span>
                <span className="mt-[8px]">T: {defaultBilling.phone}</span>
              </div>

              <div className="flex gap-[16px] mt-[24px] pt-[16px] border-t border-[#cfc4c5]">
                <button className="flex items-center gap-[6px] text-[#006747] hover:text-[#004d35] font-['Hanken_Grotesk'] font-semibold text-[14px] transition-colors">
                  <Edit2 className="w-[14px] h-[14px]" />
                  <span>Edit</span>
                </button>
              </div>
            </div>

            {/* Default Shipping */}
            <div className="bg-[#f8f9fa] border border-[#cfc4c5] rounded-[11px] p-[24px] flex flex-col h-full">
              <div className="mb-[16px]">
                <h3 className="font-['EB_Garamond'] font-bold text-[20px] text-[#1b1c1c] mb-[4px]">Default Shipping Address</h3>
                <div className="w-full h-px bg-[#cfc4c5] mt-[8px]"></div>
              </div>
              
              <div className="flex flex-col font-['Hanken_Grotesk'] text-[#4c4546] text-[16px] leading-[24px] flex-grow">
                <span className="font-medium text-[#1b1c1c]">{defaultShipping.firstName} {defaultShipping.lastName}</span>
                {defaultShipping.company && <span>{defaultShipping.company}</span>}
                <span>{defaultShipping.street}</span>
                <span>{defaultShipping.city}, {defaultShipping.state} {defaultShipping.zip}</span>
                <span>{defaultShipping.country}</span>
                <span className="mt-[8px]">T: {defaultShipping.phone}</span>
              </div>

              <div className="flex gap-[16px] mt-[24px] pt-[16px] border-t border-[#cfc4c5]">
                <button className="flex items-center gap-[6px] text-[#006747] hover:text-[#004d35] font-['Hanken_Grotesk'] font-semibold text-[14px] transition-colors">
                  <Edit2 className="w-[14px] h-[14px]" />
                  <span>Edit</span>
                </button>
              </div>
            </div>

          </div>

          {/* Add New Address Button */}
          <div className="flex justify-start">
            <button 
              onClick={() => setIsAddingAddress(true)}
              className="bg-[#1b1c1c] text-white rounded-full py-[12px] px-[32px] font-['Hanken_Grotesk'] font-medium text-[16px] hover:bg-[#333] transition-colors flex items-center gap-[8px] shadow-sm"
            >
              <Plus className="w-[18px] h-[18px]" />
              <span>Add New Address</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white border border-[#cfc4c5] rounded-[11px] p-[32px]">
          <h3 className="font-['EB_Garamond'] font-bold text-[24px] text-[#1b1c1c] mb-[24px]">
            Add New Address
          </h3>

          <form className="flex flex-col gap-[24px]">
            {/* Contact Info */}
            <div>
              <h4 className="font-['Hanken_Grotesk'] font-semibold text-[16px] text-[#1b1c1c] mb-[16px]">Contact Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-[16px]">
                <div className="flex flex-col gap-[8px]">
                  <label className="font-['Hanken_Grotesk'] text-[14px] text-[#4c4546]">
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <input type="text" className="border border-[#cfc4c5] rounded-[4px] px-[12px] py-[10px] focus:outline-none focus:border-[#006747]" placeholder="John" />
                </div>
                <div className="flex flex-col gap-[8px]">
                  <label className="font-['Hanken_Grotesk'] text-[14px] text-[#4c4546]">
                    Last Name <span className="text-red-500">*</span>
                  </label>
                  <input type="text" className="border border-[#cfc4c5] rounded-[4px] px-[12px] py-[10px] focus:outline-none focus:border-[#006747]" placeholder="Doe" />
                </div>
                <div className="flex flex-col gap-[8px]">
                  <label className="font-['Hanken_Grotesk'] text-[14px] text-[#4c4546]">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input type="tel" className="border border-[#cfc4c5] rounded-[4px] px-[12px] py-[10px] focus:outline-none focus:border-[#006747]" placeholder="(555) 000-0000" />
                </div>
              </div>
            </div>

            <hr className="border-[#cfc4c5]" />

            {/* Address Info */}
            <div>
              <h4 className="font-['Hanken_Grotesk'] font-semibold text-[16px] text-[#1b1c1c] mb-[16px]">Address Information</h4>
              <div className="flex flex-col gap-[16px]">
                <div className="flex flex-col gap-[8px]">
                  <label className="font-['Hanken_Grotesk'] text-[14px] text-[#4c4546]">
                    Street Address <span className="text-red-500">*</span>
                  </label>
                  <input type="text" className="border border-[#cfc4c5] rounded-[4px] px-[12px] py-[10px] focus:outline-none focus:border-[#006747]" placeholder="123 Street Name" />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-[16px]">
                  <div className="flex flex-col gap-[8px]">
                    <label className="font-['Hanken_Grotesk'] text-[14px] text-[#4c4546]">
                      City <span className="text-red-500">*</span>
                    </label>
                    <input type="text" className="border border-[#cfc4c5] rounded-[4px] px-[12px] py-[10px] focus:outline-none focus:border-[#006747]" placeholder="City" />
                  </div>
                  <div className="flex flex-col gap-[8px]">
                    <label className="font-['Hanken_Grotesk'] text-[14px] text-[#4c4546]">
                      State/Province <span className="text-red-500">*</span>
                    </label>
                    <input type="text" className="border border-[#cfc4c5] rounded-[4px] px-[12px] py-[10px] focus:outline-none focus:border-[#006747]" placeholder="State" />
                  </div>
                  <div className="flex flex-col gap-[8px]">
                    <label className="font-['Hanken_Grotesk'] text-[14px] text-[#4c4546]">
                      Zip/Postal Code <span className="text-red-500">*</span>
                    </label>
                    <input type="text" className="border border-[#cfc4c5] rounded-[4px] px-[12px] py-[10px] focus:outline-none focus:border-[#006747]" placeholder="Zip Code" />
                  </div>
                  <div className="flex flex-col gap-[8px]">
                    <label className="font-['Hanken_Grotesk'] text-[14px] text-[#4c4546]">
                      Country <span className="text-red-500">*</span>
                    </label>
                    <select className="border border-[#cfc4c5] rounded-[4px] px-[12px] py-[10px] focus:outline-none focus:border-[#006747] bg-white text-[#1b1c1c]">
                      <option>United States</option>
                      <option>Canada</option>
                      <option>United Kingdom</option>
                      <option>Australia</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center gap-[8px] mt-[8px]">
                  <input type="checkbox" id="default-billing" className="w-[16px] h-[16px] accent-[#006747]" />
                  <label htmlFor="default-billing" className="font-['Hanken_Grotesk'] text-[14px] text-[#4c4546] cursor-pointer">
                    Use as my default billing address
                  </label>
                </div>
                <div className="flex items-center gap-[8px]">
                  <input type="checkbox" id="default-shipping" className="w-[16px] h-[16px] accent-[#006747]" />
                  <label htmlFor="default-shipping" className="font-['Hanken_Grotesk'] text-[14px] text-[#4c4546] cursor-pointer">
                    Use as my default shipping address
                  </label>
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex items-center gap-[16px] mt-[16px] pt-[24px] border-t border-[#cfc4c5]">
              <button 
                type="button"
                className="bg-[#1b1c1c] text-white rounded-full py-[12px] px-[32px] font-['Hanken_Grotesk'] font-medium text-[16px] hover:bg-[#333] transition-colors"
              >
                Save Address
              </button>
              <button 
                type="button"
                onClick={() => setIsAddingAddress(false)}
                className="text-[#4c4546] font-['Hanken_Grotesk'] font-medium text-[16px] hover:text-[#1b1c1c] transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
