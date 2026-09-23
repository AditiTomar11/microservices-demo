import { useEffect, useState } from 'react';
import axiosInstance from '../api/axiosInstance';
import heroVideo from '../utils/hero.mp4';

const PLACEHOLDER_IMAGE =
  'https://via.placeholder.com/300x220?text=Product';

function Home() {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

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

  return (
    <div className="page">
      <div className="decorative-bg"></div>

      <div
        className="decorative-ring"
        style={{ top: '120px', right: '8%' }}
      ></div>

      <div
        className="soft-glow"
        style={{ bottom: '100px', left: '5%' }}
      ></div>
      {/* Hero Section */}
      <section className="hero-section">

        <div className="hero-content">
          <span className="hero-badge">
            ✦ Fresh Collection
          </span>

          <h1>
            Shop the
            <span> Latest Picks</span>
          </h1>

          <p>
            Discover quality products at simple prices.
            Find something you love and get it delivered with ease.
          </p>

          <div className="hero-actions">
            <a href="#products" className="hero-btn">
              Explore Products
            </a>

            <span className="hero-note">
              Simple. Fast. Reliable.
            </span>
          </div>
        </div>

        <div className="hero-graphic">

          <video
            className="hero-video"
            autoPlay
            muted
            loop
            playsInline
          >
            <source src={heroVideo} type="video/mp4" />
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


      {/* Products */}
      <section id="products">
        <div className="section-heading">
          <div>
            <span className="section-label">OUR COLLECTION</span>
            <h2>Featured Products</h2>
          </div>

          <p>Explore our latest products.</p>
        </div>

        <div className="product-grid">
          {products.map((p) => (
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
                <h3>{p.name}</h3>

                <p className="price">
                  ₹{p.price}
                </p>

                <div className="product-actions">
                  <button
                    className="btn-outline"
                    onClick={handleAddToCart}
                  >
                    Add to Cart
                  </button>

                  <button
                    className="btn-solid"
                    onClick={() => handleBuyNow(p)}
                  >
                    Buy Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {products.length === 0 && !error && (
        <p className="empty-state">
          Koi products nahi mile abhi.
        </p>
      )}
    </div>
  );
}

export default Home;
