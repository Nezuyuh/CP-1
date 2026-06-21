import { useEffect, useState } from 'react';
import api from '../api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const STATUS_STYLES = {
  PENDING: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  CONFIRMED: 'bg-green-100 text-green-700 border-green-200',
  CANCELLED: 'bg-red-100 text-red-700 border-red-200',
};

function UploadModal({ bookingId, onClose, onDone }) {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleUpload = async () => {
    if (!files.length) return;
    setLoading(true);
    setError('');
    try {
      const fd = new FormData();
      files.forEach((f) => fd.append('files', f));
      await api.post(`/bookings/${bookingId}/documents`, fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      onDone();
    } catch (err) {
      setError(err.response?.data?.message || 'Upload failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="card p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold">Upload Documents</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <p className="text-sm text-gray-500 mb-4">Upload passport, valid ID, or other required documents (PDF, JPG, PNG).</p>
        {error && <p className="text-red-600 text-sm mb-3 bg-red-50 px-3 py-2 rounded">{error}</p>}
        <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png"
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-3 file:rounded-lg file:border-0 file:bg-brand file:text-white hover:file:bg-brand-dark mb-5 cursor-pointer"
          onChange={(e) => setFiles(Array.from(e.target.files))} />
        <div className="flex gap-3 justify-end">
          <button onClick={onClose} className="btn-secondary py-2">Cancel</button>
          <button onClick={handleUpload} disabled={loading || !files.length} className="btn-primary py-2">
            {loading ? 'Uploading…' : `Upload${files.length ? ` (${files.length})` : ''}`}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function UserDashboard() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploadTarget, setUploadTarget] = useState(null);

  const fetchBookings = () => {
    api.get('/bookings/my')
      .then((r) => setBookings(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(fetchBookings, []);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <div className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 py-10">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900">My Bookings</h1>
            <p className="text-sm text-gray-500 mt-1">Welcome back, {user?.firstName} {user?.lastName}</p>
          </div>
          <Link to="/tours" className="btn-primary text-sm py-2">Browse Tours</Link>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-10 h-10 border-4 border-brand border-t-transparent rounded-full animate-spin" />
          </div>
        ) : bookings.length === 0 ? (
          <div className="card p-16 text-center">
            <p className="text-5xl mb-4">✈️</p>
            <h2 className="text-lg font-bold text-gray-700 mb-2">No bookings yet</h2>
            <p className="text-gray-400 text-sm mb-6">Start planning your next adventure!</p>
            <Link to="/tours" className="btn-primary">Browse Tour Packages</Link>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((b) => (
              <div key={b.id} className="card overflow-hidden">
                <div className="p-5 sm:p-6">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start gap-3">
                        {b.tour?.image ? (
                          <img src={`/promo-img/${b.tour.image}`} alt={b.tour.tourTitle}
                            className="w-16 h-14 rounded-lg object-cover flex-shrink-0 hidden sm:block" />
                        ) : (
                          <div className="w-16 h-14 rounded-lg bg-brand flex items-center justify-center flex-shrink-0 hidden sm:block">
                            <span className="text-white text-xl">✈</span>
                          </div>
                        )}
                        <div className="min-w-0">
                          <h3 className="font-bold text-gray-900 text-lg leading-tight">{b.tour?.tourTitle}</h3>
                          <p className="text-sm text-gray-500">{b.tour?.destinations} · {b.tour?.duration}</p>
                        </div>
                      </div>

                      <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                        <div>
                          <p className="text-xs text-gray-400 font-medium">Travel Date</p>
                          <p className="text-gray-700 font-medium">{b.travelDate?.dateLabel}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-400 font-medium">Pax</p>
                          <p className="text-gray-700 font-medium">{b.paxCount} pax</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-400 font-medium">Room Type</p>
                          <p className="text-gray-700 font-medium">{b.roomType || '—'}</p>
                        </div>
                        {b.totalPrice && (
                          <div>
                            <p className="text-xs text-gray-400 font-medium">Total</p>
                            <p className="text-accent font-bold">{b.tour?.currency} {parseFloat(b.totalPrice).toLocaleString()}</p>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-3">
                      <span className={`text-xs font-bold px-3 py-1 rounded-full border ${STATUS_STYLES[b.status]}`}>
                        {b.status}
                      </span>
                      <button onClick={() => setUploadTarget(b.id)}
                        className="text-xs text-brand hover:text-brand-dark font-medium border border-brand/30 px-3 py-1.5 rounded-lg hover:bg-blue-50 transition-colors">
                        + Upload Docs
                      </button>
                    </div>
                  </div>

                  {b.documents?.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <p className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">Documents</p>
                      <div className="flex flex-wrap gap-2">
                        {b.documents.map((d) => (
                          <a key={d.id} href={d.fileUrl} target="_blank" rel="noreferrer"
                            className="text-xs text-brand hover:underline bg-blue-50 border border-blue-100 px-3 py-1.5 rounded-lg flex items-center gap-1.5">
                            <span>📎</span> {d.fileName}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="mt-3 pt-3 border-t border-gray-50">
                    <p className="text-xs text-gray-300 font-mono">Ref: {b.id}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {uploadTarget && (
        <UploadModal
          bookingId={uploadTarget}
          onClose={() => setUploadTarget(null)}
          onDone={() => { setUploadTarget(null); fetchBookings(); }}
        />
      )}

      <Footer />
    </div>
  );
}
