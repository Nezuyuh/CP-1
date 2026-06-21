import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const SERVICES = [
  {
    title: 'Airline Ticketing',
    sub: 'Domestic & International',
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
      </svg>
    ),
    accent: 'border-brand text-brand bg-blue-50',
  },
  {
    title: 'Ferry & Cruise Booking',
    sub: 'Domestic Ferry Ticketing & Cruise',
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M4 17l2-7h12l2 7M4 17H2m2 0h16m0 0h2M8 17v2m8-2v2M12 10V6m0 0l-3 3m3-3l3 3" />
      </svg>
    ),
    accent: 'border-accent text-accent bg-red-50',
  },
  {
    title: 'Hotel Booking',
    sub: 'Best Rates Guaranteed',
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
    accent: 'border-gold text-gold-dark bg-yellow-50',
  },
  {
    title: 'Visa & Documentation',
    sub: 'Visa/Passport, NSO/PSA, Apostille & More',
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    accent: 'border-brand text-brand bg-blue-50',
  },
  {
    title: 'Tour Packages',
    sub: 'Domestic & International',
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    accent: 'border-accent text-accent bg-red-50',
  },
  {
    title: 'Pick-up & Drop-off',
    sub: 'Airport & Hotel Transfers',
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
      </svg>
    ),
    accent: 'border-gold text-gold-dark bg-yellow-50',
  },
];

function TourCard({ tour }) {
  return (
    <div className="card overflow-hidden group hover:shadow-lg transition-all duration-300">
      <div className="relative h-48 bg-gradient-to-br from-brand to-brand-light overflow-hidden">
        {tour.image ? (
          <img src={tour.image} alt={tour.tourTitle}
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

export default function Home() {
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/tours').then((r) => setTours(r.data)).catch(console.error).finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero */}
      <section className="relative bg-brand-dark text-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-dark via-brand to-accent/80" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-24 sm:py-32">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="flex-1 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 text-sm font-medium mb-6">
                ✈️ Trusted Travel Partner Since 2014
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight mb-6">
                Explore the World<br />
                <span className="text-gold">with Engella</span>
              </h1>
              <p className="text-blue-100 text-lg sm:text-xl mb-8 max-w-xl mx-auto lg:mx-0">
                From airline tickets to complete tour packages — we handle everything so you can just enjoy the journey.
              </p>
              <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
                <a href="#tours" className="btn-gold text-base py-3 px-8">Browse Tours</a>
                <a href="#services" className="btn-outline-white text-base py-3 px-8">Our Services</a>
              </div>
            </div>
            <div className="flex-shrink-0">
              <div className="w-44 h-44 sm:w-56 sm:h-56 rounded-full border-4 border-white/20 shadow-2xl overflow-hidden">
                <img src="/logo.jpg" alt="Engella Travel and Tours" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <p className="text-accent font-semibold text-sm uppercase tracking-wider mb-2">What We Offer</p>
            <h2 className="section-title">Our Services</h2>
            <p className="text-gray-500 mt-3 max-w-xl mx-auto text-sm sm:text-base">
              Comprehensive travel services tailored to your every need.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {SERVICES.map((s) => (
              <div key={s.title} className={`card p-6 border-l-4 hover:shadow-md transition-shadow ${s.accent.split(' ')[0]}`}>
                <div className={`w-13 h-13 w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${s.accent.split(' ').slice(1).join(' ')}`}>
                  {s.icon}
                </div>
                <h3 className="font-bold text-gray-900 text-base mb-1">{s.title}</h3>
                <p className="text-sm text-gray-500">{s.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tours */}
      <section id="tours" className="py-16 sm:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <p className="text-accent font-semibold text-sm uppercase tracking-wider mb-2">Explore & Book</p>
            <h2 className="section-title">Available Tour Packages</h2>
            <p className="text-gray-500 mt-3 max-w-xl mx-auto text-sm sm:text-base">
              Curated itineraries to the most exciting destinations worldwide.
            </p>
          </div>
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => <div key={i} className="card h-80 animate-pulse bg-gray-200" />)}
            </div>
          ) : tours.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              <p className="text-5xl mb-4">✈️</p>
              <p>No tours available yet. Check back soon!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {tours.map((t) => <TourCard key={t.id} tour={t} />)}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-accent to-brand py-14">
        <div className="max-w-3xl mx-auto px-4 text-center text-white">
          <h2 className="text-3xl sm:text-4xl font-extrabold mb-4">Ready to Start Your Journey?</h2>
          <p className="text-blue-100 text-lg mb-8">
            Create an account and book your dream trip today.
          </p>
          <Link to="/register" className="btn-gold text-base py-3 px-10">Book Now</Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
