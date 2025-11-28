import React from 'react';
import { Search, Sliders, Database, Image as ImageIcon } from 'lucide-react';
import { ScrapeSettings } from '../types';

interface SidebarProps {
  settings: ScrapeSettings;
  setSettings: React.Dispatch<React.SetStateAction<ScrapeSettings>>;
  onScrape: () => void;
  onGenerateImage: () => void;
  isLoading: boolean;
  hasData: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ settings, setSettings, onScrape, onGenerateImage, isLoading, hasData }) => {
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSettings(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSettings(prev => ({ ...prev, pages: parseInt(e.target.value) }));
  };

  return (
    <div className="w-full lg:w-80 bg-white p-6 rounded-lg shadow-sm border border-gray-200 h-fit">
      <div className="flex items-center space-x-2 mb-6 border-b pb-4">
        <Sliders className="h-5 w-5 text-[#2874f0]" />
        <h2 className="text-lg font-semibold text-gray-800">Parameters</h2>
      </div>

      <div className="space-y-6">
        {/* Search Query */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Search Query
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              name="query"
              value={settings.query}
              onChange={handleInputChange}
              className="pl-10 block w-full border-gray-300 rounded-md shadow-sm focus:ring-[#2874f0] focus:border-[#2874f0] sm:text-sm border p-2.5"
              placeholder="e.g. Laptops, Shoes"
            />
          </div>
        </div>

        {/* Number of Pages */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium text-gray-700">
              Pages to Scrape
            </label>
            <span className="text-xs font-semibold bg-gray-100 text-gray-600 px-2 py-1 rounded">
              {settings.pages} {settings.pages === 1 ? 'Page' : 'Pages'}
            </span>
          </div>
          <input
            type="range"
            min="1"
            max="5"
            step="1"
            value={settings.pages}
            onChange={handleSliderChange}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#2874f0]"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>1</span>
            <span>5</span>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            *Higher page counts take longer to process.
          </p>
        </div>

        <div className="space-y-3 pt-4 border-t border-gray-100">
          {/* Scrape Button */}
          <button
            onClick={onScrape}
            disabled={isLoading || !settings.query.trim()}
            className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white 
              ${isLoading || !settings.query.trim() 
                ? 'bg-blue-300 cursor-not-allowed' 
                : 'bg-[#fb641b] hover:bg-[#e85812] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#fb641b] transition-colors duration-200'}`}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Scraping...
              </>
            ) : (
              <>
                <Database className="mr-2 h-4 w-4" />
                Scrape Data
              </>
            )}
          </button>

          {/* Generate Image Button */}
          <button
            onClick={onGenerateImage}
            disabled={isLoading || !hasData}
            className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium
              ${isLoading || !hasData
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200'
                : 'bg-white text-blue-600 border-blue-600 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200'}`}
          >
            <ImageIcon className="mr-2 h-4 w-4" />
            Generate AI Image
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
