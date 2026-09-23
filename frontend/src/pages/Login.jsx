import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import authApi from '../api/authApi';
import { decodeToken } from '../utils/decodeToken';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await authApi.post('/auth/login', { username, password });
      const token = res.data.token;
      const decoded = decodeToken(token);

      localStorage.setItem('token', token);
      localStorage.setItem('username', decoded?.sub || username);
      localStorage.setItem('role', decoded?.role || 'CUSTOMER');

      navigate('/');
    } catch (err) {
      setError('Login fail ho gaya — username/password check karo.');
    }
  };

  return (
    <div className="page auth-page">
      <div className="decorative-bg"></div>

      <div
        className="decorative-ring"
        style={{ top: '120px', right: '8%' }}
      ></div>

      <div
        className="soft-glow"
        style={{ bottom: '100px', left: '5%' }}
      ></div>
      <div className="auth-box">
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {error && <p className="error">{error}</p>}
          <button type="submit" className="btn-solid full-width">Login</button>
        </form>
        <p className="auth-switch">
          Account nahi hai? <Link to="/register">Register karo</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
