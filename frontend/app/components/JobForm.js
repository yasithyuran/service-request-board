'use client';

import { useState } from 'react';

const categories = ['Plumbing', 'Electrical', 'Painting', 'Joinery', 'Other'];

export default function JobForm({ onSubmit, initialData = {}, isEditing = false }) {
  const [formData, setFormData] = useState({
    title: initialData.title || '',
    description: initialData.description || '',
    category: initialData.category || '',
    location: initialData.location || '',
    contactName: initialData.contactName || '',
    contactEmail: initialData.contactEmail || '',
    status: initialData.status || 'Open'
  });
  
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const validateField = (name, value) => {
    switch (name) {
      case 'title':
        if (!value.trim()) return 'Title is required';
        if (value.length > 100) return 'Title cannot exceed 100 characters';
        return '';
      case 'description':
        if (!value.trim()) return 'Description is required';
        if (value.length > 1000) return 'Description cannot exceed 1000 characters';
        return '';
      case 'category':
        if (!value) return 'Category is required';
        return '';
      case 'location':
        if (!value.trim()) return 'Location is required';
        return '';
      case 'contactName':
        if (!value.trim()) return 'Contact name is required';
        return '';
      case 'contactEmail':
        if (!value.trim()) return 'Email is required';
        if (!/\S+@\S+\.\S+/.test(value)) return 'Email is invalid';
        return '';
      default:
        return '';
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (touched[name]) {
      const error = validateField(name, value);
      setErrors(prev => ({ ...prev, [name]: error }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    const error = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate all fields
    const newErrors = {};
    const newTouched = {};
    Object.keys(formData).forEach(key => {
      newTouched[key] = true;
      const error = validateField(key, formData[key]);
      if (error) newErrors[key] = error;
    });
    
    setTouched(newTouched);
    setErrors(newErrors);
    
    if (Object.keys(newErrors).length === 0) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Job Title <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          onBlur={handleBlur}
          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition
            ${errors.title && touched.title ? 'border-red-500' : 'border-gray-300'}`}
          placeholder="e.g., Need a plumber for leaking kitchen tap"
        />
        {errors.title && touched.title && (
          <p className="mt-1 text-sm text-red-500">{errors.title}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Description <span className="text-red-500">*</span>
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          onBlur={handleBlur}
          rows="4"
          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition
            ${errors.description && touched.description ? 'border-red-500' : 'border-gray-300'}`}
          placeholder="Describe the job in detail..."
        />
        {errors.description && touched.description && (
          <p className="mt-1 text-sm text-red-500">{errors.description}</p>
        )}
        <p className="mt-1 text-xs text-gray-500">
          {formData.description.length}/1000 characters
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category <span className="text-red-500">*</span>
          </label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition
              ${errors.category && touched.category ? 'border-red-500' : 'border-gray-300'}`}
          >
            <option value="">Select a category</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          {errors.category && touched.category && (
            <p className="mt-1 text-sm text-red-500">{errors.category}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Location <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition
              ${errors.location && touched.location ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="e.g., Glasgow"
          />
          {errors.location && touched.location && (
            <p className="mt-1 text-sm text-red-500">{errors.location}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Contact Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="contactName"
            value={formData.contactName}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition
              ${errors.contactName && touched.contactName ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="Your full name"
          />
          {errors.contactName && touched.contactName && (
            <p className="mt-1 text-sm text-red-500">{errors.contactName}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Contact Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            name="contactEmail"
            value={formData.contactEmail}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition
              ${errors.contactEmail && touched.contactEmail ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="your@email.com"
          />
          {errors.contactEmail && touched.contactEmail && (
            <p className="mt-1 text-sm text-red-500">{errors.contactEmail}</p>
          )}
        </div>
      </div>

      {isEditing && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Status
          </label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="Open">Open</option>
            <option value="In Progress">In Progress</option>
            <option value="Closed">Closed</option>
          </select>
        </div>
      )}

      <button
        type="submit"
        className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 rounded-lg hover:from-blue-600 hover:to-blue-700 transition transform hover:scale-[1.02] font-semibold shadow-md"
      >
        {isEditing ? 'Update Job' : 'Post Job'}
      </button>
    </form>
  );
}