'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';
import { ArrowLeftIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../../context/AuthContext';
import LoginModal from '../../components/LoginModal';

export default function JobDetail() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  useEffect(() => {
    fetchJob();
  }, [id]);

  const fetchJob = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/jobs/${id}`);
      setJob(response.data);
    } catch (error) {
      console.error('Error fetching job:', error);
      if (error.response?.status === 404) {
        alert('Job not found');
        router.push('/');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (newStatus) => {
    if (!user) {
      setShowLoginModal(true);
      return;
    }
    
    // Check if user owns this job
    if (!job || job.owner._id !== user._id) {
      alert('You can only update your own jobs');
      return;
    }
    
    setUpdating(true);
    try {
      await axios.patch(`${process.env.NEXT_PUBLIC_API_URL}/jobs/${id}`, {
        status: newStatus
      });
      await fetchJob();
    } catch (error) {
      console.error('Error updating status:', error);
      alert(error.response?.data?.message || 'Failed to update status');
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!user) {
      setShowLoginModal(true);
      return;
    }
    
    // Check if user owns this job
    if (!job || job.owner._id !== user._id) {
      alert('You can only delete your own jobs');
      return;
    }
    
    if (confirm('Are you sure you want to delete this job? This action cannot be undone.')) {
      try {
        await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/jobs/${id}`);
        router.push('/');
      } catch (error) {
        console.error('Error deleting job:', error);
        alert(error.response?.data?.message || 'Failed to delete job');
      }
    }
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'Open': return 'badge-open';
      case 'In Progress': return 'badge-progress';
      case 'Closed': return 'badge-closed';
      default: return '';
    }
  };

  const isOwner = user && job && job.owner && job.owner._id === user._id;

  if (loading) {
    return (
      <div className="modern-loader">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!job) return null;

  return (
    <div className="modern-container">
      <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />
      
      <div style={{ marginBottom: '20px' }}>
        <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--accent-primary)', textDecoration: 'none' }}>
          <ArrowLeftIcon style={{ width: '20px' }} />
          Back to Home
        </Link>
      </div>

      <div className="modern-detail fade-in-up">
        <div className="detail-header">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', flexWrap: 'wrap', gap: '15px' }}>
            <div>
              <h1 className="detail-title">{job.title}</h1>
              <p style={{ marginTop: '10px', opacity: '0.9' }}>
                Posted by <strong>{job.owner.name}</strong> on {new Date(job.createdAt).toLocaleDateString()}
              </p>
              {isOwner && (
                <p style={{ marginTop: '5px', fontSize: '14px', background: 'rgba(255,255,255,0.2)', display: 'inline-block', padding: '4px 12px', borderRadius: '20px' }}>
                  ✓ This is your job posting
                </p>
              )}
              {user && !isOwner && (
                <p style={{ marginTop: '5px', fontSize: '14px', background: 'rgba(255,255,255,0.2)', display: 'inline-block', padding: '4px 12px', borderRadius: '20px' }}>
                  👤 Posted by another user
                </p>
              )}
            </div>
            <span className={`modern-badge ${getStatusBadge(job.status)}`} style={{ fontSize: '14px', padding: '8px 16px' }}>
              {job.status === 'Open' ? '🟢' : job.status === 'In Progress' ? '🟡' : '⚫'} {job.status}
            </span>
          </div>
        </div>

        <div className="detail-content">
          <div style={{ marginBottom: '30px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '10px', color: 'var(--text-primary)' }}>Description</h3>
            <p style={{ lineHeight: '1.6', color: 'var(--text-secondary)' }}>{job.description}</p>
          </div>

          <div className="info-grid">
            <div className="info-card">
              <div className="info-label">Category</div>
              <div className="info-value">{job.category}</div>
            </div>
            <div className="info-card">
              <div className="info-label">Location</div>
              <div className="info-value">{job.location}</div>
            </div>
            <div className="info-card">
              <div className="info-label">Contact Name</div>
              <div className="info-value">{job.contactName}</div>
            </div>
            <div className="info-card">
              <div className="info-label">Contact Email</div>
              <div className="info-value">{job.contactEmail}</div>
            </div>
          </div>

          {/* Only show management buttons if user is the owner */}
          {isOwner && (
            <div style={{ display: 'flex', gap: '15px', marginTop: '30px', paddingTop: '20px', borderTop: '2px solid var(--border)' }}>
              <select
                value={job.status}
                onChange={(e) => handleStatusChange(e.target.value)}
                disabled={updating}
                className="modern-select"
                style={{ padding: '10px 20px' }}
              >
                <option value="Open">Open</option>
                <option value="In Progress">In Progress</option>
                <option value="Closed">Closed</option>
              </select>
              
              <Link
                href={`/edit-job/${job._id}`}
                className="modern-btn modern-btn-primary"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
              >
                <PencilIcon style={{ width: '18px' }} />
                Edit Job
              </Link>
              
              <button
                onClick={handleDelete}
                className="modern-btn modern-btn-danger"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
              >
                <TrashIcon style={{ width: '18px' }} />
                Delete Job
              </button>
            </div>
          )}

          {!user && (
            <div style={{ 
              marginTop: '30px', 
              padding: '20px', 
              background: 'var(--bg-secondary)', 
              borderRadius: '12px',
              textAlign: 'center',
              border: '1px solid var(--border)'
            }}>
              <p style={{ marginBottom: '10px' }}>🔒 Login to edit or delete this job</p>
              <button onClick={() => setShowLoginModal(true)} className="modern-btn modern-btn-primary">
                Login / Register
              </button>
            </div>
          )}
          
          {user && !isOwner && (
            <div style={{ 
              marginTop: '30px', 
              padding: '20px', 
              background: 'var(--bg-secondary)', 
              borderRadius: '12px',
              textAlign: 'center',
              border: '1px solid var(--border)'
            }}>
              <p>🔒 This job was posted by <strong>{job.owner.name}</strong>. Only the owner can edit or delete this listing.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}