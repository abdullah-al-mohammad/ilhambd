'use client';

import { useFetch } from '@/hooks/useFetch';

type BestSellingItem = {
  _id: string;
  productName: string;
  totalSold: number;
  totalRevenue: number;
};

export default function BestSellingDashboard() {
  const { data, loading, error } = useFetch<BestSellingItem[]>('/api/products/best-selling');
  const items = data || [];

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Best Selling Products</h1>

      <div className="overflow-x-auto bg-base-100 rounded-box shadow">
        <table className="table">
          <thead>
            <tr>
              <th>Rank</th>
              <th>Product</th>
              <th>Total Sold</th>
              <th>Total Revenue</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={4} className="text-center py-4">
                  Loading...
                </td>
              </tr>
            ) : (
              items.map((item, index) => (
                <tr key={item._id}>
                  <td>#{index + 1}</td>
                  <td className="font-semibold">{item.productName}</td>
                  <td>{item.totalSold}</td>
                  <td>${(item.totalRevenue || 0).toFixed(2)}</td>
                </tr>
              ))
            )}
            {!loading && items.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-4">
                  No sales data found.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>

      {error ? <p className="text-error text-sm mt-3">Failed to load best-selling data.</p> : null}
    </div>
  );
}
