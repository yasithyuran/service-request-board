'use client';

import Link from 'next/link';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export default function JobCard({ job, onUpdate }) {
  const { user } = useAuth();
  const isOwner = user && job.owner && job.owner._id === user._id;

  const handleStatusChange = async (newStatus) => {
    if (!user) {
      alert('⟡ please login ⟡');
      return;
    }
    if (!isOwner) {
      alert('◈ you can only update your own posts ◈');
      return;
    }
    try {
      await axios.patch(`${process.env.NEXT_PUBLIC_API_URL}/jobs/${job._id}`, { status: newStatus });
      onUpdate();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleDelete = async () => {
    if (!user) {
      alert('⟡ please login ⟡');
      return;
    }
    if (!isOwner) {
      alert('◆ you can only delete your own posts ◆');
      return;
    }
    if (confirm('⟡ delete this job? ⟡')) {
      try {
        await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/jobs/${job._id}`);
        onUpdate();
      } catch (error) {
        console.error('Error:', error);
      }
    }
  };

  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', flexWrap: 'wrap', gap: '1rem' }}>
        
        <div style={{ flex: 1 }}>
          <Link href={`/jobs/${job._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>
              ⟡ {job.title}
            </h3>
          </Link>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '0.75rem', fontSize: '0.875rem', lineHeight: '1.5' }}>
            {job.description.substring(0, 100)}...
          </p>
          <div style={{ display: 'flex', gap: '1rem', fontSize: '0.7rem', color: 'var(--text-muted)', flexWrap: 'wrap' }}>
            <span>⟡ /{job.location}</span>
            <span>◈ /{job.category}</span>
            <span>◇ /{new Date(job.createdAt).toLocaleDateString()}</span>
            {job.owner && <span>◆ /@{job.owner.name}</span>}
            {isOwner && <span style={{ color: 'var(--text-primary)' }}>⟡ /your post</span>}
          </div>
        </div>
        
        <div style={{ textAlign: 'right' }}>
          <span className={`badge ${
            job.status === 'Open' ? 'badge-open' : 
            job.status === 'In Progress' ? 'badge-progress' : 'badge-closed'
          }`}>
            {job.status === 'Open' ? '⟡ open' : job.status === 'In Progress' ? '◇ in progress' : '◆ closed'}
          </span>
          
          {isOwner && (
            <div className="action-group">
              <select
                value={job.status}
                onChange={(e) => handleStatusChange(e.target.value)}
                className="btn btn-outline"
                style={{ padding: '0.35rem 0.75rem', fontSize: '0.7rem' }}
              >
                <option value="Open">⟡ open</option>
                <option value="In Progress">◇ progress</option>
                <option value="Closed">◆ closed</option>
              </select>
              
              <Link
                href={`/edit-job/${job._id}`}
                className="btn btn-outline"
                style={{ padding: '0.35rem 0.75rem', fontSize: '0.7rem', textDecoration: 'none' }}
              >
                ◈ / edit
              </Link>
              
              <button
                onClick={handleDelete}
                className="btn btn-outline"
                style={{ padding: '0.35rem 0.75rem', fontSize: '0.7rem' }}
              >
                ⟡ / delete
              </button>
            </div>
          )}
          
          {!isOwner && user && (
            <div style={{ marginTop: '0.5rem', fontSize: '0.65rem', color: 'var(--text-muted)' }}>
              ◆ / locked
            </div>
          )}
        </div>
      </div>
    </div>
  );
}