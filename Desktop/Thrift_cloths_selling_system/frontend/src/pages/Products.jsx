import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import api from '../services/api.js';
import { Search, Filter, ChevronLeft, ChevronRight } from 'lucide-react';

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(Number(searchParams.get('page')) || 1);
  const [filters, setFilters] = useState({
    keyword: searchParams.get('keyword') || '',
    category: searchParams.get('category') || '',
    condition: searchParams.get('condition') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
  });

  useEffect(() => {
    fetchProducts();
  }, [searchParams]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams(searchParams);
      params.set('page', page);
      const { data } = await api.get(`/products?${params.toString()}`);
      setProducts(data.products);
      setTotalPages(data.totalPages);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, val]) => {
      if (val) params.set(key, val);
    });
    params.set('page', '1');
    setSearchParams(params);
    setPage(1);
  };

  const clearFilters = () => {
    setFilters({ keyword: '', category: '', condition: '', minPrice: '', maxPrice: '' });
    setSearchParams({});
    setPage(1);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Filters */}
        <aside className="w-full md:w-64 shrink-0">
          <div className="card space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold flex items-center"><Filter size={16} className="mr-1" /> Filters</h3>
              <button onClick={clearFilters} className="text-xs text-primary hover:underline">Clear</button>
            </div>

            <div>
              <label className="text-sm font-medium">Search</label>
              <div className="relative mt-1">
                <Search className="absolute left-2 top-2 text-gray-400" size={16} />
                <input
                  type="text"
                  value={filters.keyword}
                  onChange={(e) => setFilters({ ...filters, keyword: e.target.value })}
                  className="input pl-8 text-sm"
                  placeholder="Search products..."
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">Category</label>
              <select value={filters.category} onChange={(e) => setFilters({ ...filters, category: e.target.value })} className="input text-sm mt-1">
                <option value="">All</option>
                <option value="men">Men</option>
                <option value="women">Women</option>
                <option value="kids">Kids</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium">Condition</label>
              <select value={filters.condition} onChange={(e) => setFilters({ ...filters, condition: e.target.value })} className="input text-sm mt-1">
                <option value="">All</option>
                <option value="like new">Like New</option>
                <option value="good">Good</option>
                <option value="worn">Worn</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium">Price Range</label>
              <div className="flex gap-2 mt-1">
                <input type="number" placeholder="Min" value={filters.minPrice} onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })} className="input text-sm w-1/2" />
                <input type="number" placeholder="Max" value={filters.maxPrice} onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })} className="input text-sm w-1/2" />
              </div>
            </div>

            <button onClick={applyFilters} className="w-full btn-primary text-sm">Apply Filters</button>
          </div>
        </aside>

        {/* Product Grid */}
        <div className="flex-1">
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20 text-gray-500">No products found.</div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center mt-8 gap-2">
                  <button
                    disabled={page <= 1}
                    onClick={() => { setPage(p => p - 1); const s = new URLSearchParams(searchParams); s.set('page', String(page - 1)); setSearchParams(s); }}
                    className="p-2 rounded-lg border hover:bg-gray-50 disabled:opacity-40"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <span className="text-sm text-gray-600">Page {page} of {totalPages}</span>
                  <button
                    disabled={page >= totalPages}
                    onClick={() => { setPage(p => p + 1); const s = new URLSearchParams(searchParams); s.set('page', String(page + 1)); setSearchParams(s); }}
                    className="p-2 rounded-lg border hover:bg-gray-50 disabled:opacity-40"
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

const ProductCard = ({ product }) => {
  return (
    <Link to={`/product/${product._id}`} className="card group hover:shadow-md transition">
      <div className="relative">
        <img src={product.images[0]} alt={product.title} className="w-full h-52 object-cover rounded-lg mb-3" />
        <span className={`absolute top-2 left-2 text-xs font-semibold px-2 py-1 rounded ${
          product.condition === 'like new' ? 'bg-green-100 text-green-700' :
          product.condition === 'good' ? 'bg-blue-100 text-blue-700' :
          'bg-yellow-100 text-yellow-700'
        }`}>
          {product.condition}
        </span>
      </div>
      <h3 className="font-semibold text-gray-900 truncate">{product.title}</h3>
      <p className="text-sm text-gray-500">{product.category} · {product.size || 'N/A'}</p>
      <div className="flex items-center justify-between mt-2">
        <span className="text-lg font-bold text-primary">Rs. {product.price}</span>
        <span className="text-xs text-gray-400">{product.seller?.name}</span>
      </div>
    </Link>
  );
};

export default Products;

