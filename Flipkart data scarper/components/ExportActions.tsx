import React from 'react';
import { Download, FileJson } from 'lucide-react';
import { Product } from '../types';

interface ExportActionsProps {
  data: Product[];
}

const ExportActions: React.FC<ExportActionsProps> = ({ data }) => {
  const isDisabled = data.length === 0;

  const downloadCSV = () => {
    if (isDisabled) return;
    
    const headers = ['Product Name', 'Price (INR)', 'Original Price', 'Rating', 'Reviews', 'Discount (%)', 'URL'];
    const rows = data.map(p => [
      `"${p.name.replace(/"/g, '""')}"`, // Escape quotes
      p.price,
      p.originalPrice,
      p.rating,
      p.reviewCount,
      p.discount,
      p.productUrl
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "flipkart_data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadJSON = () => {
    if (isDisabled) return;

    const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(
      JSON.stringify(data, null, 2)
    )}`;
    const link = document.createElement("a");
    link.href = jsonString;
    link.download = "flipkart_data.json";
    link.click();
  };

  return (
    <div className="flex space-x-3 mb-4 justify-end">
      <button
        onClick={downloadCSV}
        disabled={isDisabled}
        className={`inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white 
          ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'}`}
      >
        <Download className="mr-2 h-4 w-4 text-green-600" />
        Export CSV
      </button>
      <button
        onClick={downloadJSON}
        disabled={isDisabled}
        className={`inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white 
          ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'}`}
      >
        <FileJson className="mr-2 h-4 w-4 text-orange-500" />
        Export JSON
      </button>
    </div>
  );
};

export default ExportActions;