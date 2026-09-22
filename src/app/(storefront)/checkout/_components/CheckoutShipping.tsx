"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Edit2, MapPin } from 'lucide-react';
import { useCart, ShippingAddress } from '@/context/CartContext';
import toast from 'react-hot-toast';
import { useSession } from 'next-auth/react';

export default function CheckoutShipping() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { shippingAddress, setShippingAddress } = useCart();
  
  const [addresses, setAddresses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [mode, setMode] = useState<'select' | 'form'>('select');
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [addressForm, setAddressForm] = useState({
    name: '',
    phone: '',
    houseNumber: '',
    street: '',
    area: '',
    landmark: '',
    city: '',
    state: '',
    zip: '',
    country: 'India'
  });

  const [isLocating, setIsLocating] = useState(false);

  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (status === 'loading') return;
    if (!session?.user) {
      toast.error("Please sign in or register to proceed to checkout!");
      router.push(`/login?redirect=${encodeURIComponent('/checkout/shipping')}`);
      return;
    }
    fetchAddresses();
  }, [session, status]);

  const fetchAddresses = async () => {
    try {
      const res = await fetch('/api/user/addresses');
      const data = await res.json();
      if (res.ok && data.addresses.length > 0) {
        setAddresses(data.addresses);
        
        // Auto-select default shipping or the first one
        const defaultShipping = data.addresses.find((a: any) => a.isDefaultShipping);
        if (defaultShipping) {
          setSelectedAddressId(defaultShipping._id);
        } else {
          setSelectedAddressId(data.addresses[0]._id);
        }
        setMode('select');
      } else {
        setMode('form');
      }
    } catch (error) {
      console.error('Failed to fetch addresses', error);
      setMode('form');
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (addr: any) => {
    setEditingId(addr._id);
    setAddressForm({
      name: addr.name || '',
      phone: addr.phone || '',
      houseNumber: addr.houseNumber || '',
      street: addr.street || '',
      area: addr.area || '',
      landmark: addr.landmark || '',
      city: addr.city || '',
      state: addr.state || '',
      zip: addr.zip || '',
      country: addr.country || 'India'
    });
    setMode('form');
  };

  const startNew = () => {
    setEditingId(null);
    setAddressForm({
      name: '', phone: '', houseNumber: '', street: '', area: '', landmark: '', city: '', state: '', zip: '', country: 'India'
    });
    setMode('form');
  };

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by your browser');
      return;
    }
    
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(async (position) => {
      try {
        const { latitude, longitude } = position.coords;
        const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
        const data = await res.json();
        
        if (data && data.address) {
          setAddressForm(prev => ({
            ...prev,
            street: data.address.road || data.address.street || '',
            area: data.address.suburb || data.address.neighbourhood || data.address.city_district || '',
            city: data.address.city || data.address.town || data.address.village || data.address.county || '',
            state: data.address.state || '',
            zip: data.address.postcode || ''
          }));
          toast.success('Location auto-filled!');
        } else {
          toast.error('Could not determine address from location');
        }
      } catch (e) {
        toast.error('Failed to fetch location details');
      } finally {
        setIsLocating(false);
      }
    }, (error) => {
      toast.error('Location access denied or unavailable');
      setIsLocating(false);
    });
  };

  const handleContinue = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    let chosenAddress: ShippingAddress;

    // If we are in 'select' mode, we use the selected address
    if (mode === 'select' && selectedAddressId) {
      const selected = addresses.find(a => a._id === selectedAddressId);
      if (!selected) {
        toast.error('Please select an address');
        setIsProcessing(false);
        return;
      }
      chosenAddress = {
        name: selected.name,
        phone: selected.phone || '',
        houseNumber: selected.houseNumber,
        street: selected.street,
        area: selected.area,
        landmark: selected.landmark,
        city: selected.city,
        state: selected.state,
        zip: selected.zip
      };
    } else {
      // We are in 'form' mode
      if (!addressForm.name || !addressForm.street || !addressForm.city || !addressForm.state || !addressForm.zip || !addressForm.phone) {
        toast.error('Please fill in all shipping details');
        setIsProcessing(false);
        return;
      }

      chosenAddress = {
        name: addressForm.name,
        phone: addressForm.phone || '',
        houseNumber: addressForm.houseNumber,
        street: addressForm.street,
        area: addressForm.area,
        landmark: addressForm.landmark,
        city: addressForm.city,
        state: addressForm.state,
        zip: addressForm.zip
      };

      // If user is logged in, auto-save to address book
      if (session?.user) {
        try {
          const method = editingId ? 'PUT' : 'POST';
          const body = editingId ? { ...addressForm, _id: editingId } : addressForm;
          
          const res = await fetch('/api/user/addresses', {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
          });
          
          if (res.ok) {
            toast.success(editingId ? 'Address updated in Address Book' : 'Address saved to Address Book');
          } else if (!editingId) {
            // Might have hit the 5 address limit, that's fine we can still proceed with checkout
            const data = await res.json();
            console.log("Could not save address automatically:", data.error);
          }
        } catch (error) {
          console.error("Failed to auto-save address");
        }
      }
    }
    
    setShippingAddress(chosenAddress);
    setTimeout(() => {
      router.push('/checkout/payment');
    }, 400);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-gray-400">
        <div className="w-8 h-8 border-4 border-gray-200 border-t-black rounded-full animate-spin mb-4"></div>
        <p className="font-semibold text-sm">Loading addresses...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-[32px] w-full">
      
      <div className="flex flex-col gap-[12px]">
        <h1 className="font-['Liberation_Serif'] text-[36px] text-black leading-[40px]">
          Shipping Address
        </h1>
        <div className="bg-black h-[2px] w-[40px]"></div>
      </div>

      <form onSubmit={handleContinue} className="flex flex-col gap-[32px]">
        
        {mode === 'select' && addresses.length > 0 ? (
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {addresses.map((addr) => (
                <div 
                  key={addr._id} 
                  onClick={() => setSelectedAddressId(addr._id)}
                  className={`bg-white rounded-2xl border-2 p-6 flex flex-col cursor-pointer transition-all ${selectedAddressId === addr._id ? 'border-black shadow-md' : 'border-gray-200 hover:border-gray-300'}`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-bold text-black text-lg">{addr.name}</span>
                    <button 
                      type="button" 
                      onClick={(e) => { e.stopPropagation(); startEdit(addr); }}
                      className="text-gray-400 hover:text-black transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex flex-col gap-1 text-sm text-gray-600">
                    <span>{addr.houseNumber ? `${addr.houseNumber}, ` : ''}{addr.street}</span>
                    <span>{addr.area ? `${addr.area}, ` : ''}{addr.city}, {addr.state} {addr.zip}</span>
                    <span className="mt-2 font-medium text-gray-800">T: {addr.phone}</span>
                  </div>
                </div>
              ))}
            </div>

            {addresses.length < 5 && (
              <button 
                type="button"
                onClick={startNew}
                className="mt-2 bg-gray-50 border border-gray-200 text-black rounded-2xl py-4 font-bold text-sm uppercase tracking-widest hover:bg-gray-100 transition-colors flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" /> Deliver to a new address
              </button>
            )}
          </div>
        ) : (
          <div className="bg-[#f8f9fa] border border-[#c4c6cc] rounded-[20px] p-[32px] w-full flex flex-col gap-4">
            {addresses.length > 0 && mode === 'form' && (
              <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-200">
                <span className="font-bold text-black uppercase tracking-widest text-sm">
                  {editingId ? 'Edit Address' : 'New Address'}
                </span>
                <button 
                  type="button" 
                  onClick={() => setMode('select')}
                  className="text-gray-500 hover:text-black font-semibold text-sm underline"
                >
                  Cancel
                </button>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input required maxLength={50} type="text" placeholder="Full Name *" value={addressForm.name} onChange={e => setAddressForm({...addressForm, name: e.target.value})} className="w-full border border-[#c4c6cc] rounded-[8px] px-[16px] py-[14px] font-['Hanken_Grotesk'] text-[15px] focus:outline-none focus:border-black" />
              <input required maxLength={20} type="tel" placeholder="Phone Number *" value={addressForm.phone} onChange={e => setAddressForm({...addressForm, phone: e.target.value})} className="w-full border border-[#c4c6cc] rounded-[8px] px-[16px] py-[14px] font-['Hanken_Grotesk'] text-[15px] focus:outline-none focus:border-black" />
            </div>

            <button 
              type="button" 
              onClick={handleUseCurrentLocation}
              disabled={isLocating}
              className="w-full bg-blue-50 text-blue-700 border border-blue-200 rounded-[8px] px-[16px] py-[14px] font-['Hanken_Grotesk'] font-bold text-[14px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-blue-100 transition-colors disabled:opacity-50"
            >
              {isLocating ? (
                <span className="w-4 h-4 border-2 border-blue-600/30 border-t-blue-600 rounded-full animate-spin"></span>
              ) : (
                <MapPin className="w-4 h-4" />
              )}
              {isLocating ? "Locating..." : "Use Current Location"}
            </button>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input maxLength={100} type="text" placeholder="House / Flat No." value={addressForm.houseNumber} onChange={e => setAddressForm({...addressForm, houseNumber: e.target.value})} className="w-full border border-[#c4c6cc] rounded-[8px] px-[16px] py-[14px] font-['Hanken_Grotesk'] text-[15px] focus:outline-none focus:border-black" />
              <input required maxLength={100} type="text" placeholder="Street Address *" value={addressForm.street} onChange={e => setAddressForm({...addressForm, street: e.target.value})} className="w-full border border-[#c4c6cc] rounded-[8px] px-[16px] py-[14px] font-['Hanken_Grotesk'] text-[15px] focus:outline-none focus:border-black" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input maxLength={100} type="text" placeholder="Area / Village / Locality" value={addressForm.area} onChange={e => setAddressForm({...addressForm, area: e.target.value})} className="w-full border border-[#c4c6cc] rounded-[8px] px-[16px] py-[14px] font-['Hanken_Grotesk'] text-[15px] focus:outline-none focus:border-black" />
              <input maxLength={100} type="text" placeholder="Landmark (Optional)" value={addressForm.landmark} onChange={e => setAddressForm({...addressForm, landmark: e.target.value})} className="w-full border border-[#c4c6cc] rounded-[8px] px-[16px] py-[14px] font-['Hanken_Grotesk'] text-[15px] focus:outline-none focus:border-black" />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <input required maxLength={50} type="text" placeholder="City *" value={addressForm.city} onChange={e => setAddressForm({...addressForm, city: e.target.value})} className="w-full border border-[#c4c6cc] rounded-[8px] px-[16px] py-[14px] font-['Hanken_Grotesk'] text-[15px] focus:outline-none focus:border-black" />
              <div className="grid grid-cols-2 gap-4">
                <input required maxLength={50} type="text" placeholder="State *" value={addressForm.state} onChange={e => setAddressForm({...addressForm, state: e.target.value})} className="w-full border border-[#c4c6cc] rounded-[8px] px-[16px] py-[14px] font-['Hanken_Grotesk'] text-[15px] focus:outline-none focus:border-black" />
                <input required maxLength={20} type="text" placeholder="Pincode *" value={addressForm.zip} onChange={e => setAddressForm({...addressForm, zip: e.target.value})} className="w-full border border-[#c4c6cc] rounded-[8px] px-[16px] py-[14px] font-['Hanken_Grotesk'] text-[15px] focus:outline-none focus:border-black" />
              </div>
            </div>
          </div>
        )}

        <button 
          type="submit"
          disabled={isProcessing}
          className="mt-[16px] bg-black text-white font-['Hanken_Grotesk'] font-bold tracking-widest uppercase text-xs py-[16px] px-[32px] rounded-full w-full hover:bg-gray-800 transition-colors disabled:opacity-75 flex justify-center items-center h-[56px]"
        >
          {isProcessing ? (
            <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
          ) : (
            "Continue to Payment"
          )}
        </button>
      </form>
    </div>
  );
}
