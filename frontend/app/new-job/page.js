'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../context/AuthContext';
import LoginModal from '../components/LoginModal';

export default function NewJob() {
  const router = useRouter();
  const { user } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    location: '',
    contactName: '',
    contactEmail: '',
    status: 'Open'
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const categories = ['Plumbing', 'Electrical', 'Painting', 'Joinery', 'Other'];

  useEffect(() => {
    if (!user) {
      setShowLoginModal(true);
    }
  }, [user]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.location.trim()) newErrors.location = 'Location is required';
    if (!formData.contactName.trim()) newErrors.contactName = 'Contact name is required';
    if (!formData.contactEmail.trim()) {
      newErrors.contactEmail = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.contactEmail)) {
      newErrors.contactEmail = 'Email is invalid';
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) {
      setShowLoginModal(true);
      return;
    }
    
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setSubmitting(true);
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/jobs`, formData);
      router.push('/');
    } catch (error) {
      console.error('Error creating job:', error);
      alert(error.response?.data?.message || 'Failed to create job');
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  if (!user) {
    return <LoginModal isOpen={showLoginModal} onClose={() => router.push('/')} />;
  }

  return (
    <div className="modern-container">
      <div style={{ marginBottom: '20px' }}>
        <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--accent-primary)', textDecoration: 'none' }}>
          <ArrowLeftIcon style={{ width: '20px' }} />
          Back to Home
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="modern-form">
        <h2 className="modern-form-title">Post a New Service Request</h2>
        
        <div className="modern-form-group">
          <label>Job Title *</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g., Need a plumber for leaking kitchen tap"
          />
          {errors.title && <div className="error-text">{errors.title}</div>}
        </div>

        <div className="modern-form-group">
          <label>Description *</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="4"
            placeholder="Describe the job in detail..."
          />
          {errors.description && <div className="error-text">{errors.description}</div>}
        </div>

        <div className="form-row">
          <div className="modern-form-group">
            <label>Category *</label>
            <select name="category" value={formData.category} onChange={handleChange}>
              <option value="">Select a category</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            {errors.category && <div className="error-text">{errors.category}</div>}
          </div>

          <div className="modern-form-group">
            <label>Location *</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="e.g., Glasgow"
            />
            {errors.location && <div className="error-text">{errors.location}</div>}
          </div>
        </div>

        <div className="form-row">
          <div className="modern-form-group">
            <label>Contact Name *</label>
            <input
              type="text"
              name="contactName"
              value={formData.contactName}
              onChange={handleChange}
              placeholder="Your full name"
            />
            {errors.contactName && <div className="error-text">{errors.contactName}</div>}
          </div>

          <div className="modern-form-group">
            <label>Contact Email *</label>
            <input
              type="email"
              name="contactEmail"
              value={formData.contactEmail}
              onChange={handleChange}
              placeholder="your@email.com"
            />
            {errors.contactEmail && <div className="error-text">{errors.contactEmail}</div>}
          </div>
        </div>

        <button type="submit" className="modern-btn modern-btn-primary" style={{ width: '100%', justifyContent: 'center' }} disabled={submitting}>
          {submitting ? 'Creating...' : 'Post Job'}
        </button>
      </form>
    </div>
  );
}