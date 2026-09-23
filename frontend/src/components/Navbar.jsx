import { Link, useNavigate } from 'react-router-dom';
function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  const username = localStorage.getItem('username');
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username'); localStorage.removeItem('role');
    navigate('/login');
  };
  return (
    <nav className="navbar">
      
      <Link to="/" className="brand">ShopEase</Link>
      <div className="nav-links"> <Link to="/">Home</Link>
        <Link to="/about">About</Link> <Link to="/">Shop Now</Link>
        {role === 'ADMIN' && <Link to="/admin">Admin Panel</Link>} </div>
      <div className="nav-auth"> {token ? (<> <span className="username-tag">Hi, {username}</span>
        <button className="nav-btn" onClick={handleLogout}>Logout</button> </>) :
        (<> <Link to="/login" className="nav-btn">Login</Link> </>)} </div>
    </nav>
  );
}
export default Navbar;