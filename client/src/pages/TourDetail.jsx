import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';

export default function TourDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [tour, setTour] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/tours/${id}`).then((r) => setTour(r.data)).catch(console.error).finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center text-gray-400">
            <div className="w-12 h-12 border-4 border-brand border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p>Loading tour details…</p>
          </div>
        </div>
      </div>
    );
  }

  if (!tour) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center text-center px-4">
          <div>
            <p className="text-5xl mb-4">✈️</p>
            <h2 className="text-xl font-bold text-gray-700 mb-2">Tour not found</h2>
            <Link to="/" className="btn-primary">Back to Tours</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      {/* Hero */}
      <div className="relative h-72 sm:h-80 bg-gradient-to-br from-brand-dark to-brand overflow-hidden">
        {tour.image && (
          <img src={tour.image} alt={tour.tourTitle}
            className="absolute inset-0 w-full h-full object-cover opacity-40" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        <div className="relative h-full flex items-end">
          <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 pb-8">
            <span className="inline-block bg-accent text-white text-xs font-bold px-3 py-1 rounded-full uppercase mb-3">
              {tour.duration}
            </span>
            <p className="text-blue-200 text-sm mb-1">{tour.destinations}</p>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white">{tour.tourTitle}</h1>
            {tour.airline && <p className="text-blue-100 mt-1 text-sm">✈ {tour.airline}</p>}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left – details */}
        <div className="lg:col-span-2 space-y-6">

          {/* Flights */}
          {tour.flights?.length > 0 && (
            <div className="card p-6">
              <h2 className="text-lg font-bold text-brand mb-4 flex items-center gap-2">
                <span>✈</span> Flight Details
              </h2>
              <div className="divide-y divide-gray-100">
                {tour.flights.map((f) => (
                  <div key={f.id} className="py-3 flex flex-wrap items-center gap-3 text-sm">
                    <span className="font-mono font-bold text-brand w-20 flex-shrink-0">{f.flightCode}</span>
                    <span className="font-semibold text-gray-800">{f.origin}</span>
                    <span className="text-gray-400">→</span>
                    <span className="font-semibold text-gray-800">{f.destination}</span>
                    <span className="ml-auto text-xs text-gray-500 bg-gray-50 px-2 py-0.5 rounded">
                      {f.departTime} → {f.arrivalTime}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Itinerary */}
          {tour.itinerary?.length > 0 && (
            <div className="card p-6">
              <h2 className="text-lg font-bold text-brand mb-6 flex items-center gap-2">
                <span>🗓</span> Itinerary
              </h2>
              <div className="space-y-6">
                {tour.itinerary.map((day, i) => (
                  <div key={day.id} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-10 h-10 rounded-full bg-brand text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
                        {i + 1}
                      </div>
                      {i < tour.itinerary.length - 1 && (
                        <div className="w-0.5 flex-1 bg-gray-200 mt-2" />
                      )}
                    </div>
                    <div className="pb-6 flex-1">
                      <p className="text-xs font-bold text-accent uppercase tracking-wide mb-0.5">{day.day}</p>
                      <h3 className="font-bold text-gray-900 mb-2">{day.title}</h3>
                      <ul className="space-y-1 mb-2">
                        {day.activities.map((a) => (
                          <li key={a.id} className="text-sm text-gray-600 flex gap-2">
                            <span className="text-brand mt-0.5 flex-shrink-0">•</span>
                            {a.description}
                          </li>
                        ))}
                      </ul>
                      {day.accommodation && (
                        <p className="text-xs text-brand font-semibold mt-2 bg-blue-50 inline-block px-2 py-1 rounded">
                          🏨 {day.accommodation}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right – booking sidebar */}
        <div>
          <div className="card p-6 sticky top-20">
            {tour.pricePerPerson ? (
              <div className="mb-5 pb-5 border-b border-gray-100">
                <p className="text-xs text-gray-400 mb-1">Starting from</p>
                <p className="text-3xl font-extrabold text-accent">
                  {tour.currency} {parseFloat(tour.pricePerPerson).toLocaleString()}
                </p>
                <p className="text-sm text-gray-500">per person</p>
                {tour.priceNotes && (
                  <p className="text-xs text-gray-400 mt-2 leading-relaxed">{tour.priceNotes}</p>
                )}
              </div>
            ) : (
              <p className="text-gray-500 mb-5 pb-5 border-b border-gray-100 text-sm">Price on request</p>
            )}

            {tour.travelDates?.length > 0 && (
              <div className="mb-5">
                <p className="label mb-2">Available Departure Dates</p>
                <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                  {tour.travelDates.map((d) => (
                    <div key={d.id} className="text-sm bg-blue-50 text-brand px-3 py-2 rounded-lg flex items-center gap-2">
                      <span>📅</span> {d.dateLabel}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {user ? (
              <Link to={`/tours/${id}/book`} className="btn-accent w-full py-3 text-base font-bold">
                Book This Tour
              </Link>
            ) : (
              <div className="space-y-3">
                <Link to="/login" className="btn-primary w-full py-3 text-base font-bold">
                  Login to Book
                </Link>
                <Link to="/register" className="btn-secondary w-full py-2.5 text-sm text-center">
                  Create an Account
                </Link>
              </div>
            )}

            <div className="mt-4 pt-4 border-t border-gray-100">
              <Link to={user ? '/tours' : '/'} className="text-sm text-brand hover:underline flex items-center gap-1">
                ← Browse more tours
              </Link>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
