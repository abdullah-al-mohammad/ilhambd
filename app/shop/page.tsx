import { Suspense } from 'react';
import ShopPage from './Shop';

export const dynamic = 'force-dynamic';

export default function Shop() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-base-200">Loading...</div>
      }
    >
      <ShopPage />
    </Suspense>
  );
}
