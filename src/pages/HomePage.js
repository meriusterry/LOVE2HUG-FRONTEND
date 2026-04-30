import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowForward, LocalShipping, Security, SupportAgent, Star } from '@mui/icons-material';
import { useCart } from '../context/CartContext';
import { getProducts } from '../services/api';
import toast from 'react-hot-toast';

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-gradient-to-br from-pink-100 via-pink-50 to-white min-h-[80vh] flex items-center relative overflow-hidden">
      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="lg:w-1/2 text-center lg:text-left"
          >
            <div className="inline-block px-4 py-2 bg-primary-100 text-primary-600 rounded-full text-sm font-semibold mb-6">🎉 NEW COLLECTION 2026</div>
            <h1 className="text-5xl lg:text-7xl font-bold text-gray-800 mb-6">Giant Teddy Bears<span className="text-primary-500"> for Big Hugs</span></h1>
            <p className="text-xl text-gray-600 mb-8">Experience the warmth of our oversized teddy bears. Perfect for gifts, decorations, or cuddle buddies. Up to 6 feet tall!</p>
            <button onClick={() => navigate('/shop')} className="btn-primary inline-flex items-center gap-2">Shop Now <ArrowForward /></button>
          </motion.div>
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8 }} className="lg:w-1/2">
            <img src="/images/pink-ted.jpg" alt="Giant Teddy Bear" className="rounded-3xl shadow-2xl w-half max-w-sm mx-auto animate-float" onError={(e) => { e.target.src = 'https://via.placeholder.com/400x400?text=Teddy+Bear'; }} />
          </motion.div>
        </div>
      </div>
      <div className="absolute top-20 left-10 w-20 h-20 bg-yellow-300 rounded-full opacity-20 blur-2xl"></div>
      <div className="absolute bottom-20 right-10 w-32 h-32 bg-pink-300 rounded-full opacity-20 blur-2xl"></div>
    </div>
  );
};

const FeatureSection = () => {
  const features = [
    { icon: <LocalShipping className="text-5xl" />, title: 'Free Shipping', description: 'On orders over R500', color: 'bg-blue-100 text-blue-600' },
    { icon: <Security className="text-5xl" />, title: 'Secure Payment', description: '100% secure transactions', color: 'bg-green-100 text-green-600' },
    { icon: <SupportAgent className="text-5xl" />, title: '24/7 Support', description: 'Always here to help', color: 'bg-purple-100 text-purple-600' },
  ];

  return (
    <div className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div key={index} initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: index * 0.1 }} viewport={{ once: true }} className="text-center p-8 rounded-2xl hover:shadow-xl transition-shadow duration-300">
              <div className={`${feature.color} w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4`}>{feature.icon}</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

const FeaturedProducts = () => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  const fetchFeaturedProducts = async () => {
    setLoading(true);
    try {
      const response = await getProducts({ status: 'active' });
      if (response.data.success) {
        setProducts(response.data.products.slice(0, 4));
      }
    } catch (error) {
      console.error('Error fetching featured products:', error);
    } finally {
      setLoading(false);
    }
  };

  const getImageUrl = (product) => {
    if (product.imageUrl) return product.imageUrl;
    if (product.image_url) return product.image_url;
    if (product.product_image) return `data:${product.image_type || 'image/jpeg'};base64,${product.product_image}`;
    return 'https://via.placeholder.com/400x400?text=No+Image';
  };

  const handleAddToCart = (e, product) => {
    e.stopPropagation();
    if (product.stock > 0) {
      addToCart({
        id: product.id,
        name: product.name,
        price: parseFloat(product.price),
        imageUrl: getImageUrl(product),
        stock: product.stock
      }, 1);
      toast.success(`${product.name} added to cart!`, { duration: 2000, icon: '🧸' });
    } else {
      toast.error(`${product.name} is out of stock!`);
    }
  };

  if (loading) {
    return (
      <div className="py-20 bg-gradient-to-b from-white to-pink-50">
        <div className="container mx-auto px-4">
          <h2 className="section-title">Our Best Sellers</h2>
          <p className="section-subtitle">Most loved giant teddy bears by our customers</p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-lg animate-pulse">
                <div className="w-full h-64 bg-gray-200"></div>
                <div className="p-6"><div className="h-6 bg-gray-200 rounded mb-2"></div><div className="h-4 bg-gray-200 rounded mb-3 w-2/3"></div><div className="h-8 bg-gray-200 rounded w-1/2"></div></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-20 bg-gradient-to-b from-white to-pink-50">
      <div className="container mx-auto px-4">
        <h2 className="section-title">Our Best Sellers</h2>
        <p className="section-subtitle">Most loved giant teddy bears by our customers</p>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product, index) => (
            <motion.div key={product.id} initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: index * 0.1 }} viewport={{ once: true }} whileHover={{ y: -10 }} className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer group" onClick={() => navigate(`/product/${product.id}`)}>
              <div className="relative h-64 overflow-hidden bg-gray-100">
                <img src={getImageUrl(product)} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" onError={(e) => { e.target.src = 'https://via.placeholder.com/400x400?text=No+Image'; }} />
                {product.badge && product.stock > 0 && (<div className="absolute top-4 left-4 bg-primary-500 text-white px-3 py-1 rounded-full text-sm font-semibold">{product.badge}</div>)}
                {product.stock === 0 && (<div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center"><span className="bg-red-500 text-white px-4 py-2 rounded-full font-semibold">Out of Stock</span></div>)}
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-primary-500 transition-colors">{product.name}</h3>
                <div className="flex items-center gap-2 mb-3"><div className="flex items-center"><Star className="text-yellow-400 w-5 h-5" /><span className="text-gray-700 font-semibold ml-1">{parseFloat(product.rating).toFixed(1)}</span></div><span className="text-gray-500">({product.reviews_count || 0} reviews)</span></div>
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-bold text-primary-500">R{parseFloat(product.price).toFixed(2)}</span>
                  <button className={`px-4 py-2 rounded-full transition-all duration-300 ${product.stock > 0 ? 'bg-primary-500 text-white hover:bg-primary-600 hover:scale-105' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`} disabled={product.stock === 0} onClick={(e) => handleAddToCart(e, product)}>Add to Cart</button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

const HomePage = () => {
  return (
    <div>
      <HeroSection />
      <FeaturedProducts />
      <FeatureSection />
    </div>
  );
};

export default HomePage;