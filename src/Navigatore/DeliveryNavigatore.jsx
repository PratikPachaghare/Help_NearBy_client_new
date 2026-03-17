import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HomeScreen } from '../deliveryBoy/HomeScreen';
import { MyOrdersScreen } from '../deliveryBoy/MyOrdersScreen';
import { HistoryScreen } from '../deliveryBoy/HistoryScreen';
import { ProfileScreen } from '../deliveryBoy/ProfileScreen';
import { ActiveOrderScreen } from '../deliveryBoy/ActiveDeliveryScreen';
import { apiCall } from '../utils/ApiCalls';
import { Endpoints } from '../utils/Endpiont';
import { useAuth } from '../utils/AuthContext';

const stepFromStatus = {
  assigned: 1,
  accepted: 1,
  arrived_shop: 2,
  picked: 3,
  arrived_customer: 4,
  completed: 5
};

function mapTaskToUi(task) {
  const order = task.orderId || {};
  const shopMeta = task.meta?.shop || {};
  const customerMeta = task.meta?.customer || {};
  const metrics = task.meta?.metrics || {};

  const shopDistance = metrics.pickupDistanceKm;
  const tripDistance = metrics.tripDistanceKm;
  const eta = metrics.estimatedPickupMinutes;
  const tripEta = metrics.estimatedTripMinutes;

  return {
    taskId: task._id,
    orderId: order._id,
    id: order.orderNumber || order._id || task._id,
    shopName: shopMeta.name || 'Assigned Shop',
    shopAddress: shopMeta.address || 'Pickup point',
    shopDist: shopDistance !== null && shopDistance !== undefined ? `${shopDistance} km` : 'N/A',
    customerName: customerMeta.name || 'Customer',
    customerPhone: customerMeta.phone || '',
    customerAddress: customerMeta.address || order.shippingAddress || 'Delivery address',
    custDist: tripDistance !== null && tripDistance !== undefined ? `${tripDistance} km` : 'N/A',
    etaText: eta !== null && eta !== undefined ? `${eta} min to pickup` : '--',
    tripEtaText: tripEta !== null && tripEta !== undefined ? `${tripEta} min trip` : '--',
    items: `${order.items?.length || 0} items`,
    paymentMethod: String(order.paymentMethod || 'cod').toUpperCase(),
    otp: '',
    status: task.status,
    step: stepFromStatus[task.status] || 1,
    amount: order.grandTotal || 0,
    shopPhone: shopMeta.phone || '',
    shopContactName: shopMeta.contactName || shopMeta.name || 'Shopkeeper',
    destinationLat: customerMeta.location?.lat || 20.9374,
    destinationLng: customerMeta.location?.lng || 77.7796,
    pickupLat: shopMeta.location?.lat || null,
    pickupLng: shopMeta.location?.lng || null
  };
}

export default function DeliveryNavigator() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('home');
  const [isOnline, setIsOnline] = useState(true);
  const [availableOrders, setAvailableOrders] = useState([]);
  const [myOrders, setMyOrders] = useState([]);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [history, setHistory] = useState([]);
  const [earnings, setEarnings] = useState(0);

  const refreshTasks = async () => {
    try {
      const [availableResp, myResp] = await Promise.all([
        apiCall('GET', Endpoints.Delivery.Available),
        apiCall('GET', Endpoints.Delivery.MyTasks)
      ]);

      setAvailableOrders((availableResp?.data || []).map(mapTaskToUi));
      setMyOrders((myResp?.data || []).map(mapTaskToUi));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (!isOnline) {
      return;
    }

    const bootTimer = setTimeout(() => {
      refreshTasks();
    }, 0);
    const interval = setInterval(refreshTasks, 8000);
    return () => {
      clearTimeout(bootTimer);
      clearInterval(interval);
    };
  }, [isOnline]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleOnline = async () => {
    const next = !isOnline;
    setIsOnline(next);
    try {
      await apiCall('PATCH', Endpoints.Delivery.Online, { online: next });
      if (next) {
        refreshTasks();
      } else {
        setAvailableOrders([]);
        setMyOrders([]);
        setSelectedOrderId(null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAccept = async (order) => {
    try {
      await apiCall('PATCH', Endpoints.Delivery.AcceptTask(order.taskId));
      await refreshTasks();
      setActiveTab('myorders');
    } catch (err) {
      alert(err?.response?.data?.message || 'Failed to accept');
    }
  };

  const handleStatusUpdate = async (taskId, status, step) => {
    try {
      await apiCall('PATCH', Endpoints.Delivery.UpdateTask(taskId), { status });
      setMyOrders((prev) => prev.map((o) => (o.taskId === taskId ? { ...o, status, step } : o)));
      await refreshTasks();
    } catch (err) {
      alert(err?.response?.data?.message || 'Failed status update');
    }
  };

  const handleVerifyOtp = async (taskId, otp) => {
    try {
      await apiCall('POST', Endpoints.Delivery.VerifyOtp(taskId), { otp });
      const done = myOrders.find((o) => o.taskId === taskId);
      if (done) {
        setHistory((prev) => [{ ...done, status: 'completed', date: new Date().toLocaleString() }, ...prev]);
        setEarnings((e) => e + Number(done.amount || 0));
      }
      await refreshTasks();
      setSelectedOrderId(null);
    } catch (err) {
      alert(err?.response?.data?.message || 'Invalid OTP');
    }
  };

  const handleLocationTick = async (order) => {
    if (!order?.orderId) return;
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(async (pos) => {
      try {
        await apiCall('POST', Endpoints.Tracking.UpdateLocation, {
          contextType: 'order',
          contextId: order.orderId,
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          accuracy: pos.coords.accuracy,
          speed: pos.coords.speed || 0,
          heading: pos.coords.heading || 0
        });
      } catch (err) {
        console.error(err);
      }
    });
  };

  const activeOrderData = useMemo(() => myOrders.find((o) => o.taskId === selectedOrderId), [myOrders, selectedOrderId]);

  if (selectedOrderId && activeOrderData) {
    return (
      <ActiveOrderScreen
        order={activeOrderData}
        onBack={() => setSelectedOrderId(null)}
        onUpdateStatus={handleStatusUpdate}
        onVerifyOtp={handleVerifyOtp}
        onLocationTick={handleLocationTick}
      />
    );
  }

  return (
    <div className="h-screen bg-gray-50 flex flex-col font-sans max-w-md mx-auto border-x shadow-2xl relative">
      <header className="bg-white p-4 shadow-sm z-10 sticky top-0 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold text-gray-900">FastDelivery</h1>
          <p className="text-xs text-gray-500">{user?.name || 'Rider'} • {isOnline ? 'Online' : 'Offline'}</p>
        </div>
        <div className="flex items-center gap-2">
          <div onClick={toggleOnline} className={`px-3 py-1 rounded-full text-xs font-bold border cursor-pointer ${isOnline ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {isOnline ? 'ON DUTY' : 'OFF DUTY'}
          </div>
          <button onClick={handleLogout} className="bg-red-600 hover:bg-red-500 text-white px-3 py-1 rounded text-xs font-semibold">
            Logout
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto">
        {!isOnline ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400"><p>Go online to start</p></div>
        ) : (
          <>
            {activeTab === 'home' && <HomeScreen availableOrders={availableOrders} onAccept={handleAccept} />}
            {activeTab === 'myorders' && <MyOrdersScreen myOrders={myOrders} onOpen={setSelectedOrderId} />}
            {activeTab === 'history' && <HistoryScreen history={history} totalEarnings={earnings} />}
            {activeTab === 'profile' && <ProfileScreen isOnline={isOnline} toggleOnline={toggleOnline} user={user} onLogout={handleLogout} />}
          </>
        )}
      </main>

      <nav className="bg-white border-t flex justify-around p-2 pb-6 fixed bottom-0 w-full max-w-md z-20">
        <button onClick={() => setActiveTab('home')} className={`flex flex-col items-center p-2 ${activeTab === 'home' ? 'text-blue-600' : 'text-gray-400'}`}>FEED</button>
        <button onClick={() => setActiveTab('myorders')} className={`flex flex-col items-center p-2 ${activeTab === 'myorders' ? 'text-blue-600' : 'text-gray-400'}`}>MY ORDERS</button>
        <button onClick={() => setActiveTab('history')} className={`flex flex-col items-center p-2 ${activeTab === 'history' ? 'text-blue-600' : 'text-gray-400'}`}>EARNINGS</button>
        <button onClick={() => setActiveTab('profile')} className={`flex flex-col items-center p-2 ${activeTab === 'profile' ? 'text-blue-600' : 'text-gray-400'}`}>PROFILE</button>
      </nav>
    </div>
  );
}
