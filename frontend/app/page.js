'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { useAuth } from './context/AuthContext';
import LoginModal from './components/LoginModal';
import JobCard from './components/JobCard';
import JobFilters from './components/JobFilters';

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
      
      <div className="hero">
        <h1>⟡ SERVICE BOARD ⟡</h1>
        <div className="divider"></div>
        <p>post requests <span>◆</span> find work <span>◆</span> manage jobs</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-number">{stats.total}</div>
          <div className="stat-label">⟡ total</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{stats.open}</div>
          <div className="stat-label">◈ open</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{stats.inProgress}</div>
          <div className="stat-label">◇ in progress</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{stats.closed}</div>
          <div className="stat-label">◆ closed</div>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <button onClick={() => setShowFilters(!showFilters)} className="btn btn-outline">
          {showFilters ? '◈ − filters' : '⟡ + filters'}
        </button>
        
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          {user ? (
            <>
              <span style={{ color: 'var(--text-secondary)', alignSelf: 'center' }}>
                ◇ / {user.name}
              </span>
              <Link href="/new-job" className="btn btn-primary">
                ⟡ + new post
              </Link>
              <button onClick={() => {
                localStorage.removeItem('token');
                window.location.reload();
              }} className="btn btn-outline">
                ◇ / logout
              </button>
            </>
          ) : (
            <button onClick={() => setShowLoginModal(true)} className="btn btn-primary">
              ⟡ / login
            </button>
          )}
        </div>
      </div>

      {showFilters && <JobFilters onFilterChange={setFilters} />}

      {loading ? (
        <div className="loader">⟡ loading... ⟡</div>
      ) : jobs.length === 0 ? (
        <div className="empty">
          <p>◈ no jobs found ◈</p>
        </div>
      ) : (
        jobs.map(job => (
          <JobCard key={job._id} job={job} onUpdate={fetchJobs} />
        ))
      )}
    </div>
  );
}