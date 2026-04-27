import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api.js';
import { CreditCard, Truck, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const Checkout = () => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ shippingAddress: '', phone: '', paymentMethod: 'esewa' });
  const [order, setOrder] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/cart').then(r => {
      if (!r.data.items?.length) navigate('/cart');
      else setCart(r.data);
    }).finally(() => setLoading(false));
  }, []);

  const createOrder = async () => {
    if (!form.shippingAddress || !form.phone) { toast.error('Fill all fields'); return; }
    setProcessing(true);
    try {
      const { data } = await api.post('/orders', form);
      setOrder(data); setStep(2);
      toast.success('Order created! Pay 50% advance.');
    } catch (err) { toast.error(err.response?.data?.message || 'Order failed'); }
    finally { setProcessing(false); }
  };

  const payAdvance = async () => {
    setProcessing(true);
    try {
      const ep = form.paymentMethod === 'esewa' ? '/payments/esewa' : '/payments/khalti';
      const { data } = await api.post(ep, { orderId: order._id });
      setOrder(data.order); setStep(3);
      toast.success('Payment successful!');
    } catch (err) { toast.error(err.response?.data?.message || 'Payment failed'); }
    finally { setProcessing(false); }
  };

  const total = cart?.items?.reduce((s, i) => s + i.product.price * i.quantity, 0) || 0;
  const advance = Math.round(total * 0.5);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>
      <div className="flex items-center mb-8">
        {['Details', 'Payment', 'Complete'].map((s, i) => (
          <div key={s} className="flex items-center">
            <div className={'w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ' + (step > i + 1 ? 'bg-green-500 text-white' : step === i + 1 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-500')}>
              {step > i + 1 ? '✓' : i + 1}
            </div>
            <span className={'ml-2 text-sm ' + (step === i + 1 ? 'font-semibold' : 'text-gray-500')}>{s}</span>
            {i < 2 && <div className="w-12 h-1 mx-2 bg-gray-200"></div>}
          </div>
        ))}
      </div>

      {step === 1 && (
        <div className="card space-y-4">
          <h2 className="font-semibold flex items-center"><Truck className="mr-2" size={18} /> Shipping Details</h2>
          <div>
            <label className="text-sm font-medium">Address</label>
            <textarea value={form.shippingAddress} onChange={e => setForm({ ...form, shippingAddress: e.target.value })} className="input mt-1" rows={3} />
          </div>
          <div>
            <label className="text-sm font-medium">Phone</label>
            <input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className="input mt-1" />
          </div>
          <div>
            <label className="text-sm font-medium">Payment</label>
            <div className="flex gap-4 mt-2">
              {['esewa', 'khalti', 'cod'].map(m => (
                <button key={m} onClick={() => setForm({ ...form, paymentMethod: m })} className={'flex-1 py-3 rounded-lg border-2 font-medium capitalize ' + (form.paymentMethod === m ? 'border-primary bg-orange-50 text-primary' : 'border-gray-200 text-gray-600')}>
                  {m === 'esewa' ? 'eSewa' : m === 'khalti' ? 'Khalti' : 'Cash on Delivery'}
                </button>
              ))}
            </div>
          </div>
          <div className="border-t pt-4">
            <div className="flex justify-between text-sm mb-1"><span>Total</span><span>Rs. {total}</span></div>
            <div className="flex justify-between text-sm text-orange-600 font-medium mb-1"><span>Advance (50%)</span><span>Rs. {advance}</span></div>
            <div className="flex justify-between text-sm text-gray-500"><span>Remaining (COD)</span><span>Rs. {total - advance}</span></div>
          </div>
          <button onClick={createOrder} disabled={processing} className="w-full btn-primary disabled:opacity-60">
            {processing ? 'Creating...' : 'Place Order'}
          </button>
        </div>
      )}

      {step === 2 && order && (
        <div className="card space-y-4">
          <h2 className="font-semibold flex items-center"><CreditCard className="mr-2" size={18} /> Pay Advance</h2>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex justify-between mb-2"><span>Order ID</span><span className="font-mono text-sm">{order._id.slice(-8)}</span></div>
            <div className="flex justify-between text-lg font-bold"><span>Advance Amount</span><span className="text-primary">Rs. {advance}</span></div>
          </div>
          {form.paymentMethod === 'cod' ? (
            <button onClick={() => setStep(3)} className="w-full btn-primary">Confirm COD</button>
          ) : (
            <button onClick={payAdvance} disabled={processing} className="w-full btn-primary disabled:opacity-60">
              {processing ? 'Processing...' : 'Pay Rs. ' + advance}
            </button>
          )}
        </div>
      )}

      {step === 3 && (
        <div className="card text-center py-12">
          <CheckCircle size={64} className="mx-auto text-green-500 mb-4" />
          <h2 className="text-2xl font-bold mb-2">Order Confirmed!</h2>
          <p className="text-gray-600 mb-6">Your order has been placed.</p>
          <div className="flex gap-3 justify-center">
            <button onClick={() => navigate('/dashboard')} className="btn-primary">View Orders</button>
            <button onClick={() => navigate('/products')} className="btn-secondary">Continue Shopping</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Checkout;
