'use client';

import { useState } from 'react';

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
    <div className="filters">
      <div className="filter-group">
        <label>⟡ search</label>
        <input
          type="text"
          placeholder="title or description..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setTimeout(handleFilterChange, 300);
          }}
        />
      </div>
      
      <div className="filter-group">
        <label>◈ category</label>
        <select
          value={category}
          onChange={(e) => {
            setCategory(e.target.value);
            setTimeout(handleFilterChange, 0);
          }}
        >
          <option value="">⟡ all</option>
          <option value="Plumbing">◇ plumbing</option>
          <option value="Electrical">◆ electrical</option>
          <option value="Painting">⟡ painting</option>
          <option value="Joinery">◈ joinery</option>
          <option value="Other">◇ other</option>
        </select>
      </div>
      
      <div className="filter-group">
        <label>◆ status</label>
        <select
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
            setTimeout(handleFilterChange, 0);
          }}
        >
          <option value="">⟡ all</option>
          <option value="Open">◇ open</option>
          <option value="In Progress">◆ in progress</option>
          <option value="Closed">◈ closed</option>
        </select>
      </div>
      
      <div className="filter-group">
        <label>&nbsp;</label>
        <button onClick={handleReset} className="btn btn-outline" style={{ width: '100%' }}>
          ⟡ / reset
        </button>
      </div>
    </div>
  );
}