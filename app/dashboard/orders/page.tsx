'use client';
import { useFetch } from '@/hooks/useFetch';
import { useState } from 'react';
import axiosInstance from '@/lib/axios';

export default function OrdersDashboard() {
  const { data: ordersData, loading, refetch: fetchOrders } = useFetch<any[]>('/api/orders');
  const orders = ordersData || [];

  const updateOrderStatus = async (id: string, newStatus: string) => {
    try {
      await axiosInstance.put(`/api/orders/${id}`, { status: newStatus });
      fetchOrders();
    } catch (error) {
      console.error('Error updating order', error);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Manage Orders</h1>

      <div className="overflow-x-auto bg-base-100 rounded-box shadow">
        <table className="table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Total Amount</th>
              <th>Date</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="text-center py-4">
                  Loading...
                </td>
              </tr>
            ) : (
              orders.map(order => (
                <tr key={order._id}>
                  <td className="font-mono text-xs">{order._id}</td>
                  <td>
                    <div className="font-bold">{order.customerName}</div>
                    <div className="text-sm opacity-50">{order.customerEmail}</div>
                  </td>
                  <td>${order.totalAmount}</td>
                  <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td>
                    <div
                      className={`badge ${
                        order.status === 'Completed'
                          ? 'badge-success'
                          : order.status === 'Cancelled'
                            ? 'badge-error'
                            : order.status === 'Processing'
                              ? 'badge-info'
                              : 'badge-warning'
                      }`}
                    >
                      {order.status}
                    </div>
                  </td>
                  <td>
                    <select
                      className="select select-bordered select-sm w-full max-w-xs"
                      value={order.status}
                      onChange={e => updateOrderStatus(order._id, e.target.value)}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Processing">Processing</option>
                      <option value="Completed">Completed</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </td>
                </tr>
              ))
            )}
            {orders.length === 0 && !loading && (
              <tr>
                <td colSpan={6} className="text-center py-4">
                  No orders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
