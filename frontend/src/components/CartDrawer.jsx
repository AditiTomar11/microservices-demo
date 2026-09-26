import { useState } from 'react';
import { X, Trash2, ShoppingBag, ArrowRight, ShieldCheck, Zap } from 'lucide-react';
import axiosInstance from '../api/axiosInstance';

export default function CartDrawer({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onOrderPlaced,
}) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const isLoggedIn = !!localStorage.getItem('token');
  const username = localStorage.getItem('username');

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + (item.product.price || 0) * item.quantity,
    0
  );

  const handleCheckout = async () => {
    if (!isLoggedIn) {
      setMessage({ type: 'error', text: 'Please log in to place your order.' });
      return;
    }

    if (cartItems.length === 0) return;

    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      // Place order for each product in cart
      for (const item of cartItems) {
        await axiosInstance.post('/orders', {
          productId: item.product.id,
          quantity: item.quantity,
          username: username,
        });
      }

      setMessage({ type: 'success', text: '🎉 Orders successfully placed!' });
      onClearCart();
      if (onOrderPlaced) onOrderPlaced();

      setTimeout(() => {
        setMessage({ type: '', text: '' });
        onClose();
      }, 2000);
    } catch (err) {
      setMessage({
        type: 'error',
        text: 'Failed to place order. Backend service might be unavailable.',
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="drawer-overlay" onClick={onClose}>
      <div className="drawer-content glass-panel-3d" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="drawer-header">
          <div className="drawer-title">
            <ShoppingBag size={20} className="text-accent" />
            <h2>Your Shopping Cart</h2>
            <span className="drawer-count-tag">{cartItems.length} items</span>
          </div>
          <button className="icon-close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Message Banner */}
        {message.text && (
          <div className={`drawer-alert ${message.type}`}>
            {message.text}
          </div>
        )}

        {/* Body Items */}
        <div className="drawer-body">
          {cartItems.length === 0 ? (
            <div className="drawer-empty-state">
              <div className="empty-icon-ring">
                <ShoppingBag size={36} color="#5865f2" />
              </div>
              <h3>Your Cart is Empty</h3>
              <p>Explore our high-tech catalog and add your favorite gadgets!</p>
            </div>
          ) : (
            <div className="cart-items-list">
              {cartItems.map((item) => (
                <div key={item.product.id} className="cart-item-card">
                  <img
                    src={
                      item.product.imageUrl ||
                      'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=300'
                    }
                    alt={item.product.name}
                    className="cart-item-img"
                  />
                  <div className="cart-item-info">
                    <h4>{item.product.name}</h4>
                    <span className="cart-item-price">
                      ₹{Number(item.product.price).toLocaleString('en-IN')}
                    </span>
                    <div className="cart-quantity-controls">
                      <button
                        className="qty-btn"
                        onClick={() =>
                          onUpdateQuantity(item.product.id, item.quantity - 1)
                        }
                      >
                        -
                      </button>
                      <span className="qty-value">{item.quantity}</span>
                      <button
                        className="qty-btn"
                        onClick={() =>
                          onUpdateQuantity(item.product.id, item.quantity + 1)
                        }
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <button
                    className="cart-remove-btn"
                    title="Remove item"
                    onClick={() => onRemoveItem(item.product.id)}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {cartItems.length > 0 && (
          <div className="drawer-footer">
            <div className="cart-summary-row">
              <span>Subtotal</span>
              <span className="summary-total-price">
                ₹{totalPrice.toLocaleString('en-IN')}
              </span>
            </div>
            <div className="cart-summary-row muted">
              <span>Shipping</span>
              <span className="text-success">FREE & FAST</span>
            </div>

            <div className="secure-checkout-tag">
              <ShieldCheck size={14} />
              <span>Gateway Encrypted & Microservice Synchronized</span>
            </div>

            <button
              className="btn-cyber-solid checkout-btn full-width"
              onClick={handleCheckout}
              disabled={loading}
            >
              {loading ? (
                <span className="spinner-text">Processing Orders...</span>
              ) : (
                <>
                  <Zap size={16} />
                  <span>Checkout Now (₹{totalPrice.toLocaleString('en-IN')})</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
