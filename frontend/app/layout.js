'use client';

import { useState, useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import './globals.css'

export default function RootLayout({ children }) {
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  return (
    <html lang="en">
      <head>
        <title>Service Request Board</title>
        <meta name="description" content="Connect homeowners with skilled tradespeople" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
        <button onClick={toggleTheme} className="theme-toggle">
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>
      </body>
    </html>
  );
}