'use client';
import { useEffect } from 'react';
import Collections from './components/home/Collections';
import DiscountCoupon from './components/home/DiscountCoupon';
import FeaturedProducts from './components/home/FeaturedProducts';
import FlashSale from './components/home/FlashSale';
import HeroSlider from './components/home/HeroSlider';
import ProductCategories from './components/home/ProductCategories';
import TopProducts from './components/home/TopProducts';
import WeeklyBestSellers from './components/home/WeeklyBestSellers';
import Footer from './components/shared/Footer/Footer';
import Navbar from './components/shared/Navbar/Navbar';

export default function Home() {
  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)');

    const handler = (e: any) => {
      if (!localStorage.getItem('theme')) {
        document.documentElement.setAttribute('data-theme', e.matches ? 'dark' : 'light');
      }
    };

    media.addEventListener('change', handler);

    return () => media.removeEventListener('change', handler);
  }, []);
  return (
    <div>
      <main>
        <Navbar />
        <div>
          <HeroSlider />
          <ProductCategories />
          <FlashSale />
          <TopProducts />
          <DiscountCoupon />
          <WeeklyBestSellers />
          <FeaturedProducts />
          <Collections />
        </div>
      </main>
      <Footer />
    </div>
  );
}
