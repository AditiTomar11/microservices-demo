import { useState, useRef } from 'react';
import { Heart, ShoppingCart, Zap, Eye, Check } from 'lucide-react';

const PLACEHOLDER_IMAGE =
  'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=600&auto=format&fit=crop&q=80';

export default function Product3DCard({
  product,
  onAddToCart,
  onBuyNow,
  onToggleWishlist,
  isWishlisted,
  onQuickView,
}) {
  const cardRef = useRef(null);
  const [style, setStyle] = useState({});
  const [shineStyle, setShineStyle] = useState({});
  const [copied, setCopied] = useState(false);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -12; // tilt max 12deg
    const rotateY = ((x - centerX) / centerX) * 12;

    setStyle({
      transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`,
      transition: 'transform 0.1s ease-out',
    });

    const shineX = (x / rect.width) * 100;
    const shineY = (y / rect.height) * 100;
    setShineStyle({
      background: `radial-gradient(circle at ${shineX}% ${shineY}%, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0) 80%)`,
      opacity: 1,
    });
  };

  const handleMouseLeave = () => {
    setStyle({
      transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)',
      transition: 'transform 0.5s ease-out',
    });
    setShineStyle({
      opacity: 0,
      transition: 'opacity 0.5s ease-out',
    });
  };

  return (
    <div
      ref={cardRef}
      className="product-3d-card"
      style={style}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Specular Holographic Shine Overlay */}
      <div className="card-shine" style={shineStyle} />

      {/* Futuristic Corner Accents */}
      <div className="card-corner top-left" />
      <div className="card-corner top-right" />
      <div className="card-corner bottom-left" />
      <div className="card-corner bottom-right" />

      {/* Top Bar: Wishlist & Quick View */}
      <div className="card-top-actions">
        {product.category && (
          <span className="cyber-pill-tag">
            {product.category}
          </span>
        )}
        <div className="action-buttons-group">
          <button
            className="icon-glass-btn"
            title="Quick View"
            onClick={() => onQuickView(product)}
          >
            <Eye size={15} />
          </button>
          <button
            className={`icon-glass-btn wishlist-btn-3d ${isWishlisted ? 'active' : ''}`}
            title={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
            onClick={() => onToggleWishlist(product.id)}
          >
            <Heart size={15} fill={isWishlisted ? '#ff4757' : 'none'} color={isWishlisted ? '#ff4757' : '#e6e6e6'} />
          </button>
        </div>
      </div>

      {/* Product Image Container */}
      <div className="product-image-frame" onClick={() => onQuickView(product)}>
        <img
          src={product.imageUrl || PLACEHOLDER_IMAGE}
          alt={product.name}
          className="product-3d-img"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = PLACEHOLDER_IMAGE;
          }}
        />
        <div className="image-overlay-glow" />
      </div>

      {/* Product Details */}
      <div className="product-3d-content">
        <h3 className="product-3d-title" title={product.name} onClick={() => onQuickView(product)}>
          {product.name}
        </h3>

        {product.description && (
          <p className="product-3d-desc">
            {product.description}
          </p>
        )}

        <div className="product-3d-price-row">
          <div className="price-tag-3d">
            <span className="currency-symbol">₹</span>
            <span className="price-value">{Number(product.price).toLocaleString('en-IN')}</span>
          </div>

          <div className="stock-badge">
            <span className="live-dot" />
            IN STOCK
          </div>
        </div>

        {/* Action Buttons */}
        <div className="product-3d-actions">
          <button
            className="btn-cyber-outline"
            onClick={() => onAddToCart(product)}
          >
            <ShoppingCart size={14} />
            <span>Cart</span>
          </button>

          <button
            className="btn-cyber-solid"
            onClick={() => onBuyNow(product)}
          >
            <Zap size={14} />
            <span>Buy Now</span>
          </button>
        </div>
      </div>
    </div>
  );
}
