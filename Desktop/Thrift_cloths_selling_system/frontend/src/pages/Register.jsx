import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api.js';
import toast from 'react-hot-toast';
import { User, Mail, Lock, ArrowRight } from 'lucide-react';

const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'buyer' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/auth/register', form);
      toast.success('OTP sent to your email!');
      navigate('/verify-otp', { state: { email: form.email } });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="card">
          <h2 className="text-2xl font-bold text-center mb-6">Create Account</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-2.5 text-gray-400" size={18} />
                <input name="name" value={form.name} onChange={handleChange} className="input pl-10" placeholder="John Doe" required />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 text-gray-400" size={18} />
                <input name="email" type="email" value={form.email} onChange={handleChange} className="input pl-10" placeholder="you@example.com" required />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 text-gray-400" size={18} />
                <input name="password" type="password" value={form.password} onChange={handleChange} className="input pl-10" placeholder="Min 6 characters" required />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">I want to</label>
              <select name="role" value={form.role} onChange={handleChange} className="input">
                <option value="buyer">Buy items</option>
                <option value="seller">Sell items</option>
              </select>
            </div>
            <button type="submit" disabled={loading} className="w-full btn-primary flex items-center justify-center disabled:opacity-60">
              {loading ? 'Creating account...' : <><span>Create Account</span> <ArrowRight size={18} className="ml-1" /></>}
            </button>
          </form>

          <p className="text-center mt-6 text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="text-primary font-medium hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;

