import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api.js';
import { Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

const Cart = () => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/cart').then(r => setCart(r.data)).catch(() => toast.error('Failed')).finally(() => setLoading(false));
  }, []);

  const removeItem = async (pid) => {
    try { const { data } = await api.delete('/cart/' + pid); setCart(data); toast.success('Removed'); }
    catch { toast.error('Failed'); }
  };

  const total = cart?.items?.reduce((s, i) => s + i.product.price * i.quantity, 0) || 0;

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 flex items-center"><ShoppingBag className="mr-2" /> Your Cart</h1>
      {!cart?.items?.length ? (
        <div className="text-center py-20">
          <ShoppingBag size={48} className="mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500">Your cart is empty.</p>
          <button onClick={() => navigate('/products')} className="mt-4 btn-primary">Browse Products</button>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {cart.items.map(item => (
              <div key={item.product._id} className="card flex gap-4 items-center">
                <img src={item.product.images[0]} alt={item.product.title} className="w-20 h-20 object-cover rounded-lg" />
                <div className="flex-1"><h3 className="font-semibold">{item.product.title}</h3><p className="text-sm text-gray-500">Rs. {item.product.price} x {item.quantity}</p></div>
                <p className="font-bold text-primary">Rs. {item.product.price * item.quantity}</p>
                <button onClick={() => removeItem(item.product._id)} className="p-2 text-gray-400 hover:text-red-500"><Trash2 size={18} /></button>
              </div>
            ))}
          </div>
          <div className="card mt-6">
            <div className="flex justify-between text-lg font-bold mb-4"><span>Total</span><span className="text-primary">Rs. {total}</span></div>
            <button onClick={() => navigate('/checkout')} className="w-full btn-primary flex items-center justify-center gap-2">Proceed to Checkout <ArrowRight size={18} /></button>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
