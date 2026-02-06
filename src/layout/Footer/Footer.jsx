import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaFacebook, FaInstagram, FaTwitter, FaPhoneAlt, FaEnvelope } from 'react-icons/fa';
import logo_img from '../../User/worker/Assets/logo.jpg'; // Adjust path to your logo

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white pt-12 pb-6">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        
        {/* Column 1: Brand & About */}
        <div className="flex flex-col space-y-4">
          <div className="flex items-center gap-2">
            <img src={logo_img} alt="Logo" className="w-10 h-10 rounded-full" />
            <span className="text-xl font-bold tracking-tight text-amber-400">HelpNearBy</span>
          </div>
          <p className="text-gray-400 text-sm leading-relaxed">
            Your all-in-one platform for daily needs. From groceries to skilled workers 
            and medical supplies, we bring local services to your doorstep.
          </p>
          <div className="flex space-x-4 text-xl">
            <FaFacebook className="hover:text-amber-400 cursor-pointer transition" />
            <FaInstagram className="hover:text-amber-400 cursor-pointer transition" />
            <FaTwitter className="hover:text-amber-400 cursor-pointer transition" />
          </div>
        </div>

        {/* Column 2: Quick Links (Services) */}
        <div>
          <h3 className="text-lg font-semibold mb-4 border-b border-gray-700 pb-2">Our Services</h3>
          <ul className="space-y-2 text-gray-400 text-sm">
            <li><NavLink to="/grocery" className="hover:text-amber-400 transition">Grocery Store</NavLink></li>
            <li><NavLink to="/worker" className="hover:text-amber-400 transition">Find Workers</NavLink></li>
            <li><NavLink to="/medical" className="hover:text-amber-400 transition">Medical & Pharmacy</NavLink></li>
            <li><NavLink to="/worker/request" className="hover:text-amber-400 transition">Service Requests</NavLink></li>
          </ul>
        </div>

        {/* Column 3: Support */}
        <div>
          <h3 className="text-lg font-semibold mb-4 border-b border-gray-700 pb-2">Support</h3>
          <ul className="space-y-2 text-gray-400 text-sm">
            <li><NavLink to="/about" className="hover:text-amber-400 transition">About Us</NavLink></li>
            <li><NavLink to="/contact" className="hover:text-amber-400 transition">Contact Us</NavLink></li>
            <li><NavLink to="/privacy" className="hover:text-amber-400 transition">Privacy Policy</NavLink></li>
            <li><NavLink to="/terms" className="hover:text-amber-400 transition">Terms & Conditions</NavLink></li>
          </ul>
        </div>

        {/* Column 4: Contact Info */}
        <div>
          <h3 className="text-lg font-semibold mb-4 border-b border-gray-700 pb-2">Get In Touch</h3>
          <ul className="space-y-4 text-gray-400 text-sm">
            <li className="flex items-center gap-3">
              <FaPhoneAlt className="text-amber-400" />
              <span>+91 98765 43210</span>
            </li>
            <li className="flex items-center gap-3">
              <FaEnvelope className="text-amber-400" />
              <span>support@nearkaamwala.com</span>
            </li>
            <li className="leading-tight">
              123, Service Lane, Amravati,<br />
              Maharashtra, India - 444601
            </li>
          </ul>
        </div>

      </div>

      {/* Bottom Copyright Bar */}
      <div className="mt-12 border-t border-gray-800 pt-6 text-center text-gray-500 text-xs">
        <p>&copy; {new Date().getFullYear()} NearKaamWala. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;