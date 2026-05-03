'use client';

import { useMemo } from 'react';
import { TbStarFilled } from 'react-icons/tb';
import { useFetch } from '@/hooks/useFetch';

type FeaturedProduct = {
  id: string | number;
  name: string;
  price: number;
  originalPrice: number;
  image: string;
};

type ApiProduct = {
  _id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image?: string;
  images?: string[];
};

export default function FeaturedProducts() {
  const { data, loading, error } = useFetch<ApiProduct[]>('/api/products?featured=true');

  const productsToRender = useMemo(() => {
    if (!data) return [];
    return data.slice(0, 6).map(product => ({
      id: product._id,
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice || Math.round(product.price * 1.2),
      image:
        product.image ||
        product.images?.[0] ||
        'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&q=80',
    }));
  }, [data]);

  return (
    <div className="py-6">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-4">
          <h6 className="font-bold text-lg">Featured Products</h6>
          <a href="/featured-products" className="btn btn-sm btn-ghost">View all</a>
        </div>
        
        <div className="grid grid-cols-3 md:grid-cols-6 gap-2 sm:gap-4">
          {productsToRender.map(product => (
            <div key={product.id} className="card bg-base-100 shadow-sm border border-base-200 p-2 sm:p-3 relative group">
              <span className="absolute top-2 left-2 z-10 text-warning bg-warning/10 p-1 rounded-full"><TbStarFilled className="w-3 h-3" /></span>
              <figure className="h-20 sm:h-28 mb-2 rounded overflow-hidden">
                <img src={product.image} alt={product.name} className="h-full w-full object-cover group-hover:scale-105 transition-transform" />
              </figure>
              <h6 className="font-bold text-xs sm:text-sm truncate text-center mb-1">{product.name}</h6>
              <p className="text-primary font-bold text-xs sm:text-sm text-center">
                ${product.price} <span className="text-base-content/50 line-through text-[10px] sm:text-xs ml-1 block sm:inline">${product.originalPrice}</span>
              </p>
            </div>
          ))}
        </div>
        {loading ? <p className="text-xs text-base-content/70 mt-3">Loading featured products...</p> : null}
        {!loading && error ? (
          <p className="text-xs text-error mt-3">Could not load featured products.</p>
        ) : null}
        {!loading && !error && productsToRender.length === 0 ? (
          <p className="text-xs text-base-content/70 mt-3">No featured products yet.</p>
        ) : null}
      </div>
    </div>
  );
}
