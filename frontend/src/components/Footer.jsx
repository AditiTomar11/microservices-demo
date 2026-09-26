import { Link } from 'react';
import { Cpu, ShieldCheck, Server, Radio, ArrowUp } from 'lucide-react';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="footer-3d-wrapper">
      <div className="footer-container 3d-glass-panel">
        <div className="footer-grid">
          {/* Brand Info */}
          <div className="footer-brand-col">
            <Link to="/" className="brand-logo-3d">
              <div className="logo-icon-box">
                <Cpu size={22} className="logo-cpu-icon" />
              </div>
              <span className="brand-text">
                Shop<span className="brand-accent">Ease</span>
              </span>
            </Link>

            <p className="footer-desc">
              Next-generation microservices e-commerce platform built with Spring Boot,
              Eureka Discovery, Spring Cloud Gateway, OpenFeign, JWT Auth, and React 3D Vite UI.
            </p>

            <div className="system-status-indicator">
              <span className="status-ping" />
              <Server size={14} />
              <span>Gateway & Microservices Operational (Port 8080)</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-col">
            <h4 className="footer-col-title">Navigation</h4>
            <ul className="footer-links">
              <li><Link to="/">Home Dashboard</Link></li>
              <li><a href="/#products">Product Catalog</a></li>
              <li><Link to="/about">About Architecture</Link></li>
              <li><Link to="/login">Account Access</Link></li>
            </ul>
          </div>

          {/* Microservices Specs */}
          <div className="footer-col">
            <h4 className="footer-col-title">System Specs</h4>
            <ul className="footer-specs">
              <li><Radio size={12} /> eureka-server (8761)</li>
              <li><Radio size={12} /> api-gateway (8080)</li>
              <li><Radio size={12} /> product-service (8081)</li>
              <li><Radio size={12} /> order-service (8082)</li>
              <li><Radio size={12} /> auth-service (8083)</li>
            </ul>
          </div>

          {/* Trust Badges */}
          <div className="footer-col">
            <h4 className="footer-col-title">Security & Protocol</h4>
            <div className="trust-card-badge">
              <ShieldCheck size={20} className="text-accent" />
              <div>
                <strong>JWT Encrypted</strong>
                <p>Client-side decoded Bearer authentication interceptor</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom-bar">
          <p>© {new Date().getFullYear()} ShopEase. Built with Spring Boot Microservices & React Vite 3D.</p>
          <button className="scroll-top-btn" onClick={scrollToTop} title="Back to Top">
            <ArrowUp size={16} />
            <span>TOP</span>
          </button>
        </div>
      </div>
    </footer>
  );
}
