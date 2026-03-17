import React from "react";
import L from "leaflet";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "./Accept.css";

// --- MOCK DATA (Replaces Redux) ---

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function openGoogleMapsDirection(wLat, wLng, uLat, uLng) {
  const url = `https://www.google.com/maps/dir/?api=1&origin=${wLat},${wLng}&destination=${uLat},${uLng}`;
  window.open(url, "_blank", "noopener,noreferrer");
}

export default function AcceptedRequeast({ accepted = [], workerLocation = [20.9374, 77.7796], isWorker = false, onStatusUpdate }) {

  const nextStatus = (status) => {
    if (status === 'accepted') return 'arrived';
    if (status === 'arrived') return 'work_started';
    if (status === 'work_started') return 'completed';
    return null;
  };

  const statusLabel = (status) => {
    if (status === 'accepted') return 'Mark Arrived';
    if (status === 'arrived') return 'Start Work';
    if (status === 'work_started') return 'Complete Job';
    return '';
  };

  return (
    <div className="accepted-list">
      {accepted.length === 0 ? (
        <p className="text-center p-5">No accepted requests yet.</p>
      ) : (
        accepted.map((req) => {
          // Fallback coordinates if data is missing
          const userLng = req.serviceLocation?.coordinates?.[0] || 77.7796;
          const userLat = req.serviceLocation?.coordinates?.[1] || 20.9374;
          const workerLat = workerLocation[0];
          const workerLng = workerLocation[1];

          const distance = getDistanceFromLatLonInKm(workerLat, workerLng, userLat, userLng).toFixed(2);

          return (
            <div key={req._id} className="request-card accepted border p-4 mb-4 rounded shadow">
              <div className="flex flex-wrap gap-5 justify-between">
                <div className="details flex-1 min-w-[280px]">
                  <h3 className="font-bold text-lg mb-2">{isWorker ? "User Details" : "Worker Details"}</h3>
                  <strong>Name: {isWorker ? req.userId?.name : req.workerId?.name}</strong>
                  <p><strong>Phone:</strong> {isWorker ? req.userId?.phone : req.workerId?.phone}</p>
                  <p><strong>Address:</strong> {isWorker ? req.userId?.address : req.workerId?.address}</p>
                  <p><strong>Message:</strong> {req.message}</p>
                  <p><strong>Date:</strong> {new Date(req.scheduledDate).toLocaleDateString()}</p>
                  
                  <button
                    className="mt-3 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    onClick={() => openGoogleMapsDirection(workerLat, workerLng, userLat, userLng)}
                  >
                    Track on Google Maps
                  </button>

                  {isWorker && nextStatus(req.status) ? (
                    <button
                      className="mt-3 ml-2 bg-emerald-600 text-white px-4 py-2 rounded hover:bg-emerald-700"
                      onClick={() => onStatusUpdate?.(req._id, nextStatus(req.status))}
                    >
                      {statusLabel(req.status)}
                    </button>
                  ) : null}
                </div>

                {req.image && (
                  <div className="w-[300px]">
                    <img src={req.image} alt="request" className="w-full rounded" />
                  </div>
                )}
              </div>

              <div className="mt-5 h-[300px] w-full border rounded overflow-hidden">
                <MapContainer center={[userLat, userLng]} zoom={13} style={{ height: "100%", width: "100%" }}>
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  <Marker position={[userLat, userLng]}><Popup>User Location</Popup></Marker>
                  <Marker position={[workerLat, workerLng]}><Popup>Worker Location</Popup></Marker>
                </MapContainer>
                <p className="font-bold mt-2 text-blue-800">Distance: {distance} km</p>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}