'use client';

import axiosInstance from '@/lib/axios';
import { useFetch } from '@/hooks/useFetch';
import { useState } from 'react';

type Coupon = {
  _id?: string;
  code: string;
  type: 'percent' | 'fixed';
  value: number | string;
  minOrderAmount?: number | string;
  usageLimit?: number | string;
  usedCount?: number;
  expiresAt: string;
  isActive?: boolean;
};

const emptyCoupon: Coupon = {
  code: '',
  type: 'percent',
  value: '',
  minOrderAmount: '',
  usageLimit: '',
  expiresAt: '',
  isActive: true,
};

export default function CouponsDashboard() {
  const { data, loading, error, refetch } = useFetch<Coupon[]>('/api/coupons');
  const [form, setForm] = useState<Coupon>(emptyCoupon);
  const coupons = data || [];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const nextValue = e.target instanceof HTMLInputElement && e.target.type === 'checkbox'
      ? e.target.checked
      : value;
    setForm(prev => ({ ...prev, [name]: nextValue }));
  };

  const createCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axiosInstance.post('/api/coupons', form);
      setForm(emptyCoupon);
      refetch();
    } catch (err) {
      console.error('Create coupon error:', err);
    }
  };

  const toggleCoupon = async (coupon: Coupon) => {
    try {
      await axiosInstance.put(`/api/coupons/${coupon._id}`, { isActive: !coupon.isActive });
      refetch();
    } catch (err) {
      console.error('Toggle coupon error:', err);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Coupon Management</h1>

      <div className="card bg-base-100 shadow">
        <div className="card-body">
          <h2 className="card-title">Create Coupon</h2>
          <form onSubmit={createCoupon} className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input
              className="input input-bordered"
              name="code"
              value={form.code}
              onChange={handleChange}
              placeholder="Code (e.g. EID25)"
              required
            />
            <select
              className="select select-bordered"
              name="type"
              value={form.type}
              onChange={handleChange}
            >
              <option value="percent">Percent</option>
              <option value="fixed">Fixed Amount</option>
            </select>
            <input
              className="input input-bordered"
              name="value"
              value={form.value}
              onChange={handleChange}
              placeholder={form.type === 'percent' ? 'Discount %' : 'Discount amount'}
              required
            />
            <input
              className="input input-bordered"
              name="minOrderAmount"
              value={form.minOrderAmount}
              onChange={handleChange}
              placeholder="Min order amount (optional)"
            />
            <input
              className="input input-bordered"
              name="usageLimit"
              value={form.usageLimit}
              onChange={handleChange}
              placeholder="Usage limit (optional)"
            />
            <input
              className="input input-bordered"
              type="datetime-local"
              name="expiresAt"
              value={form.expiresAt}
              onChange={handleChange}
              required
            />
            <label className="label cursor-pointer justify-start gap-2 md:col-span-2">
              <input
                type="checkbox"
                className="checkbox checkbox-primary"
                name="isActive"
                checked={Boolean(form.isActive)}
                onChange={handleChange}
              />
              <span className="label-text">Active coupon</span>
            </label>
            <button className="btn btn-primary md:col-span-2">Create Coupon</button>
          </form>
        </div>
      </div>

      <div className="overflow-x-auto bg-base-100 rounded-box shadow">
        <table className="table">
          <thead>
            <tr>
              <th>Code</th>
              <th>Type</th>
              <th>Value</th>
              <th>Min Order</th>
              <th>Usage</th>
              <th>Expires</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={8} className="text-center py-4">
                  Loading...
                </td>
              </tr>
            ) : (
              coupons.map(coupon => (
                <tr key={coupon._id}>
                  <td className="font-bold">{coupon.code}</td>
                  <td>{coupon.type}</td>
                  <td>{coupon.type === 'percent' ? `${coupon.value}%` : `$${coupon.value}`}</td>
                  <td>{coupon.minOrderAmount || '—'}</td>
                  <td>
                    {coupon.usedCount || 0}
                    {coupon.usageLimit ? ` / ${coupon.usageLimit}` : ''}
                  </td>
                  <td>{new Date(coupon.expiresAt).toLocaleString()}</td>
                  <td>
                    <span className={`badge ${coupon.isActive ? 'badge-success' : 'badge-error'}`}>
                      {coupon.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td>
                    <button className="btn btn-sm" onClick={() => toggleCoupon(coupon)}>
                      Toggle
                    </button>
                  </td>
                </tr>
              ))
            )}
            {!loading && coupons.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center py-4">
                  No coupons found.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
      {error ? <p className="text-error text-sm">Failed to load coupons.</p> : null}
    </div>
  );
}
