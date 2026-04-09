'use client';

import { useRef, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import type { AudioOrb3DHandle } from '../components/AudioOrb3D/AudioOrb3D';

const AudioOrb3D = dynamic(() => import('../components/AudioOrb3D/AudioOrb3D'), { ssr: false });

export default function DemoPage() {
  const audioOrbRef = useRef<AudioOrb3DHandle>(null);
  const [loaded, setLoaded] = useState(false);

  // Wake up the Render server on load
  useEffect(() => {
    try {
      fetch('https://voice-ind.onrender.com/', { mode: 'no-cors' }).catch(() => {});
    } catch (e) {
      // Ignore errors
    }
    // Trigger entrance animation
    const timer = setTimeout(() => setLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="demo-root">
      {/* Noise texture overlay */}
      <div className="demo-noise" />

      {/* Ambient gradient blobs */}
      <div className="demo-ambient demo-ambient--1" />
      <div className="demo-ambient demo-ambient--2" />

      {/* Top bar with glass effect */}
      <header className={`demo-header ${loaded ? 'demo-header--visible' : ''}`}>
        <a href="/" className="demo-back">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M11 7H3M3 7L6 4M3 7L6 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span>Home</span>
        </a>

        <div className="demo-brand">
          <div className="demo-brand-dot" />
          <span className="demo-brand-name">Elevix</span>
          <span className="demo-brand-badge">Live Demo</span>
        </div>

        <div className="demo-header-right">
          <div className="demo-status-pill">
            <span className="demo-status-dot" />
            <span>Active</span>
          </div>
        </div>
      </header>

      {/* 3D Orb Container */}
      <div className={`demo-orb-container ${loaded ? 'demo-orb-container--visible' : ''}`}>
        <AudioOrb3D ref={audioOrbRef} />
      </div>

      {/* Bottom info bar */}
      <footer className={`demo-footer ${loaded ? 'demo-footer--visible' : ''}`}>
        <div className="demo-footer-inner">
          <div className="demo-footer-item">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              <path d="M9 12l2 2 4-4" />
            </svg>
            <span>End-to-End Encrypted</span>
          </div>
          <span className="demo-footer-sep" />
          <div className="demo-footer-item">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>&lt;500ms Latency</span>
          </div>
          <span className="demo-footer-sep" />
          <div className="demo-footer-item">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z" />
              <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
              <path d="M12 19v3" />
            </svg>
            <span>Human-Grade Voice</span>
          </div>
        </div>
      </footer>

      <style>{`
        /* ─── Reset & Base ─── */
        .demo-root {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100dvh;
          overflow: hidden;
          background: #030303;
          font-family: 'Instrument Sans', -apple-system, BlinkMacSystemFont, sans-serif;
        }

        /* ─── Noise Overlay ─── */
        .demo-noise {
          position: fixed;
          inset: 0;
          z-index: 50;
          pointer-events: none;
          opacity: 0.025;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E");
          background-repeat: repeat;
          background-size: 128px 128px;
        }

        /* ─── Ambient Gradients ─── */
        .demo-ambient {
          position: fixed;
          border-radius: 50%;
          filter: blur(120px);
          pointer-events: none;
          z-index: 1;
          opacity: 0;
          animation: ambientFadeIn 2s ease-out forwards;
        }

        .demo-ambient--1 {
          width: 600px;
          height: 600px;
          top: -200px;
          left: -200px;
          background: radial-gradient(circle, rgba(0, 224, 158, 0.06) 0%, transparent 70%);
          animation-delay: 0.5s;
        }

        .demo-ambient--2 {
          width: 500px;
          height: 500px;
          bottom: -150px;
          right: -150px;
          background: radial-gradient(circle, rgba(0, 180, 220, 0.04) 0%, transparent 70%);
          animation-delay: 1s;
        }

        @keyframes ambientFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        /* ─── Header ─── */
        .demo-header {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 40;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px 20px;
          background: rgba(3, 3, 3, 0.6);
          backdrop-filter: blur(24px) saturate(1.4);
          -webkit-backdrop-filter: blur(24px) saturate(1.4);
          border-bottom: 1px solid rgba(255, 255, 255, 0.04);
          opacity: 0;
          transform: translateY(-10px);
          transition: opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1),
                      transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .demo-header--visible {
          opacity: 1;
          transform: translateY(0);
        }

        /* Back button */
        .demo-back {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 7px 14px;
          font-size: 13px;
          font-weight: 500;
          color: rgba(255, 255, 255, 0.55);
          background: rgba(255, 255, 255, 0.04);
          border-radius: 9999px;
          border: 1px solid rgba(255, 255, 255, 0.06);
          text-decoration: none;
          transition: all 0.2s ease;
          letter-spacing: 0.01em;
        }

        .demo-back:hover {
          color: rgba(255, 255, 255, 0.85);
          background: rgba(255, 255, 255, 0.08);
          border-color: rgba(255, 255, 255, 0.12);
        }

        /* Brand center */
        .demo-brand {
          display: flex;
          align-items: center;
          gap: 8px;
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
        }

        .demo-brand-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #00e09e;
          box-shadow: 0 0 12px rgba(0, 224, 158, 0.4);
          animation: brandPulse 2.5s ease-in-out infinite;
        }

        @keyframes brandPulse {
          0%, 100% { opacity: 1; box-shadow: 0 0 12px rgba(0, 224, 158, 0.4); }
          50% { opacity: 0.6; box-shadow: 0 0 6px rgba(0, 224, 158, 0.2); }
        }

        .demo-brand-name {
          font-size: 15px;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.9);
          letter-spacing: -0.01em;
        }

        .demo-brand-badge {
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #00e09e;
          background: rgba(0, 224, 158, 0.08);
          padding: 3px 8px;
          border-radius: 4px;
          border: 1px solid rgba(0, 224, 158, 0.12);
        }

        /* Header right */
        .demo-header-right {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .demo-status-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 5px 12px;
          font-size: 11px;
          font-weight: 500;
          font-family: 'JetBrains Mono', 'SF Mono', monospace;
          color: rgba(0, 224, 158, 0.7);
          background: rgba(0, 224, 158, 0.04);
          border: 1px solid rgba(0, 224, 158, 0.08);
          border-radius: 9999px;
          letter-spacing: 0.04em;
        }

        .demo-status-dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: #00e09e;
          animation: dotPulse 1.5s ease-in-out infinite;
        }

        @keyframes dotPulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.35; }
        }

        /* ─── Orb Container ─── */
        .demo-orb-container {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 5;
          opacity: 0;
          transform: scale(0.98);
          transition: opacity 1s cubic-bezier(0.16, 1, 0.3, 1) 0.2s,
                      transform 1s cubic-bezier(0.16, 1, 0.3, 1) 0.2s;
        }

        .demo-orb-container--visible {
          opacity: 1;
          transform: scale(1);
        }

        /* ─── Footer ─── */
        .demo-footer {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          z-index: 40;
          padding: 0 20px 14px;
          pointer-events: none;
          opacity: 0;
          transform: translateY(10px);
          transition: opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.4s,
                      transform 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.4s;
        }

        .demo-footer--visible {
          opacity: 1;
          transform: translateY(0);
        }

        .demo-footer-inner {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 16px;
          padding: 10px 20px;
          background: rgba(3, 3, 3, 0.55);
          backdrop-filter: blur(24px) saturate(1.4);
          -webkit-backdrop-filter: blur(24px) saturate(1.4);
          border: 1px solid rgba(255, 255, 255, 0.04);
          border-radius: 9999px;
          max-width: fit-content;
          margin: 0 auto;
        }

        .demo-footer-item {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 11.5px;
          font-weight: 500;
          color: rgba(255, 255, 255, 0.35);
          letter-spacing: 0.01em;
          white-space: nowrap;
        }

        .demo-footer-item svg {
          color: rgba(255, 255, 255, 0.2);
          flex-shrink: 0;
        }

        .demo-footer-sep {
          width: 1px;
          height: 12px;
          background: rgba(255, 255, 255, 0.06);
          flex-shrink: 0;
        }

        /* ─── Mobile Responsive ─── */
        @media (max-width: 640px) {
          .demo-header {
            padding: 12px 14px;
          }

          .demo-back span {
            display: none;
          }

          .demo-back {
            padding: 8px 10px;
          }

          .demo-brand-name {
            font-size: 13px;
          }

          .demo-brand-badge {
            font-size: 9px;
            padding: 2px 6px;
          }

          .demo-status-pill span:not(.demo-status-dot) {
            display: none;
          }

          .demo-status-pill {
            padding: 6px;
            border-radius: 50%;
          }

          .demo-footer-inner {
            gap: 10px;
            padding: 8px 14px;
          }

          .demo-footer-item {
            font-size: 10px;
            gap: 4px;
          }

          .demo-footer-item svg {
            width: 12px;
            height: 12px;
          }

          .demo-footer-sep {
            height: 10px;
          }
        }

        @media (max-width: 420px) {
          .demo-footer-item:nth-child(5),
          .demo-footer-sep:nth-child(4) {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}
