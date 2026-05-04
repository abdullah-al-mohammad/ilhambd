'use client';

import { motion } from 'motion/react';
import Link from 'next/link';
import { Autoplay, EffectFade, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import { useState } from 'react';
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/pagination';
import { useFetch } from '@/hooks/useFetch';

type Product = {
  _id: string;
  name: string;
  description?: string;
  price: number;
  images?: string[];
  image?: string;
};

function HeroSlide({ product, active }: { product: Product; active: number }) {
  const image =
    product.images?.[0] ||
    product.image ||
    'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&q=80';

  return (
    <div
      className="relative h-48 md:h-64 lg:h-80 bg-cover bg-center flex items-center"
      style={{ backgroundImage: `url(${image})` }}
    >
      {/* overlay */}
      <div className="absolute inset-0 bg-black/40" />

      {/* content */}
      <motion.div
        initial="hidden"
        key={active}
        animate="show"
        variants={{
          hidden: {},
          show: {
            opacity: 1,
            y: 0,
            transition: { staggerChildren: 0.15 },
          },
        }}
        className="relative z-10 px-6 md:px-10 text-white"
      >
        <motion.h2
          className="mb-2 md:mb-5 text-2xl md:text-4xl lg:text-6xl font-bold"
          variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          {product.name}
        </motion.h2>

        <motion.p
          className="mb-2 md:mb-5 text-xl md:text-3xl lg:text-4xl opacity-90"
          variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          {product.description ? product.description.slice(0, 60) : `Only $${product.price}`}
        </motion.p>

        <motion.div
          variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="flex items-center gap-3"
        >
          <Link
            href={`/shop`}
            className="btn btn-primary btn-sm md:btn-md rounded-full px-6"
          >
            Buy Now
          </Link>
          <span className="badge badge-warning text-white font-bold text-sm px-3 py-3">
            ${product.price}
          </span>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default function HeroSlider() {
  const [activeIndex, setActiveIndex] = useState(0);
  const { data, loading } = useFetch<Product[]>('/api/products?featured=true');

  const featuredProducts = data || [];

  if (loading) {
    return (
      <div className="container mx-auto px-4 pt-3">
        <div className="rounded-xl h-48 md:h-64 lg:h-80 bg-base-200 animate-pulse" />
      </div>
    );
  }

  if (!featuredProducts.length) return null;

  return (
    <div className="container mx-auto px-4 pt-3">
      <Swiper
        modules={[EffectFade, Autoplay, Pagination]}
        onSlideChange={swiper => setActiveIndex(swiper.realIndex)}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        autoplay={{ delay: 3000 }}
        loop
        pagination={{ clickable: true }}
        className="rounded-xl overflow-hidden mySwiper"
      >
        {featuredProducts.map((product, index) => (
          <SwiperSlide key={product._id}>
            <HeroSlide product={product} active={activeIndex} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}

