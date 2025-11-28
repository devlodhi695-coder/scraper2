import React from 'react';
import { ShoppingBag } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-[#2874f0] text-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0">
          <div className="flex items-center space-x-3">
            <ShoppingBag className="h-8 w-8 text-yellow-400" />
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Flipkart Data Scraper</h1>
              <p className="text-xs text-blue-100 font-medium italic">
                Project by Adarsh Pandey, Arpit Tiwari, Abhishek Sen, Dev Lodhi
              </p>
            </div>
          </div>
          <div className="text-sm bg-blue-600 px-3 py-1 rounded-full border border-blue-400 opacity-90">
            v1.0.0 • React Edition
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;