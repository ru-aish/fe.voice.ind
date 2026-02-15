'use client';

import React from 'react';
import s from './Hero.module.css';
import WaveVisualizer from '../WaveVisualizer/WaveVisualizer';

interface HeroProps {
  revealClass?: string;
  onReveal?: (node: HTMLElement | null) => void;
}

export default function Hero({ revealClass }: HeroProps) {
  return (
    <header className={s.hero}>
      {/* Left Column: Content */}
      <div className={`${s.heroContent} ${revealClass || ''}`}>
        <div className={s.heroLabel} data-hover>AI Receptionist v2.0</div>
        
        <h1 className={s.heroTitle}>
          Stop Losing<br />
          <span className={s.textAccent}>₹50,000+</span><br />
          To Missed Calls.
        </h1>
        
        <p className={s.heroSubtitle}>
          Deploy a 24/7 AI Receptionist that sounds human, books appointments, and captures every lead. Stop bleeding revenue today.
        </p>
        
        <div className={s.heroBullets}>
          {['100% Human Voice', '24/7 Availability', '48hr Setup', 'No Lock-in'].map((item) => (
            <div key={item} className={s.bulletItem}>
              <span className={s.bulletCheck}>+</span>
              <span>{item}</span>
            </div>
          ))}
        </div>
        
        <div className={s.heroBtns}>
          <a href="/demo" className={s.btnPrimary} data-hover>Try Our Demo</a>
          <a href="/book" className={s.btn} data-hover>Contact Us</a>
        </div>
        
        {/* Trust signals */}
        <div className={s.trustRow}>
          <span className={s.trustItem}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="12" height="12"><path d="M9 12l2 2 4-4" /></svg>
            No Credit Card
          </span>
          <span className={s.trustItem}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="12" height="12"><path d="M9 12l2 2 4-4" /></svg>
            Cancel Anytime
          </span>
          <span className={s.trustItem}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="12" height="12"><path d="M9 12l2 2 4-4" /></svg>
            Hindi, English, Gujarati
          </span>
        </div>
      </div>

      {/* Right Column: Visualizer */}
      <div className={`${revealClass || ''}`} style={{ transitionDelay: '0.1s', height: '100%', display: 'flex' }}>
        <WaveVisualizer />
      </div>
    </header>
  );
}
