'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';
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
    contactEmail: ''
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!user) {
      setShowLoginModal(true);
    }
  }, [user]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = '⟡ title is required';
    if (!formData.description.trim()) newErrors.description = '◈ description is required';
    if (!formData.category) newErrors.category = '◆ category is required';
    if (!formData.location.trim()) newErrors.location = '◇ location is required';
    if (!formData.contactName.trim()) newErrors.contactName = '⟡ contact name is required';
    if (!formData.contactEmail.trim()) {
      newErrors.contactEmail = '◈ email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.contactEmail)) {
      newErrors.contactEmail = '◆ invalid email';
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
      console.error('Error:', error);
      alert('◇ failed to create job');
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
    <div className="container">
      <div style={{ marginBottom: '2rem' }}>
        <Link href="/" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.875rem' }}>
          ◈ ← / back
        </Link>
      </div>
      
      <div className="form-container">
        <h1 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '2rem', letterSpacing: '-0.02em' }}>
          ⟡ / new post
        </h1>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>⟡ title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="what needs to be done?"
            />
            {errors.title && <div style={{ color: 'var(--text-secondary)', fontSize: '0.7rem', marginTop: '0.25rem' }}>◇ {errors.title}</div>}
          </div>
          
          <div className="form-group">
            <label>◈ description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="5"
              placeholder="describe the job in detail..."
            />
            {errors.description && <div style={{ color: 'var(--text-secondary)', fontSize: '0.7rem', marginTop: '0.25rem' }}>◆ {errors.description}</div>}
          </div>
          
          <div className="form-group">
            <label>⟡ category</label>
            <select name="category" value={formData.category} onChange={handleChange}>
              <option value="">select</option>
              <option value="Plumbing">◇ plumbing</option>
              <option value="Electrical">◆ electrical</option>
              <option value="Painting">⟡ painting</option>
              <option value="Joinery">◈ joinery</option>
              <option value="Other">◇ other</option>
            </select>
            {errors.category && <div style={{ color: 'var(--text-secondary)', fontSize: '0.7rem', marginTop: '0.25rem' }}>◆ {errors.category}</div>}
          </div>
          
          <div className="form-group">
            <label>◇ location</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="city, area"
            />
            {errors.location && <div style={{ color: 'var(--text-secondary)', fontSize: '0.7rem', marginTop: '0.25rem' }}>⟡ {errors.location}</div>}
          </div>
          
          <div className="form-group">
            <label>◆ contact name</label>
            <input
              type="text"
              name="contactName"
              value={formData.contactName}
              onChange={handleChange}
              placeholder="your name"
            />
            {errors.contactName && <div style={{ color: 'var(--text-secondary)', fontSize: '0.7rem', marginTop: '0.25rem' }}>◇ {errors.contactName}</div>}
          </div>
          
          <div className="form-group">
            <label>⟡ contact email</label>
            <input
              type="email"
              name="contactEmail"
              value={formData.contactEmail}
              onChange={handleChange}
              placeholder="your@email.com"
            />
            {errors.contactEmail && <div style={{ color: 'var(--text-secondary)', fontSize: '0.7rem', marginTop: '0.25rem' }}>◈ {errors.contactEmail}</div>}
          </div>
          
          <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={submitting}>
            {submitting ? '⟡ ...' : '⟡ / publish'}
          </button>
        </form>
      </div>
    </div>
  );
}