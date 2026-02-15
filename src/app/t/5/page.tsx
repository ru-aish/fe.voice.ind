import React from 'react';
import styles from './styles.module.css';

export default function Page() {
  return (
    <main className={styles.container}>
      <div className={styles.sketchOverlay} />
      
      <div className={styles.decoration + ' ' + styles.deco1}>
        <svg viewBox="0 0 100 100">
          <path d="M20,80 L40,60 L70,60 L90,80 M40,60 L45,40 L55,40 L60,60" fill="none" stroke="currentColor" strokeWidth="1" />
        </svg>
      </div>

      <header className={styles.header}>
        <h1 className={styles.title}>Savanna</h1>
        <p>A natural approach to voice intelligence.</p>
        <div className={styles.divider} />
      </header>

      <div className={styles.mainIllustration}>
        <svg viewBox="0 0 400 200">
          {/* Sketchy Stick Lion */}
          <path 
            className={styles.animalPath}
            d="M100,150 L140,150 L140,110 L260,110 L260,150 L300,150 M140,110 L130,80 L120,90 L110,60 L140,40 L170,60 L160,90 L150,80 L140,110 M260,110 L320,80 L330,90 M300,150 L310,140" 
          />
          {/* Mane detail */}
          <path className={styles.animalPath} d="M125,75 L115,85 M155,75 L165,85 M140,50 L140,30" />
        </svg>
      </div>

      <div className={styles.decoration + ' ' + styles.deco2}>
        <svg viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="30" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2,2" />
        </svg>
      </div>

      <footer className={styles.footer}>
        <button className={styles.cta}>Enter the Wild</button>
      </footer>
    </main>
  );
}
