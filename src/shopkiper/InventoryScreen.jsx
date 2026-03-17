import React, { useState } from 'react';

const CATEGORY_OPTIONS = ['Fruits', 'Vegetables', 'Dairy', 'Bakery', 'Snacks', 'Beverages', 'Personal Care', 'Household', 'General'];
const MEDICAL_CATEGORY_OPTIONS = ['Medicines', 'Supplements', 'General Products', 'Medical Devices', 'First Aid', 'Wellness', 'Other'];

export const InventoryScreen = ({ products, mode = 'grocery', isKycVerified, onCreate, onUpdate, onDelete, onRefresh }) => {
  const isMedical = mode === 'medical';
  const categoryOptions = isMedical ? MEDICAL_CATEGORY_OPTIONS : CATEGORY_OPTIONS;
  const [listCategoryFilter, setListCategoryFilter] = useState('all');
  const [form, setForm] = useState({
    name: '',
    sku: '',
    category: isMedical ? 'Medicines' : 'General',
    brand: '',
    description: '',
    price: '',
    discountedPrice: '',
    mrp: '',
    stock: '',
    minOrderQty: '1',
    maxOrderQty: '',
    unit: 'unit',
    tagsText: '',
    imagesText: ''
  });
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [imagePreview, setImagePreview] = useState('');

  const fileToDataUrl = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

  const resetForm = () => {
    setForm({
      name: '',
      sku: '',
      category: isMedical ? 'Medicines' : 'General',
      brand: '',
      description: '',
      price: '',
      discountedPrice: '',
      mrp: '',
      stock: '',
      minOrderQty: '1',
      maxOrderQty: '',
      unit: 'unit',
      tagsText: '',
      imagesText: ''
    });
    setImagePreview('');
    setEditingId(null);
  };

  const handleSubmit = async () => {
    if (!isKycVerified) {
      return alert('Please complete KYC verification before adding or updating products.');
    }
    if (!form.name || !form.price) return alert('Please fill product name and price');
    setSaving(true);
    try {
      const tags = form.tagsText.split(',').map((row) => row.trim()).filter(Boolean);
      const images = form.imagesText.split(',').map((row) => row.trim()).filter(Boolean);
      const payload = {
        name: form.name,
        sku: form.sku,
        category: form.category || 'General',
        brand: form.brand,
        description: form.description,
        price: Number(form.price),
        discountedPrice: form.discountedPrice ? Number(form.discountedPrice) : undefined,
        mrp: form.mrp ? Number(form.mrp) : undefined,
        stock: Number(form.stock || 0),
        minOrderQty: Number(form.minOrderQty || 1),
        maxOrderQty: form.maxOrderQty ? Number(form.maxOrderQty) : undefined,
        unit: form.unit || 'unit',
        tags,
        images: imagePreview ? [imagePreview, ...images] : images,
        isActive: Number(form.stock || 0) > 0
      };

      if (editingId) {
        await onUpdate(editingId, payload);
      } else {
        await onCreate(payload);
      }
      resetForm();
    } catch (err) {
      alert(err?.response?.data?.message || 'Unable to save product');
    } finally {
      setSaving(false);
    }
  };

  const startEdit = (p) => {
    setEditingId(p._id);
    setForm({
      name: p.name || '',
      sku: p.sku || '',
      price: p.price || '',
      category: p.category || 'General',
      brand: p.brand || '',
      description: p.description || '',
      discountedPrice: p.discountedPrice || '',
      mrp: p.mrp || '',
      stock: p.stock || 0,
      minOrderQty: p.minOrderQty || 1,
      maxOrderQty: p.maxOrderQty || '',
      unit: p.unit || 'unit',
      tagsText: (p.tags || []).join(', '),
      imagesText: (p.images || []).join(', ')
    });
    setImagePreview(p.images?.[0] || '');
  };

  const handleImageSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file');
      return;
    }

    try {
      const dataUrl = await fileToDataUrl(file);
      setImagePreview(String(dataUrl));
    } catch (err) {
      console.error(err);
      alert('Unable to read selected image');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      await onDelete(id);
    } catch (err) {
      alert(err?.response?.data?.message || 'Unable to delete product');
    }
  };

  const filteredProducts = listCategoryFilter === 'all'
    ? products
    : products.filter((p) => (p.category || '').toLowerCase() === listCategoryFilter.toLowerCase());

  return (
    <div className="space-y-4">
      <div className="bg-white border border-sky-100 rounded-2xl p-5 shadow-sm shadow-sky-100/50">
        <h2 className="text-xl font-bold text-sky-900 mb-3">Manage Inventory</h2>
        {!isKycVerified ? (
          <div className="mb-3 rounded border border-amber-300 bg-amber-50 text-amber-800 p-3 text-sm">
            KYC is not verified. Product add/update is locked until KYC is approved.
          </div>
        ) : null}
        <div className="grid md:grid-cols-4 gap-3">
          <input placeholder="Product name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="border border-sky-200 rounded-xl px-3 py-2 focus:border-sky-500 focus:outline-none" />
          <input placeholder="SKU" value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} className="border border-sky-200 rounded-xl px-3 py-2 focus:border-sky-500 focus:outline-none" />
          <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="border border-sky-200 rounded-xl px-3 py-2 focus:border-sky-500 focus:outline-none">
            {categoryOptions.map((row) => <option key={row} value={row}>{row}</option>)}
          </select>
          <input placeholder="Brand" value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} className="border border-sky-200 rounded-xl px-3 py-2 focus:border-sky-500 focus:outline-none" />
          <input placeholder="Price" type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="border border-sky-200 rounded-xl px-3 py-2 focus:border-sky-500 focus:outline-none" />
          <input placeholder="Discounted price" type="number" value={form.discountedPrice} onChange={(e) => setForm({ ...form, discountedPrice: e.target.value })} className="border border-sky-200 rounded-xl px-3 py-2 focus:border-sky-500 focus:outline-none" />
          <input placeholder="MRP" type="number" value={form.mrp} onChange={(e) => setForm({ ...form, mrp: e.target.value })} className="border border-sky-200 rounded-xl px-3 py-2 focus:border-sky-500 focus:outline-none" />
          <input placeholder="Stock" type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} className="border border-sky-200 rounded-xl px-3 py-2 focus:border-sky-500 focus:outline-none" />
          <input placeholder="Min order qty" type="number" value={form.minOrderQty} onChange={(e) => setForm({ ...form, minOrderQty: e.target.value })} className="border border-sky-200 rounded-xl px-3 py-2 focus:border-sky-500 focus:outline-none" />
          <input placeholder="Max order qty" type="number" value={form.maxOrderQty} onChange={(e) => setForm({ ...form, maxOrderQty: e.target.value })} className="border border-sky-200 rounded-xl px-3 py-2 focus:border-sky-500 focus:outline-none" />
          <input placeholder="Unit (kg, ltr, packet)" value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })} className="border border-sky-200 rounded-xl px-3 py-2 focus:border-sky-500 focus:outline-none" />
          <input placeholder="Tags (comma separated)" value={form.tagsText} onChange={(e) => setForm({ ...form, tagsText: e.target.value })} className="border border-sky-200 rounded-xl px-3 py-2 md:col-span-2 focus:border-sky-500 focus:outline-none" />
          <input placeholder="Image URLs (comma separated)" value={form.imagesText} onChange={(e) => setForm({ ...form, imagesText: e.target.value })} className="border border-sky-200 rounded-xl px-3 py-2 md:col-span-2 focus:border-sky-500 focus:outline-none" />

          <div className="md:col-span-2 rounded-xl border border-sky-200 bg-sky-50/50 px-3 py-2">
            <label className="text-xs font-semibold uppercase tracking-wide text-sky-700">Upload Product Image</label>
            <input type="file" accept="image/*" onChange={handleImageSelect} className="mt-2 block w-full text-xs text-slate-600 file:mr-3 file:rounded-lg file:border-0 file:bg-sky-600 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-white" />
            <p className="mt-1 text-[11px] text-slate-500">Uploaded image will be used as primary product image.</p>
          </div>
          <div className="md:col-span-2 rounded-xl border border-dashed border-sky-200 bg-white flex items-center justify-center min-h-29 overflow-hidden">
            {imagePreview ? <img src={imagePreview} alt="Product preview" className="h-full w-full object-cover" /> : <span className="text-xs text-slate-400">Image preview</span>}
          </div>

          <textarea placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="border border-sky-200 rounded-xl px-3 py-2 md:col-span-4 focus:border-sky-500 focus:outline-none" rows={2} />
          <div className="flex gap-2">
            <button disabled={saving} onClick={handleSubmit} className="flex-1 bg-sky-600 hover:bg-sky-500 text-white px-4 py-2 rounded-xl font-semibold disabled:opacity-60">
              {editingId ? 'Update' : 'Add'}
            </button>
            <button onClick={resetForm} className="px-3 py-2 rounded-xl border border-sky-200 text-sky-700 bg-white">Clear</button>
          </div>
        </div>
      </div>

      <div className="bg-white border border-sky-100 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-sky-100 flex items-center justify-between bg-sky-50/70">
          <p className="font-semibold text-sky-900">Products ({filteredProducts.length})</p>
          <div className="flex items-center gap-2">
            <select
              value={listCategoryFilter}
              onChange={(e) => setListCategoryFilter(e.target.value)}
              className="text-sm border border-sky-200 bg-white rounded-xl px-3 py-1.5 text-sky-700"
            >
              <option value="all">All Categories</option>
              {categoryOptions.map((row) => <option key={row} value={row}>{row}</option>)}
            </select>
            <button onClick={onRefresh} className="text-sm border border-sky-200 bg-white rounded-xl px-3 py-1.5 text-sky-700">Refresh</button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-sky-50 text-sky-800">
              <tr>
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Category</th>
                <th className="p-3 text-left">Price</th>
                <th className="p-3 text-left">Discount</th>
                <th className="p-3 text-left">Stock</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((p) => (
                <tr key={p._id} className="border-t border-sky-50">
                  <td className="p-3 font-medium">{p.name}</td>
                  <td className="p-3">{p.category || 'General'}</td>
                  <td className="p-3">Rs {p.price}</td>
                  <td className="p-3">{p.discountedPrice ? `Rs ${p.discountedPrice}` : '-'}</td>
                  <td className="p-3">{p.stock}</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${p.isActive ? 'bg-sky-100 text-sky-700' : 'bg-rose-100 text-rose-700'}`}>
                      {p.isActive ? 'Active' : 'Out of Stock'}
                    </span>
                  </td>
                  <td className="p-3 flex gap-2">
                    {p.images?.[0] ? <img src={p.images[0]} alt={p.name} className="h-10 w-10 rounded-lg object-cover border border-sky-100" /> : null}
                    <button onClick={() => startEdit(p)} className="px-2 py-1 rounded border border-sky-200 text-xs text-sky-700">Edit</button>
                    <button onClick={() => handleDelete(p._id)} className="px-2 py-1 rounded bg-rose-600 text-white text-xs">Delete</button>
                  </td>
                </tr>
              ))}
              {!filteredProducts.length && (
                <tr>
                  <td colSpan={7} className="p-4 text-center text-slate-500">No products found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};