import React, { useState, useRef } from "react";
import "./RequestForm.css";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useLocation, useNavigate } from "react-router-dom";
import CardShow from "./workerDetailCard";
import imageCompression from "browser-image-compression";
import Loader from "../Loder/Loader";

// Fallback data so the page never crashes if "location.state" is empty
const MOCK_WORKER = {
  _id: "mock_1",
  name: "Service Provider",
  categories: "General",
  address: "Amravati, Maharashtra",
  profileImage: "https://via.placeholder.com/150",
  rating: 4.5
};

const RequestForm = () => {
  const [Lodding, setLodding] = useState(false);
  const [LoddingLoc, setLoddingLoc] = useState(false);
  const location = useLocation();
  const navigate = useNavigate(); // Renamed from 'navigator' to avoid conflict with window.navigator

  // Safety Check: Use mock data if state is null
  const { worker = MOCK_WORKER, data = { _id: "u1", address: "Local" } } = location.state || {};

  const [image, setImage] = useState(null);
  const [addressName, setAddressName] = useState("Amravati");
  const [form, setForm] = useState({
    message: "",
    date: "",
    time: "",
    ProblamImage: "",
    coordinates: [77.7796, 20.9374],
  });

  const mapRef = useRef(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const getAddressFromCoords = async (lat, lng) => {
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`);
      const result = await res.json();
      setAddressName(result.display_name || "Location Selected");
    } catch (err) {
      console.log("Map service offline, using default address.");
    }
  };

  const handleImage = async (e) => {
    const imageFile = e.target.files[0];
    if (imageFile) {
      const options = { maxSizeMB: 0.4, maxWidthOrHeight: 800, useWebWorker: true };
      try {
        const compressedFile = await imageCompression(imageFile, options);
        setForm({ ...form, ProblamImage: compressedFile });
        setImage(URL.createObjectURL(compressedFile));
      } catch (err) { console.error(err); }
    }
  };

  const markerIcon = L.icon({
    iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setLodding(true);
    
    // Bypassing Backend: Simulation
    console.log("Simulating Request Submission...", { workerId: worker._id, form });
    
    setTimeout(() => {
      setLodding(false);
      alert("Request Sent (Simulated Mode)");
      navigate("/request"); // Correct use of navigate
    }, 1000);
  };

  const detectMyLocation = () => {
    setLoddingLoc(true);
    // Fixed: using window.navigator to get geolocation
    if (window.navigator.geolocation) {
      window.navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        setForm((prev) => ({ ...prev, coordinates: [longitude, latitude] }));
        if (mapRef.current) mapRef.current.setView([latitude, longitude], 13);
        getAddressFromCoords(latitude, longitude);
        setLoddingLoc(false);
      }, () => setLoddingLoc(false));
    } else {
      alert("Geolocation not supported.");
      setLoddingLoc(false);
    }
  };

  function LocationMarker() {
    useMapEvents({
      click(e) {
        setForm({ ...form, coordinates: [e.latlng.lng, e.latlng.lat] });
      },
    });
    return <Marker position={[form.coordinates[1], form.coordinates[0]]} icon={markerIcon} />;
  }

  return (
    <div>
      <CardShow worker={worker} />
      <div className="request-form-container">
        {Lodding && <Loader />}
        <form className="request-form" onSubmit={handleSubmit}>
          <h2>Request a Service</h2>
          <div className="main-container-deckstop">
            <div className="Left">
              <label>Worker:</label>
              <input value={worker?.name || ""} disabled />

              <label>Category:</label>
              <input value={worker?.categories || ""} disabled />

              <label>Message:</label>
              <textarea name="message" value={form.message} onChange={handleChange} rows={5} />

              <label>Date:</label>
              <input type="date" name="date" required onChange={handleChange} />

              <label>Time:</label>
              <input type="time" name="time" required onChange={handleChange} />
            </div>

            <div className="Right">
              <div className="map-section">
                <label>Service Location:</label>
                <div style={{ height: "200px", background: "#eee", borderRadius: "8px", overflow: "hidden" }}>
                  <MapContainer
                    center={[form.coordinates[1], form.coordinates[0]]}
                    zoom={10}
                    className="map"
                    whenCreated={(map) => (mapRef.current = map)}
                  >
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    <LocationMarker />
                  </MapContainer>
                </div>
                <input type="text" value={addressName} disabled className="mt-2" />
                <button type="button" className="detect-btn mt-2" onClick={detectMyLocation}>
                  {LoddingLoc ? "Locating..." : "Detect My Location"}
                </button>
              </div>
            </div>
          </div>
          <button type="submit" className="submit-btn">Send Request</button>
        </form>
      </div>
    </div>
  );
};

export default RequestForm;