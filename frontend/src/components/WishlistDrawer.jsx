import { Heart, X, ShoppingCart, Trash2, Zap } from 'lucide-react';

export default function WishlistDrawer({
  isOpen,
  onClose,
  wishlistProducts,
  onRemoveFromWishlist,
  onAddToCart,
  onBuyNow,
}) {
  if (!isOpen) return null;

  return (
    <div className="drawer-overlay" onClick={onClose}>
      <div className="drawer-content 3d-glass-panel" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="drawer-header">
          <div className="drawer-title">
            <Heart size={20} className="text-danger" fill="#ff4757" />
            <h2>Saved Wishlist</h2>
            <span className="drawer-count-tag">{wishlistProducts.length} items</span>
          </div>
          <button className="icon-close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Body Items */}
        <div className="drawer-body">
          {wishlistProducts.length === 0 ? (
            <div className="drawer-empty-state">
              <div className="empty-icon-ring red-ring">
                <Heart size={36} color="#ff4757" />
              </div>
              <h3>Your Wishlist is Empty</h3>
              <p>Click the heart icon on any product card to save it for later!</p>
            </div>
          ) : (
            <div className="wishlist-items-list">
              {wishlistProducts.map((product) => (
                <div key={product.id} className="wishlist-item-card">
                  <img
                    src={
                      product.imageUrl ||
                      'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=300'
                    }
                    alt={product.name}
                    className="wishlist-item-img"
                  />
                  <div className="wishlist-item-info">
                    <h4>{product.name}</h4>
                    <span className="wishlist-item-price">
                      ₹{Number(product.price).toLocaleString('en-IN')}
                    </span>
                    <div className="wishlist-actions">
                      <button
                        className="btn-cyber-outline btn-xs"
                        onClick={() => {
                          onAddToCart(product);
                          onRemoveFromWishlist(product.id);
                        }}
                      >
                        <ShoppingCart size={12} />
                        <span>Move to Cart</span>
                      </button>
                      <button
                        className="btn-cyber-solid btn-xs"
                        onClick={() => {
                          onBuyNow(product);
                        }}
                      >
                        <Zap size={12} />
                        <span>Buy Now</span>
                      </button>
                    </div>
                  </div>
                  <button
                    className="wishlist-remove-btn"
                    title="Remove from Wishlist"
                    onClick={() => onRemoveFromWishlist(product.id)}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
