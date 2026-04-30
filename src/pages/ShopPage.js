import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Filter, ShoppingCart, Star } from '@mui/icons-material';
import { useCart } from '../context/CartContext';
import { getProducts } from '../services/api';
import toast from 'react-hot-toast';

const ShopPage = () => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, searchTerm]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = {};
      if (selectedCategory !== 'all') params.category = selectedCategory;
      if (searchTerm) params.search = searchTerm;
      
      const response = await getProducts(params);
      console.log('Products from API:', response.data.products);
      setProducts(response.data.products);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (e, product) => {
    e.stopPropagation();
    if (product.stock > 0) {
      addToCart(product, 1);
      toast.success(`${product.name} added to cart!`, {
        duration: 2000,
        icon: '🧸',
      });
    } else {
      toast.error(`${product.name} is out of stock!`);
    }
  };

  const getImageUrl = (product) => {
    if (product.imageUrl) {
      return product.imageUrl;
    }
    if (product.product_image) {
      return `data:${product.image_type || 'image/jpeg'};base64,${product.product_image}`;
    }
    return 'https://via.placeholder.com/400x400?text=No+Image';
  };

  const categories = [
    { id: 'all', name: 'All Bears' },
    { id: 'Giant', name: 'Giant Bears (4ft+)' },
    { id: 'Standard', name: 'Standard Bears' },
    { id: 'Special', name: 'Special Edition' },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-bounce">🧸</div>
          <p className="text-gray-600">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-primary-500 to-primary-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <motion.h1 className="text-4xl md:text-5xl font-bold mb-4">Shop Our Teddy Bears</motion.h1>
          <motion.p className="text-xl opacity-90">Find your perfect cuddle companion</motion.p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-lg p-4 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search for teddy bears..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <button onClick={() => setFilterOpen(!filterOpen)} className="md:hidden btn-secondary inline-flex items-center gap-2">
              <Filter /> Filters
            </button>
            <div className="hidden md:flex gap-2">
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                    selectedCategory === cat.id ? 'bg-primary-500 text-white shadow-md' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {filterOpen && (
            <motion.div className="mt-4 md:hidden flex flex-col gap-2">
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => { setSelectedCategory(cat.id); setFilterOpen(false); }}
                  className={`px-4 py-2 rounded-lg ${selectedCategory === cat.id ? 'bg-primary-500 text-white' : 'bg-gray-100 text-gray-700'}`}
                >
                  {cat.name}
                </button>
              ))}
            </motion.div>
          )}
        </div>

        <div className="mb-6">
          <p className="text-gray-600">Showing {products.length} products</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -10 }}
              className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer group"
              onClick={() => navigate(`/product/${product.id}`)}
            >
              <div className="relative h-64 overflow-hidden bg-gray-100">
                <img 
                  src={getImageUrl(product)} 
                  alt={product.name} 
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                  onError={(e) => { 
                    console.log('Image failed to load for:', product.name);
                    e.target.src = 'https://via.placeholder.com/400x400?text=No+Image'; 
                  }}
                />
                {product.badge && product.stock > 0 && (
                  <div className="absolute top-4 left-4 bg-primary-500 text-white px-3 py-1 rounded-full text-sm font-semibold">{product.badge}</div>
                )}
                {product.stock === 0 && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <span className="bg-red-500 text-white px-4 py-2 rounded-full font-semibold">Out of Stock</span>
                  </div>
                )}
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-primary-500 transition-colors">{product.name}</h3>
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex items-center">
                    <Star className="text-yellow-400 w-5 h-5" />
                    <span className="text-gray-700 font-semibold ml-1">{product.rating}</span>
                  </div>
                  <span className="text-gray-500">({product.reviews_count || 0} reviews)</span>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-3xl font-bold text-primary-500">R{parseFloat(product.price).toFixed(2)}</span>
                  </div>
                  <button 
                    className={`px-4 py-2 rounded-full transition-all duration-300 flex items-center gap-2 ${
                      product.stock > 0 ? 'bg-primary-500 text-white hover:bg-primary-600 hover:scale-105' : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                    disabled={product.stock === 0}
                    onClick={(e) => handleAddToCart(e, product)}
                  >
                    <ShoppingCart className="w-5 h-5" /> Add to Cart
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {products.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No products found matching your criteria.</p>
            <button onClick={() => { setSearchTerm(''); setSelectedCategory('all'); }} className="mt-4 text-primary-500 hover:text-primary-600 font-semibold">Clear filters</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShopPage;