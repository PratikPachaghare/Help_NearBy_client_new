import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiCall } from '../../../../utils/ApiCalls';
import { Endpoints } from '../../../../utils/Endpiont';

function ProductCard({ product, onAdd }) {
  const [imgError, setImgError] = useState(false);
  const [adding, setAdding] = useState(false);

  const handleAdd = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (adding) return;
    setAdding(true);
    try {
      await onAdd(product);
    } finally {
      setAdding(false);
    }
  };

  return (
      <div className="bg-white rounded-2xl p-4 overflow-hidden shadow-sm border border-[#dce8ee] hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
      <div className="h-50 bg-gray-100 rounded flex items-center justify-center overflow-hidden">
        {product.images?.[0] && !imgError ? (
          <img src={product.images[0]} alt={product.name} className="h-full w-full object-cover" onError={() => setImgError(true)} />
        ) : (
          <span className="text-gray-400">No Image</span>
        )}
      </div>
        <h3 className="font-bold text-[#14343f] line-clamp-2 min-h-12">{product.name}</h3>
      <p className="text-sm text-gray-500">{product.category || 'General'}</p>
      <div className="flex justify-between items-center">
        <span className="font-bold">Rs {product.price}</span>
          <button
            onClick={handleAdd}
            disabled={adding}
            className="bg-[#0f3d4c] text-white px-4 py-2 rounded-lg hover:bg-[#184d5f] transition-colors font-semibold"
          >
          {adding ? 'Adding...' : 'Add'}
        </button>
      </div>
    </div>
  );
}

export default function GroceryHome() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const resp = await apiCall('GET', Endpoints.Products.List, {}, search ? { search } : {});
      setProducts(resp?.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const grouped = useMemo(() => {
    const groups = {};
    for (const p of products) {
      const key = p.category || 'General';
      if (!groups[key]) groups[key] = [];
      groups[key].push(p);
    }
    return groups;
  }, [products]);

  const addToCart = async (product) => {
    try {
      await apiCall('POST', Endpoints.Cart.AddItem, { productId: product._id, qty: 1 });
      alert('Added to cart');
    } catch (err) {
      alert(err?.response?.data?.message || 'Failed to add item');
    }
  };

  return (
    <div className="min-h-screen bg-[#f3f8fa] p-4 rounded-2xl border border-[#dce8ee]">
      <div className="bg-white rounded-xl p-3 shadow-sm border border-[#dce8ee] mb-4 flex gap-3 flex-wrap">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search products"
          className="flex-1 border border-[#cfe0e8] rounded px-3 py-2 min-w-56"
        />
        <button onClick={fetchProducts} className="bg-[#0f3d4c] text-white px-4 rounded hover:bg-[#14566c]">Search</button>
        <button onClick={() => navigate('/grocery/cart')} className="bg-[#14566c] text-white px-4 rounded hover:bg-[#0f3d4c]">Cart</button>
        <button onClick={() => navigate('/grocery/myOrders')} className="bg-[#2b9fb6] text-white px-4 rounded hover:bg-[#22859a]">Orders</button>
      </div>

      {loading ? <p>Loading products...</p> : null}

      {!loading && Object.keys(grouped).length === 0 ? <p>No products available</p> : null}

      {Object.entries(grouped).map(([category, rows]) => (
        <section key={category} className="mb-8">
          <h2 className="text-xl font-bold mb-3 text-[#173844]">{category}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {rows.map((product) => (
              <div key={product._id} onClick={() => navigate(`/grocery/product/${product._id}`)} className="cursor-pointer">
                <ProductCard product={product} onAdd={addToCart} />
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
