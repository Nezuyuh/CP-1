import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => { logout(); navigate('/'); setOpen(false); };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 flex-shrink-0">
            <img src="/logo.jpg" alt="Engella Travel and Tours"
              className="h-11 w-11 rounded-full object-cover border-2 border-brand/20" />
            <div className="hidden sm:block leading-tight">
              <p className="text-brand font-extrabold text-base tracking-wide">ENGELLA</p>
              <p className="text-accent text-xs font-bold tracking-wider">TRAVEL AND TOURS</p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-sm font-medium text-gray-700 hover:text-brand transition-colors">Home</Link>
            <a href="/#tours" className="text-sm font-medium text-gray-700 hover:text-brand transition-colors">Tours</a>
            <a href="/#services" className="text-sm font-medium text-gray-700 hover:text-brand transition-colors">Services</a>
          </div>

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                {user.role === 'ADMIN' && (
                  <Link to="/admin" className="text-xs font-bold text-white bg-accent px-3 py-1.5 rounded-full hover:bg-accent-dark transition-colors">
                    ADMIN
                  </Link>
                )}
                <Link to="/dashboard" className="text-sm font-medium text-gray-700 hover:text-brand transition-colors">
                  Hi, {user.firstName}
                </Link>
                <button onClick={handleLogout} className="btn-secondary text-sm py-1.5 px-4">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-sm font-medium text-gray-700 hover:text-brand transition-colors">Login</Link>
                <Link to="/register" className="btn-primary text-sm py-1.5 px-4">Register</Link>
              </>
            )}
          </div>

          {/* Mobile toggle */}
          <button onClick={() => setOpen(!open)} className="md:hidden p-2 rounded-lg hover:bg-gray-100">
            <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {open
                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              }
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-3 space-y-1">
          {[['/', 'Home'], ['/#tours', 'Tours'], ['/#services', 'Services']].map(([to, label]) => (
            <a key={to} href={to} onClick={() => setOpen(false)}
              className="block px-3 py-2.5 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-50">
              {label}
            </a>
          ))}
          <div className="border-t border-gray-100 pt-2 mt-1 space-y-1">
            {user ? (
              <>
                {user.role === 'ADMIN' && (
                  <Link to="/admin" onClick={() => setOpen(false)}
                    className="block px-3 py-2.5 text-sm font-bold text-accent rounded-lg hover:bg-red-50">
                    Admin Panel
                  </Link>
                )}
                <Link to="/dashboard" onClick={() => setOpen(false)}
                  className="block px-3 py-2.5 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-50">
                  My Bookings
                </Link>
                <button onClick={handleLogout}
                  className="block w-full text-left px-3 py-2.5 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setOpen(false)}
                  className="block px-3 py-2.5 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-50">Login</Link>
                <Link to="/register" onClick={() => setOpen(false)}
                  className="block px-3 py-2.5 text-sm font-semibold text-brand rounded-lg hover:bg-blue-50">Register</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
