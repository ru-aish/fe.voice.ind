'use client';

import React, { useEffect, useRef } from 'react';
import s from './WaveVisualizer.module.css';

export default function WaveVisualizer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let time = 0;
    
    const resize = () => {
      const parent = canvas.parentElement;
      if (parent) {
        const dpr = window.devicePixelRatio || 1;
        canvas.width = parent.clientWidth * dpr;
        canvas.height = parent.clientHeight * dpr;
        canvas.style.width = `${parent.clientWidth}px`;
        canvas.style.height = `${parent.clientHeight}px`;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      }
    };
    window.addEventListener('resize', resize);
    resize();

    const draw = () => {
      if (!canvas.parentElement) return;
      const width = canvas.parentElement.clientWidth;
      const height = canvas.parentElement.clientHeight;
      const centerX = width / 2;
      const centerY = height / 2;
      
      ctx.clearRect(0, 0, width, height);
      
      const bars = 72;
      const innerRadius = Math.min(width, height) * 0.18;
      const outerRadius = Math.min(width, height) * 0.22;
      
      time += 0.03;

      // Outer glow ring
      ctx.beginPath();
      ctx.arc(centerX, centerY, outerRadius + 5, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(204, 255, 0, 0.06)';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Inner ring
      ctx.beginPath();
      ctx.arc(centerX, centerY, innerRadius - 2, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(204, 255, 0, 0.08)';
      ctx.lineWidth = 0.5;
      ctx.stroke();

      // Draw Radial Bars with smooth sine-based animation
      for (let i = 0; i < bars; i++) {
        const angle = (Math.PI * 2 * i) / bars;
        
        // Multi-layered wave simulation
        const wave1 = Math.sin(time * 2.5 + i * 0.15) * 0.4;
        const wave2 = Math.sin(time * 1.8 + i * 0.3) * 0.3;
        const wave3 = Math.cos(time * 3.2 + i * 0.08) * 0.3;
        const combinedWave = (wave1 + wave2 + wave3);
        
        const minBarH = 8;
        const maxBarH = 35;
        const barHeight = minBarH + Math.abs(combinedWave) * maxBarH;
        
        const x1 = centerX + Math.cos(angle) * (innerRadius + 4);
        const y1 = centerY + Math.sin(angle) * (innerRadius + 4);
        const x2 = centerX + Math.cos(angle) * (innerRadius + 4 + barHeight);
        const y2 = centerY + Math.sin(angle) * (innerRadius + 4 + barHeight);

        const opacity = 0.3 + Math.abs(combinedWave) * 0.7;

        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.strokeStyle = `rgba(204, 255, 0, ${opacity})`;
        ctx.lineWidth = 2.5;
        ctx.lineCap = 'round';
        ctx.stroke();
      }

      // Center dot with glow
      const pulseSize = 5 + Math.sin(time * 2) * 1.5;
      ctx.beginPath();
      ctx.arc(centerX, centerY, pulseSize, 0, Math.PI * 2);
      ctx.fillStyle = '#ccff00';
      ctx.shadowBlur = 25;
      ctx.shadowColor = 'rgba(204, 255, 0, 0.5)';
      ctx.fill();
      ctx.shadowBlur = 0;

      // Second pulse ring
      const ringSize = 18 + Math.sin(time * 1.5) * 4;
      ctx.beginPath();
      ctx.arc(centerX, centerY, ringSize, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(204, 255, 0, ${0.15 + Math.sin(time * 1.5) * 0.1})`;
      ctx.lineWidth = 1;
      ctx.stroke();

      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <div className={s.waveContainer} data-hover>
      <canvas ref={canvasRef} className={s.waveCanvas} />
      <div className={s.waveLabel}>
        <span className={s.waveLabelDot} />
        Live Voice Agent
      </div>
    </div>
  );
}
