export default function DashboardHome() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Dashboard Overview</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Products Management</h2>
            <p>Add products, toggle featured, set flash sale time, and add discount.</p>
            <div className="card-actions justify-end mt-4">
              <a href="/dashboard/products" className="btn btn-primary">
                Manage Products
              </a>
            </div>
          </div>
        </div>

        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Order Management</h2>
            <p>View customer orders, update statuses, or cancel orders.</p>
            <div className="card-actions justify-end mt-4">
              <a href="/dashboard/orders" className="btn btn-secondary">
                Manage Orders
              </a>
            </div>
          </div>
        </div>

        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Best Selling</h2>
            <p>View top-selling products based on completed orders data.</p>
            <div className="card-actions justify-end mt-4">
              <a href="/dashboard/best-selling" className="btn btn-accent">
                View Best Selling
              </a>
            </div>
          </div>
        </div>

        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Coupons</h2>
            <p>Create and manage coupon codes for percentage or fixed discounts.</p>
            <div className="card-actions justify-end mt-4">
              <a href="/dashboard/coupons" className="btn btn-info">
                Manage Coupons
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
