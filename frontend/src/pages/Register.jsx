import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import authApi from '../api/authApi';

function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await authApi.post('/auth/register', { username, password, role: 'CUSTOMER' });
      setSuccess('Registration successful! Ab login karo.');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      setError('Registration fail ho gaya — username already liya hua ho sakta hai.');
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
        <h2>Register</h2>
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
          {success && <p className="success">{success}</p>}
          <button type="submit" className="btn-solid full-width">Register</button>
        </form>
        <p className="auth-switch">
          Already account hai? <Link to="/login">Login karo</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
