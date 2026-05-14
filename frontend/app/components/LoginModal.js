'use client';

import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { ArrowLeftIcon, XMarkIcon } from '@heroicons/react/24/outline';

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
        if (name.length < 2) {
          setError('Name must be at least 2 characters');
          setLoading(false);
          return;
        }
        if (password.length < 6) {
          setError('Password must be at least 6 characters');
          setLoading(false);
          return;
        }
        await register(name, email, password);
      }
      onClose();
      window.location.reload();
    } catch (error) {
      setError(error.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleSwitchMode = () => {
    setIsLogin(!isLogin);
    setError('');
    setEmail('');
    setPassword('');
    setName('');
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.85)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      backdropFilter: 'blur(10px)',
      animation: 'fadeInUp 0.3s ease-out'
    }}>
      <div style={{
        background: 'var(--bg-card)',
        borderRadius: '24px',
        maxWidth: '450px',
        width: '90%',
        border: '1px solid var(--border)',
        boxShadow: 'var(--shadow-xl)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Header with back button and close button */}
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
          color: 'white'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              onClick={onClose}
              style={{
                background: 'rgba(255,255,255,0.2)',
                border: 'none',
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: 'white',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.3)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
            >
              <ArrowLeftIcon style={{ width: '18px' }} />
            </button>
            <h2 style={{ fontSize: '20px', fontWeight: '700', margin: 0 }}>
              {isLogin ? 'Welcome Back!' : 'Create Account'}
            </h2>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(255,255,255,0.2)',
              border: 'none',
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: 'white',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.3)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
          >
            <XMarkIcon style={{ width: '18px' }} />
          </button>
        </div>

        <div style={{ padding: '32px' }}>
          {error && (
            <div style={{
              background: 'rgba(239,68,68,0.1)',
              color: '#ef4444',
              padding: '12px',
              borderRadius: '12px',
              marginBottom: '20px',
              fontSize: '14px',
              border: '1px solid rgba(239,68,68,0.3)'
            }}>
              ⚠️ {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            {!isLogin && (
              <div style={{ marginBottom: '20px' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontWeight: '600',
                  fontSize: '14px',
                  color: 'var(--text-secondary)'
                }}>
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    background: 'var(--bg-secondary)',
                    border: '2px solid var(--border)',
                    borderRadius: '12px',
                    fontSize: '14px',
                    color: 'var(--text-primary)',
                    transition: 'all 0.2s'
                  }}
                  onFocus={(e) => e.currentTarget.style.borderColor = 'var(--accent-primary)'}
                  onBlur={(e) => e.currentTarget.style.borderColor = 'var(--border)'}
                />
              </div>
            )}
            
            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                fontWeight: '600',
                fontSize: '14px',
                color: 'var(--text-secondary)'
              }}>
                Email Address
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  background: 'var(--bg-secondary)',
                  border: '2px solid var(--border)',
                  borderRadius: '12px',
                  fontSize: '14px',
                  color: 'var(--text-primary)',
                  transition: 'all 0.2s'
                }}
                onFocus={(e) => e.currentTarget.style.borderColor = 'var(--accent-primary)'}
                onBlur={(e) => e.currentTarget.style.borderColor = 'var(--border)'}
              />
            </div>
            
            <div style={{ marginBottom: '24px' }}>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                fontWeight: '600',
                fontSize: '14px',
                color: 'var(--text-secondary)'
              }}>
                Password
              </label>
              <input
                type="password"
                placeholder={isLogin ? "Enter your password" : "Create a password (min 6 characters)"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  background: 'var(--bg-secondary)',
                  border: '2px solid var(--border)',
                  borderRadius: '12px',
                  fontSize: '14px',
                  color: 'var(--text-primary)',
                  transition: 'all 0.2s'
                }}
                onFocus={(e) => e.currentTarget.style.borderColor = 'var(--accent-primary)'}
                onBlur={(e) => e.currentTarget.style.borderColor = 'var(--border)'}
              />
            </div>
            
            <button 
              type="submit" 
              disabled={loading}
              style={{
                width: '100%',
                padding: '14px',
                background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1,
                transition: 'all 0.2s',
                marginBottom: '20px'
              }}
              onMouseEnter={(e) => {
                if (!loading) e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                if (!loading) e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              {loading ? 'Please wait...' : (isLogin ? 'Login' : 'Create Account')}
            </button>
          </form>
          
          <div style={{
            textAlign: 'center',
            paddingTop: '20px',
            borderTop: '1px solid var(--border)'
          }}>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '0' }}>
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button 
                onClick={handleSwitchMode}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--accent-primary)',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '14px'
                }}
              >
                {isLogin ? 'Create one here' : 'Login here'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}