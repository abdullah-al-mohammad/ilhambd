'use client';

import { useAuth } from '@/app/context/AuthContext';
import { useCart } from '@/app/context/CartContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { FaMoon, FaShoppingCart, FaSignOutAlt, FaSun, FaUser } from 'react-icons/fa';
import NotificationBell from './NotificationBell';

export default function Navbar() {
  const { cartCount, cartTotal } = useCart();
  const { user, logout } = useAuth();
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
        <Link href="/">Home</Link>
      </li>
      {user?.role === 'admin' && (
        <li>
          <Link href="/dashboard" className="text-primary font-bold">Dashboard</Link>
        </li>
      )}
      <li>
        <details>
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
            {links}
          </ul>
        </div>
        <Link href="/" className="text-xl font-bold pl-5">
          Ilham Group
        </Link>
      </div>

      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1 font-medium">{links}</ul>
      </div>

      <div className="navbar-end gap-1 md:gap-2">
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

        {/* Theme Dropdown */}
        <div className="dropdown dropdown-end">
          <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
            <FaSun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <FaMoon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </div>
          <ul tabIndex={0} className="dropdown-content z-100 menu p-2 shadow-xl bg-base-100 rounded-box w-32 border border-base-200 mt-2">
            <li>
              <button onClick={() => {
                document.documentElement.setAttribute('data-theme', 'light');
                localStorage.setItem('theme', 'light');
              }}>Light</button>
            </li>
            <li>
              <button onClick={() => {
                document.documentElement.setAttribute('data-theme', 'dark');
                localStorage.setItem('theme', 'dark');
              }}>Dark</button>
            </li>
            <li>
              <button onClick={() => {
                const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
                localStorage.removeItem('theme');
              }}>System</button>
            </li>
          </ul>
        </div>

        <NotificationBell />

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
            <div className="w-9 rounded-full flex items-center justify-center bg-base-300 overflow-hidden">
              {user ? (
                <span className="text-xs font-bold">{user.name.charAt(0).toUpperCase()}</span>
              ) : (
                <FaUser className="text-base-content/50" />
              )}
            </div>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content mt-3 z-100 p-2 shadow-xl bg-base-100 rounded-box w-52 border border-base-200"
          >
            {user ? (
              <>
                <li className="menu-title px-4 py-2 border-b border-base-200 mb-2">
                  <span className="font-bold block text-base-content">{user.name}</span>
                  <span className="text-xs text-base-content/60 font-normal truncate">
                    {user.email}
                  </span>
                </li>
                {user.role === 'admin' && (
                  <li>
                    <Link href="/dashboard" className="flex items-center gap-2">
                      Admin Panel
                    </Link>
                  </li>
                )}
                <li>
                  <button onClick={logout} className="flex items-center gap-2 text-error">
                    <FaSignOutAlt /> Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link href="/login">Login</Link>
                </li>
                <li>
                  <Link href="/register">Register</Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
