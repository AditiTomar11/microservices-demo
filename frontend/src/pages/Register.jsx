import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import authApi from '../api/authApi';
import ThreeCanvas from '../components/ThreeCanvas';
import { Cpu, Lock, User, UserPlus, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await authApi.post('/auth/register', {
        username,
        password,
        role: 'CUSTOMER',
      });

      setSuccess('Account created successfully! Redirecting to login...');
      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } catch (err) {
      setError('Registration failed. Username may already be taken.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page-3d">
      <ThreeCanvas variant="auth" />

      <div className="auth-card-3d glass-panel-3d">
        <div className="auth-header-3d">
          <div className="auth-logo-box">
            <Cpu size={28} className="text-accent" />
          </div>
          <h2>Create Account</h2>
          <p>Join ShopEase for fast order management & hardware deals</p>
        </div>

        {error && (
          <div className="auth-alert-banner error">
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="auth-alert-banner success">
            <CheckCircle2 size={16} />
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form-3d">
          <div className="input-group-3d">
            <label>Username</label>
            <div className="input-with-icon">
              <User size={18} className="input-icon" />
              <input
                type="text"
                placeholder="Choose a unique username"
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
                placeholder="Create a strong password"
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
              <span>Creating Account...</span>
            ) : (
              <>
                <UserPlus size={18} />
                <span>Register Account</span>
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        <div className="auth-footer-3d">
          <p>
            Already have an account?{' '}
            <Link to="/login" className="auth-link">
              Login here
            </Link>
          </p>

          <div className="auth-security-badge">
            <ShieldCheck size={14} />
            <span>BCrypt Hash Encrypted Passwords</span>
          </div>
        </div>
      </div>
    </div>
  );
}
