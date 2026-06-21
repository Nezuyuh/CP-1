import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const from = searchParams.get('from');
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      navigate(from || (user.role === 'ADMIN' ? '/admin' : '/dashboard'));
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden lg:flex flex-col justify-center items-center w-1/2 bg-gradient-to-br from-brand-dark via-brand to-accent/80 text-white p-12">
        <img src="/logo.jpg" alt="Engella Travel and Tours"
          className="w-36 h-36 rounded-full object-cover border-4 border-white/20 mb-8 shadow-2xl" />
        <h1 className="text-3xl font-extrabold mb-2 text-center">ENGELLA</h1>
        <p className="text-gold font-bold tracking-widest text-sm mb-6">TRAVEL AND TOURS</p>
        <p className="text-blue-100 text-center max-w-xs text-sm leading-relaxed">
          Your trusted travel partner since 2014. We make your travel dreams a reality.
        </p>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center bg-gray-50 px-4 py-12">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden flex flex-col items-center mb-8">
            <img src="/logo.jpg" alt="Engella Travel and Tours"
              className="w-20 h-20 rounded-full object-cover border-2 border-brand/20 mb-3" />
            <p className="text-brand font-extrabold text-lg">ENGELLA</p>
            <p className="text-accent text-xs font-bold tracking-wider">TRAVEL AND TOURS</p>
          </div>

          <div className="card p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-1">Welcome back</h2>
            <p className="text-sm text-gray-500 mb-6">Sign in to your account to continue</p>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg mb-5">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="label">Email address</label>
                <input className="input" type="email" required autoComplete="email"
                  value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              </div>
              <div>
                <label className="label">Password</label>
                <input className="input" type="password" required autoComplete="current-password"
                  value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
              </div>
              <button type="submit" disabled={loading} className="btn-primary w-full py-3 mt-2">
                {loading ? 'Signing in…' : 'Sign in'}
              </button>
            </form>

            <p className="text-center text-sm text-gray-500 mt-6">
              Don't have an account?{' '}
              <Link to="/register" className="text-brand font-semibold hover:underline">Create one</Link>
            </p>
          </div>

          <p className="text-center mt-6">
            <Link to="/" className="text-sm text-gray-400 hover:text-brand transition-colors">← Back to home</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
