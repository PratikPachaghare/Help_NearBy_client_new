import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../utils/AuthContext';
import { apiCall } from '../utils/ApiCalls';
import { Endpoints } from '../utils/Endpiont';

const tabs = [
  { id: 'overview', label: 'Overview' },
  { id: 'users', label: 'Users' },
  { id: 'kyc', label: 'KYC Requests' },
  { id: 'areas', label: 'Area Insights' },
  { id: 'map', label: 'Live Map' }
];

function MetricCard({ label, value, hint }) {
  return (
    <div className="bg-white border border-blue-100 rounded-xl p-4 shadow-sm">
      <p className="text-xs uppercase tracking-wide text-blue-500 font-semibold">{label}</p>
      <p className="text-2xl font-bold text-blue-900 mt-1">{value}</p>
      {hint ? <p className="text-xs text-slate-500 mt-1">{hint}</p> : null}
    </div>
  );
}

function StatusBadge({ active }) {
  return (
    <span
      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${
        active ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
      }`}
    >
      {active ? 'Active' : 'Blocked'}
    </span>
  );
}

function kycBadgeClass(status) {
  if (status === 'verified') return 'bg-emerald-100 text-emerald-700';
  if (status === 'pending') return 'bg-amber-100 text-amber-700';
  if (status === 'rejected') return 'bg-rose-100 text-rose-700';
  return 'bg-slate-100 text-slate-700';
}

function DotMap({ points, selectedRole }) {
  const visiblePoints = useMemo(() => {
    if (selectedRole === 'all') return points;
    return points.filter((p) => p.role === selectedRole);
  }, [points, selectedRole]);

  const bounds = useMemo(() => {
    if (!visiblePoints.length) {
      return { minLng: 0, maxLng: 1, minLat: 0, maxLat: 1 };
    }

    const lngs = visiblePoints.map((p) => p.lng);
    const lats = visiblePoints.map((p) => p.lat);

    return {
      minLng: Math.min(...lngs),
      maxLng: Math.max(...lngs),
      minLat: Math.min(...lats),
      maxLat: Math.max(...lats)
    };
  }, [visiblePoints]);

  const getColor = (role) => {
    if (role === 'shopkeeper') return '#2563eb';
    if (role === 'worker') return '#0d9488';
    if (role === 'medical') return '#7c3aed';
    if (role === 'delivery') return '#ea580c';
    return '#64748b';
  };

  const lngSpan = Math.max(bounds.maxLng - bounds.minLng, 0.001);
  const latSpan = Math.max(bounds.maxLat - bounds.minLat, 0.001);

  return (
    <div className="rounded-xl border border-blue-100 bg-linear-to-br from-blue-50 to-white p-3">
      <div className="relative h-90 rounded-lg border border-dashed border-blue-200 bg-white overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#dbeafe_1px,transparent_1px),linear-gradient(to_bottom,#dbeafe_1px,transparent_1px)] bg-size-[32px_32px] opacity-50" />
        {visiblePoints.map((point) => {
          const x = ((point.lng - bounds.minLng) / lngSpan) * 100;
          const y = 100 - ((point.lat - bounds.minLat) / latSpan) * 100;

          return (
            <div
              key={point.id}
              className="absolute"
              style={{ left: `${x}%`, top: `${y}%`, transform: 'translate(-50%, -50%)' }}
              title={`${point.name} (${point.role})`}
            >
              <div
                className="w-3 h-3 rounded-full ring-2 ring-white shadow"
                style={{ backgroundColor: getColor(point.role) }}
              />
            </div>
          );
        })}
      </div>
      <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
        <div className="bg-blue-50 text-blue-700 rounded px-2 py-1">Blue: Shopkeeper</div>
        <div className="bg-teal-50 text-teal-700 rounded px-2 py-1">Teal: Worker</div>
        <div className="bg-violet-50 text-violet-700 rounded px-2 py-1">Violet: Medical</div>
        <div className="bg-orange-50 text-orange-700 rounded px-2 py-1">Orange: Delivery</div>
      </div>
    </div>
  );
}

export default function AdminNavigatore() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [overview, setOverview] = useState(null);
  const [usersData, setUsersData] = useState({ items: [], pagination: { page: 1, totalPages: 1 } });
  const [kycRows, setKycRows] = useState([]);
  const [areaRows, setAreaRows] = useState([]);
  const [mapPoints, setMapPoints] = useState([]);

  const [userFilters, setUserFilters] = useState({ role: 'all', status: 'all', search: '', page: 1 });
  const [kycFilter, setKycFilter] = useState('pending');
  const [kycRoleFilter, setKycRoleFilter] = useState('all');
  const [mapRole, setMapRole] = useState('all');

  const loadOverview = async () => {
    const resp = await apiCall('GET', Endpoints.Admin.Overview);
    setOverview(resp?.data || null);
  };

  const loadUsers = async () => {
    const params = {
      role: userFilters.role,
      status: userFilters.status,
      search: userFilters.search,
      page: userFilters.page,
      limit: 12
    };
    const resp = await apiCall('GET', Endpoints.Admin.Users, {}, params);
    setUsersData(resp?.data || { items: [], pagination: { page: 1, totalPages: 1 } });
  };

  const loadKyc = async () => {
    const resp = await apiCall('GET', Endpoints.Admin.KycQueue || Endpoints.Admin.KycRequests, {}, {
      status: kycFilter,
      role: kycRoleFilter
    });
    setKycRows(resp?.data || []);
  };

  const loadArea = async () => {
    const resp = await apiCall('GET', Endpoints.Admin.AreaSummary);
    setAreaRows(resp?.data || []);
  };

  const loadMap = async () => {
    const resp = await apiCall('GET', Endpoints.Admin.MapEntities);
    setMapPoints(resp?.data || []);
  };

  const loadAll = async () => {
    setLoading(true);
    setError('');
    try {
      await Promise.all([loadOverview(), loadUsers(), loadKyc(), loadArea(), loadMap()]);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load admin dashboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    loadUsers().catch((err) => setError(err?.response?.data?.message || 'Failed to load users'));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userFilters.role, userFilters.status, userFilters.search, userFilters.page]);

  useEffect(() => {
    loadKyc().catch((err) => setError(err?.response?.data?.message || 'Failed to load KYC requests'));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [kycFilter, kycRoleFilter]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleToggleUserStatus = async (row) => {
    setError('');
    setSuccess('');
    try {
      await apiCall('PATCH', Endpoints.Admin.UserStatus(row._id), { isActive: !row.isActive });
      setSuccess(`User ${row.isActive ? 'blocked' : 'unblocked'} successfully`);
      await Promise.all([loadUsers(), loadOverview()]);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to update user status');
    }
  };

  const handleKycAction = async (userId, status) => {
    setError('');
    setSuccess('');

    let rejectionReason;
    if (status === 'rejected') {
      rejectionReason = window.prompt('Enter rejection reason', 'Document validation failed') || 'Rejected by admin';
    }

    try {
      await apiCall('PATCH', Endpoints.Admin.KycUpdate ? Endpoints.Admin.KycUpdate(userId) : Endpoints.Admin.KycStatus(userId), {
        status,
        rejectionReason
      });
      setSuccess(`KYC marked as ${status}`);
      await Promise.all([loadKyc(), loadUsers(), loadOverview()]);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to update KYC status');
    }
  };

  const roleCounts = overview?.roleCounts || {};
  const kycCounts = overview?.kycCounts || {};

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-blue-100 text-slate-800">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="bg-white border border-blue-100 rounded-2xl shadow-sm p-5 md:p-6 mb-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-blue-500 font-semibold">Admin Control Center</p>
              <h1 className="text-2xl md:text-3xl font-bold text-blue-900 mt-1">HelpNearBy Operations</h1>
              <p className="text-sm text-slate-500 mt-1">Logged in as {user?.email || 'admin'}</p>
            </div>
            <button
              onClick={handleLogout}
              className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-lg text-sm font-semibold"
            >
              Logout
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-[220px_1fr] gap-4">
          <aside className="bg-white border border-blue-100 rounded-2xl p-3 shadow-sm h-fit">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full text-left px-3 py-2 rounded-lg mb-2 text-sm font-semibold transition ${
                  activeTab === tab.id
                    ? 'bg-blue-700 text-white shadow'
                    : 'text-blue-900 hover:bg-blue-50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </aside>

          <section className="bg-white border border-blue-100 rounded-2xl p-4 md:p-6 shadow-sm">
            {error ? <p className="mb-3 text-sm text-rose-600 bg-rose-50 border border-rose-100 rounded-lg px-3 py-2">{error}</p> : null}
            {success ? <p className="mb-3 text-sm text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-lg px-3 py-2">{success}</p> : null}
            {loading ? <p className="text-sm text-slate-500">Loading admin data...</p> : null}

            {!loading && activeTab === 'overview' && (
              <div className="space-y-4">
                <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-3">
                  <MetricCard label="Total Users" value={overview?.users || 0} />
                  <MetricCard label="Total Orders" value={overview?.orders || 0} />
                  <MetricCard label="Service Requests" value={overview?.serviceRequests || 0} />
                  <MetricCard label="Open Disputes" value={overview?.openDisputes || 0} />
                </div>
                <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-3">
                  <MetricCard label="Shopkeepers" value={roleCounts.shopkeeper || 0} />
                  <MetricCard label="Workers" value={roleCounts.worker || 0} />
                  <MetricCard label="Delivery Boys" value={roleCounts.delivery || 0} />
                  <MetricCard label="Blocked Users" value={overview?.blockedUsers || 0} hint="Includes all blocked roles" />
                </div>
                <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-3">
                  <MetricCard label="KYC Pending" value={kycCounts.pending || 0} />
                  <MetricCard label="KYC Verified" value={kycCounts.verified || 0} />
                  <MetricCard label="KYC Rejected" value={kycCounts.rejected || 0} />
                  <MetricCard label="KYC Not Submitted" value={kycCounts.not_submitted || 0} />
                </div>
              </div>
            )}

            {!loading && activeTab === 'users' && (
              <div className="space-y-3">
                <div className="grid md:grid-cols-4 gap-2">
                  <select
                    className="border border-blue-100 rounded-lg px-3 py-2 text-sm"
                    value={userFilters.role}
                    onChange={(e) => setUserFilters((s) => ({ ...s, role: e.target.value, page: 1 }))}
                  >
                    <option value="all">All Roles</option>
                    <option value="user">User</option>
                    <option value="worker">Worker</option>
                    <option value="shopkeeper">Shopkeeper</option>
                    <option value="delivery">Delivery</option>
                    <option value="medical">Medical</option>
                    <option value="admin">Admin</option>
                  </select>
                  <select
                    className="border border-blue-100 rounded-lg px-3 py-2 text-sm"
                    value={userFilters.status}
                    onChange={(e) => setUserFilters((s) => ({ ...s, status: e.target.value, page: 1 }))}
                  >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="blocked">Blocked</option>
                  </select>
                  <input
                    className="border border-blue-100 rounded-lg px-3 py-2 text-sm md:col-span-2"
                    placeholder="Search name, email, phone"
                    value={userFilters.search}
                    onChange={(e) => setUserFilters((s) => ({ ...s, search: e.target.value, page: 1 }))}
                  />
                </div>

                <div className="overflow-auto border border-blue-100 rounded-xl">
                  <table className="w-full text-sm">
                    <thead className="bg-blue-50 text-blue-900">
                      <tr>
                        <th className="text-left px-3 py-2">Name</th>
                        <th className="text-left px-3 py-2">Role</th>
                        <th className="text-left px-3 py-2">KYC</th>
                        <th className="text-left px-3 py-2">Status</th>
                        <th className="text-left px-3 py-2">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {usersData.items.map((row) => (
                        <tr key={row._id} className="border-t border-blue-50">
                          <td className="px-3 py-2">
                            <p className="font-semibold text-slate-900">{row.name}</p>
                            <p className="text-xs text-slate-500">{row.email}</p>
                          </td>
                          <td className="px-3 py-2 capitalize">{row.role}</td>
                          <td className="px-3 py-2">
                            <span className={`inline-flex px-2 py-1 rounded-full text-xs font-semibold ${kycBadgeClass(row?.shopkeeperKyc?.status)}`}>
                              {row?.shopkeeperKyc?.status || 'n/a'}
                            </span>
                          </td>
                          <td className="px-3 py-2"><StatusBadge active={row.isActive} /></td>
                          <td className="px-3 py-2">
                            <button
                              disabled={row.role === 'admin'}
                              onClick={() => handleToggleUserStatus(row)}
                              className={`px-3 py-1 rounded text-xs font-semibold ${
                                row.role === 'admin'
                                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                                  : row.isActive
                                  ? 'bg-rose-600 hover:bg-rose-700 text-white'
                                  : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                              }`}
                            >
                              {row.isActive ? 'Block' : 'Unblock'}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">
                    Page {usersData.pagination.page || 1} of {usersData.pagination.totalPages || 1}
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setUserFilters((s) => ({ ...s, page: Math.max((s.page || 1) - 1, 1) }))}
                      className="px-3 py-1 rounded border border-blue-200 text-blue-700"
                    >
                      Prev
                    </button>
                    <button
                      onClick={() =>
                        setUserFilters((s) => ({
                          ...s,
                          page: Math.min((s.page || 1) + 1, usersData.pagination.totalPages || 1)
                        }))
                      }
                      className="px-3 py-1 rounded border border-blue-200 text-blue-700"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            )}

            {!loading && activeTab === 'kyc' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <h2 className="text-lg font-semibold text-blue-900">KYC Queue (Shopkeeper, Medical, Worker, Delivery)</h2>
                  <div className="flex items-center gap-2">
                    <select
                      className="border border-blue-100 rounded-lg px-3 py-2 text-sm"
                      value={kycRoleFilter}
                      onChange={(e) => setKycRoleFilter(e.target.value)}
                    >
                      <option value="all">All Roles</option>
                      <option value="shopkeeper">Shopkeeper</option>
                      <option value="medical">Medical</option>
                      <option value="worker">Worker</option>
                      <option value="delivery">Delivery</option>
                    </select>
                    <select
                      className="border border-blue-100 rounded-lg px-3 py-2 text-sm"
                      value={kycFilter}
                      onChange={(e) => setKycFilter(e.target.value)}
                    >
                      <option value="pending">Pending</option>
                      <option value="verified">Verified</option>
                      <option value="rejected">Rejected</option>
                      <option value="all">All</option>
                    </select>
                  </div>
                </div>

                <div className="grid gap-3">
                  {kycRows.map((row) => (
                    <div key={row._id} className="border border-blue-100 rounded-xl p-4 bg-blue-50/30">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <p className="font-semibold text-blue-900">{row.name}</p>
                          <p className="text-xs text-slate-500">{row.email}</p>
                          <p className="text-xs text-slate-600 mt-1 capitalize">Role: {row.role || 'unknown'}</p>
                          <p className="text-xs text-slate-600 mt-1">Business: {row.shopkeeperKyc?.businessName || 'N/A'}</p>
                          <p className="text-xs text-slate-600">Doc: {row.shopkeeperKyc?.documentType || '-'} / {row.shopkeeperKyc?.documentNumber || '-'}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${kycBadgeClass(row.shopkeeperKyc?.status)}`}>
                            {row.shopkeeperKyc?.status || 'not_submitted'}
                          </span>
                          <StatusBadge active={row.isActive} />
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 mt-3">
                        <button
                          onClick={() => handleKycAction(row._id, 'verified')}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded text-xs font-semibold"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleKycAction(row._id, 'rejected')}
                          className="bg-rose-600 hover:bg-rose-700 text-white px-3 py-1.5 rounded text-xs font-semibold"
                        >
                          Reject
                        </button>
                        <button
                          onClick={() => handleKycAction(row._id, 'pending')}
                          className="bg-amber-500 hover:bg-amber-600 text-white px-3 py-1.5 rounded text-xs font-semibold"
                        >
                          Mark Pending
                        </button>
                      </div>
                    </div>
                  ))}

                  {!kycRows.length ? (
                    <p className="text-sm text-slate-500">No KYC requests found for selected status.</p>
                  ) : null}
                </div>
              </div>
            )}

            {!loading && activeTab === 'areas' && (
              <div className="space-y-3">
                <h2 className="text-lg font-semibold text-blue-900">Area-wise Workforce and Shops</h2>
                <div className="overflow-auto border border-blue-100 rounded-xl">
                  <table className="w-full text-sm">
                    <thead className="bg-blue-50 text-blue-900">
                      <tr>
                        <th className="text-left px-3 py-2">Area Key (Lat,Lng)</th>
                        <th className="text-left px-3 py-2">Total</th>
                        <th className="text-left px-3 py-2">Shopkeepers</th>
                        <th className="text-left px-3 py-2">Workers</th>
                        <th className="text-left px-3 py-2">Medical</th>
                        <th className="text-left px-3 py-2">Delivery</th>
                        <th className="text-left px-3 py-2">Blocked</th>
                      </tr>
                    </thead>
                    <tbody>
                      {areaRows.map((row) => (
                        <tr key={row.areaKey} className="border-t border-blue-50">
                          <td className="px-3 py-2 text-slate-700">{row.areaKey}</td>
                          <td className="px-3 py-2 font-semibold">{row.total}</td>
                          <td className="px-3 py-2">{row.roles?.shopkeeper || 0}</td>
                          <td className="px-3 py-2">{row.roles?.worker || 0}</td>
                          <td className="px-3 py-2">{row.roles?.medical || 0}</td>
                          <td className="px-3 py-2">{row.roles?.delivery || 0}</td>
                          <td className="px-3 py-2 text-rose-600 font-semibold">{row.blocked}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {!loading && activeTab === 'map' && (
              <div className="space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h2 className="text-lg font-semibold text-blue-900">Map by Role</h2>
                  <select
                    className="border border-blue-100 rounded-lg px-3 py-2 text-sm"
                    value={mapRole}
                    onChange={(e) => setMapRole(e.target.value)}
                  >
                    <option value="all">All Roles</option>
                    <option value="shopkeeper">Shopkeeper</option>
                    <option value="worker">Worker</option>
                    <option value="medical">Medical</option>
                    <option value="delivery">Delivery</option>
                  </select>
                </div>
                <DotMap points={mapPoints} selectedRole={mapRole} />
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
