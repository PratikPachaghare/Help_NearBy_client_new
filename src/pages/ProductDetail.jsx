import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../utils/AuthContext';
import { apiCall } from '../utils/ApiCalls';
import { Endpoints } from '../utils/Endpiont';
import { Heart, ShoppingCart, MapPin, Star, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const isMedicalPath = location.pathname.includes('/medical');
  
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
  const [showReviewForm, setShowReviewForm] = useState(false);

  const fetchProductDetail = useCallback(async () => {
    try {
      setLoading(true);
      const response = await apiCall('GET', `${Endpoints.Products.ById(id)}/detail`);
      const { product, reviews, averageRating, relatedProducts } = response.data;
      
      setProduct({ ...product, averageRating });
      setReviews(reviews);
      setRelatedProducts(relatedProducts);
      setSelectedImage(0);
    } catch (error) {
      toast.error('Failed to load product');
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchProductDetail();
  }, [fetchProductDetail]);

  const handleAddToCart = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      await apiCall('POST', Endpoints.Cart.AddItem, { productId: product._id, qty: quantity });
      toast.success('Added to cart!');
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to add to cart');
    }
  };

  const handleSubmitReview = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      await apiCall('POST', '/reviews', {
        targetType: 'product',
        targetId: product._id,
        rating: newReview.rating,
        comment: newReview.comment
      });
      
      toast.success('Review submitted!');
      setNewReview({ rating: 5, comment: '' });
      setShowReviewForm(false);
      fetchProductDetail();
    } catch {
      toast.error('Failed to submit review');
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">
      <div className="animate-spin text-4xl">⏳</div>
    </div>;
  }

  if (!product) {
    return <div className="text-center py-12">Product not found</div>;
  }

  const discount = product.mrp 
    ? Math.round(((product.mrp - (product.discountedPrice || product.price)) / product.mrp) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-[#f4f8fb] pb-24 lg:pb-6">
      <div className="bg-white sticky top-0 z-20 py-4 px-4 flex items-center gap-4 border-b">
        <button onClick={() => navigate(-1)} className="text-2xl">←</button>
        <h1 className="flex-1 font-bold text-lg truncate">{product.name}</h1>
      </div>

      <div className="max-w-6xl mx-auto p-4">
        <div className="bg-white rounded-2xl shadow-sm border border-[#dce8ee] p-4 lg:p-6 grid lg:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div className="aspect-square bg-gray-100 rounded-xl relative overflow-hidden">
              <img 
                src={product.images?.[selectedImage] || '/placeholder.png'} 
                alt={product.name}
                className="w-full h-full object-cover"
              />
              {discount > 0 && (
                <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                  -{discount}%
                </div>
              )}
              {product.requiresPrescription && (
                <div className="absolute bottom-4 left-4 bg-[#0f3d4c] text-white px-3 py-2 rounded-lg flex items-center gap-2">
                  <AlertCircle size={16} />
                  Prescription Required
                </div>
              )}
            </div>

            {product.images?.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`w-16 h-16 rounded-lg border-2 overflow-hidden shrink-0 ${
                      selectedImage === idx ? 'border-[#2b9fb6]' : 'border-gray-200'
                    }`}
                  >
                    <img src={img} alt={`${idx}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-slate-900">{product.name}</h1>
              <div className="flex items-center gap-2 mt-2">
                <Star size={16} className="text-yellow-500" fill="currentColor" />
                <span className="font-semibold">{product.averageRating || 4.5}</span>
                <span className="text-sm text-slate-500">({reviews.length} reviews)</span>
              </div>
            </div>

            <div className="bg-[#f3f8fa] rounded-xl p-3 border border-[#dce8ee]">
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-3xl font-black text-[#173844]">₹{product.discountedPrice || product.price}</span>
                {product.mrp && product.mrp !== (product.discountedPrice || product.price) && (
                  <span className="text-lg text-gray-400 line-through">₹{product.mrp}</span>
                )}
              </div>
              <p className="text-sm text-slate-600">Per {product.unit || 'unit'}</p>
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="bg-white border border-slate-200 rounded-lg p-2">
                <p className="text-slate-500">Brand</p>
                <p className="font-semibold">{product.brand || 'Generic'}</p>
              </div>
              <div className="bg-white border border-slate-200 rounded-lg p-2">
                <p className="text-slate-500">Category</p>
                <p className="font-semibold">{product.category || 'General'}</p>
              </div>
            </div>

            <div className="bg-gray-50 p-3 rounded-lg flex items-start gap-3 border border-slate-200">
              <MapPin className="text-blue-500 mt-1" size={20} />
              <div className="flex-1">
                <div className="font-semibold text-gray-900">{product.shopId?.shopName || product.shopId?.name || 'Shop'}</div>
                <div className="text-sm text-gray-600">{product.shopId?.location?.address || product.shopId?.address || 'Address unavailable'}</div>
                <div className="flex items-center gap-1 mt-1">
                  <Star size={14} className="text-yellow-500" fill="currentColor" />
                  <span className="text-sm font-semibold">{product.shopId?.rating || product.shopId?.ratingAvg || 4.5}</span>
                </div>
              </div>
            </div>

            <div className={`text-sm font-semibold ${product.stock > 0 ? 'text-green-700' : 'text-red-600'}`}>
              {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
            </div>

            {product.description && (
              <div className="border-t pt-4">
                <h3 className="font-semibold mb-2">Description</h3>
                <p className="text-gray-700 text-sm leading-relaxed">{product.description}</p>
              </div>
            )}

            <div className="flex items-center gap-4">
              <span className="text-gray-700 font-medium">Quantity:</span>
              <div className="flex items-center border rounded-lg overflow-hidden">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-3 py-2 bg-slate-50">−</button>
                <input 
                  type="number" 
                  value={quantity} 
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-14 text-center border-x py-2"
                />
                <button onClick={() => setQuantity(quantity + 1)} className="px-3 py-2 bg-slate-50">+</button>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="flex-1 bg-[#0f3d4c] text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2 disabled:bg-gray-300"
              >
                <ShoppingCart size={20} />
                Add to Cart
              </button>
              <button
                onClick={() => setIsFavorite(!isFavorite)}
                className={`px-4 py-3 rounded-lg border-2 ${isFavorite ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
              >
                <Heart size={20} className={isFavorite ? 'text-red-500 fill-current' : ''} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white mt-4 p-4 max-w-6xl mx-auto rounded-2xl border border-[#dce8ee]">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Reviews & Ratings</h2>
          {product.averageRating && (
            <div className="flex items-center gap-1">
              <Star className="text-yellow-500" fill="currentColor" size={20} />
              <span className="font-bold text-lg">{product.averageRating}/5</span>
              <span className="text-gray-600 text-sm">({reviews.length})</span>
            </div>
          )}
        </div>

        {user && (
          <button
            onClick={() => setShowReviewForm(!showReviewForm)}
            className="w-full bg-blue-50 text-blue-600 py-2 rounded-lg font-semibold mb-4"
          >
            {showReviewForm ? 'Cancel' : 'Write a Review'}
          </button>
        )}

        {showReviewForm && (
          <div className="bg-gray-50 p-4 rounded-lg mb-4 space-y-3">
            <div>
              <label className="block text-sm font-semibold mb-2">Rating:</label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map(star => (
                  <button
                    key={star}
                    onClick={() => setNewReview({ ...newReview, rating: star })}
                    className="text-3xl"
                  >
                    <Star 
                      size={32}
                      className={newReview.rating >= star ? 'text-yellow-500 fill-current' : 'text-gray-300'}
                    />
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Your Review:</label>
              <textarea
                value={newReview.comment}
                onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                placeholder="Share your experience..."
                className="w-full p-2 border rounded-lg text-sm"
                rows="4"
              />
            </div>
            <button
              onClick={handleSubmitReview}
              className="w-full bg-blue-500 text-white py-2 rounded-lg font-semibold"
            >
              Submit Review
            </button>
          </div>
        )}

        <div className="flex gap-3 overflow-x-auto pb-2">
          {reviews.length > 0 ? (
            reviews.map(review => (
              <div key={review._id} className="min-w-72 max-w-72 border rounded-xl p-3 bg-slate-50 border-slate-200">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-200 rounded-full flex items-center justify-center text-sm font-bold">
                      {review.authorId?.name?.charAt(0) || 'U'}
                    </div>
                    <div>
                      <div className="font-semibold text-sm">{review.authorId?.name || 'Anonymous'}</div>
                    </div>
                  </div>
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i}
                        size={14}
                        className={i < review.rating ? 'text-yellow-500 fill-current' : 'text-gray-300'}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-sm text-gray-700">{review.comment}</p>
                <div className="text-xs text-gray-500 mt-1">
                  {new Date(review.createdAt).toLocaleDateString()}
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center py-4">No reviews yet. Be the first to review!</p>
          )}
        </div>
      </div>

      {relatedProducts.length > 0 && (
        <div className="bg-white mt-4 p-4 max-w-6xl mx-auto rounded-2xl border border-[#dce8ee]">
          <h2 className="text-xl font-bold mb-4">More Suggested Products</h2>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {relatedProducts.map(relProduct => (
              <ProductCard key={relProduct._id} product={relProduct} isMedicalPath={isMedicalPath} />
            ))}
          </div>
        </div>
      )}

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 max-w-6xl mx-auto w-full lg:hidden">
        <button
          onClick={handleAddToCart}
          disabled={product.stock === 0}
          className="w-full bg-blue-500 text-white py-3 rounded-lg font-semibold disabled:bg-gray-300"
        >
          Add to Cart - ₹{product.discountedPrice || product.price}
        </button>
      </div>
    </div>
  );
};

// Product Card Component for Related Products
const ProductCard = ({ product, isMedicalPath }) => {
  const navigate = useNavigate();

  return (
    <div 
      onClick={() => navigate(isMedicalPath ? `/medical/product/${product._id}` : `/grocery/product/${product._id}`)}
      className="min-w-52 max-w-52 bg-gray-50 rounded-xl overflow-hidden hover:shadow-lg transition cursor-pointer border border-slate-200"
    >
      <div className="aspect-square bg-gray-200 relative overflow-hidden">
        <img 
          src={product.images?.[0] || '/placeholder.png'} 
          alt={product.name}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-3">
        <h3 className="font-semibold text-sm truncate">{product.name}</h3>
        <div className="flex items-center justify-between mt-2">
          <span className="font-bold text-lg">₹{product.discountedPrice || product.price}</span>
          <div className="flex items-center gap-1">
            <Star size={12} className="text-yellow-500" fill="currentColor" />
            <span className="text-xs font-semibold">{product.averageRating || 4.5}</span>
          </div>
        </div>
        <div className="text-xs text-gray-600 mt-1">{product.stock > 0 ? 'In stock' : 'Out of stock'}</div>
      </div>
    </div>
  );
};

export default ProductDetail;
