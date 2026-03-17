import React, { useEffect, useMemo, useState } from 'react';
import { MapContainer, Marker, Popup, Polyline, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { apiCall } from '../utils/ApiCalls';
import { Endpoints } from '../utils/Endpiont';

const STATUS_OPTIONS = {
  pending: ['accepted', 'cancelled'],
  accepted: ['packed', 'cancelled'],
  packed: ['picked']
};

function printLabel(order) {
  const w = window.open('', '_blank', 'width=700,height=800');
  if (!w) return;
  const items = (order.items || []).map((i) => `<li>${i.nameSnapshot} x ${i.qty}</li>`).join('');
  w.document.write(`
    <html>
      <head><title>Shipping Label</title></head>
      <body style="font-family: Arial, sans-serif; padding: 24px;">
        <h2>HelpNearBy Shipping Label</h2>
        <p><strong>Order:</strong> ${order.orderNumber}</p>
        <p><strong>Customer Address:</strong> ${order.shippingAddress}</p>
        <p><strong>Payment:</strong> ${String(order.paymentMethod || '').toUpperCase()}</p>
        <p><strong>Status:</strong> ${order.status}</p>
        <hr/>
        <p><strong>Items:</strong></p>
        <ul>${items}</ul>
        <hr/>
        <p><strong>Total:</strong> Rs ${Math.round(order.grandTotal || 0)}</p>
      </body>
    </html>
  `);
  w.document.close();
  w.focus();
  w.print();
}

export const OrdersScreen = ({ orders, deliveryBoys, onAssignDelivery, onUpdateStatus, onRefresh }) => {
  const [statusFilter, setStatusFilter] = useState('all');
  const [assigningFor, setAssigningFor] = useState('');
  const [trackingOrderId, setTrackingOrderId] = useState('');
  const [trackingData, setTrackingData] = useState(null);
  const [trackingLoading, setTrackingLoading] = useState(false);

  useEffect(() => {
    if (!trackingOrderId) return undefined;

    const publishShopLocation = () => {
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

    publishShopLocation();
    const interval = setInterval(publishShopLocation, 15000);
    return () => clearInterval(interval);
  }, [trackingOrderId]);

  const filtered = useMemo(() => {
    if (statusFilter === 'all') return orders;
    return orders.filter((o) => o.status === statusFilter);
  }, [orders, statusFilter]);

  const updateStatus = async (orderId, status) => {
    try {
      await onUpdateStatus(orderId, status);
    } catch (err) {
      alert(err?.response?.data?.message || 'Failed to update order status');
    }
  };

  const assignRider = async (orderId, deliveryBoyId) => {
    if (!deliveryBoyId) return;
    try {
      await onAssignDelivery(orderId, deliveryBoyId);
      setAssigningFor('');
    } catch (err) {
      alert(err?.response?.data?.message || 'Failed to assign delivery boy');
    }
  };

  const openTracking = async (orderId) => {
    setTrackingOrderId(orderId);
    setTrackingLoading(true);
    try {
      const resp = await apiCall('GET', Endpoints.Tracking.OrderParticipants(orderId));
      setTrackingData(resp?.data || null);
    } catch (err) {
      alert(err?.response?.data?.message || 'Unable to load tracking data');
    } finally {
      setTrackingLoading(false);
    }
  };

  const markerFromLive = (row) => {
    const coords = row?.location?.coordinates || [];
    if (coords.length !== 2) return null;
    return [coords[1], coords[0]];
  };

  return (
    <div className="space-y-4">
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <p className="font-semibold">Orders</p>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="border border-slate-300 rounded px-3 py-2 text-sm">
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="accepted">Accepted</option>
            <option value="packed">Packed</option>
            <option value="picked">Picked</option>
            <option value="out_for_delivery">Out for Delivery</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
        <button onClick={onRefresh} className="border border-slate-300 rounded px-3 py-1.5 text-sm">Refresh</button>
      </div>

      {filtered.map((order) => {
        const nextStatuses = STATUS_OPTIONS[order.status] || [];
        const activeTask = order.deliveryTask;
        const statusCode = order.assignedDeliveryId ? (order.assignedDeliveryId.isOnline ? 1 : -1) : 0;

        return (
          <div key={order._id} className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
            <div className="flex flex-wrap justify-between gap-3">
              <div>
                <h3 className="font-bold text-slate-900">#{order.orderNumber}</h3>
                <p className="text-xs text-slate-500">{new Date(order.createdAt).toLocaleString()}</p>
                <p className="text-sm mt-2">Address: {order.shippingAddress}</p>
                <p className="text-sm">Total: <strong>Rs {Math.round(order.grandTotal || 0)}</strong></p>
              </div>
              <div className="text-right">
                <span className="text-xs uppercase px-2 py-1 rounded bg-slate-100 text-slate-700">{order.status}</span>
                <p className="text-xs mt-2 text-slate-500">Delivery Code: <strong>{statusCode}</strong> (1 online, 0 unassigned, -1 offline)</p>
                {activeTask ? <p className="text-xs text-slate-500">Task: {activeTask.status}</p> : null}
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap gap-2 items-center">
              {nextStatuses.map((next) => (
                <button key={next} onClick={() => updateStatus(order._id, next)} className="px-3 py-1.5 rounded text-xs bg-emerald-600 text-white hover:bg-emerald-500">
                  Mark {next}
                </button>
              ))}

              <button onClick={() => printLabel(order)} className="px-3 py-1.5 rounded text-xs border border-slate-300 text-slate-700">
                Print Label
              </button>
              <button onClick={() => openTracking(order._id)} className="px-3 py-1.5 rounded text-xs border border-indigo-300 text-indigo-700 bg-indigo-50">
                Live Track
              </button>

              {['accepted', 'packed', 'picked'].includes(order.status) && (
                <>
                  <select
                    value={assigningFor === order._id ? '' : ''}
                    onChange={(e) => assignRider(order._id, e.target.value)}
                    onFocus={() => setAssigningFor(order._id)}
                    className="border border-slate-300 rounded px-3 py-1.5 text-xs"
                  >
                    <option value="">Assign delivery boy</option>
                    {deliveryBoys.map((db) => (
                      <option key={db._id} value={db._id}>
                        {db.name} | {db.isOnline ? 'Online' : 'Offline'} | Tasks:{db.activeTaskCount}
                      </option>
                    ))}
                  </select>
                </>
              )}
            </div>

            {trackingOrderId === order._id ? (
              <div className="mt-3 border-t border-slate-100 pt-3">
                {trackingLoading ? <p className="text-xs text-slate-500">Loading live tracking...</p> : null}
                {!trackingLoading && trackingData ? (
                  <div className="space-y-2">
                    <div className="h-64 rounded overflow-hidden border border-slate-200">
                      <MapContainer
                        center={
                          markerFromLive(trackingData.deliveryLocation)
                          || markerFromLive(trackingData.userLocation)
                          || (trackingData.fixedShopLocation?.coordinates?.length === 2
                            ? [trackingData.fixedShopLocation.coordinates[1], trackingData.fixedShopLocation.coordinates[0]]
                            : null)
                          || [20.9374, 77.7796]
                        }
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
                            <Popup>Customer latest location</Popup>
                          </Marker>
                        ) : null}
                        {markerFromLive(trackingData.shopLocation) ? (
                          <Marker position={markerFromLive(trackingData.shopLocation)}>
                            <Popup>Shopkeeper live location</Popup>
                          </Marker>
                        ) : null}
                        {trackingData.fixedShopLocation?.coordinates?.length === 2 ? (
                          <Marker position={[trackingData.fixedShopLocation.coordinates[1], trackingData.fixedShopLocation.coordinates[0]]}>
                            <Popup>Shop location</Popup>
                          </Marker>
                        ) : null}
                        {trackingData.fixedUserLocation?.coordinates?.length === 2 ? (
                          <Marker position={[trackingData.fixedUserLocation.coordinates[1], trackingData.fixedUserLocation.coordinates[0]]}>
                            <Popup>Customer address location</Popup>
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
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs text-slate-600">
                      <p className="bg-orange-50 border border-orange-100 rounded px-2 py-1">Delivery to Shop: {trackingData?.routeMeta?.deliveryToShopKm ?? 'N/A'} km</p>
                      <p className="bg-blue-50 border border-blue-100 rounded px-2 py-1">Shop to User: {trackingData?.routeMeta?.shopToUserKm ?? 'N/A'} km</p>
                      <p className="bg-teal-50 border border-teal-100 rounded px-2 py-1">Delivery to User: {trackingData?.routeMeta?.deliveryToUserKm ?? 'N/A'} km</p>
                    </div>
                  </div>
                ) : null}
              </div>
            ) : null}
          </div>
        );
      })}

      {!filtered.length && <div className="bg-white border border-slate-200 rounded-xl p-6 text-sm text-slate-500">No orders found for this filter.</div>}
    </div>
  );
};