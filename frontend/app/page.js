'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { useAuth } from './context/AuthContext';
import LoginModal from './components/LoginModal';

export default function Home() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ category: '', status: '', search: '' });
  const [showFilters, setShowFilters] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const { user, loading: authLoading } = useAuth();

  useEffect(() => {
    fetchJobs();
  }, [filters]);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filters.category) params.append('category', filters.category);
      if (filters.status) params.append('status', filters.status);
      if (filters.search) params.append('search', filters.search);
      
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/jobs?${params}`);
      setJobs(response.data);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (jobId, newStatus) => {
    if (!user) {
      setShowLoginModal(true);
      return;
    }
    
    const job = jobs.find(j => j._id === jobId);
    if (job && job.owner._id !== user._id) {
      alert('You can only update your own jobs');
      return;
    }
    
    try {
      await axios.patch(`${process.env.NEXT_PUBLIC_API_URL}/jobs/${jobId}`, { status: newStatus });
      fetchJobs();
    } catch (error) {
      console.error('Error updating status:', error);
      alert(error.response?.data?.message || 'Failed to update status');
    }
  };

  const handleDelete = async (jobId) => {
    if (!user) {
      setShowLoginModal(true);
      return;
    }
    
    const job = jobs.find(j => j._id === jobId);
    if (job && job.owner._id !== user._id) {
      alert('You can only delete your own jobs');
      return;
    }
    
    if (confirm('Are you sure you want to delete this job?')) {
      try {
        await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/jobs/${jobId}`);
        fetchJobs();
      } catch (error) {
        console.error('Error deleting job:', error);
        alert(error.response?.data?.message || 'Failed to delete job');
      }
    }
  };

  const stats = {
    total: jobs.length,
    open: jobs.filter(j => j.status === 'Open').length,
    inProgress: jobs.filter(j => j.status === 'In Progress').length,
    closed: jobs.filter(j => j.status === 'Closed').length,
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'Open': return 'badge-open';
      case 'In Progress': return 'badge-progress';
      case 'Closed': return 'badge-closed';
      default: return '';
    }
  };

  const isOwner = (job) => {
    return user && job.owner && job.owner._id === user._id;
  };

  if (authLoading) {
    return (
      <div className="modern-loader">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="modern-container">
      <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />
      
      <div className="modern-header fade-in-up">
        <h1>🎯 Service Board</h1>
        <p>Connect with skilled tradespeople in your area</p>
      </div>

      {/* Stats */}
      <div className="stats-grid fade-in-up">
        <div className="stat-card">
          <div className="stat-number">{stats.total}</div>
          <div className="stat-label">Total Jobs</div>
        </div>
        <div className="stat-card">
          <div className="stat-number" style={{ color: '#10b981' }}>{stats.open}</div>
          <div className="stat-label">Open</div>
        </div>
        <div className="stat-card">
          <div className="stat-number" style={{ color: '#f59e0b' }}>{stats.inProgress}</div>
          <div className="stat-label">In Progress</div>
        </div>
        <div className="stat-card">
          <div className="stat-number" style={{ color: '#9ca3af' }}>{stats.closed}</div>
          <div className="stat-label">Closed</div>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
        <button onClick={() => setShowFilters(!showFilters)} className="modern-btn modern-btn-outline">
          🔍 {showFilters ? 'Hide Filters' : 'Show Filters'}
        </button>
        
        <div style={{ display: 'flex', gap: '10px' }}>
          {user ? (
            <>
              <span style={{ color: 'var(--text-secondary)', alignSelf: 'center' }}>👋 Hi, {user.name}</span>
              <Link href="/new-job" className="modern-btn modern-btn-primary">
                ✨ Post New Job
              </Link>
              <button onClick={() => {
                localStorage.removeItem('token');
                window.location.reload();
              }} className="modern-btn modern-btn-outline">
                Logout
              </button>
            </>
          ) : (
            <button onClick={() => setShowLoginModal(true)} className="modern-btn modern-btn-primary">
              Login / Register
            </button>
          )}
        </div>
      </div>

      {showFilters && (
        <div className="modern-filters fade-in-up">
          <div className="modern-filter-group">
            <label>🔎 Search</label>
            <input type="text" className="modern-input" placeholder="Search jobs..." value={filters.search} onChange={(e) => setFilters({...filters, search: e.target.value})} />
          </div>
          <div className="modern-filter-group">
            <label>📂 Category</label>
            <select className="modern-select" value={filters.category} onChange={(e) => setFilters({...filters, category: e.target.value})}>
              <option value="">All Categories</option>
              <option value="Plumbing">Plumbing</option>
              <option value="Electrical">Electrical</option>
              <option value="Painting">Painting</option>
              <option value="Joinery">Joinery</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div className="modern-filter-group">
            <label>📊 Status</label>
            <select className="modern-select" value={filters.status} onChange={(e) => setFilters({...filters, status: e.target.value})}>
              <option value="">All Statuses</option>
              <option value="Open">Open</option>
              <option value="In Progress">In Progress</option>
              <option value="Closed">Closed</option>
            </select>
          </div>
        </div>
      )}

      {loading ? (
        <div className="modern-loader"><div className="spinner"></div></div>
      ) : jobs.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🔍</div>
          <h3>No jobs found</h3>
          <p style={{ marginTop: '10px' }}>Try adjusting your filters or post a new job</p>
        </div>
      ) : (
        <div className="fade-in-up">
          {jobs.map(job => {
            const ownerCheck = isOwner(job);
            return (
              <div key={job._id} className="modern-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', flexWrap: 'wrap', gap: '15px' }}>
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
                          background: ownerCheck ? 'rgba(16, 185, 129, 0.1)' : 'transparent',
                          padding: ownerCheck ? '2px 8px' : '0',
                          borderRadius: '12px',
                          color: ownerCheck ? '#10b981' : 'var(--text-muted)'
                        }}>
                          {ownerCheck ? '✓ Your job' : `👤 Posted by: ${job.owner.name}`}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '10px' }}>
                    <span className={`modern-badge ${getStatusBadge(job.status)}`}>
                      {job.status === 'Open' ? '🟢' : job.status === 'In Progress' ? '🟡' : '⚫'} {job.status}
                    </span>
                    
                    {ownerCheck ? (
                      <div style={{ display: 'flex', gap: '10px' }}>
                        <select
                          value={job.status}
                          onChange={(e) => handleStatusChange(job._id, e.target.value)}
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
                          style={{ padding: '6px 12px', fontSize: '12px', textDecoration: 'none' }}
                        >
                          ✏️ Edit
                        </Link>
                        
                        <button
                          onClick={() => handleDelete(job._id)}
                          className="modern-btn modern-btn-danger"
                          style={{ padding: '6px 12px', fontSize: '12px' }}
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    ) : user && !ownerCheck ? (
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)', padding: '4px 8px', background: 'var(--bg-secondary)', borderRadius: '8px' }}>
                        🔒 Only the job owner can manage this
                      </div>
                    ) : (
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)', padding: '4px 8px', background: 'var(--bg-secondary)', borderRadius: '8px' }}>
                        🔒 Login to manage jobs
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}