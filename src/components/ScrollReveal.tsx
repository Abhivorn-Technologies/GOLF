'use client';

import React, { useEffect, useRef, useState } from 'react';

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  animation?: 'fade-up' | 'fade-down' | 'fade-left' | 'fade-right' | 'zoom-in' | 'fade';
  delay?: number; // in milliseconds
  duration?: number; // in milliseconds
  threshold?: number;
  once?: boolean;
}

export default function ScrollReveal({
  children,
  className = '',
  animation = 'fade-up',
  delay = 0,
  duration = 700,
  threshold = 0.1,
  once = true,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (!('IntersectionObserver' in window)) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once) {
            observer.unobserve(el);
          }
        } else if (!once) {
          setIsVisible(false);
        }
      },
      {
        threshold,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
    };
  }, [threshold, once]);

  const getHiddenTransform = () => {
    switch (animation) {
      case 'fade-up':
        return 'translate-y-8 opacity-0';
      case 'fade-down':
        return '-translate-y-8 opacity-0';
      case 'fade-left':
        return 'translate-x-8 opacity-0';
      case 'fade-right':
        return '-translate-x-8 opacity-0';
      case 'zoom-in':
        return 'scale-95 opacity-0';
      case 'fade':
      default:
        return 'opacity-0';
    }
  };

  const visibleClasses = 'translate-y-0 translate-x-0 scale-100 opacity-100';

  return (
    <div
      ref={ref}
      style={{
        transitionDuration: `${duration}ms`,
        transitionDelay: `${delay}ms`,
        transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
        willChange: 'transform, opacity',
      }}
      className={`transition-all ${isVisible ? visibleClasses : getHiddenTransform()} ${className}`}
    >
      {children}
    </div>
  );
}
