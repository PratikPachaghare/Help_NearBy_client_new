import { useCallback, useEffect, useState } from 'react';
import { MapContainer, Marker, Popup, Polyline, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { apiCall } from '../utils/ApiCalls';
import { Endpoints } from '../utils/Endpiont';

export const ActiveOrderScreen = ({ order, onBack, onUpdateStatus, onVerifyOtp, onLocationTick }) => {
    const markerFromLive = useCallback((row) => {
      const coords = row?.location?.coordinates || [];
      if (coords.length !== 2) return null;
      return [coords[1], coords[0]];
    }, []);

  const [otp, setOtp] = useState('');
  const [riderPos, setRiderPos] = useState([20.9374, 77.7796]);
  const [trackingData, setTrackingData] = useState(null);

  const openDialer = (phone) => {
    if (!phone) return;
    window.location.href = `tel:${phone}`;
  };

  const openDirections = (lat, lng, label) => {
    if (!lat || !lng) return;
    const target = encodeURIComponent(`${lat},${lng}`);
    const name = encodeURIComponent(label || 'Destination');
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${target}&destination_place_id=${name}`, '_blank', 'noopener,noreferrer');
  };

  const moveRiderSmooth = (target) => {
    if (!Array.isArray(target) || target.length !== 2) return;

    const frames = 16;
    const [startLat, startLng] = riderPos;
    const [targetLat, targetLng] = target;
    let currentFrame = 0;

    const animate = () => {
      currentFrame += 1;
      const progress = currentFrame / frames;
      const nextLat = startLat + (targetLat - startLat) * progress;
      const nextLng = startLng + (targetLng - startLng) * progress;
      setRiderPos([nextLat, nextLng]);

      if (currentFrame < frames) {
        window.requestAnimationFrame(animate);
      }
    };

    window.requestAnimationFrame(animate);
  };

  const steps = [
    { label: 'Accepted', status: 'accepted', step: 1 },
    { label: 'Arrived Shop', status: 'arrived_shop', step: 2 },
    { label: 'Picked', status: 'picked', step: 3 },
    { label: 'Arrived Customer', status: 'arrived_customer', step: 4 }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      if (!navigator.geolocation) return;
      navigator.geolocation.getCurrentPosition((pos) => {
        const next = [pos.coords.latitude, pos.coords.longitude];
        moveRiderSmooth(next);
        onLocationTick?.(order);
      });
    }, 10000);

    return () => clearInterval(timer);
  }, [order, onLocationTick]);

  useEffect(() => {
    const syncParticipants = async () => {
      if (!order?.orderId) return;
      try {
        const resp = await apiCall('GET', Endpoints.Tracking.OrderParticipants(order.orderId));
        setTrackingData(resp?.data || null);
      } catch (err) {
        console.error(err);
      }
    };

    syncParticipants();
    const interval = setInterval(syncParticipants, 12000);
    return () => clearInterval(interval);
  }, [order?.orderId]);

  useEffect(() => {
    const liveDeliveryPoint = markerFromLive(trackingData?.deliveryLocation);
    if (liveDeliveryPoint) {
      moveRiderSmooth(liveDeliveryPoint);
    }
  }, [markerFromLive, trackingData?.deliveryLocation?.capturedAt]);

  const handleAction = () => {
    if (order.step === 1) onUpdateStatus(order.taskId, 'arrived_shop', 2);
    else if (order.step === 2) onUpdateStatus(order.taskId, 'picked', 3);
    else if (order.step === 3) onUpdateStatus(order.taskId, 'arrived_customer', 4);
    else if (order.step === 4) onVerifyOtp(order.taskId, otp);
  };

  const destination = [order.destinationLat || 20.9374, order.destinationLng || 77.7796];
  const primaryTarget = order.step <= 2
    ? { lat: order.pickupLat, lng: order.pickupLng, label: order.shopName }
    : { lat: order.destinationLat, lng: order.destinationLng, label: order.customerName };

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="bg-white p-4 shadow-sm flex items-center gap-4 z-10">
        <button onClick={onBack} className="text-2xl font-bold text-gray-600">←</button>
        <div>
          <h2 className="font-bold text-lg">Order #{order.id}</h2>
          <p className="text-xs text-green-600 font-bold uppercase">{order.status}</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 pb-24 bg-gray-50">
        <div className="flex items-center gap-1 mb-4 mt-2">
          {steps.map((s) => (
            <div key={s.label} className={`h-1 flex-1 rounded ${order.step >= s.step ? 'bg-green-500' : 'bg-gray-200'}`} />
          ))}
        </div>

        <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
          <p className="text-xs text-gray-400 font-bold uppercase mb-1">Pickup</p>
          <h3 className="font-bold text-lg">{order.shopName}</h3>
          <p className="text-sm text-gray-500">{order.shopAddress}</p>
          <p className="text-xs mt-2 text-gray-500">Drop: {order.customerAddress}</p>
          <div className="grid grid-cols-2 gap-2 mt-3">
            <div className="rounded-lg bg-orange-50 border border-orange-100 px-3 py-2">
              <p className="text-[10px] uppercase text-orange-700 font-bold">Rider to Shop</p>
              <p className="text-sm font-semibold text-orange-900">{order.shopDist || 'N/A'}</p>
            </div>
            <div className="rounded-lg bg-blue-50 border border-blue-100 px-3 py-2">
              <p className="text-[10px] uppercase text-blue-700 font-bold">Shop to Customer</p>
              <p className="text-sm font-semibold text-blue-900">{order.custDist || 'N/A'} • {order.tripEtaText || '--'}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-4 mb-4 border border-gray-100">
          <p className="text-xs text-gray-400 font-bold uppercase mb-3">Communication</p>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-orange-100 bg-orange-50 p-3">
              <p className="text-[10px] uppercase font-bold text-orange-700">Shopkeeper</p>
              <p className="font-semibold text-sm text-gray-900 mt-1">{order.shopContactName || order.shopName}</p>
              <p className="text-xs text-gray-500 mt-1">{order.shopPhone || 'Phone not available'}</p>
              <button
                type="button"
                disabled={!order.shopPhone}
                onClick={() => openDialer(order.shopPhone)}
                className="mt-3 w-full rounded-lg bg-orange-600 px-3 py-2 text-xs font-bold text-white disabled:cursor-not-allowed disabled:bg-orange-300"
              >
                Call Shopkeeper
              </button>
            </div>
            <div className="rounded-xl border border-blue-100 bg-blue-50 p-3">
              <p className="text-[10px] uppercase font-bold text-blue-700">Customer</p>
              <p className="font-semibold text-sm text-gray-900 mt-1">{order.customerName}</p>
              <p className="text-xs text-gray-500 mt-1">{order.customerPhone || 'Phone not available'}</p>
              <button
                type="button"
                disabled={!order.customerPhone}
                onClick={() => openDialer(order.customerPhone)}
                className="mt-3 w-full rounded-lg bg-blue-600 px-3 py-2 text-xs font-bold text-white disabled:cursor-not-allowed disabled:bg-blue-300"
              >
                Call Customer
              </button>
            </div>
          </div>
          <button
            type="button"
            onClick={() => openDirections(primaryTarget.lat, primaryTarget.lng, primaryTarget.label)}
            className="mt-3 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-bold text-gray-800"
          >
            Open Directions to {order.step <= 2 ? 'Pickup' : 'Customer'}
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-4">
          <div className="h-64">
            <MapContainer center={riderPos} zoom={13} style={{ height: '100%', width: '100%' }}>
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <Marker position={riderPos}><Popup>Rider Live Location</Popup></Marker>
              {markerFromLive(trackingData?.userLocation) ? <Marker position={markerFromLive(trackingData.userLocation)}><Popup>User live location</Popup></Marker> : null}
              {markerFromLive(trackingData?.shopLocation) ? <Marker position={markerFromLive(trackingData.shopLocation)}><Popup>Shopkeeper live location</Popup></Marker> : null}
              {trackingData?.fixedShopLocation?.coordinates?.length === 2 ? (
                <Marker position={[trackingData.fixedShopLocation.coordinates[1], trackingData.fixedShopLocation.coordinates[0]]}><Popup>Shop location</Popup></Marker>
              ) : null}
              {trackingData?.fixedUserLocation?.coordinates?.length === 2 ? (
                <Marker position={[trackingData.fixedUserLocation.coordinates[1], trackingData.fixedUserLocation.coordinates[0]]}><Popup>User address location</Popup></Marker>
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
              <Marker position={destination}><Popup>Customer Destination</Popup></Marker>
            </MapContainer>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs text-slate-600 mb-4">
          <p className="bg-orange-50 border border-orange-100 rounded px-2 py-1">Delivery to Shop: {trackingData?.routeMeta?.deliveryToShopKm ?? 'N/A'} km</p>
          <p className="bg-blue-50 border border-blue-100 rounded px-2 py-1">Shop to User: {trackingData?.routeMeta?.shopToUserKm ?? 'N/A'} km</p>
          <p className="bg-teal-50 border border-teal-100 rounded px-2 py-1">Delivery to User: {trackingData?.routeMeta?.deliveryToUserKm ?? 'N/A'} km</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-3 mb-4 border border-gray-100">
          <p className="text-xs font-bold text-gray-500 uppercase mb-2">Live Signals</p>
          <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
            <div className="bg-gray-50 rounded px-2 py-1">
              Delivery update: {trackingData?.deliveryLocation?.capturedAt ? new Date(trackingData.deliveryLocation.capturedAt).toLocaleTimeString() : 'Waiting'}
            </div>
            <div className="bg-gray-50 rounded px-2 py-1">
              User update: {trackingData?.userLocation?.capturedAt ? new Date(trackingData.userLocation.capturedAt).toLocaleTimeString() : 'Waiting'}
            </div>
          </div>
        </div>

        {order.step === 4 && (
          <div className="bg-white p-4 rounded-xl shadow border-2 border-green-500 text-center">
            <p className="font-bold text-gray-700 mb-2">Enter OTP to Complete</p>
            <input
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="X X X X"
              maxLength={4}
              className="text-center text-2xl font-bold tracking-widest w-32 border-b-2 border-gray-300 outline-none"
            />
          </div>
        )}
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t max-w-md mx-auto">
        <button
          onClick={handleAction}
          disabled={order.step === 4 && otp.trim().length < 4}
          className="w-full py-4 rounded-xl text-white font-bold text-lg shadow-lg bg-black disabled:cursor-not-allowed disabled:bg-gray-400"
        >
          {order.step === 1 && 'Picked Up? First Confirm Arrival at Shop'}
          {order.step === 2 && 'Parcel Picked: Mark as Picked'}
          {order.step === 3 && 'Reached Customer: Mark Delivered at Door'}
          {order.step === 4 && 'Verify Customer OTP & Finish'}
        </button>
      </div>
    </div>
  );
};
