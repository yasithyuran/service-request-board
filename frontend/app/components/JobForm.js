'use client';

import { useState } from 'react';

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
        if (!value.trim()) return '⟡ title is required';
        if (value.length > 100) return '◆ title too long';
        return '';
      case 'description':
        if (!value.trim()) return '◈ description is required';
        if (value.length > 1000) return '◇ description too long';
        return '';
      case 'category':
        if (!value) return '⟡ category is required';
        return '';
      case 'location':
        if (!value.trim()) return '◆ location is required';
        return '';
      case 'contactName':
        if (!value.trim()) return '◈ contact name is required';
        return '';
      case 'contactEmail':
        if (!value.trim()) return '⟡ email is required';
        if (!/\S+@\S+\.\S+/.test(value)) return '◇ invalid email';
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
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label>⟡ title</label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="what needs to be done?"
        />
        {errors.title && touched.title && <div style={{ color: 'var(--text-secondary)', fontSize: '0.7rem', marginTop: '0.25rem' }}>◇ {errors.title}</div>}
      </div>

      <div className="form-group">
        <label>◈ description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          onBlur={handleBlur}
          rows="4"
          placeholder="describe the job in detail..."
        />
        {errors.description && touched.description && <div style={{ color: 'var(--text-secondary)', fontSize: '0.7rem', marginTop: '0.25rem' }}>◆ {errors.description}</div>}
      </div>

      <div className="form-group">
        <label>⟡ category</label>
        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          onBlur={handleBlur}
        >
          <option value="">select</option>
          <option value="Plumbing">◇ plumbing</option>
          <option value="Electrical">◆ electrical</option>
          <option value="Painting">⟡ painting</option>
          <option value="Joinery">◈ joinery</option>
          <option value="Other">◇ other</option>
        </select>
        {errors.category && touched.category && <div style={{ color: 'var(--text-secondary)', fontSize: '0.7rem', marginTop: '0.25rem' }}>◆ {errors.category}</div>}
      </div>

      <div className="form-group">
        <label>◈ location</label>
        <input
          type="text"
          name="location"
          value={formData.location}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="city, area"
        />
        {errors.location && touched.location && <div style={{ color: 'var(--text-secondary)', fontSize: '0.7rem', marginTop: '0.25rem' }}>⟡ {errors.location}</div>}
      </div>

      <div className="form-group">
        <label>◆ contact name</label>
        <input
          type="text"
          name="contactName"
          value={formData.contactName}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="your name"
        />
        {errors.contactName && touched.contactName && <div style={{ color: 'var(--text-secondary)', fontSize: '0.7rem', marginTop: '0.25rem' }}>◇ {errors.contactName}</div>}
      </div>

      <div className="form-group">
        <label>⟡ contact email</label>
        <input
          type="email"
          name="contactEmail"
          value={formData.contactEmail}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="your@email.com"
        />
        {errors.contactEmail && touched.contactEmail && <div style={{ color: 'var(--text-secondary)', fontSize: '0.7rem', marginTop: '0.25rem' }}>◈ {errors.contactEmail}</div>}
      </div>

      {isEditing && (
        <div className="form-group">
          <label>◇ status</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
          >
            <option value="Open">⟡ open</option>
            <option value="In Progress">◆ in progress</option>
            <option value="Closed">◈ closed</option>
          </select>
        </div>
      )}

      <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
        {isEditing ? '⟡ / update' : '⟡ / publish'}
      </button>
    </form>
  );
}