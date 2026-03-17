import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Smartphone, Wallet } from 'lucide-react';
import { apiCall } from '../../../utils/ApiCalls';
import { Endpoints } from '../../../utils/Endpiont';

export default function GroceryCart({ mode = 'grocery' }) {
  const navigate = useNavigate();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [placing, setPlacing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('upi');

  const fetchCart = async () => {
    setLoading(true);
    try {
      const resp = await apiCall('GET', Endpoints.Cart.Get);
      setCart(resp?.data || null);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const updateQty = async (itemId, nextQty) => {
    if (nextQty <= 0) {
      await apiCall('DELETE', Endpoints.Cart.RemoveItem(itemId));
    } else {
      await apiCall('PATCH', Endpoints.Cart.UpdateItem(itemId), { qty: nextQty });
    }
    fetchCart();
  };

  const placeOrder = async () => {
    setPlacing(true);
    try {
      const resp = await apiCall('POST', Endpoints.Orders.Create, {
        shippingAddress: 'Default user address',
        paymentMethod
      });
      alert(`Order created: ${resp?.data?.order?.orderNumber || ''}`);
      navigate(`/${mode}/myOrders`);
    } catch (err) {
      alert(err?.response?.data?.message || 'Failed to place order');
    } finally {
      setPlacing(false);
    }
  };

  const items = useMemo(() => cart?.items || [], [cart]);

  if (loading) return <div className="p-6">Loading cart...</div>;

  return (
    <div className="min-h-screen bg-[#f3f8fa] p-4">
      <div className="max-w-5xl mx-auto grid lg:grid-cols-[2fr_1fr] gap-4">
        <div className="bg-white rounded-xl shadow border border-[#dce8ee]">
          <div className="p-4 border-b font-bold">Cart Items ({items.length})</div>
          {items.length === 0 ? (
            <div className="p-6 text-gray-500">Your cart is empty</div>
          ) : (
            items.map((item) => (
              <div key={item._id} className="p-4 border-b flex justify-between items-center gap-4">
                <div className="flex items-center gap-3">
                  <img
                    src={item.productId?.images?.[0] || '/placeholder.png'}
                    alt={item.productId?.name || 'Product'}
                    className="h-16 w-16 rounded-lg object-cover border border-slate-200"
                  />
                  <div>
                    <p className="font-semibold">{item.productId?.name || 'Product'}</p>
                    <p className="text-xs text-slate-500">{item.productId?.category || 'General'}</p>
                    <p className="text-sm text-gray-600">Rs {item.unitPrice} x {item.qty}</p>
                    <p className="text-sm font-semibold text-slate-800">Item Total: Rs {item.totalPrice}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => updateQty(item._id, item.qty - 1)} className="h-8 w-8 border rounded-lg text-lg leading-none">-</button>
                  <span className="min-w-6 text-center font-semibold">{item.qty}</span>
                  <button onClick={() => updateQty(item._id, item.qty + 1)} className="h-8 w-8 border rounded-lg text-lg leading-none">+</button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="bg-white rounded-xl shadow p-4 h-fit sticky top-20 border border-[#dce8ee]">
          <h3 className="font-bold mb-3">Summary</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span>Subtotal</span><span>Rs {cart?.subtotal || 0}</span></div>
            <div className="flex justify-between"><span>Delivery</span><span>Rs {cart?.deliveryFee || 0}</span></div>
            <div className="flex justify-between"><span>Discount</span><span>- Rs {cart?.discount || 0}</span></div>
            <div className="border-t pt-2 flex justify-between font-bold"><span>Total</span><span>Rs {cart?.total || 0}</span></div>
          </div>

          <div className="mt-4">
            <p className="text-sm font-semibold text-slate-800 mb-2">Payment Method</p>
            <div className="grid grid-cols-1 gap-2">
              <button
                type="button"
                onClick={() => setPaymentMethod('upi')}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${paymentMethod === 'upi' ? 'border-[#0f3d4c] bg-[#eef5f8]' : 'border-slate-200 bg-white'}`}
              >
                <Smartphone size={18} className="text-[#14566c]" />
                <span className="text-sm font-medium">UPI (PhonePe / GPay / Paytm)</span>
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${paymentMethod === 'card' ? 'border-[#0f3d4c] bg-[#eef5f8]' : 'border-slate-200 bg-white'}`}
              >
                <CreditCard size={18} className="text-[#14566c]" />
                <span className="text-sm font-medium">Credit / Debit Card</span>
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod('cod')}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${paymentMethod === 'cod' ? 'border-[#0f3d4c] bg-[#eef5f8]' : 'border-slate-200 bg-white'}`}
              >
                <Wallet size={18} className="text-[#14566c]" />
                <span className="text-sm font-medium">Cash on Delivery</span>
              </button>
            </div>
          </div>

          <button
            onClick={placeOrder}
            disabled={!items.length || placing}
            className="w-full mt-4 bg-[#0f3d4c] text-white py-3 rounded font-semibold disabled:opacity-60"
          >
            {placing ? 'Placing...' : 'Place Order'}
          </button>
        </div>
      </div>
    </div>
  );
}
