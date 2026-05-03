import Link from 'next/link';
import { FaArrowRight } from 'react-icons/fa';

export default function DiscountCoupon() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="card bg-gradient-to-r from-red-700 to-pink-500 text-white shadow-lg overflow-hidden relative">
        <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-white opacity-10 rounded-full blur-2xl"></div>
        <div className="card-body flex-row items-center gap-4 p-6 sm:p-8">
          <div className="shrink-0 bg-white/20 p-3 rounded-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-10 w-10 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"
              />
            </svg>
          </div>
          <div>
            <h5 className="text-xl sm:text-2xl font-bold mb-1">Get 20% discount!</h5>
            <p className="text-sm sm:text-base opacity-90">
              To get discount, enter the
              <span className="px-2 py-0.5 bg-white text-primary rounded-md font-bold text-xs shadow-sm mx-1">
                GET20
              </span>{' '}
              code on the checkout page.
            </p>
            <Link href={'/'} className="btn btn-primary btn-sm my-5 rounded-2xl">
              Grab This Offer <FaArrowRight />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
