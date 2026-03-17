import { useCallback, useEffect, useMemo, useState } from 'react';
import './Requast.css';
import PeddingRequast from '../componets/Requast/PeddingRequast';
import AcceptedRequeast from '../componets/Requast/AcceptedRequeast';
import { apiCall } from '../../../utils/ApiCalls';
import { useAuth } from '../../../utils/AuthContext';

const Requast = () => {
  const { user } = useAuth();
  const isWorker = user?.role === 'worker';
  const [activeTab, setActiveTab] = useState('request');
  const [requests, setRequests] = useState([]);

  const loadRequests = useCallback(async () => {
    try {
      const endpoint = isWorker ? '/service-requests/incoming' : '/service-requests/my';
      const resp = await apiCall('GET', endpoint);
      setRequests(resp?.data || []);
    } catch (error) {
      console.error(error);
      setRequests([]);
    }
  }, [isWorker]);

  useEffect(() => {
    if (!user) return;
    const timer = setTimeout(() => {
      loadRequests();
    }, 0);
    return () => clearTimeout(timer);
  }, [user, loadRequests]);

  const pending = useMemo(() => requests.filter((r) => ['pending'].includes(r.status)), [requests]);
  const accepted = useMemo(() => requests.filter((r) => ['accepted', 'arrived', 'work_started', 'completed'].includes(r.status)), [requests]);

  const handleAccept = async (req) => {
    try {
      await apiCall('PATCH', `/service-requests/${req._id}/accept`);
      loadRequests();
    } catch (error) {
      alert(error?.response?.data?.message || 'Failed to accept');
    }
  };

  const handleReject = async (id) => {
    try {
      if (isWorker) {
        await apiCall('PATCH', `/service-requests/${id}/reject`);
      } else {
        await apiCall('PATCH', `/service-requests/${id}/status`, { status: 'cancelled' });
      }
      loadRequests();
    } catch (error) {
      alert(error?.response?.data?.message || 'Failed to update');
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      await apiCall('PATCH', `/service-requests/${id}/status`, { status });
      loadRequests();
    } catch (error) {
      alert(error?.response?.data?.message || 'Failed to update status');
    }
  };

  return (
    <div className="request-container">
      <div className="request-tabs">
        <button className={activeTab === 'request' ? 'tab active' : 'tab'} onClick={() => setActiveTab('request')}>
          {isWorker ? 'Requests Received' : 'Requests Sent'}
        </button>
        <button className={activeTab === 'accepted' ? 'tab active' : 'tab'} onClick={() => setActiveTab('accepted')}>
          Accepted
        </button>
      </div>
      <div className="request-content">
        {activeTab === 'request' && (
          <PeddingRequast pending={pending} handleAccept={handleAccept} handleReject={handleReject} isWorker={isWorker} />
        )}
        {activeTab === 'accepted' && (
          <AcceptedRequeast
            accepted={accepted}
            workerLocation={[20.9374, 77.7796]}
            isWorker={isWorker}
            onStatusUpdate={handleStatusUpdate}
          />
        )}
      </div>
    </div>
  );
};

export default Requast;
