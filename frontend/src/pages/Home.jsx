import { useEffect, useState } from 'react';
import axiosInstance from '../api/axiosInstance';

const PLACEHOLDER_IMAGE =
  'https://via.placeholder.com/300x220?text=Product';

const WHY_CHOOSE_US = [
  {
    icon: '⚡',
    title: 'Genuine Products',
    description: 'Every listing is verified — real specs, no marketing fluff.',
  },
  {
    icon: '🚚',
    title: 'Fast Delivery',
    description: 'Orders processed quickly, tracked from checkout to doorstep.',
  },
  {
    icon: '💳',
    title: 'Transparent Pricing',
    description: 'The price you see is the price you pay — no hidden charges.',
  },
  {
    icon: '🛡️',
    title: 'Secure Checkout',
    description: 'Your data and orders are handled with care, every time.',
  },
];

const HOW_IT_WORKS = [
  { step: '01', title: 'Browse', description: 'Explore products by category or search.' },
  { step: '02', title: 'Select', description: 'Pick what fits your needs and budget.' },
  { step: '03', title: 'Order', description: 'Place your order in a couple of clicks.' },
  { step: '04', title: 'Receive', description: 'Track it until it reaches your door.' },
];

function Home() {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const isLoggedIn = !!localStorage.getItem('token');
  const username = localStorage.getItem('username');

  const fetchProducts = async () => {
    try {
      const res = await axiosInstance.get('/products');
      setProducts(res.data);
      setError('');
    } catch (err) {
      setError(
        'Products can not be loaded.Due to unavailable Backend services'
      );
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleAddToCart = () => {
    setMessage('Cart feature is not available.');
    setTimeout(() => setMessage(''), 2000);
  };

  const handleBuyNow = async (product) => {
    if (!isLoggedIn) {
      setMessage('First Login,then order is getting placed');
      setTimeout(() => setMessage(''), 2500);
      return;
    }

    try {
      await axiosInstance.post('/orders', {
        productId: product.id,
        quantity: 1,
        username: username,
      });

      setMessage(`"${product.name}" order ho gaya!`);
    } catch (err) {
      setMessage(
        'Order cannot be placed — backend is not available.'
      );
    }

    setTimeout(() => setMessage(''), 3000);
  };

  // Category list: "All" + unique categories from products
  const categories = [
    'All',
    ...new Set(products.map((p) => p.category).filter(Boolean)),
  ];

  const filteredProducts =
    activeCategory === 'All'
      ? products
      : products.filter((p) => p.category === activeCategory);

  // Category showcase (excluding "All"), with a product count each
  const categoryShowcase = categories
    .filter((c) => c !== 'All')
    .map((cat) => ({
      name: cat,
      count: products.filter((p) => p.category === cat).length,
    }));

  return (
    <div className="page">
      <div className="decorative-bg"></div>
      <div className="decorative-ring" style={{ top: '120px', right: '8%' }}></div>
      <div className="soft-glow" style={{ bottom: '100px', left: '5%' }}></div>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <span className="hero-badge">✦ Fresh Collection</span>

          <h1>
            Shop the
            <span> Latest Picks</span>
          </h1>

          <p>
            Discover quality tech products at simple prices.
            Find something you love and get it delivered with ease.
          </p>

          <div className="hero-actions">
            <a href="#products" className="hero-btn">
              Explore Products
            </a>
            <span className="hero-note">Simple. Fast. Reliable.</span>
          </div>
        </div>

        <div className="hero-graphic">
          <video className="hero-video" autoPlay muted loop playsInline>
            <source src="/hero.mp4" type="video/mp4" />
          </video>

          <div className="graphic-card graphic-card-one">
            <span>★</span>
            <div>
              <strong>Quality</strong>
              <small>Products</small>
            </div>
          </div>

          <div className="graphic-card graphic-card-two">
            <span>✓</span>
            <div>
              <strong>Easy</strong>
              <small>Shopping</small>
            </div>
          </div>
        </div>
      </section>

      {error && <p className="error">{error}</p>}
      {message && <p className="toast">{message}</p>}

      {/* CATEGORY SHOWCASE */}
      {categoryShowcase.length > 0 && (
        <section className="category-showcase">
          <div className="section-heading">
            <div>
              <span className="section-label">SHOP BY CATEGORY</span>
              <h2>Browse Categories</h2>
            </div>
          </div>
          <div className="category-showcase__grid">
            {categoryShowcase.map((cat) => (
              <button
                key={cat.name}
                className="category-showcase__card"
                onClick={() => {
                  setActiveCategory(cat.name);
                  document
                    .getElementById('products')
                    .scrollIntoView({ behavior: 'smooth' });
                }}
              >
                <h3>{cat.name}</h3>
                <span>{cat.count} products</span>
              </button>
            ))}
          </div>
        </section>
      )}

      {/* WHY CHOOSE US */}
      <section className="why-choose-us">
        <div className="section-heading">
          <div>
            <span className="section-label">WHY SHOPEASE</span>
            <h2>Why Choose Us</h2>
          </div>
        </div>
        <div className="why-choose-us__grid">
          {WHY_CHOOSE_US.map((item) => (
            <div className="why-choose-us__card" key={item.title}>
              <div className="why-choose-us__icon">{item.icon}</div>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="how-it-works">
        <div className="section-heading">
          <div>
            <span className="section-label">GETTING STARTED</span>
            <h2>How It Works</h2>
          </div>
        </div>
        <div className="how-it-works__grid">
          {HOW_IT_WORKS.map((item, i) => (
            <div className="how-it-works__card" key={item.step}>
              <div className="how-it-works__step">{item.step}</div>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
              {i < HOW_IT_WORKS.length - 1 && (
                <span className="how-it-works__arrow">→</span>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Products */}
      <section id="products">
        <div className="section-heading">
          <div>
            <span className="section-label">OUR COLLECTION</span>
            <h2>Featured Products</h2>
          </div>
          <p>Explore our latest tech products.</p>
        </div>

        {categories.length > 1 && (
          <div className="category-filter-bar">
            {categories.map((cat) => (
              <button
                key={cat}
                className={`category-chip ${activeCategory === cat ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        <div className="product-grid">
          {filteredProducts.map((p) => (
            <div className="product-card" key={p.id}>
              <img
                src={p.imageUrl || PLACEHOLDER_IMAGE}
                alt={p.name}
                className="product-image"
                onError={(e) => {
                  e.target.src = PLACEHOLDER_IMAGE;
                }}
              />

              <div className="product-info">
                {p.category && <span className="category-tag">{p.category}</span>}
                <h3>{p.name}</h3>
                {p.description && <p className="description">{p.description}</p>}
                <p className="price">₹{p.price}</p>

                <div className="product-actions">
                  <button className="btn-outline" onClick={handleAddToCart}>
                    Add to Cart
                  </button>
                  <button className="btn-solid" onClick={() => handleBuyNow(p)}>
                    Buy Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {filteredProducts.length === 0 && !error && (
        <p className="empty-state">Koi products nahi mile abhi.</p>
      )}

      {/* CTA BANNER */}
      <section className="cta-banner">
        <div className="cta-banner__inner">
          <div>
            <h2>Looking for your next gadget?</h2>
            <p>Browse our full collection and find exactly what you need.</p>
          </div>
          <a href="#products" className="hero-btn">
            Shop Now
          </a>
        </div>
      </section>
    </div>
  );
}

export default Home;