import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../utils/AuthContext';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// --- 1. SUB-COMPONENTS ---

// A. CHAT COMPONENT
const ChatWindow = ({ serviceRequestId, customerName, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchMessages();
  }, [serviceRequestId]);

  const fetchMessages = async () => {
    try {
      const response = await fetch(
        `${API_BASE}/chats/messages?serviceRequestId=${serviceRequestId}`,
        { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } }
      );
      const data = await response.json();
      setMessages(data || []);
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const sendMsg = async () => {
    if (!input.trim()) return;
    try {
      await fetch(`${API_BASE}/chats/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          serviceRequestId,
          message: input,
          senderRole: 'worker'
        })
      });
      setMessages([...messages, { sender: user.id, text: input, timestamp: new Date() }]);
      setInput('');
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col animate-slide-up">
      <div className="bg-blue-700 text-white p-4 flex items-center gap-3 shadow">
        <button onClick={onClose} className="text-xl font-bold">←</button>
        <div className="flex-1">
          <h3 className="font-bold">{customerName}</h3>
          <p className="text-xs text-blue-200">Online</p>
        </div>
      </div>
      <div className="flex-1 p-4 overflow-y-auto bg-gray-100 space-y-3">
        {loading ? (
          <p className="text-center text-gray-400">Loading...</p>
        ) : messages.length === 0 ? (
          <p className="text-center text-gray-400 mt-10">No messages yet</p>
        ) : (
          messages.map((m, i) => (
            <div key={i} className={`flex ${m.sender === user.id ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] p-3 rounded-xl text-sm ${m.sender === user.id ? 'bg-blue-600 text-white rounded-br-none' : 'bg-white text-gray-800 rounded-bl-none shadow'}`}>
                {m.text}
              </div>
            </div>
          ))
        )}
      </div>
      <div className="p-3 bg-white border-t flex gap-2">
        <input 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMsg()}
          placeholder="Type..."
          className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:outline-none"
        />
        <button onClick={sendMsg} className="bg-blue-600 text-white p-3 rounded-full">➤</button>
      </div>
    </div>
  );
};

// B. JOB FEED (Available Requests - Filtered by Worker's Categories)
const JobFeed = ({ jobs, loading, workerCategories, onAccept }) => {
  // Filter jobs to show only those matching worker's categories
  const filteredJobs = jobs.filter(job => {
    if (!workerCategories || workerCategories.length === 0) return true;
    return workerCategories.includes(job.category);
  });

  return (
    <div className="p-4 pb-20">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-800">New Requests ({filteredJobs.length})</h2>
        {workerCategories && workerCategories.length > 0 && (
          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
            Filtered
          </span>
        )}
      </div>
      {loading ? (
        <p className="text-center text-gray-400 mt-10">Loading requests...</p>
      ) : filteredJobs.length === 0 ? (
        <div className="text-center py-10 text-gray-400">
          <p className="text-3xl mb-2">🔍</p>
          {workerCategories && workerCategories.length === 0 ? (
            <>
              <p>Please select your specialties in your profile.</p>
              <p className="text-xs mt-2">Go to Profile → Select Categories</p>
            </>
          ) : (
            <p>No matching jobs in your categories right now. Check back soon!</p>
          )}
        </div>
      ) : 
        filteredJobs.map(job => (
          <div key={job._id} className="bg-white rounded-xl shadow-sm border border-gray-100 mb-4 overflow-hidden">
            <div className="relative h-32 bg-gray-200">
              <img src={job.photo || 'https://placehold.co/600x400/e2e8f0/1e293b'} alt="Service" className="w-full h-full object-cover" onError={(e) => e.target.src = 'https://placehold.co/600x400/e2e8f0/1e293b'} />
              <div className="absolute top-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
                {job.category}
              </div>
              {job.isUrgent && (
                <div className="absolute top-2 right-2 bg-red-600 text-white text-xs px-2 py-1 rounded font-bold animate-pulse">
                  URGENT
                </div>
              )}
            </div>
            <div className="p-3">
              <div className="flex justify-between items-start mb-1">
                 <h3 className="font-bold text-gray-800 line-clamp-1">{job.title}</h3>
                 <span className="text-green-600 font-bold shrink-0">₹{job.budget || 0}</span>
              </div>
              <p className="text-xs text-gray-500 line-clamp-2 mb-3">{job.description}</p>
              
              <div className="flex justify-between items-center border-t pt-3">
                <span className="text-xs text-gray-500">📍 {job.location?.distance || 'N/A'} • {new Date(job.createdAt).toLocaleDateString()}</span>
                <button 
                  onClick={() => onAccept(job._id)}
                  className="bg-gray-900 text-white px-6 py-2 rounded-lg text-xs font-bold shadow hover:bg-gray-700 transition-all">
                  ACCEPT
                </button>
              </div>
            </div>
          </div>
        ))
      }
    </div>
  );
};

// C. MY JOBS LIST (Accepted but not completed)
const MyJobsScreen = ({ acceptedJobs, loading, onSelectJob }) => (
  <div className="p-4 pb-20">
    <h2 className="text-xl font-bold mb-4 text-gray-800">My Tasks ({acceptedJobs.length})</h2>
    {loading ? (
      <p className="text-center text-gray-400 mt-10">Loading...</p>
    ) : acceptedJobs.length === 0 ? (
      <div className="text-center py-20 text-gray-400">
        <p className="text-4xl mb-2">📋</p>
        <p>You haven't accepted any jobs yet.</p>
        <p className="text-sm">Go to "Feed" to find work.</p>
      </div>
    ) : (
      acceptedJobs.map(job => (
        <div 
          key={job._id} 
          onClick={() => onSelectJob(job)}
          className="bg-white p-4 rounded-xl shadow mb-3 border-l-4 border-blue-500 cursor-pointer hover:bg-blue-50 transition-colors">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-bold">{job.customerName || 'Customer'}</h3>
            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded font-bold">{job.status}</span>
          </div>
          <p className="text-sm text-gray-600 line-clamp-1">{job.title}</p>
          <p className="text-xs text-gray-400 mt-1">{job.location?.address || 'No address'}</p>
          <div className="mt-3 text-right text-blue-600 text-sm font-bold">
            Tap to Open &rarr;
          </div>
        </div>
      ))
    )}
  </div>
);

// D. EARNINGS SCREEN
const EarningsScreen = ({ payouts, loading }) => {
  const totalEarnings = payouts.reduce((sum, p) => sum + (p.amount || 0), 0);
  const thisMonth = payouts.filter(p => new Date(p.date).getMonth() === new Date().getMonth()).reduce((sum, p) => sum + (p.amount || 0), 0);

  return (
    <div className="p-4 pb-20">
      <h2 className="text-2xl font-bold mb-6">💰 Earnings</h2>
      
      {/* Balance Card */}
      <div className="bg-linear-to-r from-green-500 to-emerald-700 text-white p-6 rounded-2xl shadow-lg mb-8">
        <p className="text-green-100 text-sm font-medium">Total Earned</p>
        <h1 className="text-4xl font-bold mt-1">₹{totalEarnings || 0}</h1>
        <p className="text-xs mt-2 bg-white/20 inline-block px-2 py-1 rounded">This Month: ₹{thisMonth}</p>
      </div>

      {/* Payout List */}
      <h3 className="font-bold text-gray-700 mb-3">Recent Payouts</h3>
      {loading ? (
        <p className="text-center text-gray-400">Loading...</p>
      ) : payouts.length === 0 ? (
        <p className="text-center text-gray-400">No payouts yet</p>
      ) : (
        <div className="space-y-3">
          {payouts.map(payout => (
            <div key={payout._id} className="flex justify-between items-center bg-white p-3 rounded-lg shadow-sm">
              <div>
                <p className="font-bold text-sm">{payout.description || 'Service Payout'}</p>
                <p className="text-xs text-gray-400">{new Date(payout.date).toLocaleDateString()}</p>
              </div>
              <span className="text-green-600 font-bold">+ ₹{payout.amount || 0}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// E. PROFILE SCREEN with KYC and Category Selection
const ProfileScreen = ({ worker, kycStatus, workerCategories, onCategoryChange, onSaveCategories, onKYCStart }) => {
  const [editingCategories, setEditingCategories] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState(workerCategories || []);
  const [savingCategories, setSavingCategories] = useState(false);

  const allCategories = [
    'Electrician', 'Plumber', 'Carpenter', 'Painter',
    'AC Repair', 'Appliance Repair', 'Locksmith', 'Mason',
    'Plumbing', 'Cleaning', 'Pest Control', 'Handyman'
  ];

  const handleCategoryToggle = (category) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const handleSaveCategories = async () => {
    setSavingCategories(true);
    try {
      await onSaveCategories(selectedCategories);
      setEditingCategories(false);
    } finally {
      setSavingCategories(false);
    }
  };

  if (!worker) {
    return (
      <div className="p-4 pb-20">
        <p className="text-center text-gray-400 mt-10">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="p-4 pb-20">
      <div className="bg-white p-6 rounded-2xl shadow-sm text-center mb-6">
        <div className="w-24 h-24 bg-linear-to-br from-blue-400 to-purple-500 rounded-full mx-auto mb-4 border-4 border-blue-50 flex items-center justify-center text-white text-3xl">
          👤
        </div>
        <h2 className="text-2xl font-bold text-gray-800">{worker.firstName} {worker.lastName}</h2>
        <p className="text-gray-500">{worker.experience || 'Professional'}</p>
        
        <div className="flex justify-center gap-6 mt-6 border-t pt-4">
          <div>
            <p className="text-xl font-bold text-gray-900">{worker.rating || 4.5} ⭐</p>
            <p className="text-xs text-gray-400">Rating</p>
          </div>
          <div>
            <p className="text-xl font-bold text-gray-900">{worker.jobsDone || 0}</p>
            <p className="text-xs text-gray-400">Jobs</p>
          </div>
          <div>
            <p className="text-xl font-bold text-gray-900" style={{fontSize: '18px'}}>{worker.serviceRadius || 5} km</p>
            <p className="text-xs text-gray-400">Radius</p>
          </div>
        </div>
      </div>

      {/* KYC Status */}
      <div className={`p-4 rounded-xl mb-6 border-2 ${kycStatus === 'approved' ? 'bg-green-50 border-green-300' : kycStatus === 'pending' ? 'bg-yellow-50 border-yellow-300' : 'bg-red-50 border-red-300'}`}>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-gray-800">KYC Verification</h3>
            <p className={`text-xs ${kycStatus === 'approved' ? 'text-green-700' : kycStatus === 'pending' ? 'text-yellow-700' : 'text-red-700'}`}>
              {kycStatus === 'approved' ? '✅ Verified' : kycStatus === 'pending' ? '⏳ Pending Review' : '❌ Not Verified'}
            </p>
          </div>
          {kycStatus !== 'approved' && (
            <button 
              onClick={onKYCStart}
              className="bg-blue-600 text-white px-4 py-2 rounded font-bold text-xs">
              {kycStatus === 'pending' ? 'View' : 'Start'}
            </button>
          )}
        </div>
      </div>

      {/* Services/Categories Selection */}
      <div className="bg-white rounded-xl p-4 mb-6 border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-lg text-gray-800">🛠️ Your Specialties</h3>
          <button
            onClick={() => {
              if (editingCategories) {
                handleSaveCategories();
              } else {
                setEditingCategories(true);
              }
            }}
            disabled={savingCategories}
            className={`px-3 py-1 rounded font-bold text-xs transition-all ${
              editingCategories
                ? 'bg-green-600 text-white hover:bg-green-700'
                : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
            } ${savingCategories ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {editingCategories ? (savingCategories ? 'Saving...' : 'Save') : 'Edit'}
          </button>
        </div>

        {!editingCategories ? (
          // View Mode
          <div className="flex gap-2 flex-wrap">
            {selectedCategories && selectedCategories.length > 0 ? (
              selectedCategories.map(cat => (
                <span key={cat} className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                  ✓ {cat}
                </span>
              ))
            ) : (
              <p className="text-gray-400 text-sm">No specialties selected yet. Click Edit to add.</p>
            )}
          </div>
        ) : (
          // Edit Mode
          <div className="grid grid-cols-2 gap-2">
            {allCategories.map(cat => (
              <label key={cat} className="flex items-center p-2 border rounded cursor-pointer hover:bg-gray-50 transition-colors" style={{borderColor: selectedCategories.includes(cat) ? '#3b82f6' : '#e5e7eb'}}>
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(cat)}
                  onChange={() => handleCategoryToggle(cat)}
                  className="w-4 h-4 accent-blue-600"
                />
                <span className="ml-2 text-sm">{cat}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      <button className="w-full bg-red-50 text-red-600 py-3 rounded-xl font-bold hover:bg-red-100 transition-colors">
        Log Out
      </button>
    </div>
  );
};

// F. ACTIVE JOB EXECUTION SCREEN
const ActiveJobExecution = ({ job, onBack, onUpdateStatus, openChat }) => {
  if (!job) return null;

  const statusFlow = ['Pending', 'Accepted', 'Arrived', 'Work Started', 'Completed'];
  const currentIndex = statusFlow.indexOf(job.status);

  return (
    <div className="h-full bg-white flex flex-col">
      {/* Top Nav for Active Job */}
      <div className="p-4 flex items-center gap-4 border-b">
        <button onClick={onBack} className="text-2xl">←</button>
        <div>
           <h2 className="font-bold">Request #{job._id?.slice(-6) || job.id}</h2>
           <p className="text-xs text-gray-500">{job.status}</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 pb-24">
         <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-1">{job.title}</h1>
            <p className="text-gray-600">{job.description}</p>
         </div>

         {/* Steps Visualizer */}
         <div className="flex justify-between text-xs font-bold text-gray-400 mb-8 px-2">
           {statusFlow.map((step, i) => (
             <span key={step} className={i <= currentIndex ? 'text-green-600' : ''}>
               {step}
             </span>
           ))}
         </div>

         {/* Customer Card */}
         <div className="bg-gray-50 p-4 rounded-xl border mb-6">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-bold text-lg">{job.customerName || 'Customer'}</h3>
              <div className="flex gap-2">
                <a href={`tel:${job.customerPhone || '1234567890'}`} className="bg-white p-2 rounded-full shadow text-green-600">📞</a>
                <button onClick={openChat} className="bg-white p-2 rounded-full shadow text-blue-600">💬</button>
              </div>
            </div>
            <p className="text-sm text-gray-500 mb-3">{job.location?.address || 'No address'}</p>
            <button 
              onClick={() => window.open(`https://maps.google.com/?q=${encodeURIComponent(job.location?.address || '')}`)}
              className="w-full bg-blue-100 text-blue-700 py-2 rounded font-bold text-sm">
              📍 Navigate to Location
            </button>
         </div>

         {/* Job Photo */}
         {job.photo && (
           <>
             <h4 className="font-bold mb-2">Issue Photo</h4>
             <div className="rounded-xl overflow-hidden mb-6 h-48 bg-gray-200">
               <img src={job.photo} alt="Issue" className="w-full h-full object-cover" onError={(e) => e.target.style.display = 'none'} />
             </div>
           </>
         )}

         <h4 className="font-bold mb-2">Budget: <span className="text-green-600">₹{job.budget || 0}</span></h4>
      </div>

      {/* Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t max-w-md mx-auto">
         {job.status === 'Accepted' && (
           <button onClick={() => onUpdateStatus(job._id, 'Arrived')} className="w-full bg-orange-500 text-white py-3 rounded-xl font-bold text-lg shadow-lg hover:bg-orange-600">
             I Have Arrived 🏠
           </button>
         )}
         {job.status === 'Arrived' && (
           <button onClick={() => onUpdateStatus(job._id, 'Work Started')} className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold text-lg shadow-lg hover:bg-blue-700">
             Start Work 🛠️
           </button>
         )}
         {job.status === 'Work Started' && (
           <button onClick={() => onUpdateStatus(job._id, 'Completed')} className="w-full bg-green-600 text-white py-3 rounded-xl font-bold text-lg shadow-lg hover:bg-green-700">
             Mark Completed (Get ₹{job.budget}) ✅
           </button>
         )}
         {job.status === 'Pending' && (
           <button disabled className="w-full bg-gray-300 text-gray-600 py-3 rounded-xl font-bold text-lg cursor-not-allowed">
             Waiting for Customer Confirmation
           </button>
         )}
         {job.status === 'Completed' && (
           <button disabled className="w-full bg-green-300 text-green-700 py-3 rounded-xl font-bold text-lg cursor-not-allowed">
             ✅ Completed
           </button>
         )}
      </div>
    </div>
  );
};


// --- 2. MAIN CONTROLLER ---

export default function WorkerNavigator() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('feed');
  const [isOnline, setIsOnline] = useState(true);
  
  // Data State
  const [availableJobs, setAvailableJobs] = useState([]);
  const [acceptedJobs, setAcceptedJobs] = useState([]);
  const [worker, setWorker] = useState(null);
  const [workerCategories, setWorkerCategories] = useState([]);
  const [payouts, setPayouts] = useState([]);
  const [kycStatus, setKycStatus] = useState('not-verified');
  
  // UI State
  const [activeJobId, setActiveJobId] = useState(null);
  const [showChat, setShowChat] = useState(false);
  const [loading, setLoading] = useState({ feed: true, jobs: true, profile: true, payouts: true });

  const token = localStorage.getItem('token');

  // Fetch available requests
  useEffect(() => {
    if (!isOnline || activeTab !== 'feed') return;
    const fetchJobs = async () => {
      try {
        setLoading(prev => ({ ...prev, feed: true }));
        const response = await fetch(
          `${API_BASE}/serviceRequests/incoming`,
          { headers: { 'Authorization': `Bearer ${token}` } }
        );
        const data = await response.json();
        setAvailableJobs(Array.isArray(data) ? data : data.data || []);
      } catch (error) {
        console.error('Failed to fetch jobs:', error);
        setAvailableJobs([]);
      } finally {
        setLoading(prev => ({ ...prev, feed: false }));
      }
    };

    fetchJobs();
    const interval = setInterval(fetchJobs, 10000); // Poll every 10 seconds
    return () => clearInterval(interval);
  }, [isOnline, activeTab, token, user]);

  // Fetch accepted requests
  useEffect(() => {
    if (activeTab !== 'myjobs') return;
    const fetchAcceptedJobs = async () => {
      try {
        setLoading(prev => ({ ...prev, jobs: true }));
        const response = await fetch(
          `${API_BASE}/serviceRequests/my`,
          { headers: { 'Authorization': `Bearer ${token}` } }
        );
        const data = await response.json();
        setAcceptedJobs(Array.isArray(data) ? data : data.data || []);
      } catch (error) {
        console.error('Failed to fetch accepted jobs:', error);
        setAcceptedJobs([]);
      } finally {
        setLoading(prev => ({ ...prev, jobs: false }));
      }
    };

    fetchAcceptedJobs();
  }, [activeTab, token, user?.id]);

  // Fetch worker profile and categories
  useEffect(() => {
    if (activeTab !== 'profile') return;
    const fetchProfile = async () => {
      try {
        setLoading(prev => ({ ...prev, profile: true }));
        // Fetch user profile
        const userResponse = await fetch(
          `${API_BASE}/users/me`,
          { headers: { 'Authorization': `Bearer ${token}` } }
        );
        const userData = await userResponse.json();
        
        // Fetch worker profile with categories
        const workerResponse = await fetch(
          `${API_BASE}/workers/me/profile`,
          { headers: { 'Authorization': `Bearer ${token}` } }
        );
        const workerData = await workerResponse.json();
        
        setWorker({
          firstName: userData.name?.split(' ')[0] || userData.name,
          lastName: userData.name?.split(' ').slice(1).join(' ') || '',
          rating: workerData?.ratingAvg || 4.5,
          jobsDone: 0,
          serviceRadius: workerData?.serviceRadiusKm || 5,
          experience: userData.address || 'Professional',
          ...workerData
        });
        setWorkerCategories(workerData?.categories || []);
        setKycStatus(userData.shopkeeperKyc?.status || 'not_submitted');
      } catch (error) {
        console.error('Failed to fetch profile:', error);
      } finally {
        setLoading(prev => ({ ...prev, profile: false }));
      }
    };

    fetchProfile();
  }, [activeTab, token]);

  // Fetch payouts
  useEffect(() => {
    if (activeTab !== 'earnings') return;
    const fetchPayouts = async () => {
      try {
        setLoading(prev => ({ ...prev, payouts: true }));
        const response = await fetch(
          `${API_BASE}/payouts/me`,
          { headers: { 'Authorization': `Bearer ${token}` } }
        );
        const data = await response.json();
        setPayouts(Array.isArray(data) ? data : data.data || []);
      } catch (error) {
        console.error('Failed to fetch payouts:', error);
        setPayouts([]);
      } finally {
        setLoading(prev => ({ ...prev, payouts: false }));
      }
    };

    fetchPayouts();
  }, [activeTab, token, user?.id]);

  // Accept a job
  const handleAcceptJob = async (jobId) => {
    try {
      const response = await fetch(`${API_BASE}/serviceRequests/${jobId}/accept`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ workerId: user?.id })
      });

      if (!response.ok) throw new Error('Failed to accept job');

      const job = availableJobs.find(j => j._id === jobId);
      setAvailableJobs(prev => prev.filter(j => j._id !== jobId));
      setAcceptedJobs(prev => [...prev, { ...job, status: 'Accepted' }]);
      alert('Job accepted! Check "My Tasks" to start working.');
    } catch (error) {
      console.error('Failed to accept job:', error);
      alert('Failed to accept job. Try again.');
    }
  };

  // Open a specific job
  const handleOpenJob = (job) => {
    setActiveJobId(job._id);
  };

  // Update job status
  const handleJobStatusUpdate = async (jobId, newStatus) => {
    if (newStatus === 'Completed') {
      const confirm = window.confirm('Mark job as completed? You will receive payment.');
      if (!confirm) return;
    }

    try {
      const response = await fetch(`${API_BASE}/serviceRequests/${jobId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (!response.ok) throw new Error('Failed to update status');

      if (newStatus === 'Completed') {
        setAcceptedJobs(prev => prev.filter(j => j._id !== jobId));
        setActiveJobId(null);
        alert('Job completed! Payment will be processed soon.');
      } else {
        setAcceptedJobs(prev => 
          prev.map(j => j._id === jobId ? { ...j, status: newStatus } : j)
        );
      }
    } catch (error) {
      console.error('Failed to update job status:', error);
      alert('Failed to update status. Try again.');
    }
  };

  // Save worker categories
  const handleSaveCategories = async (categories) => {
    try {
      const response = await fetch(`${API_BASE}/workers/me/categories`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ categories })
      });

      if (!response.ok) throw new Error('Failed to save categories');

      setWorkerCategories(categories);
      alert('Specialties saved successfully!');
    } catch (error) {
      console.error('Failed to save categories:', error);
      alert('Failed to save specialties. Try again.');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const activeJobData = acceptedJobs.find(j => j._id === activeJobId);

  // If viewing a specific job
  if (activeJobId && activeJobData) {
    return (
      <div className="max-w-md mx-auto h-screen relative bg-white shadow-2xl">
        <ActiveJobExecution 
          job={activeJobData} 
          onBack={() => setActiveJobId(null)}
          onUpdateStatus={handleJobStatusUpdate}
          openChat={() => setShowChat(true)}
        />
        {showChat && (
          <ChatWindow 
            serviceRequestId={activeJobData._id} 
            customerName={activeJobData.customerName || 'Customer'} 
            onClose={() => setShowChat(false)} 
          />
        )}
      </div>
    );
  }

  // Main Navigator
  return (
    <div className="h-screen bg-gray-50 flex flex-col font-sans max-w-md mx-auto border-x shadow-2xl relative">
      
      {/* HEADER */}
      <header className="bg-white p-4 shadow-sm z-10 sticky top-0">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold text-gray-900">🛠️ ProWorker</h1>
            <p className="text-xs text-gray-500">Welcome, {user?.firstName || 'Worker'}</p>
          </div>
          <div className="flex items-center gap-2">
            <div onClick={() => setIsOnline(!isOnline)} className={`flex items-center gap-2 cursor-pointer px-3 py-1 rounded-full border ${isOnline ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-gray-50'}`}>
              <div className={`w-3 h-3 rounded-full ${isOnline ? 'bg-green-500' : 'bg-gray-400'}`}></div>
              <span className={`text-xs font-bold ${isOnline ? 'text-green-700' : 'text-gray-500'}`}>
                {isOnline ? 'Online' : 'Offline'}
              </span>
            </div>
            <button onClick={handleLogout} className="bg-red-600 hover:bg-red-500 text-white px-3 py-1 rounded text-xs font-semibold">
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* CONTENT AREA */}
      <main className="flex-1 overflow-y-auto">
        {!isOnline ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400 p-6 text-center">
            <span className="text-4xl mb-2">🌑</span>
            <p>You are offline. Go online to see jobs.</p>
          </div>
        ) : (
          <>
            {activeTab === 'feed' && <JobFeed jobs={availableJobs} loading={loading.feed} workerCategories={workerCategories} onAccept={handleAcceptJob} />}
            {activeTab === 'myjobs' && <MyJobsScreen acceptedJobs={acceptedJobs} loading={loading.jobs} onSelectJob={handleOpenJob} />}
            {activeTab === 'earnings' && <EarningsScreen payouts={payouts} loading={loading.payouts} />}
            {activeTab === 'profile' && <ProfileScreen worker={worker} kycStatus={kycStatus} workerCategories={workerCategories} onCategoryChange={setWorkerCategories} onSaveCategories={handleSaveCategories} onKYCStart={() => navigate('/worker/kyc')} />}
          </>
        )}
      </main>

      {/* BOTTOM NAVIGATION */}
      <nav className="bg-white border-t border-gray-200 flex justify-around p-3 pb-6 fixed bottom-0 w-full max-w-md">
        <button onClick={() => setActiveTab('feed')} className={`flex flex-col items-center transition-colors ${activeTab === 'feed' ? 'text-blue-600' : 'text-gray-400'}`}>
          <span className="text-xl">🔍</span>
          <span className="text-[10px] font-bold mt-1">FEED</span>
        </button>
        <button onClick={() => setActiveTab('myjobs')} className={`flex flex-col items-center relative transition-colors ${activeTab === 'myjobs' ? 'text-blue-600' : 'text-gray-400'}`}>
          <span className="text-xl">📋</span>
          <span className="text-[10px] font-bold mt-1">MY JOBS</span>
          {acceptedJobs.length > 0 && <span className="absolute -top-1 right-2 bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">{acceptedJobs.length}</span>}
        </button>
        <button onClick={() => setActiveTab('earnings')} className={`flex flex-col items-center transition-colors ${activeTab === 'earnings' ? 'text-blue-600' : 'text-gray-400'}`}>
          <span className="text-xl">💰</span>
          <span className="text-[10px] font-bold mt-1">MONEY</span>
        </button>
        <button onClick={() => setActiveTab('profile')} className={`flex flex-col items-center transition-colors ${activeTab === 'profile' ? 'text-blue-600' : 'text-gray-400'}`}>
          <span className="text-xl">👤</span>
          <span className="text-[10px] font-bold mt-1">PROFILE</span>
        </button>
      </nav>

    </div>
  );
}