'use client';

import { useCart } from '@/app/context/CartContext';
import { useFetch } from '@/hooks/useFetch';
import Link from 'next/link';
import { useMemo } from 'react';
import { TbHeart, TbPlus, TbStarFilled } from 'react-icons/tb';

type TopProduct = {
  id: string | number;
  name: string;
  salePrice: number;
  originalPrice: number;
  rating: number;
  badge: string;
  badgeColor: string;
  image: string;
};

type ApiProduct = {
  _id: string;
  name: string;
  price: number;
  images?: string[];
};

export default function TopProducts() {
  const { data, loading, error } = useFetch<ApiProduct[]>('/api/products/best-selling');
  const { cart, addToCart } = useCart();

  const productsToRender = useMemo(() => {
    if (!data) return [];

    return data.slice(0, 6).map((product, index) => ({
      id: product._id,
      name: product.name,
      salePrice: Number(product.price) || 0,
      originalPrice: Math.round((Number(product.price) || 0) * 1.2),
      rating: 5,
      badge: index < 2 ? 'New' : 'Sale',
      badgeColor: index < 2 ? 'badge-success' : 'badge-warning',
      image:
        product.images?.[0] ||
        'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&q=80',
    }));
  }, [data]);

  const handleAddToCart = (product: TopProduct) => {
    addToCart({
      _id: String(product.id),
      name: product.name,
      price: product.salePrice,
      image: product.image,
      quantity: 1,
    });
  };

  return (
    <div className="py-6">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-4">
          <h6 className="font-bold text-lg">Top Products</h6>
          <Link href="/shop?filter=best-selling" className="btn btn-sm btn-ghost">
            View all
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3 lg:gap-4">
          {productsToRender.map(product => (
            <div key={product.id} className="card bg-base-100 shadow-sm border border-base-200">
              <div className="card-body p-3 relative group">
                <span
                  className={`badge ${product.badgeColor} badge-sm absolute top-3 left-3 z-10 font-bold`}
                >
                  {product.badge}
                </span>
                <button className="btn btn-circle btn-xs btn-ghost absolute top-2 right-2 z-10 text-base-content/50 hover:text-error hover:bg-error/10">
                  <TbHeart className="w-4 h-4" />
                </button>

                <Link href={`/shop/${product.id}`}>
                  <figure className="relative h-36 mb-2 overflow-hidden rounded-md">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                    />
                  </figure>
                </Link>

                <Link href={`/shop/${product.id}`}>
                  <h6 className="font-bold text-sm truncate hover:text-primary transition-colors">
                    {product.name}
                  </h6>
                </Link>
                <p className="text-primary font-bold text-sm">
                  ${product.salePrice}{' '}
                  <span className="text-base-content/50 line-through text-xs ml-1">
                    ${product.originalPrice}
                  </span>
                </p>

                <div className="flex text-warning text-xs mt-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <TbStarFilled
                      key={i}
                      className={i < product.rating ? 'text-warning' : 'text-base-300'}
                    />
                  ))}
                </div>

                <button
                  className={`btn btn-sm w-full gap-2 ${cart.some(c => c._id === String(product.id)) ? 'btn-outline border-primary text-primary' : 'btn-primary'}`}
                  onClick={() => handleAddToCart(product)}
                >
                  <TbPlus /> {cart.some(c => c._id === String(product.id)) ? 'In Cart' : 'Add'}
                </button>
              </div>
            </div>
          ))}
        </div>
        {loading ? <p className="text-xs text-base-content/70 mt-3">Loading products...</p> : null}
        {!loading && error ? (
          <p className="text-xs text-error mt-3">Could not load products from database.</p>
        ) : null}
        {!loading && !error && productsToRender.length === 0 ? (
          <p className="text-xs text-base-content/70 mt-3">No products found.</p>
        ) : null}
      </div>
    </div>
  );
}
