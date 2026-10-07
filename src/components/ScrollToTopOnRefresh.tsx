'use client';

import { useEffect } from 'react';

export default function ScrollToTopOnRefresh() {
  useEffect(() => {
    // Disable browser automatic scroll restoration so page doesn't jump to footer on refresh
    if (typeof window !== 'undefined' && 'scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }

    // Always ensure page starts at the top
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, []);

  return null;
}
