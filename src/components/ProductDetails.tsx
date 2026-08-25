"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { ProductType } from '@/data/products';
import { useCart } from '@/context/CartContext';
import { Trash2, Heart, Check, ShoppingCart } from 'lucide-react';
import { useSession } from 'next-auth/react';

interface ProductDetailsProps {
  product: ProductType;
}

export default function ProductDetails({ product }: ProductDetailsProps) {
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const { cartItems, addToCart, removeFromCart } = useCart();
  const { data: session } = useSession();

  const getVariants = (val?: string) => val ? val.split(',').map(s => {
    const trimmed = s.trim();
    if (trimmed.includes(':')) {
      const [name, stockStr] = trimmed.split(':');
      const stock = parseInt(stockStr.trim());
      return { name: name.trim(), stock: isNaN(stock) ? null : stock };
    }
    return { name: trimmed, stock: null };
  }).filter(v => Boolean(v.name)) : [];

  const sizes = getVariants(product.size);
  const lofts = getVariants(product.loft);
  const styles = getVariants(product.style);
  
  // Custom dynamic attributes (e.g. Color)
  const dynamicVariants = (product as any).attributes?.map((attr: any) => ({
    key: attr.key,
    values: getVariants(attr.value)
  }))?.filter((attr: any) => attr.values.length > 0) || [];

  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});

  const handleSelectVariant = (key: string, value: string) => {
    setSelectedVariants(prev => ({ ...prev, [key]: value }));
  };

  const requiredVariants: string[] = [];
  if (sizes.length > 1) requiredVariants.push('Size');
  if (lofts.length > 1) requiredVariants.push('Loft');
  if (styles.length > 1) requiredVariants.push('Style');
  dynamicVariants.forEach((attr: any) => {
    if (attr.values.length > 1) requiredVariants.push(attr.key);
  });

  const allSelected = requiredVariants.every(key => selectedVariants[key]);

  // Set default selection if only one option exists
  React.useEffect(() => {
    const defaults: Record<string, string> = {};
    if (sizes.length === 1 && sizes[0].stock !== 0) defaults['Size'] = sizes[0].name;
    if (lofts.length === 1 && lofts[0].stock !== 0) defaults['Loft'] = lofts[0].name;
    if (styles.length === 1 && styles[0].stock !== 0) defaults['Style'] = styles[0].name;
    dynamicVariants.forEach((attr: any) => {
      if (attr.values.length === 1 && attr.values[0].stock !== 0) defaults[attr.key] = attr.values[0].name;
    });
    if (Object.keys(defaults).length > 0) {
      setSelectedVariants(prev => ({ ...prev, ...defaults }));
    }
  }, [product.id]);

  const [mainImage, setMainImage] = useState(product.image);

  const handleDecrease = () => setQuantity(prev => Math.max(1, prev - 1));
  const handleIncrease = () => setQuantity(prev => prev + 1);

  const sortedCurrent = Object.entries(selectedVariants).sort().toString();
  const currentCartItemId = `${product.id}-${sortedCurrent}`;
  const isInCart = cartItems.some(item => item.cartItemId === currentCartItemId);

  const handleAddToCart = () => {
    setIsAdding(true);
    setTimeout(() => {
      addToCart(product, quantity, selectedVariants);
      setIsAdding(false);
    }, 400);
  };

  const handleRemoveFromCart = () => {
    removeFromCart(currentCartItemId);
  };

  const handleAddToWishlist = async () => {
    if (!session) {
      alert("Please login to add to wishlist!");
      return;
    }
    try {
      const res = await fetch('/api/user/wishlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: product.id }),
      });
      if (res.ok) {
        alert("Added to wishlist!");
      } else {
        alert("Could not update wishlist. Local DB may be blocked.");
      }
    } catch (e) {
      alert("Error adding to wishlist");
    }
  };

  // Helper to parse price string (e.g. "₹19,990.00" -> 19990.00)
  const parsePrice = (priceStr: string) => {
    return parseFloat(priceStr.replace(/[^0-9.-]+/g,""));
  };

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const displayedPrice = formatPrice(parsePrice(product.price) * quantity);

  return (
    <div className="bg-white min-h-screen">
      
      {/* Breadcrumbs */}
      <div className="bg-[#fbf9f9] border-b border-[#c1c9bf] py-[16px]">
        <div className="max-w-[1280px] mx-auto px-[64px]">
          <div className="flex items-center gap-[8px] text-[14px] text-[#717b71] font-['Hanken_Grotesk']">
            <Link href="/" className="hover:text-[#1b1c1c] transition-colors">Home</Link>
            <span>/</span>
            <Link href={`/category/${product.category.toLowerCase()}`} className="hover:text-[#1b1c1c] transition-colors capitalize">
              {product.category}
            </Link>
            <span>/</span>
            <span className="text-[#1b1c1c] font-medium">{product.name}</span>
          </div>
        </div>
      </div>

      <div className="max-w-[1280px] mx-auto px-[64px] py-[48px]">
        
        {/* Main Product Info (Image + Details) */}
        <div className="flex flex-col md:flex-row gap-[64px] mb-[64px]">
          
          {/* Left: Product Image Area */}
          <div className="flex-1">
            <div className="w-full aspect-[4/3] bg-[#fbf9f9] border border-[#c1c9bf] rounded-[16px] flex items-center justify-center p-[48px] relative">
              <button 
                onClick={(e) => {
                  e.preventDefault();
                  handleAddToWishlist();
                }}
                className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-400 hover:text-rose-500 hover:scale-110 hover:bg-white transition-all shadow-sm z-10 border border-gray-200"
              >
                <Heart className="w-5 h-5" />
              </button>
              <div className="w-full h-full bg-zinc-100 flex items-center justify-center rounded-[8px] overflow-hidden mix-blend-multiply relative">
                {mainImage && mainImage !== 'placeholder.png' ? (
                  <img src={mainImage.startsWith('http') ? mainImage : `/images/${mainImage}`} alt={product.name} className="w-full h-full object-contain" />
                ) : (
                  <span className="text-[#717b71] font-serif italic text-center px-4">Product Image</span>
                )}
              </div>
            </div>
            
            {/* Thumbnails */}
            {product.images && product.images.length > 1 && (
              <div className="flex gap-[16px] mt-[16px] overflow-x-auto pb-2">
                {product.images.map((img, idx) => (
                  <div 
                    key={idx} 
                    onClick={() => setMainImage(img)}
                    className={`w-[80px] h-[80px] rounded-[8px] border shrink-0 ${mainImage === img ? 'border-[#006747]' : 'border-[#c1c9bf]'} bg-[#fbf9f9] flex items-center justify-center cursor-pointer hover:border-[#006747] transition-colors p-[8px]`}
                  >
                    <img src={img.startsWith('http') ? img : `/images/${img}`} alt="" className="w-full h-full object-contain mix-blend-multiply" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right: Product Details & Actions */}
          <div className="flex-1 flex flex-col pt-[24px]">
            <h1 className="font-['EB_Garamond'] font-bold text-[40px] text-[#1b1c1c] leading-[1.1] mb-[8px]">
              {product.name}
            </h1>
            <span className="font-['Hanken_Grotesk'] text-[#717b71] text-[16px] uppercase tracking-[1.6px] mb-[16px] block">
              {product.brand}
            </span>

            <div className="font-['Hanken_Grotesk'] font-semibold text-[32px] text-[#1b1c1c] mb-[32px]">
              {displayedPrice}
            </div>

            <p className="font-['Hanken_Grotesk'] text-[#4c4546] text-[16px] leading-[1.6] mb-[32px]">
              {product.description || "Designed to provide customers with everything they need to know before making a purchase. Precision engineering for every shot."}
            </p>

            <hr className="border-[#c1c9bf] mb-[32px]" />

            {/* Variant Selectors */}
            <div className="flex flex-col gap-6 mb-8">
              {sizes.length > 1 && (
                <div>
                  <span className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-3 block">Size</span>
                  <div className="flex flex-wrap gap-3">
                    {sizes.map(s => {
                      const outOfStock = s.stock === 0;
                      return (
                        <button 
                          key={s.name}
                          disabled={outOfStock}
                          onClick={() => handleSelectVariant('Size', s.name)}
                          className={`px-6 py-3 rounded-xl border font-semibold text-sm transition-all relative ${
                            outOfStock ? 'opacity-50 cursor-not-allowed bg-gray-50 text-gray-400 border-gray-200' :
                            selectedVariants['Size'] === s.name ? 'bg-black text-white border-black' : 'bg-white text-gray-700 border-gray-200 hover:border-black'
                          }`}
                        >
                          {s.name}
                          {outOfStock && <span className="absolute -top-2 -right-2 bg-red-100 text-red-600 text-[10px] px-1.5 py-0.5 rounded font-bold">Sold Out</span>}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {lofts.length > 1 && (
                <div>
                  <span className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-3 block">Loft</span>
                  <div className="flex flex-wrap gap-3">
                    {lofts.map(l => {
                      const outOfStock = l.stock === 0;
                      return (
                        <button 
                          key={l.name}
                          disabled={outOfStock}
                          onClick={() => handleSelectVariant('Loft', l.name)}
                          className={`px-6 py-3 rounded-xl border font-semibold text-sm transition-all relative ${
                            outOfStock ? 'opacity-50 cursor-not-allowed bg-gray-50 text-gray-400 border-gray-200' :
                            selectedVariants['Loft'] === l.name ? 'bg-black text-white border-black' : 'bg-white text-gray-700 border-gray-200 hover:border-black'
                          }`}
                        >
                          {l.name}
                          {outOfStock && <span className="absolute -top-2 -right-2 bg-red-100 text-red-600 text-[10px] px-1.5 py-0.5 rounded font-bold">Sold Out</span>}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {styles.length > 1 && (
                <div>
                  <span className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-3 block">Style</span>
                  <div className="flex flex-wrap gap-3">
                    {styles.map(s => {
                      const outOfStock = s.stock === 0;
                      return (
                        <button 
                          key={s.name}
                          disabled={outOfStock}
                          onClick={() => handleSelectVariant('Style', s.name)}
                          className={`px-6 py-3 rounded-xl border font-semibold text-sm transition-all relative ${
                            outOfStock ? 'opacity-50 cursor-not-allowed bg-gray-50 text-gray-400 border-gray-200' :
                            selectedVariants['Style'] === s.name ? 'bg-black text-white border-black' : 'bg-white text-gray-700 border-gray-200 hover:border-black'
                          }`}
                        >
                          {s.name}
                          {outOfStock && <span className="absolute -top-2 -right-2 bg-red-100 text-red-600 text-[10px] px-1.5 py-0.5 rounded font-bold">Sold Out</span>}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {dynamicVariants.map((attr: any) => attr.values.length > 1 ? (
                <div key={attr.key}>
                  <span className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-3 block">{attr.key}</span>
                  <div className="flex flex-wrap gap-3">
                    {attr.values.map((v: { name: string, stock: number | null }) => {
                      const outOfStock = v.stock === 0;
                      return (
                        <button 
                          key={v.name}
                          disabled={outOfStock}
                          onClick={() => handleSelectVariant(attr.key, v.name)}
                          className={`px-6 py-3 rounded-xl border font-semibold text-sm transition-all relative ${
                            outOfStock ? 'opacity-50 cursor-not-allowed bg-gray-50 text-gray-400 border-gray-200' :
                            selectedVariants[attr.key] === v.name ? 'bg-black text-white border-black' : 'bg-white text-gray-700 border-gray-200 hover:border-black'
                          }`}
                        >
                          {v.name}
                          {outOfStock && <span className="absolute -top-2 -right-2 bg-red-100 text-red-600 text-[10px] px-1.5 py-0.5 rounded font-bold">Sold Out</span>}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ) : null)}
            </div>

            {/* Add to Cart Actions */}
            <div className="flex items-center gap-[16px]">
              
              {/* Quantity Selector */}
              <div className="flex items-center border border-[#c1c9bf] rounded-[8px] h-[56px] w-[128px] overflow-hidden bg-white">
                <button 
                  onClick={handleDecrease}
                  className="w-[40px] h-full flex items-center justify-center text-[#1b1c1c] hover:bg-[#f4f6f4] transition-colors"
                >
                  <svg width="14" height="2" viewBox="0 0 14 2" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M0 0H14V2H0V0Z"/></svg>
                </button>
                <div className="flex-1 h-full flex items-center justify-center font-['Hanken_Grotesk'] font-semibold text-[18px] text-[#1b1c1c] border-x border-[#c1c9bf]">
                  {quantity}
                </div>
                <button 
                  onClick={handleIncrease}
                  className="w-[40px] h-full flex items-center justify-center text-[#1b1c1c] hover:bg-[#f4f6f4] transition-colors"
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M6 0H8V14H6V0ZM0 6H14V8H0V6Z"/></svg>
                </button>
              </div>

              {/* Add / Remove from Cart Button */}
              {isInCart ? (
                <button 
                  onClick={handleRemoveFromCart}
                  className="flex-1 h-[56px] bg-red-50 text-red-600 rounded-[8px] font-['Hanken_Grotesk'] font-medium text-[16px] flex items-center justify-center gap-[12px] hover:bg-red-100 transition-colors shadow-sm"
                >
                  <Trash2 className="w-5 h-5" />
                  <span>Remove from Cart</span>
                </button>
              ) : (
                <button 
                  onClick={handleAddToCart}
                  disabled={isAdding || !allSelected}
                  className="flex-1 h-[56px] bg-[#1b1c1c] text-white rounded-[8px] font-['Hanken_Grotesk'] font-medium text-[16px] flex items-center justify-center gap-[12px] hover:bg-[#333] transition-colors shadow-sm disabled:opacity-75 disabled:cursor-not-allowed"
                >
                  {isAdding ? (
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  ) : (
                    <>
                      <ShoppingCart className="w-5 h-5" />
                      <span>{!allSelected ? 'Select Options' : 'Add to Cart'}</span>
                    </>
                  )}
                </button>
              )}
            </div>

          </div>
        </div>

      </div>

      {/* Product Features Section */}
      <div className="bg-[#f0eded] border-t border-[#c1c9bf] py-[64px]">
        <div className="max-w-[1280px] mx-auto px-[64px]">
          <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
            <h2 className="font-['EB_Garamond'] font-bold text-[32px] text-[#1b1c1c] mb-[16px]">
              Product Features
            </h2>
            <p className="font-['Hanken_Grotesk'] text-[#4c4546] text-[18px] leading-[1.6] mb-[32px]">
              Detailed product description explaining the features, materials, and benefits. Designed to provide customers with everything they need to know before making a purchase.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-[24px] w-full text-left mt-[32px]">
              <div className="bg-white p-[24px] rounded-[11px] shadow-sm">
                <h4 className="font-['EB_Garamond'] font-bold text-[20px] text-[#1b1c1c] mb-[8px]">Premium Materials</h4>
                <p className="font-['Hanken_Grotesk'] text-[#717b71] text-[14px]">Constructed with high-grade components ensuring durability and performance round after round.</p>
              </div>
              <div className="bg-white p-[24px] rounded-[11px] shadow-sm">
                <h4 className="font-['EB_Garamond'] font-bold text-[20px] text-[#1b1c1c] mb-[8px]">Precision Engineered</h4>
                <p className="font-['Hanken_Grotesk'] text-[#717b71] text-[14px]">Advanced technology integrated to provide optimal feel, distance, and control.</p>
              </div>
              <div className="bg-white p-[24px] rounded-[11px] shadow-sm">
                <h4 className="font-['EB_Garamond'] font-bold text-[20px] text-[#1b1c1c] mb-[8px]">Tour Proven</h4>
                <p className="font-['Hanken_Grotesk'] text-[#717b71] text-[14px]">Tested and trusted by professionals worldwide to deliver consistent results under pressure.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
