'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import LoginModal from '../../components/LoginModal';

export default function JobDetail() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showLoginModal, setShowLoginModal] = useState(false);

  useEffect(() => {
    fetchJob();
  }, [id]);

  const fetchJob = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/jobs/${id}`);
      setJob(response.data);
    } catch (error) {
      console.error('Error:', error);
      router.push('/');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!user) {
      setShowLoginModal(true);
      return;
    }
    
    if (confirm('delete this job?')) {
      try {
        await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/jobs/${id}`);
        router.push('/');
      } catch (error) {
        console.error('Error:', error);
      }
    }
  };

  const isOwner = user && job && job.owner && job.owner._id === user._id;

  if (loading) {
    return <div className="loader">loading...</div>;
  }

  if (!job) return null;

  return (
    <div className="container">
      <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />
      
      <div style={{ marginBottom: '2rem' }}>
        <Link href="/" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>
          ← / back
        </Link>
      </div>
      
      <div className="detail-container">
        <div className="detail-header">
          <h1 className="detail-title">{job.title}</h1>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <span className={`badge ${
              job.status === 'Open' ? 'badge-open' : job.status === 'In Progress' ? 'badge-progress' : 'badge-closed'
            }`}>
              {job.status.toLowerCase()}
            </span>
            <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
              / posted by {job.owner?.name}
            </span>
            {isOwner && <span style={{ fontSize: '0.875rem', color: 'var(--text-primary)' }}>/ your post</span>}
          </div>
        </div>
        
        <div className="info-grid">
          <div className="info-item">
            <div className="info-label">category</div>
            <div className="info-value">{job.category}</div>
          </div>
          <div className="info-item">
            <div className="info-label">location</div>
            <div className="info-value">{job.location}</div>
          </div>
          <div className="info-item">
            <div className="info-label">contact</div>
            <div className="info-value">{job.contactName}</div>
          </div>
          <div className="info-item">
            <div className="info-label">email</div>
            <div className="info-value">{job.contactEmail}</div>
          </div>
          <div className="info-item">
            <div className="info-label">posted</div>
            <div className="info-value">{new Date(job.createdAt).toLocaleDateString()}</div>
          </div>
        </div>
        
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', padding: '1.5rem', marginBottom: '2rem' }}>
          <div className="info-label" style={{ marginBottom: '0.5rem' }}>description</div>
          <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>{job.description}</p>
        </div>
        
        {isOwner && (
          <div style={{ display: 'flex', gap: '1rem' }}>
            <select
              value={job.status}
              onChange={async (e) => {
                try {
                  await axios.patch(`${process.env.NEXT_PUBLIC_API_URL}/jobs/${id}`, { status: e.target.value });
                  fetchJob();
                } catch (error) {
                  console.error('Error:', error);
                }
              }}
              className="btn btn-outline"
            >
              <option value="Open">open</option>
              <option value="In Progress">in progress</option>
              <option value="Closed">closed</option>
            </select>
            
            <Link href={`/edit-job/${job._id}`} className="btn btn-outline">
              / edit
            </Link>
            
            <button onClick={handleDelete} className="btn btn-outline">
              / delete
            </button>
          </div>
        )}
        
        {!user && (
          <div style={{ textAlign: 'center', padding: '2rem', background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
            <p style={{ marginBottom: '1rem', color: 'var(--text-secondary)' }}>/ login to manage this post</p>
            <button onClick={() => setShowLoginModal(true)} className="btn btn-primary">
              / login
            </button>
          </div>
        )}
      </div>
    </div>
  );
}