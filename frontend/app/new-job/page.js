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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) {
      setShowLoginModal(true);
      return;
    }
    
    setSubmitting(true);
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/jobs`, formData);
      router.push('/');
    } catch (error) {
      console.error('Error:', error);
      alert('failed to create job');
    } finally {
      setSubmitting(false);
    }
  };

  if (!user) {
    return <LoginModal isOpen={showLoginModal} onClose={() => router.push('/')} />;
  }

  return (
    <div className="container">
      <div style={{ marginBottom: '2rem' }}>
        <Link href="/" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>
          ← / back
        </Link>
      </div>
      
      <div className="form-container">
        <h1 style={{ fontSize: '1.5rem', fontWeight: '300', marginBottom: '2rem' }}>/ new post</h1>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>title</label>
            <input type="text" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} required />
          </div>
          
          <div className="form-group">
            <label>description</label>
            <textarea rows="4" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} required />
          </div>
          
          <div className="form-group">
            <label>category</label>
            <select value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} required>
              <option value="">select</option>
              <option value="Plumbing">plumbing</option>
              <option value="Electrical">electrical</option>
              <option value="Painting">painting</option>
              <option value="Joinery">joinery</option>
              <option value="Other">other</option>
            </select>
          </div>
          
          <div className="form-group">
            <label>location</label>
            <input type="text" value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} required />
          </div>
          
          <div className="form-group">
            <label>contact name</label>
            <input type="text" value={formData.contactName} onChange={(e) => setFormData({...formData, contactName: e.target.value})} required />
          </div>
          
          <div className="form-group">
            <label>contact email</label>
            <input type="email" value={formData.contactEmail} onChange={(e) => setFormData({...formData, contactEmail: e.target.value})} required />
          </div>
          
          <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={submitting}>
            {submitting ? '...' : '/ publish'}
          </button>
        </form>
      </div>
    </div>
  );
}