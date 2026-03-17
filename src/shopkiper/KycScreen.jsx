import { useMemo, useState } from 'react';

const DOC_TYPES = [
  { value: 'aadhaar', label: 'Aadhaar' },
  { value: 'pan', label: 'PAN Card' },
  { value: 'shop_license', label: 'Shop License' },
  { value: 'other', label: 'Other' }
];

export function KycScreen({ kycStatus, onSubmitKyc, submitting }) {
  const [form, setForm] = useState({
    businessName: '',
    ownerName: '',
    gstNumber: '',
    documentType: 'aadhaar',
    documentNumber: '',
    documentImagesText: ''
  });

  const statusTone = useMemo(() => {
    if (kycStatus === 'verified') return 'bg-emerald-100 text-emerald-700 border-emerald-300';
    if (kycStatus === 'pending') return 'bg-amber-100 text-amber-700 border-amber-300';
    if (kycStatus === 'rejected') return 'bg-rose-100 text-rose-700 border-rose-300';
    return 'bg-slate-100 text-slate-700 border-slate-300';
  }, [kycStatus]);

  const submit = async () => {
    const images = form.documentImagesText
      .split(',')
      .map((img) => img.trim())
      .filter(Boolean);

    await onSubmitKyc({
      businessName: form.businessName,
      ownerName: form.ownerName,
      gstNumber: form.gstNumber,
      documentType: form.documentType,
      documentNumber: form.documentNumber,
      documentImages: images
    });
  };

  return (
    <div className="space-y-4">
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900 mb-2">Business KYC Verification</h2>
        <p className="text-sm text-slate-600 mb-3">Complete KYC to unlock product add/edit, shop updates, and delivery workflow controls.</p>
        <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold border ${statusTone}`}>
          Current status: {kycStatus || 'not_submitted'}
        </span>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-3">
        <h3 className="font-semibold text-slate-900">Submit / Update KYC</h3>
        <div className="grid md:grid-cols-2 gap-3">
          <input
            className="border border-slate-300 rounded px-3 py-2"
            placeholder="Business name"
            value={form.businessName}
            onChange={(e) => setForm({ ...form, businessName: e.target.value })}
          />
          <input
            className="border border-slate-300 rounded px-3 py-2"
            placeholder="Owner name"
            value={form.ownerName}
            onChange={(e) => setForm({ ...form, ownerName: e.target.value })}
          />
          <input
            className="border border-slate-300 rounded px-3 py-2"
            placeholder="GST number (optional)"
            value={form.gstNumber}
            onChange={(e) => setForm({ ...form, gstNumber: e.target.value })}
          />
          <select
            className="border border-slate-300 rounded px-3 py-2"
            value={form.documentType}
            onChange={(e) => setForm({ ...form, documentType: e.target.value })}
          >
            {DOC_TYPES.map((row) => (
              <option key={row.value} value={row.value}>{row.label}</option>
            ))}
          </select>
          <input
            className="border border-slate-300 rounded px-3 py-2 md:col-span-2"
            placeholder="Document number"
            value={form.documentNumber}
            onChange={(e) => setForm({ ...form, documentNumber: e.target.value })}
          />
          <textarea
            className="border border-slate-300 rounded px-3 py-2 md:col-span-2"
            rows={3}
            placeholder="Document image URLs (comma separated)"
            value={form.documentImagesText}
            onChange={(e) => setForm({ ...form, documentImagesText: e.target.value })}
          />
        </div>
        <button
          onClick={submit}
          disabled={submitting}
          className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded font-semibold disabled:opacity-60"
        >
          {submitting ? 'Submitting...' : 'Submit KYC'}
        </button>
      </div>
    </div>
  );
}
