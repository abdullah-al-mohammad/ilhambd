import Link from 'next/link';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="drawer lg:drawer-open">
      <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-col items-center justify-center bg-base-200/50">
        {/* Page content here */}
        <div className="w-full h-full p-4 lg:p-8">
          <label htmlFor="my-drawer-2" className="btn btn-primary drawer-button lg:hidden mb-4">
            Open Menu
          </label>
          {children}
        </div>
      </div>
      <div className="drawer-side">
        <label htmlFor="my-drawer-2" aria-label="close sidebar" className="drawer-overlay"></label>
        <ul className="menu p-4 w-80 min-h-full bg-base-100 text-base-content border-r border-base-200">
          {/* Sidebar content here */}
          <li className="mb-4">
            <h2 className="text-2xl font-bold tracking-tight px-4">Admin Panel</h2>
          </li>
          <li>
            <Link href="/dashboard">Dashboard Home</Link>
          </li>
          <li>
            <Link href="/dashboard/products">Manage Products</Link>
          </li>
          <li>
            <Link href="/dashboard/orders">Manage Orders</Link>
          </li>
          <li>
            <Link href="/dashboard/best-selling">Best Selling</Link>
          </li>
          <li>
            <Link href="/dashboard/coupons">Coupons</Link>
          </li>
          <li>
            <Link href="/">Back to Store</Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
