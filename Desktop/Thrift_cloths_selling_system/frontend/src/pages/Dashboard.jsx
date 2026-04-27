import { useEffect, useState } from 'react';
import api from '../services/api.js';
import { useAuth } from '../context/AuthContext';
import { Package, CreditCard, MapPin, Phone, Star, Edit, Send } from 'lucide-react';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const { user, setUser } = useAuth();
  const [orders, setOrders] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [reviewForm, setReviewForm] = useState({ orderId: '', rating: 5, comment: '' });
  const [form, setForm] = useState({ name: '', phone: '', address: '', esewaId: '', khaltiId: '' });

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || '', phone: user.phone || '', address: user.address || '',
        esewaId: user.esewaId || '', khaltiId: user.khaltiId || '',
      });
    }
    fetchOrders();
  }, [user]);

  const fetchOrders = async () => {
    try { const { data } = await api.get('/orders/my-orders'); setOrders(data); }
    catch (err) { console.error(err); }
  };

  const submitReview = async (orderId) => {
    try {
      await api.post('/reviews', { orderId, rating: Number(reviewForm.rating), comment: reviewForm.comment });
      toast.success('Review submitted!');
      setReviewForm({ orderId: '', rating: 5, comment: '' });
      fetchOrders();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit review');
    }
  };

  const handleUpdate = async () => {
    try { const { data } = await api.put('/auth/profile', form); setUser(data); setEditMode(false); toast.success('Profile updated'); }
    catch (err) { toast.error('Update failed'); }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">My Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card md:col-span-1">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold">Profile</h2>
            <button onClick={() => setEditMode(!editMode)} className="text-primary text-sm flex items-center">
              <Edit size={14} className="mr-1" /> {editMode ? 'Cancel' : 'Edit'}
            </button>
          </div>
          {editMode ? (
            <div className="space-y-3">
              <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="input text-sm" placeholder="Name" />
              <input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className="input text-sm" placeholder="Phone" />
              <input value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} className="input text-sm" placeholder="Address" />
              <input value={form.esewaId} onChange={e => setForm({ ...form, esewaId: e.target.value })} className="input text-sm" placeholder="eSewa ID" />
              <input value={form.khaltiId} onChange={e => setForm({ ...form, khaltiId: e.target.value })} className="input text-sm" placeholder="Khalti ID" />
              <button onClick={handleUpdate} className="w-full btn-primary text-sm">Save Changes</button>
            </div>
          ) : (
            <div className="space-y-3 text-sm">
              <p><span className="w-20 text-gray-500 inline-block">Name</span><span className="font-medium">{user?.name}</span></p>
              <p><span className="w-20 text-gray-500 inline-block">Email</span><span className="font-medium">{user?.email}</span></p>
              <p><Phone size={14} className="mr-2 text-gray-400 inline" /><span>{user?.phone || 'Not set'}</span></p>
              <p><MapPin size={14} className="mr-2 text-gray-400 inline" /><span>{user?.address || 'Not set'}</span></p>
              <p><CreditCard size={14} className="mr-2 text-gray-400 inline" /><span>eSewa: {user?.esewaId || 'Not linked'}</span></p>
              <p><CreditCard size={14} className="mr-2 text-gray-400 inline" /><span>Khalti: {user?.khaltiId || 'Not linked'}</span></p>
            </div>
          )}
        </div>
        <div className="md:col-span-2">
          <h2 className="font-semibold mb-4 flex items-center"><Package className="mr-2" size={18} /> My Orders</h2>
          {orders.length === 0 ? (
            <div className="card text-center py-12 text-gray-500">No orders yet.</div>
          ) : (
            <div className="space-y-4">
              {orders.map(order => (
                <div key={order._id} className="card">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-sm text-gray-500">#{order._id.slice(-8)}</span>
                    <span className={'text-xs font-semibold px-2 py-1 rounded ' + (order.status === 'delivered' ? 'bg-green-100 text-green-700' : order.status === 'cancelled' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700')}>{order.status}</span>
                  </div>
                  <div className="flex gap-3">
                    {order.items.map((item, i) => (
                      <div key={i} className="flex gap-2 items-center">
                        <img src={item.image} alt={item.title} className="w-12 h-12 object-cover rounded" />
                        <div>
                          <p className="text-sm font-medium truncate max-w-[200px]">{item.title}</p>
                          <p className="text-xs text-gray-500">Rs. {item.price} x {item.quantity}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between items-center mt-3 pt-3 border-t">
                    <div className="text-xs text-gray-500">Payment: <span className="font-medium">{order.payment.status}</span> ({order.payment.method})</div>
                    <span className="font-bold text-primary">Rs. {order.totalAmount}</span>
                  </div>
                  {!order.isReviewed && order.status === 'delivered' && (
                    reviewForm.orderId === order._id ? (
                      <div className="mt-3 space-y-2 bg-gray-50 p-3 rounded-lg">
                        <div className="flex gap-1">
                          {[1,2,3,4,5].map(s => (
                            <button key={s} onClick={() => setReviewForm({...reviewForm, rating: s})} className={'text-lg ' + (s <= reviewForm.rating ? 'text-yellow-400' : 'text-gray-300')}>★</button>
                          ))}
                        </div>
                        <textarea value={reviewForm.comment} onChange={e => setReviewForm({...reviewForm, comment: e.target.value})} className="input text-sm" rows={2} placeholder="Write your review..." />
                        <div className="flex gap-2">
                          <button onClick={() => submitReview(order._id)} className="btn-primary text-xs flex items-center gap-1"><Send size={12}/> Submit</button>
                          <button onClick={() => setReviewForm({ orderId: '', rating: 5, comment: '' })} className="btn-secondary text-xs">Cancel</button>
                        </div>
                      </div>
                    ) : (
                      <button onClick={() => setReviewForm({ ...reviewForm, orderId: order._id })} className="text-xs text-primary hover:underline mt-2 inline-block">Leave a review</button>
                    )
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
