'use client';

import Link from 'next/link';
import { motion } from 'motion/react';
import { FaExclamationTriangle } from 'react-icons/fa';

export default function NotAuthorizedPage() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-md"
      >
        <div className="flex justify-center mb-6">
          <div className="p-6 bg-warning/20 rounded-full">
            <FaExclamationTriangle className="text-6xl text-warning" />
          </div>
        </div>
        
        <h1 className="text-4xl font-bold mb-4 text-base-content">Access Denied</h1>
        <p className="text-lg text-base-content/70 mb-8">
          You do not have the necessary permissions to access this page. Please contact an administrator if you believe this is an error.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/" className="btn btn-primary px-8">
            Go Back Home
          </Link>
          <Link href="/login" className="btn btn-outline px-8">
            Sign in as Admin
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
