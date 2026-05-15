'use client';

import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function LoginModal({ isOpen, onClose }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      if (isLogin) {
        await login(email, password);
      } else {
        if (password.length < 6) {
          setError('password must be at least 6 characters');
          setLoading(false);
          return;
        }
        await register(name, email, password);
      }
      onClose();
      window.location.reload();
    } catch (error) {
      setError(error.response?.data?.message || 'something went wrong');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h2 className="modal-title">{isLogin ? '/ login' : '/ register'}</h2>
          <button onClick={onClose} className="modal-close">×</button>
        </div>
        
        {error && (
          <div style={{ marginBottom: '1rem', padding: '0.5rem', border: '1px solid var(--border)', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="form-group">
              <label>name</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
          )}
          
          <div className="form-group">
            <label>email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          
          <div className="form-group">
            <label>password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          
          <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
            {loading ? '...' : (isLogin ? '/ login' : '/ register')}
          </button>
        </form>
        
        <div style={{ marginTop: '1rem', textAlign: 'center', borderTop: '1px solid var(--border)', paddingTop: '1rem' }}>
          <button onClick={() => setIsLogin(!isLogin)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
            {isLogin ? '/ create account' : '/ back to login'}
          </button>
        </div>
      </div>
    </div>
  );
}