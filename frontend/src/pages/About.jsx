import { Link } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import ThreeCanvas from '../components/ThreeCanvas';
import { Cpu, Server, ShieldCheck, Zap, ArrowRight, Layers, Radio, Network } from 'lucide-react';
import './AboutPage.css';

// Simple scroll-reveal hook
function useReveal() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return [ref, visible];
}

// Animated count-up for stats
function Counter({ end, suffix = '', duration = 1400 }) {
  const [ref, visible] = useReveal();
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!visible) return;
    let start = null;
    const step = (ts) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [visible, end, duration]);

  return (
    <span ref={ref} className="stat-number">
      {count}
      {suffix}
    </span>
  );
}

function Reveal({ children, className = '', delay = 0 }) {
  const [ref, visible] = useReveal();
  return (
    <div
      ref={ref}
      className={`reveal ${visible ? 'is-visible' : ''} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

export default function AboutPage() {
  return (
    <div className="about-page-3d">
      <ThreeCanvas variant="default" />

      {/* Hero */}
      <section className="about-hero-3d">
        <div className="about-hero-content">
          <div className="hero-badge-pill">
            <span className="live-dot" />
            <span>5 Reactive Microservices Behind API Gateway</span>
          </div>

          <h1 className="about-hero-title">
            Next-Gen E-Commerce <br />
            Built on <span className="text-gradient-3d">Spring Boot Microservices</span>
          </h1>

          <p className="about-hero-sub">
            ShopEase is designed as a distributed, high-throughput e-commerce platform.
            Every listing features authentic specifications, transparent pricing, and smart order merging.
          </p>

          <div className="about-stats-grid">
            <div className="stat-card-3d glass-panel-3d">
              <Counter end={500} suffix="+" />
              <span className="stat-label">Hardware Listings</span>
            </div>

            <div className="stat-card-3d glass-panel-3d">
              <Counter end={5} suffix="" />
              <span className="stat-label">Microservices</span>
            </div>

            <div className="stat-card-3d glass-panel-3d">
              <Counter end={100} suffix="%" />
              <span className="stat-label">Verified Specs</span>
            </div>
          </div>
        </div>
      </section>

      {/* Microservices Architecture Visualizer */}
      <Reveal className="arch-visualizer-section">
        <div className="section-header-3d align-center">
          <span className="section-cyber-tag">SYSTEM BLUEPRINT</span>
          <h2 className="section-title-3d">Microservices Topology</h2>
          <p className="section-subtext">Service discovery, reactive routing, and Feign inter-service calls</p>
        </div>

        <div className="arch-nodes-grid">
          <div className="arch-node-card glass-panel-3d">
            <div className="node-icon-box"><Radio size={20} className="text-accent" /></div>
            <div className="node-port">Port 8761</div>
            <h3>eureka-server</h3>
            <p>Service Registry & Discovery hub where all microservices register dynamically.</p>
          </div>

          <div className="arch-node-card glass-panel-3d highlight">
            <div className="node-icon-box"><Network size={20} className="text-cyan" /></div>
            <div className="node-port">Port 8080</div>
            <h3>api-gateway</h3>
            <p>Spring Cloud Gateway (WebFlux) entry point routing /products, /orders, /auth.</p>
          </div>

          <div className="arch-node-card glass-panel-3d">
            <div className="node-icon-box"><Cpu size={20} className="text-accent" /></div>
            <div className="node-port">Port 8081</div>
            <h3>product-service</h3>
            <p>Onion Architecture service managing catalog, categories, and full product text.</p>
          </div>

          <div className="arch-node-card glass-panel-3d">
            <div className="node-icon-box"><Zap size={20} className="text-orange" /></div>
            <div className="node-port">Port 8082</div>
            <h3>order-service</h3>
            <p>Onion Architecture order service with OpenFeign client & duplicate PENDING order merging.</p>
          </div>

          <div className="arch-node-card glass-panel-3d">
            <div className="node-icon-box"><ShieldCheck size={20} className="text-purple" /></div>
            <div className="node-port">Port 8083</div>
            <h3>auth-service</h3>
            <p>Stateless JWT authentication service issuing Bearer tokens with BCrypt credentials.</p>
          </div>
        </div>
      </Reveal>

      {/* Split Story */}
      <Reveal className="about-split-3d">
        <div className="about-split-img-box glass-panel-3d">
          <img
            src="https://images.unsplash.com/photo-1518770660439-4636190af475?w=1000"
            alt="Electronics and gadgets"
          />
          <div className="img-shine-overlay" />
        </div>

        <div className="about-split-content">
          <h2>What We&apos;re Building</h2>
          <p>
            Every product on ShopEase carries the details that actually matter before you buy —
            clear hardware specs, honest pricing, and the right category without fluff.
            Filter by what you need, compare options side by side, and check out instantly.
          </p>
          <p>
            We eliminate sponsored listings and paid rankings. What you see matches your exact search,
            powered by microservice speed and stateless security.
          </p>
        </div>
      </Reveal>

      {/* Values */}
      <section className="about-values-section">
        <div className="section-header-3d">
          <span className="section-cyber-tag">CORE PRINCIPLES</span>
          <h2 className="section-title-3d">Platform Directives</h2>
        </div>

        <div className="about-values-grid">
          {[
            {
              title: 'Clarity Over Clutter',
              text: 'Every product listing has a verified category, detailed text specs, and exact price — no hidden fees.',
            },
            {
              title: 'No Pay-To-Rank Listings',
              text: 'Search results strictly match your selected filter criteria, not third-party sponsored positions.',
            },
            {
              title: 'Built for Comparing',
              text: 'Filter by category and price slider in real-time without refreshing or switching browser tabs.',
            },
          ].map((v, i) => (
            <Reveal key={v.title} delay={i * 120}>
              <div className="value-card-3d glass-panel-3d">
                <div className="value-num">0{i + 1}</div>
                <h3>{v.title}</h3>
                <p>{v.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* CTA */}
      <Reveal className="about-cta-section">
        <div className="about-cta-inner glass-panel-3d">
          <h2>Looking for Your Next High-Tech Gadget?</h2>
          <p>Browse our catalog and experience microservice e-commerce in action.</p>

          <div className="about-cta-actions">
            <Link to="/#products" className="btn-cyber-solid lg-btn">
              <span>Browse Catalog</span>
              <ArrowRight size={16} />
            </Link>
            <Link to="/" className="btn-cyber-outline lg-btn">
              <span>Return Home</span>
            </Link>
          </div>
        </div>
      </Reveal>
    </div>
  );
}
