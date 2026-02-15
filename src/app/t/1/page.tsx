'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import styles from './styles.module.css';

export default function NeonShadowPage() {
  const [glitchActive, setGlitchActive] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set());
  const [stats, setStats] = useState({ calls: 50, value: 5000, missRate: 25 });
  const [isClient, setIsClient] = useState(false);

  // Generate stable random particle positions to avoid hydration mismatch
  const particleStyles = useMemo(() => {
    return [...Array(20)].map(() => ({
      left: `${Math.random() * 100}%`,
      animationDelay: `${Math.random() * 15}s`,
      animationDuration: `${15 + Math.random() * 10}s`
    }));
  }, []);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    const glitchInterval = setInterval(() => {
      setGlitchActive(true);
      setTimeout(() => setGlitchActive(false), 150);
    }, 4000);
    return () => clearInterval(glitchInterval);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleSections((prev) => new Set(prev).add(entry.target.id));
          }
        });
      },
      { threshold: 0.1 }
    );

    const sections = document.querySelectorAll('section[id]');
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  const features = [
    { icon: "⟨⟩", title: "INSTANT_BOOKING", desc: "Real-time calendar sync. Zero double bookings. Quantum-level precision." },
    { icon: "◈", title: "QUERY_RESOLVE", desc: "Answers FAQs at light speed. No human needed. Total autonomy." },
    { icon: "◇", title: "LEAD_CAPTURE", desc: "Qualifies leads. Routes to CRM. Never loses a prospect." },
    { icon: "⬡", title: "AUTO_FOLLOWUP", desc: "Reminders. Confirmations. Follow-ups. All automated." },
    { icon: "◉", title: "VOICE_HUMANITY", desc: "100% human sound. Warm. Natural. Indistinguishable." },
    { icon: "⬢", title: "SMART_ROUTE", desc: "Detects urgency. Escalates instantly. Never loses critical calls." },
  ];

  const faqs = [
    { q: "How natural is the AI voice?", a: "In blind tests, 92% couldn't distinguish from human. The voice adapts tone, pace, and warmth based on conversation flow." },
    { q: "Can it handle complex scheduling?", a: "Multi-team calendars. Recurring appointments. Custom rules. All handled automatically." },
    { q: "What about urgent situations?", a: "Recognizes urgency keywords. Follows your escalation protocols. Transfers to on-call staff instantly." },
    { q: "Languages supported?", a: "English and Hindi. Auto-detects caller language. Switches seamlessly mid-conversation." },
    { q: "Integration capabilities?", a: "Zoho, HubSpot, Google Workspace, custom CRMs. Bi-directional sync. Setup in hours." },
    { q: "Setup time?", a: "2-3 hours to full operation. We handle integration and AI training. 30-day success manager included." },
  ];

  const testimonials = [
    { name: "Rajesh Mehta", role: "CEO, TechScale", quote: "67% more conversions. Every call answered. Total game changer.", metric: "+67%" },
    { name: "Priya Sharma", role: "Ops Head, GrowthBox", quote: "Automated everything. Team focuses on closing, not answering phones.", metric: "₹8L/mo" },
    { name: "Amit Verma", role: "Founder, QuickServ", quote: "90% faster response. Best investment this year.", metric: "90%" },
  ];

  const lostRevenue = stats.calls * stats.value * (stats.missRate / 100) * 260;

  return (
    <div className={styles['neon-shadow-container']}>
      <div className={styles.scanlines} />
      
      {isClient && particleStyles.map((style, i) => (
        <div key={i} className={styles['float-particle']} style={style} />
      ))}

      <nav className={styles.nav}>
        <div className={styles.navInner}>
          <div className={styles.logo}>
            <span className={`${styles.logoText} ${styles['neon-glow']}`}>ELEVIX</span>
            <span className={styles.logoBadge}>AI_VOICE</span>
          </div>
          <div className={styles.navRight}>
            <span className={styles.statusCyan}>SYS:ONLINE</span>
            <span className={styles.statusMagenta}>LAT:4ms</span>
            <a href="/demo" className={`${styles['btn-neon']} ${styles.navCta}`}>TRY_NOW</a>
          </div>
        </div>
      </nav>

      <section className={`${styles.hero} ${styles['grid-bg']}`}>
        <div className={styles.heroGlow}>
          <div className={`${styles['glowOrb']} ${styles['glowOrbCyan']}`} />
          <div className={`${styles['glowOrb']} ${styles['glowOrbMagenta']}`} />
        </div>
        
        <div className={styles.heroContent}>
          <div className={styles.heroBadge}>
            <span className={styles.heroBadgeText}>// VOICE_AGENT_v2.0</span>
          </div>
          
          <h1 
            className={`${styles['glitch-text']} ${styles.heroTitle} ${glitchActive ? styles.glitching : ''}`}
            data-text="STOP LOSING ₹50,000+ EVERY MONTH"
          >
            <span className={styles.heroTitleLine}>STOP LOSING</span>
            <span className={`${styles.heroTitleHighlight} ${styles['neon-glow']}`}>₹50,000+</span>
            <span className={styles.heroTitleLine}>EVERY MONTH</span>
          </h1>
          
          <p className={styles.heroSubtitle}>
            Every missed call = lost revenue. Your 24/7 AI receptionist never sleeps, never misses, always converts.
          </p>
          
          <div className={styles.heroBullets}>
            {['100% Human Voice', '24/7 Availability', '48hr Setup', 'No Lock-in'].map((item, i) => (
              <div key={i} className={styles.bulletItem}>
                <span className={styles.bulletArrow}>▸</span>
                <span>{item}</span>
              </div>
            ))}
          </div>
          
          <div className={styles.heroCTA}>
            <a href="/demo" className={styles['btn-neon']}>
              TRY LIVE DEMO →
            </a>
            <a href="mailto:query@elevix.site" className={`${styles['btn-neon']} ${styles['btn-magenta']}`}>
              CONTACT_US
            </a>
          </div>
          
          <div className={`${styles.heroDemo} ${styles['neon-border']}`}>
            <div className={styles.demoHeader}>
              <div className={styles.demoDot} />
              <span className={styles.demoLabel}>LIVE_TRANSCRIPT</span>
            </div>
            <div className={styles.waveform}>
              {[...Array(30)].map((_, i) => (
                <div
                  key={i}
                  className={styles.waveBar}
                  style={{ animationDelay: `${i * 0.05}s` }}
                />
              ))}
            </div>
            <p className={styles.demoText}>"Hi, I want to book an appointment for tomorrow..."</p>
          </div>
        </div>
      </section>

      <section id="problem" className={`${styles.section} ${styles['fade-in']} ${visibleSections.has('problem') ? styles.visible : ''}`}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <span className={`${styles.sectionLabel} ${styles.sectionLabelMagenta}`}>// THE_PROBLEM</span>
            <h2 className={styles.sectionTitle}>
              <span className={styles.sectionTitleLine}>HIDDEN COST OF</span>
              <span className={`${styles.sectionTitleHighlight} ${styles['magenta-glow']}`}>MISSED_CALLS</span>
            </h2>
          </div>
          
          <div className={styles.grid2}>
            <div className={styles.timeline}>
              {[
                { time: '09:30', label: 'INCOMING_CALL', labelClass: styles.timelineLabelPink, text: 'Customer calls during meeting → voicemail' },
                { time: '10:15', label: 'URGENT_NEED', labelClass: styles.timelineLabelYellow, text: 'Customer ready to pay, needs help NOW' },
                { time: '13:30', label: 'CALL_BACK', labelClass: styles.timelineLabelPink, text: 'Already went to competitor → LOST' },
              ].map((item, i) => (
                <div key={i} className={`${styles.timelineItem} ${styles['neon-border']} ${styles['card-hover']}`}>
                  <span className={styles.timelineTime}>{item.time}</span>
                  <div>
                    <p className={`${styles.timelineLabel} ${item.labelClass}`}>{item.label}</p>
                    <p className={styles.timelineText}>{item.text}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className={`${styles.calculator} ${styles['neon-border']}`}>
              <h3 className={styles.calculatorTitle}>LOSS_CALCULATOR</h3>
              
              <div className={styles.sliderGroup}>
                <div className={styles.sliderHeader}>
                  <span>Calls per day</span>
                  <span className={styles.sliderValue}>{stats.calls}</span>
                </div>
                <input 
                  type="range" 
                  min="5" 
                  max="100" 
                  value={stats.calls}
                  onChange={(e) => setStats({ ...stats, calls: parseInt(e.target.value) })}
                  className={styles.slider}
                />
              </div>
              <div className={styles.sliderGroup}>
                <div className={styles.sliderHeader}>
                  <span>Avg deal value (₹)</span>
                  <span className={styles.sliderValue}>₹{stats.value.toLocaleString()}</span>
                </div>
                <input 
                  type="range" 
                  min="500" 
                  max="50000" 
                  step="500"
                  value={stats.value}
                  onChange={(e) => setStats({ ...stats, value: parseInt(e.target.value) })}
                  className={styles.slider}
                />
              </div>
              <div className={styles.sliderGroup}>
                <div className={styles.sliderHeader}>
                  <span>Miss rate (%)</span>
                  <span className={styles.sliderValue}>{stats.missRate}%</span>
                </div>
                <input 
                  type="range" 
                  min="10" 
                  max="70" 
                  value={stats.missRate}
                  onChange={(e) => setStats({ ...stats, missRate: parseInt(e.target.value) })}
                  className={`${styles.slider} ${styles.sliderMagenta}`}
                />
              </div>
              
              <div className={styles.calculatorResult}>
                <p className={styles.resultLabel}>ANNUAL_LOSS:</p>
                <p className={`${styles.resultValue} ${styles['magenta-glow']}`}>₹{lostRevenue.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="solution" className={`${styles.section} ${styles['fade-in']} ${visibleSections.has('solution') ? styles.visible : ''}`}>
        <div className={styles.heroGlow}>
          <div className={styles['glowOrb']} style={{ width: '600px', height: '600px', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', background: 'rgba(0, 255, 242, 0.03)' }} />
        </div>
        
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <span className={`${styles.sectionLabel} ${styles.sectionLabelCyan}`}>// THE_SOLUTION</span>
            <h2 className={styles.sectionTitle}>
              <span className={`${styles.sectionTitleHighlight} ${styles['neon-glow']}`}>24/7 AI RECEPTIONIST</span>
            </h2>
            <p className={styles.heroSubtitle}>
              Answers every call instantly. Books appointments. Resolves queries. Captures leads. Sounds 100% human.
            </p>
          </div>
          
          <div className={styles.statsGrid}>
            {[
              { value: '<500ms', label: 'Response Time' },
              { value: '24/7', label: 'Availability' },
              { value: '92%', label: 'Human Rating' },
            ].map((stat, i) => (
              <div key={i} className={`${styles.statCard} ${styles['neon-border']} ${styles['card-hover']}`}>
                <p className={`${styles.statValue} ${styles['neon-glow']}`}>{stat.value}</p>
                <p className={styles.statLabel}>{stat.label}</p>
              </div>
            ))}
          </div>
          
          <div className={`${styles.conversationLog} ${styles['neon-border']}`}>
            <div className={styles.conversationHeader}>
              <div className={styles.conversationDot} />
              <span className={styles.conversationLabel}>LIVE_CONVERSATION_LOG</span>
            </div>
            <div className={styles.messageRow}>
              <span className={styles.messageCaller}>[CALLER]</span>
              <span>"Hi, I need to book an appointment for tomorrow..."</span>
            </div>
            <div className={styles.messageRow}>
              <span className={styles.messageAI}>[AI]</span>
              <span>"Of course! I have openings at 11 AM and 3 PM. Which works better?"</span>
              <span className={styles.messageLatency}>380ms</span>
            </div>
            <div className={styles.messageRow}>
              <span className={styles.messageCaller}>[CALLER]</span>
              <span>"3 PM please. What are your charges?"</span>
            </div>
            <div className={styles.messageRow}>
              <span className={styles.messageAI}>[AI]</span>
              <span>"Booked for 3 PM tomorrow. Confirmation SMS sent. Anything else?"</span>
              <span className={styles.messageLatency}>420ms</span>
            </div>
            <div className={styles.messageStatusRow}>
              <span><span className={styles.statusDot} /> BOOKED</span>
              <span><span className={styles.statusDot} /> SMS_SENT</span>
              <span><span className={styles.statusDot} /> CALENDAR_UPDATED</span>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className={`${styles.section} ${styles['fade-in']} ${visibleSections.has('features') ? styles.visible : ''}`}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <span className={`${styles.sectionLabel} ${styles.sectionLabelMagenta}`}>// CAPABILITIES</span>
            <h2 className={styles.sectionTitle}>
              <span className={styles.sectionTitleLine}>SYSTEM</span> <span className={`${styles.sectionTitleHighlight} ${styles['neon-glow']}`}>FEATURES</span>
            </h2>
          </div>
          
          <div className={styles.featuresGrid}>
            {features.map((feature, i) => (
              <div key={i} className={`${styles.featureCard} ${styles['neon-border']} ${styles['card-hover']}`}>
                <div className={styles.featureIcon}>{feature.icon}</div>
                <h3 className={styles.featureTitle}>{feature.title}</h3>
                <p className={styles.featureDesc}>{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="testimonials" className={`${styles.section} ${styles['fade-in']} ${visibleSections.has('testimonials') ? styles.visible : ''}`}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <span className={`${styles.sectionLabel} ${styles.sectionLabelCyan}`}>// VERIFIED_RESULTS</span>
            <h2 className={styles.sectionTitle}>
              <span className={styles.sectionTitleLine}>CLIENT</span> <span className={`${styles.sectionTitleHighlight} ${styles['magenta-glow']}`}>METRICS</span>
            </h2>
          </div>
          
          <div className={styles.testimonialsGrid}>
            {testimonials.map((t, i) => (
              <div key={i} className={`${styles.testimonialCard} ${styles['neon-border']} ${styles['card-hover']}`}>
                <div className={`${styles.testimonialMetric} ${styles['neon-glow']}`}>{t.metric}</div>
                <p className={styles.testimonialQuote}>"{t.quote}"</p>
                <div className={styles.testimonialAuthor}>
                  <p className={styles.testimonialName}>{t.name}</p>
                  <p className={styles.testimonialRole}>{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="pricing" className={`${styles.section} ${styles['fade-in']} ${visibleSections.has('pricing') ? styles.visible : ''}`}>
        <div className={styles.containerXs}>
          <span className={`${styles.sectionLabel} ${styles.sectionLabelMagenta}`}>// INVESTMENT</span>
          <div className={`${styles.pricingCard} ${styles['neon-border']}`}>
            <p className={styles.pricingLabel}>ESTIMATED MONTHLY</p>
            <p className={`${styles.pricingValue} ${styles['neon-glow']}`}>₹5,000 - ₹30,000</p>
            <p className={styles.pricingNote}>Based on call volume and features required</p>
          </div>
        </div>
      </section>

      <section id="faq" className={`${styles.section} ${styles['fade-in']} ${visibleSections.has('faq') ? styles.visible : ''}`}>
        <div className={styles.containerSm}>
          <div className={styles.sectionHeader}>
            <span className={`${styles.sectionLabel} ${styles.sectionLabelCyan}`}>// KNOWLEDGE_BASE</span>
            <h2 className={styles.sectionTitle}>
              <span className={styles.sectionTitleLine}>FAQ</span> <span className={`${styles.sectionTitleHighlight} ${styles['neon-glow']}`}>MODULE</span>
            </h2>
          </div>
          
          <div className={styles.faqContainer}>
            {faqs.map((faq, i) => (
              <div key={i} className={`${styles.faqItem} ${styles['neon-border']}`}>
                <button
                  className={styles.faqButton}
                  onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                >
                  <span className={styles.faqQuestion}>{faq.q}</span>
                  <span className={`${styles.faqArrow} ${activeFaq === i ? styles.open : ''}`}>▼</span>
                </button>
                {activeFaq === i && (
                  <div className={styles.faqAnswer}>{faq.a}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.ctaSection}>
        <div className={styles.ctaGlow}>
          <div className={styles.ctaGlowOrb} />
        </div>
        
        <div className={styles.ctaContent}>
          <h2 className={styles.ctaTitle}>
            <span className={styles.sectionTitleLine}>READY TO</span>
            <span className={`${styles.sectionTitleHighlight} ${styles['neon-glow']}`}>START?</span>
          </h2>
          <p className={styles.ctaSubtitle}>Experience the AI now. No signup required.</p>
          <div className={styles.ctaButtons}>
            <a href="/demo" className={styles['btn-neon']}>TRY NOW →</a>
            <a href="mailto:query@elevix.site" className={`${styles['btn-neon']} ${styles['btn-magenta']}`}>CONTACT</a>
          </div>
        </div>
      </section>

      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <p className={styles.footerText}>© {new Date().getFullYear()} ELEVIX_AI. All rights reserved.</p>
          <p className={styles.footerSubtext}>SYSTEM_STATUS: OPERATIONAL | REGION: US-EAST-1</p>
        </div>
      </footer>
    </div>
  );
}
