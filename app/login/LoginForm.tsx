'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'motion/react';
import axios from 'axios';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useAuth } from '@/app/context/AuthContext';
import { NextResponse } from 'next/server'; // not used but keep if needed

export default function LoginForm() {
  const [identifier, setIdentifier] = useState(''); // email or phone
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();

  const redirectPath = searchParams.get('redirect') || '/';

  useEffect(() => {
    if (searchParams.get('registered')) {
      setSuccess('Registration successful! Please sign in.');
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await axios.post('/api/auth/login', { identifier, password });
      if (response.status === 200) {
        login(response.data.user);
        router.push(redirectPath);
        router.refresh();
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full space-y-8 bg-base-100 p-8 rounded-2xl shadow-2xl border border-base-300"
      >
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-base-content">Welcome Back</h2>
          <p className="mt-2 text-sm text-base-content/60">Please enter your details to sign in to your account.</p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="alert alert-error shadow-lg py-2 text-sm"><span>{error}</span></div>
          )}
          {success && (
            <div className="alert alert-success shadow-lg py-2 text-sm"><span>{success}</span></div>
          )}
          <div className="space-y-4">
            <div className="form-control">
              <label className="label"><span className="label-text font-semibold">Email or Phone Number</span></label>
              <input
                type="text"
                required
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                className="input input-bordered w-full focus:input-primary transition-all duration-200"
                placeholder="email@example.com or phone number"
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Password</span>
                <Link href="#" className="label-text-alt link link-primary no-underline hover:underline">Forgot password?</Link>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input input-bordered w-full focus:input-primary transition-all duration-200 pr-10"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/50 hover:text-primary transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>
          </div>
          <div className="flex items-center">
            <input id="remember-me" name="remember-me" type="checkbox" className="checkbox checkbox-primary checkbox-sm" />
            <label htmlFor="remember-me" className="ml-2 block text-sm text-base-content/70">Remember me</label>
          </div>
          <div>
            <button type="submit" disabled={loading} className={`btn btn-primary btn-block text-white ${loading ? 'loading' : ''}`}>
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
        </form>
        <div className="text-center">
          <p className="text-sm text-base-content/60">
            Don&apos;t have an account?{' '}
            <Link href={`/register${redirectPath !== '/' ? `?redirect=${redirectPath}` : ''}`} className="font-medium link link-primary no-underline hover:underline">Sign up for free</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
