'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import LoginModal from '../../components/LoginModal';

export default function EditJob() {
  const { id } = useParams();
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
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!user) {
      setShowLoginModal(true);
      return;
    }
    fetchJob();
  }, [id, user]);

  const fetchJob = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/jobs/${id}`);
      const job = response.data;
      
      if (job.owner._id !== user._id) {
        alert('you can only edit your own posts');
        router.push('/');
        return;
      }
      
      setFormData({
        title: job.title,
        description: job.description,
        category: job.category,
        location: job.location,
        contactName: job.contactName,
        contactEmail: job.contactEmail,
        status: job.status
      });
    } catch (error) {
      console.error('Error:', error);
      router.push('/');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/jobs/${id}`, formData);
      router.push(`/jobs/${id}`);
    } catch (error) {
      console.error('Error:', error);
      alert('failed to update job');
    } finally {
      setSubmitting(false);
    }
  };

  if (!user) {
    return <LoginModal isOpen={showLoginModal} onClose={() => router.push('/')} />;
  }

  if (loading) {
    return <div className="loader">loading...</div>;
  }

  return (
    <div className="container">
      <div style={{ marginBottom: '2rem' }}>
        <Link href={`/jobs/${id}`} style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>
          ← / back
        </Link>
      </div>
      
      <div className="form-container">
        <h1 style={{ fontSize: '1.5rem', fontWeight: '300', marginBottom: '2rem' }}>/ edit post</h1>
        
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
          
          <div className="form-group">
            <label>status</label>
            <select value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})}>
              <option value="Open">open</option>
              <option value="In Progress">in progress</option>
              <option value="Closed">closed</option>
            </select>
          </div>
          
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button type="submit" className="btn btn-primary" style={{ flex: 1 }} disabled={submitting}>
              {submitting ? '...' : '/ update'}
            </button>
            <Link href={`/jobs/${id}`} className="btn btn-outline" style={{ flex: 1, textAlign: 'center' }}>
              / cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}