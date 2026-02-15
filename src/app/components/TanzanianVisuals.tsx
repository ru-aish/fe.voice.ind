'use client';

import { useEffect, useRef, useState } from 'react';

export default function TanzanianVisuals() {
  const containerRef = useRef<HTMLDivElement>(null);
  const elementRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const loadComponent = async () => {
      try {
        await import('./TanzanianVisuals3D');
        
        if (containerRef.current) {
          const element = document.createElement('tanzanian-visuals-3d');
          elementRef.current = element;
          containerRef.current.appendChild(element);
        }
      } catch (error) {
        console.error('Failed to load TanzanianVisuals3D:', error);
      }
    };

    loadComponent();

    return () => {
      if (elementRef.current && elementRef.current.parentNode) {
        elementRef.current.parentNode.removeChild(elementRef.current);
      }
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      style={{ 
        width: '100%', 
        height: '100vh',
        background: '#050505',
        position: 'relative',
        overflow: 'hidden'
      }}
    />
  );
}
