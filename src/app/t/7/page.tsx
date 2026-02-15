'use client';

import React from 'react';
import TanzanianVisuals from '../../components/TanzanianVisuals';
import styles from './styles.module.css';

export default function TanzanianPage() {
  return (
    <div className={styles.container}>
      <TanzanianVisuals />
      
      <div className={styles.overlay}>
        <div className={styles.content}>
          <h1 className={styles.title}>MAKONDE_SPIRIT</h1>
          <p className={styles.subtitle}>// TRADITIONAL ARTISTRY IN 3D SPACE</p>
          
          <div className={styles.description}>
            <p>An exploration of Tanzanian Makonde carvings, reimagined through digital minimalism. Black ebony textures paired with bone-white highlights.</p>
          </div>
          
          <div className={styles.badge}>
            <span>ANIMAL_STICK_v1.0</span>
          </div>
        </div>
        
        <div className={styles.footer}>
          <span>SYS_AESTHETIC: TANZANIAN_MODERN</span>
          <span>LOC: DAR_ES_SALAAM</span>
        </div>
      </div>
      
      {/* Decorative patterns */}
      <div className={styles.patternLeft} />
      <div className={styles.patternRight} />
    </div>
  );
}
