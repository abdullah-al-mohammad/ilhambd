'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { TbHeart, TbStarFilled } from 'react-icons/tb';

type BestSellerProduct = {
  id: string | number;
  name: string;
  price: number;
  originalPrice: number;
  rating: number;
  reviews: number;
  image: string;
};

type ApiProduct = {
  _id: string;
  name: string;
  price: number;
  images?: string[];
};

const fallbackBestSellers: BestSellerProduct[] = [
  {
    id: 1,
    name: 'Nescafe Coffee Jar',
    price: 64,
    originalPrice: 89,
    rating: 4.88,
    reviews: 39,
    image: 'https://images.unsplash.com/photo-1559525839-b184a4d698c7?w=400&q=80',
  },
  {
    id: 2,
    name: 'Modern Office Chair',
    price: 99,
    originalPrice: 159,
    rating: 4.82,
    reviews: 125,
    image: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?w=400&q=80',
  },
  {
    id: 3,
    name: 'Beach Sunglasses',
    price: 24,
    originalPrice: 32,
    rating: 4.79,
    reviews: 63,
    image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=400&q=80',
  },
  {
    id: 4,
    name: 'Meow Mix Cat Food',
    price: 11.49,
    originalPrice: 13,
    rating: 4.78,
    reviews: 7,
    image: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400&q=80',
  },
];

export default function WeeklyBestSellers() {
  const [products, setProducts] = useState<BestSellerProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setIsLoading(true);
        setHasError(false);
        const response = await fetch('/api/products', { cache: 'no-store' });

        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }

        const data: ApiProduct[] = await response.json();
        const mappedProducts: BestSellerProduct[] = data.slice(0, 4).map((product, index) => ({
          id: product._id,
          name: product.name,
          price: product.price,
          originalPrice: Math.round(product.price * 1.15),
          rating: Number((4.7 + index * 0.05).toFixed(2)),
          reviews: 20 + index * 11,
          image:
            product.images?.[0] ||
            'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&q=80',
        }));

        setProducts(mappedProducts);
      } catch (error) {
        console.error(error);
        setHasError(true);
      } finally {
        setIsLoading(false);
      }
    };

    loadProducts();
  }, []);

  const productsToRender = useMemo(() => {
    if (products.length > 0) return products;
    return fallbackBestSellers;
  }, [products]);

  return (
    <div className="py-6 bg-base-200/50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-4">
          <h6 className="font-bold text-lg">Weekly Best Sellers</h6>
          <Link href="/shop-list" className="btn btn-sm btn-ghost">
            View all
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {productsToRender.map(product => (
            <div
              key={product.id}
              className="card card-side bg-base-100 shadow-sm border border-base-200 items-center overflow-hidden"
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
                <p className="text-primary font-bold text-sm mb-1">
                  ${product.price}{' '}
                  <span className="text-base-content/50 line-through text-xs ml-1">
                    ${product.originalPrice}
                  </span>
                </p>
                <div className="flex items-center text-xs">
                  <TbStarFilled className="text-warning mr-1" />
                  <span className="font-bold">{product.rating}</span>
                  <span className="text-base-content/50 ml-1">({product.reviews} review)</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        {!isLoading && hasError ? (
          <p className="text-xs text-error mt-3">Could not load latest products, showing fallback items.</p>
        ) : null}
      </div>
    </div>
  );
}
