import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../utils/AuthContext';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      const user = await login(form.email, form.password);
      if (user?.role === 'shopkeeper') navigate('/shop-dashboard');
      else if (user?.role === 'worker') navigate('/worker-dashboard');
      else if (user?.role === 'delivery') navigate('/delivery-dashboard');
      else if (user?.role === 'medical') navigate('/medical-dashboard');
      else if (user?.role === 'admin') navigate('/admin-dashboard');
      else navigate('/');
    } catch (err) {
      setError(err?.response?.data?.message || 'Login failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4 py-10">
      <form onSubmit={handleSubmit} className="bg-white p-6 md:p-8 rounded-2xl shadow-lg border border-slate-200 w-full max-w-md space-y-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Welcome Back</h1>
          <p className="text-sm text-slate-500 mt-1">Secure sign in to your HelpNearBy account.</p>
        </div>
        <div className="text-xs inline-flex items-center gap-2 bg-emerald-50 border border-emerald-100 text-emerald-700 px-3 py-1.5 rounded-full">
          <span className="font-semibold">Verified Platform</span>
          <span>Encrypted sessions enabled</span>
        </div>
        <input
          type="email"
          placeholder="Email"
          className="w-full border border-slate-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-slate-300"
          value={form.email}
          onChange={(e) => setForm((s) => ({ ...s, email: e.target.value }))}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full border border-slate-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-slate-300"
          value={form.password}
          onChange={(e) => setForm((s) => ({ ...s, password: e.target.value }))}
          required
        />
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <button disabled={submitting} className="w-full bg-slate-900 text-white p-3 rounded-lg font-semibold hover:bg-slate-700 transition-colors disabled:opacity-70">
          {submitting ? 'Signing in...' : 'Sign In'}
        </button>
        <p className="text-sm text-slate-600">
          New user? <Link to="/register" className="text-slate-900 font-semibold hover:underline">Create account</Link>
        </p>
      </form>
    </div>
  );
}
