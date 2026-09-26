import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import authApi from '../api/authApi';
import { decodeToken } from '../utils/decodeToken';
import ThreeCanvas from '../components/ThreeCanvas';
import { Cpu, Lock, User, LogIn, ArrowRight, ShieldCheck } from 'lucide-react';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await authApi.post('/auth/login', { username, password });
      const token = res.data.token;
      const decoded = decodeToken(token);

      const userRole = decoded?.role || 'CUSTOMER';
      const userSub = decoded?.sub || username;

      localStorage.setItem('token', token);
      localStorage.setItem('username', userSub);
      localStorage.setItem('role', userRole);

      if (userRole === 'ADMIN') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (err) {
      setError('Authentication failed. Check your username and password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page-3d">
      <ThreeCanvas variant="auth" />

      <div className="auth-card-3d 3d-glass-panel">
        <div className="auth-header-3d">
          <div className="auth-logo-box">
            <Cpu size={28} className="text-accent" />
          </div>
          <h2>Welcome Back</h2>
          <p>Login to access your ShopEase account & orders</p>
        </div>

        {error && (
          <div className="auth-alert-banner error">
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form-3d">
          <div className="input-group-3d">
            <label>Username</label>
            <div className="input-with-icon">
              <User size={18} className="input-icon" />
              <input
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="input-group-3d">
            <label>Password</label>
            <div className="input-with-icon">
              <Lock size={18} className="input-icon" />
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn-cyber-solid full-width lg-btn"
            disabled={loading}
          >
            {loading ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <LogIn size={18} />
                <span>Login Access</span>
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        <div className="auth-footer-3d">
          <p>
            Don&apos;t have an account?{' '}
            <Link to="/register" className="auth-link">
              Register here
            </Link>
          </p>

          <div className="auth-security-badge">
            <ShieldCheck size={14} />
            <span>JWT Stateless Token Authentication</span>
          </div>
        </div>
      </div>
    </div>
  );
}
