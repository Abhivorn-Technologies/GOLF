import React from 'react';
import { CreditCard, Plus, Trash2 } from 'lucide-react';

export default function AccountPayments() {
  const paymentMethods = [
    {
      id: 1,
      type: 'Visa',
      last4: '4242',
      expiry: '12/24',
      isDefault: true,
    },
    {
      id: 2,
      type: 'Mastercard',
      last4: '8888',
      expiry: '08/25',
      isDefault: false,
    }
  ];

  return (
    <div className="flex flex-col gap-[32px] w-full">
      <div className="flex flex-col gap-[12px]">
        <h1 className="font-['Liberation_Serif'] text-[36px] text-black leading-[40px]">
          Payment Methods
        </h1>
        <div className="bg-black h-[2px] w-[40px]"></div>
        <p className="font-['Hanken_Grotesk'] text-[#4c4546] text-[16px] mt-1">
          Manage your saved payment methods and billing preferences.
        </p>
      </div>

      <div className="flex flex-col gap-[24px]">
        {paymentMethods.map((method) => (
          <div key={method.id} className="bg-white border border-[#cfc4c5] rounded-[11px] p-[24px] flex flex-col md:flex-row justify-between items-start md:items-center gap-[16px]">
            <div className="flex items-center gap-[16px]">
              <div className="w-[48px] h-[32px] bg-[#f8f9fa] border border-[#cfc4c5] rounded-[4px] flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-[#4c4546]" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-[8px]">
                  <span className="font-['Hanken_Grotesk'] font-bold text-black text-[16px]">
                    {method.type} ending in {method.last4}
                  </span>
                  {method.isDefault && (
                    <span className="bg-[#e6f0ec] text-[#006747] font-['Hanken_Grotesk'] font-bold text-[10px] uppercase tracking-[0.5px] px-[8px] py-[2px] rounded-[4px]">
                      Default
                    </span>
                  )}
                </div>
                <span className="font-['Hanken_Grotesk'] text-[#4c4546] text-[14px] mt-[4px]">
                  Expires {method.expiry}
                </span>
              </div>
            </div>
            
            <div className="flex gap-[16px] w-full md:w-auto mt-[16px] md:mt-0 pt-[16px] md:pt-0 border-t md:border-t-0 border-[#cfc4c5]">
              {!method.isDefault && (
                <button className="font-['Hanken_Grotesk'] font-medium text-[14px] text-[#006747] hover:underline transition-colors">
                  Make Default
                </button>
              )}
              <button className="flex items-center gap-[4px] font-['Hanken_Grotesk'] font-medium text-[14px] text-[#d93025] hover:underline transition-colors ml-auto md:ml-0">
                <Trash2 className="w-4 h-4" /> Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      <button className="border-2 border-[#004d34] text-[#004d34] font-['Hanken_Grotesk'] font-medium text-[16px] py-[16px] px-[32px] rounded-full hover:bg-[#f2f8f5] transition-colors flex items-center justify-center gap-[8px] w-full md:w-auto self-start mt-4">
        <Plus className="w-5 h-5" />
        Add New Payment Method
      </button>

    </div>
  );
}
