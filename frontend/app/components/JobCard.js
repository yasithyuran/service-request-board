'use client';

import Link from 'next/link';
import axios from 'axios';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../context/AuthContext';

const statusColors = {
  'Open': 'badge-open',
  'In Progress': 'badge-progress',
  'Closed': 'badge-closed'
};

export default function JobCard({ job, onUpdate }) {
  const { user } = useAuth();
  
  // STRICT OWNERSHIP CHECK
  // Only return true if:
  // 1. User is logged in
  // 2. Job has owner property
  // 3. Owner ID matches user ID
  const isOwner = user && 
                  job.owner && 
                  job.owner._id === user._id;

  console.log('Ownership check:', {
    isLoggedIn: !!user,
    userId: user?._id,
    ownerId: job.owner?._id,
    isOwner: isOwner,
    jobTitle: job.title
  });

  const handleStatusChange = async (newStatus) => {
    if (!user) {
      alert('🔒 Please login to update status');
      return;
    }
    
    if (!isOwner) {
      alert('⛔ You can only update your own jobs');
      return;
    }
    
    try {
      await axios.patch(`${process.env.NEXT_PUBLIC_API_URL}/jobs/${job._id}`, {
        status: newStatus
      });
      onUpdate();
    } catch (error) {
      console.error('Error updating status:', error);
      alert(error.response?.data?.message || 'Failed to update status');
    }
  };

  const handleDelete = async () => {
    if (!user) {
      alert('🔒 Please login to delete jobs');
      return;
    }
    
    if (!isOwner) {
      alert('⛔ You can only delete your own jobs');
      return;
    }
    
    if (confirm('⚠️ Are you sure you want to delete this job? This action cannot be undone.')) {
      try {
        await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/jobs/${job._id}`);
        onUpdate();
      } catch (error) {
        console.error('Error deleting job:', error);
        alert(error.response?.data?.message || 'Failed to delete job');
      }
    }
  };

  return (
    <div className="modern-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', flexWrap: 'wrap', gap: '15px' }}>
        {/* Left side - Job Info */}
        <div style={{ flex: 1 }}>
          <Link href={`/jobs/${job._id}`} style={{ textDecoration: 'none' }}>
            <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '10px', color: 'var(--text-primary)' }}>
              {job.title}
            </h3>
          </Link>
          
          <p style={{ color: 'var(--text-secondary)', marginBottom: '12px' }}>
            {job.description.substring(0, 120)}...
          </p>
          
          <div style={{ display: 'flex', gap: '15px', fontSize: '13px', color: 'var(--text-muted)', flexWrap: 'wrap' }}>
            <span>📍 {job.location}</span>
            <span>🔧 {job.category}</span>
            <span>📅 {new Date(job.createdAt).toLocaleDateString()}</span>
            {job.owner && (
              <span style={{ 
                background: isOwner ? 'rgba(16, 185, 129, 0.1)' : 'transparent',
                padding: isOwner ? '2px 8px' : '0',
                borderRadius: '12px',
                color: isOwner ? '#10b981' : 'var(--text-muted)'
              }}>
                {isOwner ? '✓ Your job' : `👤 Posted by: ${job.owner.name}`}
              </span>
            )}
          </div>
        </div>
        
        {/* Right side - Status Badge and Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '10px' }}>
          <span className={`modern-badge ${statusColors[job.status]}`}>
            {job.status === 'Open' ? '🟢' : job.status === 'In Progress' ? '🟡' : '⚫'} {job.status}
          </span>
          
          {/* ONLY SHOW BUTTONS IF USER IS THE OWNER */}
          {isOwner ? (
            <div style={{ display: 'flex', gap: '10px' }}>
              <select
                value={job.status}
                onChange={(e) => handleStatusChange(e.target.value)}
                className="modern-select"
                style={{ padding: '6px 12px', fontSize: '12px', cursor: 'pointer' }}
              >
                <option value="Open">Open</option>
                <option value="In Progress">In Progress</option>
                <option value="Closed">Closed</option>
              </select>
              
              <Link
                href={`/edit-job/${job._id}`}
                className="modern-btn modern-btn-primary"
                style={{ 
                  padding: '6px 12px', 
                  fontSize: '12px', 
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <PencilIcon style={{ width: '14px' }} />
                Edit
              </Link>
              
              <button
                onClick={handleDelete}
                className="modern-btn modern-btn-danger"
                style={{ padding: '6px 12px', fontSize: '12px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
              >
                <TrashIcon style={{ width: '14px' }} />
                Delete
              </button>
            </div>
          ) : user && !isOwner ? (
            // Show message for logged-in users who don't own this job
            <div style={{ 
              fontSize: '11px', 
              color: 'var(--text-muted)', 
              padding: '4px 8px',
              background: 'var(--bg-secondary)',
              borderRadius: '8px',
              textAlign: 'center'
            }}>
              🔒 Only the job owner can manage this
            </div>
          ) : (
            // Show message for non-logged-in users
            <div style={{ 
              fontSize: '11px', 
              color: 'var(--text-muted)', 
              padding: '4px 8px',
              background: 'var(--bg-secondary)',
              borderRadius: '8px',
              textAlign: 'center'
            }}>
              🔒 Login to manage jobs
            </div>
          )}
        </div>
      </div>
    </div>
  );
}