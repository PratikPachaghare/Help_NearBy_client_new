import { useEffect, useMemo, useRef, useState } from 'react';
import { apiCall } from '../../../utils/ApiCalls';
import { Endpoints } from '../../../utils/Endpiont';
import { connectSocket, disconnectSocket } from '../../../utils/socket';
import { MapContainer, Marker, Popup, Polyline, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

export default function MyOrders({ mode = 'grocery' }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [trackingOrderId, setTrackingOrderId] = useState('');
  const [trackingData, setTrackingData] = useState(null);
  const socketRef = useRef(null);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const resp = await apiCall('GET', Endpoints.Orders.My);
      setOrders(resp?.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;
    const socket = connectSocket(token);
    socketRef.current = socket;

    socket?.on('order.status.updated', ({ orderId, status }) => {
      setOrders((prev) => prev.map((o) => (o._id === orderId ? { ...o, status } : o)));
    });

    return () => {
      socket?.off('order.status.updated');
      disconnectSocket();
    };
  }, []);

  useEffect(() => {
    orders.forEach((order) => {
      socketRef.current?.emit('room:join', `order:${order._id}`);
    });
  }, [orders]);

  useEffect(() => {
    if (!trackingOrderId) return undefined;

    const publishUserLocation = () => {
      if (!navigator.geolocation) return;
      navigator.geolocation.getCurrentPosition(async (pos) => {
        try {
          await apiCall('POST', Endpoints.Tracking.UpdateLocation, {
            contextType: 'order',
            contextId: trackingOrderId,
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

    publishUserLocation();
    const interval = setInterval(publishUserLocation, 15000);
    return () => clearInterval(interval);
  }, [trackingOrderId]);

  const sorted = useMemo(() => [...orders].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)), [orders]);

  const markerFromLive = (row) => {
    const coords = row?.location?.coordinates || [];
    if (coords.length !== 2) return null;
    return [coords[1], coords[0]];
  };

  const openTracking = async (orderId) => {
    setTrackingOrderId(orderId);
    try {
      const resp = await apiCall('GET', Endpoints.Tracking.OrderParticipants(orderId));
      setTrackingData(resp?.data || null);
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.message || 'Unable to load tracking');
    }
  };

  if (loading) return <div className="p-6">Loading orders...</div>;

  return (
    <div className="min-h-screen bg-[#f3f8fa] p-4">
      <div className="max-w-5xl mx-auto bg-white rounded-xl shadow border border-[#dce8ee] p-4">
        <h1 className="text-xl font-bold mb-4 text-[#173844]">{mode === 'medical' ? 'My Medical Orders' : 'My Grocery Orders'}</h1>
        {!sorted.length ? <p className="text-gray-500">No orders found</p> : null}
        <div className="space-y-3">
          {sorted.map((order) => (
            <div key={order._id} className="border rounded p-4 flex justify-between gap-3">
              <div>
                <p className="font-semibold">{order.orderNumber}</p>
                <p className="text-sm text-gray-600">{new Date(order.createdAt).toLocaleString()}</p>
                <p className="text-sm">Items: {order.items?.length || 0}</p>
              </div>
              <div className="text-right">
                <p className="font-bold">Rs {order.grandTotal}</p>
                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded uppercase">{order.status}</span>
                <div>
                  <button
                    onClick={() => openTracking(order._id)}
                    className="mt-2 text-xs border border-indigo-300 text-indigo-700 bg-indigo-50 px-2 py-1 rounded"
                  >
                    Live Track
                  </button>
                </div>
              </div>

              {trackingOrderId === order._id && trackingData ? (
                <div className="w-full mt-3 border-t pt-3">
                  <div className="h-64 rounded overflow-hidden border border-slate-200">
                    <MapContainer
                      center={markerFromLive(trackingData.deliveryLocation) || markerFromLive(trackingData.userLocation) || [20.9374, 77.7796]}
                      zoom={13}
                      style={{ height: '100%', width: '100%' }}
                    >
                      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                      {markerFromLive(trackingData.deliveryLocation) ? (
                        <Marker position={markerFromLive(trackingData.deliveryLocation)}>
                          <Popup>Delivery boy live location</Popup>
                        </Marker>
                      ) : null}
                      {markerFromLive(trackingData.userLocation) ? (
                        <Marker position={markerFromLive(trackingData.userLocation)}>
                          <Popup>Your latest location</Popup>
                        </Marker>
                      ) : null}
                      {trackingData.fixedShopLocation?.coordinates?.length === 2 ? (
                        <Marker position={[trackingData.fixedShopLocation.coordinates[1], trackingData.fixedShopLocation.coordinates[0]]}>
                          <Popup>Shop location</Popup>
                        </Marker>
                      ) : null}
                      {trackingData.fixedUserLocation?.coordinates?.length === 2 ? (
                        <Marker position={[trackingData.fixedUserLocation.coordinates[1], trackingData.fixedUserLocation.coordinates[0]]}>
                          <Popup>Your address location</Popup>
                        </Marker>
                      ) : null}

                      {trackingData?.routeMeta?.livePoints?.delivery && trackingData?.routeMeta?.livePoints?.shop ? (
                        <Polyline
                          positions={[
                            [trackingData.routeMeta.livePoints.delivery.lat, trackingData.routeMeta.livePoints.delivery.lng],
                            [trackingData.routeMeta.livePoints.shop.lat, trackingData.routeMeta.livePoints.shop.lng]
                          ]}
                          pathOptions={{ color: '#f97316', weight: 4 }}
                        />
                      ) : null}
                      {trackingData?.routeMeta?.livePoints?.shop && trackingData?.routeMeta?.livePoints?.user ? (
                        <Polyline
                          positions={[
                            [trackingData.routeMeta.livePoints.shop.lat, trackingData.routeMeta.livePoints.shop.lng],
                            [trackingData.routeMeta.livePoints.user.lat, trackingData.routeMeta.livePoints.user.lng]
                          ]}
                          pathOptions={{ color: '#2563eb', weight: 4 }}
                        />
                      ) : null}
                    </MapContainer>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs text-slate-600 mt-2">
                    <p className="bg-orange-50 border border-orange-100 rounded px-2 py-1">Delivery to Shop: {trackingData?.routeMeta?.deliveryToShopKm ?? 'N/A'} km</p>
                    <p className="bg-blue-50 border border-blue-100 rounded px-2 py-1">Shop to You: {trackingData?.routeMeta?.shopToUserKm ?? 'N/A'} km</p>
                    <p className="bg-teal-50 border border-teal-100 rounded px-2 py-1">Delivery to You: {trackingData?.routeMeta?.deliveryToUserKm ?? 'N/A'} km</p>
                  </div>
                </div>
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
