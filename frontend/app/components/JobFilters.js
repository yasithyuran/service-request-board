'use client';

import { useState } from 'react';

const categories = ['All', 'Plumbing', 'Electrical', 'Painting', 'Joinery', 'Other'];
const statuses = ['All', 'Open', 'In Progress', 'Closed'];

export default function JobFilters({ onFilterChange }) {
  const [category, setCategory] = useState('');
  const [status, setStatus] = useState('');
  const [search, setSearch] = useState('');

  const handleFilterChange = () => {
    onFilterChange({ category, status, search });
  };

  const handleReset = () => {
    setCategory('');
    setStatus('');
    setSearch('');
    onFilterChange({ category: '', status: '', search: '' });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setTimeout(handleFilterChange, 300);
            }}
            placeholder="Search by title or description..."
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
          <select
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              setTimeout(handleFilterChange, 0);
            }}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Categories</option>
            {categories.filter(c => c !== 'All').map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setTimeout(handleFilterChange, 0);
            }}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Statuses</option>
            {statuses.filter(s => s !== 'All').map(stat => (
              <option key={stat} value={stat}>{stat}</option>
            ))}
          </select>
        </div>
        
        <div className="flex items-end">
          <button
            onClick={handleReset}
            className="w-full px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
          >
            Reset Filters
          </button>
        </div>
      </div>
    </div>
  );
}