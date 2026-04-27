import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api.js';
import { ShoppingBag, Search, Heart, Star } from 'lucide-react';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [categories] = useState([
    { name: 'Men', image: 'https://via.placeholder.com/300x300?text=Men', path: '/products?category=men' },
    { name: 'Women', image: 'https://via.placeholder.com/300x300?text=Women', path: '/products?category=women' },
    { name: 'Kids', image: 'https://via.placeholder.com/300x300?text=Kids', path: '/products?category=kids' },
  ]);

  useEffect(() => {
    api.get('/products?limit=8').then((res) => setProducts(res.data.products));
  }, []);

  return (
    <div>
      {/* Hero */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-400 text-white">
        <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
          <div className="md:w-2/3">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Discover Pre-Loved Fashion</h1>
            <p className="text-lg mb-6 opacity-90">Buy and sell quality thrift clothing. Sustainable, affordable, and stylish.</p>
            <Link to="/products" className="inline-flex items-center bg-white text-orange-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition">
              <ShoppingBag className="mr-2" size={20} /> Start Shopping
            </Link>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold mb-6">Shop by Category</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <Link key={cat.name} to={cat.path} className="group relative overflow-hidden rounded-xl">
              <img src={cat.image} alt={cat.name} className="w-full h-64 object-cover group-hover:scale-105 transition duration-300" />
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                <span className="text-white text-2xl font-bold">{cat.name}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Featured Products */}
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Featured Thrift Items</h2>
          <Link to="/products" className="text-primary font-medium hover:underline flex items-center">
            View All <Search size={16} className="ml-1" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
};

const ProductCard = ({ product }) => {
  return (
    <Link to={`/product/${product._id}`} className="card group hover:shadow-md transition">
      <div className="relative">
        <img src={product.images[0]} alt={product.title} className="w-full h-48 object-cover rounded-lg mb-3" />
        <span className={`absolute top-2 left-2 text-xs font-semibold px-2 py-1 rounded ${
          product.condition === 'like new' ? 'bg-green-100 text-green-700' :
          product.condition === 'good' ? 'bg-blue-100 text-blue-700' :
          'bg-yellow-100 text-yellow-700'
        }`}>
          {product.condition}
        </span>
      </div>
      <h3 className="font-semibold text-gray-900 truncate">{product.title}</h3>
      <p className="text-sm text-gray-500 truncate">{product.category} · {product.size || 'N/A'}</p>
      <div className="flex items-center justify-between mt-2">
        <span className="text-lg font-bold text-primary">Rs. {product.price}</span>
        <div className="flex items-center text-gray-400">
          <Heart size={18} className="group-hover:text-red-400 transition" />
        </div>
      </div>
    </Link>
  );
};

export default Home;

