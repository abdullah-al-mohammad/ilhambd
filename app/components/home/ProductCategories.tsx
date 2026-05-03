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

const categories = [
  { name: "Women's Fashion", img: womens, link: '/category/womens-fashion' },
  { name: 'Groceries & Pets', img: grocery, link: '/category/groceries' },
  { name: 'Health & Beauty', img: health, link: '/category/health' },
  { name: 'Sports & Outdoors', img: sports, link: '/category/sports' },
  { name: 'Home Appliance', img: home, link: '/category/home' },
  { name: 'Tour & Travels', img: travels, link: '/category/travels' },
  { name: 'Mother & Baby', img: baby, link: '/category/baby' },
  { name: 'Clearance Sale', img: clearance, link: '/category/clearance', active: true },
];

export default function ProductCategories() {
  return (
    <div className="py-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-4 lg:grid-cols-8 gap-3">
          {categories.map((cat, idx) => (
            <Link
              key={idx}
              href={cat.link}
              className={`card shadow-sm border ${cat.active ? 'border-primary bg-primary/5' : 'border-base-200 bg-base-100'} hover:shadow-md transition-shadow cursor-pointer`}
            >
              <div className="card-body p-3 flex flex-col items-center justify-center text-center gap-2">
                <Image
                  src={cat.img}
                  alt={cat.name}
                  className={`text-2xl w-10 h-10 ${cat.active ? 'text-primary' : 'text-base-content/70'}`}
                />
                <span
                  className={`text-[10px] sm:text-xs leading-tight ${cat.active ? 'font-bold text-primary' : 'font-medium'}`}
                >
                  {cat.name}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
