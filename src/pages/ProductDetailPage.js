import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingCart, Favorite, Share, Star, LocalShipping, Security, Cached, Add, Remove } from '@mui/icons-material';
import { useCart } from '../context/CartContext';
import { getProduct } from '../services/api';
import toast from 'react-hot-toast';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('6ft');
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => { fetchProduct(); }, [id]);

  const fetchProduct = async () => {
    setLoading(true);
    try {
      const response = await getProduct(id);
      if (response.data.success) {
        const productData = response.data.product;
        productData.price = parseFloat(productData.price);
        productData.stock = parseInt(productData.stock);
        productData.rating = parseFloat(productData.rating);
        setProduct(productData);
      } else { toast.error('Product not found'); navigate('/shop'); }
    } catch (error) { console.error('Error fetching product:', error); toast.error('Failed to load product details'); navigate('/shop'); }
    finally { setLoading(false); }
  };

  const getImageUrl = () => {
    if (product?.imageUrl) return product.imageUrl;
    if (product?.image_url) return product.image_url;
    if (product?.product_image) return `data:${product.image_type || 'image/jpeg'};base64,${product.product_image}`;
    return 'https://via.placeholder.com/600x600?text=No+Image';
  };

  const getSizeOptions = () => {
    if (!product) return [];
    const basePrice = parseFloat(product.price) || 0;
    if (product.category === 'Giant') {
      return [
        { label: '3ft', price: basePrice * 0.6, inStock: product.stock > 0 },
        { label: '4ft', price: basePrice * 0.8, inStock: product.stock > 0 },
        { label: '5ft', price: basePrice * 0.9, inStock: product.stock > 0 },
        { label: '6ft', price: basePrice, inStock: product.stock > 0 },
      ];
    } else if (product.category === 'Standard') {
      return [
        { label: '2ft', price: basePrice * 0.5, inStock: product.stock > 0 },
        { label: '3ft', price: basePrice * 0.75, inStock: product.stock > 0 },
        { label: '4ft', price: basePrice, inStock: product.stock > 0 },
      ];
    } else {
      return [{ label: 'Standard', price: basePrice, inStock: product.stock > 0 }];
    }
  };

  const defaultFeatures = ['100% premium soft plush material', 'Hypoallergenic and safe for all ages', 'Durable double-stitched construction', 'Machine washable (gentle cycle)', 'Perfect for gifting or personal use'];
  const productImages = [getImageUrl(), getImageUrl(), getImageUrl()];
  const sizeOptions = getSizeOptions();
  const selectedSizeOption = sizeOptions.find(s => s.label === selectedSize);
  const selectedPrice = selectedSizeOption ? selectedSizeOption.price : (product ? parseFloat(product.price) : 0);
  const selectedProduct = product ? { ...product, price: selectedPrice, size: selectedSize, imageUrl: getImageUrl() } : null;

  const handleAddToCart = () => {
    if (selectedProduct && product && product.stock > 0) {
      addToCart(selectedProduct, quantity);
      toast.success(`${quantity}x ${product.name} (${selectedSize}) added to cart!`, { duration: 2000, icon: '🧸' });
    } else { toast.error('Product is out of stock!'); }
  };

  if (loading) {
    return (<div className="min-h-screen flex items-center justify-center bg-gray-50"><div className="text-center"><div className="text-6xl mb-4 animate-bounce">🧸</div><p className="text-gray-600 text-lg">Loading product details...</p></div></div>);
  }

  if (!product) {
    return (<div className="min-h-screen flex items-center justify-center bg-gray-50"><div className="text-center"><div className="text-6xl mb-4">😢</div><h2 className="text-2xl font-bold text-gray-800 mb-2">Product Not Found</h2><p className="text-gray-600 mb-6">The product you're looking for doesn't exist.</p><button onClick={() => navigate('/shop')} className="btn-primary">Back to Shop</button></div></div>);
  }

  const displayPrice = parseFloat(selectedPrice) || 0;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="mb-6"><button onClick={() => navigate('/shop')} className="text-primary-500 hover:text-primary-600 transition-colors">← Back to Shop</button></div>
        <div className="flex flex-col lg:flex-row gap-12">
          <div className="lg:w-1/2">
            <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} className="bg-white rounded-2xl overflow-hidden shadow-lg">
              <img src={productImages[selectedImage]} alt={product.name} className="w-full h-auto object-cover" onError={(e) => { e.target.src = 'https://via.placeholder.com/600x600?text=No+Image'; }} />
            </motion.div>
            <div className="flex gap-4 mt-4">
              {productImages.map((img, idx) => (<div key={idx} onClick={() => setSelectedImage(idx)} className={`w-24 h-24 rounded-lg overflow-hidden cursor-pointer border-2 transition-all duration-300 ${selectedImage === idx ? 'border-primary-500 shadow-lg' : 'border-transparent hover:border-primary-300'}`}><img src={img} alt={`${product.name} view ${idx + 1}`} className="w-full h-full object-cover" /></div>))}
            </div>
          </div>
          <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} className="lg:w-1/2">
            {product.badge && (<div className="inline-block bg-primary-500 text-white px-3 py-1 rounded-full text-sm font-semibold mb-3">{product.badge}</div>)}
            <h1 className="text-4xl font-bold text-gray-800 mb-4">{product.name}</h1>
            <div className="flex items-center gap-4 mb-4"><div className="flex items-center">{[...Array(5)].map((_, i) => (<Star key={i} className={`w-5 h-5 ${i < Math.floor(parseFloat(product.rating) || 0) ? 'text-yellow-400' : 'text-gray-300'}`} />))}<span className="ml-2 text-gray-600">{parseFloat(product.rating).toFixed(1)} ({product.reviews_count || 0} reviews)</span></div></div>
            <div className="text-4xl font-bold text-primary-500 mb-6">R{displayPrice.toFixed(2)}</div>
            <p className="text-gray-600 mb-6 leading-relaxed">{product.description || defaultFeatures[0]}</p>
            {sizeOptions.length > 1 && (<div className="mb-6"><h3 className="text-lg font-semibold text-gray-800 mb-3">Select Size:</h3><div className="flex flex-wrap gap-3">{sizeOptions.map((size) => (<button key={size.label} onClick={() => setSelectedSize(size.label)} disabled={!size.inStock} className={`px-6 py-2 rounded-full transition-all duration-300 ${selectedSize === size.label ? 'bg-primary-500 text-white shadow-md' : size.inStock ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}>{size.label} - R{parseFloat(size.price).toFixed(2)}</button>))}</div></div>)}
            <div className="mb-4"><span className={`text-sm font-semibold ${parseInt(product.stock) > 0 ? 'text-green-600' : 'text-red-600'}`}>{parseInt(product.stock) > 0 ? `✓ In Stock (${product.stock} units available)` : '✗ Out of Stock'}</span></div>
            {parseInt(product.stock) > 0 && (<div className="mb-6"><h3 className="text-lg font-semibold text-gray-800 mb-3">Quantity:</h3><div className="flex items-center gap-3"><button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100"><Remove /></button><span className="text-xl font-semibold w-12 text-center">{quantity}</span><button onClick={() => setQuantity(Math.min(parseInt(product.stock), quantity + 1))} className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100"><Add /></button></div></div>)}
            <div className="flex gap-4 mb-8"><button onClick={handleAddToCart} disabled={parseInt(product.stock) === 0} className={`flex-1 btn-primary inline-flex items-center justify-center gap-2 ${parseInt(product.stock) === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}><ShoppingCart /> {parseInt(product.stock) > 0 ? 'Add to Cart' : 'Out of Stock'}</button><button className="w-12 h-12 rounded-full border border-gray-300 flex items-center justify-center hover:bg-pink-50"><Favorite className="text-gray-600" /></button><button className="w-12 h-12 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"><Share className="text-gray-600" /></button></div>
            <div className="border-t border-gray-200 pt-6"><h3 className="text-lg font-semibold text-gray-800 mb-3">Features:</h3><ul className="space-y-2">{defaultFeatures.map((feature, idx) => (<li key={idx} className="flex items-center gap-2 text-gray-600"><span className="text-green-500">✓</span> {feature}</li>))}</ul></div>
            <div className="grid grid-cols-3 gap-4 mt-8 pt-6 border-t border-gray-200"><div className="text-center"><LocalShipping className="text-primary-500 w-8 h-8 mx-auto mb-2" /><p className="text-sm text-gray-600">Free Shipping</p><p className="text-xs text-gray-400">On orders over R500</p></div><div className="text-center"><Security className="text-primary-500 w-8 h-8 mx-auto mb-2" /><p className="text-sm text-gray-600">Secure Payment</p><p className="text-xs text-gray-400">100% protected</p></div><div className="text-center"><Cached className="text-primary-500 w-8 h-8 mx-auto mb-2" /><p className="text-sm text-gray-600">30 Day Returns</p><p className="text-xs text-gray-400">Easy returns</p></div></div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;