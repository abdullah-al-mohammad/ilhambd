'use client';

import { useFetch } from '@/hooks/useFetch';
import Link from 'next/link';
import { useMemo } from 'react';
import { TbHeart, TbStarFilled } from 'react-icons/tb';

type ApiProduct = {
  _id: string;
  name: string;
  price: number;
  images?: string[];
  image?: string;
  rating: number;
  reviews: number;
};

export default function WeeklyBestSellers() {
  const { data, loading, error } = useFetch<ApiProduct[]>('/api/products?weekly=true');

  const productsToRender = useMemo(() => {
    if (!data) return [];
    return data.slice(0, 6).map(product => ({
      id: product._id,
      name: product.name,
      price: product.price,
      rating: product.rating ?? 4.5,
      reviews: product.reviews ?? 0,
      // originalPrice: product.originalPrice || Math.round(product.price * 1.2),
      image:
        product.image ||
        product.images?.[0] ||
        'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&q=80',
    }));
  }, [data]);

  return (
    <div className="py-6 bg-base-200/50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-4">
          <h6 className="font-bold text-lg">Weekly Best Sellers</h6>
          <Link href="/shop?weekly-selling=true" className="btn btn-sm btn-ghost">
            View all
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {productsToRender.map(product => (
            <Link
              key={product.id}
              href={`/shop/${product.id}`}
              className="card card-side bg-base-100 shadow-sm border border-base-200 items-center overflow-hidden hover:border-primary hover:shadow-md transition-all"
            >
              <div className="relative w-28 h-28 shrink-0 flex items-center justify-center bg-base-200/50 p-2">
                <img
                  src={product.image}
                  alt={product.name}
                  className="object-cover rounded-md max-h-full"
                />
                <button className="btn btn-circle btn-xs btn-ghost absolute top-1 right-1 z-10 text-base-content/50 hover:text-error hover:bg-error/10">
                  <TbHeart className="w-4 h-4" />
                </button>
              </div>
              <div className="card-body p-3 justify-center">
                <h6 className="font-bold text-sm leading-tight mb-1">{product.name}</h6>
                <p className="text-primary font-bold text-sm mb-1">${product.price}</p>
                <div className="flex items-center text-xs">
                  <TbStarFilled className="text-warning mr-1" />
                  <span className="font-bold">{product.rating}</span>
                  <span className="text-base-content/50 ml-1">({product.reviews} review)</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
        {loading ? (
          <p className="text-xs text-base-content/70 mt-3">Loading featured products...</p>
        ) : null}
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
