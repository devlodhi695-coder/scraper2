import React from 'react';
import { Star, ExternalLink } from 'lucide-react';
import { Product } from '../types';

interface DataTableProps {
  data: Product[];
}

const DataTable: React.FC<DataTableProps> = ({ data }) => {
  if (data.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
        <div className="inline-block p-4 rounded-full bg-blue-50 mb-4">
          <Star className="h-8 w-8 text-blue-200" />
        </div>
        <h3 className="text-lg font-medium text-gray-900">No data available</h3>
        <p className="mt-2 text-sm text-gray-500">Enter a query and click "Scrape Data" to see results.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product Name</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price (₹)</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reviews</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Discount</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((product) => (
              <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <div className="h-10 w-10 flex-shrink-0">
                      <img className="h-10 w-10 rounded-md object-cover border" src={product.imageUrl} alt="" />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900 line-clamp-2 w-64" title={product.name}>
                        {product.name}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-bold text-gray-900">₹{product.price.toLocaleString('en-IN')}</div>
                  <div className="text-xs text-gray-500 line-through">₹{product.originalPrice.toLocaleString('en-IN')}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium text-white
                    ${product.rating >= 4 ? 'bg-green-600' : product.rating >= 3 ? 'bg-yellow-500' : 'bg-red-500'}`}>
                    {product.rating.toFixed(1)} <Star className="ml-1 h-3 w-3 fill-current" />
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {product.reviewCount.toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-semibold">
                  {product.discount}% Off
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <a href={product.productUrl} target="_blank" rel="noopener noreferrer" className="text-[#2874f0] hover:text-blue-800">
                    <ExternalLink className="h-5 w-5" />
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 text-sm text-gray-500">
        Showing {data.length} results
      </div>
    </div>
  );
};

export default DataTable;