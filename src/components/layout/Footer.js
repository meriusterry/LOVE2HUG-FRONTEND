import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, YouTube, Email, Phone, Room, WhatsApp } from '@mui/icons-material';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div>
            <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-primary-400 to-primary-500 bg-clip-text text-transparent">
              Love2Cuddle 🧸
            </h3>
            <p className="text-gray-400 mb-4">
              Bringing joy and comfort through our giant teddy bears. Perfect for all ages and occasions.
            </p>
            <div className="flex space-x-3">
              <a 
                href="https://www.facebook.com/share/1Xp2AQB5XC/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-gray-800 p-2 rounded-full hover:bg-primary-500 transition-colors duration-300"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a 
                href="https://www.instagram.com/love2.cuddle?igsh=MXRtM3ZhazIxY2dvZA==" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-gray-800 p-2 rounded-full hover:bg-primary-500 transition-colors duration-300"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a 
                href="https://twitter.com/love2hug" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-gray-800 p-2 rounded-full hover:bg-primary-500 transition-colors duration-300"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a 
                href="https://youtube.com/love2hug" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-gray-800 p-2 rounded-full hover:bg-primary-500 transition-colors duration-300"
                aria-label="YouTube"
              >
                <YouTube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link to="/shop" className="text-gray-400 hover:text-primary-400 transition-colors duration-300">Shop All</Link></li>
              <li><Link to="/about" className="text-gray-400 hover:text-primary-400 transition-colors duration-300">About Us</Link></li>
              <li><Link to="/contact" className="text-gray-400 hover:text-primary-400 transition-colors duration-300">Contact</Link></li>
              <li><Link to="/orders" className="text-gray-400 hover:text-primary-400 transition-colors duration-300">My Orders</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Support</h4>
            <ul className="space-y-2">
              <li><Link to="/faq" className="text-gray-400 hover:text-primary-400 transition-colors duration-300">FAQ</Link></li>
              <li><Link to="/shipping" className="text-gray-400 hover:text-primary-400 transition-colors duration-300">Shipping Info</Link></li>
              <li><Link to="/returns" className="text-gray-400 hover:text-primary-400 transition-colors duration-300">Returns Policy</Link></li>
              <li><Link to="/privacy" className="text-gray-400 hover:text-primary-400 transition-colors duration-300">Privacy Policy</Link></li>
            </ul>
          </div>

          {/* Contact Info - South Africa */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-gray-400">
                <Room className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <span>11 Van Trump, Belgravia<br />Cape Town, 7535<br />South Africa</span>
              </li>
              <li className="flex items-center gap-2 text-gray-400">
                <Phone className="w-5 h-5 flex-shrink-0" />
                <a href="tel:+27712371486" className="hover:text-primary-400 transition-colors">
                  +27 (0) 71 237 1486
                </a>
              </li>
              <li className="flex items-center gap-2 text-gray-400">
                <WhatsApp className="w-5 h-5 flex-shrink-0" />
                <a href="https://wa.me/27712371486" target="_blank" rel="noopener noreferrer" className="hover:text-primary-400 transition-colors">
                  +27 71 237 1486 (WhatsApp)
                </a>
              </li>
              <li className="flex items-center gap-2 text-gray-400">
                <Email className="w-5 h-5 flex-shrink-0" />
                <a href="mailto:teddybears.love2cuddle@gmail.com" className="hover:text-primary-400 transition-colors">
                  teddybears.love2cuddle@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm">
          <p>© {currentYear} Love2Cuddle. All rights reserved. Made with ❤️ for teddy bear lovers in South Africa.</p>
          <div className="mt-2 space-x-4">
            <Link to="/terms" className="hover:text-primary-400 transition-colors">Terms of Service</Link>
            <span>|</span>
            <Link to="/privacy" className="hover:text-primary-400 transition-colors">Privacy Policy</Link>
            <span>|</span>
            <Link to="/cookies" className="hover:text-primary-400 transition-colors">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;