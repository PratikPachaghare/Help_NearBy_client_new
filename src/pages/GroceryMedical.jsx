import { useState, useEffect, useCallback } from 'react';
import { Search, Star, ShoppingCart, Pill, Leaf, ClipboardList } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../utils/api';
import { Endpoints } from '../utils/Endpiont';

const GroceryMedical = ({ type = 'grocery' }) => {
  const navigate = useNavigate();
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('latest');
  const [cartCount, setCartCount] = useState(0);
  const [medicalTotal, setMedicalTotal] = useState(0);
  const isMedical = type === 'medical';

  const categories = {
    grocery: ['Vegetables', 'Fruits', 'Dairy', 'Bakery', 'Spices', 'Snacks'],
    medical: ['Medicines', 'Supplements', 'General Products', 'Medical Devices', 'First Aid', 'Wellness', 'Other']
  };

  const typeCategories = categories[type] || categories.grocery;

  const fetchCartCount = useCallback(async () => {
    try {
      const response = await api.get(Endpoints.Cart.Get);
      setCartCount(response?.data?.data?.items?.length || 0);
    } catch {
      setCartCount(0);
    }
  }, []);

  useEffect(() => {
    fetchCartCount();
  }, [fetchCartCount]);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const endpoint = type === 'medical' ? Endpoints.Medical.Products : Endpoints.Products.List;

      if (isMedical) {
        const response = await api.get(endpoint, {
          params: {
            search: searchQuery || undefined,
            sortBy
          }
        });
        const rows = response.data.data || [];
        setMedicalTotal(rows.length);

        let filtered = [...rows];
        if (selectedCategory !== 'all') {
          const target = selectedCategory.trim().toLowerCase();
          filtered = filtered.filter((p) => {
            const category = String(p.category || '').trim().toLowerCase();
            if (!category) return false;
            if (category === target) return true;
            if (target === 'general products') {
              return category === 'general';
            }
            return false;
          });
        }

        if (selectedCategory !== 'all' && !searchQuery && filtered.length === 0 && rows.length > 0) {
          setSelectedCategory('all');
          setFilteredProducts(rows);
          return;
        }

        setFilteredProducts(filtered);
        return;
      }

      const response = await api.get(endpoint);
      const rows = response.data.data || [];

      let filtered = [...rows];

      if (selectedCategory !== 'all') {
        filtered = filtered.filter((p) => p.category === selectedCategory);
      }

      if (searchQuery) {
        filtered = filtered.filter((p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.brand?.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }

      switch (sortBy) {
        case 'price_asc':
          filtered.sort((a, b) => (a.discountedPrice || a.price) - (b.discountedPrice || b.price));
          break;
        case 'price_desc':
          filtered.sort((a, b) => (b.discountedPrice || b.price) - (a.discountedPrice || a.price));
          break;
        case 'rating':
          filtered.sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0));
          break;
        case 'latest':
        default:
          filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      }

      setFilteredProducts(filtered);
    } catch (error) {
      toast.error('Failed to load products');
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [isMedical, searchQuery, selectedCategory, sortBy, type]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleAddToCart = async (product, quantity = 1) => {
    try {
      await api.post(Endpoints.Cart.AddItem, { productId: product._id, qty: quantity });
      toast.success('Added to cart!');
      fetchCartCount();
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Please login first to add in cart');
    }
  };

  const title = type === 'medical' ? 'Medicines & Health' : 'Grocery & Fresh Supplies';
  const Icon = type === 'medical' ? Pill : Leaf;

  return (
    <div className="min-h-screen bg-[#f3f8fa] rounded-2xl border border-[#dce8ee] overflow-hidden">
      {/* Header */}
      <div className="bg-linear-to-r from-[#0f3d4c] via-[#14566c] to-[#2b9fb6] sticky top-0 z-10 py-4 px-4 text-white">
       <div className="flex items-center gap-2 mb-4">
            <button onClick={() => navigate(-1)} className="text-2xl">←</button>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Icon size={28} />
              {title}
            </h1>
          </div> 
          <div className="flex w-full gap-14 mx-auto">
        
          {/* Search */}
          <div className="relative w-2xl">
            <Search className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`Search ${type === 'medical' ? 'medicines' : 'products'}...`}
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-white text-gray-900 placeholder-gray-600 outline-none"
            />
          </div>

          <div className=" flex  gap-2">
            <button
              onClick={() => navigate(isMedical ? '/medical/cart' : '/grocery/cart')}
              className="bg-white/15 hover:bg-white/25 text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2"
            >
              <ShoppingCart size={16} />
              Cart
            </button>
            <button
              onClick={() => navigate(isMedical ? '/medical/myOrders' : '/grocery/myOrders')}
              className="bg-white/15 hover:bg-white/25 text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2"
            >
              <ClipboardList size={16} />
              My Orders
            </button>
          </div>

          {isMedical && (
            <div className="">
              <button
                onClick={() => navigate('/medical/prescriptions')}
                className="bg-[#2b9fb6] hover:bg-[#22859a] text-white px-4 py-2 rounded-lg text-sm font-semibold"
              >
                Upload Prescription
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-full mx-auto p-4">
        {/* Filters & Sort */}
        <div className="bg-white rounded-lg border border-[#dce8ee] p-4 mb-4 space-y-4">
          {/* Category Filter */}
          <div className="space-y-2">
            <label className="block font-semibold text-gray-900 text-sm">Category</label>
            <div className="flex gap-2 overflow-x-auto pb-2">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-4 py-2 rounded-lg whitespace-nowrap font-semibold text-sm transition ${
                  selectedCategory === 'all'
                    ? 'bg-[#0f3d4c] text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All
              </button>
              {typeCategories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-lg whitespace-nowrap font-semibold text-sm transition ${
                    selectedCategory === cat
                      ? 'bg-[#0f3d4c] text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Sort */}
          <div className="space-y-2">
            <label className="block font-semibold text-gray-900 text-sm">Sort By</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full p-2 border rounded-lg text-gray-900 outline-none focus:border-[#2b9fb6]"
            >
              <option value="latest">Latest First</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>
        </div>

        {/* Results Info */}
        <div className="mb-4 text-sm text-gray-600">
          {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} found
        </div>

        {isMedical && selectedCategory !== 'all' && filteredProducts.length === 0 && medicalTotal > 0 ? (
          <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800 flex items-center justify-between gap-3">
            <span>No products in selected category ({selectedCategory}).</span>
            <button
              onClick={() => setSelectedCategory('all')}
              className="px-3 py-1.5 rounded-md bg-[#0f3d4c] text-white font-semibold"
            >
              Show All
            </button>
          </div>
        ) : null}

        {/* Products Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin text-4xl">⏳</div>
            <p className="text-gray-600 mt-2">Loading products...</p>
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {filteredProducts.map(product => (
              <ProductCard
                key={product._id}
                product={product}
                onCardClick={() => navigate(isMedical ? `/medical/product/${product._id}` : `/grocery/product/${product._id}`)}
                onAddToCart={() => handleAddToCart(product)}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg p-8 text-center border border-[#dce8ee]">
            <Search className="mx-auto text-gray-400 mb-4" size={40} />
            <p className="text-gray-600 font-semibold">No products found</p>
            <p className="text-gray-500 text-sm">Try adjusting your search or filters</p>
          </div>
        )}
      </div>

      {/* Cart Button */}
      {cartCount > 0 && (
        <div className="fixed bottom-4 right-4 max-w-4xl mx-auto">
          <button
            onClick={() => navigate(isMedical ? '/medical/cart' : '/grocery/cart')}
            className="bg-[#0f3d4c] text-white px-6 py-3 rounded-full font-semibold shadow-lg hover:bg-[#14566c] transition flex items-center gap-2 w-full"
          >
            <ShoppingCart size={20} />
            View Cart ({cartCount} items)
          </button>
        </div>
      )}
    </div>
  );
};

// Product Card Component
const ProductCard = ({ product, onCardClick, onAddToCart }) => {
  const discount = product.mrp
    ? Math.round(((product.mrp - (product.discountedPrice || product.price)) / product.mrp) * 100)
    : 0;
  const [adding, setAdding] = useState(false);

  const handleAddClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (adding || product.stock === 0) return;
    setAdding(true);
    try {
      await onAddToCart();
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl overflow-hidden hover:shadow-xl hover:-translate-y-1 border border-[#dce8ee] transition-all duration-300 flex flex-col h-full">
      <div className="relative aspect-square bg-gray-100 overflow-hidden cursor-pointer" onClick={onCardClick}>
        <img
          src={product.images?.[0] || '/placeholder.png'}
          alt={product.name}
          className="w-full h-full object-cover hover:scale-110 transition duration-500"
        />
          <div className="absolute inset-0 bg-linear-to-t from-black/35 via-black/0 to-transparent" />
        {discount > 0 && (
          <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-bold">
            -{discount}%
          </div>
        )}
        {product.requiresPrescription && (
          <div className="absolute top-2 left-2 bg-[#0f3d4c] text-white px-2 py-1 rounded text-xs font-bold">
            Rx
          </div>
        )}
      </div>

      <div className="p-3 flex flex-col flex-1 bg-linear-to-b from-white to-[#f6fbfc]">
        <h3 className="font-bold text-sm text-[#14343f] line-clamp-2 mb-2 cursor-pointer hover:text-[#14566c]" onClick={onCardClick}>
          {product.name}
        </h3>

        {product.brand && (
          <p className="text-xs text-gray-600 mb-1">{product.brand}</p>
        )}

        {/* Rating */}
        <div className="flex items-center gap-1 mb-2">
          <Star size={12} className="text-yellow-500" fill="currentColor" />
          <span className="text-xs font-semibold">
            {product.averageRating || 4.5}
          </span>
          <span className="text-xs text-gray-600">({product.totalReviews || 0})</span>
        </div>

        {/* Prices */}
        <div className="mb-2">
          <div className="flex items-baseline gap-1">
            <span className="font-black text-lg text-[#173844]">
              ₹{product.discountedPrice || product.price}
            </span>
            {product.mrp && product.mrp !== (product.discountedPrice || product.price) && (
              <span className="text-xs text-gray-500 line-through">₹{product.mrp}</span>
            )}
          </div>
          {product.unit && (
            <p className="text-xs text-gray-600">{product.unit}</p>
          )}
          {product.category && (
            <p className="text-[11px] mt-1 inline-flex px-2 py-1 rounded-full bg-[#eef5f8] text-[#14566c] font-semibold">{product.category}</p>
          )}
        </div>

        {/* Stock & Button */}
        <div className="mt-auto space-y-2">
          <p className={`text-xs font-semibold ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
            {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
          </p>
          {product.requiresPrescription ? (
            <p className="text-[11px] text-amber-700 bg-amber-50 border border-amber-200 rounded px-2 py-1">Prescription check required before dispatch</p>
          ) : null}
          <button
            onClick={handleAddClick}
            disabled={product.stock === 0 || adding}
            className="w-full bg-[#0f3d4c] text-white py-2 rounded font-semibold text-sm hover:bg-[#14566c] transition disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {adding ? 'Adding...' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default GroceryMedical;
