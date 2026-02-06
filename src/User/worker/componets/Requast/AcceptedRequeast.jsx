import React from "react";
import L from "leaflet";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "./Accept.css";

// --- MOCK DATA (Replaces Redux) ---
const IS_WORKER_RAW = true; // Set to false to see User View

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

export default function AcceptedRequeast({ accepted = [], workerLocation = [20.9374, 77.7796] }) {
  // Use raw data instead of useSelector
  const isWorker = IS_WORKER_RAW;

  return (
    <div className="accepted-list">
      {accepted.length === 0 ? (
        <p className="text-center p-5">No accepted requests yet.</p>
      ) : (
        accepted.map((req) => {
          // Fallback coordinates if data is missing
          const userLat = req.location?.coordinates?.[0] || 20.9374;
          const userLng = req.location?.coordinates?.[1] || 77.7796;
          const workerLat = workerLocation[0];
          const workerLng = workerLocation[1];

          const distance = getDistanceFromLatLonInKm(workerLat, workerLng, userLat, userLng).toFixed(2);

          return (
            <div key={req._id} className="request-card accepted border p-4 mb-4 rounded shadow">
              <div className="flex flex-wrap gap-5 justify-between">
                <div className="details flex-1 min-w-[280px]">
                  <h3 className="font-bold text-lg mb-2">{isWorker ? "User Details" : "Worker Details"}</h3>
                  <strong>Name: {isWorker ? req.user?.name : req.worker?.name}</strong>
                  <p><strong>Phone:</strong> {isWorker ? req.user?.phone : req.worker?.phone}</p>
                  <p><strong>Address:</strong> {isWorker ? req.user?.address : req.worker?.address}</p>
                  <p><strong>Message:</strong> {req.message}</p>
                  <p><strong>Date:</strong> {new Date(req.requestedDate).toLocaleDateString()}</p>
                  
                  <button
                    className="mt-3 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    onClick={() => openGoogleMapsDirection(workerLat, workerLng, userLat, userLng)}
                  >
                    Track on Google Maps
                  </button>
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