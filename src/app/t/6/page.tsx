import React from 'react';
import styles from './styles.module.css';

export default function Page() {
  return (
    <main className={styles.container}>
      {/* Grid Layout */}
      <div className={styles.box + ' ' + styles.titleBox}>
        <h1 className={styles.title}>KINETIC</h1>
        <h1 className={styles.title} style={{color: '#ff5722'}}>SAFARI</h1>
      </div>

      <div className={styles.box + ' ' + styles.accentBox}>
        <div className={styles.blink} style={{fontSize: '4rem', fontWeight: 900}}>!</div>
      </div>

      <div className={styles.box + ' ' + styles.animalBox}>
        <svg viewBox="0 0 200 200" className={styles.stickAnimal}>
          {/* Geometric Stick Gazelle */}
          <path d="M40,160 L60,120 L140,120 L160,160" />
          <path d="M60,120 L80,60 L100,20 L110,40 L100,60 L140,120" />
          <path d="M100,20 L120,10 M100,20 L80,10" />
          <circle cx="95" cy="40" r="3" fill="black" />
        </svg>
      </div>

      <div className={styles.box + ' ' + styles.contentBox}>
        <p>HIGH-VELOCITY INTERFACES FOR THE MODERN PREDATOR.</p>
        <p style={{marginTop: '1rem', fontSize: '1rem', opacity: 0.6}}>BUILT FOR PRECISION. OPTIMIZED FOR SPEED. UNCOMPROMISING AESTHETICS.</p>
      </div>

      <div className={styles.box + ' ' + styles.ctaBox}>
        <span className={styles.ctaText}>Launch →</span>
      </div>
    </main>
  );
}
