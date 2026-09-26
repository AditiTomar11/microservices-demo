import { useEffect, useState, useMemo } from 'react';
import axiosInstance from '../api/axiosInstance';
import Product3DCard from '../components/Product3DCard';
import ThreeCanvas from '../components/ThreeCanvas';
import { Search, SlidersHorizontal, ArrowDownUp, Heart, Cpu, ShieldCheck, Zap, Truck, Layers, ArrowRight, Laptop, Smartphone, Tablet, Watch, Headphones } from 'lucide-react';

const WHY_CHOOSE_US = [
  {
    icon: <Cpu className="text-accent" size={24} />,
    title: 'Verified Hardware Specs',
    description: 'Every gadget (Laptop, Mobile, Tablet, Watch) is listed with authentic manufacturer benchmarks.',
  },
  {
    icon: <Zap className="text-accent" size={24} />,
    title: 'Smart Order Merging',
    description: 'Our backend order-service automatically consolidates repeat PENDING orders.',
  },
  {
    icon: <ShieldCheck className="text-accent" size={24} />,
    title: 'JWT Stateless Protection',
    description: 'Stateless Bearer tokens passed seamlessly across Spring Gateway and Feign clients.',
  },
  {
    icon: <Truck className="text-accent" size={24} />,
    title: 'Express Tech Dispatch',
    description: 'Orders routed through reactive API Gateway directly to fulfillment.',
  },
];

const HOW_IT_WORKS = [
  { step: '01', title: 'Browse Tech Gadgets', description: 'Filter by Laptop, Mobile, Tablet, or Smartwatch categories in real-time.' },
  { step: '02', title: 'Gateway Routing', description: 'API Gateway (Port 8080) validates request headers & proxies route.' },
  { step: '03', title: 'Feign Product Lookup', description: 'Order-service retrieves live product details via OpenFeign client.' },
  { step: '04', title: 'Instant Order Merge', description: 'Existing PENDING orders are incremented automatically without row duplication.' },
];

function Home({
  cartItems,
  wishlistIds,
  onAddToCart,
  onBuyNow,
  onToggleWishlist,
  onQuickView,
  onProductsLoaded,
}) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [maxPrice, setMaxPrice] = useState(500000);
  const [sortBy, setSortBy] = useState('default');
  const [showWishlistOnly, setShowWishlistOnly] = useState(false);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get('/products');
      const data = Array.isArray(res.data) ? res.data : [];
      setProducts(data);
      if (onProductsLoaded) onProductsLoaded(data);

      if (data.length > 0) {
        const highest = Math.max(...data.map((p) => p.price || 0));
        setMaxPrice(highest > 0 ? highest : 500000);
      }
      setError('');
    } catch (err) {
      setError('Backend microservices currently unreachable. Verify API Gateway and Eureka status.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const categories = useMemo(() => {
    const set = new Set(products.map((p) => p.category).filter(Boolean));
    return ['All', ...Array.from(set)];
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        const matchesSearch =
          !searchQuery ||
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase()));

        const matchesCategory =
          activeCategory === 'All' || p.category === activeCategory;

        const matchesPrice = (p.price || 0) <= maxPrice;

        const matchesWishlist = !showWishlistOnly || wishlistIds.includes(p.id);

        return matchesSearch && matchesCategory && matchesPrice && matchesWishlist;
      })
      .sort((a, b) => {
        if (sortBy === 'price-low') return (a.price || 0) - (b.price || 0);
        if (sortBy === 'price-high') return (b.price || 0) - (a.price || 0);
        if (sortBy === 'name-az') return a.name.localeCompare(b.name);
        return 0;
      });
  }, [products, searchQuery, activeCategory, maxPrice, sortBy, showWishlistOnly, wishlistIds]);

  const categoryShowcase = useMemo(() => {
    return categories
      .filter((c) => c !== 'All')
      .map((cat) => {
        let IconComponent = Cpu;
        const catLower = cat.toLowerCase();
        if (catLower.includes('laptop') || catLower.includes('computer')) IconComponent = Laptop;
        else if (catLower.includes('mobile') || catLower.includes('phone')) IconComponent = Smartphone;
        else if (catLower.includes('tablet') || catLower.includes('pad')) IconComponent = Tablet;
        else if (catLower.includes('watch') || catLower.includes('wearable')) IconComponent = Watch;
        else if (catLower.includes('audio') || catLower.includes('headphone')) IconComponent = Headphones;

        return {
          name: cat,
          count: products.filter((p) => p.category === cat).length,
          Icon: IconComponent,
        };
      });
  }, [categories, products]);

  return (
    <div className="home-page-container">
      {/* Hero Section */}
      <section className="hero-section-3d">
        <ThreeCanvas variant="hero" />

        <div className="hero-content-3d">
          <div className="hero-badge-pill">
            <span className="live-dot" />
            <span>AUTHENTIC TECH & GADGETS SHOWCASE</span>
          </div>

          <h1 className="hero-title-3d">
            Next-Gen Hardware. <br />
            <span className="text-gradient-3d">Verified Specs & Value.</span>
          </h1>

          <p className="hero-subtext-3d">
            Discover laptops, smartphones, tablets, and smartwatches backed by
            reactive Spring Boot microservice architecture.
          </p>

          {/* Search Box */}
          <div className="hero-search-box-3d glass-panel-3d">
            <Search className="search-icon" size={18} />
            <input
              type="text"
              placeholder="Search Laptops, Smartphones, Tablets, Watches..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button className="clear-search-btn" onClick={() => setSearchQuery('')}>
                Clear
              </button>
            )}
          </div>

          <div className="hero-actions-3d">
            <a href="#products" className="btn-cyber-solid lg-btn">
              <span>Explore Tech Catalog</span>
              <ArrowRight size={16} />
            </a>
            <a href="/about" className="btn-cyber-outline lg-btn">
              <span>Architecture Specs</span>
            </a>
          </div>
        </div>

        <div className="hero-media-3d">
          <div className="video-card-3d glass-panel-3d">
            <video className="hero-video-player" autoPlay muted loop playsInline>
              <source src="/hero.mp4" type="video/mp4" />
            </video>
          </div>

          <div className="floating-hud-card hud-top-right glass-panel-3d">
            <div className="hud-icon"><Zap size={16} color="#4f46e5" /></div>
            <div>
              <strong>Order Consolidation</strong>
              <small>Duplicate PENDING orders merged</small>
            </div>
          </div>

          <div className="floating-hud-card hud-bottom-left glass-panel-3d">
            <div className="hud-icon"><ShieldCheck size={16} color="#10b981" /></div>
            <div>
              <strong>JWT Auth Secured</strong>
              <small>Spring Cloud Gateway Interceptor</small>
            </div>
          </div>
        </div>
      </section>

      {/* Main Product Catalog */}
      <section id="products" className="catalog-section-3d">
        <div className="section-header-3d">
          <div>
            <span className="section-cyber-tag">HARDWARE SHOWCASE</span>
            <h2 className="section-title-3d">Gadgets & Tech Products</h2>
          </div>
          <p className="section-subtext">Live catalog fetched from product-service via Gateway</p>
        </div>

        {/* Filter Bar */}
        <div className="controls-bar-3d glass-panel-3d">
          <div className="category-filter-chips">
            {categories.map((cat) => (
              <button
                key={cat}
                className={`category-chip-3d ${activeCategory === cat ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
                {cat !== 'All' && (
                  <span className="chip-count">
                    ({products.filter((p) => p.category === cat).length})
                  </span>
                )}
              </button>
            ))}
          </div>

          <div className="controls-inputs-row">
            {/* Price Slider */}
            <div className="price-slider-group">
              <label>
                <SlidersHorizontal size={14} />
                <span>Max Price: ₹{maxPrice.toLocaleString('en-IN')}</span>
              </label>
              <input
                type="range"
                min="0"
                max={
                  products.length > 0
                    ? Math.max(...products.map((p) => p.price || 0))
                    : 500000
                }
                step="500"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
              />
            </div>

            {/* Sort */}
            <div className="sort-dropdown-group">
              <ArrowDownUp size={14} className="dropdown-icon" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="cyber-select"
              >
                <option value="default">Sort: Recommended</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="name-az">Name: A to Z</option>
              </select>
            </div>

            {/* Wishlist Toggle */}
            <button
              className={`wishlist-filter-btn ${showWishlistOnly ? 'active' : ''}`}
              onClick={() => setShowWishlistOnly(!showWishlistOnly)}
            >
              <Heart size={14} fill={showWishlistOnly ? '#ef4444' : 'none'} color={showWishlistOnly ? '#ef4444' : '#64748b'} />
              <span>Wishlist Only ({wishlistIds.length})</span>
            </button>
          </div>
        </div>

        {error && (
          <div className="auth-alert-banner error">
            <p>{error}</p>
          </div>
        )}

        {loading && (
          <div className="drawer-empty-state">
            <div className="cyber-spinner" />
            <p>Retrieving Gadget Catalog...</p>
          </div>
        )}

        {/* Product Grid */}
        {!loading && filteredProducts.length > 0 && (
          <div className="product-grid-3d">
            {filteredProducts.map((product) => (
              <Product3DCard
                key={product.id}
                product={product}
                onAddToCart={onAddToCart}
                onBuyNow={onBuyNow}
                onToggleWishlist={onToggleWishlist}
                isWishlisted={wishlistIds.includes(product.id)}
                onQuickView={onQuickView}
              />
            ))}
          </div>
        )}

        {!loading && filteredProducts.length === 0 && !error && (
          <div className="drawer-empty-state glass-panel-3d">
            <Layers size={40} className="text-accent" />
            <h3>No Gadgets Match Your Filter</h3>
            <p>Try resetting filters or adjusting the price slider.</p>
            <button
              className="btn-cyber-outline"
              onClick={() => {
                setSearchQuery('');
                setActiveCategory('All');
                setShowWishlistOnly(false);
                if (products.length > 0) {
                  setMaxPrice(Math.max(...products.map((p) => p.price || 0)));
                }
              }}
            >
              Reset Filters
            </button>
          </div>
        )}
      </section>

      {/* Gadget Categories Showcase */}
      {categoryShowcase.length > 0 && (
        <section className="category-showcase-section">
          <div className="section-header-3d">
            <div>
              <span className="section-cyber-tag">CATEGORIES</span>
              <h2 className="section-title-3d">Shop By Hardware Category</h2>
            </div>
          </div>

          <div className="category-showcase-grid">
            {categoryShowcase.map(({ name, count, Icon }) => (
              <div
                key={name}
                className="category-showcase-card glass-panel-3d"
                onClick={() => {
                  setActiveCategory(name);
                  document
                    .getElementById('products')
                    ?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                <div className="why-icon-box">
                  <Icon size={22} className="text-accent" />
                </div>
                <div className="category-card-header">
                  <h3>{name}</h3>
                  <span className="category-count-badge">{count} Items</span>
                </div>
                <p>High performance {name.toLowerCase()} technology.</p>
                <span className="category-arrow-link">
                  Browse {name} <ArrowRight size={14} />
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Why Choose Us */}
      <section className="why-choose-us-section">
        <div className="section-header-3d">
          <div>
            <span className="section-cyber-tag">SHOWCASE STANDARDS</span>
            <h2 className="section-title-3d">Why ShopEase Tech</h2>
          </div>
        </div>

        <div className="why-choose-us-grid">
          {WHY_CHOOSE_US.map((item, idx) => (
            <div key={idx} className="why-card-3d glass-panel-3d">
              <div className="why-icon-box">{item.icon}</div>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="how-it-works-section">
        <div className="section-header-3d">
          <div>
            <span className="section-cyber-tag">BACKEND PIPELINE</span>
            <h2 className="section-title-3d">How Microservices Process Your Order</h2>
          </div>
        </div>

        <div className="how-it-works-grid">
          {HOW_IT_WORKS.map((item) => (
            <div key={item.step} className="how-card-3d glass-panel-3d">
              <div className="step-number-badge">{item.step}</div>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="cta-banner-3d">
        <div className="cta-banner-inner glass-panel-3d">
          <div className="cta-banner-content">
            <h2>Ready to Upgrade Your Workspace Setup?</h2>
            <p>Browse authentic Laptops, Smartphones, Tablets & Smartwatches with instant order dispatch.</p>
          </div>
          <a href="#products" className="btn-cyber-solid lg-btn">
            <span>Explore Catalog</span>
            <ArrowRight size={16} />
          </a>
        </div>
      </section>
    </div>
  );
}

export default Home;
