'use client';

import { useState, useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import './globals.css'

export default function RootLayout({ children }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <html lang="en">
      <head>
        <title>⟡ Service Board ⟡</title>
        <meta name="description" content="Post requests, find work, manage jobs" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body>
        <AuthProvider>
          {children}
          <button 
            onClick={() => {
              document.body.style.background = document.body.style.background === 'linear-gradient(135deg, #000000 0%, #1a1a1a 100%)' 
                ? 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)' 
                : 'linear-gradient(135deg, #000000 0%, #1a1a1a 100%)';
            }} 
            className="theme-toggle"
          >
            ⟡
          </button>
        </AuthProvider>
      </body>
    </html>
  );
}