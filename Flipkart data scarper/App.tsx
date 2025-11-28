import React, { useState } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import DataTable from './components/DataTable';
import ExportActions from './components/ExportActions';
import { Product, ScrapeSettings } from './types';
import { scrapeFlipkartData, generatePlaceholderImage } from './services/geminiService';
import { Info } from 'lucide-react';

const App: React.FC = () => {
  const [settings, setSettings] = useState<ScrapeSettings>({
    query: '',
    pages: 1
  });
  const [data, setData] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleScrape = async () => {
    if (!settings.query) return;

    setIsLoading(true);
    setError(null);
    setData([]);

    try {
      // Simulate network delay for "Scraping" feel
      // await new Promise(resolve => setTimeout(resolve, 1500));
      const results = await scrapeFlipkartData(settings.query, settings.pages);
      setData(results);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred during scraping.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateImage = async () => {
    if (data.length === 0) return;

    setIsLoading(true);
    setError(null);

    try {
      // We process the images in batches to avoid overwhelming the API and hitting rate limits
      // processing 50 images at once would likely fail.
      const BATCH_SIZE = 3;
      const updatedData = [...data];

      for (let i = 0; i < updatedData.length; i += BATCH_SIZE) {
        const batch = updatedData.slice(i, i + BATCH_SIZE);
        
        await Promise.all(
          batch.map(async (product, batchIndex) => {
            const globalIndex = i + batchIndex;
            try {
              // Generate unique image for each product based on its name
              const newImageUrl = await generatePlaceholderImage(product.name);
              
              if (newImageUrl) {
                updatedData[globalIndex] = {
                  ...product,
                  imageUrl: newImageUrl
                };
              }
            } catch (e) {
              console.warn(`Failed to generate image for product: ${product.name}`, e);
              // On error, we simply keep the original placeholder image
            }
          })
        );

        // Update state incrementally to provide visual progress to the user
        setData([...updatedData]);
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while generating images.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row lg:space-x-8">
          
          {/* Left Sidebar (Filters/Input) */}
          <aside className="mb-8 lg:mb-0 flex-shrink-0">
            <Sidebar 
              settings={settings} 
              setSettings={setSettings} 
              onScrape={handleScrape}
              onGenerateImage={handleGenerateImage}
              isLoading={isLoading}
              hasData={data.length > 0}
            />
            
            <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
              <div className="flex">
                <div className="flex-shrink-0">
                  <Info className="h-5 w-5 text-yellow-400" aria-hidden="true" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-yellow-800">Scraping Note</h3>
                  <div className="mt-2 text-sm text-yellow-700">
                    <p>
                      Due to browser security restrictions (CORS), this application uses AI to <strong>simulate</strong> the extraction of data based on your query. A real Python backend would be required for live scraping.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Right Content (Data Display) */}
          <section className="flex-grow">
            {error && (
              <div className="mb-6 bg-red-50 border-l-4 border-red-400 p-4">
                <div className="flex">
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">
                {data.length > 0 ? `Results for "${settings.query}"` : 'Product Data'}
              </h2>
              <ExportActions data={data} />
            </div>

            <DataTable data={data} />
          </section>
        </div>
      </main>

      <footer className="bg-white border-t py-6 mt-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm text-gray-500">
          &copy; {new Date().getFullYear()} Flipkart Data Scraper Project. For Educational Purposes Only.
        </div>
      </footer>
    </div>
  );
};

export default App;