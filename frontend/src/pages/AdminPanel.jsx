import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';

function AdminPanel() {
  const role = localStorage.getItem('role');

  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState('');

  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');

  const fetchProducts = async () => {
    try {
      const res = await axiosInstance.get('/products');
      setProducts(res.data);
    } catch (err) {
      setError('Products load nahi ho paaye.');
    }
  };

  const fetchOrders = async () => {
    try {
      const res = await axiosInstance.get('/orders');
      setOrders(res.data);
    } catch (err) {
      setError('Orders load nahi ho paaye.');
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchOrders();
  }, []);

  const resetForm = () => {
    setName('');
    setPrice('');
    setImageUrl('');
    setCategory('');
    setDescription('');
    setEditingId(null);
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
      } else {
        await axiosInstance.post('/products', payload);
      }
      resetForm();
      fetchProducts();
    } catch (err) {
      setError('Product save nahi hua.');
    }
  };

  const handleEdit = (product) => {
    setEditingId(product.id);
    setName(product.name);
    setPrice(product.price);
    setImageUrl(product.imageUrl || '');
    setCategory(product.category || '');
    setDescription(product.description || '');
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Product delete karna hai?')) return;
    try {
      await axiosInstance.delete(`/products/${id}`);
      fetchProducts();
    } catch (err) {
      setError('Product delete nahi hua.');
    }
  };

  const handleDeleteOrder = async (id) => {
    if (!window.confirm('Order delete karna hai?')) return;
    try {
      await axiosInstance.delete(`/orders/${id}`);
      fetchOrders();
    } catch (err) {
      setError('Order delete nahi hua.');
    }
  };

  if (role !== 'ADMIN') {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="page">
      <h2>Admin Panel</h2>
      {error && <p className="error">{error}</p>}

      <h3>{editingId ? 'Edit Product' : 'Add New Product'}</h3>
      <form onSubmit={handleSubmit} className="form-row">
        <input
          type="text"
          placeholder="Product name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Image URL (optional)"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
        />
        <input
          type="text"
          placeholder="Category (e.g. Laptop, Mobile)"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Product description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          required
        />
        <button type="submit">{editingId ? 'Update' : 'Add'}</button>
        {editingId && (
          <button type="button" className="btn-outline" onClick={resetForm}>
            Cancel
          </button>
        )}
      </form>

      <h3>Products</h3>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Category</th>
            <th>Price</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id}>
              <td>{p.id}</td>
              <td>{p.name}</td>
              <td>{p.category}</td>
              <td>₹{p.price}</td>
              <td className="action-cell">
                <button className="link-btn" onClick={() => handleEdit(p)}>Edit</button>
                <button className="delete-btn" onClick={() => handleDeleteProduct(p.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3>Orders</h3>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Product ID</th>
            <th>Quantity</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {orders.map((o) => (
            <tr key={o.id}>
              <td>{o.id}</td>
              <td>{o.productId}</td>
              <td>{o.quantity}</td>
              <td className="action-cell">
                <button className="delete-btn" onClick={() => handleDeleteOrder(o.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminPanel;