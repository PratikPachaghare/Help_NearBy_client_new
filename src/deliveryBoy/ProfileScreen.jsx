import React, { useEffect, useState } from 'react';
import { apiCall } from '../utils/ApiCalls';
import { Endpoints } from '../utils/Endpiont';

const initialForm = {
   businessName: '',
   ownerName: '',
   gstNumber: '',
   documentType: 'aadhaar',
   documentNumber: ''
};

export const ProfileScreen = ({ isOnline, toggleOnline, user, onLogout }) => {
   const [showKycForm, setShowKycForm] = useState(false);
   const [kycForm, setKycForm] = useState(initialForm);
   const [kycStatus, setKycStatus] = useState('not_submitted');
   const [kycMessage, setKycMessage] = useState('');
   const [kycLoading, setKycLoading] = useState(false);

   const loadKycStatus = async () => {
      try {
         const resp = await apiCall('GET', Endpoints.User.Kyc);
         const payload = resp?.data || {};
         setKycStatus(payload.status || 'not_submitted');
         setKycForm((prev) => ({
            ...prev,
            businessName: payload.businessName || prev.businessName,
            ownerName: payload.ownerName || prev.ownerName,
            gstNumber: payload.gstNumber || prev.gstNumber,
            documentType: payload.documentType || prev.documentType,
            documentNumber: payload.documentNumber || prev.documentNumber
         }));
         if (payload.status === 'rejected' && payload.rejectionReason) {
            setKycMessage(`Rejected: ${payload.rejectionReason}`);
         }
      } catch (err) {
         setKycMessage(err?.response?.data?.message || 'Unable to load KYC status');
      }
   };

   useEffect(() => {
      loadKycStatus();
   }, []);

   const submitKyc = async (e) => {
      e.preventDefault();
      setKycMessage('');
      setKycLoading(true);
      try {
         await apiCall('PATCH', Endpoints.User.Kyc, { ...kycForm, documentImages: [] });
         setKycStatus('pending');
         setShowKycForm(false);
         setKycMessage('KYC submitted. It has been sent to admin panel for verification.');
         await loadKycStatus();
      } catch (err) {
         setKycMessage(err?.response?.data?.message || 'Failed to submit KYC');
      } finally {
         setKycLoading(false);
      }
   };

   return (
      <div className="p-4">
    {/* HEADER */}
    <div className="flex items-center gap-4 mb-6">
      <div className="h-16 w-16 bg-gray-200 rounded-full border-2 border-white shadow flex items-center justify-center text-2xl">👤</div>
      <div className="flex-1">
            <h2 className="text-2xl font-bold">{user?.name || 'Delivery Rider'}</h2>
        <div className="flex gap-2 text-sm text-gray-500">
                <span>ID: {user?.id ? `DL-${String(user.id).slice(-6).toUpperCase()}` : 'DL-XXXXXX'}</span>
           <span>•</span>
                <span className="text-yellow-600 font-bold">Role: DELIVERY</span>
        </div>
      </div>
    </div>

    {/* DUTY TOGGLE */}
    <div className={`p-4 rounded-xl shadow mb-6 flex justify-between items-center border ${isOnline ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200'}`}>
      <div>
        <p className="font-bold text-gray-800">Duty Status</p>
        <p className={`text-sm ${isOnline ? 'text-green-600' : 'text-gray-400'}`}>
          {isOnline ? 'You are receiving orders' : 'You are currently offline'}
        </p>
      </div>
      <label className="relative inline-flex items-center cursor-pointer">
        <input type="checkbox" className="sr-only peer" checked={isOnline} onChange={toggleOnline} />
            <div className="w-12 h-7 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-green-600"></div>
      </label>
    </div>

    {/* STATS GRID */}
    <div className="grid grid-cols-3 gap-3 mb-6">
       <div className="bg-white p-3 rounded-lg shadow-sm text-center border border-gray-100">
          <p className="text-xs text-gray-400">Orders</p>
          <p className="font-bold text-xl">142</p>
       </div>
       <div className="bg-white p-3 rounded-lg shadow-sm text-center border border-gray-100">
          <p className="text-xs text-gray-400">Hours</p>
          <p className="font-bold text-xl">45h</p>
       </div>
       <div className="bg-white p-3 rounded-lg shadow-sm text-center border border-gray-100">
          <p className="text-xs text-gray-400">Reject</p>
          <p className="font-bold text-xl text-red-500">2%</p>
       </div>
    </div>

    {/* VEHICLE INFO */}
    <h3 className="font-bold text-gray-800 mb-3">Vehicle Details</h3>
    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6">
       <div className="flex justify-between py-2 border-b border-gray-50">
               <span className="text-gray-500">Email</span>
               <span className="font-medium">{user?.email || 'not available'}</span>
       </div>
       <div className="flex justify-between py-2 border-b border-gray-50">
               <span className="text-gray-500">Phone</span>
               <span className="font-medium">{user?.phone || 'not available'}</span>
       </div>
       <div className="flex justify-between py-2">
               <span className="text-gray-500">KYC Status</span>
               <span className={`font-medium ${kycStatus === 'verified' ? 'text-green-600' : kycStatus === 'rejected' ? 'text-red-600' : 'text-amber-600'}`}>
                  {kycStatus}
               </span>
       </div>
    </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6">
         <div className="flex items-center justify-between gap-3">
            <div>
               <h3 className="font-bold text-gray-800">Delivery KYC Verification</h3>
               <p className="text-xs text-gray-500 mt-1">Submit your KYC here. Admin will verify it in admin panel.</p>
            </div>
            <button
               onClick={() => setShowKycForm((prev) => !prev)}
               className="px-3 py-2 rounded-lg bg-blue-600 text-white text-sm font-semibold"
            >
               {showKycForm ? 'Close Form' : 'Open KYC Form'}
            </button>
         </div>

         {showKycForm ? (
            <form onSubmit={submitKyc} className="mt-4 space-y-3">
               <input
                  value={kycForm.businessName}
                  onChange={(e) => setKycForm((prev) => ({ ...prev, businessName: e.target.value }))}
                  placeholder="Business name"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                  required
               />
               <input
                  value={kycForm.ownerName}
                  onChange={(e) => setKycForm((prev) => ({ ...prev, ownerName: e.target.value }))}
                  placeholder="Owner name"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                  required
               />
               <div className="grid grid-cols-2 gap-2">
                  <select
                     value={kycForm.documentType}
                     onChange={(e) => setKycForm((prev) => ({ ...prev, documentType: e.target.value }))}
                     className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                  >
                     <option value="aadhaar">Aadhaar</option>
                     <option value="pan">PAN</option>
                     <option value="shop_license">Shop License</option>
                     <option value="other">Other</option>
                  </select>
                  <input
                     value={kycForm.documentNumber}
                     onChange={(e) => setKycForm((prev) => ({ ...prev, documentNumber: e.target.value }))}
                     placeholder="Document number"
                     className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                     required
                  />
               </div>
               <input
                  value={kycForm.gstNumber}
                  onChange={(e) => setKycForm((prev) => ({ ...prev, gstNumber: e.target.value }))}
                  placeholder="GST number (optional)"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
               />

               <button
                  type="submit"
                  disabled={kycLoading}
                  className="w-full bg-black text-white py-2.5 rounded-lg text-sm font-bold disabled:opacity-60"
               >
                  {kycLoading ? 'Submitting...' : 'Submit KYC For Admin Verification'}
               </button>
            </form>
         ) : null}

         {kycMessage ? <p className="text-xs mt-3 text-gray-600">{kycMessage}</p> : null}
      </div>

      <button onClick={onLogout} className="w-full bg-red-50 text-red-600 py-3 rounded-lg font-bold border border-red-100">Log Out</button>
  </div>
   );
};