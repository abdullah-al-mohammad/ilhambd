'use client';

import { useCart } from '@/app/context/CartContext';
import { useFetch } from '@/hooks/useFetch';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { TbWind } from 'react-icons/tb';
import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/css';
import 'swiper/css/pagination';
import { Autoplay, Pagination } from 'swiper/modules';

type Product = {
  _id: string;
  name: string;
  price: number;
  cyclonePrice?: number;
  originalPrice?: number;
  image?: string;
  images?: string[];
};

export default function CycloneOffer() {
  const { data: settings } = useFetch<any>('/api/cyclone-offer');
  const {
    data: products,
    loading,
    error,
  } = useFetch<Product[]>('/api/products?cycloneActive=true');
  const { cart, addToCart } = useCart();

  const [time, setTime] = useState(0);

  useEffect(() => {
    if (settings?.endTime) {
      const target = new Date(settings.endTime).getTime();
      const update = () => {
        const remaining = Math.max(0, Math.floor((target - Date.now()) / 1000));
        setTime(remaining);
      };
      update();
      const timer = setInterval(update, 1000);
      return () => clearInterval(timer);
    }
  }, [settings]);

  if (!settings?.isActive) return null;
  if (loading) return null;
  if (!products || products.length === 0) return null;

  const formatTime = (t: number) => {
    const h = Math.floor(t / 3600);
    const m = Math.floor((t % 3600) / 60);
    const s = t % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-gradient-to-r from-blue-900 via-cyan-800 to-blue-900 py-10 my-8 overflow-hidden relative border-y-4 border-cyan-400/30">
      {/* Cyclone Animation Background Element */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 opacity-10 animate-spin-slow">
        <TbWind className="text-[300px] text-white" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
          <div className="flex items-center gap-4">
            <div className="bg-cyan-400 p-3 rounded-2xl shadow-[0_0_15px_rgba(34,211,238,0.5)] animate-pulse">
              <TbWind className="text-3xl text-blue-900" />
            </div>
            <div>
              <h2 className="text-3xl font-black text-white italic tracking-tighter uppercase">
                Cyclone <span className="text-cyan-400">Offer</span>
              </h2>
              <p className="text-cyan-200/70 text-xs font-bold tracking-widest uppercase">
                Limited Time Tornado Deals
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-black/30 p-4 rounded-2xl border border-white/10 backdrop-blur-md">
            <span className="text-white font-bold text-sm uppercase tracking-widest">Ends In:</span>
            <div className="text-3xl font-mono font-black text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.6)]">
              {formatTime(time)}
            </div>
          </div>
        </div>

        <Swiper
          slidesPerView={1}
          spaceBetween={20}
          autoplay={{ delay: 2500 }}
          breakpoints={{
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 4 },
          }}
          modules={[Autoplay, Pagination]}
          className="pb-10"
        >
          {(products || []).map(product => (
            <SwiperSlide key={product._id}>
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden hover:border-cyan-400/50 transition-all group h-full">
                <div className="relative aspect-square overflow-hidden">
                  <img
                    src={product.image || product.images?.[0] || 'https://via.placeholder.com/400'}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-2 left-2 bg-error text-white text-[10px] font-black px-2 py-1 rounded-md uppercase italic animate-bounce">
                    Cyclone Price
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-white font-bold truncate mb-1">{product.name}</h3>
                  <div className="flex items-center gap-2">
                    <span className="text-cyan-400 text-xl font-black">
                      ${Number(product.cyclonePrice || product.price) || 0}
                    </span>
                    <span className="text-white/30 line-through text-xs">
                      ${Number(product.originalPrice || product.price) || 0}
                    </span>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Link
                      href={`/shop/${product._id}`}
                      className="btn btn-sm flex-1 btn-outline border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:border-cyan-400 rounded-xl"
                    >
                      View
                    </Link>
                    <button
                      className={`btn btn-sm flex-1 rounded-xl ${cart.some(c => c._id === product._id) ? 'btn-outline border-white text-white' : 'bg-cyan-400 border-cyan-400 text-blue-900 hover:bg-cyan-500'}`}
                      onClick={() =>
                        addToCart({
                          _id: product._id,
                          name: product.name,
                          price: product.cyclonePrice || product.price,
                          image: product.image || product.images?.[0],
                          quantity: 1,
                        })
                      }
                    >
                      {cart.some(c => c._id === product._id) ? 'In Cart' : 'Add'}
                    </button>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <style jsx global>{`
        .animate-spin-slow {
          animation: spin 15s linear infinite;
        }
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}
