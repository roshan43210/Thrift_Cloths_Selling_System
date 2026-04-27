import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api.js';
import toast from 'react-hot-toast';
import { Key, ArrowRight } from 'lucide-react';

const VerifyOtp = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { login } = useAuth();
  const email = location.state?.email || '';
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post('/auth/verify-otp', { email, otp });
      login(data.token, data.user);
      toast.success('Email verified successfully!');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  const resendOtp = async () => {
    try {
      await api.post('/auth/resend-otp', { email });
      toast.success('New OTP sent!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to resend');
    }
  };

  if (!email) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">No email provided. Please register first.</p>
          <button onClick={() => navigate('/register')} className="btn-primary">Go to Register</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="card">
          <h2 className="text-2xl font-bold text-center mb-2">Verify Email</h2>
          <p className="text-center text-gray-500 text-sm mb-6">We sent a 6-digit code to {email}</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Enter OTP</label>
              <div className="relative">
                <Key className="absolute left-3 top-2.5 text-gray-400" size={18} />
                <input
                  type="text"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  className="input pl-10 text-center tracking-[0.5em] font-mono text-lg"
                  placeholder="000000"
                  required
                />
              </div>
            </div>
            <button type="submit" disabled={loading} className="w-full btn-primary flex items-center justify-center disabled:opacity-60">
              {loading ? 'Verifying...' : <><span>Verify</span> <ArrowRight size={18} className="ml-1" /></>}
            </button>
          </form>

          <button onClick={resendOtp} className="w-full text-center text-sm text-primary mt-4 hover:underline">
            Didn't receive it? Resend OTP
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerifyOtp;

