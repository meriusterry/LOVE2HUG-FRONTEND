import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Email, Phone, Room, AccessTime, Send, WhatsApp, Instagram, Facebook, CheckCircle } from '@mui/icons-material';
import toast from 'react-hot-toast';
import api from '../services/api';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await api.post('/contact', formData);
      
      if (response.data.success) {
        setSubmitted(true);
        toast.success('Message sent successfully! We\'ll get back to you soon.');
        setFormData({ name: '', email: '', subject: '', message: '' });
        
        // Reset submitted status after 5 seconds
        setTimeout(() => setSubmitted(false), 5000);
      }
    } catch (error) {
      console.error('Contact form error:', error);
      toast.error(error.response?.data?.message || 'Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    { icon: <Phone className="w-6 h-6" />, title: 'Phone', details: '+27 (0) 71 237 1486', action: 'Call us now', link: 'tel:+27712371486' },
    { icon: <WhatsApp className="w-6 h-6" />, title: 'WhatsApp', details: '+27 71 237 1486', action: 'Message us on WhatsApp', link: 'https://wa.me/27712371486' },
    { icon: <Email className="w-6 h-6" />, title: 'Email', details: 'teddybears.love2cuddle@gmail.com', action: 'Send email', link: 'mailto:teddybears.love2cuddle@gmail.com' },
    { icon: <Room className="w-6 h-6" />, title: 'Address', details: '11 Van Tromp, Belgravia, Cape Town, 7535', action: 'Get directions', link: 'https://maps.google.com/?q=belgravia+capetown' },
{ 
  icon: <AccessTime className="w-6 h-6" />, 
  title: 'Hours', 
  details: 'Open 7 days a week, 24/7', 
  action: 'Always available online', 
  link: null 
},
  ];

  // Johannesburg, South Africa coordinates
  const johannesburgLat = -26.2041;
  const johannesburgLng = 28.0473;
  const mapEmbedUrl = `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14363.424891178627!2d${johannesburgLng}!3d${johannesburgLat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1e9575a5f5e5e5e5%3A0x5e5e5e5e5e5e5e5e!2sSandton%2C%20Johannesburg!5e0!3m2!1sen!2sza!4v1700000000000!5m2!1sen!2sza`;

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary-500 to-primary-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold mb-4"
          >
            Get in Touch
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl opacity-90"
          >
            We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </motion.p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-2xl shadow-lg p-8"
          >
            {!submitted ? (
              <>
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Send Us a Message</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Your Name *</label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="John Doe"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="john@example.com"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Subject *</label>
                    <input
                      type="text"
                      name="subject"
                      required
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Order inquiry, product question, etc."
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Message *</label>
                    <textarea
                      name="message"
                      required
                      rows="5"
                      value={formData.message}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Tell us how we can help..."
                    />
                  </div>
                  
                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full btn-primary inline-flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        Send Message
                      </>
                    )}
                  </button>
                </form>
              </>
            ) : (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-10 h-10 text-green-500" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">Message Sent!</h3>
                <p className="text-gray-600">
                  Thank you for contacting us. We'll get back to you within 24 hours.
                </p>
              </div>
            )}
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Contact Information</h2>
              <div className="space-y-6">
                {contactInfo.map((info, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="text-primary-500 mt-1">{info.icon}</div>
                    <div>
                      <h3 className="font-semibold text-gray-800">{info.title}</h3>
                      <p className="text-gray-600">{info.details}</p>
                      {info.link && (
                        <a 
                          href={info.link}
                          target={info.title === 'Address' ? '_blank' : '_self'}
                          rel="noopener noreferrer"
                          className="text-primary-500 text-sm hover:text-primary-600 mt-1 inline-block"
                        >
                          {info.action} →
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Social Media Links */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Follow Us</h2>
              <div className="flex gap-4">
                <button 
                  onClick={() => window.open('https://www.facebook.com/share/1Xp2AQB5XC/', '_blank')}
                  className="flex-1 bg-gradient-to-r from-pink-500 to-pink-600 text-white p-3 rounded-lg hover:scale-105 transition-transform flex items-center justify-center gap-2"
                >
                  <Instagram className="w-5 h-5" />
                  Instagram
                </button>
                <button 
                  onClick={() => window.open('https://www.instagram.com/love2.cuddle?igsh=MXRtM3ZhazIxY2dvZA==', '_blank')}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white p-3 rounded-lg hover:scale-105 transition-transform flex items-center justify-center gap-2"
                >
                  <Facebook className="w-5 h-5" />
                  Facebook
                </button>
              </div>
            </div>

            {/* Map */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Visit Our Showroom</h2>
              <div className="h-80 bg-gray-200 rounded-lg overflow-hidden shadow-inner">
                <iframe
                  title="Love2Hug Showroom - Johannesburg"
                  src={mapEmbedUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
              <p className="text-sm text-gray-500 mt-3 text-center">
                📍 Located in Sandton, Johannesburg - South Africa's premier shopping destination
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;