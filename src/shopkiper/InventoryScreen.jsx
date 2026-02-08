// 2. INVENTORY (PRODUCT) COMPONENT
import React, { useState, useEffect } from 'react';


export const InventoryScreen = ({ products, setProducts }) => {
  const [newProd, setNewProd] = useState({ name: '', price: '' });

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      setProducts(products.filter(p => p.id !== id));
    }
  };

  const toggleStock = (id) => {
    setProducts(products.map(p => {
      if (p.id === id) {
        return { ...p, status: p.status === 'Active' ? 'Out of Stock' : 'Active' };
      }
      return p;
    }));
  };

  const addProduct = () => {
    if (!newProd.name || !newProd.price) return alert("Fill details");
    const item = {
      id: Date.now(),
      name: newProd.name,
      price: parseInt(newProd.price),
      stock: 10, sold: 0, status: 'Active'
    };
    setProducts([...products, item]);
    setNewProd({ name: '', price: '' });
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">📦 Manage Inventory</h2>
      
      {/* Add Product Form */}
      <div className="flex gap-2 mb-6 bg-gray-50 p-4 rounded">
        <input 
          placeholder="Product Name" 
          value={newProd.name}
          onChange={(e) => setNewProd({...newProd, name: e.target.value})}
          className="border p-2 rounded flex-1"
        />
        <input 
          placeholder="Price" 
          type="number"
          value={newProd.price}
          onChange={(e) => setNewProd({...newProd, price: e.target.value})}
          className="border p-2 rounded w-32"
        />
        <button onClick={addProduct} className="bg-blue-600 text-white px-4 py-2 rounded">Add Product</button>
      </div>

      {/* Product List */}
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2">Name</th>
            <th className="p-2">Price</th>
            <th className="p-2">Sold</th>
            <th className="p-2">Status</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map(p => (
            <tr key={p.id} className="border-b">
              <td className="p-2">{p.name}</td>
              <td className="p-2">₹{p.price}</td>
              <td className="p-2">{p.sold}</td>
              <td className="p-2">
                <span className={`px-2 py-1 rounded text-sm ${p.status === 'Active' ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`}>
                  {p.status}
                </span>
              </td>
              <td className="p-2 flex gap-2">
                <button 
                  onClick={() => toggleStock(p.id)}
                  className="text-xs bg-yellow-400 px-2 py-1 rounded hover:bg-yellow-500">
                  {p.status === 'Active' ? 'Mark Out of Stock' : 'Mark Active'}
                </button>
                <button 
                  onClick={() => handleDelete(p.id)}
                  className="text-xs bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600">
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};