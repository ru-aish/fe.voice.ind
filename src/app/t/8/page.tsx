'use client';

import React, { useState, useEffect, useRef } from 'react';
import s from './styles.module.css';

// ─── Data ────────────────────────────────────────────────────
const FEATURES = [
  { num: '01', title: 'Smart Appointment Booking', desc: 'Seamlessly integrates with your calendar. The AI checks real-time availability and blocks slots instantly without human intervention.', primary: true },
  { num: '02', title: 'Instant Lead Capture', desc: 'Qualifies callers, extracts intent, and updates your CRM before you even wake up.' },
  { num: '03', title: 'Automated Follow-ups', desc: 'Triggers WhatsApp/SMS flows immediately after the call concludes.' },
  { num: '04', title: '24/7 Availability', desc: 'Weekends, holidays, 3 AM. Your business is always open for inquiries.' },
  { num: '05', title: 'Human Handoff', desc: 'Recognizes complex queries and instantly routes them to human staff.' },
];

const TESTIMONIALS = [
  { name: 'Rajesh Mehta', role: 'CEO, TechScale', quote: '67% more conversions. Every call answered. Total game changer.', metric: '+67%' },
  { name: 'Priya Sharma', role: 'Ops Head, GrowthBox', quote: 'Automated everything. Team focuses on closing, not answering phones.', metric: '₹8L/mo' },
  { name: 'Amit Verma', role: 'Founder, QuickServ', quote: '90% faster response. Best investment this year.', metric: '90%' },
];

const FAQS = [
  { q: 'Can it handle angry customers?', a: 'Yes. The AI is trained to detect sentiment. If a caller seems frustrated or angry, it instantly de-escalates or routes the call to a human supervisor while flagging it as urgent.' },
  { q: 'Does it sound robotic?', a: 'Not at all. We use advanced voice synthesis that includes natural pauses, "umms," and breathiness. In blind tests, 92% of callers did not realize they were speaking to an AI.' },
  { q: 'What if the AI makes a mistake?', a: 'You have full control. Every call is transcribed and recorded. You can set strict guardrails for what the AI can and cannot say. If it\'s unsure, it\'s programmed to ask for clarification or transfer the call.' },
  { q: 'How do I see the calls?', a: 'You get a real-time dashboard. See live transcripts, listen to recordings, and view analytics. You also get instant notifications via WhatsApp or Email for every booked lead.' },
  { q: 'Is my data secure?', a: 'Absolutely. We use enterprise-grade encryption (AES-256) for all data. We are GDPR compliant and your customer data is never shared or used to train public models without consent.' },
  { q: 'Can I customize the script?', a: 'Yes. You can provide your own scripts, FAQs, and business rules. The AI adapts to your specific brand tone—whether professional, friendly, or casual.' },
  { q: 'How long does setup take?', a: 'Most businesses are fully operational within 48 hours. We handle the technical integration, train the AI on your specific services and policies, and provide a dedicated success manager.' },
  { q: 'What\'s the pricing structure?', a: 'Pricing ranges from ₹5,000 to ₹30,000 per month based on your call volume and features required. Most small and mid-size businesses fall in the ₹8,000-₹15,000 range. All plans include unlimited calls and dedicated support.' },
];

const PRICING_FEATURES = [
  '24/7 Voice Agent',
  'Calendar Integration',
  'CRM Sync',
  'WhatsApp Follow-ups',
  'Analytics Dashboard',
  'Dedicated Manager',
];

const CHAOS_STORY = [
  { time: '8:45 AM', text: 'New lead calls while you\'re in a meeting', tag: 'voicemail', icon: 'phone' },
  { time: '9:15 AM', text: 'Customer needs urgent appointment today', tag: null, icon: 'alert' },
  { time: '12:30 PM', text: 'You finally check voicemail during lunch', tag: null, icon: 'phone-check' },
  { time: '12:45 PM', text: 'Call back — already went to competitor', tag: 'lost', icon: 'x' },
];

const CHAIN_ITEMS = [
  { title: 'Empty Appointment Slots', content: 'Missed calls mean empty slots. With average lead values of ₹2,000-₹5,000, just 3 empty slots per day costs your business over ₹20 lakh annually in lost revenue.' },
  { title: 'Leads Go to Competitors', content: 'When prospects can\'t reach you, they call the next business. 85% of callers won\'t leave a voicemail — they simply move on to someone who answers.' },
  { title: 'Staff Burnout & Turnover', content: 'Your team shouldn\'t be receptionists. Juggling core work and phone calls leads to burnout, mistakes, and high turnover costs averaging ₹3-5 lakh per employee.' },
];

// ─── INR Formatter ───────────────────────────────────────────
const inrFormat = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 });
const numFormat = new Intl.NumberFormat('en-IN');

// ─── Component ───────────────────────────────────────────────
export default function DorkkBrutalistPage() {
  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Cursor state
  const cursorDotRef = useRef<HTMLDivElement>(null);
  const cursorOutlineRef = useRef<HTMLDivElement>(null);
  const pageRef = useRef<HTMLDivElement>(null);
  const [cursorHover, setCursorHover] = useState(false);

  // Calculator state
  const [calls, setCalls] = useState(45);
  const [dealValue, setDealValue] = useState(2500);

  // FAQ state
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  
  // Chain reaction state
  const [openChain, setOpenChain] = useState<number | null>(null);

  // Canvas Ref
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Contact form state
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [contactSubmitted, setContactSubmitted] = useState(false);

  // Scroll reveal
  useEffect(() => {
    const els = document.querySelectorAll(`.${s.reveal}`);
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add(s.revealActive);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -20px 0px' }
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // Custom cursor (pointer:fine devices only)
  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return;

    const dot = cursorDotRef.current;
    const outline = cursorOutlineRef.current;
    if (!dot || !outline) return;

    const onMouseMove = (e: MouseEvent) => {
      dot.style.left = `${e.clientX}px`;
      dot.style.top = `${e.clientY}px`;
      outline.animate(
        { left: `${e.clientX}px`, top: `${e.clientY}px` },
        { duration: 500, fill: 'forwards' }
      );
    };

    window.addEventListener('mousemove', onMouseMove);
    return () => window.removeEventListener('mousemove', onMouseMove);
  }, []);

  // Hover targets for cursor
  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return;
    const page = pageRef.current;
    if (!page) return;
    const targets = page.querySelectorAll('button, a, input[type="range"], input[type="text"], input[type="email"], input[type="tel"], textarea, [data-hover]');
    const enter = () => setCursorHover(true);
    const leave = () => setCursorHover(false);
    targets.forEach((t) => {
      t.addEventListener('mouseenter', enter);
      t.addEventListener('mouseleave', leave);
    });
    return () => {
      targets.forEach((t) => {
        t.removeEventListener('mouseenter', enter);
        t.removeEventListener('mouseleave', leave);
      });
    };
  }, []);

  // ─── Canvas Visualizer Effect ─────────────────────────────────
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

  // Calculator derived value
  const annualLoss = calls * dealValue * 12;

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In production, send to API
    setContactSubmitted(true);
    setTimeout(() => setContactSubmitted(false), 5000);
  };

  return (
    <div ref={pageRef} className={`${s.page} ${cursorHover ? s.cursorHover : ''}`}>
      {/* Noise overlay */}
      <div className={s.noise} />

      {/* Custom cursor */}
      <div ref={cursorDotRef} className={s.cursorDot} />
      <div ref={cursorOutlineRef} className={s.cursorOutline} />

      <div className={s.container}>
        {/* ─── NAV ─────────────────────────────────────── */}
        <nav className={`${s.nav} ${s.reveal}`} data-hover>
          <a href="/" className={s.logo}>Elevix.</a>
          <div className={s.navRight}>
            <div className={s.secureBadge}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                <path d="M9 12l2 2 4-4" />
              </svg>
              <span>Enterprise Secure</span>
            </div>
          </div>
        </nav>

        {/* ─── HERO ────────────────────────────────────── */}
        <header className={s.hero}>
          <div className={`${s.reveal}`}>
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

          {/* Voice Wave Visualizer (Canvas) */}
          <div className={`${s.reveal}`} style={{ transitionDelay: '0.1s' }}>
            <div className={s.waveContainer} data-hover>
              <canvas ref={canvasRef} className={s.waveCanvas} />
              <div className={s.waveLabel}>
                <span className={s.waveLabelDot} />
                Live Voice Agent
              </div>
            </div>
          </div>
        </header>

        {/* ─── PROBLEM: CHAOS STORY ──────────────────────── */}
        <section className={s.problemSection}>
          <div className={s.problemGrid}>
            <div className={s.reveal}>
              <h3 className={s.columnLabel}>The Reality</h3>
              <h2 className={s.problemTitle}>
                The Hidden Cost of<br /><span className={s.textDanger}>Missed Calls.</span>
              </h2>
              <p className={s.problemDesc}>
                Every unanswered call is a customer choosing your competitor.
              </p>
              
              {/* Chaos Timeline */}
              <div className={s.chaosTimeline}>
                {CHAOS_STORY.map((item, i) => (
                  <div key={i} className={s.chaosItem}>
                    <div className={s.chaosTime}>{item.time}</div>
                    <div className={s.chaosDot} />
                    <div className={s.chaosContent}>
                      <span>{item.text}</span>
                      {item.tag && <span className={`${s.chaosTag} ${item.tag === 'lost' ? s.chaosTagDanger : ''}`}>{item.tag}</span>}
                    </div>
                  </div>
                ))}
                <div className={`${s.chaosItem} ${s.chaosItemResult}`}>
                  <div className={s.chaosTime}>Result</div>
                  <div className={`${s.chaosDot} ${s.chaosDotDanger}`} />
                  <div className={s.chaosContent}>
                    <span className={s.textDanger}>-₹2,500+ lifetime customer value lost</span>
                  </div>
                </div>
              </div>

              {/* Chain Reaction */}
              <div className={s.chainReaction}>
                <h4 className={s.chainTitle}>The Domino Effect</h4>
                {CHAIN_ITEMS.map((item, i) => (
                  <div key={i} className={s.chainItem}>
                    <button
                      className={`${s.chainBtn} ${openChain === i ? s.chainBtnOpen : ''}`}
                      onClick={() => setOpenChain(openChain === i ? null : i)}
                      data-hover
                    >
                      <span>{item.title}</span>
                      <span className={s.chainArrow}>&#9660;</span>
                    </button>
                    {openChain === i && (
                      <div className={s.chainAnswer}>{item.content}</div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Calculator */}
            <div className={`${s.reveal}`} style={{ transitionDelay: '0.1s' }}>
              <h3 className={s.columnLabel}>The Cost</h3>
              <div className={s.calcBox}>
                <h4 className={s.calcBoxTitle}>Your Business&apos;s Lost Revenue</h4>
                <div className={s.sliderGroup} data-hover>
                  <div className={s.sliderHeader}>
                    <span>Missed Calls / Month</span>
                    <span className={s.sliderValue}>{numFormat.format(calls)}</span>
                  </div>
                  <input
                    type="range"
                    min={10}
                    max={200}
                    value={calls}
                    onChange={(e) => setCalls(parseInt(e.target.value))}
                    className={s.slider}
                    aria-label="Missed calls per month"
                  />
                </div>

                <div className={s.sliderGroup} data-hover>
                  <div className={s.sliderHeader}>
                    <span>Avg. Value per Lead (₹)</span>
                    <span className={s.sliderValue}>{numFormat.format(dealValue)}</span>
                  </div>
                  <input
                    type="range"
                    min={500}
                    max={10000}
                    step={500}
                    value={dealValue}
                    onChange={(e) => setDealValue(parseInt(e.target.value))}
                    className={s.slider}
                    aria-label="Average value per lead"
                  />
                </div>

                <div className={s.resultBox}>
                  <div className={s.resultLabel}>Revenue Lost Annually</div>
                  <div className={s.resultNumber}>{inrFormat.format(annualLoss)}</div>
                </div>

                {/* Hidden costs grid */}
                <div className={s.hiddenCosts}>
                  <h5 className={s.hiddenCostsTitle}>Additional Costs You&apos;re Paying</h5>
                  <div className={s.hiddenCostsGrid}>
                    <div className={s.hiddenCostItem}>
                      <span className={s.hiddenCostLabel}>Front Desk</span>
                      <span className={s.hiddenCostValue}>₹4.2L</span>
                    </div>
                    <div className={s.hiddenCostItem}>
                      <span className={s.hiddenCostLabel}>No-Shows</span>
                      <span className={s.hiddenCostValue}>₹2.1L</span>
                    </div>
                    <div className={s.hiddenCostItem}>
                      <span className={s.hiddenCostLabel}>After-Hours</span>
                      <span className={s.hiddenCostValue}>₹2.8L</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─── SOLUTION ────────────────────────────────── */}
        <section className={s.solutionSection}>
          <h2 className={`${s.sectionTitle} ${s.reveal}`}>
            Your 24/7<br /><span className={s.textAccent}>AI Receptionist.</span>
          </h2>
          <p className={`${s.sectionSubtitle} ${s.reveal}`}>
            Answers every call instantly. Books appointments. Resolves queries. Captures leads. Sounds 100% human.
          </p>

          <div className={`${s.statsGrid} ${s.reveal}`}>
            {[
              { value: '<500ms', label: 'Response Time' },
              { value: '24/7', label: 'Availability' },
              { value: '92%', label: 'Human Rating' },
            ].map((stat) => (
              <div key={stat.label} className={s.statCard} data-hover>
                <div className={s.statValue}>{stat.value}</div>
                <div className={s.statLabel}>{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Conversation Log with Before/After layout */}
          <div className={`${s.conversationLog} ${s.reveal}`}>
            <div className={s.convoHeader}>
              <div className={s.convoDot} />
              <span className={s.convoLabel}>Live Communication Log</span>
            </div>
            
            {/* Caller messages on the RIGHT, AI on the LEFT */}
            <div className={s.convoMessages}>
              <div className={`${s.messageRow} ${s.messageRight}`}>
                <div className={s.messageBubble}>
                  <span className={s.msgTag}>[CALLER]</span>
                  <span>&quot;Hi, I need to book an appointment for tomorrow...&quot;</span>
                </div>
              </div>
              <div className={`${s.messageRow} ${s.messageLeft}`}>
                <div className={s.messageBubble}>
                  <span className={s.msgTagAI}>[AI]</span>
                  <span>&quot;Of course! I have openings at 11 AM and 3 PM. Which works better?&quot;</span>
                  <span className={s.msgLatency}>380ms</span>
                </div>
              </div>
              <div className={`${s.messageRow} ${s.messageRight}`}>
                <div className={s.messageBubble}>
                  <span className={s.msgTag}>[CALLER]</span>
                  <span>&quot;3 PM please. What are your charges?&quot;</span>
                </div>
              </div>
              <div className={`${s.messageRow} ${s.messageLeft}`}>
                <div className={s.messageBubble}>
                  <span className={s.msgTagAI}>[AI]</span>
                  <span>&quot;Our consultation fee is ₹1,500. Shall I confirm the slot?&quot;</span>
                  <span className={s.msgLatency}>410ms</span>
                </div>
              </div>
              <div className={`${s.messageRow} ${s.messageRight}`}>
                <div className={s.messageBubble}>
                  <span className={s.msgTag}>[CALLER]</span>
                  <span>&quot;Yes, go ahead.&quot;</span>
                </div>
              </div>
              <div className={`${s.messageRow} ${s.messageLeft}`}>
                <div className={s.messageBubble}>
                  <span className={s.msgTagAI}>[AI]</span>
                  <span>&quot;Booked for 3 PM tomorrow. Confirmation SMS sent. Anything else?&quot;</span>
                  <span className={s.msgLatency}>420ms</span>
                </div>
              </div>
            </div>

            <div className={s.convoStatus}>
              <span className={s.convoStatusItem}><span className={s.convoStatusDot} /> Booked</span>
              <span className={s.convoStatusItem}><span className={s.convoStatusDot} /> SMS Sent</span>
              <span className={s.convoStatusItem}><span className={s.convoStatusDot} /> Calendar Updated</span>
            </div>
          </div>
        </section>

        {/* ─── FEATURES BENTO ──────────────────────────── */}
        <section className={s.featuresSection}>
          <h2 className={`${s.sectionTitle} ${s.reveal}`}>
            Everything Your Receptionist Does,<br /><span className={s.textAccent}>Automated.</span>
          </h2>

          <div className={s.bentoGrid}>
            {FEATURES.map((feat, i) => (
              <div
                key={feat.num}
                className={`${s.bentoItem} ${feat.primary ? s.bentoPrimary : ''} ${s.reveal}`}
                style={{ transitionDelay: `${i * 0.05}s` }}
                data-hover
              >
                <span className={s.bentoIcon}>{feat.num}</span>
                <h3 className={s.bentoTitle}>{feat.title}</h3>
                <p className={s.bentoDesc}>{feat.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ─── TESTIMONIALS ────────────────────────────── */}
        <section className={s.testimonialsSection}>
          <h2 className={`${s.sectionTitle} ${s.reveal}`}>
            Real Results.<br /><span className={s.textAccent}>Real Numbers.</span>
          </h2>

          <div className={s.testimonialsGrid}>
            {TESTIMONIALS.map((t, i) => (
              <div
                key={t.name}
                className={`${s.testimonialCard} ${s.reveal}`}
                style={{ transitionDelay: `${i * 0.08}s` }}
                data-hover
              >
                <div className={s.testimonialMetric}>{t.metric}</div>
                <p className={s.testimonialQuote}>&quot;{t.quote}&quot;</p>
                <div className={s.testimonialAuthor}>
                  <p className={s.testimonialName}>{t.name}</p>
                  <p className={s.testimonialRole}>{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ─── PRICING ─────────────────────────────────── */}
        <section className={s.pricingSection}>
          <h2 className={`${s.sectionTitle} ${s.reveal}`}>
            Simple<br /><span className={s.textAccent}>Pricing.</span>
          </h2>

          <div className={`${s.pricingCard} ${s.reveal}`}>
            <div className={s.pricingLabel}>Estimated Monthly</div>
            <div className={s.pricingRange}>
              <span className={s.pricingValue}>₹5,000</span>
              <span className={s.pricingDash}>—</span>
              <span className={s.pricingValue}>₹30,000</span>
            </div>
            <p className={s.pricingNote}>Based on call volume and features required</p>
            <div className={s.pricingContext}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 16v-4M12 8h.01" />
              </svg>
              <span>Most small &amp; mid-size businesses fall in the <strong>₹8,000 — ₹15,000</strong> range</span>
            </div>
            <div className={s.pricingFeatures}>
              {PRICING_FEATURES.map((feat) => (
                <span key={feat} className={s.pricingFeatureItem}>
                  <span className={s.pricingCheckmark}>+</span> {feat}
                </span>
              ))}
            </div>
            <a href="/book" className={s.btnPrimary} data-hover>Get Started</a>
          </div>
        </section>

        {/* ─── FAQ ──────────────────────────────────────── */}
        <section className={s.faqSection}>
          <h2 className={`${s.sectionTitle} ${s.reveal}`}>
            Frequently<br /><span className={s.textAccent}>Asked.</span>
          </h2>

          <div className={s.faqContainer}>
            {FAQS.map((faq, i) => (
              <div key={i} className={`${s.faqItem} ${s.reveal}`} style={{ transitionDelay: `${i * 0.04}s` }}>
                <button
                  className={s.faqButton}
                  onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                  data-hover
                >
                  <span>{faq.q}</span>
                  <span className={`${s.faqArrow} ${activeFaq === i ? s.faqArrowOpen : ''}`}>&#9660;</span>
                </button>
                {activeFaq === i && (
                  <div className={s.faqAnswer}>{faq.a}</div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* ─── ASK AI CTA ──────────────────────────────── */}
        <section className={`${s.askAiSection} ${s.reveal}`}>
          <div className={s.askAiCard}>
            <h3 className={s.askAiTitle}>Questions? Ask Our Voice Agent Live</h3>
            <p className={s.askAiDesc}>
              Experience firsthand how our AI handles conversations — ask anything, book appointments, or test it yourself.
            </p>
            <a href="/demo" className={s.btnPrimary} data-hover>
              Talk to AI Now
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z" />
                <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                <path d="M12 19v3" />
              </svg>
            </a>
            <p className={s.askAiNote}>No signup required. Start talking instantly.</p>
          </div>
        </section>

        {/* ─── CONTACT US ────────────────────────────────── */}
        <section id="contact" className={s.contactSection}>
          <div className={s.contactGrid}>
            {/* Left Info */}
            <div className={`${s.contactInfo} ${s.reveal}`}>
              <h2 className={s.contactTitle}>
                Book Your<br /><span className={s.textAccent}>30-Minute</span><br />Setup Call
              </h2>
              <p className={s.contactDesc}>
                In this quick call, we&apos;ll configure your AI receptionist to match your business perfectly.
              </p>

              <div className={s.coverageList}>
                <h4>What we&apos;ll cover:</h4>
                <ul>
                  {[
                    'Your existing systems & CRM',
                    'Services & specialties offered',
                    'Voice tone & personality preferences',
                    'Business hours & scheduling rules',
                    'Custom scripts & FAQ responses',
                    'Any special requirements or workflows',
                  ].map((item, i) => (
                    <li key={i}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="16" height="16">
                        <path d="M20 6L9 17l-5-5" />
                      </svg>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className={s.promiseBox}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="22" height="22">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
                <p>
                  After this call, we&apos;ll build your AI in <strong>48 hours</strong>.
                  We deploy it and maintain it for the duration of your service.
                </p>
              </div>

              <div className={s.reachOut}>
                <h4>Questions? Reach us at:</h4>
                <a href="mailto:query@elevix.site" className={s.reachOutLink}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                  query@elevix.site
                </a>
              </div>
            </div>

            {/* Right Form */}
            <div className={`${s.contactFormWrapper} ${s.reveal}`} style={{ transitionDelay: '0.1s' }}>
              {contactSubmitted ? (
                <div className={s.formSuccess}>
                  <div className={s.formSuccessIcon}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="40" height="40">
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                  </div>
                  <h3>Thank You!</h3>
                  <p>We&apos;ll get back to you within 24 hours.</p>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className={s.contactForm}>
                  <div className={s.formGroup}>
                    <label htmlFor="c-name">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                      </svg>
                      Full Name <span className={s.required}>*</span>
                    </label>
                    <input
                      id="c-name"
                      type="text"
                      placeholder="Your Name"
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      required
                      className={s.input}
                    />
                  </div>
                  <div className={s.formGroup}>
                    <label htmlFor="c-email">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                        <polyline points="22,6 12,13 2,6" />
                      </svg>
                      Email <span className={s.required}>*</span>
                    </label>
                    <input
                      id="c-email"
                      type="email"
                      placeholder="you@company.com"
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      required
                      className={s.input}
                    />
                  </div>
                  <div className={s.formGroup}>
                    <label htmlFor="c-phone">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72" />
                      </svg>
                      Phone <span className={s.optional}>(optional)</span>
                    </label>
                    <input
                      id="c-phone"
                      type="tel"
                      placeholder="+91 98765 43210"
                      value={contactPhone}
                      onChange={(e) => setContactPhone(e.target.value)}
                      className={s.input}
                    />
                  </div>
                  <div className={s.formGroup}>
                    <label htmlFor="c-message">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                      </svg>
                      Message <span className={s.optional}>(optional)</span>
                    </label>
                    <textarea
                      id="c-message"
                      placeholder="Tell us about your business..."
                      value={contactMessage}
                      onChange={(e) => setContactMessage(e.target.value)}
                      rows={4}
                      className={s.textarea}
                    />
                  </div>
                  <button type="submit" className={s.btnPrimary} data-hover>
                    Book My Setup Call
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                      <rect x="3" y="4" width="18" height="18" rx="2" />
                      <path d="M16 2v4M8 2v4M3 10h18" />
                    </svg>
                  </button>
                  <p className={s.formNote}>
                    Or use our voice agent to book: <a href="/demo">Talk to AI</a>
                  </p>
                </form>
              )}
            </div>
          </div>
        </section>
      </div>

      {/* ─── MARQUEE CTA ─────────────────────────────── */}
      <a href="/demo" className={s.ctaLink} aria-label="Try the demo">
        <section className={s.ctaSection} data-hover>
          <div className={s.marqueeContent}>
            <span>Ready to Try? Abhi Baat Karo &#10022;</span>
            <span>Ready to Try? Abhi Baat Karo &#10022;</span>
            <span>Ready to Try? Abhi Baat Karo &#10022;</span>
            <span>Ready to Try? Abhi Baat Karo &#10022;</span>
          </div>
        </section>
      </a>

      {/* ─── FOOTER ──────────────────────────────────── */}
      <footer className={s.footer}>
        <div className={`${s.container} ${s.footerInner}`}>
          <p className={s.footerCopyright}>&copy; 2025 Elevix. All rights reserved.</p>
          <div className={s.footerLinks}>
            <a href="/demo" className={s.footerLink}>Demo</a>
            <a href="/book" className={s.footerLink}>Book a Call</a>
            <a href="mailto:query@elevix.site" className={s.footerLink}>query@elevix.site</a>
          </div>
          <p className={s.footerStatus}>
            <span className={s.footerStatusDot} />
            System Operational
          </p>
        </div>
      </footer>
    </div>
  );
}
