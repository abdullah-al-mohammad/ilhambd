'use client';

import { motion } from 'motion/react';
import { Autoplay, EffectFade, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

import { useState } from 'react';
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/pagination';

const slides = [
  {
    title: 'Amazon Echo',
    subtitle: '3rd Generation, Charcoal',
    image: 'src/assets/hero1.jpg',
  },
  {
    title: 'Light Candle',
    subtitle: 'Now only $22',
    image: 'src/assets/hero2.jpg',
  },
  {
    title: 'Fancy Chair',
    subtitle: '3 years warranty',
    image: 'src/assets/hero3.jpg',
  },
];

function HeroSlide({ title, subtitle, image, active }: any) {
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
            transition: {
              staggerChildren: 0.15,
            },
          },
        }}
        className="relative z-10 px-6 md:px-10 text-white"
      >
        <motion.h2
          className="mb-2 md:mb-5 text-2xl md:text-4xl lg:text-6xl font-bold "
          variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          {title}
        </motion.h2>

        <motion.p
          className="mb-2 md:mb-5 text-xl md:text-3xl lg:text-4xl"
          variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          {subtitle}
        </motion.p>

        <motion.button
          variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="btn btn-primary btn-sm md:btn-md rounded-full px-6"
        >
          Buy Now
        </motion.button>
      </motion.div>
    </div>
  );
}

export default function HeroSlider() {
  const [activeIndex, setActiveIndex] = useState(0);
  return (
    <div className="container mx-auto px-4 pt-3">
      <Swiper
        modules={[EffectFade, Autoplay, Pagination]}
        onSlideChange={swiper => setActiveIndex(swiper.realIndex)}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        autoplay={{ delay: 3000 }}
        loop
        pagination={{
          clickable: true,
        }}
        className="rounded-xl overflow-hidden mySwiper"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index}>
            <HeroSlide {...slide} active={activeIndex} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
