'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCart } from '@/app/context/CartContext';
import { useRouter } from 'next/navigation';

export default function CheckoutPage() {
  const { cart, cartTotal, clearCart } = useCart();
  const router = useRouter();
  
  // Wait for cart to hydrate from localStorage
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');

  const orderAmount = cartTotal;
  const [couponCode, setCouponCode] = useState('');
  const [discountInfo, setDiscountInfo] = useState<{
    code: string;
    type: 'percent' | 'fixed';
    value: number;
  } | null>(null);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [loading, setLoading] = useState(false);

  const applyCoupon = async () => {
    if (!couponCode.trim()) {
      setMessage({ text: 'Please enter a coupon code', type: 'error' });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code: couponCode, orderAmount }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to apply coupon');
      }

      if (data.success && data.coupon) {
        setDiscountInfo(data.coupon);
        setMessage({ text: `Coupon applied successfully!`, type: 'success' });
      }
    } catch (error: any) {
      setDiscountInfo(null);
      setMessage({ text: error.message, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const removeCoupon = () => {
    setDiscountInfo(null);
    setCouponCode('');
    setMessage(null);
  };

  const calculateDiscount = () => {
    if (!discountInfo) return 0;
    if (discountInfo.type === 'percent') {
      return (orderAmount * discountInfo.value) / 100;
    }
    return discountInfo.value;
  };

  const discountAmount = calculateDiscount();
  const finalTotal = Math.max(0, orderAmount - discountAmount);

  const placeOrder = async () => {
    if (!customerName || !customerEmail || !customerPhone || !customerAddress) {
      setMessage({ text: 'Please fill in all shipping details', type: 'error' });
      return;
    }
    if (cart.length === 0) {
      setMessage({ text: 'Your cart is empty', type: 'error' });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const items = cart.map(item => ({
        productId: item._id,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
      }));

      const payload = {
        customerName,
        customerEmail,
        customerPhone,
        customerAddress,
        items,
        subTotal: orderAmount,
        discountAmount: discountAmount,
        couponCode: discountInfo?.code,
        totalAmount: finalTotal,
      };

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to place order');
      }

      clearCart();
      setMessage({ text: 'Order placed successfully!', type: 'success' });
      setTimeout(() => {
        router.push('/');
      }, 2000);
    } catch (error: any) {
      setMessage({ text: error.message, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-base-200 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Order Summary Form / Mock Cart Items */}
          <div className="md:col-span-2 space-y-6">
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title">Order Items</h2>
                {cart.length === 0 ? (
                  <p className="text-base-content/70 text-sm">Your cart is empty.</p>
                ) : (
                  cart.map(item => (
                    <div key={item._id} className="flex justify-between items-center border-b border-base-200 py-4 last:border-b-0">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-base-300 rounded-md overflow-hidden relative">
                          {item.image && <img src={item.image} alt={item.name} className="object-cover w-full h-full" />}
                        </div>
                        <div>
                          <h3 className="font-semibold">{item.name}</h3>
                          <p className="text-sm text-base-content/60">Quantity: {item.quantity}</p>
                        </div>
                      </div>
                      <div className="font-semibold">${(item.price * item.quantity).toFixed(2)}</div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title mb-4">Shipping Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="form-control">
                    <label className="label"><span className="label-text">Full Name</span></label>
                    <input type="text" placeholder="John Doe" className="input input-bordered w-full" value={customerName} onChange={e => setCustomerName(e.target.value)} />
                  </div>
                  <div className="form-control">
                    <label className="label"><span className="label-text">Email</span></label>
                    <input type="email" placeholder="john@example.com" className="input input-bordered w-full" value={customerEmail} onChange={e => setCustomerEmail(e.target.value)} />
                  </div>
                  <div className="form-control">
                    <label className="label"><span className="label-text">Phone Number</span></label>
                    <input type="tel" placeholder="+1 234 567 8900" className="input input-bordered w-full" value={customerPhone} onChange={e => setCustomerPhone(e.target.value)} />
                  </div>
                  <div className="form-control">
                    <label className="label"><span className="label-text">Address</span></label>
                    <input type="text" placeholder="123 Street Name, City, Country" className="input input-bordered w-full" value={customerAddress} onChange={e => setCustomerAddress(e.target.value)} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary & Coupon Section */}
          <div className="space-y-6">
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title mb-4">Order Summary</h2>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>${orderAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>Free</span>
                  </div>
                  
                  {discountInfo && (
                    <div className="flex justify-between text-success">
                      <span>Discount ({discountInfo.code})</span>
                      <span>-${discountAmount.toFixed(2)}</span>
                    </div>
                  )}
                  
                  <div className="divider my-2"></div>
                  
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>${finalTotal.toFixed(2)}</span>
                  </div>
                </div>

                <div className="divider">Have a coupon?</div>

                <div className="form-control w-full">
                  {!discountInfo ? (
                    <div className="join w-full">
                      <input 
                        type="text" 
                        placeholder="Coupon code" 
                        className="input input-bordered join-item w-full uppercase" 
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                        disabled={loading}
                      />
                      <button 
                        className="btn btn-primary join-item"
                        onClick={applyCoupon}
                        disabled={loading || !couponCode}
                      >
                        {loading ? <span className="loading loading-spinner loading-sm"></span> : 'Apply'}
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between bg-success/10 p-3 rounded-lg border border-success/20">
                      <div className="flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        <span className="font-semibold text-success">{discountInfo.code}</span>
                      </div>
                      <button onClick={removeCoupon} className="btn btn-ghost btn-xs text-error hover:bg-error/20">Remove</button>
                    </div>
                  )}
                  
                  {message && (
                    <label className="label">
                      <span className={`label-text-alt ${message.type === 'error' ? 'text-error' : 'text-success'}`}>
                        {message.text}
                      </span>
                    </label>
                  )}
                </div>

                <button 
                  className="btn btn-primary w-full mt-4" 
                  onClick={placeOrder} 
                  disabled={loading || cart.length === 0}
                >
                  {loading ? <span className="loading loading-spinner"></span> : 'Place Order'}
                </button>
              </div>
            </div>
            
            <div className="alert alert-info text-sm">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              <span>Try creating a coupon in the <Link href="/dashboard/coupons" className="font-bold underline">Coupons Dashboard</Link> and test it here!</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
