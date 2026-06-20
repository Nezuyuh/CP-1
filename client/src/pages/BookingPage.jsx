import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function BookingPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tour, setTour] = useState(null);
  const [form, setForm] = useState({ travelDateId: '', paxCount: 1, roomType: 'Twin Share', notes: '' });
  const [files, setFiles] = useState([]);
  const [booking, setBooking] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get(`/tours/${id}`).then((r) => setTour(r.data)).catch(console.error);
  }, [id]);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });
  const totalPrice = tour?.pricePerPerson ? parseFloat(tour.pricePerPerson) * form.paxCount : null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.travelDateId) { setError('Please select a travel date'); return; }
    setLoading(true);
    try {
      const res = await api.post('/bookings', { tourId: id, ...form });
      if (files.length > 0) {
        const fd = new FormData();
        files.forEach((f) => fd.append('files', f));
        await api.post(`/bookings/${res.data.id}/documents`, fd, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }
      setBooking(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Booking failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (booking) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <div className="flex-1 flex items-center justify-center px-4 py-20">
          <div className="card p-10 w-full max-w-md text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Booking Submitted!</h1>
            <p className="text-gray-500 mb-6 text-sm leading-relaxed">
              Your booking is <strong className="text-yellow-700">pending confirmation</strong>. Our team will contact you shortly to finalize the details.
            </p>
            <div className="bg-gray-50 rounded-lg p-3 mb-6">
              <p className="text-xs text-gray-400 mb-1">Booking Reference</p>
              <p className="font-mono text-sm font-bold text-brand break-all">{booking.id}</p>
            </div>
            <div className="flex gap-3 justify-center">
              <button onClick={() => navigate('/dashboard')} className="btn-primary py-2.5">My Bookings</button>
              <button onClick={() => navigate('/')} className="btn-secondary py-2.5">Browse More</button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!tour) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-brand border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <div className="max-w-2xl mx-auto w-full px-4 py-10">

        {/* Tour summary */}
        <div className="card p-5 mb-6 flex items-center gap-4">
          {tour.image ? (
            <img src={`/promo-img/${tour.image}`} alt={tour.tourTitle}
              className="w-20 h-16 rounded-lg object-cover flex-shrink-0" />
          ) : (
            <div className="w-20 h-16 rounded-lg bg-brand flex items-center justify-center flex-shrink-0">
              <span className="text-white text-2xl">✈</span>
            </div>
          )}
          <div>
            <p className="text-xs text-accent font-semibold uppercase tracking-wide">{tour.destinations}</p>
            <h1 className="text-lg font-bold text-gray-900">{tour.tourTitle}</h1>
            <p className="text-sm text-gray-500">{tour.duration}</p>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg mb-5">
            {error}
          </div>
        )}

        <div className="card p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-5">Booking Details</h2>
          <form onSubmit={handleSubmit} className="space-y-5">

            <div>
              <label className="label">Travel Date *</label>
              <select className="input" required value={form.travelDateId} onChange={set('travelDateId')}>
                <option value="">Select a departure date</option>
                {tour.travelDates.map((d) => (
                  <option key={d.id} value={d.id}>{d.dateLabel}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Number of Pax *</label>
                <input className="input" type="number" min={1} max={20} required
                  value={form.paxCount}
                  onChange={(e) => setForm({ ...form, paxCount: parseInt(e.target.value) || 1 })} />
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
              <label className="label">Special Requests / Notes</label>
              <textarea className="input" rows={3} value={form.notes} onChange={set('notes')}
                placeholder="Dietary requirements, accessibility needs, special occasions…" />
            </div>

            <div>
              <label className="label">Upload Documents</label>
              <p className="text-xs text-gray-400 mb-2">Passport, valid ID, etc. (PDF, JPG, PNG)</p>
              <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png"
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-brand file:text-white hover:file:bg-brand-dark cursor-pointer"
                onChange={(e) => setFiles(Array.from(e.target.files))} />
              {files.length > 0 && (
                <p className="text-xs text-brand mt-1 font-medium">{files.length} file(s) selected</p>
              )}
            </div>

            {totalPrice !== null && (
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Estimated Total</p>
                  <p className="text-xs text-gray-400">{form.paxCount} pax × {tour.currency} {parseFloat(tour.pricePerPerson).toLocaleString()}</p>
                </div>
                <p className="text-2xl font-extrabold text-accent">
                  {tour.currency} {totalPrice.toLocaleString()}
                </p>
              </div>
            )}

            <button type="submit" disabled={loading} className="btn-accent w-full py-3 text-base font-bold">
              {loading ? 'Submitting…' : 'Confirm Booking'}
            </button>
          </form>
        </div>

        <p className="text-center mt-4">
          <Link to={`/tours/${id}`} className="text-sm text-gray-400 hover:text-brand">← Back to tour details</Link>
        </p>
      </div>
      <Footer />
    </div>
  );
}
