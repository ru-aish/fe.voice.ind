'use client';

import { useRef } from 'react';
import dynamic from 'next/dynamic';
import type { AudioOrb3DHandle } from '../components/AudioOrb3D/AudioOrb3D';
import styles from './page.module.css';

const AudioOrb3D = dynamic(() => import('../components/AudioOrb3D/AudioOrb3D'), { ssr: false });

export default function DemoPage() {
  const audioOrbRef = useRef<AudioOrb3DHandle>(null);

  return (
    <div className={styles.container}>
      {/* Back button - minimal pill */}
      <a href="/" className={styles.homeButton}>
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M11 7H3M3 7L6 4M3 7L6 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        Home
      </a>

      <AudioOrb3D ref={audioOrbRef} />
    </div>
  );
}
