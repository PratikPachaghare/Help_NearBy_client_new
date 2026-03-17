
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnalyticsScreen } from '../shopkiper/AnalyticsScreen';
import { InventoryScreen } from '../shopkiper/InventoryScreen';
import { OrdersScreen } from '../shopkiper/OrdersScreen';
import { BillingScreen } from '../shopkiper/BillingScreen';
import { KycScreen } from '../shopkiper/KycScreen';
import MedicalDashboard from '../pages/MedicalDashboard';
import { useAuth } from '../utils/AuthContext';
import { apiCall } from '../utils/ApiCalls';
import { Endpoints } from '../utils/Endpiont';

export default function ShopNavigatore({ mode = 'grocery' }) {
  const isMedicalMode = mode === 'medical';
  const [activeTab, setActiveTab] = useState('dashboard');
  const { user, logout, refreshUser } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [deliveryBoys, setDeliveryBoys] = useState([]);
  const [analyticsPeriod, setAnalyticsPeriod] = useState('month');
  const [analytics, setAnalytics] = useState({ totals: { grossSales: 0, totalOrders: 0, avgOrderValue: 0 }, timeline: [] });
  const [shopId, setShopId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [creatingShop, setCreatingShop] = useState(false);
  const [kycStatus, setKycStatus] = useState('not_submitted');
  const [kycSubmitting, setKycSubmitting] = useState(false);

  const isKycVerified = (kycStatus || user?.shopkeeperKycStatus) === 'verified';

  const fetchKycStatus = async () => {
    const resp = await apiCall('GET', Endpoints.User.Kyc || Endpoints.User.ShopkeeperKyc);
    setKycStatus(resp?.data?.status || 'not_submitted');
  };

  const fetchDashboard = async () => {
    const resp = await apiCall('GET', Endpoints.Shop.Dashboard);
    setShopId(resp?.data?.shop?._id || null);
  };

  const fetchProducts = async () => {
    if (!shopId) return;
    const resp = await apiCall('GET', Endpoints.Products.List, {}, {
      shopId,
      catalog: isMedicalMode ? 'medical' : 'grocery'
    });
    setProducts(resp?.data || []);
  };

  const fetchOrders = async () => {
    const resp = await apiCall('GET', Endpoints.Shop.MyOrders);
    setOrders(resp?.data || []);
  };

  const fetchDeliveryBoys = async () => {
    const resp = await apiCall('GET', Endpoints.Shop.DeliveryBoys);
    setDeliveryBoys(resp?.data || []);
  };

  const fetchAnalytics = async (period = analyticsPeriod) => {
    const resp = await apiCall('GET', Endpoints.Shop.SalesAnalytics, {}, { period });
    setAnalytics(resp?.data || { totals: { grossSales: 0, totalOrders: 0, avgOrderValue: 0 }, timeline: [] });
  };

  const fetchAll = async () => {
    setLoading(true);
    setError('');
    try {
      await fetchKycStatus();
      await fetchDashboard();
      await Promise.all([fetchOrders(), fetchDeliveryBoys(), fetchAnalytics()]);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load shopkeeper dashboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!isKycVerified) {
      setActiveTab('kyc');
    }
  }, [isKycVerified]);

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shopId]);

  useEffect(() => {
    fetchAnalytics(analyticsPeriod);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [analyticsPeriod]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleCreateProduct = async (payload) => {
    try {
      await apiCall('POST', Endpoints.Products.List, payload);
      await fetchProducts();
    } catch (err) {
      if (err?.response?.data?.errors?.code === 'KYC_REQUIRED') {
        setActiveTab('kyc');
      }
      throw err;
    }
  };

  const handleUpdateProduct = async (id, payload) => {
    try {
      await apiCall('PATCH', Endpoints.Products.ById(id), payload);
      await fetchProducts();
    } catch (err) {
      if (err?.response?.data?.errors?.code === 'KYC_REQUIRED') {
        setActiveTab('kyc');
      }
      throw err;
    }
  };

  const handleDeleteProduct = async (id) => {
    try {
      await apiCall('DELETE', Endpoints.Products.ById(id));
      await fetchProducts();
    } catch (err) {
      if (err?.response?.data?.errors?.code === 'KYC_REQUIRED') {
        setActiveTab('kyc');
      }
      throw err;
    }
  };

  const handleAssignDelivery = async (orderId, deliveryBoyId) => {
    await apiCall('PATCH', Endpoints.Shop.AssignDelivery(orderId), { deliveryBoyId });
    await fetchOrders();
    await fetchDeliveryBoys();
  };

  const handleUpdateOrderStatus = async (orderId, status) => {
    await apiCall('PATCH', Endpoints.Shop.UpdateOrderStatus(orderId), { status });
    await fetchOrders();
    await fetchAnalytics();
  };

  const handleCreateShopProfile = async () => {
    setCreatingShop(true);
    setError('');
    try {
      const payload = {
        name: user?.name ? `${user.name} ${isMedicalMode ? 'Medical Store' : 'Shop'}` : isMedicalMode ? 'My Medical Store' : 'My Shop',
        shopType: isMedicalMode ? 'medical' : 'grocery',
        address: 'Amravati',
        location: {
          type: 'Point',
          coordinates: [77.7796, 20.9374]
        }
      };
      await apiCall('POST', Endpoints.Shop.Create, payload);
      await fetchAll();
    } catch (err) {
      if (err?.response?.data?.errors?.code === 'KYC_REQUIRED') {
        setActiveTab('kyc');
      }
      setError(err?.response?.data?.message || 'Failed to create shop profile');
    } finally {
      setCreatingShop(false);
    }
  };

  const handleSubmitKyc = async (payload) => {
    setKycSubmitting(true);
    setError('');
    try {
      await apiCall('PATCH', Endpoints.User.Kyc || Endpoints.User.ShopkeeperKyc, payload);
      await fetchKycStatus();
      await refreshUser();
      setActiveTab('dashboard');
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to submit KYC form');
    } finally {
      setKycSubmitting(false);
    }
  };

  const activeOrders = orders.filter((o) => ['pending', 'accepted', 'packed', 'picked', 'out_for_delivery'].includes(o.status)).length;

  return (
    <div className="flex h-screen bg-linear-to-br from-sky-50 via-white to-cyan-50 text-slate-800 font-sans">
      
      {/* SIDEBAR NAVIGATION */}
      <div className="w-72 bg-white text-sky-900 flex flex-col border-r border-sky-100 shadow-sm">
        <div className="p-5 border-b border-sky-100 bg-sky-50">
          <p className="text-xs uppercase tracking-wider text-sky-600">Operations Suite</p>
          <h2 className="text-xl font-bold mt-1">{isMedicalMode ? 'Medical Shopkeeper Panel' : 'Shopkeeper Panel'}</h2>
        </div>
        <div className="px-4 pt-4">
          <div className="bg-linear-to-r from-sky-500 to-cyan-500 rounded-xl p-3 text-sm text-white shadow">
            <p className="text-sky-100">Live Orders</p>
            <p className="text-2xl font-black text-white">{activeOrders}</p>
          </div>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`w-full text-left p-3 rounded-xl font-medium ${activeTab === 'dashboard' ? 'bg-sky-600 text-white shadow' : 'text-sky-800 hover:bg-sky-50'}`}>
             Analytics
          </button>
          <button 
            onClick={() => setActiveTab('inventory')}
            className={`w-full text-left p-3 rounded-xl font-medium ${activeTab === 'inventory' ? 'bg-sky-600 text-white shadow' : 'text-sky-800 hover:bg-sky-50'}`}>
             {isMedicalMode ? 'Medical Inventory' : 'Inventory'}
          </button>
          {isMedicalMode && (
            <button
              onClick={() => setActiveTab('prescriptions')}
              className={`w-full text-left p-3 rounded-xl font-medium ${activeTab === 'prescriptions' ? 'bg-sky-600 text-white shadow' : 'text-sky-800 hover:bg-sky-50'}`}>
               Prescriptions
            </button>
          )}
          <button 
            onClick={() => setActiveTab('orders')}
            className={`w-full text-left p-3 rounded-xl font-medium ${activeTab === 'orders' ? 'bg-sky-600 text-white shadow' : 'text-sky-800 hover:bg-sky-50'}`}>
             Orders & Delivery
          </button>
          <button 
            onClick={() => setActiveTab('billing')}
            className={`w-full text-left p-3 rounded-xl font-medium ${activeTab === 'billing' ? 'bg-sky-600 text-white shadow' : 'text-sky-800 hover:bg-sky-50'}`}>
             Billing & Label
          </button>
          <button
            onClick={() => setActiveTab('kyc')}
            className={`w-full text-left p-3 rounded-xl font-medium ${activeTab === 'kyc' ? 'bg-sky-600 text-white shadow' : 'text-sky-800 hover:bg-sky-50'}`}>
             Compliance KYC
          </button>
        </nav>
        <div className="p-4 border-t border-sky-100 text-sm text-sky-700 flex items-center justify-between gap-2 bg-sky-50/60">
          <span>{user?.name ? `Logged in as ${user.name}` : 'Logged in as Owner'}</span>
          <button onClick={handleLogout} className="bg-red-600 hover:bg-red-500 text-white px-3 py-1 rounded-lg text-xs font-semibold">
            Logout
          </button>
        </div>
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 overflow-auto relative">
        <header className="bg-white/95 shadow-sm border-b border-sky-100 p-4 mb-4 flex items-center justify-between backdrop-blur">
          <div>
            <h1 className="text-xl font-bold capitalize text-sky-900">{activeTab} Overview</h1>
            <p className="text-xs text-sky-600">Connected with real backend data</p>
          </div>
          {activeTab === 'dashboard' && (
            <select value={analyticsPeriod} onChange={(e) => setAnalyticsPeriod(e.target.value)} className="border border-sky-200 bg-white rounded-xl px-3 py-2 text-sm text-sky-800">
              <option value="week">Week</option>
              <option value="month">Month</option>
              <option value="year">Year</option>
            </select>
          )}
        </header>

        <main className="p-4">
          {error ? (
            <div className="mb-3 p-3 rounded-md border border-red-200 bg-red-50 text-red-700 text-sm flex items-center justify-between gap-3">
              <span>{error}</span>
              {error.toLowerCase().includes('shop not found') ? (
                isKycVerified ? (
                  <button
                    onClick={handleCreateShopProfile}
                    disabled={creatingShop}
                    className="shrink-0 bg-sky-600 hover:bg-sky-500 disabled:opacity-60 text-white px-3 py-1.5 rounded-lg text-xs font-semibold"
                  >
                    {creatingShop ? 'Creating...' : 'Create Shop Profile'}
                  </button>
                ) : (
                  <button
                    onClick={() => setActiveTab('kyc')}
                    className="shrink-0 bg-amber-600 hover:bg-amber-500 text-white px-3 py-1.5 rounded text-xs font-semibold"
                  >
                    Complete KYC First
                  </button>
                )
              ) : null}
            </div>
          ) : null}
          {loading ? <div className="p-6 text-sm text-slate-500">Loading shopkeeper dashboard...</div> : null}
          {!loading && activeTab === 'dashboard' && <AnalyticsScreen analytics={analytics} />}
          {!loading && activeTab === 'inventory' && (
            <InventoryScreen
              products={products}
              mode={mode}
              isKycVerified={isKycVerified}
              onCreate={handleCreateProduct}
              onUpdate={handleUpdateProduct}
              onDelete={handleDeleteProduct}
              onRefresh={fetchProducts}
            />
          )}
          {!loading && activeTab === 'prescriptions' && isMedicalMode && <MedicalDashboard mode={mode} />}
          {!loading && activeTab === 'orders' && (
            <OrdersScreen
              orders={orders}
              deliveryBoys={deliveryBoys}
              onAssignDelivery={handleAssignDelivery}
              onUpdateStatus={handleUpdateOrderStatus}
              onRefresh={fetchOrders}
            />
          )}
          {!loading && activeTab === 'billing' && <BillingScreen orders={orders} />}
          {!loading && activeTab === 'kyc' && (
            <KycScreen
              kycStatus={kycStatus}
              onSubmitKyc={handleSubmitKyc}
              submitting={kycSubmitting}
            />
          )}
        </main>

      </div>
    </div>
  );
}
