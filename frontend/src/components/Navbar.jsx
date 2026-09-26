import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingBag, Heart, User, LogOut, Shield, Cpu, Menu, X } from 'lucide-react';

export default function Navbar({
  cartCount = 0,
  wishlistCount = 0,
  onOpenCart,
  onOpenWishlist,
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  const username = localStorage.getItem('username');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('role');
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="navbar-3d-wrapper">
      <nav className="navbar-3d 3d-glass-panel">
        {/* Brand Logo */}
        <Link to="/" className="brand-logo-3d">
          <div className="logo-icon-box">
            <Cpu size={22} className="logo-cpu-icon" />
          </div>
          <span className="brand-text">
            Shop<span className="brand-accent">Ease</span>
          </span>
          <span className="brand-beta-tag">3D HUD</span>
        </Link>

        {/* Desktop Nav Links */}
        <div className="nav-links-3d">
          <Link to="/" className={`nav-item ${isActive('/') ? 'active' : ''}`}>
            Home
          </Link>
          <a href="/#products" className="nav-item">
            Shop Catalog
          </a>
          <Link to="/about" className={`nav-item ${isActive('/about') ? 'active' : ''}`}>
            About
          </Link>

          {role === 'ADMIN' && (
            <Link to="/admin" className={`nav-item admin-link ${isActive('/admin') ? 'active' : ''}`}>
              <Shield size={14} />
              <span>Admin Center</span>
            </Link>
          )}
        </div>

        {/* Right Actions */}
        <div className="nav-actions-3d">
          {/* Wishlist Button */}
          <button
            className="nav-icon-badge-btn"
            title="Wishlist"
            onClick={onOpenWishlist}
          >
            <Heart size={18} />
            {wishlistCount > 0 && (
              <span className="badge-count count-red">{wishlistCount}</span>
            )}
          </button>

          {/* Cart Button */}
          <button
            className="nav-icon-badge-btn"
            title="Shopping Cart"
            onClick={onOpenCart}
          >
            <ShoppingBag size={18} />
            {cartCount > 0 && (
              <span className="badge-count count-blue">{cartCount}</span>
            )}
          </button>

          {/* Auth Controls */}
          {token ? (
            <div className="user-profile-pill">
              <div className="user-avatar-dot">
                <User size={14} />
              </div>
              <span className="username-display">{username}</span>
              <button
                className="logout-icon-btn"
                title="Logout"
                onClick={handleLogout}
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <div className="auth-btn-group">
              <Link to="/login" className="btn-cyber-outline btn-sm">
                Login
              </Link>
              <Link to="/register" className="btn-cyber-solid btn-sm">
                Register
              </Link>
            </div>
          )}

          {/* Mobile Menu Toggle */}
          <button
            className="mobile-hamburger-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="mobile-menu-overlay 3d-glass-panel" onClick={() => setMobileMenuOpen(false)}>
          <div className="mobile-menu-links">
            <Link to="/" onClick={() => setMobileMenuOpen(false)}>
              Home
            </Link>
            <a href="/#products" onClick={() => setMobileMenuOpen(false)}>
              Shop Catalog
            </a>
            <Link to="/about" onClick={() => setMobileMenuOpen(false)}>
              About
            </Link>
            {role === 'ADMIN' && (
              <Link to="/admin" onClick={() => setMobileMenuOpen(false)}>
                Admin Center
              </Link>
            )}

            {token ? (
              <button className="btn-cyber-outline full-width" onClick={handleLogout}>
                Logout ({username})
              </button>
            ) : (
              <div className="mobile-auth-row">
                <Link to="/login" className="btn-cyber-outline full-width" onClick={() => setMobileMenuOpen(false)}>
                  Login
                </Link>
                <Link to="/register" className="btn-cyber-solid full-width" onClick={() => setMobileMenuOpen(false)}>
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
