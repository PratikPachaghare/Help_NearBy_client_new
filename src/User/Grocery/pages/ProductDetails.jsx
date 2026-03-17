import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { apiCall } from '../../../utils/ApiCalls';
import { Endpoints } from '../../../utils/Endpiont';

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    apiCall('GET', Endpoints.Products.ById(id))
      .then((resp) => setProduct(resp?.data || null))
      .catch(() => setProduct(null))
      .finally(() => setLoading(false));
  }, [id]);

  const addToCart = async () => {
    try {
      await apiCall('POST', Endpoints.Cart.AddItem, { productId: id, qty: 1 });
      alert('Added to cart');
    } catch (err) {
      alert(err?.response?.data?.message || 'Failed to add');
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;
  if (!product) return <div className="p-6">Product not found</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-4xl mx-auto bg-white rounded-xl p-6 shadow grid md:grid-cols-2 gap-6">
        <div className="h-72 bg-gray-100 rounded flex items-center justify-center overflow-hidden">
          {product.images?.[0] && !imgError ? (
            <img src={product.images[0]} alt={product.name} className="h-full w-full object-cover" onError={() => setImgError(true)} />
          ) : (
            <span>No image</span>
          )}
        </div>
        <div>
          <h1 className="text-2xl font-bold mb-2">{product.name}</h1>
          <p className="text-gray-500 mb-3">{product.category || 'General'}</p>
          <p className="text-3xl font-black mb-3">Rs {product.price}</p>
          <p className="text-sm text-gray-600 mb-6">{product.description || 'No description available.'}</p>
          <div className="flex gap-3">
            <button onClick={addToCart} className="bg-blue-600 text-white px-5 py-3 rounded font-semibold">Add to Cart</button>
            <button onClick={() => navigate('/grocery/cart')} className="bg-black text-white px-5 py-3 rounded font-semibold">Go to Cart</button>
          </div>
        </div>
      </div>
    </div>
  );
}
