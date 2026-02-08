import React, { useState } from 'react';

// --- 1. ENHANCED MOCK DATA ---

const MOCK_AVAILABLE_JOBS = [
  {
    id: 201,
    customer: 'Amit Kumar',
    address: 'B-12, Sector 4, Market Road',
    distance: '2.0 km',
    category: 'Electrician',
    title: 'Fan making loud noise',
    desc: 'Ceiling fan wobbles and makes grinding sound.',
    price: 350,
    isUrgent: false,
    image: 'https://placehold.co/600x400/e2e8f0/1e293b?text=Fan+Repair',
    time: 'Today, 2:00 PM'
  },
  {
    id: 202,
    customer: 'Sneha Gupta',
    address: 'Flat 901, Cloud Tower',
    distance: '5.4 km',
    category: 'Plumber',
    title: 'Kitchen Sink Leaking',
    desc: 'Water leaking continuously under the sink.',
    price: 500,
    isUrgent: true,
    image: 'https://placehold.co/600x400/e2e8f0/1e293b?text=Sink+Leak',
    time: 'ASAP'
  },
  {
    id: 203,
    customer: 'Rajiv Malhotra',
    address: 'H.No 44, Green Avenue',
    distance: '1.1 km',
    category: 'Carpenter',
    title: 'Door Lock Broken',
    desc: 'Main door lock is jammed, cannot open from outside.',
    price: 450,
    isUrgent: true,
    image: 'https://placehold.co/600x400/e2e8f0/1e293b?text=Broken+Lock',
    time: 'Urgent'
  },
  {
    id: 204,
    customer: 'Priya Singh',
    address: 'Shop 5, City Mall',
    distance: '3.0 km',
    category: 'Electrician',
    title: 'Switch Board Short',
    desc: 'Sparks coming from the main switch board.',
    price: 800,
    isUrgent: false,
    image: 'https://placehold.co/600x400/e2e8f0/1e293b?text=Switch+Board',
    time: 'Tomorrow, 10:00 AM'
  }
];

const MOCK_EARNINGS = [
  { id: 1, day: 'Mon', amount: 1200 },
  { id: 2, day: 'Tue', amount: 850 },
  { id: 3, day: 'Wed', amount: 1500 },
  { id: 4, day: 'Thu', amount: 400 },
  { id: 5, day: 'Fri', amount: 2000 },
  { id: 6, day: 'Sat', amount: 0 },
  { id: 7, day: 'Sun', amount: 0 },
];

const WORKER_PROFILE = {
  name: 'Rajesh Sharma',
  role: 'Senior Technician',
  rating: 4.8,
  reviews: 124,
  jobsDone: 342,
  joined: 'Aug 2023',
  skills: ['Electrician', 'AC Repair', 'Wiring']
};

// --- 2. SUB-COMPONENTS ---

// A. CHAT COMPONENT
const ChatWindow = ({ customerName, onClose }) => {
  const [messages, setMessages] = useState([
    { sender: 'customer', text: 'Hello, I am waiting.' },
  ]);
  const [input, setInput] = useState('');

  const sendMsg = () => {
    if (!input.trim()) return;
    setMessages([...messages, { sender: 'me', text: input }]);
    setInput('');
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
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-3 rounded-xl text-sm ${m.sender === 'me' ? 'bg-blue-600 text-white rounded-br-none' : 'bg-white text-gray-800 rounded-bl-none shadow'}`}>
              {m.text}
            </div>
          </div>
        ))}
      </div>
      <div className="p-3 bg-white border-t flex gap-2">
        <input 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type..."
          className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:outline-none"
        />
        <button onClick={sendMsg} className="bg-blue-600 text-white p-3 rounded-full">➤</button>
      </div>
    </div>
  );
};

// B. JOB FEED (New Requests)
const JobFeed = ({ jobs, onAccept }) => (
  <div className="p-4 pb-20">
    <h2 className="text-xl font-bold mb-4 text-gray-800">New Requests ({jobs.length})</h2>
    {jobs.length === 0 ? <p className="text-gray-400 text-center mt-10">No new jobs nearby.</p> : 
      jobs.map(job => (
        <div key={job.id} className="bg-white rounded-xl shadow-sm border border-gray-100 mb-4 overflow-hidden">
          <div className="relative h-32">
            <img src={job.image} alt="Service" className="w-full h-full object-cover" />
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
               <h3 className="font-bold text-gray-800">{job.title}</h3>
               <span className="text-green-600 font-bold">₹{job.price}</span>
            </div>
            <p className="text-xs text-gray-500 line-clamp-2 mb-3">{job.desc}</p>
            
            <div className="flex justify-between items-center border-t pt-3">
              <span className="text-xs text-gray-500">📍 {job.distance} • {job.time}</span>
              <button 
                onClick={() => onAccept(job)}
                className="bg-gray-900 text-white px-6 py-2 rounded-lg text-xs font-bold shadow hover:bg-gray-700 transition-all">
                ACCEPT JOB
              </button>
            </div>
          </div>
        </div>
      ))
    }
  </div>
);

// C. MY JOBS LIST (Accepted but not completed)
const MyJobsScreen = ({ acceptedJobs, onSelectJob }) => (
  <div className="p-4 pb-20">
    <h2 className="text-xl font-bold mb-4 text-gray-800">My Tasks ({acceptedJobs.length})</h2>
    {acceptedJobs.length === 0 ? (
      <div className="text-center py-20 text-gray-400">
        <p className="text-4xl mb-2">📋</p>
        <p>You haven't accepted any jobs yet.</p>
        <p className="text-sm">Go to "Feed" to find work.</p>
      </div>
    ) : (
      acceptedJobs.map(job => (
        <div 
          key={job.id} 
          onClick={() => onSelectJob(job)}
          className="bg-white p-4 rounded-xl shadow mb-3 border-l-4 border-blue-500 cursor-pointer hover:bg-blue-50 transition-colors">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-bold">{job.customer}</h3>
            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded font-bold">{job.status}</span>
          </div>
          <p className="text-sm text-gray-600">{job.title}</p>
          <p className="text-xs text-gray-400 mt-1">{job.address}</p>
          <div className="mt-3 text-right text-blue-600 text-sm font-bold">
            Tap to Open &rarr;
          </div>
        </div>
      ))
    )}
  </div>
);

// D. EARNINGS SCREEN
const EarningsScreen = () => (
  <div className="p-4 pb-20">
    <h2 className="text-2xl font-bold mb-6">💰 Earnings</h2>
    
    {/* Balance Card */}
    <div className="bg-gradient-to-r from-green-500 to-emerald-700 text-white p-6 rounded-2xl shadow-lg mb-8">
      <p className="text-green-100 text-sm font-medium">This Week Balance</p>
      <h1 className="text-4xl font-bold mt-1">₹5,950</h1>
      <p className="text-xs mt-2 bg-white/20 inline-block px-2 py-1 rounded">+ ₹1,200 today</p>
    </div>

    {/* Chart Visualization */}
    <h3 className="font-bold text-gray-700 mb-4">Weekly Overview</h3>
    <div className="flex items-end justify-between h-32 gap-2 mb-8 px-2">
      {MOCK_EARNINGS.map((data) => (
        <div key={data.id} className="flex flex-col items-center w-full">
           <div 
             className="w-full bg-green-200 rounded-t-md hover:bg-green-400 transition-all relative group"
             style={{ height: `${(data.amount / 2500) * 100}%` }}>
             <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white text-[10px] px-1 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                ₹{data.amount}
             </div>
           </div>
           <p className="text-xs text-gray-500 mt-2">{data.day}</p>
        </div>
      ))}
    </div>

    {/* Transaction List */}
    <h3 className="font-bold text-gray-700 mb-3">Recent Transactions</h3>
    <div className="space-y-3">
       <div className="flex justify-between items-center bg-white p-3 rounded-lg shadow-sm">
          <div>
            <p className="font-bold text-sm">Fan Repair - Amit</p>
            <p className="text-xs text-gray-400">Today, 2:30 PM</p>
          </div>
          <span className="text-green-600 font-bold">+ ₹350</span>
       </div>
       <div className="flex justify-between items-center bg-white p-3 rounded-lg shadow-sm">
          <div>
            <p className="font-bold text-sm">Withdrawal</p>
            <p className="text-xs text-gray-400">Yesterday</p>
          </div>
          <span className="text-red-500 font-bold">- ₹2000</span>
       </div>
    </div>
  </div>
);

// E. PROFILE SCREEN
const ProfileScreen = () => (
  <div className="p-4 pb-20">
    <div className="bg-white p-6 rounded-2xl shadow-sm text-center mb-6">
      <div className="w-24 h-24 bg-gray-300 rounded-full mx-auto mb-4 border-4 border-blue-50"></div>
      <h2 className="text-2xl font-bold text-gray-800">{WORKER_PROFILE.name}</h2>
      <p className="text-gray-500">{WORKER_PROFILE.role}</p>
      
      <div className="flex justify-center gap-6 mt-6 border-t pt-4">
        <div>
          <p className="text-xl font-bold text-gray-900">{WORKER_PROFILE.rating} ⭐</p>
          <p className="text-xs text-gray-400">Rating</p>
        </div>
        <div>
          <p className="text-xl font-bold text-gray-900">{WORKER_PROFILE.jobsDone}</p>
          <p className="text-xs text-gray-400">Jobs</p>
        </div>
        <div>
          <p className="text-xl font-bold text-gray-900">2 yr</p>
          <p className="text-xs text-gray-400">Exp</p>
        </div>
      </div>
    </div>

    <h3 className="font-bold text-lg mb-3">Skills</h3>
    <div className="flex gap-2 flex-wrap mb-6">
      {WORKER_PROFILE.skills.map(skill => (
        <span key={skill} className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm">
          {skill}
        </span>
      ))}
      <span className="border border-gray-300 text-gray-400 px-3 py-1 rounded-full text-sm">+ Add</span>
    </div>

    <button className="w-full bg-red-50 text-red-600 py-3 rounded-xl font-bold">Log Out</button>
  </div>
);

// F. ACTIVE JOB EXECUTION SCREEN (The Actual Work Mode)
const ActiveJobExecution = ({ job, onBack, onUpdateStatus, openChat }) => {
  return (
    <div className="h-full bg-white flex flex-col">
      {/* Top Nav for Active Job */}
      <div className="p-4 flex items-center gap-4 border-b">
        <button onClick={onBack} className="text-2xl">←</button>
        <div>
           <h2 className="font-bold">Job #{job.id}</h2>
           <p className="text-xs text-gray-500">{job.status}</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 pb-24">
         <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-1">{job.title}</h1>
            <p className="text-gray-600">{job.desc}</p>
         </div>

         {/* Steps Visualizer */}
         <div className="flex justify-between text-xs font-bold text-gray-400 mb-8 px-2">
            <span className={job.status !== 'Accepted' ? 'text-green-600' : 'text-blue-600'}>Accepted</span>
            <span className={['Arrived','Work Started','Completed'].includes(job.status) ? 'text-green-600' : ''}>Arrived</span>
            <span className={['Work Started','Completed'].includes(job.status) ? 'text-green-600' : ''}>Working</span>
            <span>Done</span>
         </div>

         {/* Customer Card */}
         <div className="bg-gray-50 p-4 rounded-xl border mb-6">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-bold text-lg">{job.customer}</h3>
              <div className="flex gap-2">
                <a href={`tel:1234567890`} className="bg-white p-2 rounded-full shadow text-green-600">📞</a>
                <button onClick={openChat} className="bg-white p-2 rounded-full shadow text-blue-600">💬</button>
              </div>
            </div>
            <p className="text-sm text-gray-500 mb-3">{job.address}</p>
            <button 
              onClick={() => window.open(`https://maps.google.com/?q=${job.address}`)}
              className="w-full bg-blue-100 text-blue-700 py-2 rounded font-bold text-sm">
              📍 Navigate to Location
            </button>
         </div>

         {/* Job Photo */}
         <h4 className="font-bold mb-2">Issue Photo</h4>
         <div className="rounded-xl overflow-hidden mb-6 h-48 bg-gray-200">
            <img src={job.image} alt="Issue" className="w-full h-full object-cover" />
         </div>
      </div>

      {/* Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t max-w-md mx-auto">
         {job.status === 'Accepted' && (
           <button onClick={() => onUpdateStatus(job.id, 'Arrived')} className="w-full bg-orange-500 text-white py-3 rounded-xl font-bold text-lg shadow-lg">
             I Have Arrived 🏠
           </button>
         )}
         {job.status === 'Arrived' && (
           <button onClick={() => onUpdateStatus(job.id, 'Work Started')} className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold text-lg shadow-lg">
             Start Work 🛠️
           </button>
         )}
         {job.status === 'Work Started' && (
           <button onClick={() => onUpdateStatus(job.id, 'Completed')} className="w-full bg-green-600 text-white py-3 rounded-xl font-bold text-lg shadow-lg">
             Mark Completed (Collect ₹{job.price}) ✅
           </button>
         )}
      </div>
    </div>
  );
};


// --- 3. MAIN CONTROLLER ---

export default function WorkerNavigator() {
  const [activeTab, setActiveTab] = useState('feed'); // feed, myjobs, earnings, profile
  const [isOnline, setIsOnline] = useState(true);
  
  // Data State
  const [availableJobs, setAvailableJobs] = useState(MOCK_AVAILABLE_JOBS);
  const [acceptedJobs, setAcceptedJobs] = useState([]);
  
  // UI State
  const [activeJobId, setActiveJobId] = useState(null); // ID of job currently being worked on
  const [showChat, setShowChat] = useState(false);

  // 1. Accept a Job (Moves from Feed -> My Jobs)
  const handleAcceptJob = (job) => {
    setAvailableJobs(prev => prev.filter(j => j.id !== job.id));
    setAcceptedJobs(prev => [...prev, { ...job, status: 'Accepted' }]);
    // Optional: Auto switch to My Jobs tab
    // setActiveTab('myjobs');
  };

  // 2. Open Specific Job to Work On
  const handleOpenJob = (job) => {
    setActiveJobId(job.id);
  };

  // 3. Update Status inside Job
  const handleJobStatusUpdate = (id, newStatus) => {
    if (newStatus === 'Completed') {
      const confirm = window.confirm("Finish job and collect cash?");
      if (!confirm) return;

      // Logic: Remove from Accepted, Add to history (backend), Close view
      setAcceptedJobs(prev => prev.filter(j => j.id !== id));
      setActiveJobId(null);
      alert("Job Done! Amount added to wallet.");
    } else {
      // Update status in local state
      setAcceptedJobs(prev => prev.map(j => j.id === id ? { ...j, status: newStatus } : j));
    }
  };

  // Helper to get active job object
  const activeJobData = acceptedJobs.find(j => j.id === activeJobId);

  // If we are currently INSIDE a job view, show that screen exclusively
  if (activeJobId && activeJobData) {
    return (
      <div className="max-w-md mx-auto h-screen relative bg-white shadow-2xl">
        <ActiveJobExecution 
          job={activeJobData} 
          onBack={() => setActiveJobId(null)}
          onUpdateStatus={handleJobStatusUpdate}
          openChat={() => setShowChat(true)}
        />
        {showChat && <ChatWindow customerName={activeJobData.customer} onClose={() => setShowChat(false)} />}
      </div>
    );
  }

  // Otherwise, show the Main Tab Navigation
  return (
    <div className="h-screen bg-gray-50 flex flex-col font-sans max-w-md mx-auto border-x shadow-2xl relative">
      
      {/* HEADER */}
      <header className="bg-white p-4 shadow-sm z-10 sticky top-0">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold text-gray-900">🛠️ ProWorker</h1>
            <p className="text-xs text-gray-500">Welcome, Rajesh</p>
          </div>
          <div onClick={() => setIsOnline(!isOnline)} className={`flex items-center gap-2 cursor-pointer px-3 py-1 rounded-full border ${isOnline ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-gray-50'}`}>
            <div className={`w-3 h-3 rounded-full ${isOnline ? 'bg-green-500' : 'bg-gray-400'}`}></div>
            <span className={`text-xs font-bold ${isOnline ? 'text-green-700' : 'text-gray-500'}`}>
              {isOnline ? 'Online' : 'Offline'}
            </span>
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
            {activeTab === 'feed' && <JobFeed jobs={availableJobs} onAccept={handleAcceptJob} />}
            {activeTab === 'myjobs' && <MyJobsScreen acceptedJobs={acceptedJobs} onSelectJob={handleOpenJob} />}
            {activeTab === 'earnings' && <EarningsScreen />}
            {activeTab === 'profile' && <ProfileScreen />}
          </>
        )}
      </main>

      {/* BOTTOM NAVIGATION */}
      <nav className="bg-white border-t border-gray-200 flex justify-around p-3 pb-6 fixed bottom-0 w-full max-w-md">
        <button onClick={() => setActiveTab('feed')} className={`flex flex-col items-center ${activeTab === 'feed' ? 'text-blue-600' : 'text-gray-400'}`}>
          <span className="text-xl">🔍</span>
          <span className="text-[10px] font-bold mt-1">FEED</span>
        </button>
        <button onClick={() => setActiveTab('myjobs')} className={`flex flex-col items-center relative ${activeTab === 'myjobs' ? 'text-blue-600' : 'text-gray-400'}`}>
          <span className="text-xl">📋</span>
          <span className="text-[10px] font-bold mt-1">MY JOBS</span>
          {acceptedJobs.length > 0 && <span className="absolute -top-1 right-2 bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">{acceptedJobs.length}</span>}
        </button>
        <button onClick={() => setActiveTab('earnings')} className={`flex flex-col items-center ${activeTab === 'earnings' ? 'text-blue-600' : 'text-gray-400'}`}>
          <span className="text-xl">📊</span>
          <span className="text-[10px] font-bold mt-1">MONEY</span>
        </button>
        <button onClick={() => setActiveTab('profile')} className={`flex flex-col items-center ${activeTab === 'profile' ? 'text-blue-600' : 'text-gray-400'}`}>
          <span className="text-xl">👤</span>
          <span className="text-[10px] font-bold mt-1">PROFILE</span>
        </button>
      </nav>

    </div>
  );
}