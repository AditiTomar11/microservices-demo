import { useEffect, useState, useMemo } from 'react';
import { Navigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import { Shield, Plus, Edit3, Trash2, Package, ShoppingBag, DollarSign, Search, RefreshCw, Layers, CheckCircle2, AlertCircle } from 'lucide-react';

export default function AdminPanel() {
  const role = localStorage.getItem('role');

  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Form State
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [editingId, setEditingId] = useState(null);

  // Search Filter state
  const [productSearch, setProductSearch] = useState('');
  const [orderSearch, setOrderSearch] = useState('');
  const [activeTab, setActiveTab] = useState('products'); // 'products' | 'orders'

  const fetchProducts = async () => {
    setLoadingProducts(true);
    try {
      const res = await axiosInstance.get('/products');
      setProducts(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      setError('Failed to fetch products from backend service.');
    } finally {
      setLoadingProducts(false);
    }
  };

  const fetchOrders = async () => {
    setLoadingOrders(true);
    try {
      const res = await axiosInstance.get('/orders');
      setOrders(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      setError('Failed to fetch orders from backend service.');
    } finally {
      setLoadingOrders(false);
    }
  };

  useEffect(() => {
    if (role === 'ADMIN') {
      fetchProducts();
      fetchOrders();
    }
  }, [role]);

  const resetForm = () => {
    setName('');
    setPrice('');
    setImageUrl('');
    setCategory('');
    setDescription('');
    setEditingId(null);
  };

  const showNotification = (msg, isSuccess = true) => {
    if (isSuccess) {
      setSuccess(msg);
      setTimeout(() => setSuccess(''), 3000);
    } else {
      setError(msg);
      setTimeout(() => setError(''), 3500);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      name,
      price: parseFloat(price),
      imageUrl,
      category,
      description,
    };

    try {
      if (editingId) {
        await axiosInstance.put(`/products/${editingId}`, payload);
        showNotification('Product updated successfully!');
      } else {
        await axiosInstance.post('/products', payload);
        showNotification('New product created successfully!');
      }
      resetForm();
      fetchProducts();
    } catch (err) {
      showNotification('Error saving product. Check backend service status.', false);
    }
  };

  const handleEdit = (product) => {
    setEditingId(product.id);
    setName(product.name);
    setPrice(product.price);
    setImageUrl(product.imageUrl || '');
    setCategory(product.category || '');
    setDescription(product.description || '');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await axiosInstance.delete(`/products/${id}`);
      showNotification('Product deleted.');
      fetchProducts();
    } catch (err) {
      showNotification('Could not delete product.', false);
    }
  };

  const handleDeleteOrder = async (id) => {
    if (!window.confirm('Are you sure you want to delete this order?')) return;
    try {
      await axiosInstance.delete(`/orders/${id}`);
      showNotification('Order deleted.');
      fetchOrders();
    } catch (err) {
      showNotification('Could not delete order.', false);
    }
  };

  // Status Change via PUT /orders/{id}
  const handleUpdateOrderStatus = async (order, newStatus) => {
    try {
      await axiosInstance.put(`/orders/${order.id}`, {
        ...order,
        status: newStatus,
      });
      showNotification(`Order #${order.id} status changed to ${newStatus}`);
      fetchOrders();
    } catch (err) {
      showNotification('Could not update order status.', false);
    }
  };

  // Metrics
  const totalRevenue = useMemo(() => {
    return orders.reduce((sum, o) => {
      const match = products.find((p) => p.id === o.productId);
      const unitPrice = match ? match.price : 0;
      return sum + unitPrice * (o.quantity || 1);
    }, 0);
  }, [orders, products]);

  const pendingOrdersCount = useMemo(() => {
    return orders.filter((o) => (o.status || 'PENDING').toUpperCase() === 'PENDING').length;
  }, [orders]);

  const filteredProducts = useMemo(() => {
    if (!productSearch) return products;
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
        (p.category && p.category.toLowerCase().includes(productSearch.toLowerCase()))
    );
  }, [products, productSearch]);

  const filteredOrders = useMemo(() => {
    if (!orderSearch) return orders;
    return orders.filter(
      (o) =>
        (o.productName && o.productName.toLowerCase().includes(orderSearch.toLowerCase())) ||
        (o.username && o.username.toLowerCase().includes(orderSearch.toLowerCase())) ||
        String(o.id).includes(orderSearch)
    );
  }, [orders, orderSearch]);

  if (role !== 'ADMIN') {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="admin-page-container">
      {/* Header */}
      <div className="admin-header-3d glass-panel-3d">
        <div className="admin-title-box">
          <div className="admin-shield-icon">
            <Shield size={24} />
          </div>
          <div>
            <h2>Admin Command Center</h2>
            <p>Manage product catalog, inventory, and microservice orders</p>
          </div>
        </div>

        <button
          className="btn-cyber-outline btn-sm"
          onClick={() => {
            fetchProducts();
            fetchOrders();
          }}
        >
          <RefreshCw size={14} />
          <span>Sync Backend</span>
        </button>
      </div>

      {/* Notifications */}
      {success && (
        <div className="admin-notification success">
          <CheckCircle2 size={18} />
          <span>{success}</span>
        </div>
      )}

      {error && (
        <div className="admin-notification error">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {/* Top HUD Metrics */}
      <div className="admin-metrics-grid">
        <div className="metric-card-3d glass-panel-3d">
          <div className="metric-icon blue"><Package size={22} /></div>
          <div>
            <span className="metric-label">Total Catalog Products</span>
            <h3 className="metric-value">{products.length}</h3>
          </div>
        </div>

        <div className="metric-card-3d glass-panel-3d">
          <div className="metric-icon purple"><ShoppingBag size={22} /></div>
          <div>
            <span className="metric-label">Total System Orders</span>
            <h3 className="metric-value">{orders.length}</h3>
          </div>
        </div>

        <div className="metric-card-3d glass-panel-3d">
          <div className="metric-icon cyan"><DollarSign size={22} /></div>
          <div>
            <span className="metric-label">Estimated Order Value</span>
            <h3 className="metric-value">₹{totalRevenue.toLocaleString('en-IN')}</h3>
          </div>
        </div>

        <div className="metric-card-3d glass-panel-3d">
          <div className="metric-icon orange"><Layers size={22} /></div>
          <div>
            <span className="metric-label">Pending Orders</span>
            <h3 className="metric-value">{pendingOrdersCount}</h3>
          </div>
        </div>
      </div>

      {/* Product Form Section */}
      <div className="admin-form-section-3d glass-panel-3d">
        <div className="form-header-row">
          <h3>
            {editingId ? <Edit3 size={18} className="text-accent" /> : <Plus size={18} className="text-accent" />}
            <span>{editingId ? `Editing Product #${editingId}` : 'Add New Hardware Product'}</span>
          </h3>
          {editingId && (
            <button className="btn-cyber-outline btn-xs" onClick={resetForm}>
              Cancel Edit
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="admin-product-form">
          <div className="form-inputs-grid">
            <div className="form-input-group">
              <label>Product Name *</label>
              <input
                type="text"
                placeholder="e.g. UltraBook Pro M3"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="form-input-group">
              <label>Price (₹) *</label>
              <input
                type="number"
                step="0.01"
                placeholder="e.g. 89999"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
              />
            </div>

            <div className="form-input-group">
              <label>Category *</label>
              <input
                type="text"
                placeholder="e.g. Laptop, Mobile, Audio"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
              />
            </div>

            <div className="form-input-group">
              <label>Image URL (Optional)</label>
              <input
                type="text"
                placeholder="https://images.unsplash.com/..."
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
              />
            </div>

            <div className="form-input-group full-span">
              <label>Full Specification / Description *</label>
              <textarea
                placeholder="Detailed hardware specifications and description..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                required
              />
            </div>
          </div>

          <div className="form-actions-bar">
            <button type="submit" className="btn-cyber-solid">
              {editingId ? 'Update Product' : 'Add Product to Catalog'}
            </button>
          </div>
        </form>
      </div>

      {/* Tabs Switcher */}
      <div className="admin-tabs-nav">
        <button
          className={`admin-tab-btn ${activeTab === 'products' ? 'active' : ''}`}
          onClick={() => setActiveTab('products')}
        >
          <Package size={16} />
          <span>Products Management ({products.length})</span>
        </button>

        <button
          className={`admin-tab-btn ${activeTab === 'orders' ? 'active' : ''}`}
          onClick={() => setActiveTab('orders')}
        >
          <ShoppingBag size={16} />
          <span>Orders Management ({orders.length})</span>
        </button>
      </div>

      {/* TAB 1: PRODUCTS TABLE */}
      {activeTab === 'products' && (
        <div className="admin-table-container glass-panel-3d">
          <div className="table-top-bar">
            <div className="table-search-box">
              <Search size={16} className="search-icon" />
              <input
                type="text"
                placeholder="Filter products..."
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
              />
            </div>
          </div>

          {loadingProducts ? (
            <div className="table-loading-box">Loading Products...</div>
          ) : (
            <div className="responsive-table-wrapper">
              <table className="cyber-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Image</th>
                    <th>Name</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((p) => (
                    <tr key={p.id}>
                      <td className="id-cell">#{p.id}</td>
                      <td>
                        <img
                          src={
                            p.imageUrl ||
                            'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=100'
                          }
                          alt={p.name}
                          className="table-thumb-img"
                        />
                      </td>
                      <td className="name-cell">
                        <strong>{p.name}</strong>
                        <p className="table-desc-preview">{p.description}</p>
                      </td>
                      <td>
                        <span className="cyber-pill-tag sm">{p.category}</span>
                      </td>
                      <td className="price-cell">₹{Number(p.price).toLocaleString('en-IN')}</td>
                      <td className="actions-cell">
                        <button
                          className="btn-action edit"
                          onClick={() => handleEdit(p)}
                          title="Edit Product"
                        >
                          <Edit3 size={14} />
                          <span>Edit</span>
                        </button>
                        <button
                          className="btn-action delete"
                          onClick={() => handleDeleteProduct(p.id)}
                          title="Delete Product"
                        >
                          <Trash2 size={14} />
                          <span>Delete</span>
                        </button>
                      </td>
                    </tr>
                  ))}

                  {filteredProducts.length === 0 && (
                    <tr>
                      <td colSpan={6} className="empty-table-cell">
                        No products match your search.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: ORDERS TABLE */}
      {activeTab === 'orders' && (
        <div className="admin-table-container glass-panel-3d">
          <div className="table-top-bar">
            <div className="table-search-box">
              <Search size={16} className="search-icon" />
              <input
                type="text"
                placeholder="Filter orders by product or username..."
                value={orderSearch}
                onChange={(e) => setOrderSearch(e.target.value)}
              />
            </div>
          </div>

          {loadingOrders ? (
            <div className="table-loading-box">Loading Orders...</div>
          ) : (
            <div className="responsive-table-wrapper">
              <table className="cyber-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Product Name</th>
                    <th>Quantity</th>
                    <th>User</th>
                    <th>Status</th>
                    <th>Status Action</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((o) => (
                    <tr key={o.id}>
                      <td className="id-cell">#{o.id}</td>
                      <td className="name-cell">
                        <strong>{o.productName || `Product #${o.productId}`}</strong>
                      </td>
                      <td className="qty-cell">{o.quantity}</td>
                      <td className="user-cell">@{o.username || 'guest'}</td>
                      <td>
                        <span
                          className={`order-status-pill ${(o.status || 'PENDING').toLowerCase()}`}
                        >
                          {o.status || 'PENDING'}
                        </span>
                      </td>
                      <td>
                        <select
                          className="cyber-select sm"
                          value={o.status || 'PENDING'}
                          onChange={(e) => handleUpdateOrderStatus(o, e.target.value)}
                        >
                          <option value="PENDING">PENDING</option>
                          <option value="PROCESSING">PROCESSING</option>
                          <option value="SHIPPED">SHIPPED</option>
                          <option value="DELIVERED">DELIVERED</option>
                          <option value="CANCELLED">CANCELLED</option>
                        </select>
                      </td>
                      <td className="actions-cell">
                        <button
                          className="btn-action delete"
                          onClick={() => handleDeleteOrder(o.id)}
                          title="Delete Order"
                        >
                          <Trash2 size={14} />
                          <span>Delete</span>
                        </button>
                      </td>
                    </tr>
                  ))}

                  {filteredOrders.length === 0 && (
                    <tr>
                      <td colSpan={7} className="empty-table-cell">
                        No orders recorded yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
