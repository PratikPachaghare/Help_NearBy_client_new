import { useRef, useState } from 'react';
import './RequestForm.css';
import { MapContainer, Marker, TileLayer, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useLocation, useNavigate } from 'react-router-dom';
import CardShow from './workerDetailCard';
import Loader from '../Loder/Loader';
import { apiCall } from '../../../../utils/ApiCalls';

const MOCK_WORKER = {
  _id: 'mock_1',
  userId: { name: 'Service Provider', address: 'Amravati, Maharashtra' },
  categories: ['General'],
  ratingAvg: 4.5
};

const markerIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

const RequestForm = () => {
  const [loading, setLoading] = useState(false);
  const [loadingLoc, setLoadingLoc] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { worker = null, category: categoryFromCard = '', availableWorkers = [] } = location.state || {};
  const resolvedWorker = worker || MOCK_WORKER;
  const selectedCategory = categoryFromCard || (Array.isArray(resolvedWorker?.categories) ? resolvedWorker.categories[0] : resolvedWorker?.categories) || 'General';

  const [addressName, setAddressName] = useState(worker?.userId?.address || 'Amravati');
  const [form, setForm] = useState({
    message: '',
    date: '',
    time: '',
    coordinates: [77.7796, 20.9374]
  });

  const mapRef = useRef(null);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const getAddressFromCoords = async (lat, lng) => {
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`);
      const result = await res.json();
      setAddressName(result.display_name || 'Location Selected');
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        workerId: worker ? (resolvedWorker.userId?._id || resolvedWorker.userId || resolvedWorker._id) : undefined,
        category: selectedCategory,
        message: form.message,
        scheduledDate: form.date,
        scheduledTime: form.time,
        serviceAddress: addressName,
        lng: form.coordinates[0],
        lat: form.coordinates[1]
      };
      await apiCall('POST', '/service-requests', payload);
      alert(worker ? 'Request sent to selected worker' : 'Request broadcast to nearby matching workers');
      navigate('/worker/request');
    } catch (error) {
      alert(error?.response?.data?.message || 'Failed to send request');
    } finally {
      setLoading(false);
    }
  };

  const detectMyLocation = () => {
    setLoadingLoc(true);
    if (!window.navigator.geolocation) {
      setLoadingLoc(false);
      return;
    }

    window.navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setForm((prev) => ({ ...prev, coordinates: [longitude, latitude] }));
        mapRef.current?.setView([latitude, longitude], 13);
        getAddressFromCoords(latitude, longitude);
        setLoadingLoc(false);
      },
      () => setLoadingLoc(false)
    );
  };

  function LocationMarker() {
    useMapEvents({
      click(e) {
        setForm((prev) => ({ ...prev, coordinates: [e.latlng.lng, e.latlng.lat] }));
        getAddressFromCoords(e.latlng.lat, e.latlng.lng);
      }
    });

    return <Marker position={[form.coordinates[1], form.coordinates[0]]} icon={markerIcon} />;
  }

  return (
    <div>
      <CardShow worker={worker} />
      <div className="request-form-container">
        {loading && <Loader />}
        <form className="request-form" onSubmit={handleSubmit}>
          <h2>Request a Service</h2>
          <div className="main-container-deckstop">
            <div className="Left">
              <label>Worker:</label>
              <input value={worker ? (resolvedWorker?.userId?.name || resolvedWorker?.name || '') : 'Auto-match nearby workers'} disabled />

              <label>Category:</label>
              <input value={selectedCategory} disabled />

              {!worker && availableWorkers.length > 0 ? (
                <div className="text-xs text-slate-600 bg-slate-50 border border-slate-200 rounded p-2">
                  Preview workers: {availableWorkers.map((row) => row?.userId?.name).filter(Boolean).join(', ')}
                </div>
              ) : null}

              <label>Message:</label>
              <textarea name="message" value={form.message} onChange={handleChange} rows={5} required />

              <label>Date:</label>
              <input type="date" name="date" required onChange={handleChange} />

              <label>Time:</label>
              <input type="time" name="time" required onChange={handleChange} />
            </div>

            <div className="Right">
              <div className="map-section">
                <label>Service Location:</label>
                <div style={{ height: '200px', background: '#eee', borderRadius: '8px', overflow: 'hidden' }}>
                  <MapContainer
                    center={[form.coordinates[1], form.coordinates[0]]}
                    zoom={10}
                    className="map"
                    whenReady={(event) => {
                      mapRef.current = event.target;
                    }}
                  >
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    <LocationMarker />
                  </MapContainer>
                </div>
                <input type="text" value={addressName} disabled className="mt-2" />
                <button type="button" className="detect-btn mt-2" onClick={detectMyLocation}>
                  {loadingLoc ? 'Locating...' : 'Detect My Location'}
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
