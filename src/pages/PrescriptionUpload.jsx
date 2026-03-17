import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, RefreshCw, CheckCircle, AlertCircle, Clock, X, Zap, IndianRupee } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const PrescriptionUpload = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [notes, setNotes] = useState('');
  const [priority, setPriority] = useState('normal');
  const [orderIntent, setOrderIntent] = useState('checking_price');
  const [loading, setLoading] = useState(false);
  const [prescriptions, setPrescriptions] = useState([]);
  const [activeTab, setActiveTab] = useState('upload');

  const authHeader = {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;
    if (selectedFile.size > 10 * 1024 * 1024) {
      toast.error('File size must be less than 10MB');
      return;
    }
    if (!['image/jpeg', 'image/png', 'application/pdf'].includes(selectedFile.type)) {
      toast.error('Only JPEG, PNG, and PDF files are allowed');
      return;
    }
    setFile(selectedFile);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      toast.error('Please select a file');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('notes', notes);
    formData.append('priority', priority);
    formData.append('orderIntent', orderIntent);

    try {
      setLoading(true);
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/medical/prescriptions`,
        formData,
        {
          headers: authHeader.headers
        }
      );

      toast.success('Prescription uploaded and sent to nearby medical shops');
      setFile(null);
      setNotes('');
      setPriority('normal');
      setOrderIntent('checking_price');
      setActiveTab('my-prescriptions');
      fetchMyPrescriptions();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to upload prescription');
    } finally {
      setLoading(false);
    }
  };

  const fetchMyPrescriptions = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/medical/prescriptions/my`,
        authHeader
      );
      setPrescriptions(response.data.data || []);
    } catch (error) {
      console.error('Failed to fetch prescriptions', error);
    }
  };

  const handleQuoteAction = async (prescriptionId, action) => {
    try {
      setLoading(true);
      await axios.patch(
        `${import.meta.env.VITE_API_URL}/api/medical/prescriptions/${prescriptionId}/quote-action`,
        { action },
        authHeader
      );
      toast.success(action === 'accepted' ? 'Quote accepted' : 'Quote declined');
      fetchMyPrescriptions();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update quote action');
    } finally {
      setLoading(false);
    }
  };

  const handlePlaceOrder = async (prescriptionId) => {
    try {
      setLoading(true);
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/medical/prescriptions/${prescriptionId}/place-order`,
        { paymentMethod: 'cod' },
        authHeader
      );
      toast.success('Order placed successfully from prescription');
      fetchMyPrescriptions();
      navigate('/medical/myOrders');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 rounded-2xl border border-slate-200 overflow-hidden">
      <div className="bg-white sticky top-0 z-10 py-4 px-4 border-b">
        <h1 className="text-2xl font-bold text-gray-900">Medical Prescriptions</h1>
        <p className="text-gray-600 text-sm mt-1">Upload prescription, choose urgency, receive quote, then confirm</p>
      </div>

      <div className="bg-white border-b sticky z-9 top-16">
        <div className="flex max-w-2xl mx-auto">
          <button
            onClick={() => {
              setActiveTab('upload');
              setFile(null);
              setNotes('');
            }}
            className={`flex-1 py-4 px-4 font-semibold text-center border-b-2 transition ${
              activeTab === 'upload'
                ? 'text-blue-600 border-blue-600'
                : 'text-gray-600 border-transparent'
            }`}
          >
            Upload Prescription
          </button>
          <button
            onClick={() => {
              setActiveTab('my-prescriptions');
              fetchMyPrescriptions();
            }}
            className={`flex-1 py-4 px-4 font-semibold text-center border-b-2 transition ${
              activeTab === 'my-prescriptions'
                ? 'text-blue-600 border-blue-600'
                : 'text-gray-600 border-transparent'
            }`}
          >
            My Prescriptions
          </button>
        </div>
      </div>

      <div className="max-w-2xl mx-auto p-4">
        {activeTab === 'upload' ? (
          <UploadForm
            file={file}
            notes={notes}
            priority={priority}
            orderIntent={orderIntent}
            loading={loading}
            onFileChange={handleFileChange}
            onNotesChange={(e) => setNotes(e.target.value)}
            onPriorityChange={setPriority}
            onIntentChange={setOrderIntent}
            onSubmit={handleUpload}
            onClearFile={() => setFile(null)}
          />
        ) : (
          <MyPrescriptions
            prescriptions={prescriptions}
            loading={loading}
            onQuoteAction={handleQuoteAction}
            onPlaceOrder={handlePlaceOrder}
          />
        )}
      </div>
    </div>
  );
};

const UploadForm = ({ file, notes, priority, orderIntent, loading, onFileChange, onNotesChange, onPriorityChange, onIntentChange, onSubmit, onClearFile }) => {
  return (
    <form onSubmit={onSubmit} className="bg-white rounded-lg p-6 space-y-6">
      <div className="space-y-2">
        <label className="block font-semibold text-gray-900">Upload Prescription File</label>
        <label className="block border-2 border-dashed border-blue-300 rounded-lg p-8 text-center cursor-pointer hover:bg-blue-50 transition">
          <div className="flex flex-col items-center gap-2">
            <Upload size={40} className="text-blue-500" />
            <div>
              <p className="font-semibold text-gray-900">Click to upload or drag and drop</p>
              <p className="text-sm text-gray-600">JPG, PNG or PDF (Max 10MB)</p>
            </div>
          </div>
          <input
            type="file"
            onChange={onFileChange}
            accept="image/jpeg,image/png,application/pdf"
            className="hidden"
            disabled={loading}
          />
        </label>

        {file && (
          <div className="flex items-center justify-between bg-blue-50 p-4 rounded-lg border border-blue-200">
            <div className="flex-1">
              <p className="font-semibold text-sm text-gray-900">{file.name}</p>
              <p className="text-xs text-gray-600">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
            </div>
            <button type="button" onClick={onClearFile} disabled={loading} className="text-red-600 hover:text-red-700">
              <X size={20} />
            </button>
          </div>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-3">
        <div className="border rounded-lg p-3">
          <p className="font-semibold text-sm mb-2">Priority</p>
          <div className="flex gap-2">
            <button type="button" onClick={() => onPriorityChange('normal')} className={`px-3 py-2 rounded text-sm ${priority === 'normal' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}>Normal</button>
            <button type="button" onClick={() => onPriorityChange('urgent')} className={`px-3 py-2 rounded text-sm ${priority === 'urgent' ? 'bg-rose-600 text-white' : 'bg-gray-100 text-gray-700'}`}>
              <Zap size={14} className="inline mr-1" />Urgent
            </button>
          </div>
        </div>
        <div className="border rounded-lg p-3">
          <p className="font-semibold text-sm mb-2">Order Flow</p>
          <div className="flex flex-col gap-2 text-sm">
            <label className="flex items-center gap-2"><input type="radio" name="intent" checked={orderIntent === 'checking_price'} onChange={() => onIntentChange('checking_price')} /> Check price first</label>
            <label className="flex items-center gap-2"><input type="radio" name="intent" checked={orderIntent === 'confirm_order'} onChange={() => onIntentChange('confirm_order')} /> Confirm order when approved</label>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <label className="block font-semibold text-gray-900">Additional Notes (Optional)</label>
        <textarea
          value={notes}
          onChange={onNotesChange}
          placeholder="Add medicine preferences, allergy details, or alternate brand request"
          className="w-full p-3 border rounded-lg text-sm focus:outline-none focus:border-blue-500"
          rows="4"
          disabled={loading}
        />
      </div>

      <button
        type="submit"
        disabled={!file || loading}
        className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed hover:bg-blue-700 transition flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <RefreshCw size={20} className="animate-spin" />
            Uploading...
          </>
        ) : (
          <>
            <Upload size={20} />
            Upload Prescription
          </>
        )}
      </button>
    </form>
  );
};

const MyPrescriptions = ({ prescriptions, onQuoteAction, onPlaceOrder, loading }) => {
  if (prescriptions.length === 0) {
    return (
      <div className="bg-white rounded-lg p-8 text-center">
        <AlertCircle className="mx-auto text-gray-400 mb-4" size={40} />
        <p className="text-gray-600 font-semibold">No prescriptions yet</p>
        <p className="text-gray-500 text-sm">Upload your first prescription to get started</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {prescriptions.map((prescription) => {
        const StatusIcon = getStatusIcon(prescription.status);
        const statusColor = getStatusColor(prescription.status);
        const statusLabel = getStatusLabel(prescription.status);

        return (
          <div key={prescription._id} className={`rounded-lg border-2 p-4 ${statusColor}`}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <StatusIcon size={22} className="text-blue-600" />
                <div>
                  <p className="font-semibold text-gray-900">{statusLabel}</p>
                  <p className="text-xs text-gray-600">{new Date(prescription.createdAt).toLocaleString('en-IN')}</p>
                </div>
              </div>
              {prescription.priority === 'urgent' ? (
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-rose-100 text-rose-700 text-xs font-bold">
                  <Zap size={12} /> Urgent
                </span>
              ) : null}
            </div>

            <div className="space-y-2 text-sm mb-3">
              <p><span className="font-semibold">Intent:</span> {prescription.orderIntent === 'confirm_order' ? 'Direct order confirmation' : 'Check price first'}</p>
              {prescription.finalPrice ? (
                <p className="text-emerald-700 font-semibold flex items-center gap-1"><IndianRupee size={14} /> Final quoted price: Rs {Math.round(prescription.finalPrice)}</p>
              ) : null}
              {prescription.shopMessage ? <p><span className="font-semibold">Shop Message:</span> {prescription.shopMessage}</p> : null}
            </div>

            <div className="flex flex-wrap gap-2">
              {prescription.fileUrl && (
                <a href={prescription.fileUrl} target="_blank" rel="noreferrer" className="text-sm text-blue-700 font-semibold hover:underline">View Prescription</a>
              )}

              {prescription.status === 'quoted' && prescription.quoteStatus !== 'accepted' && (
                <>
                  <button onClick={() => onQuoteAction(prescription._id, 'accepted')} disabled={loading} className="px-3 py-1.5 rounded bg-green-600 text-white text-sm font-semibold">Accept Quote</button>
                  <button onClick={() => onQuoteAction(prescription._id, 'declined')} disabled={loading} className="px-3 py-1.5 rounded bg-rose-600 text-white text-sm font-semibold">Decline</button>
                </>
              )}

              {(prescription.status === 'approved' || (prescription.status === 'quoted' && prescription.quoteStatus === 'accepted')) && (
                <button
                  onClick={() => onPlaceOrder(prescription._id)}
                  disabled={loading}
                  className="px-3 py-1.5 rounded bg-blue-700 text-white text-sm font-semibold"
                >
                  Confirm & Place Order
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

const getStatusIcon = (status) => {
  const icons = {
    uploaded: Clock,
    sent_to_shops: RefreshCw,
    approved: CheckCircle,
    quoted: IndianRupee,
    rejected: AlertCircle,
    order_placed: CheckCircle
  };
  return icons[status] || AlertCircle;
};

const getStatusColor = (status) => {
  const colors = {
    uploaded: 'bg-yellow-50 border-yellow-200',
    sent_to_shops: 'bg-blue-50 border-blue-200',
    approved: 'bg-green-50 border-green-200',
    quoted: 'bg-sky-50 border-sky-200',
    rejected: 'bg-red-50 border-red-200',
    order_placed: 'bg-purple-50 border-purple-200'
  };
  return colors[status] || 'bg-gray-50 border-gray-200';
};

const getStatusLabel = (status) => {
  const labels = {
    uploaded: 'Uploaded',
    sent_to_shops: 'Sent to Medical Shops',
    approved: 'Approved',
    quoted: 'Quoted by Medical Shop',
    rejected: 'Rejected',
    order_placed: 'Order Placed'
  };
  return labels[status] || status;
};

export default PrescriptionUpload;
