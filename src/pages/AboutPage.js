import React from 'react';
import { motion } from 'framer-motion';
import { Favorite, EmojiEmotions, Group, History } from '@mui/icons-material';

const AboutPage = () => {
  const values = [
    {
      icon: <Favorite className="w-12 h-12 text-primary-500" />,
      title: 'Quality First',
      description: 'We use only the highest quality materials to ensure every bear is soft, durable, and safe.'
    },
    {
      icon: <EmojiEmotions className="w-12 h-12 text-primary-500" />,
      title: 'Customer Happiness',
      description: 'Your smile is our success. We go above and beyond to ensure you love your new friend.'
    },
    {
      icon: <Group className="w-12 h-12 text-primary-500" />,
      title: 'Community Focused',
      description: 'We donate a portion of every sale to children\'s hospitals and charities.'
    },
    {
      icon: <History className="w-12 h-12 text-primary-500" />,
      title: 'Timeless Craftsmanship',
      description: 'Each bear is handcrafted with attention to detail and traditional techniques.'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary-500 to-primary-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-6xl font-bold mb-4"
          >
            Our Story
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl opacity-90 max-w-2xl mx-auto"
          >
            Bringing hugs and happiness to people around the world since 2026
          </motion.p>
        </div>
      </div>

      {/* Story Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">The Love2Hug Journey</h2>
            <div className="w-24 h-1 bg-primary-500 mx-auto mb-8"></div>
          </motion.div>
          
          <div className="space-y-8 text-gray-600 text-lg leading-relaxed">
            <motion.p
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              Love2Hug was born from a simple idea: everyone deserves a giant, huggable friend. 
              What started as a small family business has grown into a beloved brand known for 
              creating the softest, most huggable teddy bears on the market.
            </motion.p>
            
            <motion.p
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Our founder, Sarah Johnson, noticed that people of all ages found comfort in stuffed 
              animals, but there was a lack of truly oversized, high-quality options. In 2026, she 
              decided to change that by creating Love2Hug, specializing in giant teddy bears that 
              are perfect for hugging, decorating, or gifting.
            </motion.p>
            
            <motion.p
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              Today, Love2Hug has brought joy to thousands of customers worldwide. From birthday 
              surprises to anniversary gifts, from hospital comfort to college dorm decorations, 
              our bears have been there for life's special moments.
            </motion.p>
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="bg-gray-50 py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Our Values</h2>
            <div className="w-24 h-1 bg-primary-500 mx-auto mb-8"></div>
            <p className="text-gray-600 max-w-2xl mx-auto">
              What makes Love2Hug special isn't just our bears—it's how we make them and why we do it.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="inline-block p-4 bg-white rounded-full shadow-lg mb-4">
                  {value.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-4xl font-bold mb-4"
          >
            Ready to Find Your New Best Friend?
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl opacity-90 mb-8"
          >
            Shop our collection of giant teddy bears today
          </motion.p>
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            onClick={() => window.location.href = '/shop'}
            className="bg-white text-primary-500 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105"
          >
            Shop Now
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;