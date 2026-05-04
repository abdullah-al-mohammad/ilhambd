'use client';
import {
  baby,
  clearance,
  grocery,
  health,
  home,
  sports,
  travels,
  womens,
} from '@/public/src/assets';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const categories = [
  { name: "Women's Fashion", img: womens, link: '/category/womens-fashion' },
  { name: 'Groceries & Pets', img: grocery, link: '/category/groceries' },
  { name: 'Health & Beauty', img: health, link: '/category/health' },
  { name: 'Sports & Outdoors', img: sports, link: '/category/sports' },
  { name: 'Home Appliance', img: home, link: '/category/home' },
  { name: 'Tour & Travels', img: travels, link: '/category/travels' },
  { name: 'Mother & Baby', img: baby, link: '/category/baby' },
  { name: 'Clearance Sale', img: clearance, link: '/category/clearance' },
];

export default function ProductCategories() {
  const pathname = usePathname();

  return (
    <div className="py-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-4 lg:grid-cols-8 gap-3">
          {categories.map((cat, idx) => {
            const isActive = pathname === cat.link;
            return (
              <Link
                key={idx}
                href={cat.link}
                className={`group card shadow-sm border ${isActive ? 'border-primary bg-primary/5' : 'border-base-200 bg-base-100'} hover:shadow-md hover:border-primary transition-all duration-300 cursor-pointer`}
              >
                <div className="card-body p-3 flex flex-col items-center justify-center text-center gap-2">
                  <Image
                    src={cat.img}
                    alt={cat.name}
                    className={`text-2xl w-10 h-10 transition-colors duration-300 ${isActive ? 'text-primary' : 'text-base-content/70 group-hover:text-primary'}`}
                  />
                  <span
                    className={`text-[10px] sm:text-xs leading-tight transition-colors duration-300 ${isActive ? 'font-bold text-primary' : 'font-medium group-hover:text-primary'}`}
                  >
                    {cat.name}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
