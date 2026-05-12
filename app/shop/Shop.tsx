'use client';

import { useCart } from '@/app/context/CartContext';
import { useFetch } from '@/hooks/useFetch';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useMemo } from 'react';
import { TbHeart, TbPlus, TbStarFilled } from 'react-icons/tb';

type ApiProduct = {
  _id: string;
  name: string;
  price: number;
  image?: string;
  images?: string[];
  category: string;
};

export default function ShopPage() {
  const searchParams = useSearchParams();
  const filter = searchParams.get('filter');
  // const { data, loading, error } = useFetch<ApiProduct[]>('/api/products');
  // const url = filter === 'best-selling' ? '/api/products/best-selling' : '/api/products';
  const url =
    filter === 'best-selling'
      ? '/api/products/best-selling'
      : filter === 'weekly-selling'
        ? '/api/products?weekly=true'
        : '/api/products';

  const { data, loading, error } = useFetch<ApiProduct[]>(url);
  const { addToCart } = useCart();
  // const searchParams = useSearchParams();
  const searchQuery = searchParams.get('q')?.toLowerCase().trim() ?? '';

  const productsToRender = useMemo(() => {
    if (!data) return [];

    const mapped = data.map(product => {
      // Handle the case where the API returns best-selling data format
      const productName = product.name || (product as any).productName || 'Unknown Product';
      const productPrice = product.price || 0;

      return {
        id: product._id,
        name: productName,
        salePrice: productPrice,
        originalPrice: Math.round(productPrice * 1.2),
        rating: 5,
        badge: 'Sale',
        badgeColor: 'badge-warning',
        image:
          product.image ||
          product.images?.[0] ||
          'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&q=80',
      };
    });

    if (!searchQuery) return mapped;
    return mapped.filter(p => p.name.toLowerCase().includes(searchQuery));
  }, [data, searchQuery]);

  const handleAddToCart = (product: any) => {
    addToCart({
      _id: String(product.id),
      name: product.name,
      price: product.salePrice,
      image: product.image,
      quantity: 1,
    });
  };

  return (
    <div className="min-h-screen bg-base-200 py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
          <div>
            <div className="text-sm breadcrumbs mb-2">
              <ul>
                <li>
                  <Link href="/">Home</Link>
                </li>
                <li className="text-primary font-bold">Shop</li>
              </ul>
            </div>
            <h1 className="text-3xl font-bold">
              {searchQuery ? (
                <>
                  Results for
                  <span className="text-primary">&ldquo;{searchParams.get('q')}&rdquo;</span>
                </>
              ) : (
                'All Products'
              )}
            </h1>
          </div>

          <div className="flex gap-2">
            <select className="select select-bordered select-sm w-full max-w-xs">
              <option disabled selected>
                Sort by
              </option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
              <option>Newest Arrivals</option>
            </select>
          </div>
        </div>

        {loading && (
          <div className="flex justify-center items-center py-20">
            <span className="loading loading-spinner loading-lg text-primary"></span>
          </div>
        )}

        {!loading && error && (
          <div className="alert alert-error">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="stroke-current shrink-0 h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>Failed to load products. Please try again.</span>
          </div>
        )}

        {!loading && !error && productsToRender.length === 0 && (
          <div className="text-center py-20 bg-base-100 rounded-2xl shadow-sm border border-base-200">
            <div className="text-6xl mb-4 opacity-50">🔍</div>
            <h3 className="text-xl font-bold mb-2">
              {searchQuery ? `No results for "${searchParams.get('q')}"` : 'No products found'}
            </h3>
            <p className="text-base-content/60 mb-6">
              {searchQuery ? 'Try a different search term.' : 'Check back later for new arrivals!'}
            </p>
            <Link href="/shop" className="btn btn-primary">
              View All Products
            </Link>
          </div>
        )}

        {!loading && !error && productsToRender.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 lg:gap-6">
            {productsToRender.map(product => (
              <div
                key={product.id}
                className="card bg-base-100 shadow-sm border border-base-200 hover:shadow-md transition-shadow"
              >
                <div className="card-body p-4 relative group flex flex-col h-full">
                  <button className="btn btn-circle btn-sm btn-ghost absolute top-3 right-3 z-10 text-base-content/50 hover:text-error hover:bg-error/10">
                    <TbHeart className="w-5 h-5" />
                  </button>

                  <Link href={`/shop/${product.id}`}>
                    <figure className="relative h-48 mb-3 overflow-hidden rounded-lg">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                      />
                    </figure>
                  </Link>

                  <div className="flex flex-col flex-grow">
                    <Link href={`/shop/${product.id}`}>
                      <h6 className="font-bold text-base line-clamp-2 mb-2 leading-tight flex-grow hover:text-primary transition-colors">
                        {product.name}
                      </h6>
                    </Link>

                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex text-warning text-xs">
                        {[...Array(5)].map((_, i) => (
                          <TbStarFilled
                            key={i}
                            className={i < product.rating ? 'text-warning' : 'text-base-300'}
                          />
                        ))}
                      </div>
                      <span className="text-xs text-base-content/50">(4.5)</span>
                    </div>

                    <div className="flex items-end justify-between mt-auto pt-2">
                      <div>
                        <p className="text-primary font-bold text-lg leading-none">
                          ${product.salePrice}
                        </p>
                        <p className="text-base-content/50 line-through text-xs mt-1">
                          ${product.originalPrice}
                        </p>
                      </div>

                      <button
                        className="btn btn-primary btn-sm btn-circle"
                        onClick={() => handleAddToCart(product)}
                      >
                        <TbPlus className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
