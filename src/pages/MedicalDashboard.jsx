import { useMemo, useState, useEffect } from 'react';
import { CheckCircle, XCircle, AlertCircle, Clock, Download, Zap, MessageCircle, IndianRupee } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const MedicalDashboard = () => {
  const [activeTab, setActiveTab] = useState('pending');
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [verificationModal, setVerificationModal] = useState(false);
  const [zoomImage, setZoomImage] = useState('');
  const [quoteForm, setQuoteForm] = useState({ finalPrice: '', shopMessage: '' });
  const [verificationData, setVerificationData] = useState({
    status: 'approved',
    rejectionReason: ''
  });

  useEffect(() => {
    fetchPrescriptions();
  }, []);

  const fetchPrescriptions = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/medical/shop/prescriptions/assigned`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }
      );
      setPrescriptions(response.data.data || []);
    } catch (error) {
      toast.error('Failed to fetch prescriptions');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    if (!selectedPrescription) return;
    try {
      setLoading(true);
      await axios.patch(
        `${import.meta.env.VITE_API_URL}/api/medical/prescriptions/${selectedPrescription._id}/verify`,
        verificationData,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }
      );

      toast.success(`Prescription ${verificationData.status}`);
      setVerificationModal(false);
      setSelectedPrescription(null);
      fetchPrescriptions();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to verify prescription');
    } finally {
      setLoading(false);
    }
  };

  const handleSendQuote = async () => {
    if (!selectedPrescription) return;
    const parsedPrice = Number(quoteForm.finalPrice);
    if (Number.isNaN(parsedPrice) || parsedPrice <= 0) {
      toast.error('Please enter a valid final price');
      return;
    }

    try {
      setLoading(true);
      await axios.patch(
        `${import.meta.env.VITE_API_URL}/api/medical/prescriptions/${selectedPrescription._id}/quote`,
        {
          finalPrice: parsedPrice,
          shopMessage: quoteForm.shopMessage
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }
      );
      toast.success('Price quote sent to customer');
      setQuoteForm({ finalPrice: '', shopMessage: '' });
      setVerificationModal(false);
      setSelectedPrescription(null);
      fetchPrescriptions();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send quote');
    } finally {
      setLoading(false);
    }
  };

  const filteredPrescriptions = prescriptions.filter((p) => {
    if (activeTab === 'urgent') return p.priority === 'urgent' && ['sent_to_shops', 'quoted', 'approved'].includes(p.status);
    if (activeTab === 'pending') return p.status === 'sent_to_shops';
    if (activeTab === 'quoted') return p.status === 'quoted';
    if (activeTab === 'approved') return p.status === 'approved';
    if (activeTab === 'rejected') return p.status === 'rejected';
    return true;
  });

  const stats = useMemo(() => ({
    pending: prescriptions.filter((p) => p.status === 'sent_to_shops').length,
    quoted: prescriptions.filter((p) => p.status === 'quoted').length,
    approved: prescriptions.filter((p) => p.status === 'approved').length,
    rejected: prescriptions.filter((p) => p.status === 'rejected').length,
    urgent: prescriptions.filter((p) => p.priority === 'urgent' && ['sent_to_shops', 'quoted', 'approved'].includes(p.status)).length
  }), [prescriptions]);

  const tabs = [
    { id: 'pending', label: 'Pending', count: stats.pending },
    { id: 'quoted', label: 'Quoted', count: stats.quoted },
    { id: 'approved', label: 'Approved', count: stats.approved },
    { id: 'urgent', label: 'Urgent', count: stats.urgent },
    { id: 'rejected', label: 'Rejected', count: stats.rejected }
  ];

  return (
    <div className="min-h-screen bg-slate-50 rounded-2xl overflow-hidden border border-slate-200">
      <div className="bg-white sticky top-0 z-10 py-4 px-4 border-b">
        <h1 className="text-2xl font-bold text-gray-900">Medical Dashboard</h1>
        <p className="text-gray-600 text-sm mt-1">Review prescriptions, quote final price, and process urgent medicine flow</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 p-4 max-w-5xl mx-auto">
        <StatCard label="Pending" value={stats.pending} color="yellow" />
        <StatCard label="Quoted" value={stats.quoted} color="blue" />
        <StatCard label="Approved" value={stats.approved} color="green" />
        <StatCard label="Urgent" value={stats.urgent} color="orange" />
        <StatCard label="Rejected" value={stats.rejected} color="red" />
      </div>

      <div className="bg-white border-b sticky z-9">
        <div className="flex max-w-5xl mx-auto overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-4 px-4 min-w-32 font-semibold text-center border-b-2 transition relative ${
                activeTab === tab.id
                  ? 'text-blue-600 border-blue-600'
                  : 'text-gray-600 border-transparent'
              }`}
            >
              {tab.label}
              {tab.count > 0 && (
                <span className="absolute top-2 right-2 bg-slate-800 text-white text-xs px-2 py-1 rounded-full">
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-5xl mx-auto p-4 space-y-4">
        {loading && (
          <div className="text-center py-8">
            <div className="inline-block animate-spin text-3xl">⏳</div>
            <p className="text-gray-600 mt-2">Loading prescriptions...</p>
          </div>
        )}

        {!loading && filteredPrescriptions.length === 0 ? (
          <div className="bg-white rounded-lg p-8 text-center">
            <AlertCircle className="mx-auto text-gray-400 mb-4" size={40} />
            <p className="text-gray-600 font-semibold">No prescriptions</p>
            <p className="text-gray-500 text-sm">No records found for this filter.</p>
          </div>
        ) : (
          filteredPrescriptions.map((prescription) => (
            <PrescriptionCard
              key={prescription._id}
              prescription={prescription}
              onZoom={(url) => setZoomImage(url)}
              onAction={() => {
                setSelectedPrescription(prescription);
                setQuoteForm({
                  finalPrice: prescription.finalPrice ? String(prescription.finalPrice) : '',
                  shopMessage: prescription.shopMessage || ''
                });
                setVerificationModal(true);
              }}
              onDownload={() => {
                window.open(prescription.fileUrl, '_blank');
              }}
            />
          ))
        )}
      </div>

      {verificationModal && selectedPrescription && (
        <VerificationModal
          prescription={selectedPrescription}
          onClose={() => {
            setVerificationModal(false);
            setSelectedPrescription(null);
          }}
          onApprove={() => {
            setVerificationData({ status: 'approved', rejectionReason: '' });
            handleVerify();
          }}
          onReject={() => {
            setVerificationData({ status: 'rejected', rejectionReason: '' });
            setVerificationModal(false);
            setVerificationModal('reject');
          }}
          quoteForm={quoteForm}
          onQuoteFormChange={setQuoteForm}
          onSendQuote={handleSendQuote}
          loading={loading}
        />
      )}

      {verificationModal === 'reject' && selectedPrescription && (
        <RejectionModal
          onClose={() => {
            setVerificationModal(false);
            setSelectedPrescription(null);
          }}
          onSubmit={(reason) => {
            setVerificationData({ status: 'rejected', rejectionReason: reason });
            handleVerify();
          }}
          loading={loading}
        />
      )}

      {zoomImage && (
        <div className="fixed inset-0 bg-black/75 z-50 flex items-center justify-center p-4" onClick={() => setZoomImage('')}>
          <img src={zoomImage} alt="Prescription enlarged" className="max-h-[90vh] max-w-[90vw] rounded-xl shadow-2xl" />
        </div>
      )}
    </div>
  );
};

const StatCard = ({ label, value, color }) => {
  const colors = {
    yellow: 'bg-yellow-50 border-yellow-200 text-yellow-700',
    blue: 'bg-blue-50 border-blue-200 text-blue-700',
    green: 'bg-green-50 border-green-200 text-green-700',
    orange: 'bg-orange-50 border-orange-200 text-orange-700',
    red: 'bg-red-50 border-red-200 text-red-700'
  };

  return (
    <div className={`rounded-lg border-2 p-4 text-center ${colors[color]}`}>
      <div className="text-3xl font-bold">{value}</div>
      <p className="text-sm font-semibold mt-1">{label}</p>
    </div>
  );
};

const PrescriptionCard = ({ prescription, onAction, onDownload, onZoom }) => {
  const getStatusBadge = (status) => {
    const badges = {
      sent_to_shops: { icon: Clock, color: 'bg-yellow-100 text-yellow-800', label: 'Pending Review' },
      quoted: { icon: IndianRupee, color: 'bg-blue-100 text-blue-800', label: 'Price Quoted' },
      approved: { icon: CheckCircle, color: 'bg-green-100 text-green-800', label: 'Approved' },
      rejected: { icon: XCircle, color: 'bg-red-100 text-red-800', label: 'Rejected' }
    };
    return badges[status] || badges.sent_to_shops;
  };

  const badge = getStatusBadge(prescription.status);
  const BadgeIcon = badge.icon;

  return (
    <div className="bg-white rounded-lg p-4 border border-gray-200 hover:shadow-lg transition space-y-3">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="font-bold text-gray-900">{prescription.userId?.name || 'Anonymous'}</h3>
          <p className="text-sm text-gray-600">{prescription.userId?.phone}</p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold ${badge.color}`}>
            <BadgeIcon size={16} />
            {badge.label}
          </div>
          {prescription.priority === 'urgent' && (
            <span className="inline-flex items-center gap-1 bg-rose-100 text-rose-700 text-xs font-bold px-2 py-1 rounded-full">
              <Zap size={12} /> Urgent
            </span>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <div className="text-sm text-gray-700">
          <span className="font-semibold">Uploaded:</span> {new Date(prescription.createdAt).toLocaleDateString('en-IN')}
        </div>
        <div className="text-sm text-gray-700">
          <span className="font-semibold">User Intent:</span> {prescription.orderIntent === 'confirm_order' ? 'Direct Order Confirmation' : 'Check Price First'}
        </div>
        {prescription.finalPrice ? (
          <div className="text-sm text-emerald-700 font-semibold">Final Quoted Price: Rs {Math.round(prescription.finalPrice)}</div>
        ) : null}
        {prescription.shopMessage ? (
          <div className="bg-sky-50 rounded p-3 text-sm text-sky-900">
            <span className="font-semibold">Shop Message:</span> {prescription.shopMessage}
          </div>
        ) : null}
        {prescription.notes && (
          <div className="bg-gray-50 rounded p-3">
            <p className="text-xs text-gray-600 font-semibold mb-1">Patient Notes:</p>
            <p className="text-sm text-gray-700">{prescription.notes}</p>
          </div>
        )}
      </div>

      {prescription.requestedMedicines?.length > 0 && (
        <div>
          <p className="text-sm font-semibold text-gray-900 mb-2">Requested Medicines:</p>
          <div className="space-y-1">
            {prescription.requestedMedicines.map((medicine, idx) => (
              <div key={idx} className="text-sm text-gray-700">
                • {medicine.productId?.name || 'Unknown'} x {medicine.quantity}
                {medicine.notes ? ` (${medicine.notes})` : ''}
              </div>
            ))}
          </div>
        </div>
      )}

      {prescription.fileUrl?.startsWith('data:image') && (
        <button onClick={() => onZoom(prescription.fileUrl)} className="block rounded-lg overflow-hidden border border-slate-200">
          <img src={prescription.fileUrl} alt="Prescription thumbnail" className="h-44 w-full object-cover" />
        </button>
      )}

      <div className="flex gap-3">
        <button
          onClick={onDownload}
          className="flex-1 flex items-center justify-center gap-2 bg-blue-50 text-blue-600 py-2 rounded-lg font-semibold hover:bg-blue-100 transition"
        >
          <Download size={18} />
          View File
        </button>
        {['sent_to_shops', 'quoted'].includes(prescription.status) && (
          <button
            onClick={onAction}
            className="flex-1 bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700 transition"
          >
            Review / Quote
          </button>
        )}
      </div>
    </div>
  );
};

const VerificationModal = ({ prescription, onClose, onApprove, onReject, loading, quoteForm, onQuoteFormChange, onSendQuote }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end z-50">
      <div className="bg-white w-full rounded-t-2xl p-6 space-y-4 max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-900">Review Prescription</h2>

        <div className="bg-gray-50 p-4 rounded-lg text-sm space-y-1">
          <p><span className="font-semibold">Patient:</span> {prescription.userId?.name}</p>
          <p><span className="font-semibold">Uploaded:</span> {new Date(prescription.createdAt).toLocaleDateString('en-IN')}</p>
          <p><span className="font-semibold">Priority:</span> {prescription.priority === 'urgent' ? 'Urgent' : 'Normal'}</p>
          <p><span className="font-semibold">Intent:</span> {prescription.orderIntent === 'confirm_order' ? 'Direct order' : 'Check price then confirm'}</p>
          {prescription.notes ? <p><span className="font-semibold">Notes:</span> {prescription.notes}</p> : null}
        </div>

        <div className="border border-sky-200 bg-sky-50 rounded-lg p-4 space-y-3">
          <p className="font-semibold text-sky-900 flex items-center gap-2"><MessageCircle size={16} /> Send Price Quote / Stock Message</p>
          <div className="grid md:grid-cols-2 gap-3">
            <input
              type="number"
              min="1"
              placeholder="Final medicine price"
              value={quoteForm.finalPrice}
              onChange={(e) => onQuoteFormChange((prev) => ({ ...prev, finalPrice: e.target.value }))}
              className="border border-sky-300 rounded-lg px-3 py-2"
            />
            <input
              placeholder="Example: Some medicines not available"
              value={quoteForm.shopMessage}
              onChange={(e) => onQuoteFormChange((prev) => ({ ...prev, shopMessage: e.target.value }))}
              className="border border-sky-300 rounded-lg px-3 py-2"
            />
          </div>
          <button
            onClick={onSendQuote}
            disabled={loading}
            className="w-full md:w-auto bg-sky-700 text-white px-4 py-2 rounded-lg font-semibold disabled:opacity-60"
          >
            Send Quote to User
          </button>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 transition"
            disabled={loading}
          >
            Close
          </button>
          <button
            onClick={onReject}
            className="flex-1 border border-red-300 text-red-600 py-3 rounded-lg font-semibold hover:bg-red-50 transition"
            disabled={loading}
          >
            Reject
          </button>
          <button
            onClick={onApprove}
            className="flex-1 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition"
            disabled={loading}
          >
            {loading ? 'Processing...' : 'Approve'}
          </button>
        </div>
      </div>
    </div>
  );
};

const RejectionModal = ({ onClose, onSubmit, loading }) => {
  const [reason, setReason] = useState('');

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end z-50">
      <div className="bg-white w-full rounded-t-2xl p-6 space-y-4 max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-900">Reject Prescription</h2>

        <div className="space-y-3">
          <label className="block font-semibold text-gray-900">Reason for Rejection:</label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Tell the patient why this prescription cannot be fulfilled..."
            className="w-full p-3 border rounded-lg focus:outline-none focus:border-blue-500"
            rows="4"
            disabled={loading}
          />
          <p className="text-xs text-gray-600">The patient will receive this message</p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 transition"
            disabled={loading}
          >
            Back
          </button>
          <button
            onClick={() => onSubmit(reason)}
            className="flex-1 bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition disabled:bg-gray-400"
            disabled={!reason.trim() || loading}
          >
            {loading ? 'Processing...' : 'Confirm Rejection'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MedicalDashboard;
