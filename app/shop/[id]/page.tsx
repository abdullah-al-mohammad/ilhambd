'use client';

import { useCart } from '@/app/context/CartContext';
import { useFetch } from '@/hooks/useFetch';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import { TbMinus, TbPlus, TbShoppingCart, TbStarFilled } from 'react-icons/tb';

type Product = {
  _id: string;
  name: string;
  description?: string;
  price: number;
  originalPrice?: number;
  discountPercent?: number;
  category?: string;
  subcategory?: string;
  stock?: number;
  images?: string[];
  image?: string;
  colors?: string[];
  sizes?: string[];
};

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: product, loading, error } = useFetch<Product>(`/api/products/${id}`);
  const { addToCart } = useCart();
  const [qty, setQty] = useState(1);
  const [activeImg, setActiveImg] = useState(0);
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');

  if (loading) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <span className="loading loading-spinner loading-lg text-primary" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-base-200 flex flex-col items-center justify-center gap-4">
        <div className="text-6xl">😕</div>
        <h2 className="text-2xl font-bold">Product not found</h2>
        <Link href="/shop" className="btn btn-primary">Back to Shop</Link>
      </div>
    );
  }

  const images =
    product.images && product.images.length > 0
      ? product.images
      : [
          product.image ||
            'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&q=80',
        ];

  const handleAddToCart = () => {
    if (product.colors && product.colors.length > 0 && !selectedColor) {
      setErrorMsg('Please select a color.');
      return;
    }
    if (product.sizes && product.sizes.length > 0 && !selectedSize) {
      setErrorMsg('Please select a size.');
      return;
    }
    
    setErrorMsg('');
    addToCart({
      _id: product._id,
      name: product.name,
      price: product.price,
      image: images[0],
      quantity: qty,
      selectedColor: selectedColor || undefined,
      selectedSize: selectedSize || undefined,
    });
  };

  const savings = product.originalPrice
    ? product.originalPrice - product.price
    : null;

  return (
    <div className="min-h-screen bg-base-200 py-10">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <div className="text-sm breadcrumbs mb-6">
          <ul>
            <li><Link href="/">Home</Link></li>
            <li><Link href="/shop">Shop</Link></li>
            {product.category && <li>{product.category}</li>}
            <li className="text-primary font-semibold">{product.name}</li>
          </ul>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* ── Image Gallery ── */}
          <div className="flex flex-col gap-3">
            <div className="bg-base-100 rounded-2xl overflow-hidden shadow-sm border border-base-200 aspect-square flex items-center justify-center">
              <img
                src={images[activeImg]}
                alt={product.name}
                className="object-contain w-full h-full max-h-[420px] transition-all duration-300"
              />
            </div>
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImg(i)}
                    className={`shrink-0 w-16 h-16 rounded-lg border-2 overflow-hidden transition-all ${
                      i === activeImg ? 'border-primary' : 'border-base-200 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt={`Thumb ${i + 1}`} className="object-cover w-full h-full" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── Product Info ── */}
          <div className="flex flex-col gap-4">
            {/* Category badge */}
            {product.category && (
              <div className="flex gap-2">
                <span className="badge badge-primary badge-outline">{product.category}</span>
                {product.subcategory && (
                  <span className="badge badge-ghost">{product.subcategory}</span>
                )}
              </div>
            )}

            <h1 className="text-3xl font-bold leading-tight">{product.name}</h1>

            {/* Rating */}
            <div className="flex items-center gap-2">
              <div className="flex text-warning">
                {[...Array(5)].map((_, i) => (
                  <TbStarFilled key={i} className="w-4 h-4" />
                ))}
              </div>
              <span className="text-sm text-base-content/60">(4.5) · 120 reviews</span>
            </div>

            {/* Price */}
            <div className="flex items-end gap-3">
              <span className="text-4xl font-bold text-primary">${product.price}</span>
              {product.originalPrice && (
                <span className="text-xl text-base-content/40 line-through">
                  ${product.originalPrice}
                </span>
              )}
              {savings && (
                <span className="badge badge-success text-white text-sm px-3 py-3">
                  Save ${savings}
                </span>
              )}
            </div>

            {/* Discount */}
            {product.discountPercent ? (
              <div className="badge badge-warning badge-lg">
                {product.discountPercent}% OFF
              </div>
            ) : null}

            {/* Description */}
            {product.description && (
              <p className="text-base-content/70 leading-relaxed">{product.description}</p>
            )}

            {/* Stock */}
            {product.stock !== undefined && (
              <div className="flex items-center gap-2 text-sm">
                <span
                  className={`badge ${
                    product.stock > 0 ? 'badge-success' : 'badge-error'
                  }`}
                >
                  {product.stock > 0 ? `In Stock (${product.stock})` : 'Out of Stock'}
                </span>
              </div>
            )}

            <div className="divider" />

            {/* Variations: Colors & Sizes */}
            {((product.colors && product.colors.length > 0) || (product.sizes && product.sizes.length > 0)) && (
              <div className="flex flex-col gap-4">
                {product.colors && product.colors.length > 0 && (
                  <div>
                    <span className="font-semibold text-sm mb-2 block">Color</span>
                    <div className="flex flex-wrap gap-2">
                      {product.colors.map(color => (
                        <button
                          key={color}
                          onClick={() => { setSelectedColor(color); setErrorMsg(''); }}
                          className={`btn btn-sm ${selectedColor === color ? 'btn-primary' : 'btn-outline'}`}
                        >
                          {color}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                
                {product.sizes && product.sizes.length > 0 && (
                  <div>
                    <span className="font-semibold text-sm mb-2 block">Size</span>
                    <div className="flex flex-wrap gap-2">
                      {product.sizes.map(size => (
                        <button
                          key={size}
                          onClick={() => { setSelectedSize(size); setErrorMsg(''); }}
                          className={`btn btn-sm ${selectedSize === size ? 'btn-primary' : 'btn-outline'}`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {errorMsg && <p className="text-error text-sm">{errorMsg}</p>}

            {/* Qty + Add to Cart */}
            <div className="flex items-center gap-3 flex-wrap">
              {/* Quantity selector */}
              <div className="flex items-center border border-base-300 rounded-full overflow-hidden">
                <button
                  className="btn btn-ghost btn-sm rounded-none px-3"
                  onClick={() => setQty(q => Math.max(1, q - 1))}
                >
                  <TbMinus />
                </button>
                <span className="px-4 font-bold text-lg">{qty}</span>
                <button
                  className="btn btn-ghost btn-sm rounded-none px-3"
                  onClick={() => setQty(q => q + 1)}
                >
                  <TbPlus />
                </button>
              </div>

              <button
                className="btn btn-primary rounded-full flex-1 gap-2"
                onClick={handleAddToCart}
                disabled={product.stock === 0}
              >
                <TbShoppingCart className="w-5 h-5" />
                Add to Cart
              </button>
            </div>

            <Link href="/checkout" className="btn btn-outline btn-block rounded-full">
              Buy Now
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
