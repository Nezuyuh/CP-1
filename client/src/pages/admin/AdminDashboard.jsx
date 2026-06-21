import { useEffect, useState } from 'react';
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import api from '../../api';
import { useAuth } from '../../context/AuthContext';

// ─── Sidebar ──────────────────────────────────────────────────────────────────
const NAV_ITEMS = [
  { to: '/admin', label: 'Overview', exact: true, icon: '📊' },
  { to: '/admin/tours', label: 'Tours', icon: '✈️' },
  { to: '/admin/bookings', label: 'Bookings', icon: '📋' },
  { to: '/admin/onsite', label: 'Onsite Booking', icon: '🏢' },
];

function Sidebar() {
  const location = useLocation();
  const { logout } = useAuth();
  const navigate = useNavigate();

  return (
    <aside className="w-56 min-h-screen bg-brand-dark text-white flex flex-col flex-shrink-0">
      <div className="flex items-center gap-3 p-4 border-b border-white/10">
        <img src="/logo.jpg" alt="Engella" className="w-9 h-9 rounded-full object-cover flex-shrink-0" />
        <div className="leading-tight min-w-0">
          <p className="font-extrabold text-sm truncate">ENGELLA</p>
          <p className="text-gold text-xs font-semibold truncate">Admin Panel</p>
        </div>
      </div>

      <nav className="flex-1 py-4 px-2 space-y-1">
        {NAV_ITEMS.map(({ to, label, icon, exact }) => {
          const active = exact
            ? location.pathname === to
            : location.pathname === to || location.pathname.startsWith(to + '/');
          return (
            <Link key={to} to={to}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                active ? 'bg-white/15 text-white' : 'text-blue-200 hover:bg-white/10 hover:text-white'
              }`}>
              <span>{icon}</span>
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t border-white/10 space-y-1">
        <Link to="/"
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-blue-200 hover:text-white hover:bg-white/10 transition-all">
          <span>🏠</span> View Site
        </Link>
        <button
          onClick={() => { logout(); navigate('/'); }}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-red-300 hover:text-white hover:bg-red-600/30 transition-all">
          <span>🚪</span> Logout
        </button>
      </div>
    </aside>
  );
}

// ─── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({ label, value, sub, color, icon }) {
  return (
    <div className={`card p-5 border-l-4 ${color}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">{label}</p>
          <p className="text-3xl font-extrabold text-gray-900 mt-1">{value}</p>
          {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
        </div>
        <span className="text-3xl opacity-50">{icon}</span>
      </div>
    </div>
  );
}

// ─── Overview Panel ───────────────────────────────────────────────────────────
function OverviewPanel() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/stats').then((r) => setStats(r.data)).catch(console.error).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-4 border-brand border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 mb-6">Dashboard Overview</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 mb-8">
        <StatCard label="Total Bookings" value={stats.totalBookings} icon="📋" color="border-brand" />
        <StatCard label="Pending" value={stats.pendingBookings} sub="Awaiting confirmation" icon="⏳" color="border-yellow-400" />
        <StatCard label="Confirmed" value={stats.confirmedBookings} icon="✅" color="border-green-500" />
        <StatCard label="Cancelled" value={stats.cancelledBookings} icon="❌" color="border-red-400" />
        <StatCard label="Active Tours" value={stats.totalTours} icon="✈️" color="border-accent" />
        <StatCard
          label="Total Revenue"
          value={`USD ${parseFloat(stats.totalRevenue).toLocaleString()}`}
          sub="Pending + Confirmed"
          icon="💰"
          color="border-gold"
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { to: '/admin/tours', label: 'Manage Tours', icon: '✈️', desc: 'Add, edit, manage tour packages' },
          { to: '/admin/bookings', label: 'View Bookings', icon: '📋', desc: 'Review and update booking status' },
          { to: '/admin/onsite', label: 'Onsite Booking', icon: '🏢', desc: 'Create walk-in / onsite bookings' },
        ].map((a) => (
          <Link key={a.to} to={a.to}
            className="card p-5 hover:shadow-md transition-shadow group">
            <p className="text-2xl mb-3">{a.icon}</p>
            <p className="font-bold text-gray-900 group-hover:text-brand transition-colors">{a.label}</p>
            <p className="text-xs text-gray-400 mt-1">{a.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

// ─── Status Badge ─────────────────────────────────────────────────────────────
const STATUS_STYLES = {
  PENDING: 'bg-yellow-100 text-yellow-700',
  CONFIRMED: 'bg-green-100 text-green-700',
  CANCELLED: 'bg-red-100 text-red-700',
};

// ─── Bookings Panel ───────────────────────────────────────────────────────────
function BookingRow({ b, onStatusChange }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <>
      <tr className="hover:bg-gray-50 transition-colors">
        <td className="py-3.5 pr-4">
          <p className="font-semibold text-gray-900">{b.user?.firstName} {b.user?.lastName}</p>
          <p className="text-xs text-gray-400">{b.user?.email}</p>
        </td>
        <td className="py-3.5 pr-4 font-medium text-gray-800">{b.tour?.tourTitle}</td>
        <td className="py-3.5 pr-4 text-gray-600 text-xs">{b.travelDate?.dateLabel}</td>
        <td className="py-3.5 pr-4 text-center">{b.paxCount}</td>
        <td className="py-3.5 pr-4 font-semibold text-accent">
          {b.totalPrice ? `${b.tour?.currency} ${parseFloat(b.totalPrice).toLocaleString()}` : '—'}
        </td>
        <td className="py-3.5 pr-4">
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${b.isOnsiteBooking ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-600'}`}>
            {b.isOnsiteBooking ? 'Onsite' : 'Online'}
          </span>
        </td>
        <td className="py-3.5 pr-4">
          <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${STATUS_STYLES[b.status]}`}>
            {b.status}
          </span>
        </td>
        <td className="py-3.5 pr-3">
          <select
            className="text-xs border border-gray-200 rounded-lg px-2 py-1 bg-white focus:outline-none focus:ring-1 focus:ring-brand"
            value={b.status}
            onChange={(e) => onStatusChange(b.id, e.target.value)}>
            <option value="PENDING">Pending</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </td>
        <td className="py-3.5">
          <button
            onClick={() => setExpanded((v) => !v)}
            className={`text-xs font-medium px-2.5 py-1 rounded-lg border transition-colors ${
              b.documents?.length
                ? 'border-brand/40 text-brand hover:bg-blue-50'
                : 'border-gray-200 text-gray-400 hover:bg-gray-50'
            }`}>
            📎 {b.documents?.length || 0}
          </button>
        </td>
      </tr>
      {expanded && (
        <tr>
          <td colSpan={9} className="pb-4 px-2">
            <div className="bg-blue-50 rounded-xl px-4 py-3">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                Requirements / Documents
              </p>
              {b.documents?.length ? (
                <div className="flex flex-wrap gap-2">
                  {b.documents.map((d) => (
                    <a key={d.id} href={d.fileUrl} target="_blank" rel="noreferrer"
                      className="text-xs text-brand hover:underline bg-white border border-blue-100 px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow-sm">
                      📄 {d.fileName}
                    </a>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-gray-400 italic">No documents uploaded yet.</p>
              )}
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

function BookingsPanel() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  const load = (status = '') => {
    setLoading(true);
    api.get(`/admin/bookings${status ? `?status=${status}` : ''}`)
      .then((r) => setBookings(r.data.bookings))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(filter); }, [filter]);

  const updateStatus = async (id, status) => {
    await api.put(`/admin/bookings/${id}`, { status });
    load(filter);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
        <h2 className="text-xl font-bold text-gray-900">All Bookings</h2>
        <select className="input w-auto text-sm" value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="">All statuses</option>
          <option value="PENDING">Pending</option>
          <option value="CONFIRMED">Confirmed</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><div className="w-8 h-8 border-4 border-brand border-t-transparent rounded-full animate-spin" /></div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-left">
                <th className="pb-3 pr-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">Guest</th>
                <th className="pb-3 pr-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">Tour</th>
                <th className="pb-3 pr-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">Date</th>
                <th className="pb-3 pr-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">Pax</th>
                <th className="pb-3 pr-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">Total</th>
                <th className="pb-3 pr-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">Source</th>
                <th className="pb-3 pr-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                <th className="pb-3 pr-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Action</th>
                <th className="pb-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Docs</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {bookings.map((b) => (
                <BookingRow key={b.id} b={b} onStatusChange={updateStatus} />
              ))}
            </tbody>
          </table>
          {bookings.length === 0 && (
            <div className="text-center py-16 text-gray-400">
              <p className="text-4xl mb-3">📋</p>
              <p>No bookings found</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Onsite Panel ─────────────────────────────────────────────────────────────
function OnsitePanel() {
  const [tours, setTours] = useState([]);
  const [selectedTour, setSelectedTour] = useState(null);
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ userId: '', tourId: '', travelDateId: '', paxCount: 1, roomType: 'Twin Share', notes: '' });
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [userSearch, setUserSearch] = useState('');

  useEffect(() => { api.get('/tours').then((r) => setTours(r.data)); }, []);

  const handleTourChange = (tourId) => {
    const t = tours.find((x) => x.id === tourId);
    setSelectedTour(t || null);
    setForm((f) => ({ ...f, tourId, travelDateId: '' }));
  };

  const searchUsers = async (q) => {
    setUserSearch(q);
    if (q.length < 3) { setUsers([]); return; }
    try {
      const res = await api.get(`/admin/users?email=${q}`);
      setUsers(res.data || []);
    } catch { setUsers([]); }
  };

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    if (!form.userId || !form.tourId || !form.travelDateId) {
      setError('Please fill in all required fields'); return;
    }
    setLoading(true);
    try {
      const res = await api.post('/admin/bookings', { ...form, paxCount: parseInt(form.paxCount) });
      setSuccess(`Booking created! Reference: ${res.data.id}`);
      setForm({ userId: '', tourId: '', travelDateId: '', paxCount: 1, roomType: 'Twin Share', notes: '' });
      setSelectedTour(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create booking');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl">
      <h2 className="text-xl font-bold text-gray-900 mb-5">Onsite / Walk-in Booking</h2>
      {success && <div className="bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-3 rounded-lg mb-4">{success}</div>}
      {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg mb-4">{error}</div>}

      <form onSubmit={handleSubmit} className="card p-6 space-y-5">
        {/* User search */}
        <div>
          <label className="label">Guest User *</label>
          <input className="input" placeholder="Paste user ID directly…"
            value={form.userId} onChange={set('userId')} />
          <div className="mt-2">
            <input className="input mt-1" placeholder="Or search by email to find user…"
              value={userSearch} onChange={(e) => searchUsers(e.target.value)} />
            {users.length > 0 && (
              <div className="border border-gray-200 rounded-lg mt-1 overflow-hidden">
                {users.map((u) => (
                  <button key={u.id} type="button"
                    className="block w-full text-left text-sm px-4 py-2.5 hover:bg-gray-50 border-b last:border-0 transition-colors"
                    onClick={() => { setForm({ ...form, userId: u.id }); setUsers([]); setUserSearch(u.email); }}>
                    <span className="font-medium">{u.firstName} {u.lastName}</span>
                    <span className="text-gray-400 ml-2">— {u.email}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div>
          <label className="label">Tour *</label>
          <select className="input" value={form.tourId} onChange={(e) => handleTourChange(e.target.value)}>
            <option value="">Select a tour</option>
            {tours.map((t) => <option key={t.id} value={t.id}>{t.tourTitle}</option>)}
          </select>
        </div>

        <div>
          <label className="label">Travel Date *</label>
          <select className="input" value={form.travelDateId} onChange={set('travelDateId')} disabled={!selectedTour}>
            <option value="">Select a departure date</option>
            {selectedTour?.travelDates?.map((d) => (
              <option key={d.id} value={d.id}>{d.dateLabel}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label">Pax *</label>
            <input className="input" type="number" min={1} max={50} value={form.paxCount}
              onChange={(e) => setForm({ ...form, paxCount: e.target.value })} />
          </div>
          <div>
            <label className="label">Room Type</label>
            <select className="input" value={form.roomType} onChange={set('roomType')}>
              <option>Twin Share</option>
              <option>Single Supplement</option>
              <option>Triple Share</option>
            </select>
          </div>
        </div>

        <div>
          <label className="label">Notes</label>
          <textarea className="input" rows={2} value={form.notes} onChange={set('notes')}
            placeholder="Special requests, remarks…" />
        </div>

        <button type="submit" disabled={loading} className="btn-accent w-full py-3 font-bold">
          {loading ? 'Creating…' : 'Create Onsite Booking (Auto-Confirmed)'}
        </button>
      </form>
    </div>
  );
}

// ─── Travel Dates Sub-section ─────────────────────────────────────────────────
function TravelDatesSection({ tourId, dates, onRefresh }) {
  const [newDate, setNewDate] = useState('');
  const [adding, setAdding] = useState(false);

  const addDate = async (e) => {
    e.preventDefault();
    if (!newDate.trim()) return;
    setAdding(true);
    try {
      await api.post(`/admin/tours/${tourId}/dates`, { dateLabel: newDate.trim() });
      setNewDate('');
      onRefresh();
    } catch (err) {
      console.error(err);
    } finally {
      setAdding(false);
    }
  };

  const deleteDate = async (id) => {
    if (!confirm('Delete this date?')) return;
    try {
      await api.delete(`/admin/dates/${id}`);
      onRefresh();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="mt-4 pt-4 border-t border-gray-100">
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Departure Dates</p>
      <div className="space-y-1 mb-3">
        {dates.map((d) => (
          <div key={d.id} className="flex items-center justify-between text-sm bg-blue-50 px-3 py-1.5 rounded-lg">
            <span className="text-brand">📅 {d.dateLabel}</span>
            <button onClick={() => deleteDate(d.id)} className="text-red-400 hover:text-red-600 text-xs ml-2">✕</button>
          </div>
        ))}
        {dates.length === 0 && <p className="text-xs text-gray-400 italic">No dates added yet</p>}
      </div>
      <form onSubmit={addDate} className="flex gap-2">
        <input className="input text-xs flex-1" placeholder="e.g. Oct. 15-20, 2026" value={newDate}
          onChange={(e) => setNewDate(e.target.value)} />
        <button type="submit" disabled={adding} className="btn-primary text-xs py-1 px-3 flex-shrink-0">
          {adding ? '…' : '+ Add'}
        </button>
      </form>
    </div>
  );
}

// ─── Flight Row ───────────────────────────────────────────────────────────────
function FlightRow({ flight, onRefresh }) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(flight);

  const save = async () => {
    await api.put(`/admin/flights/${flight.id}`, form);
    setEditing(false);
    onRefresh();
  };

  const remove = async () => {
    if (!confirm('Delete this flight?')) return;
    await api.delete(`/admin/flights/${flight.id}`);
    onRefresh();
  };

  if (editing) {
    return (
      <div className="grid grid-cols-6 gap-2 py-2 items-center">
        {['flightCode', 'origin', 'destination', 'departTime', 'arrivalTime'].map((k) => (
          <input key={k} className="input text-xs" value={form[k]}
            onChange={(e) => setForm({ ...form, [k]: e.target.value })} />
        ))}
        <div className="flex gap-1">
          <button onClick={save} className="btn-primary text-xs py-1 px-2">Save</button>
          <button onClick={() => setEditing(false)} className="btn-secondary text-xs py-1 px-2">✕</button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 py-2 text-sm">
      <span className="font-mono font-bold text-brand w-20 flex-shrink-0">{flight.flightCode}</span>
      <span className="text-gray-700">{flight.origin} → {flight.destination}</span>
      <span className="text-gray-400 text-xs ml-1">{flight.departTime} – {flight.arrivalTime}</span>
      <div className="ml-auto flex gap-2">
        <button onClick={() => setEditing(true)} className="text-xs text-gray-400 hover:text-brand">Edit</button>
        <button onClick={remove} className="text-xs text-red-400 hover:text-red-600">Delete</button>
      </div>
    </div>
  );
}

function AddFlightForm({ tourId, onAdded }) {
  const [show, setShow] = useState(false);
  const [form, setForm] = useState({ flightCode: '', origin: '', destination: '', departTime: '', arrivalTime: '' });

  const handleAdd = async (e) => {
    e.preventDefault();
    await api.post(`/admin/tours/${tourId}/flights`, form);
    setForm({ flightCode: '', origin: '', destination: '', departTime: '', arrivalTime: '' });
    setShow(false);
    onAdded();
  };

  if (!show) return <button onClick={() => setShow(true)} className="text-xs text-brand hover:underline mt-2">+ Add Flight</button>;

  return (
    <form onSubmit={handleAdd} className="grid grid-cols-6 gap-2 mt-2 items-center">
      {[['flightCode', 'Code'], ['origin', 'From'], ['destination', 'To'], ['departTime', 'Depart'], ['arrivalTime', 'Arrive']].map(([k, ph]) => (
        <input key={k} className="input text-xs" placeholder={ph} required value={form[k]}
          onChange={(e) => setForm({ ...form, [k]: e.target.value })} />
      ))}
      <div className="flex gap-1">
        <button type="submit" className="btn-primary text-xs py-1 px-2">Add</button>
        <button type="button" onClick={() => setShow(false)} className="btn-secondary text-xs py-1 px-2">✕</button>
      </div>
    </form>
  );
}

// ─── Tour Row ─────────────────────────────────────────────────────────────────
function TourRow({ tour, onRefresh }) {
  const [expanded, setExpanded] = useState(false);
  const [fullTour, setFullTour] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({
    tourTitle: tour.tourTitle, destinations: tour.destinations,
    duration: tour.duration, pricePerPerson: tour.pricePerPerson || '',
    currency: tour.currency, priceNotes: tour.priceNotes || '', airline: tour.airline || '',
  });

  const loadFull = async () => {
    if (!fullTour) {
      const r = await api.get(`/tours/${tour.id}`);
      setFullTour(r.data);
    }
    setExpanded((v) => !v);
  };

  const refreshFull = async () => {
    const r = await api.get(`/tours/${tour.id}`);
    setFullTour(r.data);
  };

  const save = async () => {
    await api.put(`/admin/tours/${tour.id}`, form);
    setEditMode(false);
    onRefresh();
  };

  const deactivate = async () => {
    if (!confirm(`Deactivate "${tour.tourTitle}"? It will be hidden from customers.`)) return;
    await api.delete(`/admin/tours/${tour.id}`);
    onRefresh();
  };

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      <div className="flex items-center gap-4 p-4 bg-white hover:bg-gray-50/50 transition-colors">
        <div className="flex-1 cursor-pointer min-w-0" onClick={!editMode ? loadFull : undefined}>
          {editMode ? (
            <div className="grid grid-cols-2 gap-2">
              {[['tourTitle', 'Tour Title'], ['destinations', 'Destinations'], ['duration', 'Duration'], ['pricePerPerson', 'Price/pax'], ['currency', 'Currency'], ['airline', 'Airline']].map(([k, ph]) => (
                <input key={k} className="input text-sm" placeholder={ph} value={form[k]}
                  onChange={(e) => setForm({ ...form, [k]: e.target.value })} />
              ))}
              <textarea className="input text-sm col-span-2" placeholder="Price notes" rows={1}
                value={form.priceNotes} onChange={(e) => setForm({ ...form, priceNotes: e.target.value })} />
            </div>
          ) : (
            <div className="flex items-center gap-3">
              {tour.image && (
                <img src={`/promo-img/${tour.image}`} alt={tour.tourTitle}
                  className="w-12 h-10 rounded-lg object-cover flex-shrink-0" />
              )}
              <div className="min-w-0">
                <p className="font-bold text-gray-900 truncate">{tour.tourTitle}</p>
                <p className="text-xs text-gray-500 truncate">
                  {tour.destinations} · {tour.duration}
                  {tour.pricePerPerson ? ` · ${tour.currency} ${parseFloat(tour.pricePerPerson).toLocaleString()}/pax` : ''}
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-2 items-center flex-shrink-0">
          {editMode ? (
            <>
              <button onClick={save} className="btn-primary text-xs py-1.5 px-3">Save</button>
              <button onClick={() => setEditMode(false)} className="btn-secondary text-xs py-1.5 px-3">Cancel</button>
            </>
          ) : (
            <>
              <button onClick={() => setEditMode(true)} className="btn-secondary text-xs py-1.5 px-3">Edit</button>
              <button onClick={deactivate} className="text-xs text-red-400 hover:text-red-600 font-medium">Deactivate</button>
            </>
          )}
        </div>
      </div>

      {expanded && fullTour && (
        <div className="border-t border-gray-100 p-4 bg-gray-50/50 space-y-1">
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Flights</p>
            {fullTour.flights.map((f) => (
              <FlightRow key={f.id} flight={f} onRefresh={refreshFull} />
            ))}
            <AddFlightForm tourId={tour.id} onAdded={refreshFull} />
          </div>
          <TravelDatesSection tourId={tour.id} dates={fullTour.travelDates || []} onRefresh={refreshFull} />
        </div>
      )}
    </div>
  );
}

// ─── Tours Panel ──────────────────────────────────────────────────────────────
function ToursPanel() {
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [newTour, setNewTour] = useState({ tourTitle: '', destinations: '', duration: '', pricePerPerson: '', currency: 'USD', airline: '' });
  const [addError, setAddError] = useState('');

  const fetchTours = () => {
    setLoading(true);
    api.get('/tours').then((r) => setTours(r.data)).catch(console.error).finally(() => setLoading(false));
  };

  useEffect(fetchTours, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    setAddError('');
    try {
      await api.post('/admin/tours', newTour);
      setShowAdd(false);
      setNewTour({ tourTitle: '', destinations: '', duration: '', pricePerPerson: '', currency: 'USD', airline: '' });
      fetchTours();
    } catch (err) {
      setAddError(err.response?.data?.message || 'Failed to create tour');
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-xl font-bold text-gray-900">Tour Packages</h2>
        <button onClick={() => setShowAdd((v) => !v)} className={showAdd ? 'btn-secondary text-sm' : 'btn-primary text-sm'}>
          {showAdd ? '✕ Cancel' : '+ New Tour'}
        </button>
      </div>

      {showAdd && (
        <div className="card p-5 mb-5">
          <h3 className="font-bold text-gray-900 mb-4">Add New Tour</h3>
          {addError && <p className="text-red-600 text-sm mb-3 bg-red-50 px-3 py-2 rounded">{addError}</p>}
          <form onSubmit={handleAdd} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              {[['tourTitle', 'Tour Title *'], ['destinations', 'Destinations *'], ['duration', 'Duration *'], ['pricePerPerson', 'Price/pax'], ['currency', 'Currency'], ['airline', 'Airline']].map(([k, ph]) => (
                <div key={k}>
                  <label className="label text-xs">{ph}</label>
                  <input className="input text-sm" placeholder={ph} required={ph.includes('*')}
                    value={newTour[k]} onChange={(e) => setNewTour({ ...newTour, [k]: e.target.value })} />
                </div>
              ))}
            </div>
            <button type="submit" className="btn-primary text-sm">Create Tour</button>
          </form>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-16"><div className="w-8 h-8 border-4 border-brand border-t-transparent rounded-full animate-spin" /></div>
      ) : (
        <div className="space-y-3">
          {tours.map((t) => <TourRow key={t.id} tour={t} onRefresh={fetchTours} />)}
          {tours.length === 0 && (
            <div className="text-center py-16 text-gray-400">
              <p className="text-4xl mb-3">✈️</p>
              <p>No tours yet. Add your first tour package!</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Layout ───────────────────────────────────────────────────────────────────
export default function AdminDashboard() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <div className="max-w-5xl mx-auto px-6 py-8">
          <Routes>
            <Route index element={<OverviewPanel />} />
            <Route path="tours" element={<ToursPanel />} />
            <Route path="bookings" element={<BookingsPanel />} />
            <Route path="onsite" element={<OnsitePanel />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}
