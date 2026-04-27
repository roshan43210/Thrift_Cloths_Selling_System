import { useEffect, useState } from 'react';
import api from '../services/api.js';
import { Plus, Package, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const SellerDashboard = () => {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', price: '', condition: 'good', category: 'men', images: ['https://via.placeholder.com/400x400?text=Thrift+Item'], size: '', brand: '' });

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const [pRes, oRes] = await Promise.all([api.get('/products/my-products'), api.get('/orders/seller-orders')]);
      setProducts(pRes.data); setOrders(oRes.data);
    } catch (err) { toast.error('Failed to load data'); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/products', { ...form, price: Number(form.price) });
      toast.success('Product listed!');
      setShowForm(false);
      setForm({ title: '', description: '', price: '', condition: 'good', category: 'men', images: ['https://via.placeholder.com/400x400?text=Thrift+Item'], size: '', brand: '' });
      fetchData();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  const updateStatus = async (id, status) => {
    try { await api.put('/orders/' + id + '/status', { status }); toast.success('Status updated'); fetchData(); }
    catch (err) { toast.error('Failed'); }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Seller Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold flex items-center"><Package className="mr-2" size={18} /> My Products</h2>
            <button onClick={() => setShowForm(!showForm)} className="btn-primary text-sm flex items-center"><Plus size={16} className="mr-1" /> {showForm ? 'Cancel' : 'List Product'}</button>
          </div>
          {showForm && (
            <form onSubmit={handleSubmit} className="card space-y-3 mb-4">
              <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="input text-sm" placeholder="Title" required />
              <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="input text-sm" placeholder="Description" rows={2} required />
              <input type="number" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} className="input text-sm" placeholder="Price" required />
              <select value={form.condition} onChange={e => setForm({ ...form, condition: e.target.value })} className="input text-sm">
                <option value="like new">Like New</option><option value="good">Good</option><option value="worn">Worn</option>
              </select>
              <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="input text-sm">
                <option value="men">Men</option><option value="women">Women</option><option value="kids">Kids</option>
              </select>
              <input value={form.size} onChange={e => setForm({ ...form, size: e.target.value })} className="input text-sm" placeholder="Size" />
              <div>
                <label className="text-xs text-gray-500 font-medium">Product Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={e => {
                    const file = e.target.files[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () => setForm({ ...form, images: [reader.result] });
                      reader.readAsDataURL(file);
                    }
                  }}
                  className="input text-sm py-1"
                />
                {form.images[0] && <img src={form.images[0]} alt="Preview" className="mt-2 w-20 h-20 object-cover rounded border" />}
              </div>
              <button type="submit" className="w-full btn-primary text-sm">List Product</button>
            </form>
          )}
          {products.length === 0 ? <p className="text-gray-500">No products yet.</p> : (
            <div className="space-y-3">
              {products.map(p => (
                <div key={p._id} className="card flex gap-3">
                  <img src={p.images[0]} alt={p.title} className="w-16 h-16 object-cover rounded" />
                  <div className="flex-1">
                    <p className="font-medium">{p.title}</p>
                    <p className="text-sm text-primary font-bold">Rs. {p.price}</p>
                    <span className={'text-xs px-2 py-0.5 rounded ' + (p.isSold ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700')}>{p.isSold ? 'Sold' : 'Active'}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div>
          <h2 className="font-semibold mb-4 flex items-center"><Star className="mr-2" size={18} /> Orders Received</h2>
          {orders.length === 0 ? <p className="text-gray-500">No orders yet.</p> : (
            <div className="space-y-3">
              {orders.map(o => (
                <div key={o._id} className="card">
                  <div className="flex justify-between mb-2">
                    <span className="font-mono text-sm text-gray-500">#{o._id.slice(-8)}</span>
                    <span className={'text-xs font-semibold px-2 py-1 rounded ' + (o.status === 'delivered' ? 'bg-green-100 text-green-700' : o.status === 'cancelled' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700')}>{o.status}</span>
                  </div>
                  <p className="text-sm text-gray-600">Buyer: {o.buyer.name}</p>
                  <p className="text-sm text-gray-600">Phone: {o.buyer.phone}</p>
                  <div className="flex gap-2 mt-2">
                    {o.status !== 'delivered' && o.status !== 'cancelled' && (
                      <>
                        <button onClick={() => updateStatus(o._id, 'confirmed')} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">Confirm</button>
                        <button onClick={() => updateStatus(o._id, 'shipped')} className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded">Ship</button>
                        <button onClick={() => updateStatus(o._id, 'delivered')} className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">Deliver</button>
                      </>
                    )}
                    <button onClick={() => updateStatus(o._id, 'cancelled')} className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded">Cancel</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SellerDashboard;
