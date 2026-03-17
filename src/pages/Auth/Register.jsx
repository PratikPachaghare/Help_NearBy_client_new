import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../utils/AuthContext';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '', role: 'user', authorityKey: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const keyHints = {
    worker: 'work1234',
    delivery: 'dele1234',
    shopkeeper: 'groc1234 or shop1234',
    medical: 'med1234'
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      const user = await register(form);
      if (user?.role === 'shopkeeper') navigate('/shop-dashboard');
      else if (user?.role === 'worker') navigate('/worker-dashboard');
      else if (user?.role === 'delivery') navigate('/delivery-dashboard');
      else if (user?.role === 'medical') navigate('/medical-dashboard');
      else if (user?.role === 'admin') navigate('/admin-dashboard');
      else navigate('/');
    } catch (err) {
      setError(err?.response?.data?.message || 'Register failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4 py-10">
      <form onSubmit={handleSubmit} className="bg-white p-6 md:p-8 rounded-2xl shadow-lg border border-slate-200 w-full max-w-md space-y-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Create Account</h1>
          <p className="text-sm text-slate-500 mt-1">Join HelpNearBy for trusted local services.</p>
        </div>
        <input className="w-full border border-slate-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-slate-300" placeholder="Name" value={form.name} onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))} required />
        <input className="w-full border border-slate-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-slate-300" type="email" placeholder="Email" value={form.email} onChange={(e) => setForm((s) => ({ ...s, email: e.target.value }))} required />
        <input className="w-full border border-slate-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-slate-300" placeholder="Phone" value={form.phone} onChange={(e) => setForm((s) => ({ ...s, phone: e.target.value }))} />
        <input className="w-full border border-slate-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-slate-300" type="password" placeholder="Password" value={form.password} onChange={(e) => setForm((s) => ({ ...s, password: e.target.value }))} required />
        <select className="w-full border border-slate-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-slate-300" value={form.role} onChange={(e) => setForm((s) => ({ ...s, role: e.target.value, authorityKey: '' }))}>
          <option value="user">User</option>
          <option value="worker">Worker</option>
          <option value="shopkeeper">Grocery Shopkeeper</option>
          <option value="delivery">Delivery</option>
          <option value="medical">Medical Shopkeeper</option>
        </select>
        {form.role !== 'user' && (
          <div className="space-y-1">
            <input
              className="w-full border border-slate-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-slate-300"
              placeholder="Enter authority key"
              value={form.authorityKey}
              onChange={(e) => setForm((s) => ({ ...s, authorityKey: e.target.value }))}
              required
            />
            <p className="text-xs text-slate-500">Authority key for {form.role}: <span className="font-semibold">{keyHints[form.role]}</span></p>
          </div>
        )}
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <button disabled={submitting} className="w-full bg-slate-900 text-white p-3 rounded-lg font-semibold hover:bg-slate-700 transition-colors disabled:opacity-70">
          {submitting ? 'Creating...' : 'Create Account'}
        </button>
        <p className="text-sm text-slate-600">
          Already have an account? <Link to="/login" className="text-slate-900 font-semibold hover:underline">Sign in</Link>
        </p>
      </form>
    </div>
  );
}
