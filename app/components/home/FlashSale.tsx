'use client';

import { useEffect, useState } from 'react';
import { TbBolt } from 'react-icons/tb';
import { Swiper, SwiperSlide } from 'swiper/react';
import { useFetch } from '@/hooks/useFetch';

import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';

// import required modules
import { Autoplay, EffectCoverflow, Pagination } from 'swiper/modules';

interface FlashSaleProps {
  endTime?: string | number | Date;
}

type FlashSaleProduct = {
  id: number | string;
  name: string;
  price: number;
  originalPrice: number;
  soldPercentage: number;
  image: string;
};

type ApiProduct = {
  _id: string;
  name: string;
  price: number;
  originalPrice?: number;
  soldPercentage?: number;
  image?: string;
  images?: string[];
  flashSalePrice?: number;
  flashSaleEndsAt?: string;
};

export default function FlashSale({ endTime }: FlashSaleProps = {}) {
  const { data, loading: isLoadingProducts, error: productError } = useFetch<ApiProduct[]>(
    '/api/products?flashSaleActive=true'
  );
  const displayProducts: FlashSaleProduct[] = (data || []).slice(0, 9).map(product => ({
    id: product._id,
    name: product.name,
    price: product.flashSalePrice || product.price,
    originalPrice: product.originalPrice || product.price,
    soldPercentage: product.soldPercentage ?? 0,
    image:
      product.image ||
      product.images?.[0] ||
      'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&q=80',
  }));

  // Default to 2 days, 14 hours, 32 mins, 10 secs if no endTime provided
  const defaultFallbackTime = 2 * 86400 + 14 * 3600 + 32 * 60 + 10;
  const [time, setTime] = useState(endTime ? 0 : defaultFallbackTime);

  useEffect(() => {
    const apiEndTime = data?.[0]?.flashSaleEndsAt;
    const targetTime = endTime || apiEndTime;
    const target = targetTime ? new Date(targetTime).getTime() : Date.now() + defaultFallbackTime * 1000;

    const updateTime = () => {
      const remaining = Math.max(0, Math.floor((target - Date.now()) / 1000));
      setTime(remaining);
    };

    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, [endTime, data]);

  const days = Math.floor(time / 86400);
  const hours = Math.floor((time % 86400) / 3600);
  const minutes = Math.floor((time % 3600) / 60);
  const seconds = time % 60;

  return (
    <div className="bg-base-100 py-6 my-2">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h6 className="flex items-center text-lg font-bold">
            <TbBolt className="mr-2 text-error animate-pulse" />
            Cyclone Offer
          </h6>
          {/* Countdown timer */}
          <div className="flex items-center gap-1 text-sm font-semibold text-error bg-error/10 px-3 py-1 rounded-full">
            <span>
              <span className="days">{days}</span>d
            </span>
            <span className="opacity-50">:</span>
            <span>
              <span className="hours">{hours}</span>h
            </span>
            <span className="opacity-50">:</span>
            <span>
              <span className="minutes">{minutes}</span>m
            </span>
            <span className="opacity-50">:</span>
            <span>
              <span className="seconds">{seconds}</span>s
            </span>
          </div>
        </div>

        {/* Flash Sale Carousel */}
        <Swiper
          effect={'coverflow'}
          grabCursor={true}
          centeredSlides={true}
          slidesPerView={'auto'}
          coverflowEffect={{
            rotate: 50,
            stretch: 0,
            depth: 100,
            modifier: 1,
            slideShadows: true,
          }}
          autoplay={{ delay: 3000 }}
          pagination={true}
          modules={[EffectCoverflow, Pagination, Autoplay]}
          className="mySwiper"
        >
          {displayProducts.map(product => (
            <SwiperSlide key={product.id} className="!w-48 sm:!w-56">
              <div className="card w-full h-full bg-warning-content/5 border border-warning/20 shadow-sm">
                <figure className="p-4 pb-0 h-32 relative">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-full w-full object-cover rounded-lg"
                  />
                </figure>
                <div className="card-body p-4">
                  <span className="font-bold text-sm truncate">{product.name}</span>
                  <p className="text-primary font-bold">
                    ${product.price}{' '}
                    <span className="text-base-content/50 line-through text-xs ml-1">
                      ${product.originalPrice}
                    </span>
                  </p>
                  <div className="mt-2">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="font-medium text-base-content/70">
                        {product.soldPercentage}% Sold
                      </span>
                    </div>
                    <progress
                      className={`progress w-full ${product.soldPercentage > 80 ? 'progress-error' : 'progress-primary'}`}
                      value={product.soldPercentage}
                      max="100"
                    ></progress>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
        {isLoadingProducts ? <p className="text-xs text-base-content/70 mt-3">Loading flash sale...</p> : null}
        {!isLoadingProducts && productError ? (
          <p className="text-xs text-error mt-3">Could not load flash sale products.</p>
        ) : null}
        {!isLoadingProducts && !productError && displayProducts.length === 0 ? (
          <p className="text-xs text-base-content/70 mt-3">No active flash sale products right now.</p>
        ) : null}
      </div>
    </div>
  );
}
