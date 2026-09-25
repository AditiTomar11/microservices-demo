import { Link } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import './AboutPage.css';

// Simple scroll-reveal hook — adds .is-visible when element enters viewport
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
    <div className="about-page">
      <section className="about-hero">
        <div className="orb orb--1" />
        <div className="orb orb--2" />
        <div className="orb orb--3" />

        <div className="container about-hero__row">
          <div className="live-pill">
            <span className="live-dot" />
            Live: new products added every week
          </div>
          <h1 className="about-hero__title">
            Tech shopping in India
            <br />
            shouldn&apos;t feel like <span className="text-accent-anim">a gamble.</span>
          </h1>
          <p className="about-hero__sub">
            ShopEase started as a simple idea: real specs, real prices, and real categories
            in one place — instead of scattered listings and half-written descriptions.
          </p>

          <div className="about-hero__stats">
            <div className="stat">
              <Counter end={500} suffix="+" />
              <span className="stat-label">Products listed</span>
            </div>
            <div className="stat">
              <Counter end={12} suffix="" />
              <span className="stat-label">Categories</span>
            </div>
            <div className="stat">
              <Counter end={100} suffix="%" />
              <span className="stat-label">Genuine listings</span>
            </div>
          </div>
        </div>
      </section>

      <Reveal className="container about-split">
        <div className="about-split__image">
          <img
            src="https://images.unsplash.com/photo-1518770660439-4636190af475?w=1000"
            alt="Electronics and gadgets"
          />
          <div className="image-glow" />
        </div>
        <div className="about-split__copy">
          <h2>What we&apos;re building</h2>
          <p>
            Every product on ShopEase carries the details that actually matter before you buy —
            clear specs, honest pricing, and the right category, not marketing language dressed
            up as facts. Filter by what you need, compare a few options, and check out without
            digging through five open tabs.
          </p>
          <p>
            We&apos;re not a marketplace stuffed with resellers. No paid placements, no
            &quot;sponsored&quot; listings pushed above what actually matches your search. Just
            a faster, clearer way to find the tech you&apos;re looking for.
          </p>
        </div>
      </Reveal>

      <section className="about-values">
        <div className="container about-values__grid">
          {[
            {
              title: 'Clarity over clutter',
              text: 'A well-described product beats ten vague ones. Every listing here has a real category, description, and price — no "contact for price."',
            },
            {
              title: 'No pay-to-rank listings',
              text: 'What you see first matches your filters, not whoever paid the most for visibility this month.',
            },
            {
              title: 'Built for comparing',
              text: 'Browse by category, check specs side by side, and decide — without switching between five browser tabs.',
            },
          ].map((v, i) => (
            <Reveal key={v.title} delay={i * 120}>
              <div className="about-value">
                <div className="about-value__icon">0{i + 1}</div>
                <h3>{v.title}</h3>
                <p>{v.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <Reveal className="container about-cta">
        <h2>Looking for your next gadget?</h2>
        <div className="about-cta__actions">
          <Link to="/#products" className="btn btn-accent btn-pulse">
            Browse products
          </Link>
          <Link to="/" className="btn btn-outline">
            Back to home
          </Link>
        </div>
      </Reveal>
    </div>
  );
}