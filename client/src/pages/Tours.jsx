import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

function TourCard({ tour }) {
  return (
    <div className="card overflow-hidden group hover:shadow-lg transition-all duration-300">
      <div className="relative h-48 bg-gradient-to-br from-brand to-brand-light overflow-hidden">
        {tour.image ? (
          <img src={`/promo-img/${tour.image}`} alt={tour.tourTitle}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="w-full h-full flex items-center justify-center opacity-30">
            <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </div>
        )}
        <div className="absolute top-3 left-3">
          <span className="bg-accent text-white text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wide">
            {tour.duration}
          </span>
        </div>
      </div>
      <div className="p-5">
        <p className="text-xs text-brand font-semibold uppercase tracking-wide mb-1">{tour.destinations}</p>
        <h3 className="text-lg font-bold text-gray-900 mb-3 leading-tight">{tour.tourTitle}</h3>
        <div className="flex items-end justify-between">
          <div>
            {tour.pricePerPerson ? (
              <>
                <p className="text-xs text-gray-400 mb-0.5">Starting from</p>
                <p className="text-xl font-extrabold text-accent">
                  {tour.currency} {parseFloat(tour.pricePerPerson).toLocaleString()}
                  <span className="text-sm font-normal text-gray-400"> /pax</span>
                </p>
              </>
            ) : (
              <p className="text-sm text-gray-400 italic">Price on request</p>
            )}
          </div>
          <Link to={`/tours/${tour.id}`} className="btn-primary text-sm py-2 px-4">View</Link>
        </div>
        {tour.travelDates?.length > 0 && (
          <p className="text-xs text-gray-400 mt-3 pt-3 border-t border-gray-100">
            📅 {tour.travelDates.length} departure date{tour.travelDates.length !== 1 ? 's' : ''} available
          </p>
        )}
      </div>
    </div>
  );
}

export default function Tours() {
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/tours').then((r) => setTours(r.data)).catch(console.error).finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-extrabold text-gray-900">Tour Packages</h1>
          <p className="text-sm text-gray-500 mt-1">Browse our available tours and book your next adventure.</p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => <div key={i} className="card h-80 animate-pulse bg-gray-200" />)}
          </div>
        ) : tours.length === 0 ? (
          <div className="card p-20 text-center">
            <p className="text-5xl mb-4">✈️</p>
            <p className="text-gray-400">No tours available yet. Check back soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {tours.map((t) => <TourCard key={t.id} tour={t} />)}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
