'use client';

import { useEffect, useState } from 'react';
import { TbAlertCircle, TbWind, TbCheck, TbRefresh } from 'react-icons/tb';

type Product = {
  _id: string;
  name: string;
  price: number;
  images?: string[];
  image?: string;
  isCycloneOffer?: boolean;
  cyclonePrice?: number;
};

export default function CycloneOfferAdminPage() {
  const [isActive, setIsActive] = useState(false);
  const [endTime, setEndTime] = useState('');
  const [saving, setSaving] = useState(false);
  const [settingsMsg, setSettingsMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [productMsg, setProductMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    fetch('/api/cyclone-offer')
      .then(r => r.json())
      .then(data => {
        if (data.endTime) setEndTime(new Date(data.endTime).toISOString().slice(0, 16));
        if (typeof data.isActive === 'boolean') setIsActive(data.isActive);
      })
      .catch(() => {});

    setLoadingProducts(true);
    fetch('/api/products')
      .then(r => r.json())
      .then(data => {
        setProducts(Array.isArray(data) ? data : data.products || []);
      })
      .catch(() => setProducts([]))
      .finally(() => setLoadingProducts(false));
  }, []);

  const handleSaveSettings = async () => {
    if (!endTime) {
      setSettingsMsg({ type: 'error', text: 'Please set an end time.' });
      return;
    }
    setSaving(true);
    try {
      const res = await fetch('/api/cyclone-offer', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive, endTime: new Date(endTime) }),
      });
      setSettingsMsg(res.ok ? { type: 'success', text: 'Settings saved!' } : { type: 'error', text: 'Failed!' });
    } catch {
      setSettingsMsg({ type: 'error', text: 'Error!' });
    } finally {
      setSaving(false);
      setTimeout(() => setSettingsMsg(null), 3000);
    }
  };

  const handleProductUpdate = async (productId: string, isCycloneOffer: boolean, cyclonePrice: number) => {
    try {
      const res = await fetch(`/api/products/${productId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isCycloneOffer, cyclonePrice }),
      });
      if (res.ok) {
        setProducts(prev => prev.map(p => p._id === productId ? { ...p, isCycloneOffer, cyclonePrice } : p));
        setProductMsg({ type: 'success', text: 'Updated!' });
      }
    } catch {
      setProductMsg({ type: 'error', text: 'Error!' });
    } finally {
      setTimeout(() => setProductMsg(null), 3000);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 p-6">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-cyan-100 rounded-2xl text-cyan-600">
          <TbWind className="text-3xl animate-spin-slow" />
        </div>
        <div>
          <h1 className="text-3xl font-black text-base-content">Cyclone Offer <span className="text-cyan-500 uppercase text-sm">Manager</span></h1>
          <p className="text-base-content/50 text-sm">Create high-urgency tornado deals</p>
        </div>
      </div>

      <div className="card bg-base-100 shadow-2xl border border-cyan-200">
        <div className="card-body">
          <h2 className="card-title text-cyan-600"><TbWind /> Global Status</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="form-control">
              <label className="label"><span className="label-text font-bold">End Time</span></label>
              <input type="datetime-local" className="input input-bordered focus:input-cyan" value={endTime} onChange={e => setEndTime(e.target.value)} />
            </div>
            <div className="form-control">
              <label className="label"><span className="label-text font-bold">Active</span></label>
              <input type="checkbox" className="toggle toggle-info" checked={isActive} onChange={e => setIsActive(e.target.checked)} />
            </div>
          </div>
          <div className="card-actions justify-end mt-4">
             {settingsMsg && <span className={settingsMsg.type === 'success' ? 'text-success' : 'text-error'}>{settingsMsg.text}</span>}
             <button className="btn btn-info text-white" onClick={handleSaveSettings} disabled={saving}>{saving ? 'Saving...' : 'Save Settings'}</button>
          </div>
        </div>
      </div>

      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">Products in Cyclone</h2>
          {loadingProducts ? <span className="loading loading-spinner text-info"></span> : (
            <div className="space-y-4">
              {products.map(p => (
                <div key={p._id} className={`flex items-center gap-4 p-4 rounded-2xl border ${p.isCycloneOffer ? 'border-cyan-400 bg-cyan-50' : 'border-base-200'}`}>
                  <img src={p.image || p.images?.[0]} className="w-12 h-12 rounded-lg object-cover" />
                  <div className="flex-1">
                    <p className="font-bold">{p.name}</p>
                    <p className="text-xs opacity-50">${p.price}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <input 
                      type="number" 
                      placeholder="Cyclone Price" 
                      className="input input-sm input-bordered w-24"
                      defaultValue={p.cyclonePrice || p.price}
                      onBlur={(e) => handleProductUpdate(p._id, p.isCycloneOffer || false, parseFloat(e.target.value))}
                    />
                    <input 
                      type="checkbox" 
                      className="checkbox checkbox-info"
                      checked={p.isCycloneOffer}
                      onChange={(e) => handleProductUpdate(p._id, e.target.checked, p.cyclonePrice || p.price)}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <style jsx>{`
        .animate-spin-slow {
          animation: spin 8s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
