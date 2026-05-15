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
  const { user } = useAuth();

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

  const stats = {
    total: jobs.length,
    open: jobs.filter(j => j.status === 'Open').length,
    inProgress: jobs.filter(j => j.status === 'In Progress').length,
    closed: jobs.filter(j => j.status === 'Closed').length,
  };

  return (
    <div className="container">
      <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />
      
      <div className="header">
        <h1>Service Board</h1>
        <p>post requests · find work · manage jobs</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-number">{stats.total}</div>
          <div className="stat-label">total</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{stats.open}</div>
          <div className="stat-label">open</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{stats.inProgress}</div>
          <div className="stat-label">in progress</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{stats.closed}</div>
          <div className="stat-label">closed</div>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
        <button onClick={() => setShowFilters(!showFilters)} className="btn btn-outline">
          {showFilters ? '− filters' : '+ filters'}
        </button>
        
        <div style={{ display: 'flex', gap: '1rem' }}>
          {user ? (
            <>
              <span style={{ color: 'var(--text-secondary)', alignSelf: 'center' }}>
                / {user.name} /
              </span>
              <Link href="/new-job" className="btn btn-primary">
                + new post
              </Link>
              <button onClick={() => {
                localStorage.removeItem('token');
                window.location.reload();
              }} className="btn btn-outline">
                / logout
              </button>
            </>
          ) : (
            <button onClick={() => setShowLoginModal(true)} className="btn btn-primary">
              / login
            </button>
          )}
        </div>
      </div>

      {showFilters && (
        <div className="filters">
          <div className="filter-group">
            <label>search</label>
            <input type="text" placeholder="title or description..." value={filters.search} onChange={(e) => setFilters({...filters, search: e.target.value})} />
          </div>
          <div className="filter-group">
            <label>category</label>
            <select value={filters.category} onChange={(e) => setFilters({...filters, category: e.target.value})}>
              <option value="">all</option>
              <option value="Plumbing">plumbing</option>
              <option value="Electrical">electrical</option>
              <option value="Painting">painting</option>
              <option value="Joinery">joinery</option>
              <option value="Other">other</option>
            </select>
          </div>
          <div className="filter-group">
            <label>status</label>
            <select value={filters.status} onChange={(e) => setFilters({...filters, status: e.target.value})}>
              <option value="">all</option>
              <option value="Open">open</option>
              <option value="In Progress">in progress</option>
              <option value="Closed">closed</option>
            </select>
          </div>
        </div>
      )}

      {loading ? (
        <div className="loader">loading...</div>
      ) : jobs.length === 0 ? (
        <div className="empty">
          <p>no jobs found</p>
        </div>
      ) : (
        jobs.map(job => {
          const isOwner = user && job.owner && job.owner._id === user._id;
          return (
            <div key={job._id} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', flexWrap: 'wrap' }}>
                <div style={{ flex: 1 }}>
                  <Link href={`/jobs/${job._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: '400', marginBottom: '0.5rem' }}>
                      {job.title}
                    </h3>
                  </Link>
                  <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem', fontSize: '0.875rem' }}>
                    {job.description.substring(0, 120)}...
                  </p>
                  <div style={{ display: 'flex', gap: '1rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    <span>/{job.location}</span>
                    <span>/{job.category}</span>
                    <span>/{new Date(job.createdAt).toLocaleDateString()}</span>
                    {job.owner && <span>/@{job.owner.name}</span>}
                    {isOwner && <span style={{ color: 'var(--text-primary)' }}>/your post</span>}
                  </div>
                </div>
                
                <div style={{ textAlign: 'right' }}>
                  <span className={`badge ${
                    job.status === 'Open' ? 'badge-open' : job.status === 'In Progress' ? 'badge-progress' : 'badge-closed'
                  }`}>
                    {job.status.toLowerCase()}
                  </span>
                  
                  {isOwner && (
                    <div className="action-group">
                      <select
                        value={job.status}
                        onChange={async (e) => {
                          try {
                            await axios.patch(`${process.env.NEXT_PUBLIC_API_URL}/jobs/${job._id}`, { status: e.target.value });
                            fetchJobs();
                          } catch (error) {
                            console.error('Error:', error);
                          }
                        }}
                        className="btn btn-outline"
                        style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
                      >
                        <option value="Open">open</option>
                        <option value="In Progress">in progress</option>
                        <option value="Closed">closed</option>
                      </select>
                      
                      <Link href={`/edit-job/${job._id}`} className="btn btn-outline" style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', textDecoration: 'none' }}>
                        / edit
                      </Link>
                      
                      <button
                        onClick={async () => {
                          if (confirm('delete this job?')) {
                            try {
                              await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/jobs/${job._id}`);
                              fetchJobs();
                            } catch (error) {
                              console.error('Error:', error);
                            }
                          }
                        }}
                        className="btn btn-outline"
                        style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
                      >
                        / delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}