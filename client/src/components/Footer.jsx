import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-brand-dark text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">

          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img src="/logo.jpg" alt="Engella Travel and Tours"
                className="h-14 w-14 rounded-full object-cover border-2 border-white/20" />
              <div>
                <p className="font-extrabold text-lg leading-tight">ENGELLA</p>
                <p className="text-gold text-xs font-bold tracking-wider">TRAVEL AND TOURS</p>
              </div>
            </div>
            <p className="text-blue-200 text-sm leading-relaxed">
              Your trusted travel partner since 2014. We make your travel dreams a reality — from tickets to complete tour packages.
            </p>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-bold text-sm uppercase tracking-wider text-gold mb-4">Our Services</h3>
            <ul className="space-y-2 text-sm text-blue-200">
              {[
                'Domestic & International Airline Ticketing',
                'Domestic Ferry Ticketing & Cruise Booking',
                'Hotel Booking',
                'Visa/Passport Processing, NSO/PSA, Apostille',
                'Domestic & International Tour Packages',
                'Pick-up & Drop-off Services',
              ].map((s) => (
                <li key={s} className="flex items-start gap-2">
                  <span className="text-gold mt-0.5 flex-shrink-0">›</span>
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Links + Contact */}
          <div>
            <h3 className="font-bold text-sm uppercase tracking-wider text-gold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm text-blue-200 mb-6">
              <li><Link to="/" className="hover:text-white transition-colors">Home</Link></li>
              <li><a href="/#tours" className="hover:text-white transition-colors">Tour Packages</a></li>
              <li><a href="/#services" className="hover:text-white transition-colors">Services</a></li>
              <li><Link to="/register" className="hover:text-white transition-colors">Create Account</Link></li>
              <li><Link to="/login" className="hover:text-white transition-colors">Login</Link></li>
            </ul>
            <h3 className="font-bold text-sm uppercase tracking-wider text-gold mb-3">Contact Us</h3>
            <p className="text-sm text-blue-200 mb-1">📧 info@engellatravel.com</p>
            <p className="text-sm text-blue-200">📞 +63 XXX XXX XXXX</p>
          </div>
        </div>

        <div className="border-t border-white/10 mt-10 pt-6 text-center text-xs text-blue-300">
          © {new Date().getFullYear()} Engella Travel and Tours. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
