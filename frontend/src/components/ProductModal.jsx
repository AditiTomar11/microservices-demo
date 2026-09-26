import { useState } from 'react';
import { X, ShoppingCart, Zap, Heart, ShieldCheck, Truck, RefreshCw } from 'lucide-react';

const PLACEHOLDER_IMAGE =
  'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=600&auto=format&fit=crop&q=80';

export default function ProductModal({
  product,
  onClose,
  onAddToCart,
  onBuyNow,
  isWishlisted,
  onToggleWishlist,
}) {
  const [quantity, setQuantity] = useState(1);

  if (!product) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="product-modal-card glass-panel-3d"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="icon-close-btn modal-close-btn" onClick={onClose}>
          <X size={20} />
        </button>

        <div className="product-modal-grid">
          {/* Left Column: Image */}
          <div className="product-modal-media">
            <div className="modal-img-container">
              <img
                src={product.imageUrl || PLACEHOLDER_IMAGE}
                alt={product.name}
                className="modal-product-img"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = PLACEHOLDER_IMAGE;
                }}
              />
              <button
                className={`modal-wishlist-btn ${isWishlisted ? 'active' : ''}`}
                onClick={() => onToggleWishlist(product.id)}
              >
                <Heart size={18} fill={isWishlisted ? '#ff4757' : 'none'} color={isWishlisted ? '#ff4757' : '#ffffff'} />
              </button>
            </div>
          </div>

          {/* Right Column: Info */}
          <div className="product-modal-details">
            {product.category && (
              <span className="cyber-pill-tag lg">{product.category}</span>
            )}

            <h2 className="product-modal-title">{product.name}</h2>

            <div className="product-modal-price-row">
              <div className="price-tag-3d modal-price">
                <span className="currency-symbol">₹</span>
                <span className="price-value">
                  {Number(product.price).toLocaleString('en-IN')}
                </span>
              </div>
              <span className="tax-inclusive-text">Inclusive of all taxes</span>
            </div>

            <div className="product-modal-desc-box">
              <h4>Product Overview</h4>
              <p>{product.description || 'High quality tech product verified with authentic specifications and genuine performance.'}</p>
            </div>

            {/* Feature highlights */}
            <div className="product-features-grid">
              <div className="feature-item">
                <Truck size={16} className="text-accent" />
                <div>
                  <strong>Express Shipping</strong>
                  <small>Dispatched within 24 Hours</small>
                </div>
              </div>
              <div className="feature-item">
                <ShieldCheck size={16} className="text-accent" />
                <div>
                  <strong>Official Warranty</strong>
                  <small>1 Year Brand Guarantee</small>
                </div>
              </div>
              <div className="feature-item">
                <RefreshCw size={16} className="text-accent" />
                <div>
                  <strong>Simple Returns</strong>
                  <small>7 Days Hassle-Free Replacement</small>
                </div>
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="quantity-selection-row">
              <label>Select Quantity:</label>
              <div className="cart-quantity-controls lg">
                <button
                  className="qty-btn"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  -
                </button>
                <span className="qty-value">{quantity}</span>
                <button
                  className="qty-btn"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  +
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="product-modal-actions">
              <button
                className="btn-cyber-outline full-width lg-btn"
                onClick={() => {
                  onAddToCart(product, quantity);
                  onClose();
                }}
              >
                <ShoppingCart size={18} />
                <span>Add to Cart</span>
              </button>

              <button
                className="btn-cyber-solid full-width lg-btn"
                onClick={() => {
                  onBuyNow(product, quantity);
                  onClose();
                }}
              >
                <Zap size={18} />
                <span>Buy Now</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
