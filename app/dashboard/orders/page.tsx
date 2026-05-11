'use client';
import { useFetch } from '@/hooks/useFetch';
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
              <th>Items</th>
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
                  <td className="relative group">
                    <div className="font-bold">{order.customerName}</div>
                    <div className="text-sm opacity-50">{order.customerEmail}</div>

                    {/* Hover Box */}
                    <div className="absolute left-0 top-full mt-2 hidden group-hover:block bg-base-200 text-sm p-3 rounded-lg shadow-lg z-50 w-56">
                      <p>
                        <b>Address:</b> {order.customerAddress}
                      </p>
                      <p>
                        <b>Phone:</b> {order.customerPhone}
                      </p>
                    </div>
                  </td>
                  <td className="relative group/items">
                    <div className="badge badge-ghost cursor-help">{order.items?.length || 0} items</div>
                    <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 hidden group-hover/items:block bg-base-200 text-sm p-3 rounded-lg shadow-xl z-50 w-72 border border-base-300">
                      <h4 className="font-bold mb-2 pb-1 border-b border-base-300">Order Details</h4>
                      <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                        {order.items?.map((item: any, idx: number) => (
                          <div key={idx} className="flex justify-between items-start text-xs border-b border-base-300 pb-2 last:border-0 last:pb-0">
                            <div className="flex flex-col pr-2">
                              <span className="font-medium">{item.name}</span>
                              {(item.color || item.size) && (
                                <span className="opacity-60 text-[10px]">
                                  {item.color && `Color: ${item.color}`}
                                  {item.color && item.size && ' | '}
                                  {item.size && `Size: ${item.size}`}
                                </span>
                              )}
                            </div>
                            <span className="whitespace-nowrap opacity-80 mt-0.5">{item.quantity} x ${item.price}</span>
                          </div>
                        ))}
                      </div>
                    </div>
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
