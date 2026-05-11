'use client';

import axiosInstance from '@/lib/axios';
import { useState } from 'react';
import useSWR from 'swr';

type Product = {
  _id?: string;
  name: string;
  description?: string;
  price: number | string;
  originalPrice?: number | string;
  soldPercentage?: number | string;
  stock?: number | string;
  category?: string;
  subcategory?: string;
  image?: string;
  isFeatured?: boolean;
  discountPercent?: number | string;
  flashSalePrice?: number | string;
  flashSaleEndsAt?: string;
  colors?: string | string[];
  sizes?: string | string[];
  isDisabled?: boolean;
};

const emptyForm: Product = {
  name: '',
  description: '',
  price: '',
  originalPrice: '',
  soldPercentage: '',
  stock: '',
  category: '',
  subcategory: '',
  image: '',
  isFeatured: false,
  discountPercent: '',
  flashSalePrice: '',
  flashSaleEndsAt: '',
  colors: '',
  sizes: '',
  isDisabled: false,
};

// ---------------- FETCHER ----------------
const fetcher = (url: string) => axiosInstance.get(url).then(res => res.data);

// ---------------- COMPONENT ----------------
export default function ProductsDashboard() {
  const { data, isLoading, mutate } = useSWR<Product[]>('/api/products?all=true', fetcher);

  const products = data || [];

  const [formData, setFormData] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const toOptionalNumber = (value: number | string | undefined) => {
    if (value === '' || value === undefined || value === null) return undefined;
    const n = Number(value);
    return Number.isNaN(n) ? undefined : n;
  };

  const normalizePayload = (product: Product) => ({
    ...product,
    price: toOptionalNumber(product.price),
    originalPrice: toOptionalNumber(product.originalPrice),
    soldPercentage: toOptionalNumber(product.soldPercentage),
    stock: toOptionalNumber(product.stock),
    discountPercent: toOptionalNumber(product.discountPercent),
    flashSalePrice: toOptionalNumber(product.flashSalePrice),
    flashSaleEndsAt: product.flashSaleEndsAt ? product.flashSaleEndsAt : undefined,
    isFeatured: Boolean(product.isFeatured),
    isDisabled: Boolean(product.isDisabled),
    colors: typeof product.colors === 'string' ? product.colors.split(',').map(s => s.trim()).filter(Boolean) : product.colors,
    sizes: typeof product.sizes === 'string' ? product.sizes.split(',').map(s => s.trim()).filter(Boolean) : product.sizes,
  });

  const uploadToCloudinary = async (file: File) => {
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName || !uploadPreset) {
      setUploadError(
        'Missing Cloudinary env values: NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME and NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET.'
      );
      return;
    }

    setUploading(true);
    setUploadError(null);

    try {
      const body = new FormData();
      body.append('file', file);
      body.append('upload_preset', uploadPreset);

      const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: 'POST',
        body,
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.error?.message || 'Cloudinary upload failed');
      }

      setFormData(prev => ({ ...prev, image: data.secure_url || '' }));
    } catch (error: any) {
      setUploadError(error?.message || 'Image upload failed');
    } finally {
      setUploading(false);
    }
  };

  const openModal = () => {
    const modal = document.getElementById('product_modal') as HTMLDialogElement;
    modal?.showModal();
  };

  const closeModal = () => {
    const modal = document.getElementById('product_modal') as HTMLDialogElement;
    modal?.close();
  };

  // ---------------- INPUT ----------------
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const target = e.currentTarget;
    const { name, value } = target;
    const nextValue =
      target instanceof HTMLInputElement && target.type === 'checkbox' ? target.checked : value;
    setFormData({
      ...formData,
      [name]: nextValue,
    });
  };

  // ---------------- SUBMIT (CREATE / UPDATE) ----------------
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = normalizePayload(formData);

    try {
      if (editingId) {
        await axiosInstance.put(`/api/products/${editingId}`, payload);
      } else {
        await axiosInstance.post('/api/products', payload);
      }

      setFormData(emptyForm);
      setEditingId(null);

      closeModal();

      // 🔥 SWR refresh
      mutate();
    } catch (error) {
      console.error('Save error:', error);
    }
  };

  // ---------------- DELETE (OPTIMISTIC) ----------------
  const handleDelete = async (id: string) => {
    if (!confirm('Delete this product?')) return;

    try {
      // optimistic UI update
      // mutate(current => current?.filter(p => p._id !== id), false);

      await axiosInstance.delete(`/api/products/${id}`);

      mutate();
    } catch (error) {
      console.error('Delete error:', error);
      mutate(); // rollback
    }
  };

  const handleFeatureToggle = async (id: string, checked: boolean) => {
    setTogglingId(id);

    // Optimistic update so admin sees the change immediately.
    await mutate(
      current =>
        (current || []).map(product =>
          product._id === id ? { ...product, isFeatured: checked } : product
        ),
      false
    );

    try {
      await axiosInstance.put(`/api/products/${id}`, { isFeatured: checked });
      await mutate();
    } catch (error) {
      console.error('Feature toggle error:', error);
      await mutate(); // rollback from server truth
    } finally {
      setTogglingId(null);
    }
  };

  const handleDisableToggle = async (id: string, checked: boolean) => {
    setTogglingId(id);
    await mutate(
      current =>
        (current || []).map(product =>
          product._id === id ? { ...product, isDisabled: checked } : product
        ),
      false
    );
    try {
      await axiosInstance.put(`/api/products/${id}`, { isDisabled: checked });
      await mutate();
    } catch (error) {
      console.error('Disable toggle error:', error);
      await mutate();
    } finally {
      setTogglingId(null);
    }
  };

  // ---------------- EDIT ----------------
  const openEditModal = (product: Product) => {
    setFormData({
      name: product.name ?? '',
      description: product.description ?? '',
      price: product.price ?? '',
      originalPrice: product.originalPrice ?? '',
      soldPercentage: product.soldPercentage ?? '',
      stock: product.stock ?? '',
      category: product.category ?? '',
      subcategory: product.subcategory ?? '',
      image: product.image ?? '',
      isFeatured: product.isFeatured ?? false,
      discountPercent: product.discountPercent ?? '',
      flashSalePrice: product.flashSalePrice ?? '',
      flashSaleEndsAt: product.flashSaleEndsAt
        ? new Date(product.flashSaleEndsAt).toISOString().slice(0, 16)
        : '',
      colors: Array.isArray(product.colors) ? product.colors.join(', ') : '',
      sizes: Array.isArray(product.sizes) ? product.sizes.join(', ') : '',
      isDisabled: product.isDisabled ?? false,
    });

    setEditingId(product._id || null);

    openModal();
  };

  // ---------------- RENDER ----------------
  return (
    <div>
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Manage Products</h1>

        <button
          className="btn btn-primary"
          onClick={() => {
            setEditingId(null);
            setFormData(emptyForm);
            setUploadError(null);
            openModal();
          }}
        >
          Add Product
        </button>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto bg-base-100 rounded-box shadow">
        <table className="table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Category</th>
              <th>Subcategory</th>
              <th>Price</th>
              <th>Original Price</th>
              <th>Sold %</th>
              <th>Stock</th>
              <th>Featured</th>
              <th>Disabled</th>
              <th>Discount</th>
              <th>Flash Sale</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={12} className="text-center py-5">
                  Loading...
                </td>
              </tr>
            ) : (
              products.map(product => (
                <tr key={product._id}>
                  {/* IMAGE */}
                  <td>
                    {product.image ? (
                      <img
                        src={product.image}
                        className="w-12 h-12 rounded object-cover"
                        alt={product.name}
                      />
                    ) : (
                      <span>N/A</span>
                    )}
                  </td>

                  {/* NAME */}
                  <td>
                    <div className="font-bold">{product.name}</div>
                    <div className="text-xs opacity-60 truncate max-w-[150px]">
                      {product.description}
                    </div>
                  </td>

                  {/* CATEGORY */}
                  <td>{product.category}</td>
                  <td>{product.subcategory || '—'}</td>

                  {/* PRICE */}
                  <td>${product.price}</td>

                  {/* ORIGINAL PRICE */}
                  <td>
                    {product.originalPrice ? (
                      <span className="line-through opacity-60">${product.originalPrice}</span>
                    ) : (
                      '—'
                    )}
                  </td>

                  {/* SOLD */}
                  <td>{product.soldPercentage ?? '—'}%</td>

                  {/* STOCK */}
                  <td>{product.stock ?? '—'}</td>

                  <td>
                    <input
                      type="checkbox"
                      className="toggle toggle-sm toggle-primary"
                      checked={Boolean(product.isFeatured)}
                      disabled={togglingId === product._id}
                      onChange={e => handleFeatureToggle(product._id!, e.currentTarget.checked)}
                    />
                  </td>

                  <td>
                    <input
                      type="checkbox"
                      className="toggle toggle-sm toggle-error"
                      checked={Boolean(product.isDisabled)}
                      disabled={togglingId === product._id}
                      onChange={e => handleDisableToggle(product._id!, e.currentTarget.checked)}
                    />
                  </td>

                  <td>{product.discountPercent ? `${product.discountPercent}%` : '—'}</td>

                  <td>
                    {product.flashSaleEndsAt ? (
                      <span className="text-xs">
                        Ends {new Date(product.flashSaleEndsAt).toLocaleString()}
                      </span>
                    ) : (
                      '—'
                    )}
                  </td>

                  {/* ACTIONS */}
                  <td className="flex gap-2">
                    <button className="btn btn-sm btn-info" onClick={() => openEditModal(product)}>
                      Edit
                    </button>

                    <button
                      className="btn btn-sm btn-error"
                      onClick={() => handleDelete(product._id!)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL */}
      <dialog id="product_modal" className="modal">
        <div className="modal-box max-w-2xl">
          <h3 className="font-bold text-lg mb-4">{editingId ? 'Edit Product' : 'Add Product'}</h3>

          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Name"
              className="input input-bordered"
              required
            />

            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Description"
              className="textarea textarea-bordered"
            />

            <div className="flex gap-2">
              <input
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="Price"
                className="input input-bordered w-full"
              />

              <input
                name="originalPrice"
                value={formData.originalPrice}
                onChange={handleChange}
                placeholder="Original Price"
                className="input input-bordered w-full"
              />
            </div>

            <div className="flex gap-4">
              <div className="form-control">
                <label className="label cursor-pointer justify-start gap-3">
                  <input
                    type="checkbox"
                    name="isFeatured"
                    checked={Boolean(formData.isFeatured)}
                    onChange={handleChange}
                    className="checkbox checkbox-primary"
                  />
                  <span className="label-text">Mark as featured product</span>
                </label>
              </div>

              <div className="form-control">
                <label className="label cursor-pointer justify-start gap-3">
                  <input
                    type="checkbox"
                    name="isDisabled"
                    checked={Boolean(formData.isDisabled)}
                    onChange={handleChange}
                    className="checkbox checkbox-error"
                  />
                  <span className="label-text">Disable product</span>
                </label>
              </div>
            </div>

            <div className="flex gap-2">
              <input
                name="discountPercent"
                value={formData.discountPercent}
                onChange={handleChange}
                placeholder="Discount %"
                className="input input-bordered w-full"
              />

              <input
                name="flashSalePrice"
                value={formData.flashSalePrice}
                onChange={handleChange}
                placeholder="Flash Sale Price"
                className="input input-bordered w-full"
              />
            </div>

            <input
              type="datetime-local"
              name="flashSaleEndsAt"
              value={formData.flashSaleEndsAt}
              onChange={handleChange}
              className="input input-bordered"
            />

            <div className="flex gap-2">
              <input
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                placeholder="Stock"
                className="input input-bordered w-full"
              />

              <input
                name="soldPercentage"
                value={formData.soldPercentage}
                onChange={handleChange}
                placeholder="Sold %"
                className="input input-bordered w-full"
              />
            </div>

            <input
              name="category"
              value={formData.category}
              onChange={handleChange}
              placeholder="Category"
              className="input input-bordered"
            />

            <input
              name="subcategory"
              value={formData.subcategory}
              onChange={handleChange}
              placeholder="Subcategory"
              className="input input-bordered"
            />

            <div className="flex gap-2">
              <input
                name="colors"
                value={formData.colors as string}
                onChange={handleChange}
                placeholder="Colors (comma separated: Red, Blue, Green)"
                className="input input-bordered w-full"
              />

              <input
                name="sizes"
                value={formData.sizes as string}
                onChange={handleChange}
                placeholder="Sizes (comma separated: S, M, L, XL)"
                className="input input-bordered w-full"
              />
            </div>

            <input
              type="file"
              accept="image/*"
              className="file-input file-input-bordered"
              onChange={e => {
                const file = e.currentTarget.files?.[0];
                if (file) {
                  uploadToCloudinary(file);
                }
              }}
            />

            {uploading ? <p className="text-xs text-base-content/70">Uploading image...</p> : null}
            {uploadError ? <p className="text-xs text-error">{uploadError}</p> : null}

            <input
              name="image"
              value={formData.image}
              onChange={handleChange}
              placeholder="Image URL"
              className="input input-bordered"
            />

            <div className="flex justify-end gap-2 mt-3">
              <button type="button" className="btn" onClick={closeModal}>
                Cancel
              </button>

              <button type="submit" className="btn btn-primary">
                {editingId ? 'Update' : 'Save'}
              </button>
            </div>
          </form>
        </div>

        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </div>
  );
}
