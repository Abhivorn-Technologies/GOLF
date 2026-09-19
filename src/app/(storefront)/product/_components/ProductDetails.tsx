"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ProductType } from '@/data/products';
import { useCart } from '@/context/CartContext';
import { Trash2, Heart, Check, ShoppingCart } from 'lucide-react';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';

import ProductCard from '@/components/ProductCard';
import WishlistButton from '@/components/WishlistButton';

function resolveImgSrc(src?: string) {
  if (!src || typeof src !== 'string' || src.trim() === '' || src === 'placeholder.png') {
    return '/images/golf.png';
  }
  const clean = src.trim();
  if (clean.startsWith('http://') || clean.startsWith('https://') || clean.startsWith('data:') || clean.startsWith('/')) {
    return clean;
  }
  return `/images/${clean}`;
}

interface ProductDetailsProps {
  product: ProductType;
  relatedProducts?: any[];
}

export default function ProductDetails({ product, relatedProducts = [] }: ProductDetailsProps) {
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const { cartItems, addToCart, buyNow, removeFromCart } = useCart();
  const { data: session } = useSession();
  const router = useRouter();

  const getVariants = (val?: string) => val ? val.split(',').map(s => {
    const trimmed = s.trim();
    if (trimmed.includes(':')) {
      const [name, stockStr] = trimmed.split(':');
      const stock = parseInt(stockStr.trim());
      return { name: name.trim(), stock: isNaN(stock) ? null : stock };
    }
    return { name: trimmed, stock: null };
  }).filter(v => Boolean(v.name)) : [];

  const hasVariants = product.variants && product.variants.length > 0;
  
  // NEW VARIANT LOGIC
  const uniqueColors = hasVariants ? Array.from(new Set(product.variants!.filter(v => v.color).map(v => v.color))) : [];
  const uniqueSizes = hasVariants ? Array.from(new Set(product.variants!.filter(v => v.size).map(v => v.size))) : [];

  const [selectedColor, setSelectedColor] = useState<string>(uniqueColors[0] || '');
  const [selectedSize, setSelectedSize] = useState<string>('');

  // Find matching variant based on selections
  const matchingVariant = hasVariants ? product.variants!.find(v => 
    (selectedColor ? v.color === selectedColor : true) && 
    (selectedSize ? v.size === selectedSize : true)
  ) : null;

  // OLD VARIANT LOGIC (Fallback)
  const sizes = getVariants(product.size);
  const lofts = getVariants(product.loft);
  const styles = getVariants(product.style);
  
  const dynamicVariants = (product as any).attributes?.map((attr: any) => ({
    key: attr.key,
    values: getVariants(attr.value)
  }))?.filter((attr: any) => attr.values.length > 0) || [];

  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});

  const handleSelectVariant = (key: string, value: string) => {
    setSelectedVariants(prev => ({ ...prev, [key]: value }));
  };

  const requiredVariants: string[] = [];
  if (!hasVariants) {
    if (sizes.length > 1) requiredVariants.push('Size');
    if (lofts.length > 1) requiredVariants.push('Loft');
    if (styles.length > 1) requiredVariants.push('Style');
    dynamicVariants.forEach((attr: any) => {
      if (attr.values.length > 1) requiredVariants.push(attr.key);
    });
  }

  const allSelected = hasVariants 
    ? ((uniqueColors.length > 0 ? !!selectedColor : true) && (uniqueSizes.length > 0 ? !!selectedSize : true))
    : requiredVariants.every(key => selectedVariants[key]);

  React.useEffect(() => {
    if (hasVariants) {
      if (uniqueColors.length > 0 && !selectedColor) {
        const firstAvailableColor = uniqueColors.find(c => product.variants!.some(v => v.color === c && v.stockCount > 0)) || uniqueColors[0];
        if (firstAvailableColor) setSelectedColor(firstAvailableColor);
      }
      if (uniqueSizes.length > 0 && !selectedSize) {
        const firstAvailableSize = uniqueSizes.find(s => product.variants!.some(v => (selectedColor ? v.color === selectedColor : true) && v.size === s && v.stockCount > 0)) || uniqueSizes[0];
        if (firstAvailableSize) setSelectedSize(firstAvailableSize);
      }
    } else {
      const defaults: Record<string, string> = {};
      if (sizes.length > 0) {
        const available = sizes.find(s => s.stock !== 0) || sizes[0];
        if (available) defaults['Size'] = available.name;
      }
      if (lofts.length > 0) {
        const available = lofts.find(l => l.stock !== 0) || lofts[0];
        if (available) defaults['Loft'] = available.name;
      }
      if (styles.length > 0) {
        const available = styles.find(s => s.stock !== 0) || styles[0];
        if (available) defaults['Style'] = available.name;
      }
      dynamicVariants.forEach((attr: any) => {
        if (attr.values.length > 0) {
          const available = attr.values.find((v: any) => v.stock !== 0) || attr.values[0];
          if (available) defaults[attr.key] = available.name;
        }
      });
      if (Object.keys(defaults).length > 0) {
        setSelectedVariants(prev => ({ ...defaults, ...prev }));
      }
    }
  }, [product.id, hasVariants]);

  // Image swapper for variants
  React.useEffect(() => {
    if (hasVariants && selectedColor) {
      const firstVariantWithColor = product.variants!.find(v => v.color === selectedColor && v.images && v.images.length > 0);
      if (firstVariantWithColor && firstVariantWithColor.images![0]) {
        setMainImage(firstVariantWithColor.images![0]);
      }
    }
  }, [selectedColor, product.variants, hasVariants]);

  // Compute thumbnail gallery images unconditionally
  const displayImages = React.useMemo(() => {
    const images = new Set<string>();
    
    // Always include global product images (if any)
    if (product.images) {
      product.images.forEach(img => images.add(img));
    }
    
    // Always include ALL variant images so they act as a unified gallery
    if (hasVariants) {
      product.variants!.forEach(v => {
        if (v.images) {
          v.images.forEach(img => images.add(img));
        }
      });
    }
    
    return Array.from(images);
  }, [product.images, product.variants, hasVariants]);

  const [mainImage, setMainImage] = useState(product.image);

  const handleDecrease = () => setQuantity(prev => Math.max(1, prev - 1));
  const handleIncrease = () => setQuantity(prev => prev + 1);

  const sortedCurrent = hasVariants 
    ? (matchingVariant?.id || 'unselected') 
    : Object.entries(selectedVariants).sort().toString();
  
  const currentCartItemId = `${product.id}-${sortedCurrent}`;
  const isInCart = cartItems.some(item => item.cartItemId === currentCartItemId);

  const finalCartVariants = hasVariants 
    ? { 
        ...(selectedColor ? { Color: selectedColor } : {}), 
        ...(selectedSize ? { Size: selectedSize } : {}),
        variantId: matchingVariant?.id || ''
      }
    : selectedVariants;

  const handleAddToCart = () => {
    if (!allSelected) {
      const missingKey = hasVariants 
        ? (!selectedColor ? 'Color' : (!selectedSize ? 'Size' : 'option'))
        : (requiredVariants.find(key => !selectedVariants[key]) || 'option');
      toast.error(`Please select a ${missingKey} option first!`);
      return;
    }

    setIsAdding(true);
    setTimeout(() => {
      addToCart(product, quantity, finalCartVariants);
      setIsAdding(false);
      toast.success('Added to cart!');
    }, 400);
  };

  const handleBuyNow = () => {
    if (!allSelected) {
      const missingKey = hasVariants 
        ? (!selectedColor ? 'Color' : (!selectedSize ? 'Size' : 'option'))
        : (requiredVariants.find(key => !selectedVariants[key]) || 'option');
      toast.error(`Please select a ${missingKey} option first!`);
      return;
    }

    buyNow(product, quantity, finalCartVariants);
    router.push('/checkout/shipping');
  };

  const handleRemoveFromCart = () => {
    removeFromCart(currentCartItemId);
  };

  const handleAddToWishlist = async () => {
    if (!session) {
      toast.error("Please login to add to wishlist!");
      return;
    }
    try {
      const res = await fetch('/api/user/wishlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: product.id }),
      });
      if (res.ok) {
        toast.success("Added to wishlist!");
      } else {
        toast.error("Could not update wishlist. Local DB may be blocked.");
      }
    } catch (e) {
      toast.error("Error adding to wishlist");
    }
  };

  // Helper to parse price string or number (e.g. "₹19,990.00" -> 19990.00 or 19990 -> 19990)
  const parsePrice = (priceStr: string | number) => {
    if (typeof priceStr === 'number') return priceStr;
    if (typeof priceStr === 'string') {
      const parsed = parseFloat(priceStr.replace(/[^0-9.-]+/g, ""));
      return isNaN(parsed) ? 0 : parsed;
    }
    return 0;
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
              <WishlistButton productId={product.id || (product as any)._id} />
              <div className="w-full h-full bg-zinc-100 flex items-center justify-center rounded-[8px] overflow-hidden mix-blend-multiply relative">
                <img 
                  src={resolveImgSrc(mainImage)} 
                  alt={product.name} 
                  className="w-full h-full object-contain" 
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    if (!target.dataset.fallback) {
                      target.dataset.fallback = 'true';
                      target.src = '/images/golf.png';
                    }
                  }}
                />
              </div>
            </div>
            
            {/* Thumbnails */}
            {displayImages.length > 1 && (
              <div className="flex gap-[16px] mt-[16px] overflow-x-auto pb-2">
                {displayImages.map((img, idx) => (
                  <div 
                    key={idx} 
                    onClick={() => {
                      setMainImage(img);
                      if (hasVariants) {
                        const matchingVariant = product.variants!.find(v => v.images && v.images.includes(img));
                        if (matchingVariant && matchingVariant.color) {
                          setSelectedColor(matchingVariant.color);
                          // Reset size if the current size is not available in the new color
                          const isSizeValidForNewColor = product.variants!.some(v => v.color === matchingVariant.color && v.size === selectedSize && v.stockCount > 0);
                          if (!isSizeValidForNewColor) {
                            setSelectedSize('');
                          }
                        }
                      }
                    }}
                    className={`w-[80px] h-[80px] rounded-[8px] border shrink-0 ${mainImage === img ? 'border-[#006747]' : 'border-[#c1c9bf]'} bg-[#fbf9f9] flex items-center justify-center cursor-pointer hover:border-[#006747] transition-colors p-[8px]`}
                  >
                    <img 
                      src={resolveImgSrc(img)} 
                      alt="" 
                      className="w-full h-full object-contain mix-blend-multiply" 
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        if (!target.dataset.fallback) {
                          target.dataset.fallback = 'true';
                          target.src = '/images/golf.png';
                        }
                      }}
                    />
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

            <p className="font-['Hanken_Grotesk'] text-[#4c4546] text-[16px] leading-[1.6] mb-[32px] whitespace-pre-wrap">
              {product.description || "Designed to provide customers with everything they need to know before making a purchase. Precision engineering for every shot."}
            </p>

            {product.features && product.features.length > 0 && (
              <div className="mb-[32px]">
                <h4 className="font-['Hanken_Grotesk'] font-bold text-[16px] text-[#1b1c1c] uppercase tracking-wider mb-3">Key Features</h4>
                <ul className="list-disc pl-5 space-y-2">
                  {product.features.map((feature, idx) => (
                    <li key={idx} className="font-['Hanken_Grotesk'] text-[#4c4546] text-[15px]">
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <hr className="border-[#c1c9bf] mb-[32px]" />

            {/* Variant Selectors */}
            <div className="flex flex-col gap-6 mb-8">
              
              {/* NEW VARIANT RENDERER */}
              {hasVariants && (
                <>
                  {uniqueColors.length > 0 && (
                    <div>
                      <span className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-3 block">Color: {selectedColor}</span>
                      <div className="flex flex-wrap gap-3">
                        {uniqueColors.map(color => {
                          const variantRef = product.variants!.find(v => v.color === color);
                          return (
                            <button 
                              key={color}
                              onClick={() => {
                                setSelectedColor(color);
                                setSelectedSize(''); // Reset size on color change to ensure validity
                              }}
                              className={`w-10 h-10 rounded-full border-2 transition-all p-0.5 ${selectedColor === color ? 'border-black' : 'border-transparent hover:border-gray-300'}`}
                            >
                              <div className="w-full h-full rounded-full border border-black/10" style={{ backgroundColor: variantRef?.colorCode || '#ccc' }}></div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {uniqueSizes.length > 0 && (
                    <div>
                      <span className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-3 block">Size</span>
                      <div className="flex flex-wrap gap-3">
                        {uniqueSizes.map(size => {
                          // Find the variant for the currently selected color and this size
                          const variant = product.variants!.find(v => 
                            (selectedColor ? v.color === selectedColor : true) && 
                            v.size === size
                          );
                          const outOfStock = !variant || variant.stockCount === 0;

                          return (
                            <button 
                              key={size}
                              disabled={outOfStock}
                              onClick={() => setSelectedSize(size)}
                              className={`px-6 py-3 rounded-xl border font-semibold text-sm transition-all relative ${
                                outOfStock ? 'opacity-50 cursor-not-allowed bg-gray-50 text-gray-400 border-gray-200' :
                                selectedSize === size ? 'bg-black text-white border-black' : 'bg-white text-gray-700 border-gray-200 hover:border-black'
                              }`}
                            >
                              {size}
                              {outOfStock && <span className="absolute -top-2 -right-2 bg-red-100 text-red-600 text-[10px] px-1.5 py-0.5 rounded font-bold">Out</span>}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* OLD VARIANT RENDERER (Fallback) */}
              {!hasVariants && sizes.length > 1 && (
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

              {!hasVariants && lofts.length > 1 && (
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

              {!hasVariants && styles.length > 1 && (
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

              {!hasVariants && dynamicVariants.map((attr: any) => attr.values.length > 1 ? (
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
                  <span>Remove</span>
                </button>
              ) : (
                <button 
                  onClick={handleAddToCart}
                  disabled={isAdding}
                  className="flex-1 h-[56px] bg-[#1b1c1c] text-white rounded-[8px] font-['Hanken_Grotesk'] font-medium text-[16px] flex items-center justify-center gap-[12px] hover:bg-[#333] transition-colors shadow-sm disabled:opacity-75"
                >
                  {isAdding ? (
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  ) : (
                    <>
                      <ShoppingCart className="w-5 h-5" />
                      <span>Add to Cart</span>
                    </>
                  )}
                </button>
              )}

              {/* Buy Now Button */}
              <button 
                onClick={handleBuyNow}
                disabled={isAdding}
                className="flex-1 h-[56px] bg-green-700 text-white rounded-[8px] font-['Hanken_Grotesk'] font-bold text-[16px] flex items-center justify-center hover:bg-green-800 transition-colors shadow-sm disabled:opacity-75"
              >
                Buy Now
              </button>
            </div>

          </div>
        </div>

      </div>



      {/* You Might Also Like */}
      {relatedProducts && relatedProducts.length > 0 && (
        <div className="max-w-[1280px] mx-auto px-[64px] py-[64px]">
          <div className="flex flex-col gap-2 mb-8">
            <h2 className="font-['Liberation_Serif'] text-3xl font-bold text-black">You Might Also Like</h2>
            <div className="w-12 h-[2px] bg-black"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {relatedProducts.map(rp => (
              <ProductCard key={rp.id} product={rp} />
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
