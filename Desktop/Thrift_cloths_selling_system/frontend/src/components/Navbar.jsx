import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShoppingCart, Heart, MessageCircle, User, LogOut, Menu, X, Store } from 'lucide-react';
import { useState } from 'react';

const Navbar = () => {
  const { user, logout, isAdmin, isSeller } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold text-primary">ThriftShop</Link>
          </div>

          <div className="hidden md:flex items-center space-x-6">
            <Link to="/products" className="text-gray-700 hover:text-primary font-medium">Shop</Link>
            {user ? (
              <>
                <Link to="/cart" className="text-gray-700 hover:text-primary relative">
                  <ShoppingCart size={22} />
                </Link>
                <Link to="/wishlist" className="text-gray-700 hover:text-primary">
                  <Heart size={22} />
                </Link>
                <Link to="/chat" className="text-gray-700 hover:text-primary">
                  <MessageCircle size={22} />
                </Link>
                {isSeller && (
                  <Link to="/seller" className="text-gray-700 hover:text-primary">
                    <Store size={22} />
                  </Link>
                )}
                {isAdmin && (
                  <Link to="/admin" className="text-gray-700 hover:text-primary font-medium">Admin</Link>
                )}
                <Link to="/dashboard" className="text-gray-700 hover:text-primary">
                  <User size={22} />
                </Link>
                <button onClick={handleLogout} className="text-gray-700 hover:text-red-500">
                  <LogOut size={22} />
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-700 hover:text-primary font-medium">Login</Link>
                <Link to="/register" className="btn-primary">Sign Up</Link>
              </>
            )}
          </div>

          <div className="md:hidden flex items-center">
            <button onClick={() => setMobileOpen(!mobileOpen)}>
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden px-4 pb-4 space-y-2">
          <Link to="/products" className="block text-gray-700">Shop</Link>
          {user ? (
            <>
              <Link to="/cart" className="block text-gray-700">Cart</Link>
              <Link to="/wishlist" className="block text-gray-700">Wishlist</Link>
              <Link to="/chat" className="block text-gray-700">Messages</Link>
              <Link to="/dashboard" className="block text-gray-700">Dashboard</Link>
              {isSeller && <Link to="/seller" className="block text-gray-700">Seller Panel</Link>}
              {isAdmin && <Link to="/admin" className="block text-gray-700">Admin</Link>}
              <button onClick={handleLogout} className="block text-red-500">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="block text-gray-700">Login</Link>
              <Link to="/register" className="block text-primary font-bold">Sign Up</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;

