import React from 'react';
import styles from './styles.module.css';

export default function Page() {
  return (
    <main className={styles.container}>
      <div className={styles.noise} />
      
      <div className={styles.animalWrapper}>
        <svg viewBox="0 0 200 200" className={styles.stickAnimal}>
          {/* Stylized Stick Wolf */}
          <path 
            className={styles.animalPath}
            d="M40,140 L60,100 L90,80 L130,80 L160,100 L170,140 M90,80 L80,50 L70,45 L75,30 L95,45 L105,75 M130,80 L140,50 L150,45 L145,30 L125,45 L115,75 M60,100 L50,110 L30,115 M160,100 L170,110 L190,115" 
          />
          {/* Eyes */}
          <circle className={styles.eyes} cx="85" cy="65" r="3" />
          <circle className={styles.eyes} cx="135" cy="65" r="3" />
          
          {/* Leg details */}
          <path className={styles.animalPath} d="M70,140 L65,170 L55,175" />
          <path className={styles.animalPath} d="M100,140 L105,175 L115,180" />
          <path className={styles.animalPath} d="M140,140 L145,170 L155,175" />
        </svg>
      </div>

      <div className={styles.content}>
        <h1 className={styles.title}>PRIMITIVE</h1>
        <p className={styles.subtitle}>RAW INTELLIGENCE. UNTAMED INTERFACE.</p>
        <button className={styles.cta}>Start Session</button>
      </div>
    </main>
  );
}
