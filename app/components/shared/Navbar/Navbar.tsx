'use client';

import { useCart } from '@/app/context/CartContext';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { FaMoon, FaShoppingCart, FaSun } from 'react-icons/fa';

export default function Navbar() {
  const { cartCount, cartTotal } = useCart();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/shop?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const links = (
    <>
      <li>
        <a>Home</a>
      </li>
      <li>
        <details open>
          <summary>Shop</summary>
          <ul className="mt-2 bg-base-200/50 rounded-lg">
            <li>
              <Link href="/shop">All Products</Link>
            </li>
            <li>
              <a>Men&apos;s Fashion</a>
            </li>
            <li>
              <a>Women&apos;s Fashion</a>
            </li>
          </ul>
        </details>
      </li>
      <li>
        <a>Best Deals</a>
      </li>
      <li>
        <a>Contact Us</a>
      </li>
    </>
  );
  return (
    <div className="navbar bg-base-200 lg:mb-10 shadow-sm w-full rounded-md sticky top-0 z-50 px-2 lg:px-4">
      <div className="navbar-start">
        {/* Mobile Menu Toggle */}
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden pl-0 pr-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />
            </svg>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-md dropdown-content mt-3 z-50 p-3 shadow-xl bg-base-100 rounded-box w-64 border border-base-200"
          >
            <li className="mb-4">
              <form onSubmit={handleSearch} className="relative w-full p-0">
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="input input-sm input-bordered w-full rounded-full pl-4 pr-10"
                />
                <button
                  type="submit"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/50 hover:text-primary cursor-pointer border-none bg-transparent p-0"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </button>
              </form>
            </li>
            <li>
              <a>Home</a>
            </li>
            <li>
              <details open>
                <summary>Shop</summary>
                <ul className="mt-2 bg-base-200/50 rounded-lg">
                  <li>
                    <Link href="/shop">All Products</Link>
                  </li>
                  <li>
                    <a>Men&apos;s Fashion</a>
                  </li>
                  <li>
                    <a>Women&apos;s Fashion</a>
                  </li>
                </ul>
              </details>
            </li>
            <li>
              <a>Best Deals</a>
            </li>
            <li>
              <a>Contact Us</a>
            </li>
          </ul>
        </div>
        <a className="btn btn-ghost text-xl font-bold tracking-tight px-1 collapse-title">
          Ilham Group
        </a>
      </div>

      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1 font-medium">{links}</ul>
      </div>

      <div className="navbar-end gap-1 md:gap-2">
        {/* Search Bar - Hidden on small screens */}
        <div className="hidden md:block form-control">
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="input input-sm input-bordered w-full md:w-48 lg:w-64 rounded-full pl-4 pr-10"
            />
            <button
              type="submit"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/50 hover:text-primary cursor-pointer border-none bg-transparent p-0"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>
          </form>
        </div>

        {/* Theme Toggle */}
        <label className="swap swap-rotate btn btn-ghost btn-circle">
          {/* this hidden checkbox controls the state */}
          <input type="checkbox" className="theme-controller" value="dark" />

          {/* sun icon */}
          <FaSun className="swap-on text-xl" />

          {/* moon icon */}
          <FaMoon className="swap-off text-xl" />
        </label>

        {/* Cart Dropdown */}
        <div className="dropdown dropdown-end">
          <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
            <div className="indicator">
              <FaShoppingCart className="text-xl" />
              {cartCount > 0 && (
                <span className="badge badge-sm indicator-item bg-primary text-primary-content border-none">
                  {cartCount}
                </span>
              )}
            </div>
          </div>
          <div
            tabIndex={0}
            className="mt-3 z-100 card card-compact dropdown-content w-64 bg-base-100 shadow-xl border border-base-200"
          >
            <div className="card-body">
              <span className="font-bold text-lg">{cartCount} Items</span>
              <span className="text-base-content/70">Subtotal: ${cartTotal.toFixed(2)}</span>
              <div className="card-actions">
                <Link href="/checkout" className="btn btn-primary btn-block text-white">
                  View Cart
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* User Profile Dropdown */}
        <div className="dropdown dropdown-end">
          <div
            tabIndex={0}
            role="button"
            className="btn btn-ghost btn-circle avatar border border-base-300"
          >
            <div className="w-9 rounded-full">
              <Image alt="User profile" src="" width={36} height={36} />
            </div>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content mt-3 z-100 p-2 shadow-xl bg-base-100 rounded-box w-52 border border-base-200"
          >
            {links}
          </ul>
        </div>
      </div>
    </div>
  );
}
