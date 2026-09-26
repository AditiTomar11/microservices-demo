import { useEffect, useState, useMemo } from 'react';
import axiosInstance from '../api/axiosInstance';
import Product3DCard from '../components/Product3DCard';
import ThreeCanvas from '../components/ThreeCanvas';
import { Search, SlidersHorizontal, ArrowDownUp, Heart, Cpu, ShieldCheck, Zap, Truck, Layers, ArrowRight } from 'lucide-react';

const WHY_CHOOSE_US = [
  {
    icon: <Cpu className="text-accent" size={24} />,
    title: 'Verified Specs',
    description: 'Every tech listing is verified with exact hardware parameters & genuine prices.',
  },
  {
    icon: <Zap className="text-accent" size={24} />,
    title: 'Smart Order Merging',
    description: 'Backend order-service automatically merges duplicate pending requests.',
  },
  {
    icon: <ShieldCheck className="text-accent" size={24} />,
    title: 'JWT Encrypted',
    description: 'Stateless JWT auth integrated seamlessly across microservice gateways.',
  },
  {
    icon: <Truck className="text-accent" size={24} />,
    title: 'Express Dispatch',
    description: 'Tracked from OpenFeign internal routing directly to final delivery.',
  },
];

const HOW_IT_WORKS = [
  { step: '01', title: 'Browse Products', description: 'Search and filter across live categories with 3D previews.' },
  { step: '02', title: 'Gateway Routing', description: 'Requests route via Reactive API Gateway (Port 8080).' },
  { step: '03', title: 'Feign Order Call', description: 'Order-service retrieves product details via OpenFeign client.' },
  { step: '04', title: 'Instant Confirmation', description: 'Receive real-time order status updates and tracking.' },
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

  // Filters state
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

      // Find highest product price to set slider max
      if (data.length > 0) {
        const highest = Math.max(...data.map((p) => p.price || 0));
        setMaxPrice(highest > 0 ? highest : 500000);
      }
      setError('');
    } catch (err) {
      setError('Backend microservices currently unreachable. Check Eureka / Gateway connection.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Filter & Sort Logic
  const categories = useMemo(() => {
    const set = new Set(products.map((p) => p.category).filter(Boolean));
    return ['All', ...Array.from(set)];
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        // Search Filter
        const matchesSearch =
          !searchQuery ||
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase()));

        // Category Filter
        const matchesCategory =
          activeCategory === 'All' || p.category === activeCategory;

        // Price Filter
        const matchesPrice = (p.price || 0) <= maxPrice;

        // Wishlist Filter
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
      .map((cat) => ({
        name: cat,
        count: products.filter((p) => p.category === cat).length,
      }));
  }, [categories, products]);

  return (
    <div className="home-page-container">
      {/* Hero Section */}
      <section className="hero-section-3d">
        <ThreeCanvas variant="hero" />

        <div className="hero-content-3d">
          <div className="hero-badge-pill">
            <span className="live-dot" />
            <span>✦ NEXT-GEN TECH E-COMMERCE</span>
          </div>

          <h1 className="hero-title-3d">
            Shop the Future of <br />
            <span className="text-gradient-3d">Smart Technology</span>
          </h1>

          <p className="hero-subtext-3d">
            Explore authentic hardware, high-end electronics, and verified specs
            powered by reactive microservices architecture.
          </p>

          {/* Hero Search Bar */}
          <div className="hero-search-box-3d glass-panel-3d">
            <Search className="search-icon" size={18} />
            <input
              type="text"
              placeholder="Search laptops, smartphones, accessories..."
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
              <span>Explore Catalog</span>
              <ArrowRight size={16} />
            </a>
            <a href="/about" className="btn-cyber-outline lg-btn">
              <span>System Specs</span>
            </a>
          </div>
        </div>

        <div className="hero-media-3d">
          <div className="video-card-3d glass-panel-3d">
            <video className="hero-video-player" autoPlay muted loop playsInline>
              <source src="/hero.mp4" type="video/mp4" />
            </video>
            <div className="video-overlay-shine" />
          </div>

          <div className="floating-hud-card hud-top-right glass-panel-3d">
            <div className="hud-icon"><Zap size={16} color="#00f2fe" /></div>
            <div>
              <strong>Order Merging</strong>
              <small>Auto-consolidated PENDING status</small>
            </div>
          </div>

          <div className="floating-hud-card hud-bottom-left glass-panel-3d">
            <div className="hud-icon"><ShieldCheck size={16} color="#5865f2" /></div>
            <div>
              <strong>JWT Authenticated</strong>
              <small>Bearer Gateway Routing</small>
            </div>
          </div>
        </div>
      </section>

      {/* Main Catalog Section */}
      <section id="products" className="catalog-section-3d">
        <div className="section-header-3d">
          <div>
            <span className="section-cyber-tag">HARDWARE CATALOG</span>
            <h2 className="section-title-3d">Featured Tech Products</h2>
          </div>
          <p className="section-subtext">Filtered real-time via API Gateway route endpoint</p>
        </div>

        {/* Filter Controls Bar */}
        <div className="controls-bar-3d glass-panel-3d">
          {/* Category Filter Chips */}
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

          {/* Controls Row */}
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

            {/* Sort Dropdown */}
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

            {/* Wishlist Toggle Button */}
            <button
              className={`wishlist-filter-btn ${showWishlistOnly ? 'active' : ''}`}
              onClick={() => setShowWishlistOnly(!showWishlistOnly)}
            >
              <Heart size={14} fill={showWishlistOnly ? '#ff4757' : 'none'} color={showWishlistOnly ? '#ff4757' : '#cfd3e6'} />
              <span>Wishlist Only ({wishlistIds.length})</span>
            </button>
          </div>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="error-banner-3d">
            <p>{error}</p>
          </div>
        )}

        {/* Loading Spinner */}
        {loading && (
          <div className="loading-state-3d">
            <div className="cyber-spinner" />
            <p>Fetching Products from Product-Service...</p>
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

        {/* Empty State */}
        {!loading && filteredProducts.length === 0 && !error && (
          <div className="empty-catalog-box glass-panel-3d">
            <Layers size={40} className="text-accent" />
            <h3>No Products Found</h3>
            <p>Try resetting filters, searching for a different keyword, or adjusting the price range.</p>
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
              Reset All Filters
            </button>
          </div>
        )}
      </section>

      {/* Category Showcase Section */}
      {categoryShowcase.length > 0 && (
        <section className="category-showcase-section">
          <div className="section-header-3d">
            <div>
              <span className="section-cyber-tag">EXPLORE CATEGORIES</span>
              <h2 className="section-title-3d">Browse Tech Categories</h2>
            </div>
          </div>

          <div className="category-showcase-grid">
            {categoryShowcase.map((cat) => (
              <div
                key={cat.name}
                className="category-showcase-card glass-panel-3d"
                onClick={() => {
                  setActiveCategory(cat.name);
                  document
                    .getElementById('products')
                    ?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                <div className="category-card-header">
                  <h3>{cat.name}</h3>
                  <span className="category-count-badge">{cat.count} Items</span>
                </div>
                <p>High performance {cat.name.toLowerCase()} technology.</p>
                <span className="category-arrow-link">
                  Browse Category <ArrowRight size={14} />
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
            <span className="section-cyber-tag">PLATFORM ADVANTAGES</span>
            <h2 className="section-title-3d">Why Choose ShopEase</h2>
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
            <span className="section-cyber-tag">SYSTEM ARCHITECTURE</span>
            <h2 className="section-title-3d">How The Platform Works</h2>
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
            <h2>Ready to Upgrade Your Tech Setup?</h2>
            <p>Explore our full collection of verified hardware with instant order merging.</p>
          </div>
          <a href="#products" className="btn-cyber-solid lg-btn">
            <span>Shop Now</span>
            <ArrowRight size={16} />
          </a>
        </div>
      </section>
    </div>
  );
}

export default Home;
